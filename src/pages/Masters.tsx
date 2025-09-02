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
  Settings, 
  Plus,
  Edit,
  Trash2,
  Database,
  Users,
  Package,
  Truck,
  Building
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const Masters = () => {
  const { toast } = useToast()
  
  const [suppliers] = useState([
    { id: 1, name: "ABC Agro Supplies", contact: "9876543210", category: "Premium", status: "active" },
    { id: 2, name: "XYZ Wheat Traders", contact: "9876543211", category: "Standard", status: "active" },
    { id: 3, name: "DEF Farm Products", contact: "9876543212", category: "Premium", status: "inactive" }
  ])

  const [products] = useState([
    { id: 1, name: "Maida", type: "Finished Good", unit: "kg", status: "active" },
    { id: 2, name: "Suji", type: "Finished Good", unit: "kg", status: "active" },
    { id: 3, name: "Chakki Ata", type: "Finished Good", unit: "kg", status: "active" },
    { id: 4, name: "Bran", type: "By-Product", unit: "kg", status: "active" }
  ])

  const [godownTypes] = useState([
    { id: 1, name: "Mill", capacity: "5000 kg", status: "active" },
    { id: 2, name: "Low Mill", capacity: "3000 kg", status: "active" },
    { id: 3, name: "HD", capacity: "4000 kg", status: "active" }
  ])

  const [supplierForm, setSupplierForm] = useState({
    name: "",
    contact: "",
    category: "",
    address: ""
  })

  const handleAddSupplier = () => {
    if (!supplierForm.name || !supplierForm.contact) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Supplier Added",
      description: `${supplierForm.name} has been added successfully`,
    })
    
    setSupplierForm({
      name: "",
      contact: "",
      category: "",
      address: ""
    })
  }

  const handleDeleteItem = (type: string, name: string) => {
    toast({
      title: "Item Deleted",
      description: `${name} has been removed from ${type}`,
      variant: "destructive"
    })
  }

  const getStatusBadge = (status: string) => {
    return status === 'active' ? 'status-approved' : 'status-rejected'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            Master Data Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure suppliers, products, godown types, and system settings
          </p>
        </div>
      </div>

      <Tabs defaultValue="suppliers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="godowns">Godown Types</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="suppliers" className="space-y-6">
          {/* Add New Supplier */}
          <Card className="steel-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Supplier
              </CardTitle>
              <CardDescription>
                Register new wheat suppliers and their details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplierName">Supplier Name *</Label>
                  <Input
                    id="supplierName"
                    placeholder="ABC Agro Supplies"
                    value={supplierForm.name}
                    onChange={(e) => setSupplierForm({...supplierForm, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number *</Label>
                  <Input
                    id="contact"
                    placeholder="9876543210"
                    value={supplierForm.contact}
                    onChange={(e) => setSupplierForm({...supplierForm, contact: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    value={supplierForm.category} 
                    onValueChange={(value) => setSupplierForm({...supplierForm, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="City, State"
                    value={supplierForm.address}
                    onChange={(e) => setSupplierForm({...supplierForm, address: e.target.value})}
                  />
                </div>
              </div>

              <Button onClick={handleAddSupplier} className="primary-gradient">
                <Plus className="w-4 h-4 mr-2" />
                Add Supplier
              </Button>
            </CardContent>
          </Card>

          {/* Suppliers List */}
          <Card className="steel-shadow">
            <CardHeader>
              <CardTitle>Registered Suppliers</CardTitle>
              <CardDescription>
                Manage existing supplier information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell>{supplier.contact}</TableCell>
                      <TableCell>{supplier.category}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(supplier.status)}>
                          {supplier.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteItem("suppliers", supplier.name)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card className="steel-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Product Master
              </CardTitle>
              <CardDescription>
                Manage finished goods and by-products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.type}</TableCell>
                      <TableCell>{product.unit}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(product.status)}>
                          {product.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteItem("products", product.name)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="godowns" className="space-y-6">
          <Card className="steel-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Godown Types
              </CardTitle>
              <CardDescription>
                Configure different godown categories and capacities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type Name</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {godownTypes.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell className="font-medium">{type.name}</TableCell>
                      <TableCell>{type.capacity}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(type.status)}>
                          {type.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteItem("godown types", type.name)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-6">
          <Card className="steel-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Vehicle Master
              </CardTitle>
              <CardDescription>
                Manage fleet vehicles and driver information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Vehicle management functionality coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="steel-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                System Settings
              </CardTitle>
              <CardDescription>
                Configure application settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                System settings configuration coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Masters