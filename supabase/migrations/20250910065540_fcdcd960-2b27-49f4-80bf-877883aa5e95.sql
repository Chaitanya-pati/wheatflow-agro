-- Production Module Database Schema

-- Main production orders table
CREATE TABLE public.production_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  quantity_tons DECIMAL(10,2) NOT NULL,
  finished_goods_type TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'planning', 'planned', '24h_cleaning', '12h_cleaning', 'grinding', 'completed', 'on_hold')),
  current_stage TEXT NOT NULL DEFAULT 'created',
  target_date DATE,
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  responsible_person UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Production planning (bin allocations)
CREATE TABLE public.production_planning (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.production_orders(id) ON DELETE CASCADE,
  bin_id TEXT NOT NULL,
  bin_name TEXT NOT NULL,
  percentage DECIMAL(5,2) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  tons_allocated DECIMAL(10,2) NOT NULL,
  available_tons DECIMAL(10,2) NOT NULL,
  is_locked BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(order_id, bin_id)
);

-- Production stages tracking
CREATE TABLE public.production_stages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.production_orders(id) ON DELETE CASCADE,
  stage_name TEXT NOT NULL CHECK (stage_name IN ('planning', '24h_cleaning', '12h_cleaning', 'grinding')),
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'active', 'completed', 'on_hold')),
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_hours INTEGER,
  target_completion TIMESTAMP WITH TIME ZONE,
  progress DECIMAL(5,2) DEFAULT 0,
  is_locked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(order_id, stage_name)
);

-- Transfer jobs for bin-to-bin operations
CREATE TABLE public.transfer_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.production_orders(id) ON DELETE CASCADE,
  job_number TEXT NOT NULL,
  from_bin TEXT NOT NULL,
  to_bin TEXT NOT NULL,
  quantity_tons DECIMAL(10,2) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Stage data (moisture, waste, etc.)
CREATE TABLE public.stage_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.production_orders(id) ON DELETE CASCADE,
  stage_name TEXT NOT NULL,
  data_type TEXT NOT NULL, -- 'input_moisture', 'output_moisture', 'waste_collected', 'water_added', 'target_moisture', 'machine_name'
  value_numeric DECIMAL(10,2),
  value_text TEXT,
  unit TEXT, -- '%', 'kg', 'liters', etc.
  recorded_by UUID REFERENCES auth.users(id),
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Manual cleaning reminders and responses
CREATE TABLE public.cleaning_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.production_orders(id) ON DELETE CASCADE,
  stage_name TEXT NOT NULL,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('manual_cleaning', 'machine_cleaning', 'pre_end_warning')),
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_response_time TIMESTAMP WITH TIME ZONE,
  is_responded BOOLEAN NOT NULL DEFAULT false,
  before_photo_url TEXT,
  after_photo_url TEXT,
  notes TEXT,
  reminder_interval_seconds INTEGER,
  responded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Machine cleaning logs
CREATE TABLE public.machine_cleaning_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.production_orders(id) ON DELETE CASCADE,
  stage_name TEXT NOT NULL,
  machine_name TEXT NOT NULL,
  cleaning_type TEXT NOT NULL CHECK (cleaning_type IN ('hourly_scheduled', 'manual')),
  scheduled_time TIMESTAMP WITH TIME ZONE,
  actual_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  before_photo_url TEXT,
  after_photo_url TEXT,
  notes TEXT,
  cleaned_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Product outputs and ratios
CREATE TABLE public.production_outputs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.production_orders(id) ON DELETE CASCADE,
  product_type TEXT NOT NULL,
  quantity_kg DECIMAL(10,2) NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  is_main_product BOOLEAN NOT NULL DEFAULT true,
  recorded_by UUID REFERENCES auth.users(id),
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Packaging records
CREATE TABLE public.packaging_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.production_orders(id) ON DELETE CASCADE,
  product_type TEXT NOT NULL,
  bag_weight_kg INTEGER NOT NULL,
  bag_count INTEGER NOT NULL,
  total_weight_kg DECIMAL(10,2) NOT NULL,
  packaged_by UUID REFERENCES auth.users(id),
  packaged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Storage areas and levels
