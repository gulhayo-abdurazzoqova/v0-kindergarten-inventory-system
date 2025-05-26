"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { ChefHat, Package, Users, TrendingUp, AlertTriangle, CheckCircle2, Settings } from "lucide-react"
import InventoryManager from "@/components/inventory-manager"
import MealManager from "@/components/meal-manager"
import ServingInterface from "@/components/serving-interface"
import AnalyticsDashboard from "@/components/analytics-dashboard"
import UserManagement from "@/components/user-management"
import SettingsPage from "@/components/settings-page"
import LoginForm from "@/components/login-form"
import { useAuth } from "@/hooks/use-auth"
import { useWebSocket } from "@/hooks/use-websocket"
import { useDashboardData } from "@/hooks/use-dashboard-data"

export default function KindergartenMealSystem() {
  const { user, isAuthenticated, logout } = useAuth()
  const { isConnected } = useWebSocket()
  const { dashboardStats, alerts, loading } = useDashboardData()

  if (!isAuthenticated) {
    return <LoginForm />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">🎒 Little Sprouts Kitchen</h1>
              <p className="text-lg text-gray-600">Meal Tracking & Inventory Management System</p>
              <div className="flex items-center gap-2 mt-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
                <span className="text-sm text-gray-500">{isConnected ? "Connected" : "Disconnected"}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Welcome back,</p>
              <p className="font-semibold text-gray-900">{user?.name}</p>
              <Badge variant="secondary" className="mt-1">
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </Badge>
              <button onClick={logout} className="block mt-2 text-sm text-blue-600 hover:text-blue-800">
                Logout
              </button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="meals" className="flex items-center gap-2">
              <ChefHat className="w-4 h-4" />
              Meals
            </TabsTrigger>
            <TabsTrigger value="serving" className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Serving
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-green-400 to-green-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Ingredients</CardTitle>
                  <Package className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats?.total_ingredients || 0}</div>
                  <p className="text-xs opacity-80">In inventory</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                  <AlertTriangle className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats?.low_stock_items || 0}</div>
                  <p className="text-xs opacity-80">Need attention</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-400 to-blue-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Meals Served Today</CardTitle>
                  <ChefHat className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardStats?.meals_served_today || 0}</div>
                  <p className="text-xs opacity-80">Out of {dashboardStats?.total_students || 0} students</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-400 to-purple-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                  <TrendingUp className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${dashboardStats?.inventory_value || 0}</div>
                  <p className="text-xs opacity-80">Current worth</p>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Discrepancy Alert */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Monthly Discrepancy Rate
                </CardTitle>
                <CardDescription>Difference between expected and actual ingredient usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Current Rate</span>
                    <span className="text-2xl font-bold text-green-600">
                      {dashboardStats?.monthly_discrepancy || 0}%
                    </span>
                  </div>
                  <Progress value={dashboardStats?.monthly_discrepancy || 0} className="h-2" />
                  <p className="text-xs text-gray-600">✅ Below 15% threshold - No concern detected</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {alerts?.map((alert, index) => (
                  <Alert
                    key={index}
                    className={
                      alert.type === "warning" ? "border-orange-200 bg-orange-50" : "border-blue-200 bg-blue-50"
                    }
                  >
                    <AlertDescription className="flex items-center justify-between">
                      <span>{alert.message}</span>
                      <span className="text-xs text-gray-500">{alert.time}</span>
                    </AlertDescription>
                  </Alert>
                )) || []}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryManager userRole={user?.role || "cook"} />
          </TabsContent>

          <TabsContent value="meals">
            <MealManager userRole={user?.role || "cook"} />
          </TabsContent>

          <TabsContent value="serving">
            <ServingInterface currentUser={user} />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement currentUser={user} />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsPage currentUser={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
