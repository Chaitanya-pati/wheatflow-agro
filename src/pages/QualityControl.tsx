import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  FlaskConical, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Clock,
  FileText,
  User,
  Scale
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const QualityControl = () => {
  const { toast } = useToast()
  
  const [pendingTests] = useState([
    {
      id: 1,
      vehicleNumber: "GJ-05-AB-1234",
      supplier: "ABC Traders",
      arrivalTime: "10:30 AM",
      samplesTaken: false,
      testResult: "",
      category: "",
      inspector: ""
    },
    {
      id: 2, 
      vehicleNumber: "RJ-14-EF-9012",
      supplier: "DEF Industries",
      arrivalTime: "12:00 PM",
      samplesTaken: true,
      testResult: "pending",
      category: "",
      inspector: "Lab Tech 1"
    }
  ])

  const [qualityForm, setQualityForm] = useState({
    vehicleId: "",
    sampleBags: "",
    moistureContent: "",
    category: "",
    testResult: "",
    remarks: "",
    inspector: ""
  })

  const categories = [
    "Mill Grade",
    "Low Mill Grade", 
    "HD Grade",
    "Premium Grade",
    "Rejected"
  ]

  const inspectors = [
    "Lab Tech 1",
    "Lab Tech 2", 
    "Senior Inspector",
    "Quality Manager"
  ]

  const handleTestSubmit = () => {
    if (!qualityForm.vehicleId || !qualityForm.category || !qualityForm.testResult) {
      toast({
        title: "Missing Information", 
        description: "Please complete all required fields",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Quality Test Completed",
      description: `Test result for vehicle ${qualityForm.vehicleId} has been recorded`,
    })
    
    // Reset form
    setQualityForm({
      vehicleId: "",
      sampleBags: "",
      moistureContent: "",
      category: "",
      testResult: "",
      remarks: "",
      inspector: ""
    })
  }

  const handleApproval = (action: 'approve' | 'reject', vehicleId: string) => {
    toast({
      title: action === 'approve' ? "Vehicle Approved" : "Vehicle Rejected",
      description: `Vehicle ${vehicleId} has been ${action}d for unloading`,
      variant: action === 'approve' ? "default" : "destructive"
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FlaskConical className="w-8 h-8 text-primary" />
            Quality Control
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage quality testing and wheat categorization
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quality Testing Form */}
        <Card className="lg:col-span-2 steel-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5" />
              Quality Testing
            </CardTitle>
            <CardDescription>
              Record quality test results and categorization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle">Select Vehicle *</Label>
                <Select 
                  value={qualityForm.vehicleId} 
                  onValueChange={(value) => setQualityForm({...qualityForm, vehicleId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {pendingTests.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.vehicleNumber}>
                        {vehicle.vehicleNumber} - {vehicle.supplier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sampleBags">Sample Bags (40-50)</Label>
                <Input
                  id="sampleBags"
                  placeholder="45"
                  type="number"
                  value={qualityForm.sampleBags}
                  onChange={(e) => setQualityForm({...qualityForm, sampleBags: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="moisture">Moisture Content (%)</Label>
                <Input
                  id="moisture"
                  placeholder="12.5"
                  type="number" 
                  step="0.1"
                  value={qualityForm.moistureContent}
                  onChange={(e) => setQualityForm({...qualityForm, moistureContent: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={qualityForm.category} 
                  onValueChange={(value) => setQualityForm({...qualityForm, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="testResult">Test Result *</Label>
                <Select 
                  value={qualityForm.testResult} 
                  onValueChange={(value) => setQualityForm({...qualityForm, testResult: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select result" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passed">Passed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="conditional">Conditional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="inspector">Inspector *</Label>
                <Select 
                  value={qualityForm.inspector} 
                  onValueChange={(value) => setQualityForm({...qualityForm, inspector: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select inspector" />
                  </SelectTrigger>
                  <SelectContent>
                    {inspectors.map((inspector) => (
                      <SelectItem key={inspector} value={inspector}>
                        {inspector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Test Remarks</Label>
              <Textarea
                id="remarks"
                placeholder="Any observations or notes..."
                value={qualityForm.remarks}
                onChange={(e) => setQualityForm({...qualityForm, remarks: e.target.value})}
              />
            </div>

            <div className="pt-4">
              <Button onClick={handleTestSubmit} className="primary-gradient w-full">
                <CheckCircle className="w-4 h-4 mr-2" />
                Submit Test Results
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pending Tests */}
        <Card className="steel-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Pending Tests
            </CardTitle>
            <CardDescription>
              Vehicles awaiting quality inspection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingTests.map((test) => (
              <div key={test.id} className="p-3 rounded-lg border bg-muted/20">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">{test.vehicleNumber}</h4>
                    <p className="text-sm text-muted-foreground">{test.supplier}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {test.samplesTaken ? (
                        <CheckCircle className="w-4 h-4 text-success" />
                      ) : (
                        <Clock className="w-4 h-4 text-warning" />
                      )}
                      <span className="text-sm">
                        {test.samplesTaken ? "Samples taken" : "Samples pending"}
                      </span>
                    </div>
                    
                    {test.inspector && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{test.inspector}</span>
                      </div>
                    )}
                  </div>

                  {test.testResult === "pending" && (
                    <div className="flex gap-2 mt-3">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 text-xs"
                        onClick={() => handleApproval('approve', test.vehicleNumber)}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 text-xs"
                        onClick={() => handleApproval('reject', test.vehicleNumber)}
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Reject
                      </Button>
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

export default QualityControl