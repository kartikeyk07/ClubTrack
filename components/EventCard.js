'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format, isToday, isTomorrow, isPast, isWithinInterval, addDays } from 'date-fns'
import { Calendar, Clock, DollarSign, MapPin, Users, Edit, Trash2 } from 'lucide-react'

export const EventCard = ({ 
  event, 
  onEdit, 
  onDelete, 
  isAdmin = false,
  showActions = false 
}) => {
  const eventDate = new Date(event.date)
  const isEventToday = isToday(eventDate)
  const isEventTomorrow = isTomorrow(eventDate)
  const isEventPast = isPast(eventDate)
  const isUpcoming = isWithinInterval(eventDate, {
    start: new Date(),
    end: addDays(new Date(), 7)
  })

  const getDateLabel = () => {
    if (isEventToday) return 'Today'
    if (isEventTomorrow) return 'Tomorrow'
    return format(eventDate, 'MMM dd, yyyy')
  }

  const getStatusBadge = () => {
    if (isEventPast) {
      return <Badge variant="secondary">Past</Badge>
    }
    if (isEventToday) {
      return <Badge variant="default">Today</Badge>
    }
    if (isUpcoming) {
      return <Badge variant="outline">Upcoming</Badge>
    }
    return <Badge variant="outline">Scheduled</Badge>
  }

  return (
    <Card className={`transition-all hover:shadow-md ${isEventToday ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">{event.title}</CardTitle>
            <CardDescription className="mt-1">
              {event.description || 'No description provided'}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            {showActions && isAdmin && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit?.(event)}
                  className="h-8 w-8 p-0"
                >
                  <Edit size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete?.(event)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Date and Time */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar size={16} />
            <span>{getDateLabel()}</span>
            {event.time && (
              <>
                <Clock size={16} className="ml-2" />
                <span>{event.time}</span>
              </>
            )}
          </div>

          {/* Category and Budget */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {event.category}
              </Badge>
              {event.location && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin size={14} />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
            
            {event.budget > 0 && (
              <div className="flex items-center gap-1 text-sm font-medium">
                <DollarSign size={14} />
                <span>${event.budget.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Participants (if available) */}
          {event.participants && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users size={16} />
              <span>{event.participants} participants</span>
            </div>
          )}

          {/* Additional Info for Past Events */}
          {isEventPast && event.actualExpense && (
            <div className="pt-2 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Actual Expense:</span>
                <span className="font-medium">${event.actualExpense.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}