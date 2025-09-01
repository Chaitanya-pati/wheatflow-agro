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
  CheckCircle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const ProductionOrders = () => {
  const { toast } = useToast()
  
  const [orderForm, setOrderForm] = useState({
    orderNumber: "",
    quantity: "",
    productType: "",
    priority: "medium",
    targetDate: "",
    description: "",
    createdBy: "Production Manager"
  })

  const [orders] = useState([
    {
      id: 1,
      orderNumber: "PO-2024-001",
      quantity: 100000,
      productType: "Maida Premium",
      priority: "high",
      status: "planning",
      createdBy: "Production Manager",
      createdDate: "2024-01-15",
      targetDate: "2024-01-25",
      assignedTo: "Supervisor A",
      progress: 0
    },
    {
      id: 2,
      orderNumber: "PO-2024-002", 
      quantity: 75000,
      productType: "Chakki Atta",
      priority: "medium",
      status: "in_progress",
      createdBy: "Production Manager",
      createdDate: "2024-01-12",
      targetDate: "2024-01-22",
      assignedTo: "Supervisor B",
      progress: 45
    },
    {
      id: 3,
      orderNumber: "PO-2024-003",
      quantity: 50000,
      productType: "Suji",
      priority: "low",
      status: "completed",
      createdBy: "Owner",
      createdDate: "2024-01-08",
      targetDate: "2024-01-18",
      assignedTo: "Supervisor A",
      progress: 100
    }
  ])

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

  const handleCreateOrder = () => {
    if (!orderForm.orderNumber || !orderForm.quantity || !orderForm.productType || !orderForm.targetDate) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Production Order Created",
      description: `Order ${orderForm.orderNumber} for ${orderForm.quantity} kg ${orderForm.productType} created successfully`,
    })
    
    // Reset form
    setOrderForm({
      orderNumber: "",
      quantity: "",
      productType: "",
      priority: "medium",
      targetDate: "",
      description: "",
      createdBy: "Production Manager"
    })
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

  const handleAssignOrder = (orderId: number) => {
    toast({
      title: "Order Assigned",
      description: "Production order has been assigned to supervisor for planning",
    })
  }

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
              <Label htmlFor="quantity">Quantity (kg) *</Label>
              <Input
                id="quantity"
                placeholder="100000"
                type="number"
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
            {orders.map((order) => (
              <div key={order.id} className="p-4 rounded-lg border bg-muted/20">
                <div className="space-y-3">
                  {/* Order Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-lg">{order.orderNumber}</h4>
                      <p className="text-primary font-medium">{order.productType}</p>
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
                        <p className="font-medium">{order.quantity.toLocaleString()} kg</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Created By</p>
                        <p className="font-medium">{order.createdBy}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Target Date</p>
                        <p className="font-medium">{order.targetDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Progress</p>
                        <p className="font-medium">{order.progress}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar for In Progress Orders */}
                  {order.status === 'in_progress' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Production Progress</span>
                        <span>{order.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${order.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    {order.status === 'planning' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAssignOrder(order.id)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Assign for Planning
                      </Button>
                    )}
                    {order.status === 'in_progress' && (
                      <Button size="sm" variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    )}
                    {order.status === 'completed' && (
                      <Button size="sm" variant="outline">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        View Report
                      </Button>
                    )}
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

export default ProductionOrders