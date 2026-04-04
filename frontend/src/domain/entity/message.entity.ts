import { Book } from "./book.entity";
import { MessageSender } from "./message-sender.enum";
import { User } from "./user.entity";

export interface Message {
    id?: number;
    user?: User | null;
    sender: MessageSender;
    content: string;
    relatedBook?: Book | null;
    createdAt?: string | Date; // LocalDateTime từ Backend thường trả về ISO String
}