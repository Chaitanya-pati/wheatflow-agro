import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface CleaningReminder {
  id: string
  order_id: string
  stage_name: string
  reminder_type: 'manual_cleaning' | 'machine_cleaning' | 'pre_end_warning'
  scheduled_time: string
  actual_response_time?: string
  is_responded: boolean
  before_photo_url?: string
  after_photo_url?: string
  notes?: string
  reminder_interval_seconds: number
}

interface ReminderConfig {
  '24h_cleaning': number // 60 seconds
  '12h_cleaning': number // 30 seconds  
  'grinding': number // 10 seconds
}

const REMINDER_INTERVALS: ReminderConfig = {
  '24h_cleaning': 60,
  '12h_cleaning': 30,
  'grinding': 10
}

export const useCleaningReminders = (orderId?: string, stage?: string) => {
  const [reminders, setReminders] = useState<CleaningReminder[]>([])
  const [isReminderActive, setIsReminderActive] = useState(false)
  const [showReminderModal, setShowReminderModal] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout>()
  const { toast } = useToast()

  const startReminders = async () => {
    if (!orderId || !stage) return
    
    const intervalSeconds = REMINDER_INTERVALS[stage as keyof ReminderConfig]
    if (!intervalSeconds) return

    setIsReminderActive(true)
    
    // Schedule first reminder
    const scheduleReminder = () => {
      intervalRef.current = setTimeout(() => {
        setShowReminderModal(true)
        scheduleNextReminder()
      }, intervalSeconds * 1000)
    }

    const scheduleNextReminder = () => {
      if (isReminderActive) {
        scheduleReminder()
      }
    }

    scheduleReminder()

    // Log that reminders started
    await supabase.rpc('log_audit_event', {
      p_order_id: orderId,
      p_stage_name: stage,
      p_event_type: 'reminders_started',
      p_event_description: `Manual cleaning reminders started with ${intervalSeconds}s interval`,
      p_new_values: { interval_seconds: intervalSeconds }
    })
  }

  const stopReminders = () => {
    setIsReminderActive(false)
    if (intervalRef.current) {
      clearTimeout(intervalRef.current)
    }
  }

  const createReminder = async () => {
    if (!orderId || !stage) return

    const intervalSeconds = REMINDER_INTERVALS[stage as keyof ReminderConfig]
    
    try {
      const { data, error } = await supabase
        .from('cleaning_reminders')
        .insert({
          order_id: orderId,
          stage_name: stage,
          reminder_type: 'manual_cleaning',
          scheduled_time: new Date().toISOString(),
          reminder_interval_seconds: intervalSeconds
        })
        .select()
        .single()

      if (error) throw error
      
      await fetchReminders()
      return data.id
    } catch (error: any) {
      toast({
        title: 'Error creating reminder',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  const respondToReminder = async (
    reminderId: string, 
    beforePhotoUrl?: string, 
    afterPhotoUrl?: string, 
    notes?: string
  ) => {
    try {
      const { error } = await supabase
        .from('cleaning_reminders')
        .update({
          actual_response_time: new Date().toISOString(),
          is_responded: true,
          before_photo_url: beforePhotoUrl,
          after_photo_url: afterPhotoUrl,
          notes
        })
        .eq('id', reminderId)

      if (error) throw error

      await fetchReminders()
      setShowReminderModal(false)
      
      toast({
        title: 'Reminder Completed',
        description: 'Cleaning reminder has been responded to'
      })
    } catch (error: any) {
      toast({
        title: 'Error responding to reminder',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  const fetchReminders = async () => {
    if (!orderId) return

    try {
      const { data, error } = await supabase
        .from('cleaning_reminders')
        .select('*')
        .eq('order_id', orderId)
        .order('scheduled_time', { ascending: false })

      if (error) throw error
      setReminders((data || []) as CleaningReminder[])
    } catch (error: any) {
      toast({
        title: 'Error fetching reminders',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  // Create pre-end warnings
  const schedulePreEndWarning = async (minutesBefore: number) => {
    if (!orderId || !stage) return

    const warningTime = new Date()
    warningTime.setMinutes(warningTime.getMinutes() + minutesBefore)

    try {
      await supabase
        .from('cleaning_reminders')
        .insert({
          order_id: orderId,
          stage_name: stage,
          reminder_type: 'pre_end_warning',
          scheduled_time: warningTime.toISOString(),
          reminder_interval_seconds: 0
        })

      toast({
        title: 'Pre-end Warning Scheduled',
        description: `Warning will be shown ${minutesBefore} minutes before completion`
      })
    } catch (error: any) {
      toast({
        title: 'Error scheduling warning',
        description: error.message,
        variant: 'destructive'
      })
    }
  }

  useEffect(() => {
    fetchReminders()
  }, [orderId])

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current)
      }
    }
  }, [])

  return {
    reminders,
    isReminderActive,
    showReminderModal,
    setShowReminderModal,
    startReminders,
    stopReminders,
    createReminder,
    respondToReminder,
    schedulePreEndWarning,
    fetchReminders
  }
}