-- Fix search path security issue for functions
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;