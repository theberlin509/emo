
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { loginUser, registerUser } from '@/utils/storage';
import { useToast } from '@/components/ui/use-toast';

interface UserLoginProps {
  onLoginSuccess: () => void;
}

const UserLogin: React.FC<UserLoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const user = loginUser(username, password);
      
      if (user) {
        toast({
          title: "Connexion réussie",
          description: `Bienvenue, ${user.username} !`,
        });
        onLoginSuccess();
      } else {
        toast({
          variant: "destructive",
          title: "Échec de la connexion",
          description: "Nom d'utilisateur ou mot de passe incorrect",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (username.length < 3) {
        throw new Error('Le nom d\'utilisateur doit contenir au moins 3 caractères');
      }
      
      if (password.length < 6) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères');
      }
      
      const user = registerUser(username, password);
      
      toast({
        title: "Inscription réussie",
        description: `Bienvenue, ${user.username} !`,
      });
      
      onLoginSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Échec de l'inscription",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] p-4 animate-fade-in">
      <Card className="w-full max-w-md">
        <Tabs defaultValue="login">
          <CardHeader>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="register">Inscription</TabsTrigger>
            </TabsList>
            <CardDescription className="pt-4 text-center">
              Connectez-vous pour accéder à toutes vos conversations
            </CardDescription>
          </CardHeader>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium">
                    Nom d'utilisateur
                  </label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Entrez votre nom d'utilisateur"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Mot de passe
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez votre mot de passe"
                    required
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="reg-username" className="text-sm font-medium">
                    Nom d'utilisateur
                  </label>
                  <Input
                    id="reg-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choisissez un nom d'utilisateur"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="reg-password" className="text-sm font-medium">
                    Mot de passe
                  </label>
                  <Input
                    id="reg-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Choisissez un mot de passe (6 caractères min.)"
                    required
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default UserLogin;
