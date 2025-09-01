import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Scale, 
  Truck, 
  CheckCircle,
  Clock,
  Weight,
  Calculator
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const WeightManagement = () => {
  const { toast } = useToast()
  
  const [approvedVehicles] = useState([
    {
      id: 1,
      vehicleNumber: "RJ-14-EF-9012",
      supplier: "DEF Industries",
      category: "Mill Grade",
      grossWeight: null,
      tareWeight: null,
      netWeight: null,
      status: "approved"
    },
    {
      id: 2,
      vehicleNumber: "GJ-05-AB-1234", 
      supplier: "ABC Traders",
      category: "Low Mill Grade",
      grossWeight: 25000,
      tareWeight: 8000,
      netWeight: 17000,
      status: "weighed"
    }
  ])

  const [weightForm, setWeightForm] = useState({
    vehicleId: "",
    grossWeight: "",
    tareWeight: "",
    netWeight: "",
    weighingType: "before"
  })

  const calculateNetWeight = () => {
    const gross = parseFloat(weightForm.grossWeight) || 0
    const tare = parseFloat(weightForm.tareWeight) || 0
    const net = gross - tare
    setWeightForm({...weightForm, netWeight: net.toString()})
  }

  const handleWeightSubmit = () => {
    if (!weightForm.vehicleId || !weightForm.grossWeight || !weightForm.tareWeight) {
      toast({
        title: "Missing Information",
        description: "Please fill all weight fields",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Weight Recorded",
      description: `Weight details for vehicle ${weightForm.vehicleId} have been recorded`,
    })
    
    // Reset form
    setWeightForm({
      vehicleId: "",
      grossWeight: "",
      tareWeight: "",
      netWeight: "",
      weighingType: "before"
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Scale className="w-8 h-8 text-primary" />
            Weight Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Record and manage vehicle weights before and after unloading
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weight Entry Form */}
        <Card className="lg:col-span-2 steel-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Weight className="w-5 h-5" />
              Record Weight
            </CardTitle>
            <CardDescription>
              Enter vehicle weight measurements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle">Select Vehicle *</Label>
                <Select 
                  value={weightForm.vehicleId} 
                  onValueChange={(value) => setWeightForm({...weightForm, vehicleId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select approved vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {approvedVehicles
                      .filter(v => v.status === "approved")
                      .map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.vehicleNumber}>
                        {vehicle.vehicleNumber} - {vehicle.supplier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weighingType">Weighing Type *</Label>
                <Select 
                  value={weightForm.weighingType} 
                  onValueChange={(value) => setWeightForm({...weightForm, weighingType: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="before">Before Unloading</SelectItem>
                    <SelectItem value="after">After Unloading</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="grossWeight">Gross Weight (kg) *</Label>
                <Input
                  id="grossWeight"
                  placeholder="25000"
                  type="number"
                  value={weightForm.grossWeight}
                  onChange={(e) => setWeightForm({...weightForm, grossWeight: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tareWeight">Tare Weight (kg) *</Label>
                <Input
                  id="tareWeight"
                  placeholder="8000"
                  type="number" 
                  value={weightForm.tareWeight}
                  onChange={(e) => setWeightForm({...weightForm, tareWeight: e.target.value})}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Label htmlFor="netWeight">Net Weight (kg)</Label>
                    <Input
                      id="netWeight"
                      placeholder="17000"
                      type="number"
                      value={weightForm.netWeight}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={calculateNetWeight}
                    className="mt-6"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate
                  </Button>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button onClick={handleWeightSubmit} className="primary-gradient w-full">
                <CheckCircle className="w-4 h-4 mr-2" />
                Record Weight
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Status */}
        <Card className="steel-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Vehicle Status
            </CardTitle>
            <CardDescription>
              Approved vehicles for weighing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {approvedVehicles.map((vehicle) => (
              <div key={vehicle.id} className="p-3 rounded-lg border bg-muted/20">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{vehicle.vehicleNumber}</h4>
                    <Badge className={
                      vehicle.status === 'weighed' ? 'status-approved' : 'status-pending'
                    }>
                      {vehicle.status === 'weighed' ? 'Weighed' : 'Pending'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>{vehicle.supplier}</p>
                    <p className="font-medium text-primary">{vehicle.category}</p>
                  </div>

                  {vehicle.netWeight && (
                    <div className="mt-2 p-2 bg-success/10 rounded text-sm">
                      <div className="flex justify-between">
                        <span>Gross:</span>
                        <span>{vehicle.grossWeight} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tare:</span>
                        <span>{vehicle.tareWeight} kg</span>
                      </div>
                      <div className="flex justify-between font-medium border-t pt-1">
                        <span>Net:</span>
                        <span className="text-success">{vehicle.netWeight} kg</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default WeightManagement