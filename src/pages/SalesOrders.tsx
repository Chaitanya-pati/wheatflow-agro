import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  ShoppingCart, 
  Plus,
  Search,
  Filter,
  User,
  MapPin,
  Package,
  Calendar
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const SalesOrders = () => {
  const { toast } = useToast()
  
  const [orders] = useState([
    {
      id: "SO-2024-001",
      customer: "ABC Foods Ltd",
      items: "Maida (50kg x 100), Suji (25kg x 50)",
      totalAmount: 125000,
      status: "pending",
      orderDate: "2024-01-15",
      deliveryDate: "2024-01-20",
      salesperson: "John Doe"
    },
    {
      id: "SO-2024-002", 
      customer: "XYZ Bakery",
      items: "Chakki Ata (30kg x 80)",
      totalAmount: 96000,
      status: "confirmed",
      orderDate: "2024-01-16",
      deliveryDate: "2024-01-22",
      salesperson: "Jane Smith"
    }
  ])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return 'status-pending'
      case 'confirmed': return 'status-approved'
      case 'dispatched': return 'status-processing'
      case 'delivered': return 'status-approved'
      case 'cancelled': return 'status-rejected'
      default: return 'status-pending'
    }
  }

  const handleNewOrder = () => {
    toast({
      title: "New Order",
      description: "Opening new sales order form...",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-primary" />
            Sales Orders
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage customer orders and track sales pipeline
          </p>
        </div>
        <Button onClick={handleNewOrder} className="primary-gradient">
          <Plus className="w-4 h-4 mr-2" />
          New Order
        </Button>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders">All Orders</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          {/* Filters */}
          <Card className="steel-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Filter Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Order ID, Customer..." className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="dispatched">Dispatched</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Salesperson</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All salespeople" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Salespeople</SelectItem>
                      <SelectItem value="john">John Doe</SelectItem>
                      <SelectItem value="jane">Jane Smith</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card className="steel-shadow">
            <CardHeader>
              <CardTitle>Sales Orders</CardTitle>
              <CardDescription>
                Complete list of sales orders with status tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Delivery Date</TableHead>
                    <TableHead>Salesperson</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell className="max-w-xs truncate">{order.items}</TableCell>
                      <TableCell>₹{order.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.orderDate}</TableCell>
                      <TableCell>{order.deliveryDate}</TableCell>
                      <TableCell>{order.salesperson}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <Card className="steel-shadow">
            <CardHeader>
              <CardTitle>Customer Management</CardTitle>
              <CardDescription>
                Manage customer database and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Customer management functionality coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="steel-shadow">
            <CardHeader>
              <CardTitle>Sales Analytics</CardTitle>
              <CardDescription>
                Track sales performance and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Sales analytics dashboard coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SalesOrders