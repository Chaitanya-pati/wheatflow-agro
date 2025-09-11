import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Scale, CheckCircle, AlertCircle } from "lucide-react"
import { useProductionPlanning } from "@/hooks/useProductionPlanning"

interface ProductionPlanningCardProps {
  orderId: string
  orderTons: number
  onPlanningComplete?: () => void
}

export const ProductionPlanningCard = ({ 
  orderId, 
  orderTons, 
  onPlanningComplete 
}: ProductionPlanningCardProps) => {
  const { bins, planning, savePlanning, loading } = useProductionPlanning(orderId)
  
  const [planningData, setPlanningData] = useState<Record<string, number>>({})
  const [totalPercentage, setTotalPercentage] = useState(0)

  // Load existing planning data
  useEffect(() => {
    if (planning.length > 0) {
      const existingData: Record<string, number> = {}
      planning.forEach(p => {
        existingData[p.bin_id] = p.percentage
      })
      setPlanningData(existingData)
    }
  }, [planning])

  // Calculate total percentage whenever planning data changes
  useEffect(() => {
    const total = Object.values(planningData).reduce((sum, val) => sum + (val || 0), 0)
    setTotalPercentage(total)
  }, [planningData])

  const handleInputChange = (binId: string, value: string) => {
    const numValue = parseFloat(value) || 0
    setPlanningData(prev => ({
      ...prev,
      [binId]: numValue
    }))
  }

  const handleSavePlanning = async () => {
    try {
      await savePlanning({ orderId, orderTons }, planningData)
      onPlanningComplete?.()
    } catch (error) {
      // Error handled in hook
    }
  }

  const isValidTotal = Math.abs(totalPercentage - 100) < 0.1
  const hasAllocations = Object.values(planningData).some(val => val > 0)

  return (
    <Card className="steel-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="w-5 h-5" />
          Production Planning
        </CardTitle>
        <CardDescription>
          Plan raw material distribution from bins (must total 100%)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Info */}
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Order Quantity:</span>
            <span className="font-bold text-primary">{orderTons.toLocaleString()} tons</span>
          </div>
        </div>

        {/* Bin Planning Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bins.map((bin) => (
            <div key={bin.id} className="space-y-3 p-4 border rounded-lg bg-muted/20">
              <div className="flex items-center justify-between">
                <Label className="font-medium">{bin.name}</Label>
                <Badge variant="outline" className="text-xs">
                  {bin.available.toLocaleString()} kg available
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Input
                  placeholder="0"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={planningData[bin.id] || ''}
                  onChange={(e) => handleInputChange(bin.id, e.target.value)}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-4">%</span>
              </div>

              {planningData[bin.id] > 0 && (
                <div className="text-xs text-muted-foreground">
                  Allocated: {((planningData[bin.id] / 100) * orderTons).toFixed(1)} tons
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Total Summary */}
        <div className={`p-4 rounded-lg border ${
          isValidTotal ? 'bg-success/10 border-success/30' : 'bg-destructive/10 border-destructive/30'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isValidTotal ? (
                <CheckCircle className="w-5 h-5 text-success" />
              ) : (
                <AlertCircle className="w-5 h-5 text-destructive" />
              )}
              <span className="font-medium">Total Percentage:</span>
            </div>
            <span className={`text-xl font-bold ${
              isValidTotal ? 'text-success' : 'text-destructive'
            }`}>
              {totalPercentage.toFixed(1)}%
            </span>
          </div>
          
          {!isValidTotal && hasAllocations && (
            <p className="text-sm text-destructive mt-2">
              {totalPercentage > 100 ? 
                `Over by ${(totalPercentage - 100).toFixed(1)}%` : 
                `Need ${(100 - totalPercentage).toFixed(1)}% more`
              }
            </p>
          )}
        </div>

        {/* Action Button */}
        <Button
          onClick={handleSavePlanning}
          disabled={!isValidTotal || !hasAllocations || loading}
          className="primary-gradient w-full"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save Planning & Proceed to Transfer'}
        </Button>

        {/* Existing Planning Display */}
        {planning.length > 0 && (
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-sm">Current Planning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {planning.map((p) => (
                <div key={p.bin_id} className="flex justify-between text-sm">
                  <span>{p.bin_name}:</span>
                  <span className="font-medium">
                    {p.percentage}% ({p.tons_allocated.toFixed(1)} tons)
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}
