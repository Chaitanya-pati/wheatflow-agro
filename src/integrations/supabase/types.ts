export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          event_description: string
          event_type: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          order_id: string | null
          stage_name: string | null
          timestamp: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          event_description: string
          event_type: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          order_id?: string | null
          stage_name?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          event_description?: string
          event_type?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          order_id?: string | null
          stage_name?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "production_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      cleaning_reminders: {
        Row: {
          actual_response_time: string | null
          after_photo_url: string | null
          before_photo_url: string | null
          created_at: string
          id: string
          is_responded: boolean
          notes: string | null
          order_id: string
          reminder_interval_seconds: number | null
          reminder_type: string
          responded_by: string | null
          scheduled_time: string
          stage_name: string
        }
        Insert: {
          actual_response_time?: string | null
          after_photo_url?: string | null
          before_photo_url?: string | null
          created_at?: string
          id?: string
          is_responded?: boolean
          notes?: string | null
          order_id: string
          reminder_interval_seconds?: number | null
          reminder_type: string
          responded_by?: string | null
          scheduled_time: string
          stage_name: string
        }
        Update: {
          actual_response_time?: string | null
          after_photo_url?: string | null
          before_photo_url?: string | null
          created_at?: string
          id?: string
          is_responded?: boolean
          notes?: string | null
          order_id?: string
          reminder_interval_seconds?: number | null
          reminder_type?: string
          responded_by?: string | null
          scheduled_time?: string
          stage_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "cleaning_reminders_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "production_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      machine_cleaning_logs: {
        Row: {
          actual_time: string | null
          after_photo_url: string | null
          before_photo_url: string | null
          cleaned_by: string | null
          cleaning_type: string
          created_at: string
          duration_minutes: number | null
          id: string
          machine_name: string
          notes: string | null
          order_id: string
          scheduled_time: string | null
          stage_name: string
        }
        Insert: {
          actual_time?: string | null
          after_photo_url?: string | null
          before_photo_url?: string | null
          cleaned_by?: string | null
          cleaning_type: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          machine_name: string
          notes?: string | null
          order_id: string
          scheduled_time?: string | null
          stage_name: string
        }
        Update: {
          actual_time?: string | null
          after_photo_url?: string | null
          before_photo_url?: string | null
          cleaned_by?: string | null
          cleaning_type?: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          machine_name?: string
          notes?: string | null
          order_id?: string
          scheduled_time?: string | null
          stage_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "machine_cleaning_logs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "production_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      packaging_records: {
        Row: {
          bag_count: number
          bag_weight_kg: number
          id: string
          order_id: string
          packaged_at: string
          packaged_by: string | null
          product_type: string
          total_weight_kg: number
        }
        Insert: {
          bag_count: number
          bag_weight_kg: number
          id?: string
          order_id: string
          packaged_at?: string
          packaged_by?: string | null
          product_type: string
          total_weight_kg: number
        }
        Update: {
          bag_count?: number
          bag_weight_kg?: number
          id?: string
          order_id?: string
          packaged_at?: string
          packaged_by?: string | null
          product_type?: string
          total_weight_kg?: number
        }
        Relationships: [
          {
            foreignKeyName: "packaging_records_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "production_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      production_orders: {
        Row: {
          created_at: string
          created_by: string | null
          current_stage: string
          description: string | null
          finished_goods_type: string
          id: string
          order_number: string
          priority: string
          quantity_tons: number
          responsible_person: string | null
          status: string
          target_date: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          current_stage?: string
          description?: string | null
          finished_goods_type: string
          id?: string
          order_number: string
          priority?: string
          quantity_tons: number
          responsible_person?: string | null
          status?: string
          target_date?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          current_stage?: string
          description?: string | null
          finished_goods_type?: string
          id?: string
          order_number?: string
          priority?: string
          quantity_tons?: number
          responsible_person?: string | null
          status?: string
          target_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      production_outputs: {
        Row: {
          id: string
          is_main_product: boolean
          order_id: string
          percentage: number
          product_type: string
          quantity_kg: number
          recorded_at: string
          recorded_by: string | null
        }
        Insert: {
          id?: string
          is_main_product?: boolean
          order_id: string
          percentage: number
          product_type: string
          quantity_kg: number
          recorded_at?: string
          recorded_by?: string | null
        }
        Update: {
          id?: string
          is_main_product?: boolean
          order_id?: string
          percentage?: number
          product_type?: string
          quantity_kg?: number
          recorded_at?: string
          recorded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "production_outputs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "production_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      production_planning: {
        Row: {
          available_tons: number
          bin_id: string
          bin_name: string
          created_at: string
          created_by: string | null
          id: string
          is_locked: boolean
          order_id: string
          percentage: number
          tons_allocated: number
        }
        Insert: {
          available_tons: number
          bin_id: string
          bin_name: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_locked?: boolean
          order_id: string
          percentage: number
          tons_allocated: number
        }
        Update: {
          available_tons?: number
          bin_id?: string
          bin_name?: string
          created_at?: string
          created_by?: string | null
          id?: string
          is_locked?: boolean
          order_id?: string
          percentage?: number
          tons_allocated?: number
        }
        Relationships: [
          {
            foreignKeyName: "production_planning_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "production_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      production_stages: {
        Row: {
          created_at: string
          duration_hours: number | null
          end_time: string | null
          id: string
          is_locked: boolean
          order_id: string
          progress: number | null
          stage_name: string
          start_time: string | null
          status: string
          target_completion: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          duration_hours?: number | null
          end_time?: string | null
          id?: string
          is_locked?: boolean
          order_id: string
          progress?: number | null
          stage_name: string
          start_time?: string | null
          status?: string
          target_completion?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          duration_hours?: number | null
          end_time?: string | null
          id?: string
          is_locked?: boolean
          order_id?: string
          progress?: number | null
          stage_name?: string
          start_time?: string | null
          status?: string
          target_completion?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "production_stages_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "production_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      stage_data: {
        Row: {
          data_type: string
          id: string
          order_id: string
          recorded_at: string
          recorded_by: string | null
          stage_name: string
          unit: string | null
          value_numeric: number | null
          value_text: string | null
        }
        Insert: {
          data_type: string
          id?: string
          order_id: string
          recorded_at?: string
          recorded_by?: string | null
          stage_name: string
          unit?: string | null
          value_numeric?: number | null
          value_text?: string | null
        }
        Update: {
          data_type?: string
          id?: string
          order_id?: string
          recorded_at?: string
          recorded_by?: string | null
          stage_name?: string
          unit?: string | null
          value_numeric?: number | null
          value_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stage_data_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "production_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      storage_areas: {
        Row: {
          area_name: string
          area_type: string
          capacity_kg: number | null
          created_at: string
          current_stock_kg: number | null
          id: string
          is_active: boolean
        }
        Insert: {
          area_name: string
          area_type: string
          capacity_kg?: number | null
          created_at?: string
          current_stock_kg?: number | null
          id?: string
          is_active?: boolean
        }
        Update: {
          area_name?: string
          area_type?: string
          capacity_kg?: number | null
          created_at?: string
          current_stock_kg?: number | null
          id?: string
          is_active?: boolean
        }
        Relationships: []
      }
      storage_movements: {
        Row: {
          from_area_id: string | null
          id: string
          moved_at: string
          moved_by: string | null
          movement_type: string
          notes: string | null
          order_id: string | null
          product_type: string
          quantity_kg: number
          to_area_id: string | null
        }
        Insert: {
          from_area_id?: string | null
          id?: string
          moved_at?: string
          moved_by?: string | null
          movement_type: string
          notes?: string | null
          order_id?: string | null
          product_type: string
          quantity_kg: number
          to_area_id?: string | null
        }
        Update: {
          from_area_id?: string | null
          id?: string
          moved_at?: string
          moved_by?: string | null
          movement_type?: string
          notes?: string | null
          order_id?: string | null
          product_type?: string
          quantity_kg?: number
          to_area_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "storage_movements_from_area_id_fkey"
            columns: ["from_area_id"]
            isOneToOne: false
            referencedRelation: "storage_areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storage_movements_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "production_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "storage_movements_to_area_id_fkey"
            columns: ["to_area_id"]
            isOneToOne: false
            referencedRelation: "storage_areas"
            referencedColumns: ["id"]
          },
        ]
      }
      transfer_jobs: {
        Row: {
          created_at: string
          created_by: string | null
          duration_minutes: number | null
          end_time: string | null
          from_bin: string
          id: string
          job_number: string
          order_id: string
          quantity_tons: number
          start_time: string | null
          status: string
          to_bin: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          from_bin: string
          id?: string
          job_number: string
          order_id: string
          quantity_tons: number
          start_time?: string | null
          status?: string
          to_bin: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          from_bin?: string
          id?: string
          job_number?: string
          order_id?: string
          quantity_tons?: number
          start_time?: string | null
          status?: string
          to_bin?: string
        }
        Relationships: [
          {
            foreignKeyName: "transfer_jobs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "production_orders"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      log_audit_event: {
        Args: {
          p_event_description: string
          p_event_type: string
          p_new_values?: Json
          p_old_values?: Json
          p_order_id: string
          p_stage_name: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
