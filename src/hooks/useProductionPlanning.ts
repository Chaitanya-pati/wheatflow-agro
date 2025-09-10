import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { ProductionPlanning } from './useProductionOrders'

export const useProductionPlanning = (orderId?: string) => {
  const [planning, setPlanning] = useState<ProductionPlanning[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const bins = [
    { id: 'A', name: 'Bin A', available: 18000 },
    { id: 'B', name: 'Bin B', available: 22000 },
    { id: 'C', name: 'Bin C', available: 15000 },
    { id: 'D', name: 'Bin D', available: 20000 },
    { id: 'E', name: 'Bin E', available: 45000 },
    { id: 'F', name: 'Bin F', available: 52000 }
  ]

  const fetchPlanning = async () => {
    if (!orderId) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('production_planning')
        .select('*')
        .eq('order_id', orderId)

      if (error) throw error
      setPlanning(data || [])
    } catch (error: any) {
      toast({
        title: 'Error fetching planning',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const savePlanning = async (orderData: { orderId: string, orderTons: number }, planningData: Record<string, number>) => {
    try {
      // Calculate total percentage
      const totalPercentage = Object.values(planningData).reduce((sum, val) => sum + val, 0)
      
      if (Math.abs(totalPercentage - 100) > 0.1) {
        throw new Error('Total percentage must equal exactly 100%')
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()

      // Delete existing planning for this order
      await supabase
        .from('production_planning')
        .delete()
        .eq('order_id', orderData.orderId)

      // Insert new planning data
      const planningEntries = bins
        .filter(bin => planningData[bin.id] > 0)
        .map(bin => ({
          order_id: orderData.orderId,
          bin_id: bin.id,
          bin_name: bin.name,
          percentage: planningData[bin.id],
          tons_allocated: (planningData[bin.id] / 100) * orderData.orderTons,
          available_tons: bin.available,
          created_by: user?.id
        }))

      const { error } = await supabase
        .from('production_planning')
        .insert(planningEntries)

      if (error) throw error

      // Update order status to planned
      await supabase
        .from('production_orders')
        .update({ status: 'planned', current_stage: 'planned' })
        .eq('id', orderData.orderId)

      // Log audit event
      await supabase.rpc('log_audit_event', {
        p_order_id: orderData.orderId,
        p_stage_name: 'planning',
        p_event_type: 'planning_completed',
        p_event_description: `Planning completed with ${planningEntries.length} bins allocated`,
        p_new_values: { planning: planningEntries, total_percentage: totalPercentage }
      })

      toast({
        title: 'Planning Saved',
        description: 'Production planning has been saved successfully'
      })

      fetchPlanning()
      return true
    } catch (error: any) {
      toast({
        title: 'Error saving planning',
        description: error.message,
        variant: 'destructive'
      })
      throw error
    }
  }

  useEffect(() => {
    fetchPlanning()
  }, [orderId])

  return {
    planning,
    loading,
    bins,
    savePlanning,
    refetch: fetchPlanning
  }
}