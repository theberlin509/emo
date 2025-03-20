
import { Chat, ChatProfile, User } from './types';

const PROFILES_KEY = 'emotica_profiles';
const CHATS_KEY = 'emotica_chats';
const API_KEY = 'emotica_api_key';
const USER_KEY = 'emotica_user';

// Stockage des profils
export const getProfiles = (): ChatProfile[] => {
  const data = localStorage.getItem(PROFILES_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveProfiles = (profiles: ChatProfile[]): void => {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
};

export const addProfile = (profile: ChatProfile): void => {
  const profiles = getProfiles();
  saveProfiles([...profiles, profile]);
};

export const updateProfile = (profile: ChatProfile): void => {
  const profiles = getProfiles();
  const index = profiles.findIndex((p) => p.id === profile.id);
  if (index >= 0) {
    profiles[index] = profile;
    saveProfiles(profiles);
  }
};

export const deleteProfile = (profileId: string): void => {
  const profiles = getProfiles();
  saveProfiles(profiles.filter((p) => p.id !== profileId));
  
  // Supprimer également les chats associés
  const chats = getChats();
  saveChats(chats.filter((c) => c.profileId !== profileId));
};

// Stockage des chats
export const getChats = (): Chat[] => {
  const data = localStorage.getItem(CHATS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveChats = (chats: Chat[]): void => {
  localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
};

export const getChatByProfileId = (profileId: string): Chat | undefined => {
  const chats = getChats();
  return chats.find((c) => c.profileId === profileId);
};

export const saveChat = (chat: Chat): void => {
  const chats = getChats();
  const index = chats.findIndex((c) => c.id === chat.id);
  
  if (index >= 0) {
    chats[index] = chat;
  } else {
    chats.push(chat);
  }
  
  saveChats(chats);
};

export const deleteChat = (chatId: string): void => {
  const chats = getChats();
  saveChats(chats.filter((c) => c.id !== chatId));
};

// Clé API
export const getApiKey = (): string | null => {
  return localStorage.getItem(API_KEY);
};

export const saveApiKey = (key: string): void => {
  localStorage.setItem(API_KEY, key);
};

export const clearApiKey = (): void => {
  localStorage.removeItem(API_KEY);
};

// Gestion de l'authentification utilisateur
export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const loginUser = (username: string, password: string): User | null => {
  const existingUser = getUserByUsername(username);
  
  if (existingUser && existingUser.password === password) {
    localStorage.setItem(USER_KEY, JSON.stringify(existingUser));
    return existingUser;
  }
  
  return null;
};

export const registerUser = (username: string, password: string): User => {
  const users = getAllUsers();
  const existingUser = users.find(u => u.username === username);
  
  if (existingUser) {
    throw new Error('Nom d\'utilisateur déjà pris');
  }
  
  const newUser: User = {
    id: Date.now().toString(),
    username,
    password,
    createdAt: Date.now()
  };
  
  users.push(newUser);
  localStorage.setItem('emotica_users', JSON.stringify(users));
  localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  
  return newUser;
};

export const logoutUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

export const getAllUsers = (): User[] => {
  const data = localStorage.getItem('emotica_users');
  return data ? JSON.parse(data) : [];
};

export const getUserByUsername = (username: string): User | undefined => {
  const users = getAllUsers();
  return users.find(u => u.username === username);
};
