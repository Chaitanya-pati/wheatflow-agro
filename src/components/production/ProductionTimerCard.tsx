import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Timer, Play, Pause, CheckCircle, AlertTriangle } from 'lucide-react'
import { useProductionTimer } from '@/hooks/useProductionTimer'
import { useCleaningReminders } from '@/hooks/useCleaningReminders'
import { ReminderModal } from './ReminderModal'

interface ProductionTimerCardProps {
  orderId: string
  stage: string
  stageName: string
  onStageComplete?: () => void
  allowedDurations?: number[]
}

export const ProductionTimerCard = ({ 
  orderId, 
  stage, 
  stageName, 
  onStageComplete,
  allowedDurations = [24, 12] 
}: ProductionTimerCardProps) => {
  const { 
    timerState, 
    startTimer, 
    stopTimer, 
    formatTime, 
    isCompleted, 
    progressPercentage 
  } = useProductionTimer(orderId, stage)

  const {
    isReminderActive,
    showReminderModal,
    setShowReminderModal,
    startReminders,
    stopReminders,
    createReminder,
    respondToReminder
  } = useCleaningReminders(orderId, stage)

  const handleStartStage = async (duration: number) => {
    startTimer(duration)
    await startReminders()
  }

  const handleStopStage = () => {
    stopTimer()
    stopReminders()
  }

  const handleReminderResponse = async (beforePhoto?: string, afterPhoto?: string, notes?: string) => {
    const reminderId = await createReminder()
    if (reminderId) {
      await respondToReminder(reminderId, beforePhoto, afterPhoto, notes)
    }
  }

  const getIntervalSeconds = () => {
    const intervals: Record<string, number> = {
      '24h_cleaning': 60,
      '12h_cleaning': 30,
      'grinding': 10
    }
    return intervals[stage] || 60
  }

  return (
    <>
      <Card className="steel-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="w-5 h-5" />
            {stageName} Timer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!timerState.isActive && !isCompleted && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Select duration to start {stageName.toLowerCase()} process:
              </p>
              <div className="flex gap-2">
                {allowedDurations.map(duration => (
                  <Button
                    key={duration}
                    onClick={() => handleStartStage(duration)}
                    className="primary-gradient flex-1"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {duration}h
                  </Button>
                ))}
              </div>
            </div>
          )}

          {timerState.isActive && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {formatTime(timerState.timeLeft)}
                </div>
                <p className="text-sm text-muted-foreground">remaining</p>
              </div>
              
              <Progress value={progressPercentage} className="h-3" />
              
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-3 h-3 rounded-full ${isReminderActive ? 'bg-success animate-pulse' : 'bg-muted'}`} />
                <span>
                  Reminders: {isReminderActive ? 'Active' : 'Inactive'}
                  {isReminderActive && ` (every ${getIntervalSeconds()}s)`}
                </span>
              </div>

              <Button 
                onClick={handleStopStage} 
                variant="outline" 
                className="w-full"
              >
                <Pause className="w-4 h-4 mr-2" />
                Stop Process
              </Button>
            </div>
          )}

          {isCompleted && (
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-success">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Stage Completed!</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Duration: {formatTime(timerState.duration)}
              </p>
              {onStageComplete && (
                <Button 
                  onClick={onStageComplete}
                  className="success-gradient w-full"
                >
                  Proceed to Next Stage
                </Button>
              )}
            </div>
          )}

          {timerState.timeLeft <= 300 && timerState.isActive && (
            <div className="flex items-center gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <span className="text-sm text-warning">
                Process will complete in less than 5 minutes
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <ReminderModal
        open={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        onSubmit={handleReminderResponse}
        stage={stageName}
        intervalSeconds={getIntervalSeconds()}
      />
    </>
  )
}