
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User, MessageSquareHeart, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { lumaGriefCounsellorFlow, type LumaGriefInput } from '@/ai/flows/luma-grief-counsellor-flow';
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

const LumaGriefCounsellorPage = () => {
  const [userMessage, setUserMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initial messages from Luma
    setChatMessages([
      { role: 'model', content: "Hello, I'm Luma. I'm here for you." },
      { role: 'model', content: "It's a safe space to share what's on your mind." },
      { role: 'model', content: "What's been bothering you today?" }
    ]);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = async () => {
    const currentMessage = userMessage.trim();
    if (!currentMessage) {
      toast({ title: "Cannot send empty message", variant: "default" });
      return;
    }

    const newUserMessage: ChatMessage = { role: 'user', content: currentMessage };
    setChatMessages(prev => [...prev, newUserMessage]);
    setUserMessage('');
    setIsLoading(true);

    try {
      const input: LumaGriefInput = {
        userQuery: currentMessage,
        chatHistory: chatMessages.slice(0, -1), // Send history up to the last bot message
      };
      const response = await lumaGriefCounsellorFlow(input);
      const lumaResponse: ChatMessage = { role: 'model', content: response.lumaResponse };
      setChatMessages(prev => [...prev, lumaResponse]);
    } catch (error) {
      console.error("Error getting response from Luma:", error);
      const errorResponse: ChatMessage = { role: 'model', content: "I'm truly sorry, I'm finding it difficult to process at this moment. Please try again when you're ready." };
      setChatMessages(prev => [...prev, errorResponse]);
      toast({ title: "AI Counsellor Luma Error", description: "Could not get a response from Luma.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen py-8 px-4"
      style={{ backgroundColor: 'hsl(var(--luma-bg-primary))' }}
    >
      <Card 
        className="w-full max-w-2xl h-[calc(100vh-8rem)] min-h-[500px] flex flex-col shadow-2xl rounded-xl overflow-hidden"
        style={{ backgroundColor: 'hsl(var(--luma-bg-neutral-light))', color: 'hsl(var(--luma-text-primary))' }}
      >
        <CardHeader 
          className="p-6 border-b"
          style={{ borderColor: 'hsl(var(--luma-accent-lavender))' }}
        >
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/luma.png" alt="Luma AI Grief Counsellor" />
              <AvatarFallback style={{ backgroundColor: 'hsl(var(--luma-accent-lavender))', color: 'hsl(var(--luma-text-primary))' }}>L</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-['Lora',_serif] font-semibold" style={{ color: 'hsl(var(--luma-text-primary))' }}>
                Luma
              </CardTitle>
              <CardDescription className="text-sm" style={{ color: 'hsl(var(--luma-text-primary))', opacity: 0.8 }}>
                Your compassionate companion for grief support
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-0 overflow-hidden">
          <ScrollArea className="h-full p-6" ref={chatContainerRef}>
            <div className="space-y-6">
              {chatMessages.map((msg, index) => (
                <div
                  key={`luma-msg-${index}`}
                  className={cn("flex items-end space-x-2", msg.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  {msg.role === 'model' && (
                    <Avatar className="h-8 w-8 self-start">
                      <AvatarImage src="/luma.png" alt="Luma" />
                      <AvatarFallback style={{ backgroundColor: 'hsl(var(--luma-accent-lavender))', color: 'hsl(var(--luma-text-primary))' }}>L</AvatarFallback>
                    </Avatar>
                  )}
                  <div 
                    className={cn(
                      "p-3 rounded-2xl max-w-[80%] text-sm whitespace-pre-wrap shadow-md leading-relaxed font-['Merriweather_Sans',_sans-serif]",
                      msg.role === 'user' 
                        ? 'rounded-br-none' 
                        : 'rounded-bl-none'
                    )}
                    style={msg.role === 'user' ? 
                        { backgroundColor: 'hsl(var(--luma-user-bubble-bg))', color: 'hsl(var(--luma-text-primary))' } :
                        { backgroundColor: 'hsl(var(--luma-bg-secondary))', color: 'hsl(var(--luma-text-on-bot-bubble))' }
                    }
                  >
                    {msg.content}
                  </div>
                  {msg.role === 'user' && (
                    <Avatar className="h-8 w-8 self-start">
                      <AvatarFallback style={{ backgroundColor: 'hsl(var(--luma-accent-peach))', color: 'hsl(var(--luma-text-primary))' }}>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start space-x-2">
                  <Avatar className="h-8 w-8 self-start">
                    <AvatarImage src="/luma.png" alt="Luma" />
                    <AvatarFallback style={{ backgroundColor: 'hsl(var(--luma-accent-lavender))', color: 'hsl(var(--luma-text-primary))' }}>L</AvatarFallback>
                  </Avatar>
                  <div 
                    className="p-3 rounded-2xl shadow-md text-sm luma-pulse-animation font-['Merriweather_Sans',_sans-serif]"
                    style={{ backgroundColor: 'hsl(var(--luma-bg-secondary))', color: 'hsl(var(--luma-text-on-bot-bubble))' }}
                  >
                    Luma is composing...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        <div 
          className="p-4 border-t"
          style={{ borderColor: 'hsl(var(--luma-accent-lavender))', backgroundColor: 'hsl(var(--luma-bg-neutral-medium))' }}
        >
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Share your thoughts with Luma..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
              disabled={isLoading}
              className="flex-grow text-sm rounded-full px-4 py-2"
              style={{ 
                backgroundColor: 'hsl(var(--luma-bg-neutral-light))', 
                borderColor: 'hsl(var(--luma-accent-peach))', 
                color: 'hsl(var(--luma-text-primary))',
                '--tw-ring-color': 'hsl(var(--luma-accent-peach))'
              }}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !userMessage.trim()} 
              size="icon" 
              className="rounded-full"
              style={{ backgroundColor: 'hsl(var(--luma-accent-lavender))', color: 'hsl(var(--luma-text-primary))' }}
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
            <p className="text-xs text-center mt-3 px-2" style={{ color: 'hsl(var(--luma-text-primary))', opacity: 0.7 }}>
             Luma provides supportive information and is not a substitute for professional therapy. Help is available.
            </p>
        </div>
      </Card>
    </div>
  );
};

export default LumaGriefCounsellorPage;
