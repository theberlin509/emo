
import React from 'react';
import { useChatContext } from '@/contexts/ChatContext';
import ChatItem from './ChatItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserPlus } from 'lucide-react';

const ChatList: React.FC = () => {
  const { profiles, activeProfile } = useChatContext();

  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 sm:px-6 py-8 sm:py-10 text-center animate-fade-in">
        <div className="rounded-full bg-primary/10 p-4 sm:p-6 mb-4">
          <UserPlus className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
        </div>
        <h3 className="text-base sm:text-lg font-medium mb-2">Aucune conversation</h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xs">
          Créez votre premier personnage pour démarrer une conversation
        </p>
      </div>
    );
  }

  // Trier les profils par date de création, du plus récent au plus ancien
  const sortedProfiles = [...profiles].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <ScrollArea className="h-full">
      <div className="p-2 space-y-1">
        {sortedProfiles.map((profile) => (
          <ChatItem
            key={profile.id}
            id={profile.id}
            name={profile.name}
            role={profile.role}
            imageUrl={profile.imageUrl}
            lastActive={profile.createdAt}
            isActive={activeProfile?.id === profile.id}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default ChatList;
