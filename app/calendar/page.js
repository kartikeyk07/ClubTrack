'use client'

import { useAuth } from '@/context/AuthContext'
import { Navbar } from '@/components/Navbar'
import { CalendarDashboard } from '@/components/CalendarDashboard'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function CalendarPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto"></div>
            <div className="h-6 w-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse">📅</div>
          </div>
          <p className="mt-4 text-muted-foreground animate-pulse">Loading calendar...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Calendar</h1>
          <p className="text-muted-foreground mt-2">
            View events, manage your schedule, and stay connected with club activities
          </p>
        </div>
        <CalendarDashboard isAdmin={false} />
      </div>
    </div>
  )
}