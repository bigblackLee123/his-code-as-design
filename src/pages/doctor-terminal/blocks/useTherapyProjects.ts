import { useState, useEffect } from "react";
import { therapyService } from "@/services";
import type { TherapyProject } from "@/services/types";

export function useTherapyProjects() {
  const [allProjects, setAllProjects] = useState<TherapyProject[]>([]);

  useEffect(() => {
    therapyService.getProjects().then(setAllProjects);
  }, []);

  return { allProjects };
}
