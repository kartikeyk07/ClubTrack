'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format, isToday, isTomorrow, isPast, isWithinInterval, addDays } from 'date-fns'
import { Calendar, Clock, DollarSign, MapPin, Users, Edit, Trash2, Heart, Share2, MoreHorizontal, Star, Eye } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { db } from '@/lib/firebase'
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore'

export const AnimatedEventCard = ({ 
  event, 
  onView, 
  onEdit, 
  onDelete, 
  isAdmin = false,
  showActions = false,
  delay = 0,
  user
}) => {
  const [isLiked, setIsLiked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [likeCount, setLikeCount] = useState(event.likes || Math.floor(Math.random() * 50) + 10)
  const [localParticipants, setLocalParticipants] = useState(event.registeredUsers?.length || 0)
  const [isRegistered, setIsRegistered] = useState(false)
  const [loading, setLoading] = useState(false)

  const registeredUsers = event.registeredUsers || [];
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

  // ✅ Check if user already registered
  useEffect(() => {
    if (!user || !event?.id) return;
    if (event.registeredUsers?.some(u => u.uid === user.uid)) {
      setIsRegistered(true);
    }
  }, [event, user]);

  // ✅ Register Button Logic
const handleRegister = async (e) => {
  e.stopPropagation();
  if (!user) {
    alert("Please log in to register for this event.");
    return;
  }

  if (!event?.id) {
    console.error("❌ No event.id found. Event object:", event);
    alert("Event ID is missing. Cannot register.");
    return;
  }

  setLoading(true);
  try {
    const eventRef = doc(db, "events", event.id);
    const eventSnap = await getDoc(eventRef);

    if (!eventSnap.exists()) {
      console.error("❌ Event not found in Firestore:", event.id);
      alert("Event not found.");
      return;
    }

    await updateDoc(eventRef, {
  registeredUsers: arrayUnion({
    uid: user.uid,
    name: user.displayName || "Anonymous",
    email: user.email
  })
});
    setIsRegistered(true);
    setLocalParticipants(prev => prev + 1);
    event.registeredUsers = [...(event.registeredUsers || []), {
        uid: user.uid,
        name: user.displayName || "Anonymous",
        email: user.email
      }];

    console.log("✅ User registered successfully:", user.uid);
    alert("✅ You have successfully registered!");

  } catch (error) {
    console.error("🔥 Firestore update failed:", error);
    alert("❌ Failed to register. Please try again.");
  } finally {
    setLoading(false);
  }
};


// ✅ Also patch the event object locally (so registeredUsers array includes current user)


  const getStatusBadge = () => {
    if (isEventPast) return <Badge variant="secondary" className="animate-pulse">Past</Badge>
    if (isEventToday) return <Badge variant="default" className="bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse">Today</Badge>
    if (isUpcoming) return <Badge variant="outline" className="border-green-500 text-green-500">Upcoming</Badge>
    return <Badge variant="outline">Scheduled</Badge>
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
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit?.(event) } }>
                      <Edit size={14} className="mr-2" /> Edit Event
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete?.(event) } } className="text-destructive">
                      <Trash2 size={14} className="mr-2" /> Delete Event
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 relative z-10">
          <div className="space-y-4">
            {/* Date & Time */}
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground">
                <div className="p-1 rounded-full bg-primary/10 group-hover:bg-primary/20">
                  <Calendar size={14} className="text-primary" />
                </div>
                <span className="font-medium">{getDateLabel()}</span>
              </div>
              {event.time && (
                <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground">
                  <div className="p-1 rounded-full bg-green-500/10 group-hover:bg-green-500/20">
                    <Clock size={14} className="text-green-500" />
                  </div>
                  <span>{event.time}</span>
                </div>
              )}
            </div>

            {/* Category & Location */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-xs">{event.category}</Badge>
                {event.location && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground group-hover:text-foreground">
                    <MapPin size={14} className="text-orange-500" />
                    <span className="truncate max-w-32">{event.location}</span>
                  </div>
                )}
              </div>
              {event.budget > 0 && (
                <div className="flex items-center gap-1 text-sm font-medium bg-green-50 dark:bg-green-950/20 px-2 py-1 rounded-full">
                  <DollarSign size={14} className="text-green-600" />
                  <span className="text-green-600">{event.budget.toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Participants */}
            {/* Participants */}
<div className="flex items-center justify-between mt-2">
  {isAdmin ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">View Participants</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-48 overflow-y-auto">
        {event.registeredUsers?.map((u, i) => (
          <DropdownMenuItem key={i}>
            {u.name} — <span className="text-muted-foreground text-xs">{u.email}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <span className="text-sm font-medium text-muted-foreground">
      Participants: {localParticipants}
    </span>
  )}
</div>

            {/* ✅ Register Button */}
          

            {/* Like + Share + View */}
            <div className="flex items-center justify-between pt-3 border-t border-border/50">
              <div className="flex items-center gap-3">
                {user?.role === 'user' && (
              
                <Button
                  variant={isRegistered ? "secondary" : "primary"}
                  disabled={isRegistered || loading}
                  onClick={handleRegister}
                >
                  {loading ? "Registering..." : isRegistered ? "Registered" : "Register"}
                </Button>
              
            )}
                {/* <Button variant="ghost" size="sm" onClick={handleLike}
                  className={`h-8 px-3 gap-2 ${isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}>
                  <Heart size={14} className={isLiked ? 'fill-current scale-110' : ''} />
                  <span className="text-xs font-medium">{likeCount}</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleShare}
                  className="h-8 px-3 gap-2 text-muted-foreground hover:text-blue-500">
                  <Share2 size={14} /> <span className="text-xs">Share</span>
                </Button> */}
                <Button onClick={() => onView(event)}>
                  <Eye className="h-4 w-4" /> View
                </Button>
              </div>
            </div>
          </div>
        </CardContent>

        {isHovered && showActions && isAdmin && (
          <div className="absolute top-4 right-4 md:hidden">
            <Button size="sm" className="h-8 w-8 p-0 rounded-full shadow-lg bg-primary"
              onClick={(e) => { e.stopPropagation(); onEdit?.(event) }}>
              <Edit size={12} />
            </Button>
          </div>
        )}

        <style jsx>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </Card>
    </>
  )
}

