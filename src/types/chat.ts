export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
  timestamp: number;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}
