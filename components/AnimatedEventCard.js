'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format, isToday, isTomorrow, isPast, isWithinInterval, addDays } from 'date-fns'
import { Calendar, Clock, DollarSign, MapPin, Users, Edit, Trash2, Heart, Share2, MoreHorizontal, Star, Eye } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export const AnimatedEventCard = ({ 
  event, 
  onView, 
  onEdit, 
  onDelete, 
  isAdmin = false,
  showActions = false,
  delay = 0 
}) => {
  const [isLiked, setIsLiked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [likeCount, setLikeCount] = useState(event.likes || Math.floor(Math.random() * 50) + 10)

  const eventDate = event.date && !isNaN(new Date(event.date).getTime())
  ? new Date(event.date)
  : null;
  const isEventToday = isToday(eventDate)
  const isEventTomorrow = isTomorrow(eventDate)
  const isEventPast = isPast(eventDate)
  const isUpcoming = isWithinInterval(eventDate, {
    start: new Date(),
    end: addDays(new Date(), 7)
  })

  const getDateLabel = () => {
    if (!eventDate) return 'No date';
    if (isToday(eventDate)) return 'Today';
    if (isTomorrow(eventDate)) return 'Tomorrow';
    return format(eventDate, 'MMM dd, yyyy')
  }

  const getStatusBadge = () => {
    if (isEventPast) {
      return <Badge variant="secondary" className="animate-pulse">Past</Badge>
    }
    if (isEventToday) {
      return <Badge variant="default" className="bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse">Today</Badge>
    }
    if (isUpcoming) {
      return <Badge variant="outline" className="border-green-500 text-green-500">Upcoming</Badge>
    }
    return <Badge variant="outline">Scheduled</Badge>
  }

  const handleLike = (e) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  const handleShare = (e) => {
    e.stopPropagation()
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <>
    <Card
      className={`group relative overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-2 cursor-pointer border-0 bg-gradient-to-br from-card via-card to-muted/20 ${isEventToday ? 'ring-2 ring-primary shadow-lg shadow-primary/20' : ''}`}
      style={{
        animationDelay: `${delay}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Glowing Border Effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-500" />

        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors duration-300 flex items-center gap-2">
                {event.title}
                {isEventToday && <Star className="h-4 w-4 text-yellow-500 animate-pulse" />}
              </CardTitle>
              <CardDescription className="mt-1 line-clamp-2">
                {event.description || 'No description provided'}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge()}
              {showActions && isAdmin && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <MoreHorizontal size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit?.(event) } }>
                      <Edit size={14} className="mr-2" />
                      Edit Event
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => { e.stopPropagation(); onDelete?.(event) } }
                      className="text-destructive"
                    >
                      <Trash2 size={14} className="mr-2" />
                      Delete Event
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
      </div>
    </CardHeader>

        <CardContent className="pt-0 relative z-10">
          <div className="space-y-4">
            {/* Date and Time with enhanced styling */}
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                <div className="p-1 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                  <Calendar size={14} className="text-primary" />
                </div>
                <span className="font-medium">{getDateLabel()}</span>
              </div>
              {event.time && (
                <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  <div className="p-1 rounded-full bg-green-500/10 group-hover:bg-green-500/20 transition-colors duration-300">
                    <Clock size={14} className="text-green-500" />
                  </div>
                  <span>{event.time}</span>
                </div>
              )}
            </div>

            {/* Enhanced Category and Budget Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge
                  variant="secondary"
                  className="text-xs hover:scale-105 transition-transform duration-200 cursor-pointer"
                >
                  {event.category}
                </Badge>
                {event.location && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    <MapPin size={14} className="text-orange-500" />
                    <span className="truncate max-w-32">{event.location}</span>
                  </div>
                )}
              </div>

              {event.budget > 0 && (
                <div className="flex items-center gap-1 text-sm font-medium bg-green-50 dark:bg-green-950/20 px-2 py-1 rounded-full group-hover:scale-105 transition-transform duration-200">
                  <DollarSign size={14} className="text-green-600" />
                  <span className="text-green-600">{event.budget.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Participants with animation */}
            {event.participants && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                <div className="p-1 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors duration-300">
                  <Users size={14} className="text-blue-500" />
                </div>
                <span>{event.participants} participants</span>
                <div className="flex -space-x-1 ml-2">
                  {[...Array(Math.min(3, Math.floor(event.participants / 10)))].map((_, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-background transform hover:scale-110 transition-transform duration-200"
                      style={{ zIndex: 3 - i }} />
                  ))}
                  {event.participants > 30 && (
                    <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                      +
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Interactive Actions Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-border/50">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`h-8 px-3 gap-2 transition-all duration-300 ${isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
                >
                  <Heart
                    size={14}
                    className={`transition-all duration-300 ${isLiked ? 'fill-current scale-110' : ''}`} />
                  <span className="text-xs font-medium">{likeCount}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="h-8 px-3 gap-2 text-muted-foreground hover:text-blue-500 transition-colors duration-300"
                >
                  <Share2 size={14} />
                  <span className="text-xs">Share</span>
                </Button>
                      <div>
        <Button onClick={() => onView(event)}>
          <Eye className="h-4 w-4" />
          View
        </Button>
      </div>
              </div>

              {/* Animated Progress Indicator for Past Events */}
              {isEventPast && event.actualExpense && (
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Actual Cost</div>
                  <div className="text-sm font-medium text-green-600">
                    ${event.actualExpense.toLocaleString()}
                  </div>
                  <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${Math.min((event.actualExpense / event.budget) * 100, 100)}%`,
                        transitionDelay: `${delay + 300}ms`
                      }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        {/* Floating Action Button for Mobile */}
        {isHovered && showActions && isAdmin && (
          <div className="absolute top-4 right-4 md:hidden">
            <Button
              size="sm"
              className="h-8 w-8 p-0 rounded-full shadow-lg bg-primary hover:bg-primary/90 animate-in fade-in zoom-in duration-200"
              onClick={(e) => { e.stopPropagation(); onEdit?.(event) } }
            >
              <Edit size={12} />
            </Button>
          </div>
        )}

        <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      </Card></>
  )
}