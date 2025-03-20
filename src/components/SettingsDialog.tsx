import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Settings } from 'lucide-react';

const SettingsDialog: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Paramètres</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Paramètres</DialogTitle>
          <DialogDescription>
            Configurez votre application Emotica
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 text-center text-muted-foreground">
          <p>Aucun paramètre configurable disponible actuellement.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;