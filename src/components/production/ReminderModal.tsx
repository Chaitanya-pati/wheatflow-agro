import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Camera, Upload, CheckCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ReminderModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (beforePhoto?: string, afterPhoto?: string, notes?: string) => Promise<void>
  stage: string
  intervalSeconds: number
}

export const ReminderModal = ({ 
  open, 
  onClose, 
  onSubmit, 
  stage, 
  intervalSeconds 
}: ReminderModalProps) => {
  const [beforePhoto, setBeforePhoto] = useState<string>('')
  const [afterPhoto, setAfterPhoto] = useState<string>('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!beforePhoto || !afterPhoto) {
      toast({
        title: 'Photos Required',
        description: 'Please upload both before and after photos',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await onSubmit(beforePhoto, afterPhoto, notes)
      // Reset form
      setBeforePhoto('')
      setAfterPhoto('')
      setNotes('')
    } catch (error) {
      console.error('Error submitting reminder:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatInterval = (seconds: number) => {
    if (seconds >= 60) {
      return `${seconds / 60} minute${seconds / 60 !== 1 ? 's' : ''}`
    }
    return `${seconds} second${seconds !== 1 ? 's' : ''}`
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            Manual Cleaning Reminder
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted/20 p-3 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              <strong>{stage.replace('_', ' ').toUpperCase()}</strong> Stage
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Reminder every {formatInterval(intervalSeconds)}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="beforePhoto">Before Cleaning Photo *</Label>
            <div className="flex gap-2">
              <Input
                id="beforePhoto"
                placeholder="Photo URL or upload"
                value={beforePhoto}
                onChange={(e) => setBeforePhoto(e.target.value)}
              />
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="afterPhoto">After Cleaning Photo *</Label>
            <div className="flex gap-2">
              <Input
                id="afterPhoto"
                placeholder="Photo URL or upload"
                value={afterPhoto}
                onChange={(e) => setAfterPhoto(e.target.value)}
              />
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about cleaning..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Skip
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={loading}
              className="primary-gradient flex-1"
            >
              {loading ? (
                'Submitting...'
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}