import React from "react";
import { Compare } from "./ui/compare";
import { Sparkles, ShieldCheck } from "lucide-react";

export function CompareDemo() {
  return (
    <section className="bg-[#f6f3f1] border border-[#cecac8] rounded-[40px] p-6 sm:p-10 space-y-6 text-[#242424] font-mono shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#cecac8] pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#cfdaf5] border border-[#2b59d1]/30 text-[10px] font-mono font-medium uppercase tracking-wider text-[#2b59d1]">
            <Sparkles className="w-3.5 h-3.5 text-[#2b59d1]" />
            <span>Aceternity UI Visual Comparison Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#242424]">
            Interactive Resolution Comparison
          </h2>
          <p className="text-xs text-[#797776] font-mono uppercase tracking-wider">
            Hover or drag the slider below to compare reported civic defects vs completed municipal team repairs.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#2b59d1] bg-white px-4 py-2 rounded-full border border-[#cecac8]">
          <ShieldCheck className="w-4 h-4 text-[#2b59d1]" />
          <span>Interactive Hover Comparison</span>
        </div>
      </div>

      <div className="p-4 border rounded-3xl bg-white border-[#cecac8] max-w-4xl mx-auto flex items-center justify-center">
        <Compare
          firstImage="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80"
          secondImage="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80"
          firstImageClassName="object-cover object-center"
          secondImageClassname="object-cover object-center"
          className="h-[300px] w-full md:h-[450px] md:w-[750px] rounded-2xl"
          slideMode="hover"
        />
      </div>
    </section>
  );
}
