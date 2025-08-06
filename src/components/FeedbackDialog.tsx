import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

const FeedbackDialog = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = () => {
    const subject = encodeURIComponent('Zuri Beta Feedback')
    const body = encodeURIComponent(`Feedback:\n\n${message}\n\nFrom: ${email || 'anonymous'}`)
    const to = 'feedback@zuri.chat'
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Send Feedback</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share your feedback</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Your email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Textarea placeholder="Tell us what’s working, what’s not, or any ideas…" value={message} onChange={(e) => setMessage(e.target.value)} rows={6} />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => { setEmail(''); setMessage('') }}>Clear</Button>
            <Button onClick={handleSubmit} disabled={!message.trim()}>Send</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FeedbackDialog
