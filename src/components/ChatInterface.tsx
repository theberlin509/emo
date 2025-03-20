
import React, { useRef, useEffect, useState } from 'react';
import { useChatContext } from '@/contexts/ChatContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { LoaderCircle, Send, SidebarOpen, SidebarClose, Trash2 } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatInterfaceProps {
  toggleSidebar: () => void;
}

// Composant pour l'animation d'écriture
const TypingIndicator = () => (
  <div className="typing-indicator">
    <span className="typing-indicator-dot"></span>
    <span className="typing-indicator-dot"></span>
    <span className="typing-indicator-dot"></span>
  </div>
);

const ChatInterface: React.FC<ChatInterfaceProps> = ({ toggleSidebar }) => {
  const { activeProfile, activeChat, isLoading, sendMessage, clearChat } = useChatContext();
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect(() => {
    scrollToBottom();
  }, [activeChat, isTyping]);
  
  // Effet pour simuler l'animation d'écriture
  useEffect(() => {
    if (isLoading) {
      setIsTyping(true);
    } else {
      // Garder l'animation d'écriture pendant un court instant après la réponse
      const timeout = setTimeout(() => setIsTyping(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [isLoading]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && activeProfile) {
      await sendMessage(message);
      setMessage('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };
  
  const handleToggleSidebar = () => {
    toggleSidebar();
    setShowSidebar(!showSidebar);
  };
  
  const handleClearChat = () => {
    if (activeProfile) {
      clearChat(activeProfile.id);
    }
  };
  
  if (!activeProfile) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 sm:p-6 text-center animate-fade-in">
        <div className="max-w-md space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Bienvenue sur Emotica</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Créez ou sélectionnez un personnage sur la gauche pour commencer à discuter.
          </p>
          {isMobile && !showSidebar && (
            <Button onClick={handleToggleSidebar} variant="outline" className="mt-4 w-full sm:w-auto">
              <SidebarOpen className="h-4 w-4 mr-2" />
              Afficher les personnages
            </Button>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* En-tête avec les informations du profil */}
      <div className="border-b p-3 sm:p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={handleToggleSidebar} className="md:hidden">
              {showSidebar ? <SidebarClose className="h-5 w-5" /> : <SidebarOpen className="h-5 w-5" />}
            </Button>
          )}
          <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
            <AvatarImage src={activeProfile.imageUrl || undefined} alt={activeProfile.name} />
            <AvatarFallback>{activeProfile.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-sm sm:text-base">{activeProfile.name}</h3>
            <p className="text-xs text-muted-foreground">{activeProfile.role}</p>
          </div>
        </div>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive transition-colors" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>Effacer cette conversation ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action supprimera tout l'historique de cette conversation. Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleClearChat}>
                Effacer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      {/* Messages de chat */}
      <ScrollArea className="flex-1 p-3 sm:p-4">
        <div className="space-y-4 mx-auto max-w-3xl">
          {activeChat && activeChat.messages.length > 0 ? (
            <>
              {activeChat.messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                    <div className={`flex gap-2 sm:gap-3 max-w-[85%] sm:max-w-[80%] ${isUser ? 'flex-row-reverse' : ''}`}>
                      <Avatar className="h-7 w-7 sm:h-8 sm:w-8 mt-0.5 flex-shrink-0">
                        {!isUser ? (
                          <>
                            <AvatarImage src={activeProfile.imageUrl || undefined} alt={activeProfile.name} />
                            <AvatarFallback>{activeProfile.name.charAt(0)}</AvatarFallback>
                          </>
                        ) : (
                          <AvatarFallback>Vous</AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs sm:text-sm font-medium">
                            {isUser ? 'Vous' : activeProfile.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(msg.timestamp), 'HH:mm', { locale: fr })}
                          </span>
                        </div>
                        <Card className={`chat-bubble ${isUser ? 'chat-bubble-user' : 'chat-bubble-assistant'} message-appear`}>
                          <div className="text-xs sm:text-sm whitespace-pre-wrap">{msg.content}</div>
                        </Card>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Indicateur d'écriture animé */}
              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="flex gap-2 sm:gap-3">
                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8 mt-0.5 flex-shrink-0">
                      <AvatarImage src={activeProfile.imageUrl || undefined} alt={activeProfile.name} />
                      <AvatarFallback>{activeProfile.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs sm:text-sm font-medium">{activeProfile.name}</span>
                      </div>
                      <Card className="chat-bubble chat-bubble-assistant message-typing animate-pulse-soft p-4">
                        <TypingIndicator />
                      </Card>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-muted-foreground my-8 sm:my-12 animate-fade-in">
              <p className="text-sm sm:text-base">Aucun message. Commencez à discuter avec {activeProfile.name}.</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      {/* Formulaire d'entrée de message */}
      <form onSubmit={handleSendMessage} className="border-t p-3 sm:p-4">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Écrivez à ${activeProfile.name}...`}
            className="min-h-10 resize-none text-sm sm:text-base"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !message.trim()}
            className="flex-shrink-0"
          >
            {isLoading ? (
              <LoaderCircle className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
            ) : (
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
