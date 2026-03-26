/** Mock consultationHelper — 内存模拟 consultation 生命周期 */

const activeConsultations = new Map<string, string>(); // patientId → consultationId
let counter = 0;

export const consultationHelper = {
  async create(patientId: string): Promise<string> {
    const id = `mock-consult-${++counter}`;
    activeConsultations.set(patientId, id);
    return id;
  },

  async getActiveId(patientId: string): Promise<string> {
    const existing = activeConsultations.get(patientId);
    if (existing) return existing;
    return this.create(patientId);
  },

  async complete(consultationId: string): Promise<void> {
    for (const [pid, cid] of activeConsultations) {
      if (cid === consultationId) {
        activeConsultations.delete(pid);
        break;
      }
    }
  },
};
