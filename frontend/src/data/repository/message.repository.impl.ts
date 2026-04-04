import { Message } from "@/src/domain/entity/message.entity";
import { MessageRepository } from "@/src/domain/repository/message.repository";
import { MessageResponsePageResponse, MessageResponseProto, MessageResponseProtoList } from "@/src/generated/schema";
import { BaseRepositoryImpl } from "./base.repository.impl";

export class MessageRepositoryImpl extends BaseRepositoryImpl<Message> implements MessageRepository {
  protected listProto = MessageResponseProtoList;
  protected proto = MessageResponseProto;

  protected pageProto = MessageResponsePageResponse;

  constructor() {
    super('api/messages');
  }
  async getMessagesByUser(userId: number): Promise<Message[]> {
    try {
      // 1. Call the endpoint defined in your Kotlin Controller
      const response = await this.api.get(`/${this.endpoint}/user/${userId}`);

      // 2. Decode the response data (ArrayBuffer) using the List Proto
      // This corresponds to: message MessageResponseProtoList { repeated MessageResponseProto data = 1; }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoded = this.listProto.decode(new Uint8Array(response.data)) as any;

      // 3. Return the 'data' field which contains the array of messages
      // We use || [] to handle cases where the list might be empty/null
      return decoded.data || [];
    } catch (error) {
      console.error(`Error fetching chat history for user ${userId}:`, error);
      return [];
    }
  }
  /**
   * Endpoint: POST /api/messages/chat
   * Gửi tin nhắn người dùng và nhận phản hồi từ AI dưới dạng Protobuf
   */
  async request(message: Message): Promise<Message> {
    // 1. Map từ Entity (Frontend) sang Proto Structure (MessageResponseProto)
    const payload: MessageResponseProto = {
      id: message.id,
      content: message.content,
      // Chuyển đổi User Entity sang UserProto (chỉ gửi thông tin cần thiết)
      user: message.user ? {
        id: message.user.id,
        username: message.user.username,
        email: message.user.email,
        fullName: message.user.fullName,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        role: message.user.role as any // Ép kiểu khớp với Enum của Proto
      } : undefined,

      // Sender: Backend sẽ mặc định hiểu là USER từ client gửi lên
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sender: message.sender as any,

      // Chuyển đổi Book Entity sang BookProto nếu có
      relatedBook: message.relatedBook ? {
        id: message.relatedBook.id,
        title: message.relatedBook.title,
        price: message.relatedBook.price.toString(), // Proto định nghĩa price là string để tránh lỗi số lớn
        description: message.relatedBook.description
      } : undefined,

      // Chuyển Date sang String ISO nếu cần thiết
      createdAt: message.createdAt instanceof Date
        ? message.createdAt.toISOString()
        : message.createdAt
    };
    // 2. Encode sang Binary
    const buffer = this.proto.encode(payload).finish();

    // 3. Thực hiện gọi API qua axios instance từ BaseRepositoryImpl
    const response = await this.api.post(`/${this.endpoint}/chat`, buffer, {
      headers: { 'Content-Type': 'application/x-protobuf' }
    });

    // 4. Decode kết quả trả về từ AI
    const decoded = this.proto.decode(new Uint8Array(response.data));

    // Ép kiểu về Entity Message của Frontend
    return decoded as unknown as Message;
  }

  /**
   * Endpoint: POST /api/messages/train
   * Kích hoạt tiến trình huấn luyện. 
   * Backend trả về 204 No Content, log sẽ được đẩy qua WebSocket.
   */
  async training(): Promise<null> {
    await this.api.post(`/${this.endpoint}/train`, null, {
      // Ghi đè responseType nếu cần, nhưng 204 thường không có body
      responseType: 'text'
    });
    return null;
  }
}