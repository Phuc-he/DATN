import { Message } from "../entity/message.entity";
import { BaseRepository } from "./base.repository";

export abstract class MessageRepository extends BaseRepository<Message, number> {
  abstract getMessagesByUser(userId: number): Promise<Message[]>; 
  abstract request(message: Message): Promise<Message>;
  abstract training(): Promise<null>;
}
