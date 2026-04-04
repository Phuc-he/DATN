package org.datn.backend.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.reactive.function.client.WebClient

@Configuration
class AiConfig {
    @Bean
    fun webClient(): WebClient = WebClient.builder()
        .baseUrl("http://localhost:11434") // Địa chỉ Ollama của bạn
        .build()
}