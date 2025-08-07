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
import { MessageSquare, Clock, CheckCircle, XCircle, Send, Filter, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

export default function MessagesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [messages, setMessages] = useState([]) // Fresh start - no mock data
  const [userRequests, setUserRequests] = useState([]) // Fresh start - no mock data
  const [filteredMessages, setFilteredMessages] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    let filtered = messages

    if (statusFilter !== 'all') {
      filtered = filtered.filter(message => message.status === statusFilter)
    }

    setFilteredMessages(filtered)
  }, [messages, statusFilter])

  const handleNewRequest = async (requestData) => {
    const newRequest = {
      id: Date.now().toString(),
      userName: user.name,
      userEmail: user.email,
      ...requestData,
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    if (user.role === 'admin') {
      setMessages([newRequest, ...messages])
    } else {
      setUserRequests([newRequest, ...userRequests])
    }

    toast.success('Event request submitted successfully! 🚀', {
      icon: '✨',
      style: {
        borderRadius: '10px',
        background: '#10B981',
        color: '#fff',
      },
    })
  }

  const handleStatusUpdate = async (messageId, status) => {
    setMessages(messages.map(message => 
      message.id === messageId 
        ? { ...message, status }
        : message
    ))

    toast.success(`Request ${status} successfully! ✅`, {
      icon: status === 'approved' ? '✅' : '❌',
      style: {
        borderRadius: '10px',
        background: status === 'approved' ? '#10B981' : '#EF4444',
        color: '#fff',
      },
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
          <h1 className="text-3xl font-bold text-foreground">
            {user.role === 'admin' ? 'Event Requests' : 'Request Event'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {user.role === 'admin' 
              ? 'Review and manage event requests from club members'
              : 'Submit requests for new events and track their status'
            }
          </p>
        </div>

        {user.role === 'admin' ? (
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
                <TabsTrigger value="new">Submit New Request</TabsTrigger>
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
                    filteredMessages
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .map(message => (
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

              <TabsContent value="new">
                <MessageForm onSubmit={handleNewRequest} />
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
                <MessageForm onSubmit={handleNewRequest} />
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Request History</CardTitle>
                    <CardDescription>
                      Track the status of your submitted event requests
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userRequests.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No requests submitted</h3>
                        <p className="text-muted-foreground mb-4">
                          You haven't submitted any event requests yet.
                        </p>
                        <Button onClick={() => router.push('/messages')}>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Your First Request
                        </Button>
                      </div>
                    ) : (
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
                              </div>
                              
                              <div className="mt-4">
                                <span className="font-medium">Purpose:</span>
                                <p className="text-sm text-muted-foreground mt-1">{request.purpose}</p>
                              </div>
                            </Card>
                          ))}
                      </div>
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