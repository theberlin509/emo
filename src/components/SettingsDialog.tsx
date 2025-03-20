import React from 'react';
import { Button } from "./ui/button";
import { Settings } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

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
        <div className="mt-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            La configuration de l'API est gérée par l'administrateur du système.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;