"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, Edit, Trash2, Users, Shield, ChefHat, Crown } from "lucide-react"

interface User {
  id: number
  name: string
  email: string
  role: "admin" | "manager" | "cook"
  status: "active" | "inactive"
  lastLogin: string
  createdAt: string
}

interface UserManagementProps {
  currentUser: {
    id: number
    name: string
    role: string
    email: string
  }
}

export default function UserManagement({ currentUser }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@kindergarten.edu",
      role: "manager",
      status: "active",
      lastLogin: "2024-01-16 09:30:00",
      createdAt: "2023-09-01",
    },
    {
      id: 2,
      name: "Mike Chen",
      email: "mike@kindergarten.edu",
      role: "cook",
      status: "active",
      lastLogin: "2024-01-16 08:15:00",
      createdAt: "2023-10-15",
    },
    {
      id: 3,
      name: "Lisa Wong",
      email: "lisa@kindergarten.edu",
      role: "cook",
      status: "active",
      lastLogin: "2024-01-15 16:45:00",
      createdAt: "2023-11-02",
    },
    {
      id: 4,
      name: "Dr. Emily Davis",
      email: "emily@kindergarten.edu",
      role: "admin",
      status: "active",
      lastLogin: "2024-01-16 07:00:00",
      createdAt: "2023-08-15",
    },
    {
      id: 5,
      name: "James Wilson",
      email: "james@kindergarten.edu",
      role: "cook",
      status: "inactive",
      lastLogin: "2024-01-10 14:20:00",
      createdAt: "2023-12-01",
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "cook",
    status: "active",
  })

  const canManageUsers = currentUser.role === "admin"

  const addUser = () => {
    if (newUser.name && newUser.email && newUser.role) {
      const user: User = {
        id: Math.max(...users.map((u) => u.id)) + 1,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role as "admin" | "manager" | "cook",
        status: (newUser.status as "active" | "inactive") || "active",
        lastLogin: "Never",
        createdAt: new Date().toISOString().split("T")[0],
      }
      setUsers([...users, user])
      setNewUser({ name: "", email: "", role: "cook", status: "active" })
      setIsAddDialogOpen(false)
    }
  }

  const deleteUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  const toggleUserStatus = (id: number) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user,
      ),
    )
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Crown className="w-4 h-4 text-yellow-600" />
      case "manager":
        return <Shield className="w-4 h-4 text-blue-600" />
      case "cook":
        return <ChefHat className="w-4 h-4 text-green-600" />
      default:
        return <Users className="w-4 h-4" />
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-yellow-100 text-yellow-800"
      case "manager":
        return "bg-blue-100 text-blue-800"
      case "cook":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                User Management
              </CardTitle>
              <CardDescription>Manage staff accounts, roles, and permissions</CardDescription>
            </div>
            {canManageUsers && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>Create a new staff account with appropriate permissions</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="userName" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="userName"
                        value={newUser.name || ""}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="userEmail" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="userEmail"
                        type="email"
                        value={newUser.email || ""}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="userRole" className="text-right">
                        Role
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setNewUser({ ...newUser, role: value as "admin" | "manager" | "cook" })
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cook">Cook</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="userStatus" className="text-right">
                        Status
                      </Label>
                      <Select
                        onValueChange={(value) => setNewUser({ ...newUser, status: value as "active" | "inactive" })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addUser}>Add User</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Created</TableHead>
                {canManageUsers && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-r from-blue-400 to-purple-500 text-white">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getRoleIcon(user.role)}
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "active" ? "default" : "secondary"}>
                      {user.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  {canManageUsers && (
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => toggleUserStatus(user.id)}>
                          {user.status === "active" ? "Deactivate" : "Activate"}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        {user.id !== currentUser.id && (
                          <Button size="sm" variant="outline" onClick={() => deleteUser(user.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Role Permissions Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Role Permissions
          </CardTitle>
          <CardDescription>Overview of what each role can access and perform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-600" />
                  Admin
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <div className="font-medium mb-2">Full Access:</div>
                  <ul className="space-y-1 text-gray-600">
                    <li>• User management</li>
                    <li>• All reports & analytics</li>
                    <li>• System settings</li>
                    <li>• Complete inventory control</li>
                    <li>• Meal serving</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Manager
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <div className="font-medium mb-2">Limited Access:</div>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Inventory management</li>
                    <li>• Meal management</li>
                    <li>• Analytics viewing</li>
                    <li>• Meal serving</li>
                    <li>• Report generation</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-green-600" />
                  Cook
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <div className="font-medium mb-2">Basic Access:</div>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Meal serving only</li>
                    <li>• View inventory levels</li>
                    <li>• View meal recipes</li>
                    <li>• Basic portion calculations</li>
                    <li>• Personal activity logs</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
