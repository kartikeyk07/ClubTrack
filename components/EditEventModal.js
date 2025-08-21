'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import toast from 'react-hot-toast'

export function EditEventModal({ event, open, onClose }) {
  const [description, setDescription] = useState(event?.description || '')
  const [budget, setBudget] = useState(event?.budget || 0)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!event?.id) return toast.error('Invalid event ID')
    setLoading(true)
    try {
      await updateDoc(doc(db, 'events', event.id), {
        description,
        budget: Number(budget) || 0
      })
      // toast.success('Event updated successfully! ✏️')
      onClose()
    } catch (err) {
      console.error(err)
      toast.error('Failed to update event.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Edit description"
          />
          <Input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Edit budget"
          />
          <Button onClick={handleSave} disabled={loading} className="w-full">
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
