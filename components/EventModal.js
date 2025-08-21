'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { format } from 'date-fns'
import { Save, Trash2, Clock, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

const categories = [
  'Community Service (CMD)',
  'Club Service (CSD)',
  'Professional Development (PDD)',
  'International Service (ISD)',
  'Meeting'
]

export const EventModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  event, 
  selectedDate, 
  isEditable = true 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    budget: '',
    category: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (event) {
        // Editing existing event
        setFormData({
          title: event.title || '',
          description: event.description || '',
          date: event.date ? format(new Date(event.date), 'yyyy-MM-dd') : '',
          time: event.time || '',
          budget: event.budget?.toString() || '',
          category: event.category || ''
        })
      } else {
        // Creating new event
        setFormData({
          title: '',
          description: '',
          date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
          time: '',
          budget: '',
          category: ''
        })
      }
      setErrors({})
    }
  }, [isOpen, event, selectedDate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleCategoryChange = (value) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }))
    if (errors.category) {
      setErrors(prev => ({
        ...prev,
        category: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required'
    }

    if (!formData.date) {
      newErrors.date = 'Event date is required'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    if (formData.budget && (isNaN(formData.budget) || parseFloat(formData.budget) < 0)) {
      newErrors.budget = 'Budget must be a positive number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: new Date(formData.date).toISOString(),
        time: formData.time,
        budget: formData.budget ? parseFloat(formData.budget) : 0,
        category: formData.category
      }

      await onSave(eventData)
      // toast.success(event ? 'Event updated successfully!' : 'Event created successfully!')
      onClose()
    } catch (error) {
      toast.error('Failed to save event')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!event) return

    setIsLoading(true)
    try {
      await onDelete(event.id)
      // toast.success('Event deleted successfully!')
      onClose()
    } catch (error) {
      toast.error('Failed to delete event')
    } finally {
      setIsLoading(false)
    }
  }

  const getTimeUntilNotEditable = () => {
    if (!event || !event.createdAt) return null
    
    const createdAt = new Date(event.createdAt)
    const twentyFourHoursLater = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000)
    const now = new Date()
    const timeLeft = twentyFourHoursLater - now
    
    if (timeLeft <= 0) return null
    
    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60))
    const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${hoursLeft}h ${minutesLeft}m`
  }

  const timeLeft = getTimeUntilNotEditable()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {event ? 'Event Details' : 'Add New Event'}
          </DialogTitle>
          <DialogDescription>
            {event ? 
              (isEditable ? 'View or edit event details' : 'Event details (read-only)') :
              `Add an event for ${selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : 'selected date'}`
            }
          </DialogDescription>
        </DialogHeader>

        {/* Edit Time Warning */}
        {event && isEditable && timeLeft && (
          <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
            <Clock className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800 dark:text-orange-200">
              You can edit this event for {timeLeft} more
            </AlertDescription>
          </Alert>
        )}

        {/* Read-only Warning */}
        {event && !isEditable && (
          <Alert className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200">
              This event was created more than 24 hours ago and can no longer be edited
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title"
              disabled={!isEditable}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter event description"
              disabled={!isEditable}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                disabled={!isEditable}
                className={errors.date ? 'border-red-500' : ''}
              />
              {errors.date && (
                <p className="text-sm text-red-500">{errors.date}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                disabled={!isEditable}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select 
              value={formData.category} 
              onValueChange={handleCategoryChange}
              disabled={!isEditable}
            >
              <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Estimated Budget ($)</Label>
            <Input
              id="budget"
              name="budget"
              type="number"
              min="0"
              step="0.01"
              value={formData.budget}
              onChange={handleChange}
              placeholder="0.00"
              disabled={!isEditable}
              className={errors.budget ? 'border-red-500' : ''}
            />
            {errors.budget && (
              <p className="text-sm text-red-500">{errors.budget}</p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            {isEditable && (
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {event ? 'Update' : 'Save'} Event
                  </>
                )}
              </Button>
            )}

            {event && isEditable && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}

            <Button type="button" variant="outline" onClick={onClose}>
              {isEditable ? 'Cancel' : 'Close'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}