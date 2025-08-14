

'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Navbar } from '@/components/Navbar'
import { AnimatedEventCard } from '@/components/AnimatedEventCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useRouter } from 'next/navigation'
import { Search, Filter, Calendar, Plus, Users, DollarSign, Grid, List as ListIcon, Sparkles, TrendingUp, MapPin, Clock, Eye } from 'lucide-react'
import { isToday, isTomorrow, isPast, isThisWeek, isThisMonth, format } from 'date-fns'
import toast from 'react-hot-toast'
import { deleteDoc, doc } from 'firebase/firestore'
import { collection, onSnapshot, query, where } from 'firebase/firestore' // Updated imports: removed getDocs, added onSnapshot, query, where
import { db } from '@/lib/firebase'

export default function EventsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [events, setEvents] = useState([]) // Will be populated from Firestore
  const [filteredEvents, setFilteredEvents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [timeFilter, setTimeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [animationKey, setAnimationKey] = useState(0)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // New: Fetch events from Firestore in real-time
  useEffect(() => {
    if (!user) return // Wait for user to be available

    const eventsCollection = collection(db, 'events')
    let q = eventsCollection // Base query

    // Optional: If not admin, filter to public events (customize as needed)
    if (user.role !== 'admin') {
      q = query(eventsCollection, where('isPublic', '==', true)) // Assumes 'isPublic' field; adjust or remove
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedEvents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setEvents(fetchedEvents)
      toast.success('Events loaded!', { icon: '🔄' }) // Optional feedback
    }, (error) => {
      console.error('Error fetching events:', error)
      toast.error('Failed to load events: ' + error.message)
    })

    return () => unsubscribe() // Cleanup on unmount
  }, [user]) // Re-run when user changes

  useEffect(() => {
    let filtered = events

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(event => event.category === categoryFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter)
    }

    // Time filter
    if (timeFilter !== 'all') {
      const eventDate = (event) => new Date(event.date)
      filtered = filtered.filter(event => {
        switch (timeFilter) {
          case 'today':
            return isToday(eventDate(event))
          case 'tomorrow':
            return isTomorrow(eventDate(event))
          case 'thisWeek':
            return isThisWeek(eventDate(event))
          case 'thisMonth':
            return isThisMonth(eventDate(event))
          case 'past':
            return isPast(eventDate(event))
          case 'upcoming':
            return !isPast(eventDate(event))
          default:
            return true
        }
      })
    }

    setFilteredEvents(filtered)
    setAnimationKey(prev => prev + 1)
  }, [events, searchTerm, categoryFilter, timeFilter, statusFilter])

  const handleClearFilters = () => {
    setSearchTerm('')
    setCategoryFilter('all')
    setTimeFilter('all')
    setStatusFilter('all')
    toast.success('Filters cleared! ✨', {
      icon: '🔄',
      style: {
        borderRadius: '10px',
        background: '#3B82F6',
        color: '#fff',
      },
    })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="default" className="bg-green-500">Confirmed</Badge>
      case 'planning':
        return <Badge variant="secondary">Planning</Badge>
      case 'completed':
        return <Badge variant="outline">Completed</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto"></div>
            <Sparkles className="h-6 w-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="mt-4 text-muted-foreground animate-pulse">Loading events...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const categories = [...new Set(events.map(event => event.category).filter(Boolean))]
  const statuses = [...new Set(events.map(event => event.status).filter(Boolean))]
  const totalEvents = events.length
  const upcomingEvents = events.filter(event => !isPast(new Date(event.date))).length
  const totalBudget = events.reduce((sum, event) => sum + (event.budget || 0), 0)
  const totalParticipants = events.reduce((sum, event) => sum + (event.participants || 0), 0)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Animated Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 mb-8 text-white">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob" />
            <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Calendar className="h-10 w-10" />
                All Events
              </h1>
              <p className="text-indigo-100 text-lg">
                {user.role === 'admin' ? 'Complete overview and management of all club events' : 'Explore all upcoming and past club events'}
              </p>
            </div>
            {user.role === 'admin' && (
              <Button
                onClick={() => router.push('/dashboard')}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 gap-2 hover:scale-105 transition-all duration-300"
                variant="ghost"
              >
                <Plus className="h-4 w-4" />
                Add Event
              </Button>
            )}
          </div>
        </div>

        {/* Enhanced Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border-0 bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-950/50 dark:to-cyan-950/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <div className="p-2 bg-blue-500 rounded-full group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <Calendar className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 group-hover:scale-105 transition-transform duration-300">
                {totalEvents}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                All time events
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border-0 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/50 dark:to-emerald-950/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <div className="p-2 bg-green-500 rounded-full group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 group-hover:scale-105 transition-transform duration-300">
                {upcomingEvents}
              </div>
              <p className="text-xs text-muted-foreground">
                Future events scheduled
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border-0 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950/50 dark:to-violet-950/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <div className="p-2 bg-purple-500 rounded-full group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 group-hover:scale-105 transition-transform duration-300">
                ₹{totalBudget.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Allocated across events
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border-0 bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-950/50 dark:to-amber-950/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
              <div className="p-2 bg-orange-500 rounded-full group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600 group-hover:scale-105 transition-transform duration-300">
                {totalParticipants}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all events
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Filters */}
        <Card className="mb-8 overflow-hidden border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary rounded-full">
                  <Filter className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg">Advanced Filters</CardTitle>
                  <CardDescription>Find and organize events efficiently</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="gap-2"
                >
                  <Grid className="h-4 w-4" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="gap-2"
                >
                  <ListIcon className="h-4 w-4" />
                  List
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Table
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search events, descriptions, locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-0 bg-muted/50 focus:bg-background transition-all duration-300"
                  />
                </div>
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="border-0 bg-muted/50 focus:bg-background">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-0 bg-muted/50 focus:bg-background">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="border-0 bg-muted/50 focus:bg-background">
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="thisWeek">This Week</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters */}
            {(searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' || timeFilter !== 'all') && (
              <div className="flex items-center gap-2 mt-4 animate-in fade-in duration-300">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="text-xs animate-in slide-in-from-left duration-300">
                    Search: {searchTerm}
                  </Badge>
                )}
                {categoryFilter !== 'all' && (
                  <Badge variant="secondary" className="text-xs animate-in slide-in-from-left duration-300">
                    Category: {categoryFilter}
                  </Badge>
                )}
                {statusFilter !== 'all' && (
                  <Badge variant="secondary" className="text-xs animate-in slide-in-from-left duration-300">
                    Status: {statusFilter}
                  </Badge>
                )}
                {timeFilter !== 'all' && (
                  <Badge variant="secondary" className="text-xs animate-in slide-in-from-left duration-300">
                    Time: {timeFilter}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="h-6 px-2 text-xs hover:scale-105 transition-transform duration-200"
                >
                  Clear all
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Events Display */}
        <div key={animationKey}>
          {filteredEvents.length === 0 ? (
            <Card className="text-center py-16 border-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
              <CardContent>
                <div className="relative">
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-50" />
                  <Sparkles className="h-6 w-6 text-yellow-500 absolute top-0 right-1/2 transform translate-x-8 animate-pulse" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">No events found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' || timeFilter !== 'all'
                    ? 'Try adjusting your filters to discover more events.'
                    : 'No events have been scheduled yet. Be the first to create one!'}
                </p>
                {user.role === 'admin' && (
                  <Button
                    onClick={() => router.push('/dashboard')}
                    className="gap-2 hover:scale-105 transition-all duration-300"
                  >
                    <Plus className="h-4 w-4" />
                    Create First Event
                  </Button>
                )}
                {user.role !== 'admin' && (
                  <Button
                    onClick={() => router.push('/calendar')}
                    className="gap-2 hover:scale-105 transition-all duration-300"
                  >
                    <Calendar className="h-4 w-4" />
                    View Calendar
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredEvents
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map((event, index) => (
                      <AnimatedEventCard
                        key={`${event.id}-${animationKey}`}
                        event={event}
                        isAdmin={user.role === 'admin'}
                        showActions={user.role === 'admin'}
                        delay={index * 100}
                        onEdit={(event) => {
                          toast.success('Edit functionality - redirecting to dashboard!', {
                            icon: '⚡',
                          })
                          if (user.role === 'admin') {
                            router.push('/dashboard')
                          } else {
                            router.push('/calendar')
                          }
                        }}


                        // Inside your component where onDelete is defined:
                        onDelete={async (event) => {
                          if (!event?.id) return toast.error('Event ID is missing.')

                          const confirmDelete = confirm(`Are you sure you want to delete "${event.title}"?`)
                          if (!confirmDelete) return

                          try {
                            await deleteDoc(doc(db, 'events', event.id))
                            toast.success('Event deleted successfully! 🗑️')
                          } catch (error) {
                            console.error('Error deleting event:', error)
                            toast.error('Failed to delete event.')
                          }
                        }}

                      />
                    ))}
                </div>
              )}

              {viewMode === 'list' && (
                <div className="space-y-6">
                  {filteredEvents
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map((event, index) => (
                      <AnimatedEventCard
                        key={`${event.id}-${animationKey}`}
                        event={event}
                        isAdmin={user.role === 'admin'}
                        showActions={user.role === 'admin'}
                        delay={index * 50}
                        onEdit={(event) => {
                          toast.success('Edit functionality - redirecting to dashboard!', {
                            icon: '⚡',
                          })
                          if (user.role === 'admin') {
                            router.push('/dashboard')
                          } else {
                            router.push('/calendar')
                          }
                        }}
                        onDelete={(event) => {
                          toast.success('Delete functionality coming soon!', {
                            icon: '🗑️',
                          })
                        }}
                      />
                    ))}
                </div>
              )}

              {viewMode === 'table' && (
                <Card className="overflow-hidden border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Events Table View</CardTitle>
                    <CardDescription>Detailed overview of all events</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead>Event</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Budget</TableHead>
                            <TableHead>Participants</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredEvents
                            .sort((a, b) => new Date(a.date) - new Date(b.date))
                            .map((event, index) => (
                              <TableRow
                                key={event.id}
                                className="hover:bg-muted/30 transition-colors cursor-pointer"
                                style={{ animationDelay: `${index * 50}ms` }}
                              >
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{event.title}</div>
                                    <div className="text-sm text-muted-foreground truncate max-w-xs">
                                      {event.description}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                      <div className="text-sm font-medium">
                                        {format(new Date(event.date), 'MMM dd, yyyy')}
                                      </div>
                                      {event.time && (
                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          {event.time}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{event.location || 'TBD'}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">{event.category}</Badge>
                                </TableCell>
                                <TableCell>
                                  {getStatusBadge(event.status)}
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium text-green-600">
                                    ₹{event.budget?.toLocaleString() || 0}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span>{event.participants || 0}</span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}
