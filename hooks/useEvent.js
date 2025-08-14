// hooks/useEvents.js
import { useState, useEffect } from 'react'
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'
import { db } from '@/firebase/config'

export const useEvents = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const eventsRef = collection(db, 'events')
    const q = query(eventsRef, orderBy('date', 'asc'))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Format for calendar display
        start: new Date(doc.data().date),
        end: doc.data().endTime ? new Date(doc.data().endTime) : new Date(doc.data().date),
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6'
      }))
      setEvents(eventsData)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  return { events, loading }
}
