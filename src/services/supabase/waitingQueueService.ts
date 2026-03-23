import type { QueueItem } from "../types";
import { supabase } from "./client";
import { throwIfError } from "./errorHelper";
import { consultationHelper } from "./consultationHelper";
import { toQueueItem } from "./mappers";

const MAX_WAITING_QUEUE_SIZE = 20;

export const waitingQueueService = {
  async getMaxQueueSize(_departmentId: string): Promise<number> {
    return MAX_WAITING_QUEUE_SIZE;
  },

  async getWaitingQueue(_departmentId: string): Promise<QueueItem[]> {
    const { data, error } = await supabase
      .from("queue_items")
      .select("*, patients!inner(name, insurance_card_no)")
      .eq("queue_type", "waiting")
      .eq("status", "waiting")
      .order("queue_number", { ascending: true });

    throwIfError(error, { table: "queue_items", operation: "select" });
    return (data ?? []).map(toQueueItem);
  },

  async enqueueWaiting(
    patientId: string,
    _departmentId: string
  ): Promise<QueueItem> {
    const { count, error: countError } = await supabase
      .from("queue_items")
      .select("*", { count: "exact", head: true })
      .eq("queue_type", "waiting")
      .eq("status", "waiting");

    throwIfError(countError, { table: "queue_items", operation: "select" });

    if ((count ?? 0) >= MAX_WAITING_QUEUE_SIZE) {
      throw new Error("候诊队列已满，请稍后再试");
    }

    const consultationId = await consultationHelper.getActiveId(patientId);

    const { data: maxRow, error: maxError } = await supabase
      .from("queue_items")
      .select("queue_number")
      .eq("queue_type", "waiting")
      .order("queue_number", { ascending: false })
      .limit(1)
      .maybeSingle();

    throwIfError(maxError, { table: "queue_items", operation: "select" });

    const nextNumber = (maxRow?.queue_number ?? 0) + 1;

    const { data: inserted, error: insertError } = await supabase
      .from("queue_items")
      .insert({
        patient_id: patientId,
        consultation_id: consultationId,
        queue_type: "waiting",
        status: "waiting",
        queue_number: nextNumber,
      })
      .select("*, patients!inner(name, insurance_card_no)")
      .single();

    throwIfError(insertError, { table: "queue_items", operation: "insert" });

    const { error: updateError } = await supabase
      .from("patients")
      .update({ status: "waiting" })
      .eq("id", patientId);

    throwIfError(updateError, { table: "patients", operation: "update" });

    return toQueueItem(inserted!);
  },

  async callNextWaiting(_departmentId: string): Promise<QueueItem | null> {
    const { data: next, error: selectError } = await supabase
      .from("queue_items")
      .select("*, patients!inner(name, insurance_card_no)")
      .eq("queue_type", "waiting")
      .eq("status", "waiting")
      .order("queue_number", { ascending: true })
      .limit(1)
      .maybeSingle();

    throwIfError(selectError, { table: "queue_items", operation: "select" });

    if (!next) return null;

    const { error: updateError } = await supabase
      .from("queue_items")
      .update({ status: "in-progress" })
      .eq("id", next.id);

    throwIfError(updateError, { table: "queue_items", operation: "update" });

    const { error: patientError } = await supabase
      .from("patients")
      .update({ status: "consulting" })
      .eq("id", next.patient_id);

    throwIfError(patientError, { table: "patients", operation: "update" });

    return toQueueItem({ ...next, status: "in-progress" });
  },

  async skipPatient(queueItemId: string): Promise<QueueItem> {
    // Get the queue item to skip
    const { data: toSkip, error: selectError } = await supabase
      .from("queue_items")
      .select("*, patients!inner(name, insurance_card_no)")
      .eq("id", queueItemId)
      .single();

    throwIfError(selectError, { table: "queue_items", operation: "select" });

    if (!toSkip) throw new Error("队列项不存在");

    // Get max queue number
    const { data: maxRow, error: maxError } = await supabase
      .from("queue_items")
      .select("queue_number")
      .eq("queue_type", "waiting")
      .eq("status", "waiting")
      .order("queue_number", { ascending: false })
      .limit(1)
      .maybeSingle();

    throwIfError(maxError, { table: "queue_items", operation: "select" });

    const nextNumber = (maxRow?.queue_number ?? 0) + 1;

    // Update the skipped item with new queue number
    const { data: updated, error: updateError } = await supabase
      .from("queue_items")
      .update({ queue_number: nextNumber })
      .eq("id", queueItemId)
      .select("*, patients!inner(name, insurance_card_no)")
      .single();

    throwIfError(updateError, { table: "queue_items", operation: "update" });

    return toQueueItem(updated!);
  },

  /** 移出队列（患者不来了，直接从候诊队列移除） */
  async removeFromQueue(queueItemId: string): Promise<void> {
    const { data: item, error: selectError } = await supabase
      .from("queue_items")
      .select("patient_id")
      .eq("id", queueItemId)
      .single();

    throwIfError(selectError, { table: "queue_items", operation: "select" });

    const { error: updateError } = await supabase
      .from("queue_items")
      .update({ status: "completed" })
      .eq("id", queueItemId);

    throwIfError(updateError, { table: "queue_items", operation: "update" });

    // 将患者状态回退为 checked-in
    if (item) {
      const { error: patientError } = await supabase
        .from("patients")
        .update({ status: "checked-in" })
        .eq("id", item.patient_id);

      throwIfError(patientError, { table: "patients", operation: "update" });
    }
  },
};
