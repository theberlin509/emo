
import { Chat, ChatMessage, ChatProfile } from './types';

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const getSystemPrompt = (profile: ChatProfile): string => {
  return `Vous êtes ${profile.name}, jouant le rôle de ${profile.role}. ${profile.description}
  
Votre objectif est de fournir un soutien moral et de répondre en tant que ce personnage.
Restez toujours dans le personnage et répondez d'une manière qui correspond à la description fournie.
Soyez empathique, encourageant et utile dans vos réponses.
`;
};

export const generateChatResponse = async (
  messages: ChatMessage[],
  profile: ChatProfile
): Promise<string> => {
  try {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    
    if (!apiKey) {
      throw new Error('API key is not configured');
    }
    
    const formattedMessages = [
      {
        role: 'system',
        content: getSystemPrompt(profile)
      },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Emotica',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat',
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      
      if (response.status === 401) {
        throw new Error('Invalid API key or authentication failed');
      }
      
      throw new Error(`API Error: ${errorData.error?.message || errorData.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
};
