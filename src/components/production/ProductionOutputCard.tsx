import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Package, Scale, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface ProductionOutputCardProps {
  orderId: string
  onPackingComplete?: () => void
}

export const ProductionOutputCard = ({ orderId, onPackingComplete }: ProductionOutputCardProps) => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  const [outputData, setOutputData] = useState({
    mainProduct: {
      type: '',
      quantity: '',
      percentage: ''
    },
    byProducts: [
      { type: 'Bran', quantity: '', percentage: '' },
      { type: 'Shorts', quantity: '', percentage: '' }
    ]
  })

  const [packagingData, setPackagingData] = useState({
    bagWeight: '',
    bagCount: '',
    totalWeight: ''
  })

  const mainProducts = [
    "Maida Premium",
    "Maida Standard", 
    "Chakki Atta",
    "Tandoori Atta",
    "Suji",
    "DP Maida",
    "Loto Maida",
    "Nestle Maida"
  ]

  const bagWeights = ["25", "30", "40", "50"]

  const handleOutputSubmit = async () => {
    if (!outputData.mainProduct.type || !outputData.mainProduct.quantity) {
      toast({
        title: "Missing Information",
        description: "Please enter main product details",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      // Record main product output
      const { error: mainError } = await supabase
        .from('production_outputs')
        .insert({
          order_id: orderId,
          product_type: outputData.mainProduct.type,
          quantity_kg: parseFloat(outputData.mainProduct.quantity),
          percentage: parseFloat(outputData.mainProduct.percentage) || 0,
          is_main_product: true
        })

      if (mainError) throw mainError

      // Record by-products
      const byProductInserts = outputData.byProducts
        .filter(bp => bp.quantity && parseFloat(bp.quantity) > 0)
        .map(bp => ({
          order_id: orderId,
          product_type: bp.type,
          quantity_kg: parseFloat(bp.quantity),
          percentage: parseFloat(bp.percentage) || 0,
          is_main_product: false
        }))

      if (byProductInserts.length > 0) {
        const { error: byProductError } = await supabase
          .from('production_outputs')
          .insert(byProductInserts)

        if (byProductError) throw byProductError
      }

      toast({
        title: "Production Output Recorded",
        description: "Output quantities have been saved successfully"
      })

      // Reset form
      setOutputData({
        mainProduct: { type: '', quantity: '', percentage: '' },
        byProducts: [
          { type: 'Bran', quantity: '', percentage: '' },
          { type: 'Shorts', quantity: '', percentage: '' }
        ]
      })

    } catch (error: any) {
      toast({
        title: "Error recording output",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePackagingSubmit = async () => {
    if (!packagingData.bagWeight || !packagingData.bagCount || !outputData.mainProduct.type) {
      toast({
        title: "Missing Information",
        description: "Please complete packaging details",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const totalWeight = parseInt(packagingData.bagWeight) * parseInt(packagingData.bagCount)

      const { error } = await supabase
        .from('packaging_records')
        .insert({
          order_id: orderId,
          product_type: outputData.mainProduct.type,
          bag_weight_kg: parseInt(packagingData.bagWeight),
          bag_count: parseInt(packagingData.bagCount),
          total_weight_kg: totalWeight
        })

      if (error) throw error

      // Log audit event
      await supabase.rpc('log_audit_event', {
        p_order_id: orderId,
        p_stage_name: 'packing',
        p_event_type: 'packing_completed',
        p_event_description: `Packed ${packagingData.bagCount} bags of ${packagingData.bagWeight}kg (${totalWeight}kg total)`,
        p_new_values: { 
          product_type: outputData.mainProduct.type,
          bag_weight: parseInt(packagingData.bagWeight),
          bag_count: parseInt(packagingData.bagCount),
          total_weight: totalWeight
        }
      })

      toast({
        title: "Packaging Completed",
        description: `${packagingData.bagCount} bags packed successfully`
      })

      onPackingComplete?.()

    } catch (error: any) {
      toast({
        title: "Error recording packaging",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateTotalWeight = () => {
    if (packagingData.bagWeight && packagingData.bagCount) {
      return parseInt(packagingData.bagWeight) * parseInt(packagingData.bagCount)
    }
    return 0
  }

  return (
    <div className="space-y-6">
      {/* Production Output Recording */}
      <Card className="steel-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="w-5 h-5" />
            Production Output Recording
          </CardTitle>
          <CardDescription>
            Record the quantities of main product and by-products
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Product */}
          <div className="p-4 border rounded-lg bg-primary/5">
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Main Product
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Product Type *</Label>
                <Select 
                  value={outputData.mainProduct.type}
                  onValueChange={(value) => setOutputData(prev => ({
                    ...prev,
                    mainProduct: { ...prev.mainProduct, type: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {mainProducts.map(product => (
                      <SelectItem key={product} value={product}>
                        {product}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Quantity (kg) *</Label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={outputData.mainProduct.quantity}
                  onChange={(e) => setOutputData(prev => ({
                    ...prev,
                    mainProduct: { ...prev.mainProduct, quantity: e.target.value }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Percentage (%)</Label>
                <Input
                  type="number"
                  placeholder="85"
                  value={outputData.mainProduct.percentage}
                  onChange={(e) => setOutputData(prev => ({
                    ...prev,
                    mainProduct: { ...prev.mainProduct, percentage: e.target.value }
                  }))}
                />
              </div>
            </div>
          </div>

          {/* By-Products */}
          <div className="p-4 border rounded-lg bg-muted/20">
            <h4 className="font-medium mb-4">By-Products</h4>
            <div className="space-y-4">
              {outputData.byProducts.map((byProduct, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Product Type</Label>
                    <Input
                      value={byProduct.type}
                      onChange={(e) => {
                        const newByProducts = [...outputData.byProducts]
                        newByProducts[index].type = e.target.value
                        setOutputData(prev => ({ ...prev, byProducts: newByProducts }))
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity (kg)</Label>
                    <Input
                      type="number"
                      placeholder="150"
                      value={byProduct.quantity}
                      onChange={(e) => {
                        const newByProducts = [...outputData.byProducts]
                        newByProducts[index].quantity = e.target.value
                        setOutputData(prev => ({ ...prev, byProducts: newByProducts }))
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Percentage (%)</Label>
                    <Input
                      type="number"
                      placeholder="15"
                      value={byProduct.percentage}
                      onChange={(e) => {
                        const newByProducts = [...outputData.byProducts]
                        newByProducts[index].percentage = e.target.value
                        setOutputData(prev => ({ ...prev, byProducts: newByProducts }))
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleOutputSubmit}
            disabled={loading}
            className="primary-gradient w-full"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Record Production Output
          </Button>
        </CardContent>
      </Card>

      {/* Packaging */}
      <Card className="steel-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Product Packaging
          </CardTitle>
          <CardDescription>
            Package the finished product into bags
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Bag Weight (kg) *</Label>
              <Select 
                value={packagingData.bagWeight}
                onValueChange={(value) => setPackagingData(prev => ({ ...prev, bagWeight: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select weight" />
                </SelectTrigger>
                <SelectContent>
                  {bagWeights.map(weight => (
                    <SelectItem key={weight} value={weight}>
                      {weight} kg
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Number of Bags *</Label>
              <Input
                type="number"
                placeholder="100"
                value={packagingData.bagCount}
                onChange={(e) => setPackagingData(prev => ({ ...prev, bagCount: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Total Weight</Label>
              <div className="p-2 rounded border bg-muted/50 font-medium">
                {calculateTotalWeight().toLocaleString()} kg
              </div>
            </div>
          </div>

          {calculateTotalWeight() > 0 && (
            <div className="p-4 rounded-lg bg-success/10 border border-success/30">
              <div className="flex justify-between items-center">
                <span className="text-success font-medium">Packaging Summary:</span>
                <Badge className="bg-success text-success-foreground">
                  {packagingData.bagCount} × {packagingData.bagWeight}kg = {calculateTotalWeight()}kg
                </Badge>
              </div>
            </div>
          )}

          <Button
            onClick={handlePackagingSubmit}
            disabled={loading || !packagingData.bagWeight || !packagingData.bagCount}
            className="primary-gradient w-full"
          >
            <Package className="w-4 h-4 mr-2" />
            Complete Packaging & Finish Order
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}