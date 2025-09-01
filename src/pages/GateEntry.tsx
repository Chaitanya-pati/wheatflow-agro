import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Truck, 
  Upload, 
  Camera, 
  FileText, 
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Plus
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const GateEntry = () => {
  const { toast } = useToast()
  const [vehicleForm, setVehicleForm] = useState({
    vehicleNumber: "",
    supplierName: "",
    driverName: "",
    contactNumber: "",
    billNumber: "",
    arrivalTime: "",
    remarks: ""
  })

  const [pendingVehicles] = useState([
    {
      id: 1,
      vehicleNumber: "GJ-05-AB-1234",
      supplier: "ABC Traders",
      driver: "Ram Kumar",
      arrivalTime: "10:30 AM",
      status: "pending_approval",
      billUploaded: true,
      photosUploaded: false
    },
    {
      id: 2,
      vehicleNumber: "MH-12-CD-5678",
      supplier: "XYZ Suppliers",
      driver: "Shyam Singh", 
      arrivalTime: "11:15 AM",
      status: "photos_pending",
      billUploaded: true,
      photosUploaded: false
    },
    {
      id: 3,
      vehicleNumber: "RJ-14-EF-9012",
      supplier: "DEF Industries",
      driver: "Mohan Lal",
      arrivalTime: "12:00 PM", 
      status: "ready_for_quality",
      billUploaded: true,
      photosUploaded: true
    }
  ])

  const suppliers = [
    "ABC Traders",
    "XYZ Suppliers", 
    "DEF Industries",
    "GHI Enterprises",
    "JKL Trading Co."
  ]

  const handleSubmit = () => {
    if (!vehicleForm.vehicleNumber || !vehicleForm.supplierName || !vehicleForm.driverName) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Vehicle Registered",
      description: `Vehicle ${vehicleForm.vehicleNumber} has been registered successfully`,
    })
    
    // Reset form
    setVehicleForm({
      vehicleNumber: "",
      supplierName: "",
      driverName: "",
      contactNumber: "",
      billNumber: "",
      arrivalTime: "",
      remarks: ""
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_approval':
        return <Badge className="status-pending">Pending Approval</Badge>
      case 'photos_pending':
        return <Badge className="status-processing">Photos Pending</Badge>
      case 'ready_for_quality':
        return <Badge className="status-approved">Ready for Quality Check</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Truck className="w-8 h-8 text-primary" />
            Gate Entry
          </h1>
          <p className="text-muted-foreground mt-1">
            Register incoming vehicles and manage gate operations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicle Registration Form */}
        <Card className="lg:col-span-2 steel-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Register New Vehicle
            </CardTitle>
            <CardDescription>
              Enter vehicle details and upload required documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
                <Input
                  id="vehicleNumber"
                  placeholder="GJ-05-AB-1234"
                  value={vehicleForm.vehicleNumber}
                  onChange={(e) => setVehicleForm({...vehicleForm, vehicleNumber: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier *</Label>
                <Select 
                  value={vehicleForm.supplierName} 
                  onValueChange={(value) => setVehicleForm({...vehicleForm, supplierName: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier} value={supplier}>
                        {supplier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="driver">Driver Name *</Label>
                <Input
                  id="driver"
                  placeholder="Ram Kumar"
                  value={vehicleForm.driverName}
                  onChange={(e) => setVehicleForm({...vehicleForm, driverName: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  placeholder="+91 9876543210"
                  value={vehicleForm.contactNumber}
                  onChange={(e) => setVehicleForm({...vehicleForm, contactNumber: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bill">Bill Number</Label>
                <Input
                  id="bill"
                  placeholder="BILL-001"
                  value={vehicleForm.billNumber}
                  onChange={(e) => setVehicleForm({...vehicleForm, billNumber: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="arrivalTime">Arrival Time</Label>
                <Input
                  id="arrivalTime"
                  type="datetime-local"
                  value={vehicleForm.arrivalTime}
                  onChange={(e) => setVehicleForm({...vehicleForm, arrivalTime: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                placeholder="Any additional notes..."
                value={vehicleForm.remarks}
                onChange={(e) => setVehicleForm({...vehicleForm, remarks: e.target.value})}
              />
            </div>

            {/* File Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-3">
                <Label>Bill Upload</Label>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                  <Button variant="outline">
                    <Camera className="w-4 h-4 mr-2" />
                    Live Capture
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Vehicle Photos</Label>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photos
                  </Button>
                  <Button variant="outline">
                    <Camera className="w-4 h-4 mr-2" />
                    Take Photos
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button onClick={handleSubmit} className="primary-gradient w-full">
                <CheckCircle className="w-4 h-4 mr-2" />
                Register Vehicle
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pending Vehicles */}
        <Card className="steel-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Pending Vehicles
            </CardTitle>
            <CardDescription>
              Vehicles awaiting processing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingVehicles.map((vehicle) => (
              <div key={vehicle.id} className="p-3 rounded-lg border bg-muted/20">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{vehicle.vehicleNumber}</h4>
                    {getStatusBadge(vehicle.status)}
                  </div>
                  
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{vehicle.supplier}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{vehicle.arrivalTime}</span>
                    </div>
                  </div>

                  <div className="flex gap-1 mt-2">
                    <div className={`w-2 h-2 rounded-full ${vehicle.billUploaded ? 'bg-success' : 'bg-muted'}`}></div>
                    <span className="text-xs">Bill</span>
                    <div className={`w-2 h-2 rounded-full ml-2 ${vehicle.photosUploaded ? 'bg-success' : 'bg-muted'}`}></div>
                    <span className="text-xs">Photos</span>
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

export default GateEntry