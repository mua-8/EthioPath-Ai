-- Table for storing user dashboard layout preferences
CREATE TABLE IF NOT EXISTS public.user_dashboard_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    layout_config JSONB NOT NULL DEFAULT '[
        {"id": "profile", "visible": true, "order": 0},
        {"id": "progress", "visible": true, "order": 1},
        {"id": "quick-actions", "visible": true, "order": 2},
        {"id": "roadmap", "visible": true, "order": 3},
        {"id": "stats", "visible": true, "order": 4},
        {"id": "activity", "visible": true, "order": 5},
        {"id": "goals", "visible": true, "order": 6},
        {"id": "ai-mentor", "visible": true, "order": 7}
    ]',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_dashboard_settings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own settings" ON public.user_dashboard_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" ON public.user_dashboard_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON public.user_dashboard_settings
    FOR UPDATE USING (auth.uid() = user_id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_dashboard_settings_updated_at
    BEFORE UPDATE ON public.user_dashboard_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
