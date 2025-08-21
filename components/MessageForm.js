'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { Send, Calendar, MapPin, DollarSign, User, Clock, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export const MessageForm = ({ 
  onSubmit, 
  isAdmin = false, 
  message = null, 
  onStatusUpdate = null 
}) => {
  const [formData, setFormData] = useState({
    eventName: '',
    date: '',
    purpose: '',
    location: '',
    budgetEstimate: '',
    additionalInfo: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.eventName || !formData.date || !formData.purpose) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsLoading(true)

    try {
      await onSubmit({
        ...formData,
        budgetEstimate: formData.budgetEstimate ? parseFloat(formData.budgetEstimate) : 0
      })
      
      // Reset form
      setFormData({
        eventName: '',
        date: '',
        purpose: '',
        location: '',
        budgetEstimate: '',
        additionalInfo: ''
      })
      
      // toast.success('Event request submitted successfully!')
    } catch (error) {
      toast.error('Failed to submit request')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusUpdate = async (status) => {
    if (!onStatusUpdate || !message) return
    
    setIsLoading(true)
    try {
      await onStatusUpdate(message.id, status)
      // toast.success(`Request ${status}!`)
    } catch (error) {
      toast.error(`Failed to ${status} request`)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-500">Approved</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      case 'pending':
        return <Badge variant="secondary">Pending Review</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // If this is displaying a message for admin view
  if (isAdmin && message) {
    return (
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User size={16} />
                {message.userName}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Clock size={14} />
                {format(new Date(message.createdAt), 'MMM dd, yyyy at h:mm a')}
              </CardDescription>
            </div>
            {getStatusBadge(message.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-muted-foreground" />
                <div>
                  <span className="font-medium">Event:</span>
                  <div className="text-sm">{message.eventName}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-muted-foreground" />
                <div>
                  <span className="font-medium">Date:</span>
                  <div className="text-sm">{format(new Date(message.date), 'MMM dd, yyyy')}</div>
                </div>
              </div>
              {message.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-muted-foreground" />
                  <div>
                    <span className="font-medium">Location:</span>
                    <div className="text-sm">{message.location}</div>
                  </div>
                </div>
              )}
              {message.budgetEstimate > 0 && (
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-muted-foreground" />
                  <div>
                    <span className="font-medium">Budget:</span>
                    <div className="text-sm">${message.budgetEstimate.toLocaleString()}</div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <span className="font-medium">Purpose:</span>
              <p className="text-sm text-muted-foreground mt-1">{message.purpose}</p>
            </div>

            {message.additionalInfo && (
              <div>
                <span className="font-medium">Additional Information:</span>
                <p className="text-sm text-muted-foreground mt-1">{message.additionalInfo}</p>
              </div>
            )}

            {message.status === 'pending' && (
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => handleStatusUpdate('approved')}
                  disabled={isLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle size={16} className="mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleStatusUpdate('rejected')}
                  disabled={isLoading}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle size={16} className="mr-2" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Regular form for users to submit requests
  return (
    <Card>
      <CardHeader>
        <CardTitle>Request New Event</CardTitle>
        <CardDescription>
          Submit a request for a new club event. All requests will be reviewed by administrators.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="eventName">Event Name *</Label>
            <Input
              id="eventName"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              placeholder="Enter the event name"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Proposed Date *</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Event location"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose *</Label>
            <Textarea
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="Describe the purpose and goals of this event"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budgetEstimate">Budget Estimate ($)</Label>
            <Input
              id="budgetEstimate"
              name="budgetEstimate"
              type="number"
              min="0"
              step="0.01"
              value={formData.budgetEstimate}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Additional Information</Label>
            <Textarea
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              placeholder="Any additional details, requirements, or notes"
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
            ) : (
              <>
                <Send size={16} className="mr-2" />
                Submit Request
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}