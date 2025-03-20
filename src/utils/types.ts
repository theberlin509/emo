
export interface ChatProfile {
  id: string;
  name: string;
  role: string;
  description: string;
  imageUrl: string | null;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

export interface Chat {
  id: string;
  profileId: string;
  messages: ChatMessage[];
  lastMessageTimestamp: number;
}

export interface User {
  id: string;
  username: string;
  password: string;
  createdAt: number;
}
