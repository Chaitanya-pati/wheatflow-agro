import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Workflow,
  ArrowRight,
  CheckCircle,
  Clock,
  PlayCircle,
  PauseCircle
} from "lucide-react"
import { useProductionOrders } from "@/hooks/useProductionOrders"
import { ProductionPlanningCard } from "@/components/production/ProductionPlanningCard"
import { ProductionTimerCard } from "@/components/production/ProductionTimerCard"
import { ProductionOutputCard } from "@/components/production/ProductionOutputCard"

const ProductionWorkflow = () => {
  const { orders, loading, updateOrderStatus } = useProductionOrders()
  const [selectedOrder, setSelectedOrder] = useState<string>("")

  const workflowStages = [
    { id: 'planning', name: 'Planning', description: 'Raw material planning and allocation', duration: null },
    { id: 'transfer', name: 'Transfer', description: 'Material transfer to processing', duration: 2 },
    { id: 'cleaning_24h', name: '24H Cleaning', description: 'Initial cleaning process', duration: 24 },
    { id: 'cleaning_12h', name: '12H Cleaning', description: 'Secondary cleaning process', duration: 12 },
    { id: 'grinding', name: 'Grinding', description: 'Wheat processing and grinding', duration: 8 },
    { id: 'sifting', name: 'Sifting', description: 'Product separation and grading', duration: 4 },
    { id: 'packing', name: 'Packing', description: 'Final product packaging', duration: 6 },
    { id: 'quality_check', name: 'Quality Check', description: 'Final quality inspection', duration: 2 },
    { id: 'storage', name: 'Storage', description: 'Finished goods storage', duration: 1 }
  ]

  const getStageStatus = (order: any, stageId: string) => {
    if (!order) return 'not_started'
    
    const stageIndex = workflowStages.findIndex(s => s.id === stageId)
    const currentStageIndex = workflowStages.findIndex(s => s.id === order.current_stage)
    
    if (stageIndex < currentStageIndex) return 'completed'
    if (stageIndex === currentStageIndex) return 'in_progress'
    return 'not_started'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="status-approved"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>
      case 'in_progress':
        return <Badge className="status-processing"><PlayCircle className="w-3 h-3 mr-1" />In Progress</Badge>
      case 'not_started':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const currentOrder = orders.find(o => o.id === selectedOrder)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Workflow className="w-8 h-8 text-primary" />
            Production Workflow
          </h1>
          <p className="text-muted-foreground mt-1">
            End-to-end production process management
          </p>
        </div>
      </div>

      {/* Order Selection */}
      <Card className="steel-shadow">
        <CardHeader>
          <CardTitle>Active Production Orders</CardTitle>
          <CardDescription>Select an order to view its workflow progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="text-center py-4 text-muted-foreground">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No active orders</div>
            ) : (
              orders.map((order) => (
                <Card 
                  key={order.id} 
                  className={`cursor-pointer transition-all ${
                    selectedOrder === order.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedOrder(order.id)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold">{order.order_number}</h4>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-primary font-medium">{order.finished_goods_type}</p>
                      <p className="text-sm text-muted-foreground">{order.quantity_tons} tons</p>
                      <p className="text-xs text-muted-foreground">
                        Current: {order.current_stage.replace('_', ' ')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Workflow Visualization */}
      {currentOrder && (
        <Card className="steel-shadow">
          <CardHeader>
            <CardTitle>Workflow Progress - {currentOrder.order_number}</CardTitle>
            <CardDescription>{currentOrder.finished_goods_type} - {currentOrder.quantity_tons} tons</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>
                    {Math.round((workflowStages.findIndex(s => s.id === currentOrder.current_stage) + 1) / workflowStages.length * 100)}%
                  </span>
                </div>
                <Progress 
                  value={(workflowStages.findIndex(s => s.id === currentOrder.current_stage) + 1) / workflowStages.length * 100} 
                  className="h-2"
                />
              </div>

              {/* Workflow Steps */}
              <div className="grid grid-cols-1 gap-4">
                {workflowStages.map((stage, index) => {
                  const status = getStageStatus(currentOrder, stage.id)
                  const isActive = currentOrder.current_stage === stage.id
                  
                  return (
                    <div key={stage.id} className={`flex items-center gap-4 p-4 rounded-lg border ${
                      isActive ? 'bg-primary/5 border-primary' : 'bg-muted/20'
                    }`}>
                      <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 
                                    ${status === 'completed' ? 'bg-success border-success text-success-foreground' :
                                      status === 'in_progress' ? 'bg-primary border-primary text-primary-foreground' :
                                      'bg-muted border-muted-foreground'} text-sm font-bold">
                        {status === 'completed' ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{stage.name}</h4>
                            <p className="text-sm text-muted-foreground">{stage.description}</p>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(status)}
                            {stage.duration && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Est. {stage.duration}h
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {index < workflowStages.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stage-specific Controls */}
      {currentOrder && (
        <Tabs defaultValue={currentOrder.current_stage} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="planning">Planning</TabsTrigger>
            <TabsTrigger value="cleaning_24h">24H Cleaning</TabsTrigger>
            <TabsTrigger value="cleaning_12h">12H Cleaning</TabsTrigger>
            <TabsTrigger value="grinding">Grinding</TabsTrigger>
            <TabsTrigger value="packing">Packing</TabsTrigger>
          </TabsList>

        <TabsContent value="planning" className="space-y-6">
          {orders.filter(o => o.current_stage === 'planning').map(order => (
            <ProductionPlanningCard
              key={order.id}
              orderId={order.id}
              orderTons={order.quantity_tons}
              onPlanningComplete={() => updateOrderStatus(order.id, 'planned', '24h_cleaning')}
            />
          ))}
          
          {orders.filter(o => o.current_stage === 'planning').length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No orders in planning stage
            </div>
          )}
        </TabsContent>

          <TabsContent value="cleaning_24h">
            <ProductionTimerCard
              orderId={currentOrder.id}
              stage="cleaning_24h"
              stageName="24-Hour Cleaning"
              allowedDurations={[24, 12, 8]}
              onStageComplete={() => updateOrderStatus(currentOrder.id, 'cleaning_12h', 'cleaning_12h')}
            />
          </TabsContent>

          <TabsContent value="cleaning_12h">
            <ProductionTimerCard
              orderId={currentOrder.id}
              stage="cleaning_12h"
              stageName="12-Hour Cleaning"
              allowedDurations={[12, 8, 6]}
              onStageComplete={() => updateOrderStatus(currentOrder.id, 'grinding', 'grinding')}
            />
          </TabsContent>

          <TabsContent value="grinding">
            <ProductionTimerCard
              orderId={currentOrder.id}
              stage="grinding"
              stageName="Grinding Process"
              allowedDurations={[8, 6, 4]}
              onStageComplete={() => updateOrderStatus(currentOrder.id, 'packing', 'packing')}
            />
          </TabsContent>

          <TabsContent value="packing">
            <ProductionOutputCard
              orderId={currentOrder.id}
              onPackingComplete={() => updateOrderStatus(currentOrder.id, 'completed', 'completed')}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

export default ProductionWorkflow