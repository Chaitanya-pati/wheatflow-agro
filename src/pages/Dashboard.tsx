import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Truck, 
  FlaskConical, 
  Scale, 
  Warehouse, 
  Factory, 
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

const Dashboard = () => {
  const stats = [
    {
      title: "Vehicles at Gate",
      value: "12",
      change: "+3 from yesterday",
      icon: Truck,
      status: "warning"
    },
    {
      title: "Quality Tests Pending",
      value: "5",
      change: "2 completed today",
      icon: FlaskConical,
      status: "info"
    },
    {
      title: "Active Production Orders",
      value: "8",
      change: "3 in progress",
      icon: Factory,
      status: "success"
    },
    {
      title: "Finished Goods Ready",
      value: "2,450 bags",
      change: "+150 bags today",
      icon: Package,
      status: "success"
    }
  ]

  const recentActivity = [
    {
      id: 1,
      type: "gate_entry",
      message: "Vehicle GJ-05-AB-1234 arrived with wheat delivery",
      time: "5 minutes ago",
      status: "pending",
      icon: Truck
    },
    {
      id: 2,
      type: "quality_check",
      message: "Quality test completed for Batch #WHT-2024-001",
      time: "15 minutes ago",
      status: "approved",
      icon: FlaskConical
    },
    {
      id: 3,
      type: "production",
      message: "Production Order #PO-001 started 24-hour cleaning process",
      time: "2 hours ago",
      status: "processing",
      icon: Factory
    },
    {
      id: 4,
      type: "inventory",
      message: "150 bags of Maida moved to Godown A",
      time: "3 hours ago",
      status: "completed",
      icon: Warehouse
    }
  ]

  const alerts = [
    {
      id: 1,
      message: "Drum shield cleaning reminder - Machine #1",
      type: "warning",
      time: "In 5 minutes"
    },
    {
      id: 2,
      message: "Pre-cleaning Bin B capacity at 95%",
      type: "info",
      time: "Now"
    },
    {
      id: 3,
      message: "Quality claim pending for Supplier ABC Ltd",
      type: "danger",
      time: "2 hours overdue"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your mill operations and key metrics
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <TrendingUp className="w-4 h-4 mr-2" />
            View Reports
          </Button>
          <Button className="primary-gradient">
            <Factory className="w-4 h-4 mr-2" />
            New Production Order
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="steel-shadow hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${
                stat.status === 'success' ? 'bg-success/10' :
                stat.status === 'warning' ? 'bg-warning/10' :
                stat.status === 'danger' ? 'bg-danger/10' :
                'bg-primary/10'
              }`}>
                <stat.icon className={`w-4 h-4 ${
                  stat.status === 'success' ? 'text-success' :
                  stat.status === 'warning' ? 'text-warning' :
                  stat.status === 'danger' ? 'text-danger' :
                  'text-primary'
                }`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 steel-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest updates from your mill operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                <div className={`p-2 rounded-full ${
                  activity.status === 'approved' || activity.status === 'completed' ? 'bg-success/10' :
                  activity.status === 'pending' ? 'bg-warning/10' :
                  activity.status === 'processing' ? 'bg-primary/10' :
                  'bg-muted'
                }`}>
                  <activity.icon className={`w-4 h-4 ${
                    activity.status === 'approved' || activity.status === 'completed' ? 'text-success' :
                    activity.status === 'pending' ? 'text-warning' :
                    activity.status === 'processing' ? 'text-primary' :
                    'text-muted-foreground'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                    <Badge 
                      variant={
                        activity.status === 'approved' || activity.status === 'completed' ? 'default' :
                        activity.status === 'pending' ? 'secondary' :
                        'outline'
                      }
                      className={
                        activity.status === 'approved' || activity.status === 'completed' ? 'status-approved' :
                        activity.status === 'pending' ? 'status-pending' :
                        'status-processing'
                      }
                    >
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alerts & Notifications */}
        <Card className="steel-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Alerts & Reminders
            </CardTitle>
            <CardDescription>
              Important notifications and reminders
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-3 rounded-lg border border-border">
                <div className="flex items-start gap-2">
                  {alert.type === 'warning' && <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />}
                  {alert.type === 'danger' && <AlertTriangle className="w-4 h-4 text-danger mt-0.5" />}
                  {alert.type === 'info' && <CheckCircle className="w-4 h-4 text-primary mt-0.5" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard