// 'use client'

// import { useState, useEffect } from 'react'
// import { useAuth } from '@/context/AuthContext'
// import { Navbar } from '@/components/Navbar'
// import { MessageForm } from '@/components/MessageForm'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { useRouter } from 'next/navigation'
// import { format } from 'date-fns'
// import { MessageSquare, Clock, CheckCircle, XCircle, Send, Filter, Calendar } from 'lucide-react'
// import toast from 'react-hot-toast'

// export default function MessagesPage() {
//   const { user, loading } = useAuth()
//   const router = useRouter()
//   const [messages, setMessages] = useState([]) // Fresh start - no mock data
//   const [userRequests, setUserRequests] = useState([]) // Fresh start - no mock data
//   const [filteredMessages, setFilteredMessages] = useState([])
//   const [statusFilter, setStatusFilter] = useState('all')

//   useEffect(() => {
//     if (!loading && !user) {
//       router.push('/login')
//     }
//   }, [user, loading, router])

//   useEffect(() => {
//     let filtered = messages

//     if (statusFilter !== 'all') {
//       filtered = filtered.filter(message => message.status === statusFilter)
//     }

//     setFilteredMessages(filtered)
//   }, [messages, statusFilter])

//   const handleNewRequest = async (requestData) => {
//     const newRequest = {
//       id: Date.now().toString(),
//       userName: user.name,
//       userEmail: user.email,
//       ...requestData,
//       status: 'pending',
//       createdAt: new Date().toISOString()
//     }

//     if (user.role === 'admin') {
//       setMessages([newRequest, ...messages])
//     } else {
//       setUserRequests([newRequest, ...userRequests])
//     }

//     toast.success('Event request submitted successfully! 🚀', {
//       icon: '✨',
//       style: {
//         borderRadius: '10px',
//         background: '#10B981',
//         color: '#fff',
//       },
//     })
//   }

//   const handleStatusUpdate = async (messageId, status) => {
//     setMessages(messages.map(message => 
//       message.id === messageId 
//         ? { ...message, status }
//         : message
//     ))

//     toast.success(`Request ${status} successfully! ✅`, {
//       icon: status === 'approved' ? '✅' : '❌',
//       style: {
//         borderRadius: '10px',
//         background: status === 'approved' ? '#10B981' : '#EF4444',
//         color: '#fff',
//       },
//     })
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//       </div>
//     )
//   }

//   if (!user) {
//     return null
//   }

//   const getStatusCounts = () => {
//     return {
//       total: messages.length,
//       pending: messages.filter(m => m.status === 'pending').length,
//       approved: messages.filter(m => m.status === 'approved').length,
//       rejected: messages.filter(m => m.status === 'rejected').length
//     }
//   }

//   const statusCounts = getStatusCounts()

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case 'approved':
//         return <Badge variant="default" className="bg-green-500">Approved</Badge>
//       case 'rejected':
//         return <Badge variant="destructive">Rejected</Badge>
//       case 'pending':
//         return <Badge variant="secondary">Pending</Badge>
//       default:
//         return <Badge variant="outline">Unknown</Badge>
//     }
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-foreground">
//             {user.role === 'admin' ? 'Event Requests' : 'Request Event'}
//           </h1>
//           <p className="text-muted-foreground mt-2">
//             {user.role === 'admin' 
//               ? 'Review and manage event requests from club members'
//               : 'Submit requests for new events and track their status'
//             }
//           </p>
//         </div>

//         {user.role === 'admin' ? (
//           <>
//             {/* Admin Statistics */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
//                   <MessageSquare className="h-4 w-4 text-muted-foreground" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold">{statusCounts.total}</div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">Pending</CardTitle>
//                   <Clock className="h-4 w-4 text-orange-600" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold text-orange-600">{statusCounts.pending}</div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">Approved</CardTitle>
//                   <CheckCircle className="h-4 w-4 text-green-600" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold text-green-600">{statusCounts.approved}</div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                   <CardTitle className="text-sm font-medium">Rejected</CardTitle>
//                   <XCircle className="h-4 w-4 text-red-600" />
//                 </CardHeader>
//                 <CardContent>
//                   <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Admin Tabs */}
//             <Tabs defaultValue="requests" className="space-y-6">
//               <TabsList>
//                 <TabsTrigger value="requests">Review Requests</TabsTrigger>
//                 {/* <TabsTrigger value="new">Submit New Request</TabsTrigger> */}
//               </TabsList>

