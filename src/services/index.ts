const useMock = import.meta.env.VITE_USE_MOCK === "true";

export const {
  patientService,
  queueService,
  prescriptionService,
  scaleService,
  contraindicationService,
  aiService,
  therapyService,
  symptomService,
} = useMock
  ? await import("./mock")
  : await import("./supabase");
