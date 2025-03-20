
import React, { useState } from 'react';
import { useChatContext } from '@/contexts/ChatContext';
import ProfileImageUpload from './ProfileImageUpload';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { X } from 'lucide-react';

interface ChatFormProps {
  onClose: () => void;
}

const ROLE_OPTIONS = [
  { value: 'friend', label: 'Friend' },
  { value: 'partner', label: 'Partner' },
  { value: 'therapist', label: 'Therapist' },
  { value: 'mentor', label: 'Mentor' },
  { value: 'parent', label: 'Parent' },
  { value: 'coach', label: 'Coach' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'custom', label: 'Custom...' },
];

const ChatForm: React.FC<ChatFormProps> = ({ onClose }) => {
  const { createProfile, setActiveProfile } = useChatContext();
  const { toast } = useToast();
  
  const [formState, setFormState] = useState({
    name: '',
    role: '',
    customRole: '',
    description: '',
    imageUrl: null as string | null,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (base64: string | null) => {
    setFormState(prev => ({ ...prev, imageUrl: base64 }));
  };

  const handleRoleChange = (value: string) => {
    setFormState(prev => ({ 
      ...prev, 
      role: value,
      customRole: value === 'custom' ? prev.customRole : '' 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { name, role, customRole, description, imageUrl } = formState;
    
    // Basic validation
    if (!name.trim()) {
      toast({
        variant: "destructive",
        title: "Name Required",
        description: "Please provide a name for your chat character.",
      });
      return;
    }

    const finalRole = role === 'custom' ? customRole : role;
    
    if (!finalRole.trim()) {
      toast({
        variant: "destructive",
        title: "Role Required",
        description: "Please select or provide a role for your chat character.",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const newProfile = await createProfile({
        name: name.trim(),
        role: finalRole.trim(),
        description: description.trim(),
        imageUrl
      });
      
      setActiveProfile(newProfile.id);
      
      toast({
        title: "Profile Created",
        description: `Your chat profile for ${name} has been created successfully.`,
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create chat profile. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50 p-4 animate-fade-in">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in shadow-soft">
        <CardHeader className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="text-xl font-medium">Create New Chat Character</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <ProfileImageUpload
                value={formState.imageUrl}
                onChange={handleImageChange}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                placeholder="Character Name"
                value={formState.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role
              </label>
              <Select
                value={formState.role}
                onValueChange={handleRoleChange}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {formState.role === 'custom' && (
              <div className="space-y-2">
                <label htmlFor="customRole" className="text-sm font-medium">
                  Custom Role
                </label>
                <Input
                  id="customRole"
                  placeholder="Enter a custom role..."
                  value={formState.customRole}
                  onChange={(e) => handleChange('customRole', e.target.value)}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Character Description
              </label>
              <Textarea
                id="description"
                placeholder="Describe the character's personality, background, and how they should interact..."
                className="min-h-24"
                value={formState.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Character'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ChatForm;
