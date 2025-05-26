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
import { Plus, Edit, Trash2, Package, AlertTriangle } from "lucide-react"

interface Ingredient {
  id: number
  name: string
  quantity: number
  unit: string
  deliveryDate: string
  threshold: number
  category: string
  cost: number
}

interface InventoryManagerProps {
  userRole: string
}

export default function InventoryManager({ userRole }: InventoryManagerProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    {
      id: 1,
      name: "Beef",
      quantity: 2500,
      unit: "g",
      deliveryDate: "2024-01-15",
      threshold: 500,
      category: "Protein",
      cost: 15.5,
    },
    {
      id: 2,
      name: "Potatoes",
      quantity: 5000,
      unit: "g",
      deliveryDate: "2024-01-14",
      threshold: 1000,
      category: "Vegetables",
      cost: 8.2,
    },
    {
      id: 3,
      name: "Carrots",
      quantity: 180,
      unit: "g",
      deliveryDate: "2024-01-10",
      threshold: 300,
      category: "Vegetables",
      cost: 4.3,
    },
    {
      id: 4,
      name: "Rice",
      quantity: 3200,
      unit: "g",
      deliveryDate: "2024-01-16",
      threshold: 800,
      category: "Grains",
      cost: 6.75,
    },
    {
      id: 5,
      name: "Chicken",
      quantity: 1800,
      unit: "g",
      deliveryDate: "2024-01-15",
      threshold: 400,
      category: "Protein",
      cost: 12.4,
    },
    {
      id: 6,
      name: "Salt",
      quantity: 950,
      unit: "g",
      deliveryDate: "2024-01-12",
      threshold: 200,
      category: "Seasonings",
      cost: 2.15,
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newIngredient, setNewIngredient] = useState<Partial<Ingredient>>({
    name: "",
    quantity: 0,
    unit: "g",
    deliveryDate: "",
    threshold: 0,
    category: "",
    cost: 0,
  })

  const canEdit = userRole === "admin" || userRole === "manager"

  const addIngredient = () => {
    if (newIngredient.name && newIngredient.quantity) {
      const ingredient: Ingredient = {
        id: Math.max(...ingredients.map((i) => i.id)) + 1,
        name: newIngredient.name,
        quantity: newIngredient.quantity || 0,
        unit: newIngredient.unit || "g",
        deliveryDate: newIngredient.deliveryDate || new Date().toISOString().split("T")[0],
        threshold: newIngredient.threshold || 0,
        category: newIngredient.category || "Other",
        cost: newIngredient.cost || 0,
      }
      setIngredients([...ingredients, ingredient])
      setNewIngredient({ name: "", quantity: 0, unit: "g", deliveryDate: "", threshold: 0, category: "", cost: 0 })
      setIsAddDialogOpen(false)
    }
  }

  const updateQuantity = (id: number, newQuantity: number) => {
    setIngredients(ingredients.map((ing) => (ing.id === id ? { ...ing, quantity: newQuantity } : ing)))
  }

  const deleteIngredient = (id: number) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id))
  }

  const getStockStatus = (ingredient: Ingredient) => {
    if (ingredient.quantity <= ingredient.threshold) {
      return { status: "low", color: "destructive" }
    } else if (ingredient.quantity <= ingredient.threshold * 2) {
      return { status: "medium", color: "warning" }
    }
    return { status: "good", color: "default" }
  }

  const categoryColors = {
    Protein: "bg-red-100 text-red-800",
    Vegetables: "bg-green-100 text-green-800",
    Grains: "bg-yellow-100 text-yellow-800",
    Seasonings: "bg-purple-100 text-purple-800",
    Other: "bg-gray-100 text-gray-800",
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Inventory Management
              </CardTitle>
              <CardDescription>Manage ingredients, quantities, and delivery tracking</CardDescription>
            </div>
            {canEdit && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Ingredient
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Ingredient</DialogTitle>
                    <DialogDescription>Enter the details for the new ingredient</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={newIngredient.name || ""}
                        onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="quantity" className="text-right">
                        Quantity
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={newIngredient.quantity || 0}
                        onChange={(e) =>
                          setNewIngredient({ ...newIngredient, quantity: Number.parseInt(e.target.value) })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="unit" className="text-right">
                        Unit
                      </Label>
                      <Input
                        id="unit"
                        value={newIngredient.unit || "g"}
                        onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category" className="text-right">
                        Category
                      </Label>
                      <Input
                        id="category"
                        value={newIngredient.category || ""}
                        onChange={(e) => setNewIngredient({ ...newIngredient, category: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="threshold" className="text-right">
                        Threshold
                      </Label>
                      <Input
                        id="threshold"
                        type="number"
                        value={newIngredient.threshold || 0}
                        onChange={(e) =>
                          setNewIngredient({ ...newIngredient, threshold: Number.parseInt(e.target.value) })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="cost" className="text-right">
                        Cost ($)
                      </Label>
                      <Input
                        id="cost"
                        type="number"
                        step="0.01"
                        value={newIngredient.cost || 0}
                        onChange={(e) =>
                          setNewIngredient({ ...newIngredient, cost: Number.parseFloat(e.target.value) })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="deliveryDate" className="text-right">
                        Delivery Date
                      </Label>
                      <Input
                        id="deliveryDate"
                        type="date"
                        value={newIngredient.deliveryDate || ""}
                        onChange={(e) => setNewIngredient({ ...newIngredient, deliveryDate: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addIngredient}>Add Ingredient</Button>
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
                <TableHead>Ingredient</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Cost</TableHead>
                {canEdit && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {ingredients.map((ingredient) => {
                const stockStatus = getStockStatus(ingredient)
                return (
                  <TableRow key={ingredient.id}>
                    <TableCell className="font-medium">{ingredient.name}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          categoryColors[ingredient.category as keyof typeof categoryColors] || categoryColors.Other
                        }
                      >
                        {ingredient.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {canEdit ? (
                        <Input
                          type="number"
                          value={ingredient.quantity}
                          onChange={(e) => updateQuantity(ingredient.id, Number.parseInt(e.target.value))}
                          className="w-20"
                        />
                      ) : (
                        <span>{ingredient.quantity}</span>
                      )}
                      <span className="ml-1 text-sm text-gray-500">{ingredient.unit}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {stockStatus.status === "low" && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        <Badge variant={stockStatus.status === "low" ? "destructive" : "secondary"}>
                          {stockStatus.status === "low"
                            ? "Low Stock"
                            : stockStatus.status === "medium"
                              ? "Medium"
                              : "Good"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{ingredient.deliveryDate}</TableCell>
                    <TableCell>${ingredient.cost.toFixed(2)}</TableCell>
                    {canEdit && (
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => deleteIngredient(ingredient.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
