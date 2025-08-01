import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Bookmark, Star, Tag, Calendar, Search, Download, Trash2 } from 'lucide-react';
import { Message, UserRole } from '@/types';

export interface BookmarkedInteraction {
  id: string;
  title: string;
  description: string;
  query: string;
  response: Message;
  tags: string[];
  category: string;
  userRole: UserRole;
  createdAt: Date;
  isStarred: boolean;
}

interface BookmarkManagerProps {
  userRole: UserRole;
  onCreateReport: (bookmarks: BookmarkedInteraction[]) => void;
}

export const BookmarkManager = ({ userRole, onCreateReport }: BookmarkManagerProps) => {
  const [bookmarks, setBookmarks] = useState<BookmarkedInteraction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBookmarks, setSelectedBookmarks] = useState<string[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Load bookmarks from localStorage on component mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem(`bookmarks_${userRole}`);
    if (savedBookmarks) {
      try {
        const parsed = JSON.parse(savedBookmarks);
        setBookmarks(parsed.map((b: any) => ({
          ...b,
          createdAt: new Date(b.createdAt),
          response: {
            ...b.response,
            timestamp: new Date(b.response.timestamp)
          }
        })));
      } catch (error) {
        console.error('Failed to load bookmarks:', error);
      }
    }
  }, [userRole]);

  // Save bookmarks to localStorage whenever bookmarks change
  useEffect(() => {
    localStorage.setItem(`bookmarks_${userRole}`, JSON.stringify(bookmarks));
  }, [bookmarks, userRole]);

  const categories = [
    'all',
    'KPIs',
    'Performance Analysis',
    'Campaign Reports',
    'Forecasting',
    'Quality Metrics',
    'Custom Analysis'
  ];

  const addBookmark = (bookmark: Omit<BookmarkedInteraction, 'id' | 'createdAt'>) => {
    const newBookmark: BookmarkedInteraction = {
      ...bookmark,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setBookmarks(prev => [newBookmark, ...prev]);
  };

  const toggleStar = (id: string) => {
    setBookmarks(prev => prev.map(bookmark => 
      bookmark.id === id ? { ...bookmark, isStarred: !bookmark.isStarred } : bookmark
    ));
  };

  const deleteBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
    setSelectedBookmarks(prev => prev.filter(selectedId => selectedId !== id));
  };

  const toggleSelection = (id: string) => {
    setSelectedBookmarks(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesSearch = bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bookmark.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bookmark.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || bookmark.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const generateReport = () => {
    const selectedBookmarkData = bookmarks.filter(b => selectedBookmarks.includes(b.id));
    onCreateReport(selectedBookmarkData);
  };

  const exportBookmarks = () => {
    const selectedBookmarkData = bookmarks.filter(b => selectedBookmarks.includes(b.id));
    const dataStr = JSON.stringify(selectedBookmarkData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bookmarks_${userRole}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Saved Insights</h2>
          <p className="text-muted-foreground">Bookmark important analytics and create custom reports</p>
        </div>
        <div className="flex gap-2">
          {selectedBookmarks.length > 0 && (
            <>
              <Button variant="outline" onClick={exportBookmarks}>
                <Download className="w-4 h-4 mr-2" />
                Export ({selectedBookmarks.length})
              </Button>
              <Button onClick={generateReport}>
                Create Report ({selectedBookmarks.length})
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search bookmarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bookmarks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBookmarks.map(bookmark => (
          <Card key={bookmark.id} className="p-4 hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedBookmarks.includes(bookmark.id)}
                  onChange={() => toggleSelection(bookmark.id)}
                  className="rounded"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleStar(bookmark.id)}
                  className="p-1 h-auto"
                >
                  <Star 
                    className={`w-4 h-4 ${bookmark.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                  />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteBookmark(bookmark.id)}
                className="p-1 h-auto text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <h3 className="font-semibold text-foreground mb-2">{bookmark.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{bookmark.description}</p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {bookmark.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {bookmark.createdAt.toLocaleDateString()}
              </span>
              <Badge variant="outline" className="text-xs">
                {bookmark.category}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {filteredBookmarks.length === 0 && (
        <div className="text-center py-12">
          <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No bookmarks found</h3>
          <p className="text-muted-foreground">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Start saving insights from your chat conversations'
            }
          </p>
        </div>
      )}
    </div>
  );
};

// Hook to be used in ChatInterface for easy bookmarking
export const useBookmarking = (userRole: UserRole) => {
  const addBookmark = (query: string, response: Message, title: string, description: string, tags: string[], category: string) => {
    const bookmark: Omit<BookmarkedInteraction, 'id' | 'createdAt'> = {
      title,
      description,
      query,
      response,
      tags,
      category,
      userRole,
      isStarred: false
    };

    // Get existing bookmarks
    const savedBookmarks = localStorage.getItem(`bookmarks_${userRole}`);
    let bookmarks: BookmarkedInteraction[] = [];
    
    if (savedBookmarks) {
      try {
        bookmarks = JSON.parse(savedBookmarks);
      } catch (error) {
        console.error('Failed to load bookmarks:', error);
      }
    }

    const newBookmark: BookmarkedInteraction = {
      ...bookmark,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    bookmarks.unshift(newBookmark);
    localStorage.setItem(`bookmarks_${userRole}`, JSON.stringify(bookmarks));

    return newBookmark.id;
  };

  return { addBookmark };
};