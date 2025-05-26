"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, Calendar, AlertTriangle } from "lucide-react"

export default function AnalyticsDashboard() {
  // Mock data for charts
  const ingredientUsageData = [
    { name: "Week 1", beef: 2400, chicken: 1800, rice: 3200, potatoes: 4800 },
    { name: "Week 2", beef: 1800, chicken: 2200, rice: 2800, potatoes: 4200 },
    { name: "Week 3", beef: 2200, chicken: 1600, rice: 3000, potatoes: 4600 },
    { name: "Week 4", beef: 2600, chicken: 2000, rice: 3400, potatoes: 5000 },
  ]

  const monthlyPortionsData = [
    { month: "Sep", served: 450, possible: 500, efficiency: 90 },
    { month: "Oct", served: 380, possible: 420, efficiency: 90.5 },
    { month: "Nov", served: 420, possible: 480, efficiency: 87.5 },
    { month: "Dec", served: 390, possible: 450, efficiency: 86.7 },
    { month: "Jan", served: 410, possible: 470, efficiency: 87.2 },
  ]

  const mealPopularityData = [
    { name: "Beef & Potato Stew", value: 35, color: "#8884d8" },
    { name: "Chicken Rice Bowl", value: 28, color: "#82ca9d" },
    { name: "Vegetable Rice", value: 22, color: "#ffc658" },
    { name: "Fish Curry", value: 15, color: "#ff7c7c" },
  ]

  const wasteAnalysisData = [
    { ingredient: "Carrots", wasted: 120, percentage: 8.2 },
    { ingredient: "Potatoes", wasted: 200, percentage: 4.1 },
    { ingredient: "Rice", wasted: 150, percentage: 3.8 },
    { ingredient: "Beef", wasted: 80, percentage: 3.2 },
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-400 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.2%</div>
            <div className="flex items-center text-xs opacity-80">
              <TrendingUp className="w-3 h-3 mr-1" />
              +2.1% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-400 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waste Reduction</CardTitle>
            <TrendingDown className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8%</div>
            <div className="flex items-center text-xs opacity-80">
              <TrendingDown className="w-3 h-3 mr-1" />
              -1.2% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-400 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Prep Time</CardTitle>
            <Calendar className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32 min</div>
            <div className="flex items-center text-xs opacity-80">
              <TrendingDown className="w-3 h-3 mr-1" />
              -3 min from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-400 to-red-500 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost per Portion</CardTitle>
            <TrendingUp className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.45</div>
            <div className="flex items-center text-xs opacity-80">
              <TrendingUp className="w-3 h-3 mr-1" />
              +$0.05 from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ingredient Usage Over Time</CardTitle>
            <CardDescription>Weekly consumption tracking by ingredient type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ingredientUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="beef" fill="#ef4444" name="Beef" />
                <Bar dataKey="chicken" fill="#f97316" name="Chicken" />
                <Bar dataKey="rice" fill="#eab308" name="Rice" />
                <Bar dataKey="potatoes" fill="#22c55e" name="Potatoes" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Serving Efficiency</CardTitle>
            <CardDescription>Portions served vs. possible portions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyPortionsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="served" stroke="#3b82f6" name="Served" strokeWidth={2} />
                <Line type="monotone" dataKey="possible" stroke="#10b981" name="Possible" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Meal Popularity</CardTitle>
            <CardDescription>Distribution of meals served this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mealPopularityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {mealPopularityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Waste Analysis</CardTitle>
            <CardDescription>Ingredient waste tracking and percentages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {wasteAnalysisData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.ingredient}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{item.wasted}g</span>
                    <Badge variant={item.percentage > 5 ? "destructive" : "secondary"}>{item.percentage}%</Badge>
                  </div>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            System Recommendations
          </CardTitle>
          <CardDescription>AI-powered insights and suggestions for optimization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900">💡 Inventory Optimization</h4>
            <p className="text-sm text-blue-800 mt-1">
              Consider reducing carrot orders by 15% - historical data shows consistent overstock.
            </p>
          </div>
          <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-900">✅ Efficiency Improvement</h4>
            <p className="text-sm text-green-800 mt-1">
              Beef & Potato Stew preparation time improved by 12% this month. Great work!
            </p>
          </div>
          <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
            <h4 className="font-semibold text-yellow-900">⚠️ Waste Alert</h4>
            <p className="text-sm text-yellow-800 mt-1">
              Carrot waste increased to 8.2% this month. Consider adjusting portion sizes or finding alternative uses.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
