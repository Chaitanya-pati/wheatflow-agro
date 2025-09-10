import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Target, 
  Plus,
  FileText,
  User,
  Calendar,
  Package,
  Clock,
  CheckCircle,
  Search,
  Eye
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useProductionOrders } from "@/hooks/useProductionOrders"
import { useProductionPlanning } from "@/hooks/useProductionPlanning"

const ProductionOrders = () => {
  const { toast } = useToast()
  const { orders, loading, createOrder, updateOrderStatus } = useProductionOrders()
  
  const [orderForm, setOrderForm] = useState({
    orderNumber: "",
    quantity: "",
    productType: "",
    priority: "medium" as const,
    targetDate: "",
    description: ""
  })

  const [searchTerm, setSearchTerm] = useState("")

  const productTypes = [
    "Maida Premium",
    "Maida Standard",
    "Chakki Atta",
    "Tandoori Atta", 
    "Suji",
    "DP Maida",
    "Loto Maida",
    "Nestle Maida"
  ]

  const supervisors = [
    "Supervisor A",
    "Supervisor B", 
    "Supervisor C",
    "Senior Supervisor"
  ]

  const handleCreateOrder = async () => {
    if (!orderForm.orderNumber || !orderForm.quantity || !orderForm.productType || !orderForm.targetDate) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      })
      return
    }

    try {
      await createOrder({
        order_number: orderForm.orderNumber,
        quantity_tons: parseFloat(orderForm.quantity),
        finished_goods_type: orderForm.productType,
        priority: orderForm.priority as "low" | "medium" | "high",
        target_date: orderForm.targetDate,
        description: orderForm.description
      })
      
      // Reset form
      setOrderForm({
        orderNumber: "",
        quantity: "",
        productType: "",
        priority: "medium" as const,
        targetDate: "",
        description: ""
      })
    } catch (error) {
      // Error handled in hook
    }
  }

  const generateOrderNumber = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    const time = String(today.getHours()).padStart(2, '0') + String(today.getMinutes()).padStart(2, '0')
    const orderNum = `PO-${year}-${month}${day}-${time}`
    
    setOrderForm({...orderForm, orderNumber: orderNum})
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planning':
        return <Badge className="status-pending">Planning</Badge>
      case 'in_progress':
        return <Badge className="status-processing">In Progress</Badge>
      case 'completed':
        return <Badge className="status-approved">Completed</Badge>
      case 'on_hold':
        return <Badge className="status-rejected">On Hold</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>
      case 'low':
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const handleAssignOrder = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, 'planning')
      toast({
        title: "Order Assigned",
        description: "Production order has been assigned for planning",
      })
    } catch (error) {
      // Error handled in hook
    }
  }

  const filteredOrders = orders.filter(order => 
    order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.finished_goods_type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Target className="w-8 h-8 text-primary" />
            Production Orders
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage production orders for finished goods
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Order Form */}
        <Card className="lg:col-span-1 steel-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New Order
            </CardTitle>
            <CardDescription>
              Create production order for finished goods
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orderNumber">Order Number *</Label>
              <div className="flex gap-2">
                <Input
                  id="orderNumber"
                  placeholder="PO-2024-001"
                  value={orderForm.orderNumber}
                  onChange={(e) => setOrderForm({...orderForm, orderNumber: e.target.value})}
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={generateOrderNumber}
                >
                  Auto
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity (tons) *</Label>
              <Input
                id="quantity"
                placeholder="100"
                type="number"
                step="0.01"
                min="0"
                value={orderForm.quantity}
                onChange={(e) => setOrderForm({...orderForm, quantity: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="productType">Product Type *</Label>
              <Select 
                value={orderForm.productType} 
                onValueChange={(value) => setOrderForm({...orderForm, productType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {productTypes.map((product) => (
                    <SelectItem key={product} value={product}>
                      {product}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={orderForm.priority} 
                onValueChange={(value) => setOrderForm({...orderForm, priority: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetDate">Target Date *</Label>
              <Input
                id="targetDate"
                type="date"
                value={orderForm.targetDate}
                onChange={(e) => setOrderForm({...orderForm, targetDate: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Order specifications and requirements..."
                value={orderForm.description}
                onChange={(e) => setOrderForm({...orderForm, description: e.target.value})}
              />
            </div>

            <Button onClick={handleCreateOrder} className="primary-gradient w-full">
              <Plus className="w-4 h-4 mr-2" />
              Create Order
            </Button>
          </CardContent>
        </Card>

        {/* Orders List */}
        <Card className="lg:col-span-2 steel-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Production Orders
            </CardTitle>
            <CardDescription>
              Current and recent production orders
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading orders...
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? `No orders found matching "${searchTerm}"` : 'No orders found'}
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="p-4 rounded-lg border bg-muted/20">
                  <div className="space-y-3">
                    {/* Order Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-lg">{order.order_number}</h4>
                        <p className="text-primary font-medium">{order.finished_goods_type}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(order.status)}
                        {getPriorityBadge(order.priority)}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Quantity</p>
                          <p className="font-medium">{order.quantity_tons} tons</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          <p className="font-medium capitalize">{order.current_stage.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Target Date</p>
                          <p className="font-medium">{order.target_date || 'Not set'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-muted-foreground">Created</p>
                          <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      {order.status === 'created' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleAssignOrder(order.id)}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Start Planning
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ProductionOrders