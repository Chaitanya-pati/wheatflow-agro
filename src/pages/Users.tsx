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
  Users as UsersIcon, 
  Plus,
  Edit,
  Trash2,
  Shield,
  UserCheck,
  UserX,
  Key
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const Users = () => {
  const { toast } = useToast()
  
  const [users] = useState([
    { 
      id: 1, 
      name: "John Doe", 
      email: "john@millmanager.com", 
      role: "Admin", 
      department: "Management",
      status: "active",
      lastLogin: "2024-01-15 10:30 AM"
    },
    { 
      id: 2, 
      name: "Jane Smith", 
      email: "jane@millmanager.com", 
      role: "Production Manager", 
      department: "Production",
      status: "active",
      lastLogin: "2024-01-15 09:15 AM"
    },
    { 
      id: 3, 
      name: "Ram Kumar", 
      email: "ram@millmanager.com", 
      role: "Quality Inspector", 
      department: "Quality",
      status: "active",
      lastLogin: "2024-01-14 04:45 PM"
    },
    { 
      id: 4, 
      name: "Priya Patel", 
      email: "priya@millmanager.com", 
      role: "Gate Operator", 
      department: "Operations",
      status: "inactive",
      lastLogin: "2024-01-10 02:20 PM"
    }
  ])

  const [roles] = useState([
    { id: 1, name: "Admin", permissions: "Full Access", users: 1 },
    { id: 2, name: "Production Manager", permissions: "Production, Reports", users: 1 },
    { id: 3, name: "Quality Inspector", permissions: "Quality Control", users: 1 },
    { id: 4, name: "Gate Operator", permissions: "Gate Entry, Weight", users: 0 },
    { id: 5, name: "Warehouse Manager", permissions: "Inventory, Godown", users: 0 }
  ])

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    phone: ""
  })

  const handleAddUser = () => {
    if (!userForm.name || !userForm.email || !userForm.role) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "User Added",
      description: `${userForm.name} has been added successfully`,
    })
    
    setUserForm({
      name: "",
      email: "",
      role: "",
      department: "",
      phone: ""
    })
  }

  const handleToggleUserStatus = (userName: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    toast({
      title: "User Status Updated",
      description: `${userName} is now ${newStatus}`,
    })
  }

  const handleResetPassword = (userName: string) => {
    toast({
      title: "Password Reset",
      description: `Password reset link sent to ${userName}`,
    })
  }

  const getStatusBadge = (status: string) => {
    return status === 'active' ? 'status-approved' : 'status-rejected'
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'status-processing'
      case 'production manager': return 'status-approved'
      case 'quality inspector': return 'status-pending'
      default: return 'status-secondary'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <UsersIcon className="w-8 h-8 text-primary" />
            User Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage user accounts, roles, and permissions
          </p>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">All Users</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="add">Add New User</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* Users List */}
          <Card className="steel-shadow">
            <CardHeader>
              <CardTitle>System Users</CardTitle>
              <CardDescription>
                Manage all registered users and their access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(user.status)}>
                          {user.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{user.lastLogin}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleToggleUserStatus(user.name, user.status)}
                          >
                            {user.status === 'active' ? 
                              <UserX className="w-3 h-3" /> : 
                              <UserCheck className="w-3 h-3" />
                            }
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleResetPassword(user.name)}
                          >
                            <Key className="w-3 h-3" />
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

        <TabsContent value="roles" className="space-y-6">
          {/* Roles and Permissions */}
          <Card className="steel-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Roles & Permissions
              </CardTitle>
              <CardDescription>
                Configure user roles and their system permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role Name</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Active Users</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>{role.permissions}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{role.users} users</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Shield className="w-3 h-3" />
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

        <TabsContent value="add" className="space-y-6">
          {/* Add New User */}
          <Card className="steel-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New User
              </CardTitle>
              <CardDescription>
                Create new user account with appropriate role and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userName">Full Name *</Label>
                  <Input
                    id="userName"
                    placeholder="John Doe"
                    value={userForm.name}
                    onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userEmail">Email Address *</Label>
                  <Input
                    id="userEmail"
                    type="email"
                    placeholder="john@millmanager.com"
                    value={userForm.email}
                    onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Role *</Label>
                  <Select 
                    value={userForm.role} 
                    onValueChange={(value) => setUserForm({...userForm, role: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.name}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select 
                    value={userForm.department} 
                    onValueChange={(value) => setUserForm({...userForm, department: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="management">Management</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                      <SelectItem value="quality">Quality</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="9876543210"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                  />
                </div>
              </div>

              <Button onClick={handleAddUser} className="primary-gradient">
                <Plus className="w-4 h-4 mr-2" />
                Create User Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Users