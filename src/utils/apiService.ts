
import { Chat, ChatMessage, ChatProfile } from './types';

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// La clé API est maintenant codée en dur directement dans le code
const API_KEY = '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';

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
    // Utilisation de la clé API codée en dur
    
    // Format messages for the API
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
        'Authorization': `Bearer ${API_KEY}`,
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
      console.error('Erreur API:', errorData);
      
      // Throw a more specific error for authentication issues
      if (response.status === 401) {
        throw new Error('Clé API invalide. Veuillez vérifier votre configuration de clé API OpenRouter.');
      }
      
      throw new Error(`API Error: ${errorData.error?.message || errorData.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Erreur lors de la génération de la réponse:', error);
    throw error;
  }
};
