"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CheckCircle2, AlertTriangle, Clock, User } from "lucide-react"

interface ServingLog {
  id: number
  mealName: string
  portions: number
  servedBy: string
  timestamp: string
  status: "success" | "failed"
  failureReason?: string
}

interface ServingInterfaceProps {
  currentUser: {
    id: number
    name: string
    role: string
    email: string
  }
}

export default function ServingInterface({ currentUser }: ServingInterfaceProps) {
  const [selectedMeal, setSelectedMeal] = useState("")
  const [portionsToServe, setPortionsToServe] = useState(1)
  const [servingLogs, setServingLogs] = useState<ServingLog[]>([
    {
      id: 1,
      mealName: "Beef & Potato Stew",
      portions: 6,
      servedBy: "Sarah Johnson",
      timestamp: "2024-01-16 12:30:00",
      status: "success",
    },
    {
      id: 2,
      mealName: "Chicken Rice Bowl",
      portions: 5,
      servedBy: "Mike Chen",
      timestamp: "2024-01-16 11:45:00",
      status: "success",
    },
    {
      id: 3,
      mealName: "Beef & Potato Stew",
      portions: 8,
      servedBy: "Lisa Wong",
      timestamp: "2024-01-16 10:15:00",
      status: "failed",
      failureReason: "Insufficient carrots (needed 160g, had 120g)",
    },
  ])

  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const availableMeals = [
    {
      name: "Beef & Potato Stew",
      maxPortions: 3,
      ingredients: [
        { name: "Beef", needed: 500, available: 2500 },
        { name: "Potatoes", needed: 800, available: 5000 },
        { name: "Carrots", needed: 200, available: 180 },
        { name: "Salt", needed: 10, available: 950 },
      ],
    },
    {
      name: "Chicken Rice Bowl",
      maxPortions: 4,
      ingredients: [
        { name: "Chicken", needed: 400, available: 1800 },
        { name: "Rice", needed: 300, available: 3200 },
        { name: "Carrots", needed: 150, available: 180 },
        { name: "Salt", needed: 8, available: 950 },
      ],
    },
    {
      name: "Vegetable Rice",
      maxPortions: 8,
      ingredients: [
        { name: "Rice", needed: 400, available: 3200 },
        { name: "Carrots", needed: 100, available: 180 },
        { name: "Potatoes", needed: 300, available: 5000 },
        { name: "Salt", needed: 6, available: 950 },
      ],
    },
  ]

  const serveMeal = () => {
    const meal = availableMeals.find((m) => m.name === selectedMeal)
    if (!meal) return

    // Check if we have enough ingredients
    const insufficientIngredients = meal.ingredients.filter((ing) => ing.available < ing.needed * portionsToServe)

    if (insufficientIngredients.length > 0) {
      const reason = `Insufficient ${insufficientIngredients[0].name} (needed ${insufficientIngredients[0].needed * portionsToServe}g, had ${insufficientIngredients[0].available}g)`

      const newLog: ServingLog = {
        id: Math.max(...servingLogs.map((l) => l.id)) + 1,
        mealName: selectedMeal,
        portions: portionsToServe,
        servedBy: currentUser.name,
        timestamp: new Date().toLocaleString(),
        status: "failed",
        failureReason: reason,
      }

      setServingLogs([newLog, ...servingLogs])
      setAlert({
        type: "error",
        message: `Cannot serve meal: ${reason}`,
      })
      return
    }

    // Success - deduct ingredients and log
    const newLog: ServingLog = {
      id: Math.max(...servingLogs.map((l) => l.id)) + 1,
      mealName: selectedMeal,
      portions: portionsToServe,
      servedBy: currentUser.name,
      timestamp: new Date().toLocaleString(),
      status: "success",
    }

    setServingLogs([newLog, ...servingLogs])
    setAlert({
      type: "success",
      message: `Successfully served ${portionsToServe} portions of ${selectedMeal}`,
    })

    // Reset form
    setSelectedMeal("")
    setPortionsToServe(1)
  }

  const selectedMealData = availableMeals.find((m) => m.name === selectedMeal)

  return (
    <div className="space-y-6">
      {/* Serving Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Meal Serving Interface
          </CardTitle>
          <CardDescription>Select a meal and number of portions to serve</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {alert && (
            <Alert className={alert.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meal">Select Meal</Label>
              <Select value={selectedMeal} onValueChange={setSelectedMeal}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a meal" />
                </SelectTrigger>
                <SelectContent>
                  {availableMeals.map((meal) => (
                    <SelectItem key={meal.name} value={meal.name}>
                      {meal.name} (Max: {meal.maxPortions})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="portions">Portions to Serve</Label>
              <Input
                id="portions"
                type="number"
                min="1"
                max={selectedMealData?.maxPortions || 1}
                value={portionsToServe}
                onChange={(e) => setPortionsToServe(Number.parseInt(e.target.value))}
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={serveMeal}
                disabled={!selectedMeal}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Serve Meal
              </Button>
            </div>
          </div>

          {/* Ingredient Check */}
          {selectedMealData && (
            <Card className="bg-blue-50">
              <CardHeader>
                <CardTitle className="text-lg">Ingredient Availability Check</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedMealData.ingredients.map((ingredient, index) => {
                    const needed = ingredient.needed * portionsToServe
                    const isAvailable = ingredient.available >= needed

                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <span className="font-medium">{ingredient.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            {needed}g needed / {ingredient.available}g available
                          </span>
                          {isAvailable ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Serving History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Serving History
          </CardTitle>
          <CardDescription>Recent meal serving activities and logs</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Meal</TableHead>
                <TableHead>Portions</TableHead>
                <TableHead>Served By</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servingLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.mealName}</TableCell>
                  <TableCell>{log.portions}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {log.servedBy}
                    </div>
                  </TableCell>
                  <TableCell>{log.timestamp}</TableCell>
                  <TableCell>
                    <Badge variant={log.status === "success" ? "default" : "destructive"}>
                      {log.status === "success" ? "Success" : "Failed"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {log.failureReason && <div className="text-sm text-red-600">{log.failureReason}</div>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
