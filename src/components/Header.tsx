
import React from 'react';
import { MessageSquarePlus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import SettingsDialog from './SettingsDialog';

interface HeaderProps {
  onNewChat: () => void;
  isLoggedIn?: boolean;
  username?: string | null;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewChat, isLoggedIn = false, username = null, onLogout }) => {
  return (
    <header className="w-full py-4 sm:py-6 px-4 sm:px-6 flex justify-between items-center transition-all-medium">
      <div className="flex items-center">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight animate-fade-in">
          <span className="text-primary">Emot</span>ica
        </h1>
        <div className="hidden md:flex items-center ml-6">
          <Separator orientation="vertical" className="h-6 mx-6" />
          <p className="text-sm text-muted-foreground animate-fade-in delay-100">
            Votre compagnon de conversation personnalisé
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {isLoggedIn && username && (
          <div className="text-sm text-muted-foreground mr-2">
            {username}
          </div>
        )}
        
        {isLoggedIn && (
          <>
            <SettingsDialog />
            
            <Button 
              onClick={onNewChat}
              className="transition-all-medium animate-slide-up text-xs sm:text-sm"
              size="sm"
            >
              <MessageSquarePlus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              <span>Nouvelle conversation</span>
            </Button>
            
            {onLogout && (
              <Button 
                onClick={onLogout} 
                variant="outline" 
                size="sm"
                className="ml-2"
              >
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
