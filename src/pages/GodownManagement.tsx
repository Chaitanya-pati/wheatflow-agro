import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Warehouse, 
  Plus,
  ArrowRightLeft,
  Package,
  TrendingUp,
  MapPin
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const GodownManagement = () => {
  const { toast } = useToast()
  
  const [godowns] = useState([
    {
      id: 1,
      name: "Godown A - Mill",
      type: "mill",
      capacity: 5000,
      current: 3200,
      location: "Section A1"
    },
    {
      id: 2,
      name: "Godown B - Low Mill",
      type: "low_mill", 
      capacity: 3000,
      current: 1800,
      location: "Section B1"
    },
    {
      id: 3,
      name: "Godown C - HD",
      type: "hd",
      capacity: 4000,
      current: 2400,
      location: "Section C1"
    }
  ])

  const [weighedVehicles] = useState([
    {
      id: 1,
      vehicleNumber: "GJ-05-AB-1234",
      supplier: "ABC Traders",
      category: "mill",
      netWeight: 17000,
      status: "ready_to_unload"
    },
    {
      id: 2,
      vehicleNumber: "RJ-14-EF-9012", 
      supplier: "DEF Industries",
      category: "low_mill",
      netWeight: 15500,
      status: "ready_to_unload"
    }
  ])

  const [unloadForm, setUnloadForm] = useState({
    vehicleId: "",
    godownId: "",
    unloadWeight: "",
    remarks: ""
  })

  const [transferForm, setTransferForm] = useState({
    fromGodown: "",
    toGodown: "",
    quantity: "",
    reason: ""
  })

  const handleUnload = () => {
    if (!unloadForm.vehicleId || !unloadForm.godownId || !unloadForm.unloadWeight) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Unloading Recorded", 
      description: `${unloadForm.unloadWeight} kg unloaded successfully`,
    })
    
    // Reset form
    setUnloadForm({
      vehicleId: "",
      godownId: "",
      unloadWeight: "",
      remarks: ""
    })
  }

  const handleTransfer = () => {
    if (!transferForm.fromGodown || !transferForm.toGodown || !transferForm.quantity) {
      toast({
        title: "Missing Information",
        description: "Please fill all transfer details", 
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Transfer Completed",
      description: `${transferForm.quantity} kg transferred successfully`,
    })
    
    // Reset form
    setTransferForm({
      fromGodown: "",
      toGodown: "",
      quantity: "",
      reason: ""
    })
  }

  const getUtilization = (current: number, capacity: number) => {
    return Math.round((current / capacity) * 100)
  }

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return "text-danger"
    if (percentage >= 70) return "text-warning"
    return "text-success"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Warehouse className="w-8 h-8 text-primary" />
            Godown Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage warehouse inventory and transfers
          </p>
        </div>
      </div>

      {/* Godown Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {godowns.map((godown) => {
          const utilization = getUtilization(godown.current, godown.capacity)
          return (
            <Card key={godown.id} className="steel-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{godown.name}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {godown.type.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {godown.location}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Utilization</span>
                    <span className={getUtilizationColor(utilization)}>
                      {utilization}%
                    </span>
                  </div>
                  <Progress 
                    value={utilization} 
                    className="h-2"
                  />
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current:</span>
                    <span className="font-medium">{godown.current.toLocaleString()} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capacity:</span>
                    <span className="font-medium">{godown.capacity.toLocaleString()} kg</span>
                  </div>
                  <div className="flex justify-between border-t pt-1">
                    <span className="text-muted-foreground">Available:</span>
                    <span className="font-medium text-success">
                      {(godown.capacity - godown.current).toLocaleString()} kg
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unloading */}
        <Card className="steel-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Unload to Godown
            </CardTitle>
            <CardDescription>
              Unload weighed vehicles to appropriate godowns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle">Select Vehicle *</Label>
                <Select 
                  value={unloadForm.vehicleId} 
                  onValueChange={(value) => setUnloadForm({...unloadForm, vehicleId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select weighed vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {weighedVehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.vehicleNumber}>
                        {vehicle.vehicleNumber} - {vehicle.netWeight} kg ({vehicle.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="godown">Select Godown *</Label>
                <Select 
                  value={unloadForm.godownId} 
                  onValueChange={(value) => setUnloadForm({...unloadForm, godownId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select godown" />
                  </SelectTrigger>
                  <SelectContent>
                    {godowns.map((godown) => (
                      <SelectItem key={godown.id} value={godown.id.toString()}>
                        {godown.name} - Available: {(godown.capacity - godown.current).toLocaleString()} kg
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unloadWeight">Unload Weight (kg) *</Label>
                <Input
                  id="unloadWeight"
                  placeholder="17000"
                  type="number"
                  value={unloadForm.unloadWeight}
                  onChange={(e) => setUnloadForm({...unloadForm, unloadWeight: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Input
                  id="remarks"
                  placeholder="Any notes..."
                  value={unloadForm.remarks}
                  onChange={(e) => setUnloadForm({...unloadForm, remarks: e.target.value})}
                />
              </div>
            </div>

            <Button onClick={handleUnload} className="primary-gradient w-full">
              <Plus className="w-4 h-4 mr-2" />
              Record Unloading
            </Button>
          </CardContent>
        </Card>

        {/* Inter-Godown Transfer */}
        <Card className="steel-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5" />
              Inter-Godown Transfer
            </CardTitle>
            <CardDescription>
              Transfer inventory between godowns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fromGodown">From Godown *</Label>
                <Select 
                  value={transferForm.fromGodown} 
                  onValueChange={(value) => setTransferForm({...transferForm, fromGodown: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source godown" />
                  </SelectTrigger>
                  <SelectContent>
                    {godowns
                      .filter(g => g.current > 0)
                      .map((godown) => (
                      <SelectItem key={godown.id} value={godown.id.toString()}>
                        {godown.name} - Current: {godown.current.toLocaleString()} kg
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="toGodown">To Godown *</Label>
                <Select 
                  value={transferForm.toGodown} 
                  onValueChange={(value) => setTransferForm({...transferForm, toGodown: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination godown" />
                  </SelectTrigger>
                  <SelectContent>
                    {godowns
                      .filter(g => g.id.toString() !== transferForm.fromGodown)
                      .map((godown) => (
                      <SelectItem key={godown.id} value={godown.id.toString()}>
                        {godown.name} - Available: {(godown.capacity - godown.current).toLocaleString()} kg
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity (kg) *</Label>
                <Input
                  id="quantity"
                  placeholder="1000"
                  type="number"
                  value={transferForm.quantity}
                  onChange={(e) => setTransferForm({...transferForm, quantity: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Input
                  id="reason"
                  placeholder="Transfer reason..."
                  value={transferForm.reason}
                  onChange={(e) => setTransferForm({...transferForm, reason: e.target.value})}
                />
              </div>
            </div>

            <Button onClick={handleTransfer} className="success-gradient w-full text-white">
              <ArrowRightLeft className="w-4 h-4 mr-2" />
              Transfer Inventory
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default GodownManagement