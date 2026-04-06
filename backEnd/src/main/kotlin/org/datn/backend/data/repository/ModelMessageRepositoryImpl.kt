package org.datn.backend.data.repository

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.flow.flowOn
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.withContext
import org.datn.backend.domain.entity.Message
import org.datn.backend.domain.entity.MessageSender
import org.datn.backend.domain.repository.MessageRepository
import org.datn.backend.domain.repository.ModelMessageRepository
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Repository
import org.springframework.web.reactive.function.client.WebClient
import java.io.BufferedReader
import java.io.File
import java.io.InputStreamReader
import java.nio.charset.StandardCharsets
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

@Repository
class ModelMessageRepositoryImpl(
    private val webClient: WebClient,
    private val messageRepository: MessageRepository,
) : ModelMessageRepository {
    private val logger = LoggerFactory.getLogger(ModelMessageRepositoryImpl::class.java)

    override suspend fun request(message: Message): Message {
        val requestBody =
            mapOf(
                "model" to "sach-bot",
                "messages" to
                    listOf(
                        mapOf("role" to "user", "content" to message.content),
                    ),
                "stream" to false,
            )

        // Gọi API Ollama bất đồng bộ
        val response =
            webClient
                .post()
                .uri("/api/chat")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map::class.java)
                .awaitSingle() // Đây là nơi cần kotlinx-coroutines-reactor

        // Xử lý dữ liệu trả về (ép kiểu an toàn)
        val messageMap = response["message"] as? Map<*, *>
        val aiContent = messageMap?.get("content")?.toString() ?: "No response"

        val aiMessage =
            Message(
                user = message.user,
                sender = MessageSender.AI,
                content = aiContent,
            )

        return messageRepository.save(aiMessage)
    }

    override suspend fun training(data: List<String>) =
        callbackFlow {
            runCatching {
                val directory = File("training_data")
                if (!directory.exists()) directory.mkdirs()

                // 2. Tạo tên file dựa trên timestamp để tránh ghi đè
                val timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"))
                val fileName = "training_data/book_consultant_$timestamp.jsonl"
                val file = File(fileName)

                // 3. Ghi dữ liệu theo định dạng JSONL (Qwen/Llama standard)
                file.printWriter().use { out ->
                    data.forEach { text ->
                        out.println(text)
                    }
                }

                "--- Đã xuất ${data.size} mẫu dữ liệu huấn luyện ra file: $fileName ---".let {
                    logger.info(it)
                    trySend(it)
                }

                generateModelFile(file)
                "--- Modelfile đã được cập nhật với tri thức mới! ---".let {
                    logger.info(it)
                    trySend(it)
                }

                updateOllamaModelViaCLI {
                    trySend(it)
                }
            }.onFailure {
                logger.error("", it)
                trySend("Lỗi ${it.message}")
            }

            awaitClose { }
        }.flowOn(Dispatchers.IO)

    /**
     * Hàm hỗ trợ tạo Modelfile từ dữ liệu training đã có
     */
    private fun generateModelFile(jsonlFile: File) {
        // 1. Đọc tối đa 50 dòng cuối từ file jsonl để tránh làm Modelfile quá nặng
        // (Trong thực tế DATN, bạn chỉ nên đưa các tri thức quan trọng nhất vào SYSTEM prompt)
        val trainingContent =
            jsonlFile.useLines { lines ->
                lines
                    .map { line ->
                        runCatching {
                            // Sử dụng Regex để lấy cả 'input' và 'output' để AI có đầy đủ tri thức
                            // Pattern này trích xuất nội dung giữa các dấu ngoặc kép của key tương ứng
                            val inputMatch = Regex(""" "input":\s*"(.*?)" """.trim()).find(line)?.groupValues?.get(1) ?: ""
                            val outputMatch = Regex(""" "output":\s*"(.*?)" """.trim()).find(line)?.groupValues?.get(1) ?: ""

                            // Kết hợp lại thành một câu khẳng định để AI dễ hiểu
                            "$inputMatch -> $outputMatch"
                        }.getOrDefault("")
                    }.filter { it.isNotBlank() }
                    .joinToString(separator = "\n") // Dùng xuống dòng để phân tách rõ các thực thể
            }

        // 2. Định nghĩa nội dung Modelfile
        val modelFileContent =
            """
            FROM qwen2.5:3b
            PARAMETER temperature 0.1
            SYSTEM ""${'"'}
            Bạn là trợ lý ảo của nhà sách DATN. Bạn có nhiệm vụ tư vấn khách hàng dựa trên dữ liệu thật sau đây.
            Nếu thông tin khách hỏi nằm trong danh sách này, bạn PHẢI trả lời chính xác.
            Nếu không có, hãy nói bạn chưa có thông tin đó.

            DANH SÁCH TRI THỨC CỦA HỆ THỐNG:
            $trainingContent
            ""${'"'}
            """.trimIndent()

        // 3. Ghi ra file vật lý
        File("Modelfile").writeText(modelFileContent, StandardCharsets.UTF_8)
    }

    /**
     * Thực thi lệnh CLI để yêu cầu Ollama tạo/cập nhật Model từ Modelfile
     */
    private suspend fun updateOllamaModelViaCLI(
        modelName: String = "sach-bot",
        onMessage: (String) -> Unit,
    ) {
        withContext(Dispatchers.IO) {
            runCatching {
                onMessage("--- Đang bắt đầu cập nhật mô hình AI: $modelName ---")
                val ollamaPath =
                    if (System.getProperty("os.name").contains("Windows")) {
                        "${System.getProperty("user.home")}\\AppData\\Local\\Programs\\Ollama\\ollama.exe"
                    } else {
                        "/usr/local/bin/ollama"
                    }

                // Lệnh thực thi: ollama create <tên_model> -f Modelfile
                val processBuilder =
                    ProcessBuilder(ollamaPath, "create", modelName, "-f", "Modelfile").apply {
                        redirectErrorStream(true)
                    }

                val process = processBuilder.start()

                // Đọc log xuất ra từ Ollama để theo dõi tiến độ (ví dụ: chuyển layer, nạp trọng số)
                val reader = BufferedReader(InputStreamReader(process.inputStream))
                var line: String?
                while (reader.readLine().also { line = it } != null) {
                    onMessage("[Ollama CLI]: $line")
                }

                val exitCode = process.waitFor()
                if (exitCode == 0) {
                    onMessage("--- Cập nhật mô hình $modelName THÀNH CÔNG! ---")
                } else {
                    onMessage("--- Cập nhật thất bại. Mã lỗi: $exitCode ---")
                }
            }.onFailure {
                onMessage("Lỗi khi gọi Ollama CLI: ${it.message}")
            }
        }
    }
}
