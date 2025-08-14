'use client'

import { useState, useEffect } from 'react' // Added useEffect for fetching
import { InteractiveCalendar } from './InteractiveCalendar'
import { InteractiveCharts } from './InteractiveCharts'
import { AnimatedEventCard } from './AnimatedEventCard' // Assuming this is used; if not, remove
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { format, isSameDay, isToday, isPast } from 'date-fns'
import { Plus, Calendar as CalendarIcon, BarChart3, List, Sparkles, TrendingUp, Users, DollarSign, Eye, Activity } from 'lucide-react'
import toast from 'react-hot-toast'

// Firebase imports
import { db } from '@/lib/firebase' // Your Firebase config
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore' // Added Firestore functions

const isEditable = (createdAt) => {
  const now = Date.now()
  const eventTime = new Date(createdAt).getTime()
  const timeDiff = now - eventTime
  const twentyFourHours = 24 * 60 * 60 * 1000
  return timeDiff < twentyFourHours
}

export const CalendarDashboard = ({ isAdmin = true }) => {
  const [events, setEvents] = useState([]) // Manages local state, synced with Firestore
  const [showAnalytics, setShowAnalytics] = useState(false)

  // Real-time fetching of events from Firestore
  useEffect(() => {
    const eventsCollection = collection(db, 'events') // Assuming 'events' collection
    let q = eventsCollection // Base query

    // If not admin, optionally filter (e.g., only show public events; customize as needed)
    if (!isAdmin) {
      q = query(eventsCollection, where('isPublic', '==', true)) // Example filter; adjust to your schema
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedEvents = snapshot.docs.map(doc => ({
        id: doc.id, // Firestore doc ID
        ...doc.data()
      }))
      setEvents(fetchedEvents)
      toast.success('Events loaded from Firestore!', { icon: '🔄' }) // Optional feedback
    }, (error) => {
      console.error('Error fetching events:', error)
      toast.error('Failed to load events')
    })

    return () => unsubscribe() // Cleanup listener on unmount
  }, [isAdmin]) // Re-run if isAdmin changes

  const handleSaveEvent = async (eventData) => {
    if (!isAdmin) {
      toast.error('Only admins can create or edit events')
      return
    }

    try {
      if (eventData.id) {
        // Update existing event
        const eventToUpdate = events.find(e => e.id === eventData.id)
        if (!eventToUpdate || !isEditable(eventToUpdate.createdAt)) {
          toast.error('Event cannot be edited after 24 hours')
          return
        }
        const eventRef = doc(db, 'events', eventData.id)
        await updateDoc(eventRef, { ...eventData, updatedAt: new Date().toISOString() })
        toast.success('Event updated successfully! ✨')
      } else {
        // Add new event
        const newEvent = {
          ...eventData,
          createdAt: new Date().toISOString(),
          participants: Math.floor(Math.random() * 100) + 10, // Mock; replace with real data if needed
          isPublic: true // Example field; customize
        }
        await addDoc(collection(db, 'events'), newEvent)
        toast.success('New event created successfully! 🚀')
      }
      // Local state will auto-update via onSnapshot
    } catch (error) {
      console.error('Error saving event:', error)
      toast.error('Failed to save event: ' + error.message)
    }
  }

  const handleDeleteEvent = async (eventId) => {
    if (!isAdmin) {
      toast.error('Only admins can delete events')
      return
    }

    try {
      const eventToDelete = events.find(e => e.id === eventId)
      if (!eventToDelete || !isEditable(eventToDelete.createdAt)) {
        toast.error('Event cannot be deleted after 24 hours')
        return
      }
      await deleteDoc(doc(db, 'events', eventId))
      toast.success('Event deleted successfully 🗑️')
      // Local state will auto-update via onSnapshot
    } catch (error) {
      console.error('Error deleting event:', error)
      toast.error('Failed to delete event: ' + error.message)
    }
  }

  const totalEvents = events.length
  const totalBudget = events.reduce((sum, event) => sum + (event.budget || 0), 0)
  const todayEvents = events.filter(event => isToday(new Date(event.date))).length
  const upcomingEvents = events.filter(event => new Date(event.date) > new Date()).length

  // Get recent events for quick preview
  const recentEvents = events
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3)


  const formatDate = (dateString) => {
  if (!dateString) return "No date"; // Prevent empty/null
  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "Invalid date"; // Prevent invalid values

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};



  return (
    <div className="space-y-8">
      {/* Header with animated gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-indigo-600/90" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <Sparkles className="h-8 w-8 animate-pulse" />
                {isAdmin ? 'Admin Dashboard' : 'Event Calendar'}
              </h2>
              <p className="text-blue-100 text-lg">
                {isAdmin 
                  ? 'Manage events, track expenses, and grow your community' 
                  : 'View events, manage your schedule, and stay connected'
                }
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{totalEvents}</div>
              <div className="text-blue-100">Total Events</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/50 dark:to-indigo-950/50">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <div className="p-2 bg-blue-500 rounded-full group-hover:scale-110 transition-transform duration-300">
              <CalendarIcon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 group-hover:scale-105 transition-transform duration-300">
              {totalEvents}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              {todayEvents} scheduled for today
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/50 dark:to-emerald-950/50">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <div className="p-2 bg-green-500 rounded-full group-hover:scale-110 transition-transform duration-300">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 group-hover:scale-105 transition-transform duration-300">
              ₹{totalBudget.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Allocated across all events
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950/50 dark:to-violet-950/50">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-violet-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <div className="p-2 bg-purple-500 rounded-full group-hover:scale-110 transition-transform duration-300">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 group-hover:scale-105 transition-transform duration-300">
              {upcomingEvents}
            </div>
            <p className="text-xs text-muted-foreground">
              Future events planned
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950/50 dark:to-amber-950/50">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-amber-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Today</CardTitle>
            <div className="p-2 bg-orange-500 rounded-full group-hover:scale-110 transition-transform duration-300 animate-pulse">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600 group-hover:scale-105 transition-transform duration-300">
              {todayEvents}
            </div>
            <p className="text-xs text-muted-foreground">
              Events happening today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Interactive Calendar - Main Feature */}
        <div className="lg:col-span-2">
          <InteractiveCalendar 
            events={events}
            onSaveEvent={handleSaveEvent}
            onDeleteEvent={handleDeleteEvent}
            isAdmin={isAdmin}
          />
        </div>

        {/* Sidebar with Quick Actions and Recent Events */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                {isAdmin ? 'Manage your events efficiently' : 'Quick access to calendar features'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isAdmin && (
                <Button 
                  className="w-full gap-2 hover:scale-105 transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl"
                  onClick={() => {
                    const today = new Date()
                    handleSaveEvent({
                      title: 'Quick Event',
                      description: 'Created from dashboard',
                      date: today.toISOString(),
                      time: format(today, 'HH:mm'),
                      budget: 0,
                      category: 'Other'
                    })
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Quick Add Event
                </Button>
              )}
              
              {isAdmin && (
                <Button 
                  variant="outline"
                  className="w-full gap-2 hover:scale-105 transition-all duration-300"
                  onClick={() => setShowAnalytics(!showAnalytics)}
                >
                  <BarChart3 className="h-4 w-4" />
                  {showAnalytics ? 'Hide Analytics' : 'View Analytics'}
                </Button>
              )}

              <Button 
                variant="outline"
                className="w-full gap-2 hover:scale-105 transition-all duration-300"
                onClick={() => window.location.href = '/events'}
              >
                <List className="h-4 w-4" />
                View All Events
              </Button>
            </CardContent>
          </Card>

          {/* Recent Events Preview */}
          <Card className="border-0 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-950/50 dark:to-purple-950/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  <CardTitle>Recent Events</CardTitle>
                </div>
                <Badge variant="secondary">{recentEvents.length}</Badge>
              </div>
              <CardDescription>Quick overview of upcoming events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentEvents.length === 0 ? (
                <div className="text-center py-6">
                  <CalendarIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">No events scheduled</p>
                  {isAdmin && (
                    <p className="text-xs text-muted-foreground mt-1">Create your first event to get started!</p>
                  )}
                </div>
              ) : (
                recentEvents.map((event, index) => (
                  <div 
                    key={event.id}
                    className="p-3 rounded-lg bg-background/50 border border-border/50 hover:bg-background transition-all duration-300 cursor-pointer group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                          {event.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {event.date && !isNaN(new Date(event.date).getTime())
    ? format(new Date(event.date), 'MMM dd')
    : 'No date'}
                          {event.time && ` at ${event.time}`}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {event.category}
                          </Badge>
                          {event.budget > 0 && (
                            <span className="text-xs text-green-600 font-medium">
                              ₹{event.budget}
                            </span>
                          )}
                        </div>
                      </div>
                      {isToday(new Date(event.date)) && (
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Analytics Section - Expandable (Admin Only) */}
      {showAnalytics && isAdmin && (
        <div className="animate-in fade-in slide-in-from-top duration-500">
          <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  <CardTitle>Analytics Dashboard</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAnalytics(false)}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  Hide
                </Button>
              </div>
              <CardDescription>Interactive charts and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <InteractiveCharts />
            </CardContent>
          </Card>
        </div>
      )}

      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
