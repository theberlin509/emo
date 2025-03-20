
import React from 'react';
import { useChatContext } from '@/contexts/ChatContext';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatItemProps {
  id: string;
  name: string;
  role: string;
  imageUrl: string | null;
  lastActive: number;
  isActive: boolean;
}

const ChatItem: React.FC<ChatItemProps> = ({
  id,
  name,
  role,
  imageUrl,
  lastActive,
  isActive,
}) => {
  const { setActiveProfile, deleteProfile } = useChatContext();
  const isMobile = useIsMobile();

  const handleSelect = () => {
    setActiveProfile(id);
    
    // Sur mobile, faire basculer vers le chat après sélection d'un profil
    if (isMobile) {
      // Use the parent component's state management instead of direct DOM manipulation
      // This will trigger the proper re-render with the correct visibility classes
      const event = new CustomEvent('toggleSidebar', { detail: { show: false } });
      window.dispatchEvent(event);
    }
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const confirmDelete = () => {
    deleteProfile(id);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const timeAgo = formatDistanceToNow(lastActive, { addSuffix: true, locale: fr });

  return (
    <div
      className={`relative flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all-medium cursor-pointer group ${
        isActive 
          ? 'bg-primary/10 hover:bg-primary/15' 
          : 'hover:bg-secondary'
      }`}
      onClick={handleSelect}
    >
      <Avatar className="flex-shrink-0 transition-all-medium h-9 w-9 sm:h-10 sm:w-10">
        {imageUrl ? (
          <AvatarImage src={imageUrl} alt={name} />
        ) : (
          <AvatarFallback className="bg-primary/20 text-primary">
            {getInitials(name)}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{name}</p>
        <p className="text-xs text-muted-foreground truncate">{role}</p>
        <p className="text-xs text-muted-foreground mt-1">{timeAgo}</p>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-all-medium focus:opacity-100" 
            onClick={handleDelete}
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le profil</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer "{name}" ? Cette action supprimera définitivement ce personnage et toutes vos conversations avec lui.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={confirmDelete}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ChatItem;
