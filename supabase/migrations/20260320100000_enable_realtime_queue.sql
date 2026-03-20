-- 启用 queue_items 和 patients 表的 Realtime 订阅
-- 1. 设置 REPLICA IDENTITY FULL，确保 UPDATE/DELETE 事件包含完整行数据
ALTER TABLE queue_items REPLICA IDENTITY FULL;
ALTER TABLE patients REPLICA IDENTITY FULL;

-- 2. 将表加入 supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE queue_items;
ALTER PUBLICATION supabase_realtime ADD TABLE patients;
