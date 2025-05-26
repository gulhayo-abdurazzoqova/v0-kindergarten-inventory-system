"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Settings, Building, Bell, Globe, Shield, Database, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SettingsPageProps {
  currentUser: {
    id: number
    name: string
    role: string
    email: string
  }
}

export default function SettingsPage({ currentUser }: SettingsPageProps) {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    kindergarten_name: "Little Sprouts Kindergarten",
    address: "123 Learning Lane, Education City",
    phone: "+1 (555) 123-4567",
    email: "contact@littlesprouts.edu",
    low_stock_threshold_days: 7,
    auto_reorder_enabled: false,
    notification_email: "admin@littlesprouts.edu",
    timezone: "UTC",
    currency: "USD",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const canEditSettings = currentUser.role === "admin"
  const canViewSettings = currentUser.role === "admin" || currentUser.role === "manager"

  useEffect(() => {
    if (canViewSettings) {
      loadSettings()
    }
  }, [])

  const loadSettings = async () => {
    setIsLoading(true)
    try {
      // API call to load settings
      // const response = await fetch('/api/settings')
      // const data = await response.json()
      // setSettings(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveSettings = async () => {
    if (!canEditSettings) return

    setIsSaving(true)
    try {
      // API call to save settings
      // await fetch('/api/settings', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // })

      toast({
        title: "Success",
        description: "Settings saved successfully",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const exportData = async () => {
    try {
      // API call to export data
      toast({
        title: "Export Started",
        description: "Your data export will be ready shortly",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      })
    }
  }

  const importData = async (file: File) => {
    try {
      // API call to import data
      toast({
        title: "Import Started",
        description: "Data import is being processed",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import data",
        variant: "destructive",
      })
    }
  }

  if (!canViewSettings) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">You don't have permission to view system settings.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                System Settings
              </CardTitle>
              <CardDescription>Configure system preferences and organizational details</CardDescription>
            </div>
            <Badge variant={canEditSettings ? "default" : "secondary"}>
              {canEditSettings ? "Admin Access" : "Read Only"}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="localization" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Localization
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization Information</CardTitle>
              <CardDescription>Basic information about your kindergarten</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kindergarten_name">Kindergarten Name</Label>
                  <Input
                    id="kindergarten_name"
                    value={settings.kindergarten_name}
                    onChange={(e) => setSettings({ ...settings, kindergarten_name: e.target.value })}
                    disabled={!canEditSettings}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    disabled={!canEditSettings}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  disabled={!canEditSettings}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  disabled={!canEditSettings}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Settings</CardTitle>
              <CardDescription>Configure inventory management preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="threshold_days">Low Stock Threshold (Days)</Label>
                <Input
                  id="threshold_days"
                  type="number"
                  value={settings.low_stock_threshold_days}
                  onChange={(e) =>
                    setSettings({ ...settings, low_stock_threshold_days: Number.parseInt(e.target.value) })
                  }
                  disabled={!canEditSettings}
                />
                <p className="text-xs text-gray-500">Alert when ingredients will run out in this many days</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Reorder</Label>
                  <p className="text-xs text-gray-500">Automatically create purchase orders for low stock items</p>
                </div>
                <Switch
                  checked={settings.auto_reorder_enabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, auto_reorder_enabled: checked })}
                  disabled={!canEditSettings}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notification_email">Notification Email</Label>
                <Input
                  id="notification_email"
                  type="email"
                  value={settings.notification_email}
                  onChange={(e) => setSettings({ ...settings, notification_email: e.target.value })}
                  disabled={!canEditSettings}
                />
                <p className="text-xs text-gray-500">Email address for system notifications and alerts</p>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Types</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Low Stock Alerts</Label>
                    <p className="text-xs text-gray-500">Get notified when ingredients are running low</p>
                  </div>
                  <Switch defaultChecked disabled={!canEditSettings} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Daily Reports</Label>
                    <p className="text-xs text-gray-500">Receive daily meal serving summaries</p>
                  </div>
                  <Switch defaultChecked disabled={!canEditSettings} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Failed Servings</Label>
                    <p className="text-xs text-gray-500">
                      Alert when meals cannot be served due to insufficient ingredients
                    </p>
                  </div>
                  <Switch defaultChecked disabled={!canEditSettings} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Analytics</Label>
                    <p className="text-xs text-gray-500">Receive weekly performance and waste analysis reports</p>
                  </div>
                  <Switch disabled={!canEditSettings} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="localization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Localization Settings</CardTitle>
              <CardDescription>Configure timezone, currency, and regional preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                    disabled={!canEditSettings}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Europe/Paris">Paris</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={settings.currency}
                    onValueChange={(value) => setSettings({ ...settings, currency: value })}
                    disabled={!canEditSettings}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                      <SelectItem value="CAD">CAD (C$)</SelectItem>
                      <SelectItem value="AUD">AUD (A$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Date & Time Format</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Select defaultValue="MM/dd/yyyy" disabled={!canEditSettings}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/dd/yyyy">MM/dd/yyyy (US)</SelectItem>
                        <SelectItem value="dd/MM/yyyy">dd/MM/yyyy (EU)</SelectItem>
                        <SelectItem value="yyyy-MM-dd">yyyy-MM-dd (ISO)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Time Format</Label>
                    <Select defaultValue="12h" disabled={!canEditSettings}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12 Hour (AM/PM)</SelectItem>
                        <SelectItem value="24h">24 Hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security and access control settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-xs text-gray-500">Require 2FA for admin accounts</p>
                  </div>
                  <Switch disabled={!canEditSettings} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Session Timeout</Label>
                    <p className="text-xs text-gray-500">Auto-logout users after inactivity</p>
                  </div>
                  <Switch defaultChecked disabled={!canEditSettings} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Audit Logging</Label>
                    <p className="text-xs text-gray-500">Log all user actions for security auditing</p>
                  </div>
                  <Switch defaultChecked disabled={!canEditSettings} />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Password Policy</h3>

                <div className="space-y-2">
                  <Label>Minimum Password Length</Label>
                  <Select defaultValue="8" disabled={!canEditSettings}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 characters</SelectItem>
                      <SelectItem value="8">8 characters</SelectItem>
                      <SelectItem value="12">12 characters</SelectItem>
                      <SelectItem value="16">16 characters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Special Characters</Label>
                    <p className="text-xs text-gray-500">Passwords must contain special characters</p>
                  </div>
                  <Switch defaultChecked disabled={!canEditSettings} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Password Expiration</Label>
                    <p className="text-xs text-gray-500">Force password changes every 90 days</p>
                  </div>
                  <Switch disabled={!canEditSettings} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Export and import system data, manage backups</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Data Export</h3>
                <p className="text-sm text-gray-600">Export your data for backup or migration purposes</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={exportData}
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={!canEditSettings}
                  >
                    <Download className="w-4 h-4" />
                    Export All Data
                  </Button>

                  <Button
                    onClick={() => exportData()}
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={!canEditSettings}
                  >
                    <Download className="w-4 h-4" />
                    Export Inventory Only
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Data Import</h3>
                <p className="text-sm text-gray-600">Import data from backup files or other systems</p>

                <div className="space-y-2">
                  <Label htmlFor="import-file">Select Import File</Label>
                  <Input
                    id="import-file"
                    type="file"
                    accept=".json,.csv,.xlsx"
                    disabled={!canEditSettings}
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) importData(file)
                    }}
                  />
                  <p className="text-xs text-gray-500">Supported formats: JSON, CSV, Excel</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Database Maintenance</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" disabled={!canEditSettings}>
                    Optimize Database
                  </Button>

                  <Button variant="outline" disabled={!canEditSettings}>
                    Clear Audit Logs
                  </Button>
                </div>

                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertDescription className="text-yellow-800">
                    Database maintenance operations should be performed during off-hours to avoid disruptions.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {canEditSettings && (
        <div className="flex justify-end">
          <Button
            onClick={saveSettings}
            disabled={isSaving}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      )}
    </div>
  )
}
