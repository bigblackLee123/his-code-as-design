import { waitingQueueService } from "./waitingQueueService";
import { treatmentQueueService } from "./treatmentQueueService";

/** 合并导出，消费端 import { queueService } 零改动 */
export const queueService = {
  ...waitingQueueService,
  ...treatmentQueueService,
};
