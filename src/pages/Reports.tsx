import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  TrendingUp,
  Download,
  Filter,
  Calendar,
  FileText,
  PieChart,
  LineChart
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const Reports = () => {
  const { toast } = useToast()
  
  const [reportFilters, setReportFilters] = useState({
    type: "",
    dateFrom: "",
    dateTo: "",
    category: ""
  })

  const reportTypes = [
    { id: "inventory", name: "Inventory Report", icon: BarChart3 },
    { id: "production", name: "Production Report", icon: TrendingUp },
    { id: "sales", name: "Sales Report", icon: PieChart },
    { id: "quality", name: "Quality Report", icon: FileText },
    { id: "waste", name: "Waste Analysis", icon: LineChart },
    { id: "financial", name: "Financial Summary", icon: BarChart3 }
  ]

  const handleGenerateReport = () => {
    if (!reportFilters.type) {
      toast({
        title: "Missing Information",
        description: "Please select a report type",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Report Generated",
      description: `${reportFilters.type} report is being generated...`,
    })
  }

  const handleDownloadReport = (reportName: string) => {
    toast({
      title: "Download Started",
      description: `${reportName} is being downloaded...`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate comprehensive reports and analyze business metrics
          </p>
        </div>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          {/* Report Generation */}
          <Card className="steel-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Generate Custom Report
              </CardTitle>
              <CardDescription>
                Select report type and filters to generate custom reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Report Type *</Label>
                  <Select 
                    value={reportFilters.type} 
                    onValueChange={(value) => setReportFilters({...reportFilters, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((type) => (
                        <SelectItem key={type.id} value={type.name}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>From Date</Label>
                  <Input
                    type="date"
                    value={reportFilters.dateFrom}
                    onChange={(e) => setReportFilters({...reportFilters, dateFrom: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>To Date</Label>
                  <Input
                    type="date"
                    value={reportFilters.dateTo}
                    onChange={(e) => setReportFilters({...reportFilters, dateTo: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    value={reportFilters.category} 
                    onValueChange={(value) => setReportFilters({...reportFilters, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="mill">Mill</SelectItem>
                      <SelectItem value="low_mill">Low Mill</SelectItem>
                      <SelectItem value="hd">HD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleGenerateReport} className="primary-gradient">
                <BarChart3 className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>

          {/* Quick Reports */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map((report) => {
              const Icon = report.icon
              return (
                <Card key={report.id} className="steel-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Icon className="w-5 h-5 text-primary" />
                      {report.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Quick access to {report.name.toLowerCase()} with default filters
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleDownloadReport(report.name)}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Filter className="w-3 h-3 mr-1" />
                        Customize
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <Card className="steel-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Scheduled Reports
              </CardTitle>
              <CardDescription>
                Manage automated report generation and email delivery
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No scheduled reports configured yet
                </p>
                <Button variant="outline" className="mt-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule New Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="steel-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">145,250 kg</div>
                <p className="text-xs text-muted-foreground">+5.2% from last month</p>
              </CardContent>
            </Card>

            <Card className="steel-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Production This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">82,100 kg</div>
                <p className="text-xs text-muted-foreground">+12.8% from last month</p>
              </CardContent>
            </Card>

            <Card className="steel-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Sales Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹4,25,600</div>
                <p className="text-xs text-muted-foreground">+8.1% from last month</p>
              </CardContent>
            </Card>

            <Card className="steel-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Waste Percentage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4%</div>
                <p className="text-xs text-muted-foreground">-0.3% from last month</p>
              </CardContent>
            </Card>
          </div>

          <Card className="steel-shadow">
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>
                Detailed charts and insights dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Advanced analytics dashboard with interactive charts and insights coming soon
                </p>
                <Button variant="outline">
                  <LineChart className="w-4 h-4 mr-2" />
                  View Sample Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Reports