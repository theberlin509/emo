import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { saveApiKey, getApiKey } from '@/utils/storage';

const ApiKeyConfig: React.FC = () => {
  const [apiKey, setApiKey] = useState(getApiKey() || '');
  const { toast } = useToast();

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a valid API key',
      });
      return;
    }

    saveApiKey(apiKey.trim());
    toast({
      title: 'Success',
      description: 'API key has been saved successfully',
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-4">
      <CardHeader>
        <CardTitle>OpenRouter API Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="apiKey" className="text-sm font-medium">
            API Key
          </label>
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your OpenRouter API key"
          />
        </div>
        <Button onClick={handleSave} className="w-full">
          Save API Key
        </Button>
      </CardContent>
    </Card>
  );
};

export default ApiKeyConfig;