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
  Factory, 
  ArrowRightLeft,
  AlertTriangle,
  Clock,
  Camera,
  Trash2,
  Settings,
  Timer,
  CheckCircle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const PreCleaning = () => {
  const { toast } = useToast()
  
  const [bins] = useState([
    { id: 1, name: "Bin A", capacity: 25000, current: 18000, type: "25T" },
    { id: 2, name: "Bin B", capacity: 25000, current: 22000, type: "25T" },
    { id: 3, name: "Bin C", capacity: 25000, current: 15000, type: "25T" },
    { id: 4, name: "Bin D", capacity: 25000, current: 20000, type: "25T" },
    { id: 5, name: "Bin E", capacity: 65000, current: 45000, type: "65T" },
    { id: 6, name: "Bin F", capacity: 65000, current: 52000, type: "65T" }
  ])

  const [godowns] = useState([
    { id: 1, name: "Godown A - Mill", type: "mill", current: 3200 },
    { id: 2, name: "Godown B - Low Mill", type: "low_mill", current: 1800 },
    { id: 3, name: "Godown C - HD", type: "hd", current: 2400 }
  ])

  const [machines] = useState([
    { 
      id: 1, 
      name: "Drum Shield", 
      type: "drum_shield",
      lastCleaned: "2 hours 45 minutes ago",
      nextCleaningIn: "15 minutes",
      wasteType: "Plastic, Cotton String, Thread",
      status: "warning"
    },
    { 
      id: 2, 
      name: "Magnets Machine", 
      type: "magnets",
      lastCleaned: "1 hour 30 minutes ago", 
      nextCleaningIn: "1 hour 30 minutes",
      wasteType: "Metal Particles",
      status: "ok"
    },
    { 
      id: 3, 
      name: "Separator", 
      type: "separator",
      lastCleaned: "45 minutes ago",
      nextCleaningIn: "2 hours 15 minutes", 
      wasteType: "Stones",
      status: "ok"
    }
  ])

  const [transferForm, setTransferForm] = useState({
    fromGodown: "",
    toBin: "",
    quantity: "",
    remarks: ""
  })

  const [wasteForm, setWasteForm] = useState({
    machine: "",
    wasteWeight: "",
    date: new Date().toISOString().split('T')[0]
  })

  const [activeTransfers] = useState([
    {
      id: 1,
      from: "Godown A",
      to: "Bin C", 
      quantity: 5000,
      startTime: "10:30 AM",
      estimatedCompletion: "11:45 AM",
      progress: 65
    }
  ])

  const handleTransfer = () => {
    if (!transferForm.fromGodown || !transferForm.toBin || !transferForm.quantity) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Transfer Initiated", 
      description: `${transferForm.quantity} kg transfer from ${transferForm.fromGodown} to ${transferForm.toBin} started`,
    })
    
    setTransferForm({
      fromGodown: "",
      toBin: "",
      quantity: "",
      remarks: ""
    })
  }

  const handleWasteEntry = () => {
    if (!wasteForm.machine || !wasteForm.wasteWeight) {
      toast({
        title: "Missing Information",
        description: "Please select machine and enter waste weight",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Waste Entry Recorded",
      description: `${wasteForm.wasteWeight} kg waste recorded for ${wasteForm.machine}`,
    })
    
    setWasteForm({
      machine: "",
      wasteWeight: "",
      date: new Date().toISOString().split('T')[0]
    })
  }

  const handleCleaningReminder = (machineId: number) => {
    toast({
      title: "Cleaning Initiated",
      description: "Upload before and after cleaning photos",
    })
  }

  const getUtilization = (current: number, capacity: number) => {
    return Math.round((current / capacity) * 100)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'warning': return 'text-warning'
      case 'danger': return 'text-danger' 
      default: return 'text-success'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'warning': return 'status-pending'
      case 'danger': return 'status-rejected'
      default: return 'status-approved'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Factory className="w-8 h-8 text-primary" />
            Pre-Cleaning Process
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage pre-cleaning bins, transfers, and machine maintenance
          </p>
        </div>
      </div>

      <Tabs defaultValue="bins" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bins">Bin Configuration</TabsTrigger>
          <TabsTrigger value="transfer">Transfer Operations</TabsTrigger>
          <TabsTrigger value="machines">Machine Cleaning</TabsTrigger>
          <TabsTrigger value="waste">Waste Management</TabsTrigger>
        </TabsList>

        <TabsContent value="bins" className="space-y-6">
          {/* Pre-cleaning Bins Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bins.map((bin) => {
              const utilization = getUtilization(bin.current, bin.capacity)
              return (
                <Card key={bin.id} className="steel-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{bin.name}</CardTitle>
                      <Badge variant="outline">{bin.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Capacity Utilization</span>
                        <span className={utilization >= 90 ? 'text-danger' : utilization >= 70 ? 'text-warning' : 'text-success'}>
                          {utilization}%
                        </span>
                      </div>
                      <Progress value={utilization} className="h-2" />
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current:</span>
                        <span className="font-medium">{bin.current.toLocaleString()} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Capacity:</span>
                        <span className="font-medium">{bin.capacity.toLocaleString()} kg</span>
                      </div>
                      <div className="flex justify-between border-t pt-1">
                        <span className="text-muted-foreground">Available:</span>
                        <span className="font-medium text-success">
                          {(bin.capacity - bin.current).toLocaleString()} kg
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="transfer" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transfer Form */}
            <Card className="steel-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5" />
                  Godown to Pre-cleaning Transfer
                </CardTitle>
                <CardDescription>
                  Transfer wheat from godown to pre-cleaning bins
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fromGodown">From Godown *</Label>
                  <Select 
                    value={transferForm.fromGodown} 
                    onValueChange={(value) => setTransferForm({...transferForm, fromGodown: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select godown" />
                    </SelectTrigger>
                    <SelectContent>
                      {godowns.map((godown) => (
                        <SelectItem key={godown.id} value={godown.name}>
                          {godown.name} - {godown.current.toLocaleString()} kg available
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="toBin">To Pre-cleaning Bin *</Label>
                  <Select 
                    value={transferForm.toBin} 
                    onValueChange={(value) => setTransferForm({...transferForm, toBin: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select bin" />
                    </SelectTrigger>
                    <SelectContent>
                      {bins
                        .filter(bin => bin.current < bin.capacity)
                        .map((bin) => (
                        <SelectItem key={bin.id} value={bin.name}>
                          {bin.name} - {(bin.capacity - bin.current).toLocaleString()} kg available
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (kg) *</Label>
                  <Input
                    id="quantity"
                    placeholder="5000"
                    type="number"
                    value={transferForm.quantity}
                    onChange={(e) => setTransferForm({...transferForm, quantity: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="remarks">Remarks</Label>
                  <Input
                    id="remarks"
                    placeholder="Transfer notes..."
                    value={transferForm.remarks}
                    onChange={(e) => setTransferForm({...transferForm, remarks: e.target.value})}
                  />
                </div>

                <Button onClick={handleTransfer} className="primary-gradient w-full">
                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                  Start Transfer
                </Button>
              </CardContent>
            </Card>

            {/* Active Transfers */}
            <Card className="steel-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="w-5 h-5" />
                  Active Transfers
                </CardTitle>
                <CardDescription>
                  Currently running transfer operations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeTransfers.length > 0 ? (
                  activeTransfers.map((transfer) => (
                    <div key={transfer.id} className="p-3 rounded-lg border bg-muted/20">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{transfer.from} → {transfer.to}</h4>
                          <Badge className="status-processing">In Progress</Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{transfer.progress}%</span>
                          </div>
                          <Progress value={transfer.progress} className="h-2" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span>Quantity: </span>
                            <span className="font-medium">{transfer.quantity.toLocaleString()} kg</span>
                          </div>
                          <div>
                            <span>ETA: </span>
                            <span className="font-medium">{transfer.estimatedCompletion}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">No active transfers</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="machines" className="space-y-6">
          {/* Machine Cleaning Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {machines.map((machine) => (
              <Card key={machine.id} className="steel-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{machine.name}</CardTitle>
                    <Badge className={getStatusBadge(machine.status)}>
                      {machine.status === 'warning' ? 'Cleaning Due' : 'OK'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Waste Type:</span>
                      <p className="font-medium">{machine.wasteType}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last Cleaned:</span>
                      <p className="font-medium">{machine.lastCleaned}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Next Cleaning:</span>
                      <p className={`font-medium ${getStatusColor(machine.status)}`}>
                        {machine.nextCleaningIn}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleCleaningReminder(machine.id)}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Start Cleaning Process
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Cleaning Reminders */}
          <Card className="steel-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Cleaning Reminders
              </CardTitle>
              <CardDescription>
                Automated reminders for machine maintenance (every 3 hours)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                    <div>
                      <p className="font-medium">Drum Shield cleaning in 5 minutes</p>
                      <p className="text-sm text-muted-foreground">Upload before and after photos</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Start Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="waste" className="space-y-6">
          {/* Daily Waste Entry */}
          <Card className="steel-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Daily Waste Entry
              </CardTitle>
              <CardDescription>
                Record end-of-day waste collection from machines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="machine">Machine *</Label>
                  <Select 
                    value={wasteForm.machine} 
                    onValueChange={(value) => setWasteForm({...wasteForm, machine: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select machine" />
                    </SelectTrigger>
                    <SelectContent>
                      {machines.map((machine) => (
                        <SelectItem key={machine.id} value={machine.name}>
                          {machine.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wasteWeight">Waste Weight (kg) *</Label>
                  <Input
                    id="wasteWeight"
                    placeholder="25.5"
                    type="number"
                    step="0.1"
                    value={wasteForm.wasteWeight}
                    onChange={(e) => setWasteForm({...wasteForm, wasteWeight: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={wasteForm.date}
                    onChange={(e) => setWasteForm({...wasteForm, date: e.target.value})}
                  />
                </div>
              </div>

              <Button onClick={handleWasteEntry} className="primary-gradient">
                <Trash2 className="w-4 h-4 mr-2" />
                Record Waste Entry
              </Button>
            </CardContent>
          </Card>

          {/* Today's Waste Summary */}
          <Card className="steel-shadow">
            <CardHeader>
              <CardTitle>Today's Waste Collection</CardTitle>
              <CardDescription>
                Summary of waste collected from all machines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-muted/20">
                  <div className="text-center">
                    <p className="text-2xl font-bold">45.2 kg</p>
                    <p className="text-sm text-muted-foreground">Drum Shield</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted/20">
                  <div className="text-center">
                    <p className="text-2xl font-bold">12.8 kg</p>
                    <p className="text-sm text-muted-foreground">Magnets Machine</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted/20">
                  <div className="text-center">
                    <p className="text-2xl font-bold">28.5 kg</p>
                    <p className="text-sm text-muted-foreground">Separator</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Waste (to be subtracted from godowns):</span>
                  <span className="text-xl font-bold text-primary">86.5 kg</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PreCleaning