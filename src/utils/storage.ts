import type { ChatSession } from "../types/chat";

const STORAGE_KEY = "empathiq_chat_sessions";

export const saveChatSession = (session: ChatSession): void => {
  const sessions = getChatSessions();
  const existingIndex = sessions.findIndex((s) => s.id === session.id);

  if (existingIndex >= 0) {
    sessions[existingIndex] = session;
  } else {
    sessions.push(session);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
};

export const getChatSessions = (): ChatSession[] => {
  const sessions = localStorage.getItem(STORAGE_KEY);
  return sessions ? JSON.parse(sessions) : [];
};

export const getChatSession = (id: string): ChatSession | null => {
  const sessions = getChatSessions();
  return sessions.find((session) => session.id === id) || null;
};

export const deleteChatSession = (id: string): void => {
  const sessions = getChatSessions();
  const filteredSessions = sessions.filter((session) => session.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredSessions));
};
