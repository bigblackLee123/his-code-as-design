-- Enable Realtime for prescription_steps table (multi-room terminal sync)
ALTER TABLE prescription_steps REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE prescription_steps;
