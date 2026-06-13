import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#E60000]" />
        <p className="text-sm text-[#666666]">Loading...</p>
      </div>
    </div>
  );
}
