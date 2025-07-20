import { TMessageJSON, TParticipant } from "../../api-types";

const API_BASE = 'https://dummy-chat-server.tribechat.com/api';

export interface ServerInfo {
  sessionUuid: string;
  apiVersion: number;
}

class ChatAPI {
  private async fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  // Server info
  async getServerInfo(): Promise<ServerInfo> {
    return this.fetchAPI<ServerInfo>('/info');
  }

  // Messages
  async getAllMessages(): Promise<TMessageJSON[]> {
    return this.fetchAPI<TMessageJSON[]>('/messages/all');
  }

  async getLatestMessages(): Promise<TMessageJSON[]> {
    return this.fetchAPI<TMessageJSON[]>('/messages/latest');
  }

  async getOlderMessages(refMessageUuid: string): Promise<TMessageJSON[]> {
    return this.fetchAPI<TMessageJSON[]>(`/messages/older/${refMessageUuid}`);
  }

  async getMessageUpdates(time: number): Promise<TMessageJSON[]> {
    return this.fetchAPI<TMessageJSON[]>(`/messages/updates/${time}`);
  }

  async sendMessage(text: string): Promise<TMessageJSON> {
    return this.fetchAPI<TMessageJSON>('/messages/new', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  // Participants
  async getAllParticipants(): Promise<TParticipant[]> {
    return this.fetchAPI<TParticipant[]>('/participants/all');
  }

  async getParticipantUpdates(time: number): Promise<TParticipant[]> {
    return this.fetchAPI<TParticipant[]>(`/participants/updates/${time}`);
  }
}

export const chatAPI = new ChatAPI();