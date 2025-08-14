// components/ViewEventModal.jsx
"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, DollarSign, Clock } from "lucide-react"
import { format } from "date-fns"

export function ViewEventModal({ isOpen, onClose, event }) {
  if (!isOpen || !event) return null

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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // Close when clicking backdrop
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white pr-4">
                  {event.title}
                </h2>
                {event.status && getStatusBadge(event.status)}
              </div>
              {event.category && (
                <Badge variant="outline" className="mb-3">
                  {event.category}
                </Badge>
              )}
            </div>

            {/* Event Details */}
            <div className="space-y-4 mb-6">
              {/* Date and Time */}
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {event.date ? format(new Date(event.date), 'EEEE, MMMM dd, yyyy') : 'Date TBD'}
                  </p>
                  {event.time && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                      <Clock className="h-3 w-3" />
                      {event.time}
                    </div>
                  )}
                </div>
              </div>

              {/* Location */}
              {event.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-red-600" />
                  <p className="text-gray-700 dark:text-gray-200">{event.location}</p>
                </div>
              )}

              {/* Participants */}
              {event.participants && (
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-green-600" />
                  <p className="text-gray-700 dark:text-gray-200">
                    {event.participants} participants
                  </p>
                </div>
              )}

              {/* Budget */}
              {event.budget && (
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                  <p className="text-gray-700 dark:text-gray-200">
                    ₹{event.budget.toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            {event.description && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {event.description}
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-600">
              <Button 
                onClick={onClose}
                className="px-6"
              >
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
