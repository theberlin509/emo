
import React, { useState, useEffect } from 'react';
import { ChatProvider } from '@/contexts/ChatContext';
import Header from '@/components/Header';
import ChatList from '@/components/ChatList';
import ChatInterface from '@/components/ChatInterface';
import ChatForm from '@/components/ChatForm';
import UserLogin from '@/components/UserLogin';
import FloatingHistoryButton from '@/components/FloatingHistoryButton';
import { getCurrentUser, logoutUser } from '@/utils/storage';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [showChatForm, setShowChatForm] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Initialiser l'état de la sidebar en fonction de l'appareil
    setShowSidebar(!isMobile);
    
    // Écouter l'événement personnalisé pour basculer la sidebar
    const handleToggleSidebarEvent = (event: CustomEvent) => {
      const { show } = event.detail;
      setShowSidebar(show !== undefined ? show : !showSidebar);
    };
    
    window.addEventListener('toggleSidebar', handleToggleSidebarEvent as EventListener);
    
    // La clé API est maintenant codée en dur dans apiService.ts
    // Nous n'avons plus besoin de la charger depuis le stockage local
    
    return () => {
      window.removeEventListener('toggleSidebar', handleToggleSidebarEvent as EventListener);
    };
  }, [isMobile]);

  const handleNewChat = () => {
    setShowChatForm(true);
  };

  const handleCloseChatForm = () => {
    setShowChatForm(false);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleLoginSuccess = () => {
    setCurrentUser(getCurrentUser());
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    toast({
      title: "Déconnexion",
      description: "Vous êtes maintenant déconnecté.",
    });
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header 
          onNewChat={() => {}} 
          isLoggedIn={false} 
          username={null} 
          onLogout={() => {}}

        />
        <UserLogin onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <ChatProvider>
      <div className="flex flex-col h-screen overflow-hidden bg-background animate-fade-in">
        <Header 
          onNewChat={handleNewChat} 
          isLoggedIn={true} 
          username={currentUser.username} 
          onLogout={handleLogout}

        />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Barre latérale */}
          <div 
            className={`sidebar w-full sm:w-72 md:w-80 border-r transition-all duration-300 ease-in-out fixed sm:relative z-10 bg-background h-[calc(100vh-60px)] sm:h-auto ${
              showSidebar 
                ? 'translate-x-0'
                : '-translate-x-full sm:translate-x-0 sm:w-0'
            }`}
          >
            <ChatList />
          </div>
          
          {/* Zone de chat principale */}
          <div className={`chat-area flex-1 overflow-hidden animate-fade-in ${
            isMobile 
              ? showSidebar ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto' 
              : 'block'
          }`}>
            <ChatInterface toggleSidebar={toggleSidebar} />
          </div>
        </div>
        
        {/* Formulaire de création de chat */}
        {showChatForm && <ChatForm onClose={handleCloseChatForm} />}
        
        {/* Bouton flottant pour afficher l'historique sur mobile */}
        <FloatingHistoryButton 
          onClick={toggleSidebar} 
          isVisible={isMobile && !showSidebar} 
        />
      </div>
    </ChatProvider>
  );
};

export default Index;
