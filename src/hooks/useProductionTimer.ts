import { useState, useEffect, useRef } from 'react'
import { useToast } from '@/hooks/use-toast'

export interface TimerState {
  isActive: boolean
  timeLeft: number
  duration: number
  startTime?: Date
  endTime?: Date
}

export const useProductionTimer = (orderId?: string, stage?: string) => {
  const [timerState, setTimerState] = useState<TimerState>({
    isActive: false,
    timeLeft: 0,
    duration: 0
  })
  const intervalRef = useRef<NodeJS.Timeout>()
  const { toast } = useToast()

  // Load timer state from localStorage
  const loadTimerState = () => {
    if (!orderId || !stage) return

    const key = `timer_${orderId}_${stage}`
    const saved = localStorage.getItem(key)
    
    if (saved) {
      const state = JSON.parse(saved)
      const now = new Date().getTime()
      const endTime = new Date(state.endTime).getTime()
      
      if (now < endTime) {
        const timeLeft = Math.floor((endTime - now) / 1000)
        setTimerState({
          ...state,
          timeLeft,
          isActive: true,
          startTime: new Date(state.startTime),
          endTime: new Date(state.endTime)
        })
        return true
      } else {
        // Timer has completed
        localStorage.removeItem(key)
        setTimerState({
          isActive: false,
          timeLeft: 0,
          duration: state.duration,
          startTime: new Date(state.startTime),
          endTime: new Date(state.endTime)
        })
        return false
      }
    }
    return false
  }

  // Save timer state to localStorage
  const saveTimerState = (state: TimerState) => {
    if (!orderId || !stage) return
    
    const key = `timer_${orderId}_${stage}`
    localStorage.setItem(key, JSON.stringify({
      ...state,
      startTime: state.startTime?.toISOString(),
      endTime: state.endTime?.toISOString()
    }))
  }

  // Start timer
  const startTimer = (durationHours: number) => {
    const startTime = new Date()
    const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000)
    const duration = durationHours * 3600
    
    const newState = {
      isActive: true,
      timeLeft: duration,
      duration,
      startTime,
      endTime
    }
    
    setTimerState(newState)
    saveTimerState(newState)
    
    toast({
      title: 'Timer Started',
      description: `${durationHours}h timer started for ${stage} stage`
    })
  }

  // Stop timer
  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    setTimerState(prev => ({ ...prev, isActive: false }))
    
    if (orderId && stage) {
      const key = `timer_${orderId}_${stage}`
      localStorage.removeItem(key)
    }
  }

  // Format time display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  // Timer tick effect
  useEffect(() => {
    if (timerState.isActive && timerState.timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimerState(prev => {
          const newTimeLeft = prev.timeLeft - 1
          const newState = { ...prev, timeLeft: newTimeLeft }
          
          if (newTimeLeft <= 0) {
            newState.isActive = false
            toast({
              title: 'Timer Completed!',
              description: `${stage} stage timer has finished`,
            })
          }
          
          saveTimerState(newState)
          return newState
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [timerState.isActive, timerState.timeLeft, stage, toast])

  // Load state on mount
  useEffect(() => {
    loadTimerState()
  }, [orderId, stage])

  return {
    timerState,
    startTimer,
    stopTimer,
    formatTime,
    isCompleted: timerState.timeLeft === 0 && timerState.duration > 0,
    progressPercentage: timerState.duration > 0 ? ((timerState.duration - timerState.timeLeft) / timerState.duration) * 100 : 0
  }
}