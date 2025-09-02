import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Truck, 
  Package,
  MapPin,
  Camera,
  CheckCircle,
  Clock,
  AlertTriangle,
  User
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const Dispatch = () => {
  const { toast } = useToast()
  
  const [dispatches] = useState([
    {
      id: "DS-2024-001",
      orderId: "SO-2024-001",
      customer: "ABC Foods Ltd",
      driver: "Ram Kumar",
      vehicle: "MH-12-AB-1234",
      items: "Maida (50kg x 50), Suji (25kg x 25)",
      status: "loaded",
      dispatchTime: "10:30 AM",
      estimatedDelivery: "2:30 PM",
      progress: 25
    },
    {
      id: "DS-2024-002",
      orderId: "SO-2024-002", 
      customer: "XYZ Bakery",
      driver: "Shyam Singh",
      vehicle: "MH-12-CD-5678",
      items: "Chakki Ata (30kg x 40)",
      status: "in_transit",
      dispatchTime: "9:15 AM",
      estimatedDelivery: "1:15 PM",
      progress: 65
    }
  ])

  const [dispatchForm, setDispatchForm] = useState({
    orderId: "",
    vehicle: "",
    driver: "",
    items: "",
    estimatedDelivery: ""
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready': return 'status-pending'
      case 'loaded': return 'status-processing'
      case 'in_transit': return 'status-processing'
      case 'delivered': return 'status-approved'
      case 'delayed': return 'status-rejected'
      default: return 'status-pending'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return Clock
      case 'loaded': return Package
      case 'in_transit': return Truck
      case 'delivered': return CheckCircle
      case 'delayed': return AlertTriangle
      default: return Clock
    }
  }

  const handleCreateDispatch = () => {
    if (!dispatchForm.orderId || !dispatchForm.vehicle || !dispatchForm.driver) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Dispatch Created",
      description: `Dispatch order ${dispatchForm.orderId} assigned to ${dispatchForm.driver}`,
    })
    
    setDispatchForm({
      orderId: "",
      vehicle: "",
      driver: "",
      items: "",
      estimatedDelivery: ""
    })
  }

  const handleUploadProof = (dispatchId: string) => {
    toast({
      title: "Upload Delivery Proof",
      description: "Camera will open to capture delivery proof",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Truck className="w-8 h-8 text-primary" />
            Dispatch Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage vehicle dispatch and delivery tracking
          </p>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active Dispatches</TabsTrigger>
          <TabsTrigger value="create">Create Dispatch</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {/* Active Dispatches */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {dispatches.map((dispatch) => {
              const StatusIcon = getStatusIcon(dispatch.status)
              return (
                <Card key={dispatch.id} className="steel-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{dispatch.id}</CardTitle>
                      <Badge className={getStatusBadge(dispatch.status)}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {dispatch.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <CardDescription>Order: {dispatch.orderId}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Customer:</span>
                        <span className="font-medium">{dispatch.customer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Driver:</span>
                        <span className="font-medium">{dispatch.driver}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Vehicle:</span>
                        <span className="font-medium">{dispatch.vehicle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dispatch Time:</span>
                        <span className="font-medium">{dispatch.dispatchTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ETA:</span>
                        <span className="font-medium">{dispatch.estimatedDelivery}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Delivery Progress</span>
                        <span>{dispatch.progress}%</span>
                      </div>
                      <Progress value={dispatch.progress} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Items:</p>
                      <p className="text-sm font-medium">{dispatch.items}</p> 
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleUploadProof(dispatch.id)}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Upload Proof
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <MapPin className="w-4 h-4 mr-2" />
                        Track Location
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          {/* Create New Dispatch */}
          <Card className="steel-shadow">
            <CardHeader>
              <CardTitle>Create New Dispatch</CardTitle>
              <CardDescription>
                Assign orders to vehicles and drivers for delivery
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orderId">Sales Order *</Label>
                  <Select 
                    value={dispatchForm.orderId} 
                    onValueChange={(value) => setDispatchForm({...dispatchForm, orderId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SO-2024-003">SO-2024-003 - DEF Industries</SelectItem>
                      <SelectItem value="SO-2024-004">SO-2024-004 - GHI Bakery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicle">Vehicle *</Label>
                  <Select 
                    value={dispatchForm.vehicle} 
                    onValueChange={(value) => setDispatchForm({...dispatchForm, vehicle: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MH-12-EF-9012">MH-12-EF-9012 (Available)</SelectItem>
                      <SelectItem value="MH-12-GH-3456">MH-12-GH-3456 (Available)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driver">Driver *</Label>
                  <Select 
                    value={dispatchForm.driver} 
                    onValueChange={(value) => setDispatchForm({...dispatchForm, driver: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select driver" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ravi Patel">Ravi Patel (Available)</SelectItem>
                      <SelectItem value="Suresh Kumar">Suresh Kumar (Available)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedDelivery">Estimated Delivery Time</Label>
                  <Input
                    id="estimatedDelivery"
                    type="time"
                    value={dispatchForm.estimatedDelivery}
                    onChange={(e) => setDispatchForm({...dispatchForm, estimatedDelivery: e.target.value})}
                  />
                </div>
              </div>

              <Button onClick={handleCreateDispatch} className="primary-gradient w-full">
                <Truck className="w-4 h-4 mr-2" />
                Create Dispatch
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-6">
          <Card className="steel-shadow">
            <CardHeader>
              <CardTitle>Vehicle Management</CardTitle>
              <CardDescription>
                Manage fleet vehicles and their availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Vehicle management functionality coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drivers" className="space-y-6">
          <Card className="steel-shadow">
            <CardHeader>
              <CardTitle>Driver Management</CardTitle>
              <CardDescription>
                Manage drivers and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Driver management functionality coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Dispatch