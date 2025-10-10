import { Message } from "./message";

export interface Conversation {
  conversationId: number;
  type: string;
  name: string;
  createdBy: number;
  participants: number[];
  createdAt: string;
  messages: Message[];
}
