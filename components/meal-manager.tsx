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
import { Plus, Edit, Trash2, ChefHat, Calculator } from "lucide-react"

interface MealIngredient {
  ingredientName: string
  quantity: number
  unit: string
}

interface Meal {
  id: number
  name: string
  description: string
  ingredients: MealIngredient[]
  category: string
  servings: number
  preparationTime: number
  maxPortions: number
}

interface MealManagerProps {
  userRole: string
}

export default function MealManager({ userRole }: MealManagerProps) {
  const [meals, setMeals] = useState<Meal[]>([
    {
      id: 1,
      name: "Beef & Potato Stew",
      description: "Hearty stew with tender beef and potatoes",
      ingredients: [
        { ingredientName: "Beef", quantity: 500, unit: "g" },
        { ingredientName: "Potatoes", quantity: 800, unit: "g" },
        { ingredientName: "Carrots", quantity: 200, unit: "g" },
        { ingredientName: "Salt", quantity: 10, unit: "g" },
      ],
      category: "Main Course",
      servings: 6,
      preparationTime: 45,
      maxPortions: 3,
    },
    {
      id: 2,
      name: "Chicken Rice Bowl",
      description: "Nutritious chicken and rice with vegetables",
      ingredients: [
        { ingredientName: "Chicken", quantity: 400, unit: "g" },
        { ingredientName: "Rice", quantity: 300, unit: "g" },
        { ingredientName: "Carrots", quantity: 150, unit: "g" },
        { ingredientName: "Salt", quantity: 8, unit: "g" },
      ],
      category: "Main Course",
      servings: 5,
      preparationTime: 30,
      maxPortions: 4,
    },
    {
      id: 3,
      name: "Vegetable Rice",
      description: "Simple and healthy vegetable rice dish",
      ingredients: [
        { ingredientName: "Rice", quantity: 400, unit: "g" },
        { ingredientName: "Carrots", quantity: 100, unit: "g" },
        { ingredientName: "Potatoes", quantity: 300, unit: "g" },
        { ingredientName: "Salt", quantity: 6, unit: "g" },
      ],
      category: "Vegetarian",
      servings: 4,
      preparationTime: 25,
      maxPortions: 8,
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newMeal, setNewMeal] = useState<Partial<Meal>>({
    name: "",
    description: "",
    ingredients: [],
    category: "",
    servings: 1,
    preparationTime: 0,
  })

  const [newIngredient, setNewIngredient] = useState<MealIngredient>({
    ingredientName: "",
    quantity: 0,
    unit: "g",
  })

  const canEdit = userRole === "admin" || userRole === "manager"

  const availableIngredients = ["Beef", "Chicken", "Potatoes", "Carrots", "Rice", "Salt"]

  const addIngredientToMeal = () => {
    if (newIngredient.ingredientName && newIngredient.quantity > 0) {
      setNewMeal({
        ...newMeal,
        ingredients: [...(newMeal.ingredients || []), { ...newIngredient }],
      })
      setNewIngredient({ ingredientName: "", quantity: 0, unit: "g" })
    }
  }

  const removeIngredientFromMeal = (index: number) => {
    const updatedIngredients = [...(newMeal.ingredients || [])]
    updatedIngredients.splice(index, 1)
    setNewMeal({ ...newMeal, ingredients: updatedIngredients })
  }

  const addMeal = () => {
    if (newMeal.name && newMeal.ingredients && newMeal.ingredients.length > 0) {
      const meal: Meal = {
        id: Math.max(...meals.map((m) => m.id)) + 1,
        name: newMeal.name,
        description: newMeal.description || "",
        ingredients: newMeal.ingredients,
        category: newMeal.category || "Other",
        servings: newMeal.servings || 1,
        preparationTime: newMeal.preparationTime || 0,
        maxPortions: 0, // Will be calculated based on inventory
      }
      setMeals([...meals, meal])
      setNewMeal({ name: "", description: "", ingredients: [], category: "", servings: 1, preparationTime: 0 })
      setIsAddDialogOpen(false)
    }
  }

  const deleteMeal = (id: number) => {
    setMeals(meals.filter((meal) => meal.id !== id))
  }

  const categoryColors = {
    "Main Course": "bg-blue-100 text-blue-800",
    Vegetarian: "bg-green-100 text-green-800",
    Snack: "bg-yellow-100 text-yellow-800",
    Dessert: "bg-pink-100 text-pink-800",
    Other: "bg-gray-100 text-gray-800",
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-orange-600" />
                Meal Management
              </CardTitle>
              <CardDescription>Create and manage meal recipes with ingredient requirements</CardDescription>
            </div>
            {canEdit && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Meal
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Meal</DialogTitle>
                    <DialogDescription>Create a new meal recipe with ingredients</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="mealName" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="mealName"
                        value={newMeal.name || ""}
                        onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Input
                        id="description"
                        value={newMeal.description || ""}
                        onChange={(e) => setNewMeal({ ...newMeal, description: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category" className="text-right">
                        Category
                      </Label>
                      <Select onValueChange={(value) => setNewMeal({ ...newMeal, category: value })}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Main Course">Main Course</SelectItem>
                          <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                          <SelectItem value="Snack">Snack</SelectItem>
                          <SelectItem value="Dessert">Dessert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="servings">Servings</Label>
                        <Input
                          id="servings"
                          type="number"
                          value={newMeal.servings || 1}
                          onChange={(e) => setNewMeal({ ...newMeal, servings: Number.parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="prepTime">Prep Time (min)</Label>
                        <Input
                          id="prepTime"
                          type="number"
                          value={newMeal.preparationTime || 0}
                          onChange={(e) => setNewMeal({ ...newMeal, preparationTime: Number.parseInt(e.target.value) })}
                        />
                      </div>
                    </div>

                    {/* Ingredients Section */}
                    <div className="space-y-4">
                      <Label className="text-base font-semibold">Ingredients</Label>
                      <div className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-5">
                          <Label htmlFor="ingredient">Ingredient</Label>
                          <Select
                            onValueChange={(value) => setNewIngredient({ ...newIngredient, ingredientName: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select ingredient" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableIngredients.map((ing) => (
                                <SelectItem key={ing} value={ing}>
                                  {ing}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-3">
                          <Label htmlFor="quantity">Quantity</Label>
                          <Input
                            type="number"
                            value={newIngredient.quantity}
                            onChange={(e) =>
                              setNewIngredient({ ...newIngredient, quantity: Number.parseInt(e.target.value) })
                            }
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="unit">Unit</Label>
                          <Input
                            value={newIngredient.unit}
                            onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                          />
                        </div>
                        <div className="col-span-2">
                          <Button onClick={addIngredientToMeal} size="sm">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Added Ingredients List */}
                      {newMeal.ingredients && newMeal.ingredients.length > 0 && (
                        <div className="space-y-2">
                          <Label>Added Ingredients:</Label>
                          {newMeal.ingredients.map((ing, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <span>
                                {ing.ingredientName}: {ing.quantity}
                                {ing.unit}
                              </span>
                              <Button size="sm" variant="outline" onClick={() => removeIngredientFromMeal(index)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addMeal}>Add Meal</Button>
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
                <TableHead>Meal Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Ingredients</TableHead>
                <TableHead>Servings</TableHead>
                <TableHead>Prep Time</TableHead>
                <TableHead className="flex items-center gap-1">
                  <Calculator className="w-4 h-4" />
                  Max Portions
                </TableHead>
                {canEdit && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {meals.map((meal) => (
                <TableRow key={meal.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{meal.name}</div>
                      <div className="text-sm text-gray-500">{meal.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={categoryColors[meal.category as keyof typeof categoryColors] || categoryColors.Other}
                    >
                      {meal.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {meal.ingredients.map((ing, index) => (
                        <div key={index} className="text-sm">
                          {ing.ingredientName}: {ing.quantity}
                          {ing.unit}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{meal.servings}</TableCell>
                  <TableCell>{meal.preparationTime} min</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {meal.maxPortions} portions
                    </Badge>
                  </TableCell>
                  {canEdit && (
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => deleteMeal(meal.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
