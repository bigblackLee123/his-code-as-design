import { Music, Waves } from "lucide-react";

export interface PulseOrbProps {
  active: boolean;
  projectName?: string;
  bpm?: number | null;
}

export function PulseOrb({ active, projectName, bpm }: PulseOrbProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-4 bg-primary-50 rounded-xl border border-primary-100">
      <div className="relative flex items-center justify-center h-20 w-20">
        {active && (
          <>
            <div className="absolute h-20 w-20 rounded-full bg-primary-400 animate-ping opacity-10" />
            <div className="absolute h-16 w-16 rounded-full bg-primary-500 animate-pulse opacity-15" />
          </>
        )}
        <div className="relative h-14 w-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex flex-col items-center justify-center shadow-xl">
          <Music className="h-5 w-5 text-white" aria-hidden="true" />
          {bpm && (
            <span className="text-xs text-primary-200 font-mono leading-none mt-0.5">{bpm}</span>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center gap-0.5">
        {projectName && (
          <span className="text-xs font-medium text-primary-700 leading-tight">{projectName}</span>
        )}
        {active && (
          <div className="flex items-center gap-1 text-primary-500">
            <Waves className="h-3 w-3 animate-pulse" aria-hidden="true" />
            <span className="text-xs leading-tight">播放中</span>
          </div>
        )}
      </div>
    </div>
  );
}
