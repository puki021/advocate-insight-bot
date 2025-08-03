import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, LogOut, Bookmark, FileText, Sparkles } from 'lucide-react';
import { Message, User as UserType } from '@/types';
import { generateResponse } from '@/data/mockData';
import { AgenticAgent } from '@/components/agent/AgenticAgent';
import { KPICard } from './KPICard';
import { ChartMessage } from './ChartMessage';
import { BookmarkManager, useBookmarking } from '@/components/bookmarks/BookmarkManager';
import { ReportGenerator } from '@/components/reporting/ReportGenerator';
import { MemberAssist } from './MemberAssist';
import { MemberProfile } from '@/data/memberData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface ChatInterfaceProps {
  user: UserType;
  onLogout: () => void;
}

export const ChatInterface = ({ user, onLogout }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Welcome, ${user.name}! I'm your enhanced AI analytics assistant with advanced reasoning capabilities. I have access to comprehensive tools and knowledge base to provide deep insights into call center performance, KPIs, and strategic analysis. What would you like to explore?`,
      sender: 'assistant',
      timestamp: new Date(),
      type: 'text',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedBookmarks, setSelectedBookmarks] = useState<any[]>([]);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [memberContext, setMemberContext] = useState<MemberProfile | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const agent = new AgenticAgent();
  const { addBookmark } = useBookmarking(user.role);

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

    // Add member context if available
    let contextualInput = input;
    if (memberContext) {
      contextualInput = `[Member Context: ${memberContext.name} (${memberContext.memberId})] ${input}`;
    }

    // Use agentic AI with reasoning and tools
    setTimeout(async () => {
      try {
        const agentResponse = await agent.processQuery(contextualInput, user.role);
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: agentResponse.content,
          sender: 'assistant',
          timestamp: new Date(),
          type: agentResponse.type as any,
          data: agentResponse.data,
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      } catch (error) {
        // Fallback to original system
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
      }
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const bookmarkMessage = (message: Message, userQuery: string) => {
    const title = `Analysis: ${userQuery.slice(0, 50)}...`;
    const description = message.content.slice(0, 100) + '...';
    const tags = ['analysis', message.type || 'general'];
    const category = message.type === 'kpi' ? 'KPIs' : 
                    message.type === 'chart' ? 'Performance Analysis' : 
                    'Custom Analysis';
    
    addBookmark(userQuery, message, title, description, tags, category);
  };

  const renderMessage = (message: Message) => {
    const isUser = message.sender === 'user';
    const relatedUserMessage = !isUser ? 
      messages.find(m => m.sender === 'user' && messages.indexOf(m) === messages.indexOf(message) - 1) : 
      null;

    return (
      <div key={message.id} className={cn("flex gap-3 mb-6", isUser ? "justify-end" : "justify-start")}>
        {!isUser && (
          <Avatar className="w-8 h-8 bg-gradient-primary">
            <AvatarFallback>
              <Sparkles className="w-4 h-4 text-white" />
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
            <div className="flex items-start justify-between">
              <p className={cn("whitespace-pre-wrap flex-1", isUser ? "text-white" : "text-foreground")}>
                {message.content}
              </p>
              {!isUser && relatedUserMessage && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => bookmarkMessage(message, relatedUserMessage.content)}
                  className="ml-2 p-1 h-auto opacity-70 hover:opacity-100"
                  title="Bookmark this insight"
                >
                  <Bookmark className="w-4 h-4" />
                </Button>
              )}
            </div>
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
            <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">OPTUM PRIME</h1>
            <p className="text-sm text-muted-foreground">
              {user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Dashboard • Enhanced AI with Tools & Knowledge Base
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Switch Role
          </Button>
        </div>
        
        {/* Navigation Tabs */}
        <div className="container mx-auto px-4 pb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`grid w-full ${user.role === 'supervisor' || user.role === 'agent' ? 'grid-cols-4' : 'grid-cols-3'}`}>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                AI Assistant
              </TabsTrigger>
              {(user.role === 'supervisor' || user.role === 'agent') && (
                <TabsTrigger value="member" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Call Assist
                </TabsTrigger>
              )}
              <TabsTrigger value="bookmarks" className="flex items-center gap-2">
                <Bookmark className="w-4 h-4" />
                Saved Insights
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Custom Reports
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="chat" className="space-y-6">
              {memberContext && (
                <Card className="p-4 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium">
                        Member Context Active: {memberContext.name} ({memberContext.memberId})
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setMemberContext(null)}
                      className="h-auto p-1"
                    >
                      Clear
                    </Button>
                  </div>
                </Card>
              )}
              
              {messages.map(renderMessage)}
              
              {isTyping && (
                <div className="flex gap-3 mb-6">
                  <Avatar className="w-8 h-8 bg-gradient-primary">
                    <AvatarFallback>
                      <Sparkles className="w-4 h-4 text-white" />
                    </AvatarFallback>
                  </Avatar>
                  <Card className="p-4 bg-gradient-card border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                      <span className="text-sm text-muted-foreground ml-2">AI is analyzing with tools...</span>
                    </div>
                  </Card>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </TabsContent>
            
            <TabsContent value="member">
              <MemberAssist onMemberContext={setMemberContext} />
            </TabsContent>
            
            <TabsContent value="bookmarks">
              <BookmarkManager 
                userRole={user.role} 
                onCreateReport={(bookmarks) => {
                  setSelectedBookmarks(bookmarks);
                  setIsReportDialogOpen(true);
                }}
              />
            </TabsContent>
            
            <TabsContent value="reports">
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Custom Reports</h3>
                <p className="text-muted-foreground mb-4">
                  Select insights from your bookmarks to generate comprehensive reports
                </p>
                <Button 
                  onClick={() => setActiveTab('bookmarks')}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  Go to Saved Insights
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Input - Only show on chat tab */}
      {activeTab === 'chat' && (
        <div className="border-t border-border/50 bg-card/50 backdrop-blur-sm sticky bottom-0">
          <div className="container mx-auto px-4 py-4">
            <div className="max-w-4xl mx-auto flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={memberContext ? 
                  `Ask about ${memberContext.name} or general analytics...` : 
                  "Ask about KPIs, forecasts, agent analysis, member lookup, campaign insights..."
                }
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
      )}

      {/* Report Generator Dialog */}
      <ReportGenerator
        bookmarks={selectedBookmarks}
        isOpen={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
      />
    </div>
  );
};