CREATE TABLE public.storage_areas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  area_name TEXT NOT NULL UNIQUE,
  area_type TEXT NOT NULL,
  capacity_kg DECIMAL(12,2),
  current_stock_kg DECIMAL(12,2) DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Storage movements and shifting
CREATE TABLE public.storage_movements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.production_orders(id),
  from_area_id UUID REFERENCES public.storage_areas(id),
  to_area_id UUID REFERENCES public.storage_areas(id),
  product_type TEXT NOT NULL,
  quantity_kg DECIMAL(10,2) NOT NULL,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('production_in', 'shift_between_areas', 'dispatch_out')),
  moved_by UUID REFERENCES auth.users(id),
  moved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT
);

-- Comprehensive audit trail
CREATE TABLE public.audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.production_orders(id),
  stage_name TEXT,
  event_type TEXT NOT NULL,
  event_description TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  user_id UUID REFERENCES auth.users(id),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

-- Enable RLS on all tables
ALTER TABLE public.production_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_planning ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfer_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stage_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cleaning_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.machine_cleaning_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_outputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packaging_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storage_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storage_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for authenticated users
CREATE POLICY "Users can view all production data" ON public.production_orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert production orders" ON public.production_orders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update production orders" ON public.production_orders FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Users can manage production planning" ON public.production_planning FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can manage production stages" ON public.production_stages FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can manage transfer jobs" ON public.transfer_jobs FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can manage stage data" ON public.stage_data FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can manage cleaning reminders" ON public.cleaning_reminders FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can manage machine cleaning logs" ON public.machine_cleaning_logs FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can manage production outputs" ON public.production_outputs FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can manage packaging records" ON public.packaging_records FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can manage storage areas" ON public.storage_areas FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can manage storage movements" ON public.storage_movements FOR ALL TO authenticated USING (true);
CREATE POLICY "Users can view audit log" ON public.audit_log FOR SELECT TO authenticated USING (true);
CREATE POLICY "System can insert audit log" ON public.audit_log FOR INSERT TO authenticated WITH CHECK (true);

-- Insert default storage areas
INSERT INTO public.storage_areas (area_name, area_type, capacity_kg) VALUES
('Area 1', 'Finished Goods', 500000),
('Area 2', 'Finished Goods', 500000),
('Area 3', 'Finished Goods', 300000),
('Area 4', 'Finished Goods', 200000);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_production_orders_updated_at
  BEFORE UPDATE ON public.production_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_production_stages_updated_at
  BEFORE UPDATE ON public.production_stages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_production_orders_status ON public.production_orders(status);
CREATE INDEX idx_production_orders_order_number ON public.production_orders(order_number);
CREATE INDEX idx_production_planning_order_id ON public.production_planning(order_id);
CREATE INDEX idx_production_stages_order_id ON public.production_stages(order_id);
CREATE INDEX idx_transfer_jobs_order_id ON public.transfer_jobs(order_id);
CREATE INDEX idx_stage_data_order_id ON public.stage_data(order_id);
CREATE INDEX idx_cleaning_reminders_order_id ON public.cleaning_reminders(order_id);
CREATE INDEX idx_audit_log_order_id ON public.audit_log(order_id);
CREATE INDEX idx_audit_log_timestamp ON public.audit_log(timestamp);

-- Create function to log audit events
CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_order_id UUID,
  p_stage_name TEXT,
  p_event_type TEXT,
  p_event_description TEXT,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL
) RETURNS void AS $$
BEGIN
  INSERT INTO public.audit_log (
    order_id,
    stage_name,
    event_type,
    event_description,
    old_values,
    new_values,
    user_id
  ) VALUES (
    p_order_id,
    p_stage_name,
    p_event_type,
    p_event_description,
    p_old_values,
    p_new_values,
    auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;