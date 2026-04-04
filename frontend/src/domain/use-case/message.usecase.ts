import { Message } from "../entity/message.entity";
import { MessageRepository } from "../repository/message.repository";
import { PaginatedResult } from '@/src/domain/entity/paginated.result';
import { Constants } from '@/src/shared/constans';

/**
 * Use Case: Tạo mới một tin nhắn (Thủ công hoặc từ Admin)
 */
export class CreateMessageUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  async execute(message: Message): Promise<Message> {
    if (!message.content || message.content.trim() === "") {
      throw new Error("Nội dung tin nhắn không được để trống");
    }
    
    // Đảm bảo message có các trường bắt buộc trước khi lưu
    const result = await this.messageRepository.create(message);
    if (!result) {
      throw new Error("Không thể tạo tin nhắn mới");
    }
    return result;
  }
}

/**
 * Use Case: Cập nhật thông tin tin nhắn (Nội dung, trạng thái, hoặc sách liên quan)
 */
export class UpdateMessageUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  /**
   * @param id ID của tin nhắn cần cập nhật
   * @param updates Object chứa các field cần thay đổi (Partial)
   */
  async execute(id: number, updates: Partial<Message>): Promise<Message> {
    // Kiểm tra xem tin nhắn có tồn tại hay không trước khi update (tùy thuộc vào Repo logic)
    const updatedMessage = await this.messageRepository.update(id, updates);
    
    if (!updatedMessage) {
      throw new Error(`Không tìm thấy hoặc không thể cập nhật tin nhắn với ID ${id}`);
    }
    
    return updatedMessage;
  }
}

/**
 * Use Case: Gửi tin nhắn và nhận phản hồi từ AI
 */
export class RequestMessageUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  async execute(message: Message): Promise<Message> {
    if (!message.content || message.content.trim() === "") {
      throw new Error("Nội dung tin nhắn không được để trống");
    }
    return this.messageRepository.request(message);
  }
}

/**
 * Use Case: Kích hoạt quá trình huấn luyện AI từ dữ liệu hệ thống
 */
export class TrainAiModelUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  async execute(): Promise<null> {
    // Logic này sẽ gọi API để Backend bắt đầu tổng hợp 
    // Books, Authors, Vouchers vào mô hình
    return this.messageRepository.training();
  }
}

/**
 * Use Case: Lấy danh sách lịch sử tin nhắn phân trang
 */
export class GetMessagesByPageUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  async execute(
    page: number = Constants.PAGE,
    limit: number = Constants.LIMIT,
  ): Promise<PaginatedResult<Message>> {
    return this.messageRepository.findByPage(page, limit);
  }
}

/**
 * Use Case: Tìm kiếm trong lịch sử tin nhắn
 */
export class SearchMessagesUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  async execute(
    query: string,
    page: number = Constants.PAGE,
    limit: number = Constants.LIMIT,
  ): Promise<PaginatedResult<Message>> {
    return this.messageRepository.search(query, page, limit);
  }
}

/**
 * Use Case: Xóa tin nhắn (Lịch sử chat)
 */
export class DeleteMessageUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  async execute(id: number): Promise<boolean> {
    const deleted = await this.messageRepository.delete(id);
    if (!deleted) {
      throw new Error(`Không thể xóa tin nhắn với ID ${id}`);
    }
    return deleted;
  }
}

export class GetMessagesByUserUseCase {
  constructor(private messageRepository: MessageRepository) {}

  async execute(userId: number): Promise<Message[]> {
    if (!userId) return [];
    return await this.messageRepository.getMessagesByUser(userId);
  }
}