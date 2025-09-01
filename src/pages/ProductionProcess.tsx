import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Cog, 
  Timer,
  Droplets,
  Scale,
  AlertTriangle,
  CheckCircle,
  Camera,
  Play,
  Pause
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const ProductionProcess = () => {
  const { toast } = useToast()
  
  const [planningForm, setPlanningForm] = useState({
    orderId: "",
    binA: "",
    binB: "",
    binC: "",
    binD: "",
    binE: "",
    binF: "",
    totalPercentage: 0
  })

  const [cleaningForm, setCleaning24Form] = useState({
    orderId: "",
    duration: "24",
    moistureIn: "",
    moistureOut: "",
    wasteCollected: "",
    waterAdded: ""
  })

  const [cleaning12Form, setCleaning12Form] = useState({
    orderId: "",
    duration: "12",
    targetMoisture: "",
    actualMoisture: "",
    wasteCollected: ""
  })

  const [grindingForm, setGrindingForm] = useState({
    orderId: "",
    mainProducts: "",
    branProduced: "",
    totalProcessed: ""
  })

  const [orders] = useState([
    {
      id: 1,
      orderNumber: "PO-2024-001",
      productType: "Maida Premium",
      quantity: 100000,
      status: "planning",
      currentStage: "planning"
    },
    {
      id: 2,
      orderNumber: "PO-2024-002",
      productType: "Chakki Atta", 
      quantity: 75000,
      status: "24h_cleaning",
      currentStage: "24h_cleaning",
      timeRemaining: "16h 30m"
    }
  ])

  const [bins] = useState([
    { id: "A", name: "Bin A", available: 18000 },
    { id: "B", name: "Bin B", available: 22000 },
    { id: "C", name: "Bin C", available: 15000 },
    { id: "D", name: "Bin D", available: 20000 },
    { id: "E", name: "Bin E", available: 45000 },
    { id: "F", name: "Bin F", available: 52000 }
  ])

  const [activeProcesses] = useState([
    {
      id: 1,
      orderNumber: "PO-2024-002",
      stage: "24h_cleaning",
      progress: 68,
      timeRemaining: "7h 45m",
      status: "running"
    },
    {
      id: 2,
      orderNumber: "PO-2024-001",
      stage: "12h_cleaning", 
      progress: 25,
      timeRemaining: "9h 15m",
      status: "running"
    }
  ])

  const calculateTotal = () => {
    const total = parseFloat(planningForm.binA || "0") + 
                 parseFloat(planningForm.binB || "0") + 
                 parseFloat(planningForm.binC || "0") + 
                 parseFloat(planningForm.binD || "0") + 
                 parseFloat(planningForm.binE || "0") + 
                 parseFloat(planningForm.binF || "0")
    
    setPlanningForm({...planningForm, totalPercentage: total})
    return total
  }

  const handlePlanningSubmit = () => {
    const total = calculateTotal()
    
    if (Math.abs(total - 100) > 0.1) {
      toast({
        title: "Invalid Planning",
        description: "Total percentage must equal 100%",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Production Planning Approved",
      description: `Planning for ${planningForm.orderId} has been submitted`,
    })
    
    setPlanningForm({
      orderId: "",
      binA: "",
      binB: "",
      binC: "",
      binD: "",
      binE: "",
      binF: "",
      totalPercentage: 0
    })
  }

  const handleStart24hCleaning = () => {
    if (!cleaningForm.orderId || !cleaningForm.duration) {
      toast({
        title: "Missing Information",
        description: "Please select order and duration",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "24-Hour Cleaning Started",
      description: `${cleaningForm.duration}-hour cleaning process initiated`,
    })
  }

  const handleStart12hCleaning = () => {
    if (!cleaning12Form.orderId || !cleaning12Form.targetMoisture) {
      toast({
        title: "Missing Information", 
        description: "Please set target moisture and select order",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "12-Hour Cleaning Started",
      description: `12-hour cleaning process started with target moisture ${cleaning12Form.targetMoisture}%`,
    })
  }

  const handleStartGrinding = () => {
    if (!grindingForm.orderId) {
      toast({
        title: "Missing Information",
        description: "Please select an order",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Grinding Process Started",
      description: "B1 Scale to Grinding process initiated",
    })
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'planning': return 'text-warning'
      case '24h_cleaning': return 'text-primary'
      case '12h_cleaning': return 'text-primary'
      case 'grinding': return 'text-success'
      default: return 'text-muted-foreground'
    }
  }

  const getStageStatus = (stage: string) => {
    switch (stage) {
      case 'planning': return 'status-pending'
      case '24h_cleaning': return 'status-processing' 
      case '12h_cleaning': return 'status-processing'
      case 'grinding': return 'status-processing'
      default: return 'status-approved'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Cog className="w-8 h-8 text-primary" />
            Production Process
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage production workflow from planning to finished goods
          </p>
        </div>
      </div>

      {/* Active Processes Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeProcesses.map((process) => (
          <Card key={process.id} className="steel-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{process.orderNumber}</CardTitle>
                <Badge className={getStageStatus(process.stage)}>
                  {process.stage.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{process.progress}%</span>
                </div>
                <Progress value={process.progress} className="h-2" />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time Remaining:</span>
                <span className="font-medium text-primary">{process.timeRemaining}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="planning" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="cleaning24h">24H Cleaning</TabsTrigger>
          <TabsTrigger value="cleaning12h">12H Cleaning</TabsTrigger>
          <TabsTrigger value="grinding">Grinding</TabsTrigger>
        </TabsList>

        <TabsContent value="planning" className="space-y-6">
          <Card className="steel-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5" />
                Production Planning
              </CardTitle>
              <CardDescription>
                Plan wheat distribution from pre-cleaning bins (must total 100%)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orderId">Select Production Order *</Label>
                <Select 
                  value={planningForm.orderId} 
                  onValueChange={(value) => setPlanningForm({...planningForm, orderId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select order for planning" />
                  </SelectTrigger>
                  <SelectContent>
                    {orders
                      .filter(order => order.status === 'planning')
                      .map((order) => (
                      <SelectItem key={order.id} value={order.orderNumber}>
                        {order.orderNumber} - {order.productType} ({order.quantity.toLocaleString()} kg)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {bins.map((bin) => (
                  <div key={bin.id} className="space-y-2">
                    <Label htmlFor={`bin${bin.id}`}>
                      {bin.name} ({bin.available.toLocaleString()} kg available)
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={`bin${bin.id}`}
                        placeholder="0"
                        type="number"
                        min="0"
                        max="100"
                        value={planningForm[`bin${bin.id}` as keyof typeof planningForm] as string}
                        onChange={(e) => {
                          setPlanningForm({...planningForm, [`bin${bin.id}`]: e.target.value})
                          setTimeout(calculateTotal, 100)
                        }}
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-lg bg-muted/20 border">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Percentage:</span>
                  <span className={`text-xl font-bold ${
                    Math.abs(planningForm.totalPercentage - 100) < 0.1 ? 'text-success' : 'text-danger'
                  }`}>
                    {planningForm.totalPercentage.toFixed(1)}%
                  </span>
                </div>
                {Math.abs(planningForm.totalPercentage - 100) > 0.1 && (
                  <p className="text-sm text-danger mt-1">
                    Total must equal 100% to proceed
                  </p>
                )}
              </div>

              <Button 
                onClick={handlePlanningSubmit} 
                className="primary-gradient w-full"
                disabled={Math.abs(planningForm.totalPercentage - 100) > 0.1}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Planning & Start Transfer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cleaning24h" className="space-y-6">
          <Card className="steel-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="w-5 h-5" />
                24-Hour Cleaning Process
              </CardTitle>
              <CardDescription>
                Start and monitor 24-hour cleaning with moisture and waste tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orderSelect">Select Order *</Label>
                  <Select 
                    value={cleaningForm.orderId} 
                    onValueChange={(value) => setCleaning24Form({...cleaningForm, orderId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select order" />
                    </SelectTrigger>
                    <SelectContent>
                      {orders.map((order) => (
                        <SelectItem key={order.id} value={order.orderNumber}>
                          {order.orderNumber} - {order.productType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration *</Label>
                  <Select 
                    value={cleaningForm.duration} 
                    onValueChange={(value) => setCleaning24Form({...cleaningForm, duration: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24">24 Hours</SelectItem>
                      <SelectItem value="12">12 Hours</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="moistureIn">Input Moisture (%)</Label>
                  <Input
                    id="moistureIn"
                    placeholder="14.5"
                    type="number"
                    step="0.1"
                    value={cleaningForm.moistureIn}
                    onChange={(e) => setCleaning24Form({...cleaningForm, moistureIn: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="waterAdded">Water Added (liters)</Label>
                  <Input
                    id="waterAdded"
                    placeholder="500"
                    type="number"
                    value={cleaningForm.waterAdded}
                    onChange={(e) => setCleaning24Form({...cleaningForm, waterAdded: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleStart24hCleaning} className="primary-gradient flex-1">
                  <Play className="w-4 h-4 mr-2" />
                  Start 24H Cleaning
                </Button>
                <Button variant="outline">
                  <Camera className="w-4 h-4 mr-2" />
                  Upload Evidence
                </Button>
              </div>

              {/* Process Completion Section */}
              <Card className="bg-muted/20">
                <CardHeader>
                  <CardTitle className="text-lg">Process Completion</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="moistureOut">Output Moisture (%)</Label>
                      <Input
                        id="moistureOut"
                        placeholder="12.2"
                        type="number"
                        step="0.1"
                        value={cleaningForm.moistureOut}
                        onChange={(e) => setCleaning24Form({...cleaningForm, moistureOut: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="wasteCollected">Waste Collected (kg)</Label>
                      <Input
                        id="wasteCollected"
                        placeholder="45.5"
                        type="number"
                        step="0.1"
                        value={cleaningForm.wasteCollected}
                        onChange={(e) => setCleaning24Form({...cleaningForm, wasteCollected: e.target.value})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cleaning12h" className="space-y-6">
          <Card className="steel-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="w-5 h-5" />
                12-Hour Cleaning Process
              </CardTitle>
              <CardDescription>
                Final cleaning with moisture target and completion tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="order12h">Select Order *</Label>
                  <Select 
                    value={cleaning12Form.orderId} 
                    onValueChange={(value) => setCleaning12Form({...cleaning12Form, orderId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select order" />
                    </SelectTrigger>
                    <SelectContent>
                      {orders.map((order) => (
                        <SelectItem key={order.id} value={order.orderNumber}>
                          {order.orderNumber} - {order.productType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetMoisture">Target Moisture (%) *</Label>
                  <Input
                    id="targetMoisture"
                    placeholder="11.5"
                    type="number"
                    step="0.1"
                    value={cleaning12Form.targetMoisture}
                    onChange={(e) => setCleaning12Form({...cleaning12Form, targetMoisture: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="actualMoisture">Actual Moisture (%)</Label>
                  <Input
                    id="actualMoisture"
                    placeholder="11.8"
                    type="number"
                    step="0.1"
                    value={cleaning12Form.actualMoisture}
                    onChange={(e) => setCleaning12Form({...cleaning12Form, actualMoisture: e.target.value})}
                  />
                </div>
              </div>

              <Button onClick={handleStart12hCleaning} className="primary-gradient w-full">
                <Play className="w-4 h-4 mr-2" />
                Start 12H Cleaning Process
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grinding" className="space-y-6">
          <Card className="steel-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cog className="w-5 h-5" />
                Grinding Process (B1 Scale)
              </CardTitle>
              <CardDescription>
                Final production stage with product ratio tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="grindingOrder">Select Order *</Label>
                <Select 
                  value={grindingForm.orderId} 
                  onValueChange={(value) => setGrindingForm({...grindingForm, orderId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select order for grinding" />
                  </SelectTrigger>
                  <SelectContent>
                    {orders.map((order) => (
                      <SelectItem key={order.id} value={order.orderNumber}>
                        {order.orderNumber} - {order.productType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mainProducts">Main Products (kg)</Label>
                  <Input
                    id="mainProducts"
                    placeholder="75000"
                    type="number"
                    value={grindingForm.mainProducts}
                    onChange={(e) => setGrindingForm({...grindingForm, mainProducts: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="branProduced">Bran Produced (kg)</Label>
                  <Input
                    id="branProduced"
                    placeholder="25000"
                    type="number"
                    value={grindingForm.branProduced}
                    onChange={(e) => setGrindingForm({...grindingForm, branProduced: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalProcessed">Total Processed (kg)</Label>
                  <Input
                    id="totalProcessed"
                    placeholder="100000"
                    type="number"
                    value={grindingForm.totalProcessed}
                    onChange={(e) => setGrindingForm({...grindingForm, totalProcessed: e.target.value})}
                    className="bg-muted"
                    readOnly
                  />
                </div>
              </div>

              {/* Product Ratio Alert */}
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  <span className="font-medium">Product Ratio Guidelines</span>
                </div>
                <div className="text-sm space-y-1">
                  <p>• Main Products: 75-77% (Expected)</p>
                  <p>• Bran: 23-25% (Expected)</p>
                  <p className="text-warning font-medium">
                    ⚠️ Alert if bran ratio exceeds 25%
                  </p>
                </div>
              </div>

              <Button onClick={handleStartGrinding} className="primary-gradient w-full">
                <Cog className="w-4 h-4 mr-2" />
                Start Grinding Process
              </Button>

              {/* Machine Cleaning Reminder */}
              <Card className="bg-muted/20">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Timer className="w-5 h-5" />
                    Hourly Machine Cleaning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/20">
                    <div>
                      <p className="font-medium">B1 Scale cleaning in 10 minutes</p>
                      <p className="text-sm text-muted-foreground">Upload before/after photos</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Camera className="w-4 h-4 mr-2" />
                      Start Cleaning
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProductionProcess