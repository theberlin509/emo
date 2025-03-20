
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Chat, ChatMessage, ChatProfile } from '../utils/types';
import { 
  getProfiles, 
  saveProfiles, 
  getChats, 
  saveChats, 
  saveChat,
  getChatByProfileId,
  deleteProfile as deleteStorageProfile,
  deleteChat as deleteStorageChat
} from '../utils/storage';
import { generateChatResponse } from '../utils/apiService';
import { useToast } from '@/components/ui/use-toast';

interface ChatContextProps {
  profiles: ChatProfile[];
  activeProfile: ChatProfile | null;
  activeChat: Chat | null;
  isLoading: boolean;
  createProfile: (profile: Omit<ChatProfile, 'id' | 'createdAt'>) => Promise<ChatProfile>;
  updateProfile: (profile: ChatProfile) => void;
  deleteProfile: (profileId: string) => void;
  setActiveProfile: (profileId: string | null) => void;
  sendMessage: (content: string) => Promise<void>;
  clearChat: (profileId: string) => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext doit être utilisé à l\'intérieur d\'un ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [profiles, setProfiles] = useState<ChatProfile[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Obtenir le profil actif et le chat
  const activeProfile = activeProfileId 
    ? profiles.find(p => p.id === activeProfileId) || null 
    : null;
    
  const activeChat = activeProfile 
    ? chats.find(c => c.profileId === activeProfile.id) || null 
    : null;

  // Charger les profils et les chats depuis le stockage local
  useEffect(() => {
    setProfiles(getProfiles());
    setChats(getChats());
  }, []);

  // Mettre à jour le stockage local lorsque les profils changent
  useEffect(() => {
    if (profiles.length > 0) {
      saveProfiles(profiles);
    }
  }, [profiles]);

  // Mettre à jour le stockage local lorsque les chats changent
  useEffect(() => {
    if (chats.length > 0) {
      saveChats(chats);
    }
  }, [chats]);

  const createProfile = async (profileData: Omit<ChatProfile, 'id' | 'createdAt'>): Promise<ChatProfile> => {
    const newProfile: ChatProfile = {
      ...profileData,
      id: uuidv4(),
      createdAt: Date.now()
    };
    
    setProfiles(prev => [...prev, newProfile]);
    
    // Créer un chat vide pour ce profil
    const newChat: Chat = {
      id: uuidv4(),
      profileId: newProfile.id,
      messages: [],
      lastMessageTimestamp: Date.now()
    };
    
    setChats(prev => [...prev, newChat]);
    saveChat(newChat);
    
    toast({
      title: "Profil créé",
      description: `${newProfile.name} a été ajouté à vos conversations.`,
    });
    
    return newProfile;
  };

  const updateProfile = (profile: ChatProfile) => {
    setProfiles(prev => 
      prev.map(p => p.id === profile.id ? profile : p)
    );
    
    toast({
      title: "Profil mis à jour",
      description: `Les informations de ${profile.name} ont été mises à jour.`,
    });
  };

  const deleteProfile = (profileId: string) => {
    // Récupérer le nom du profil avant la suppression
    const profileName = profiles.find(p => p.id === profileId)?.name || "Le profil";
    
    setProfiles(prev => prev.filter(p => p.id !== profileId));
    setChats(prev => prev.filter(c => c.profileId !== profileId));
    
    if (activeProfileId === profileId) {
      setActiveProfileId(null);
    }
    
    deleteStorageProfile(profileId);
    toast({
      title: "Profil supprimé",
      description: `${profileName} et toutes ses conversations ont été supprimés.`,
    });
  };

  const setActiveProfile = (profileId: string | null) => {
    setActiveProfileId(profileId);
  };

  const sendMessage = async (content: string) => {
    if (!activeProfile || content.trim() === '') return;
    
    try {
      setIsLoading(true);
      
      // Trouver ou créer un chat pour ce profil
      let chat = chats.find(c => c.profileId === activeProfile.id);
      const now = Date.now();
      
      if (!chat) {
        chat = {
          id: uuidv4(),
          profileId: activeProfile.id,
          messages: [],
          lastMessageTimestamp: now
        };
      }
      
      // Ajouter le message de l'utilisateur
      const userMessage: ChatMessage = {
        id: uuidv4(),
        content,
        role: 'user',
        timestamp: now
      };
      
      const updatedMessages = [...chat.messages, userMessage];
      
      // Mettre à jour le chat avec le message de l'utilisateur
      const updatedChat: Chat = {
        ...chat,
        messages: updatedMessages,
        lastMessageTimestamp: now
      };
      
      setChats(prev => {
        const index = prev.findIndex(c => c.profileId === activeProfile.id);
        if (index >= 0) {
          return [
            ...prev.slice(0, index),
            updatedChat,
            ...prev.slice(index + 1)
          ];
        }
        return [...prev, updatedChat];
      });
      
      saveChat(updatedChat);
      
      try {
        // Générer la réponse IA
        const aiResponse = await generateChatResponse(updatedMessages, activeProfile);
        
        // Ajouter le message IA
        const aiMessage: ChatMessage = {
          id: uuidv4(),
          content: aiResponse,
          role: 'assistant',
          timestamp: Date.now()
        };
        
        const finalChat: Chat = {
          ...updatedChat,
          messages: [...updatedMessages, aiMessage],
          lastMessageTimestamp: Date.now()
        };
        
        setChats(prev => {
          const index = prev.findIndex(c => c.profileId === activeProfile.id);
          if (index >= 0) {
            return [
              ...prev.slice(0, index),
              finalChat,
              ...prev.slice(index + 1)
            ];
          }
          return [...prev, finalChat];
        });
        
        saveChat(finalChat);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de générer une réponse. Veuillez vérifier votre clé API.",
        });
        console.error('Erreur IA:', error);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Échec de l'envoi du message. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = (profileId: string) => {
    const chatToUpdate = chats.find(c => c.profileId === profileId);
    
    if (chatToUpdate) {
      const updatedChat = {
        ...chatToUpdate,
        messages: [],
        lastMessageTimestamp: Date.now()
      };
      
      setChats(prev => 
        prev.map(c => c.profileId === profileId ? updatedChat : c)
      );
      
      saveChat(updatedChat);
      
      toast({
        title: "Conversation effacée",
        description: "Tous les messages ont été supprimés de cette conversation.",
      });
    }
  };

  const contextValue: ChatContextProps = {
    profiles,
    activeProfile,
    activeChat,
    isLoading,
    createProfile,
    updateProfile,
    deleteProfile,
    setActiveProfile,
    sendMessage,
    clearChat
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};
