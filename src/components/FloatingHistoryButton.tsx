import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface FloatingHistoryButtonProps {
  onClick: () => void;
  isVisible: boolean;
}

const FloatingHistoryButton: React.FC<FloatingHistoryButtonProps> = ({ onClick, isVisible }) => {
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;
  
  return (
    <div 
      className={`fixed bottom-4 left-4 z-50 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
    >
      <Button 
        onClick={onClick} 
        size="icon" 
        className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white animate-scale-in"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default FloatingHistoryButton;