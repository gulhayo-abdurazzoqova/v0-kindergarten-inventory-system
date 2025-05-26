"use client"

import { useState, useEffect } from "react"

export function useDashboardData() {
  const [dashboardStats, setDashboardStats] = useState({
    total_ingredients: 24,
    low_stock_items: 3,
    meals_served_today: 45,
    total_students: 120,
    inventory_value: 2847.5,
    monthly_discrepancy: 8.2,
  })

  const [alerts, setAlerts] = useState([
    {
      type: "warning",
      message: "Carrots running low (180g remaining)",
      time: "2 hours ago",
    },
    {
      type: "info",
      message: "Monthly report generated successfully",
      time: "1 day ago",
    },
  ])

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // In a real app, you'd fetch from your API
      // const response = await fetch("/api/analytics/dashboard")
      // const data = await response.json()
      // setDashboardStats(data)

      // Simulate loading delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  return { dashboardStats, alerts, loading, refreshData: loadDashboardData }
}