//               <TabsContent value="requests" className="space-y-6">
//                 {/* Filter */}
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="text-lg">Filter Requests</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="flex items-center gap-4">
//                       <Filter className="h-4 w-4 text-muted-foreground" />
//                       <Select value={statusFilter} onValueChange={setStatusFilter}>
//                         <SelectTrigger className="w-48">
//                           <SelectValue placeholder="Filter by status" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="all">All Requests</SelectItem>
//                           <SelectItem value="pending">Pending</SelectItem>
//                           <SelectItem value="approved">Approved</SelectItem>
//                           <SelectItem value="rejected">Rejected</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 {/* Requests List */}
//                 <div className="space-y-4">
//                   {filteredMessages.length === 0 ? (
//                     <Card className="text-center py-12">
//                       <CardContent>
//                         <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                         <h3 className="text-lg font-semibold mb-2">No requests found</h3>
//                         <p className="text-muted-foreground">
//                           {statusFilter !== 'all' 
//                             ? `No ${statusFilter} requests at the moment.`
//                             : 'No event requests have been submitted yet.'
//                           }
//                         </p>
//                       </CardContent>
//                     </Card>
//                   ) : (
//                     filteredMessages
//                       .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//                       .map(message => (
//                         <MessageForm
//                           key={message.id}
//                           message={message}
//                           isAdmin={true}
//                           onStatusUpdate={handleStatusUpdate}
//                         />
//                       ))
//                   )}
//                 </div>
//               </TabsContent>

//               <TabsContent value="new">
//                 <MessageForm onSubmit={handleNewRequest} />
//               </TabsContent>
//             </Tabs>
//           </>
//         ) : (
//           <>
//             {/* User View */}
//             <Tabs defaultValue="new" className="space-y-6">
//               <TabsList>
//                 <TabsTrigger value="new">Submit Request</TabsTrigger>
//                 <TabsTrigger value="history">My Requests</TabsTrigger>
//               </TabsList>

//               <TabsContent value="new">
//                 <MessageForm onSubmit={handleNewRequest} />
//               </TabsContent>

