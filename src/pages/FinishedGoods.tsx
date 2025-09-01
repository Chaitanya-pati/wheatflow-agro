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
  Package, 
  ArrowRightLeft,
  Warehouse,
  ShoppingBag,
  Scale,
  MapPin,
  Plus
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const FinishedGoods = () => {
  const { toast } = useToast()
  
  const [packingForm, setPackingForm] = useState({
    productType: "",
    bagWeight: "",
    numberOfBags: "",
    storageArea: "",
    remarks: ""
  })

  const [transferForm, setTransferForm] = useState({
    fromArea: "",
    toArea: "",
    productType: "",
    quantity: "",
    reason: ""
  })

  const [shallowForm, setShallowForm] = useState({
    productType: "",
    quantity: "",
    storageArea: "",
    remarks: ""
  })

  const [products] = useState([
    {
      id: 1,
      name: "Maida Premium",
      totalStock: 15000,
      bags30kg: 200,
      bags50kg: 100,
      shallowStock: 5000,
      storageAreas: [
        { area: "A", quantity: 8000 },
        { area: "B", quantity: 7000 }
      ]
    },
    {
      id: 2,
      name: "Chakki Atta",
      totalStock: 22000,
      bags30kg: 300,
      bags50kg: 200,
      shallowStock: 7000,
      storageAreas: [
        { area: "C", quantity: 12000 },
        { area: "D", quantity: 10000 }
      ]
    },
    {
      id: 3,
      name: "Suji",
      totalStock: 8000,
      bags25kg: 150,
      bags30kg: 100,
      shallowStock: 3500,
      storageAreas: [
        { area: "A", quantity: 4500 },
        { area: "B", quantity: 3500 }
      ]
    },
    {
      id: 4,
      name: "Bran",
      totalStock: 5500,
      bags30kg: 80,
      bags50kg: 60,
      shallowStock: 2000,
      storageAreas: [
        { area: "D", quantity: 3500 },
        { area: "C", quantity: 2000 }
      ]
    }
  ])

  const [storageAreas] = useState([
    {
      id: "A",
      name: "Storage Area A",
      capacity: 25000,
      current: 12500,
      products: ["Maida Premium", "Suji"]
    },
    {
      id: "B", 
      name: "Storage Area B",
      capacity: 30000,
      current: 10500,
      products: ["Maida Premium", "Suji"]
    },
    {
      id: "C",
      name: "Storage Area C",
      capacity: 35000,
      current: 14000,
      products: ["Chakki Atta", "Bran"]
    },
    {
      id: "D",
      name: "Storage Area D",
      capacity: 28000,
      current: 13500,
      products: ["Chakki Atta", "Bran"]
    }
  ])

  const bagWeights = ["25kg", "30kg", "50kg"]

  const handlePacking = () => {
    if (!packingForm.productType || !packingForm.bagWeight || !packingForm.numberOfBags) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      })
      return
    }

    const weight = parseInt(packingForm.bagWeight)
    const bags = parseInt(packingForm.numberOfBags)
    const totalWeight = weight * bags

    toast({
      title: "Packing Recorded",
      description: `${bags} bags of ${packingForm.productType} (${totalWeight} kg) packed successfully`,
    })
    
    setPackingForm({
      productType: "",
      bagWeight: "",
      numberOfBags: "",
      storageArea: "",
      remarks: ""
    })
  }

  const handleShallowStorage = () => {
    if (!shallowForm.productType || !shallowForm.quantity || !shallowForm.storageArea) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Shallow Storage Updated",
      description: `${shallowForm.quantity} kg of ${shallowForm.productType} stored in ${shallowForm.storageArea}`,
    })
    
    setShallowForm({
      productType: "",
      quantity: "",
      storageArea: "",
      remarks: ""
    })
  }

  const handleTransfer = () => {
    if (!transferForm.fromArea || !transferForm.toArea || !transferForm.quantity) {
      toast({
        title: "Missing Information",
        description: "Please fill all transfer details",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Transfer Completed",
      description: `${transferForm.quantity} kg transferred from ${transferForm.fromArea} to ${transferForm.toArea}`,
    })
    
    setTransferForm({
      fromArea: "",
      toArea: "",
      productType: "",
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
            <Package className="w-8 h-8 text-primary" />
            Finished Goods Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage packaging, storage, and inventory of finished products
          </p>
        </div>
      </div>

      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inventory">Inventory Overview</TabsTrigger>
          <TabsTrigger value="packing">Packing</TabsTrigger>
          <TabsTrigger value="storage">Shallow Storage</TabsTrigger>
          <TabsTrigger value="transfer">Inter-Area Transfer</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6">
          {/* Product Inventory Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="steel-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{product.name}</span>
                    <Badge variant="outline">
                      {product.totalStock.toLocaleString()} kg
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Bagged Inventory */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Packed Bags</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {product.bags30kg && (
                        <div className="flex justify-between">
                          <span>30kg bags:</span>
                          <span className="font-medium">{product.bags30kg}</span>
                        </div>
                      )}
                      {product.bags50kg && (
                        <div className="flex justify-between">
                          <span>50kg bags:</span>
                          <span className="font-medium">{product.bags50kg}</span>
                        </div>
                      )}
                      {product.bags25kg && (
                        <div className="flex justify-between">
                          <span>25kg bags:</span>
                          <span className="font-medium">{product.bags25kg}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Shallow Storage */}
                  <div className="p-3 rounded-lg bg-muted/20">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Shallow Storage:</span>
                      <span className="font-medium">{product.shallowStock.toLocaleString()} kg</span>
                    </div>
                  </div>

                  {/* Storage Area Distribution */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Storage Distribution</h4>
                    {product.storageAreas.map((area, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span>Area {area.area}:</span>
                        </div>
                        <span className="font-medium">{area.quantity.toLocaleString()} kg</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Storage Areas Overview */}
          <Card className="steel-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Warehouse className="w-5 h-5" />
                Storage Areas Utilization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {storageAreas.map((area) => {
                  const utilization = getUtilization(area.current, area.capacity)
                  return (
                    <div key={area.id} className="p-4 rounded-lg border bg-muted/20">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{area.name}</h4>
                          <span className={`text-sm font-medium ${getUtilizationColor(utilization)}`}>
                            {utilization}%
                          </span>
                        </div>
                        
                        <Progress value={utilization} className="h-2" />
                        
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Current:</span>
                            <span>{area.current.toLocaleString()} kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Capacity:</span>
                            <span>{area.capacity.toLocaleString()} kg</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground">Products:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {area.products.map((product, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {product.split(' ')[0]}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="packing" className="space-y-6">
          <Card className="steel-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Bag Packing Operation
              </CardTitle>
              <CardDescription>
                Pack finished goods into bags of various weights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productType">Product Type *</Label>
                  <Select 
                    value={packingForm.productType} 
                    onValueChange={(value) => setPackingForm({...packingForm, productType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.name}>
                          {product.name} - {product.shallowStock.toLocaleString()} kg available
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bagWeight">Bag Weight *</Label>
                  <Select 
                    value={packingForm.bagWeight} 
                    onValueChange={(value) => setPackingForm({...packingForm, bagWeight: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select weight" />
                    </SelectTrigger>
                    <SelectContent>
                      {bagWeights.map((weight) => (
                        <SelectItem key={weight} value={weight.replace('kg', '')}>
                          {weight}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="numberOfBags">Number of Bags *</Label>
                  <Input
                    id="numberOfBags"
                    placeholder="100"
                    type="number"
                    value={packingForm.numberOfBags}
                    onChange={(e) => setPackingForm({...packingForm, numberOfBags: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storageAreaPacking">Storage Area</Label>
                  <Select 
                    value={packingForm.storageArea} 
                    onValueChange={(value) => setPackingForm({...packingForm, storageArea: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select storage area" />
                    </SelectTrigger>
                    <SelectContent>
                      {storageAreas.map((area) => (
                        <SelectItem key={area.id} value={area.name}>
                          {area.name} - {(area.capacity - area.current).toLocaleString()} kg available
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="packingRemarks">Remarks</Label>
                  <Input
                    id="packingRemarks"
                    placeholder="Packing notes..."
                    value={packingForm.remarks}
                    onChange={(e) => setPackingForm({...packingForm, remarks: e.target.value})}
                  />
                </div>
              </div>

              {packingForm.bagWeight && packingForm.numberOfBags && (
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Weight:</span>
                    <span className="text-xl font-bold text-primary">
                      {(parseInt(packingForm.bagWeight || "0") * parseInt(packingForm.numberOfBags || "0")).toLocaleString()} kg
                    </span>
                  </div>
                </div>
              )}

              <Button onClick={handlePacking} className="primary-gradient w-full">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Record Packing
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage" className="space-y-6">
          <Card className="steel-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Warehouse className="w-5 h-5" />
                Shallow Storage Management
              </CardTitle>
              <CardDescription>
                Manage bulk storage of finished goods in shallow areas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shallowProduct">Product Type *</Label>
                  <Select 
                    value={shallowForm.productType} 
                    onValueChange={(value) => setShallowForm({...shallowForm, productType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.name}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shallowQuantity">Quantity (kg) *</Label>
                  <Input
                    id="shallowQuantity"
                    placeholder="5000"
                    type="number"
                    value={shallowForm.quantity}
                    onChange={(e) => setShallowForm({...shallowForm, quantity: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shallowStorage">Storage Area *</Label>
                  <Select 
                    value={shallowForm.storageArea} 
                    onValueChange={(value) => setShallowForm({...shallowForm, storageArea: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select storage area" />
                    </SelectTrigger>
                    <SelectContent>
                      {storageAreas.map((area) => (
                        <SelectItem key={area.id} value={area.name}>
                          {area.name} - {(area.capacity - area.current).toLocaleString()} kg available
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shallowRemarks">Remarks</Label>
                  <Input
                    id="shallowRemarks"
                    placeholder="Storage notes..."
                    value={shallowForm.remarks}
                    onChange={(e) => setShallowForm({...shallowForm, remarks: e.target.value})}
                  />
                </div>
              </div>

              <Button onClick={handleShallowStorage} className="primary-gradient w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add to Shallow Storage
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfer" className="space-y-6">
          <Card className="steel-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5" />
                Inter-Area Product Transfer
              </CardTitle>
              <CardDescription>
                Transfer finished goods between storage areas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromArea">From Storage Area *</Label>
                  <Select 
                    value={transferForm.fromArea} 
                    onValueChange={(value) => setTransferForm({...transferForm, fromArea: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select source area" />
                    </SelectTrigger>
                    <SelectContent>
                      {storageAreas
                        .filter(area => area.current > 0)
                        .map((area) => (
                        <SelectItem key={area.id} value={area.name}>
                          {area.name} - {area.current.toLocaleString()} kg current
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="toArea">To Storage Area *</Label>
                  <Select 
                    value={transferForm.toArea} 
                    onValueChange={(value) => setTransferForm({...transferForm, toArea: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination area" />
                    </SelectTrigger>
                    <SelectContent>
                      {storageAreas
                        .filter(area => area.name !== transferForm.fromArea)
                        .map((area) => (
                        <SelectItem key={area.id} value={area.name}>
                          {area.name} - {(area.capacity - area.current).toLocaleString()} kg available
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transferProduct">Product Type</Label>
                  <Select 
                    value={transferForm.productType} 
                    onValueChange={(value) => setTransferForm({...transferForm, productType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.name}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transferQuantity">Quantity (kg) *</Label>
                  <Input
                    id="transferQuantity"
                    placeholder="2000"
                    type="number"
                    value={transferForm.quantity}
                    onChange={(e) => setTransferForm({...transferForm, quantity: e.target.value})}
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="transferReason">Transfer Reason</Label>
                  <Input
                    id="transferReason"
                    placeholder="Reason for transfer..."
                    value={transferForm.reason}
                    onChange={(e) => setTransferForm({...transferForm, reason: e.target.value})}
                  />
                </div>
              </div>

              <Button onClick={handleTransfer} className="success-gradient w-full text-white">
                <ArrowRightLeft className="w-4 h-4 mr-2" />
                Execute Transfer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default FinishedGoods