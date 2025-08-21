'use client'

import { useState, useRef, useEffect } from 'react'
import Calendar from 'react-calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EventModal } from './EventModal'
import { format, isSameDay, isToday, isPast } from 'date-fns'
import { Plus, Calendar as CalendarIcon, Eye, Sparkles, Lock } from 'lucide-react'
import 'react-calendar/dist/Calendar.css'

const isEditable = (createdAt) => {
  const now = Date.now()
  const eventTime = new Date(createdAt).getTime()
  const timeDiff = now - eventTime
  const twentyFourHours = 24 * 60 * 60 * 1000
  return timeDiff < twentyFourHours
}

export const InteractiveCalendar = ({ events, onSaveEvent, onDeleteEvent, isAdmin = true }) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [hoveredDate, setHoveredDate] = useState(null)
  const [previewEvents, setPreviewEvents] = useState([])

  const handleDateClick = (date) => {
    if (!isAdmin && isPast(date) && !isToday(date)) {
      // Users can't add events to past dates
      return
    }
    
    setSelectedDate(date)
    setEditingEvent(null)
    setIsModalOpen(true) // Commented out to disable add event form on date click
  }

  const handleEventClick = (event) => {
    if (!isAdmin && !isEditable(event.createdAt)) {
      // Users can only edit events within 24 hours
      return
    }
    
    setEditingEvent(event)
    setSelectedDate(new Date(event.date))
    setIsModalOpen(true)
  }

  const getEventsForDate = (date) => {
    return events.filter(event => isSameDay(new Date(event.date), date))
  }

  const handleDateHover = (date) => {
    setHoveredDate(date)
    setPreviewEvents(getEventsForDate(date))
  }

  const getTileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayEvents = getEventsForDate(date)
      if (dayEvents.length > 0) {
        return (
          <div className="relative flex flex-col items-center mt-1">
            <div className="flex gap-1 flex-wrap justify-center">
              {dayEvents.slice(0, 2).map((event, index) => (
                <div
                  key={event.id}
                  className={`w-2 h-2 rounded-full transition-all duration-300 hover:scale-150 cursor-pointer ${
                    isAdmin || isEditable(event.createdAt)
                      ? 'animate-pulse' 
                      : 'opacity-60'
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    backgroundColor: event.category === 'Community Service' ? '#10b981' :
                                   event.category === 'Fundraising' ? '#f59e0b' :
                                   event.category === 'Meeting' ? '#3b82f6' : '#8b5cf6'
                  }}
                />
              ))}
            </div>
            {dayEvents.length > 2 && (
              <span className="text-xs text-primary font-bold animate-bounce">
                +{dayEvents.length - 2}
              </span>
            )}
          </div>
        )
      }
    }
    return null
  }

  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      let classes = ['calendar-tile']
      
      if (isToday(date)) {
        classes.push('calendar-tile--today')
      }
      
      if (isPast(date) && !isToday(date)) {
        classes.push('calendar-tile--past')
        if (!isAdmin) {
          classes.push('calendar-tile--disabled') // Disable past dates for users
        }
      }
      
      const dayEvents = getEventsForDate(date)
      if (dayEvents.length > 0) {
        classes.push('calendar-tile--has-events')
      }
      
      if (hoveredDate && isSameDay(date, hoveredDate)) {
        classes.push('calendar-tile--hovered')
      }
      
      return classes.join(' ')
    }
    return ''
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/20">
                <CalendarIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Interactive Event Calendar
                  <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
                </CardTitle>
                <CardDescription>
                  {isAdmin 
                    ? 'Click dates to add events, hover for previews' 
                    : 'View events and manage your schedule'
                  }
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* {isAdmin && (
                <Button 
                  // onClick={() => handleDateClick(new Date())} // Commented out to disable quick add event
                  size="sm"
                  className="gap-2 hover:scale-105 transition-transform duration-200"
                >
                  <Plus className="h-4 w-4" />
                  Quick Add
                </Button>
              )} */}
              {!isAdmin && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  View Only
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="relative">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              onClickDay={handleDateClick}
              tileContent={getTileContent}
              tileClassName={getTileClassName}
              onMouseOver={({ date }) => handleDateHover(date)}
              onMouseLeave={() => {
                setHoveredDate(null)
                setPreviewEvents([])
              }}
              className="interactive-calendar"
            />

            {/* Hover Preview Tooltip */}
            {hoveredDate && previewEvents.length > 0 && (
              <div className="absolute z-50 p-3 bg-background border border-border rounded-lg shadow-lg max-w-xs animate-in fade-in zoom-in duration-200">
                <div className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  {format(hoveredDate, 'MMM dd, yyyy')}
                </div>
                <div className="space-y-2">
                  {previewEvents.slice(0, 3).map(event => (
                    <div 
                      key={event.id} 
                      className="flex items-center gap-2 p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (isAdmin || isEditable(event.createdAt)) {
                          handleEventClick(event)
                        }
                      }}
                    >
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: event.category === 'Community Service' ? '#10b981' :
                                         event.category === 'Fundraising' ? '#f59e0b' :
                                         event.category === 'Meeting' ? '#3b82f6' : '#8b5cf6'
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate">
                          {event.title} {event.time && <span className="text-xs text-muted-foreground">({event.time})</span>}
                        </div>
                      </div>
                      {!isAdmin && !isEditable(event.createdAt) && (
                        <Lock className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                  {previewEvents.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center py-1">
                      +{previewEvents.length - 3} more events
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Instructions */}
          {!isAdmin && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <div className="font-medium mb-1">Calendar Instructions:</div>
                <ul className="text-xs space-y-1">
                  <li>• Click on today or future dates to add personal events</li>
                  <li>• Events can be edited within 24 hours of creation</li>
                  <li>• Hover over dates to see event previews</li>
                  <li>• Past dates are view-only for club events</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingEvent(null)
        }}
        onSave={onSaveEvent}
        onDelete={onDeleteEvent}
        event={editingEvent}
        selectedDate={selectedDate}
        isEditable={isAdmin || (editingEvent ? isEditable(editingEvent.createdAt) : true)}
        isAdmin={isAdmin}
      />

      <style jsx global>{`
        .interactive-calendar {
          width: 100% !important;
          border: none !important;
          font-family: inherit !important;
        }
        
        .calendar-tile {
          background: transparent !important;
          border: 1px solid hsl(var(--border)) !important;
          color: hsl(var(--foreground)) !important;
          position: relative !important;
          height: 80px !important;
          transition: all 0.3s ease !important;
          cursor: pointer !important;
        }
        
        .calendar-tile:hover {
          background: hsl(var(--accent)) !important;
          transform: scale(1.02) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
          z-index: 10 !important;
        }
        
        .calendar-tile--disabled {
          cursor: not-allowed !important;
          opacity: 0.5 !important;
        }
        
        .calendar-tile--disabled:hover {
          transform: none !important;
          box-shadow: none !important;
        }
        
        .calendar-tile--active {
          background: hsl(var(--primary)) !important;
          color: hsl(var(--primary-foreground)) !important;
          transform: scale(1.05) !important;
        }
        
        .calendar-tile--past {
          color: hsl(var(--muted-foreground)) !important;
          background: hsl(var(--muted)) / 0.3 !important;
        }
        
        .calendar-tile--today {
          background: linear-gradient(135deg, hsl(var(--primary)) / 0.1, hsl(var(--secondary)) / 0.1) !important;
          font-weight: 600 !important;
          border: 2px solid hsl(var(--primary)) !important;
          animation: todayPulse 2s infinite !important;
        }
        
        .calendar-tile--has-events {
          background: linear-gradient(135deg, hsl(var(--accent)) / 0.5, hsl(var(--accent)) / 0.2) !important;
          border-color: hsl(var(--primary)) / 0.3 !important;
        }
        
        .calendar-tile--hovered {
          background: hsl(var(--accent)) !important;
          transform: scale(1.05) !important;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
          z-index: 20 !important;
        }
        
        .react-calendar__navigation button {
          background: transparent !important;
          border: none !important;
          color: hsl(var(--foreground)) !important;
          font-size: 16px !important;
          padding: 8px 16px !important;
          border-radius: 8px !important;
          transition: all 0.2s ease !important;
        }
        
        .react-calendar__navigation button:hover {
          background: hsl(var(--accent)) !important;
          transform: scale(1.05) !important;
        }
        
        .react-calendar__month-view__weekdays {
          background: hsl(var(--muted)) / 0.5 !important;
        }
        
        .react-calendar__month-view__weekdays__weekday {
          color: hsl(var(--muted-foreground)) !important;
          font-weight: 600 !important;
          font-size: 12px !important;
          padding: 12px 8px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
        }
        
        @keyframes todayPulse {
          0%, 100% { box-shadow: 0 0 0 0 hsl(var(--primary)) / 0.4; }
          50% { box-shadow: 0 0 0 8px hsl(var(--primary)) / 0; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}