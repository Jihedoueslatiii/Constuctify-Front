
import { Conversation } from './conversation';
import { MessageStatus } from './message-status';
import { MessageType } from './message-type';

export interface Message {
  messageId: number;
  senderId: number;
  content: string;
  mediaUrl: string;
  type: MessageType;
  status: MessageStatus;
  timestamp: string;
  isDeleted: boolean;
  conversation: Conversation;
  taggedUsers: number[];
  isPinned: boolean;
  editHistory: string[];
  lastEditedAt: string;
  lastEditedBy: number;
  deletedAt: string;
  deletedBy: number;
  isHateSpeech:Boolean;

}
