import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, LogOut } from 'lucide-react';
import { Message, User as UserType } from '@/types';
import { generateResponse } from '@/data/mockData';
import { KPICard } from './KPICard';
import { ChartMessage } from './ChartMessage';
import { cn } from '@/lib/utils';

interface ChatInterfaceProps {
  user: UserType;
  onLogout: () => void;
}

export const ChatInterface = ({ user, onLogout }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Welcome, ${user.name}! I'm your AI analytics assistant. I can help you with call center insights, KPIs, campaign performance, and more. What would you like to know?`,
      sender: 'assistant',
      timestamp: new Date(),
      type: 'text',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const response = generateResponse(input, user.role);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: 'assistant',
        timestamp: new Date(),
        type: response.type as any,
        data: response.data,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessage = (message: Message) => {
    const isUser = message.sender === 'user';

    return (
      <div key={message.id} className={cn("flex gap-3 mb-6", isUser ? "justify-end" : "justify-start")}>
        {!isUser && (
          <Avatar className="w-8 h-8 bg-gradient-primary">
            <AvatarFallback>
              <Bot className="w-4 h-4 text-white" />
            </AvatarFallback>
          </Avatar>
        )}
        
        <div className={cn("max-w-[80%]", isUser ? "order-first" : "")}>
          <Card className={cn(
            "p-4 transition-all duration-300",
            isUser 
              ? "bg-gradient-primary text-white border-primary/20" 
              : "bg-gradient-card border-border/50"
          )}>
            <p className={cn("whitespace-pre-wrap", isUser ? "text-white" : "text-foreground")}>
              {message.content}
            </p>
          </Card>
          
          {message.type === 'kpi' && message.data && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {message.data.map((kpi: any, index: number) => (
                <KPICard key={index} kpi={kpi} />
              ))}
            </div>
          )}
          
          {message.type === 'chart' && message.data && (
            <div className="mt-4">
              <ChartMessage data={message.data} />
            </div>
          )}
          
          <span className={cn(
            "text-xs mt-2 block",
            isUser ? "text-white/70" : "text-muted-foreground"
          )}>
            {message.timestamp.toLocaleTimeString()}
          </span>
        </div>
        
        {isUser && (
          <Avatar className="w-8 h-8 bg-secondary">
            <AvatarFallback>
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Advocate Insight Bot</h1>
            <p className="text-sm text-muted-foreground">
              {user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Dashboard
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Switch Role
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 container mx-auto px-4 py-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {messages.map(renderMessage)}
          
          {isTyping && (
            <div className="flex gap-3 mb-6">
              <Avatar className="w-8 h-8 bg-gradient-primary">
                <AvatarFallback>
                  <Bot className="w-4 h-4 text-white" />
                </AvatarFallback>
              </Avatar>
              <Card className="p-4 bg-gradient-card border-border/50">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </Card>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border/50 bg-card/50 backdrop-blur-sm sticky bottom-0">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-4xl mx-auto flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about KPIs, campaign performance, agent metrics..."
              className="flex-1 bg-background/50 border-border/50"
              disabled={isTyping}
            />
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || isTyping}
              className="bg-gradient-primary hover:opacity-90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};