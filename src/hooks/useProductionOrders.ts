import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface ProductionOrder {
  id: string
  order_number: string
  quantity_tons: number
  finished_goods_type: string
  priority: 'low' | 'medium' | 'high'
  status: 'created' | 'planning' | 'planned' | '24h_cleaning' | '12h_cleaning' | 'grinding' | 'completed' | 'on_hold'
  current_stage: string
  target_date?: string
  description?: string
  created_by?: string
  responsible_person?: string
  created_at: string
  updated_at: string
}

export interface ProductionPlanning {
  id: string
  order_id: string
  bin_id: string
  bin_name: string
  percentage: number
  tons_allocated: number
  available_tons: number
  is_locked: boolean
}

export const useProductionOrders = () => {
  const [orders, setOrders] = useState<ProductionOrder[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('production_orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders((data || []) as ProductionOrder[])
    } catch (error: any) {
      toast({
        title: 'Error fetching orders',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const createOrder = async (orderData: {
    order_number: string
    quantity_tons: number
    finished_goods_type: string
    priority: 'low' | 'medium' | 'high'
    target_date?: string
    description?: string
  }) => {
    try {
      const { data, error } = await supabase
        .from('production_orders')
        .insert([{
          ...orderData,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single()

      if (error) throw error

      // Log audit event
      await supabase.rpc('log_audit_event', {
        p_order_id: data.id,
        p_stage_name: 'order_creation',
        p_event_type: 'order_created',
        p_event_description: `Order ${data.order_number} created for ${data.quantity_tons} tons of ${data.finished_goods_type}`,
        p_new_values: data
      })

      toast({
        title: 'Order Created',
        description: `Order ${data.order_number} created successfully`
      })

      fetchOrders()
      return data
    } catch (error: any) {
      toast({
        title: 'Error creating order',
        description: error.message,
        variant: 'destructive'
      })
      throw error
    }
  }

  const updateOrderStatus = async (orderId: string, status: ProductionOrder['status'], currentStage?: string) => {
    try {
      const { data, error } = await supabase
        .from('production_orders')
        .update({ 
          status, 
          current_stage: currentStage || status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single()

      if (error) throw error

      // Log audit event
      await supabase.rpc('log_audit_event', {
        p_order_id: orderId,
        p_stage_name: currentStage || status,
        p_event_type: 'status_updated',
        p_event_description: `Order status updated to ${status}`,
        p_new_values: { status, current_stage: currentStage || status }
      })

      fetchOrders()
      return data
    } catch (error: any) {
      toast({
        title: 'Error updating order',
        description: error.message,
        variant: 'destructive'
      })
      throw error
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return {
    orders,
    loading,
    createOrder,
    updateOrderStatus,
    refetch: fetchOrders
  }
}