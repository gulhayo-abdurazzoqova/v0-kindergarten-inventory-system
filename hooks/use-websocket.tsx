"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface WebSocketContextType {
  isConnected: boolean
  sendMessage: (message: string) => void
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // In a real app, you'd connect to your WebSocket server
    // const ws = new WebSocket("ws://localhost:8000/ws")

    // Mock connection for demo
    setIsConnected(true)

    // ws.onopen = () => setIsConnected(true)
    // ws.onclose = () => setIsConnected(false)
    // ws.onmessage = (event) => {
    //   const data = JSON.parse(event.data)
    //   // Handle real-time updates
    // }

    // setSocket(ws)

    // return () => {
    //   ws.close()
    // }
  }, [])

  const sendMessage = (message: string) => {
    if (socket && isConnected) {
      socket.send(message)
    }
  }

  return <WebSocketContext.Provider value={{ isConnected, sendMessage }}>{children}</WebSocketContext.Provider>
}

export function useWebSocket() {
  const context = useContext(WebSocketContext)
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider")
  }
  return context
}
