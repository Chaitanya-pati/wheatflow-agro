import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Cog, 
  Timer
} from "lucide-react"
import { useProductionOrders } from "@/hooks/useProductionOrders"
import { ProductionTimerCard } from "@/components/production/ProductionTimerCard"
import { ProductionPlanningCard } from "@/components/production/ProductionPlanningCard"

const ProductionProcess = () => {
  const { orders, loading, updateOrderStatus } = useProductionOrders()

  // Filter orders by processing stages
  const processingOrders = orders.filter(order => 
    ['planning', '24h_cleaning', '12h_cleaning', 'grinding'].includes(order.current_stage)
  )

  // Use actual orders for active processes
  const activeProcesses = processingOrders.filter(order => 
    ['24h_cleaning', '12h_cleaning', 'grinding'].includes(order.current_stage)
  )

  // Helper functions for display
  const getStageProgress = (order: any) => {
    // This would typically come from timer data or be calculated
    // For now, return a mock progress
    return Math.floor(Math.random() * 100)
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
        {loading ? (
          <div className="col-span-2 text-center py-8 text-muted-foreground">
            Loading processes...
          </div>
        ) : activeProcesses.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-muted-foreground">
            No active production processes
          </div>
        ) : (
          activeProcesses.map((process) => (
            <Card key={process.id} className="steel-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{process.order_number}</CardTitle>
                  <Badge className={getStageStatus(process.current_stage)}>
                    {process.current_stage.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{getStageProgress(process)}%</span>
                  </div>
                  <Progress value={getStageProgress(process)} className="h-2" />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Product:</span>
                  <span className="font-medium text-primary">{process.finished_goods_type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quantity:</span>
                  <span className="font-medium">{process.quantity_tons} tons</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Tabs defaultValue="planning" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="cleaning24h">24H Cleaning</TabsTrigger>
          <TabsTrigger value="cleaning12h">12H Cleaning</TabsTrigger>
          <TabsTrigger value="grinding">Grinding</TabsTrigger>
        </TabsList>

        <TabsContent value="planning" className="space-y-6">
          {processingOrders.filter(o => o.current_stage === 'planning').map(order => (
            <ProductionPlanningCard
              key={order.id}
              orderId={order.id}
              orderTons={order.quantity_tons}
              onPlanningComplete={() => updateOrderStatus(order.id, '24h_cleaning', '24h_cleaning')}
            />
          ))}
          
          {processingOrders.filter(o => o.current_stage === 'planning').length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No orders in planning stage
            </div>
          )}
        </TabsContent>

        <TabsContent value="cleaning24h" className="space-y-6">
          {processingOrders.filter(o => o.current_stage === '24h_cleaning').map(order => (
            <ProductionTimerCard
              key={order.id}
              orderId={order.id}
              stage="24h_cleaning"
              stageName="24-Hour Cleaning"
              allowedDurations={[24, 12, 8]}
              onStageComplete={() => updateOrderStatus(order.id, '12h_cleaning', '12h_cleaning')}
            />
          ))}
          
          {processingOrders.filter(o => o.current_stage === '24h_cleaning').length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No orders in 24-hour cleaning stage
            </div>
          )}
        </TabsContent>

        <TabsContent value="cleaning12h" className="space-y-6">
          {processingOrders.filter(o => o.current_stage === '12h_cleaning').map(order => (
            <ProductionTimerCard
              key={order.id}
              orderId={order.id}
              stage="12h_cleaning"
              stageName="12-Hour Cleaning"
              allowedDurations={[12, 8, 6]}
              onStageComplete={() => updateOrderStatus(order.id, 'grinding', 'grinding')}
            />
          ))}
          
          {processingOrders.filter(o => o.current_stage === '12h_cleaning').length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No orders in 12-hour cleaning stage
            </div>
          )}
        </TabsContent>

        <TabsContent value="grinding" className="space-y-6">
          {processingOrders.filter(o => o.current_stage === 'grinding').map(order => (
            <ProductionTimerCard
              key={order.id}
              orderId={order.id}
              stage="grinding"
              stageName="Grinding Process"
              allowedDurations={[8, 6, 4]}
              onStageComplete={() => updateOrderStatus(order.id, 'completed', 'completed')}
            />
          ))}
          
          {processingOrders.filter(o => o.current_stage === 'grinding').length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No orders in grinding stage
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProductionProcess