import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, FileText, Calendar, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import { BookmarkedInteraction } from '@/components/bookmarks/BookmarkManager';
import { KPICard } from '@/components/chat/KPICard';
import { ChartMessage } from '@/components/chat/ChartMessage';

interface ReportGeneratorProps {
  bookmarks: BookmarkedInteraction[];
  isOpen: boolean;
  onClose: () => void;
}

export const ReportGenerator = ({ bookmarks, isOpen, onClose }: ReportGeneratorProps) => {
  const [reportTitle, setReportTitle] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportType, setReportType] = useState<'executive' | 'operational' | 'technical'>('executive');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [generatedReport, setGeneratedReport] = useState<any>(null);

  const generateReport = () => {
    const report = {
      id: Date.now().toString(),
      title: reportTitle || `Custom Report - ${new Date().toLocaleDateString()}`,
      description: reportDescription,
      type: reportType,
      generatedAt: new Date(),
      bookmarks: bookmarks,
      summary: generateSummary(),
      insights: generateInsights(),
      recommendations: generateRecommendations()
    };

    setGeneratedReport(report);
  };

  const generateSummary = () => {
    const categories = [...new Set(bookmarks.map(b => b.category))];
    const totalInsights = bookmarks.length;
    const timeRange = {
      earliest: new Date(Math.min(...bookmarks.map(b => b.createdAt.getTime()))),
      latest: new Date(Math.max(...bookmarks.map(b => b.createdAt.getTime())))
    };

    return {
      totalInsights,
      categories,
      timeRange,
      keyMetrics: extractKeyMetrics()
    };
  };

  const extractKeyMetrics = () => {
    const metrics: any[] = [];
    
    bookmarks.forEach(bookmark => {
      if (bookmark.response.type === 'kpi' && bookmark.response.data) {
        bookmark.response.data.forEach((kpi: any) => {
          if (!metrics.find(m => m.label === kpi.label)) {
            metrics.push(kpi);
          }
        });
      }
    });

    return metrics.slice(0, 6); // Top 6 metrics
  };

  const generateInsights = () => {
    const insights = [];
    
    // Performance insights
    const performanceBookmarks = bookmarks.filter(b => 
      b.category === 'Performance Analysis' || b.tags.includes('performance')
    );
    
    if (performanceBookmarks.length > 0) {
      insights.push({
        category: 'Performance Analysis',
        title: 'Team Performance Overview',
        content: `Analysis based on ${performanceBookmarks.length} performance-related insights. Key areas include agent productivity, customer satisfaction trends, and operational efficiency metrics.`,
        bookmarks: performanceBookmarks
      });
    }

    // KPI insights
    const kpiBookmarks = bookmarks.filter(b => 
      b.category === 'KPIs' || b.response.type === 'kpi'
    );
    
    if (kpiBookmarks.length > 0) {
      insights.push({
        category: 'Key Performance Indicators',
        title: 'KPI Summary & Trends',
        content: `Comprehensive KPI analysis covering ${kpiBookmarks.length} key metrics. Includes current performance levels, trend analysis, and benchmark comparisons.`,
        bookmarks: kpiBookmarks
      });
    }

    return insights;
  };

  const generateRecommendations = () => {
    const recommendations = [];

    // Based on report type, generate specific recommendations
    switch (reportType) {
      case 'executive':
        recommendations.push(
          'Focus on revenue-generating metrics and strategic KPIs',
          'Monitor cost efficiency and ROI across all operations',
          'Ensure customer satisfaction aligns with business objectives'
        );
        break;
      case 'operational':
        recommendations.push(
          'Optimize agent utilization and scheduling',
          'Improve first-call resolution rates through training',
          'Implement quality monitoring improvements'
        );
        break;
      case 'technical':
        recommendations.push(
          'Monitor system performance and response times',
          'Ensure data accuracy and integration quality',
          'Implement automated reporting workflows'
        );
        break;
    }

    return recommendations;
  };

  const exportReport = () => {
    if (!generatedReport) return;

    const reportData = {
      ...generatedReport,
      exportedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportData.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    // In a real implementation, you'd use a library like jsPDF or Puppeteer
    alert('PDF export functionality would be implemented here using libraries like jsPDF or html2pdf');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Custom Report Generator
          </DialogTitle>
        </DialogHeader>

        {!generatedReport ? (
          <div className="space-y-6">
            {/* Report Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Report Title</label>
                <Input
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="Enter report title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Report Type</label>
                <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="executive">Executive Summary</SelectItem>
                    <SelectItem value="operational">Operational Report</SelectItem>
                    <SelectItem value="technical">Technical Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                placeholder="Describe the purpose and scope of this report..."
                rows={3}
              />
            </div>

            {/* Selected Bookmarks Preview */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Selected Insights ({bookmarks.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {bookmarks.map(bookmark => (
                  <Card key={bookmark.id} className="p-3">
                    <h4 className="font-medium text-sm">{bookmark.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{bookmark.description}</p>
                    <div className="flex gap-1 mt-2">
                      <Badge variant="outline" className="text-xs">{bookmark.category}</Badge>
                      {bookmark.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={generateReport}>Generate Report</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Generated Report */}
            <div className="border-b pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{generatedReport.title}</h2>
                  <p className="text-muted-foreground mt-1">{generatedReport.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Generated: {generatedReport.generatedAt.toLocaleDateString()}
                    </span>
                    <Badge variant="outline">{generatedReport.type}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={exportToPDF}>
                    <FileText className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button variant="outline" onClick={exportReport}>
                    <Download className="w-4 h-4 mr-2" />
                    Export JSON
                  </Button>
                </div>
              </div>
            </div>

            {/* Report Summary */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Executive Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{generatedReport.summary.totalInsights}</div>
                  <div className="text-sm text-muted-foreground">Total Insights</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{generatedReport.summary.categories.length}</div>
                  <div className="text-sm text-muted-foreground">Categories</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">
                    {Math.ceil((generatedReport.summary.timeRange.latest - generatedReport.summary.timeRange.earliest) / (1000 * 60 * 60 * 24))}
                  </div>
                  <div className="text-sm text-muted-foreground">Days Analyzed</div>
                </Card>
              </div>
            </div>

            {/* Key Metrics */}
            {generatedReport.summary.keyMetrics.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Key Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {generatedReport.summary.keyMetrics.map((kpi: any, index: number) => (
                    <KPICard key={index} kpi={kpi} />
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Detailed Insights */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Detailed Analysis
              </h3>
              {generatedReport.insights.map((insight: any, index: number) => (
                <Card key={index} className="p-4 mb-4">
                  <h4 className="font-semibold mb-2">{insight.title}</h4>
                  <p className="text-muted-foreground mb-3">{insight.content}</p>
                  <Badge variant="secondary">{insight.category}</Badge>
                </Card>
              ))}
            </div>

            {/* Recommendations */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
              <ul className="space-y-2">
                {generatedReport.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setGeneratedReport(null)}>
                Generate New
              </Button>
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};