//               <TabsContent value="history" className="space-y-6">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Your Request History</CardTitle>
//                     <CardDescription>
//                       Track the status of your submitted event requests
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     {userRequests.length === 0 ? (
//                       <div className="text-center py-8">
//                         <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                         <h3 className="text-lg font-semibold mb-2">No requests submitted</h3>
//                         <p className="text-muted-foreground mb-4">
//                           You haven't submitted any event requests yet.
//                         </p>
//                         <Button onClick={() => router.push('/messages')}>
//                           <Send className="h-4 w-4 mr-2" />
//                           Submit Your First Request
//                         </Button>
//                       </div>
//                     ) : (
//                       <div className="space-y-4">
//                         {userRequests
//                           .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
//                           .map(request => (
//                             <Card key={request.id} className="p-4">
//                               <div className="flex items-start justify-between mb-4">
//                                 <div>
//                                   <h4 className="font-semibold">{request.eventName}</h4>
//                                   <p className="text-sm text-muted-foreground">
//                                     Submitted {format(new Date(request.createdAt), 'MMM dd, yyyy')}
//                                   </p>
//                                 </div>
//                                 {getStatusBadge(request.status)}
//                               </div>
                              
//                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                                 <div>
//                                   <span className="font-medium">Proposed Date:</span>
//                                   <div>{format(new Date(request.date), 'MMM dd, yyyy')}</div>
//                                 </div>
//                                 {request.location && (
//                                   <div>
//                                     <span className="font-medium">Location:</span>
//                                     <div>{request.location}</div>
//                                   </div>
//                                 )}
//                                 {request.budgetEstimate > 0 && (
//                                   <div>
//                                     <span className="font-medium">Budget:</span>
//                                     <div>₹{request.budgetEstimate.toLocaleString()}</div>
//                                   </div>
//                                 )}
//                               </div>
                              
//                               <div className="mt-4">
//                                 <span className="font-medium">Purpose:</span>
//                                 <p className="text-sm text-muted-foreground mt-1">{request.purpose}</p>
//                               </div>
//                             </Card>
//                           ))}
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               </TabsContent>
//             </Tabs>
//           </>
//         )}
//       </div>
//     </div>
//   )
// }

'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Navbar } from '@/components/Navbar'
import { MessageForm } from '@/components/MessageForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { MessageSquare, Clock, CheckCircle, XCircle, Send, Filter, Calendar, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  where, 
  onSnapshot,
  serverTimestamp,
  setDoc
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function MessagesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [messages, setMessages] = useState([])
  const [userRequests, setUserRequests] = useState([])
  const [filteredMessages, setFilteredMessages] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  const [collectionsInitialized, setCollectionsInitialized] = useState(false)

  // Admin detection - Fixed to use email-based detection
  const isAdmin = user?.email === 'admin@rotary.com'

  

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  // Initialize collections and load requests from Firebase
  useEffect(() => {
    if (user && !collectionsInitialized) {
      initializeCollections()
    }
  }, [user, collectionsInitialized])

  useEffect(() => {
    if (user && collectionsInitialized) {
      loadRequests()
    }
  }, [user, collectionsInitialized, isAdmin]) // Added isAdmin dependency

  useEffect(() => {
    let filtered = messages
    if (statusFilter !== 'all') {
      filtered = filtered.filter(message => message.status === statusFilter)
    }
    setFilteredMessages(filtered)
  }, [messages, statusFilter])

  // Auto-generate collections with initial structure
  const initializeCollections = async () => {
    try {
      console.log('Initializing Firebase collections...')
      
      // Create a simple marker document instead of complex template
      const initDoc = {
        _initialized: true,
        createdAt: serverTimestamp(),
        createdBy: user.uid
      }

      // Just ensure collections exist - don't create complex templates
      await setDoc(doc(db, 'requests', '_init'), initDoc)
      await setDoc(doc(db, 'events', '_init'), initDoc)

      setCollectionsInitialized(true)
      console.log('Collections initialized successfully!')
      
      // toast.success('Database initialized successfully! 🚀', {
      //   icon: '🔧',
      //   style: {
      //     borderRadius: '10px',
      //     background: '#8B5CF6',
      //     color: '#fff',
      //   },
      // })
      
    } catch (error) {
      console.error('Error initializing collections:', error)
      toast.error('Failed to initialize database')
    }
  }

  const loadRequests = async () => {
    try {
      setIsLoading(true)
      const requestsRef = collection(db, 'requests')
      
      if (isAdmin) {
        console.log('Loading requests for admin...')
        const q = query(requestsRef, orderBy('createdAt', 'desc'))
        const unsubscribe = onSnapshot(q, (snapshot) => {
          console.log('Admin query snapshot received, docs count:', snapshot.docs.length)
          const requestsData = snapshot.docs
            .filter(doc => doc.id !== '_init' && doc.id !== '_template' && !doc.data()._initialized)
            .map(doc => ({
              id: doc.id,
              ...doc.data(),
              createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt
            }))
          console.log('Filtered requests data:', requestsData)
          setMessages(requestsData)
        }, (error) => {
          console.error('Error in admin onSnapshot:', error)
          toast.error('Failed to load requests: ' + error.message)
        })
        return unsubscribe
      } else {
        console.log('Loading requests for user:', user.uid)
        // Enhanced user query with better error handling
        const q = query(
          requestsRef, 
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        )
        const unsubscribe = onSnapshot(q, (snapshot) => {
          console.log('User query snapshot received, docs count:', snapshot.docs.length)
          const requestsData = snapshot.docs
            .filter(doc => doc.id !== '_init' && doc.id !== '_template') // Filter init docs for users too
            .map(doc => {
              const data = doc.data()
              console.log('User request document:', doc.id, data)
              return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt
              }
            })
          console.log('User requests data:', requestsData)
          setUserRequests(requestsData)
          
          // Also set messages for consistency if user has requests
          if (requestsData.length > 0) {
            console.log('Setting user requests as messages for consistency')
          }
        }, (error) => {
          console.error('Error in user onSnapshot:', error)
          toast.error('Failed to load your requests: ' + error.message)
        })
        return unsubscribe
      }
    } catch (error) {
      console.error('Error loading requests:', error)
      toast.error('Failed to load requests: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewRequest = async (requestData) => {
    try {
      setIsLoading(true)
      
      const newRequest = {
        // Event details
        eventName: requestData.eventName,
        date: requestData.date,
        time: requestData.time || '09:00',
        location: requestData.location || '',
        description: requestData.purpose || requestData.description,
        budgetEstimate: requestData.budgetEstimate || 0,
        category: requestData.category || 'General',
        participants: requestData.participants || 0,
        isPublic: requestData.isPublic !== undefined ? requestData.isPublic : true,
        
        // Request metadata
        userName: user.name || user.displayName || 'Unknown User',
        userEmail: user.email,
        userId: user.uid,
        status: 'pending',
        requestType: 'user_request',
        
        // Timestamps
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        
        // Admin approval fields (initially null)
        approvedBy: null,
        approvedAt: null,
        rejectedBy: null,
        rejectedAt: null,
        adminComments: ''
      }

      const docRef = await addDoc(collection(db, 'requests'), newRequest)
      
      // toast.success('Event request submitted successfully! 🚀', {
      //   icon: '✨',
      //   style: {
      //     borderRadius: '10px',
      //     background: '#10B981',
      //     color: '#fff',
      //   },
      // })
      
      console.log('Request created with ID:', docRef.id)
    } catch (error) {
      console.error('Error submitting request:', error)
      toast.error('Failed to submit request: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (messageId, status) => {
    try {
      setIsLoading(true)
      
      const requestRef = doc(db, 'requests', messageId)
      const updateData = {
        status,
        updatedAt: serverTimestamp(),
        ...(status === 'approved' && {
          approvedBy: user.uid,
          approvedAt: serverTimestamp()
        }),
        ...(status === 'rejected' && {
          rejectedBy: user.uid,
          rejectedAt: serverTimestamp()
        })
      }
      
      await updateDoc(requestRef, updateData)

      // If approved, create event in events collection
      if (status === 'approved') {
        const requestData = messages.find(msg => msg.id === messageId)
        if (requestData) {
          await createApprovedEvent(requestData, messageId)
        }
      }

      toast.success(`Request ${status} successfully! ✅`, {
        icon: status === 'approved' ? '✅' : '❌',
        style: {
          borderRadius: '10px',
          background: status === 'approved' ? '#10B981' : '#EF4444',
          color: '#fff',
        },
      })
    } catch (error) {
      console.error('Error updating request:', error)
      toast.error('Failed to update request: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const createApprovedEvent = async (requestData, requestId) => {
    try {
      // Calculate end time (default 2 hours after start)
      const startDate = new Date(requestData.date)
      const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000)

      const eventData = {
        // Event details
        title: requestData.eventName,
        date: requestData.date,
        startTime: requestData.time || '09:00',
        endTime: endDate.toTimeString().slice(0, 5), // HH:MM format
        location: requestData.location || '',
        description: requestData.description || requestData.purpose,
        budget: requestData.budgetEstimate || 0,
        category: requestData.category || 'General',
        expectedParticipants: requestData.participants || 0,
        isPublic: requestData.isPublic !== undefined ? requestData.isPublic : true,
        
        // Event origin tracking
        eventType: 'user_approved',
        createdBy: requestData.userId,
        approvedBy: user.uid,
        requestId: requestId,
        organizerName: requestData.userName,
        organizerEmail: requestData.userEmail,
        
        // Timestamps
        createdAt: serverTimestamp(),
        
        // Event status
        status: 'active',
        
        // Calendar display properties
        backgroundColor: '#10B981', // Green for approved user events
        borderColor: '#10B981'
      }

      const eventRef = await addDoc(collection(db, 'events'), eventData)
      
      toast.success('Event added to calendar! 📅', {
        icon: '📅',
        style: {
          borderRadius: '10px',
          background: '#3B82F6',
          color: '#fff',
        },
      })
      
      console.log('Event created with ID:', eventRef.id)
    } catch (error) {
      console.error('Error creating event:', error)
      toast.error('Failed to add event to calendar: ' + error.message)
    }
  }

  // Admin function to create direct events
  const createAdminEvent = async (eventData) => {
    try {
      setIsLoading(true)
      
      const adminEventData = {
        // Event details
        title: eventData.title || eventData.eventName,
        date: eventData.date,
        startTime: eventData.startTime || eventData.time || '09:00',
        endTime: eventData.endTime || '11:00',
        location: eventData.location || '',
        description: eventData.description || eventData.purpose,
        budget: eventData.budget || eventData.budgetEstimate || 0,
        category: eventData.category || 'General',
        expectedParticipants: eventData.expectedParticipants || eventData.participants || 0,
        isPublic: eventData.isPublic !== undefined ? eventData.isPublic : true,
        priority: eventData.priority || 'medium',
        
        // Admin event metadata
        eventType: 'admin_created',
        createdBy: user.uid,
        adminName: user.name || user.displayName,
        adminEmail: user.email,
        requestId: null,
        
        // Timestamps
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        
        // Event status
        status: 'active',
        
        // Calendar display
        backgroundColor: '#EF4444', // Red for admin events
        borderColor: '#EF4444'
      }
      
      // Add to events collection
      const eventRef = await addDoc(collection(db, 'events'), adminEventData)
      
      toast.success('Admin event created successfully! 🎉', {
        icon: '👑',
        style: {
          borderRadius: '10px',
          background: '#8B5CF6',
          color: '#fff',
        },
      })
      
      return eventRef.id
    } catch (error) {
      console.error('Error creating admin event:', error)
      toast.error('Failed to create admin event: ' + error.message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Loading state
  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {collectionsInitialized ? 'Loading requests...' : 'Initializing database...'}
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getStatusCounts = () => {
    return {
      total: messages.length,
      pending: messages.filter(m => m.status === 'pending').length,
      approved: messages.filter(m => m.status === 'approved').length,
      rejected: messages.filter(m => m.status === 'rejected').length
    }
  }

  const statusCounts = getStatusCounts()

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-500">Approved</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {isAdmin ? 'Event Requests Management' : 'Request Event'}
              </h1>
              <p className="text-muted-foreground mt-2">
                {isAdmin 
                  ? 'Review and manage event requests from club members'
                  : 'Submit requests for new events and track their status'
                }
              </p>
            </div>
            {isAdmin && (
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  User Approved Events: Green
                </Badge>
                <Badge variant="outline" className="bg-red-50 text-red-700">
                  Admin Created Events: Red
                </Badge>
              </div>
            )}
          </div>
        </div>

      

        {isAdmin ? (
          <>
            {/* Admin Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statusCounts.total}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{statusCounts.pending}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approved</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{statusCounts.approved}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                  <XCircle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
                </CardContent>
              </Card>
            </div>

            {/* Admin Tabs */}
            <Tabs defaultValue="requests" className="space-y-6">
              <TabsList>
                <TabsTrigger value="requests">Review Requests</TabsTrigger>
                <TabsTrigger value="create">Create Admin Event</TabsTrigger>
              </TabsList>

              <TabsContent value="requests" className="space-y-6">
                {/* Filter */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Filter Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Requests</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Requests List */}
                <div className="space-y-4">
                  {filteredMessages.length === 0 ? (
                    <Card className="text-center py-12">
                      <CardContent>
                        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No requests found</h3>
                        <p className="text-muted-foreground">
                          {statusFilter !== 'all' 
                            ? `No ${statusFilter} requests at the moment.`
                            : 'No event requests have been submitted yet.'
                          }
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredMessages.map(message => (
                      <MessageForm
                        key={message.id}
                        message={message}
                        isAdmin={true}
                        onStatusUpdate={handleStatusUpdate}
                      />
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="create">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Create Admin Event
                    </CardTitle>
                    <CardDescription>
                      Create events directly without going through the request process
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MessageForm 
                      onSubmit={createAdminEvent} 
                      isAdmin={true}
                      isDirectCreation={true}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <>
            {/* User View */}
            <Tabs defaultValue="new" className="space-y-6">
              <TabsList>
                <TabsTrigger value="new">Submit Request</TabsTrigger>
                <TabsTrigger value="history">My Requests</TabsTrigger>
              </TabsList>

              <TabsContent value="new">
                <Card>
                  <CardHeader>
                    <CardTitle>Submit Event Request</CardTitle>
                    <CardDescription>
                      Request approval for a new event from the admin team
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MessageForm onSubmit={handleNewRequest} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Request History</CardTitle>
                    <CardDescription>
                      Track the status of your submitted event requests ({userRequests.length} total)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Show loading state */}
                    {isLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading your requests...</p>
                      </div>
                    ) : userRequests.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No requests submitted</h3>
                        <p className="text-muted-foreground mb-4">
                          You haven't submitted any event requests yet.
                        </p>
                        <Button 
                          onClick={() => document.querySelector('[value="new"]')?.click()}
                          className="gap-2"
                        >
                          <Send className="h-4 w-4" />
                          Submit Your First Request
                        </Button>
                        
                        {/* Debug test button */}
                        <Button 
                          onClick={async () => {
                            try {
                              const requestsRef = collection(db, 'requests')
                              const q = query(requestsRef, where('userId', '==', user.uid))
                              const snapshot = await getDocs(q)
                              console.log('Manual query test - docs found:', snapshot.docs.length)
                              snapshot.docs.forEach(doc => {
                                console.log('Document:', doc.id, doc.data())
                              })
                              toast.success(`Found ${snapshot.docs.length} requests for your user ID`)
                            } catch (error) {
                              console.error('Manual query test error:', error)
                              toast.error('Query test failed: ' + error.message)
                            }
                          }}
                          variant="outline"
                          className="mt-4"
                        >
                          🔍 Test Query (Debug)
                        </Button>
                      </div>
                    ) : (
                      <>
                        {/* Summary stats for user */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="text-center p-4 bg-orange-50 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">
                              {userRequests.filter(r => r.status === 'pending').length}
                            </div>
                            <div className="text-sm text-orange-800">Pending</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              {userRequests.filter(r => r.status === 'approved').length}
                            </div>
                            <div className="text-sm text-green-800">Approved</div>
                          </div>
                          <div className="text-center p-4 bg-red-50 rounded-lg">
                            <div className="text-2xl font-bold text-red-600">
                              {userRequests.filter(r => r.status === 'rejected').length}
                            </div>
                            <div className="text-sm text-red-800">Rejected</div>
                          </div>
                        </div>

                        {/* Request list */}
                        <div className="space-y-4">
                          {userRequests
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            .map(request => (
                              <Card key={request.id} className="p-4">
                                <div className="flex items-start justify-between mb-4">
                                  <div>
                                    <h4 className="font-semibold">{request.eventName}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      Submitted {format(new Date(request.createdAt), 'MMM dd, yyyy')}
                                    </p>
                                  </div>
                                  {getStatusBadge(request.status)}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium">Proposed Date:</span>
                                    <div>{format(new Date(request.date), 'MMM dd, yyyy')}</div>
                                  </div>
                                  {request.location && (
                                    <div>
                                      <span className="font-medium">Location:</span>
                                      <div>{request.location}</div>
                                    </div>
                                  )}
                                  {request.budgetEstimate > 0 && (
                                    <div>
                                      <span className="font-medium">Budget:</span>
                                      <div>₹{request.budgetEstimate.toLocaleString()}</div>
                                    </div>
                                  )}
                                  {request.time && (
                                    <div>
                                      <span className="font-medium">Time:</span>
                                      <div>{request.time}</div>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="mt-4">
                                  <span className="font-medium">Purpose:</span>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {request.description || request.purpose}
                                  </p>
                                </div>

                                {/* Show approval/rejection details */}
                                {request.status !== 'pending' && (
                                  <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="text-sm text-muted-foreground">
                                      {request.status === 'approved' && request.approvedAt && (
                                        <div>✅ Approved on {format(new Date(request.approvedAt.seconds * 1000), 'MMM dd, yyyy')}</div>
                                      )}
                                      {request.status === 'rejected' && request.rejectedAt && (
                                        <div>❌ Rejected on {format(new Date(request.rejectedAt.seconds * 1000), 'MMM dd, yyyy')}</div>
                                      )}
                                      {request.adminComments && (
                                        <div className="mt-2">
                                          <span className="font-medium">Admin Comments:</span>
                                          <p className="italic">{request.adminComments}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </Card>
                            ))}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  )
}
