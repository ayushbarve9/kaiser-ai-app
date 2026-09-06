import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { 
  Camera, ShieldCheck, Clock, CheckCircle2, 
  MapPin, Sparkles, ArrowRight, Building2, 
  ChevronRight, ChevronLeft, Activity, Zap, Play, Pause
} from "lucide-react";

interface StepData {
  id: string;
  stepNumber: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  highlightMetric: string;
  highlightLabel: string;
  icon: any;
  color: string;
  actionText: string;
  actionLink: string;
  visualPreview: {
    type: "camera" | "radar" | "sla" | "resolved";
    headerText: string;
    subText: string;
  };
}

const STEPS: StepData[] = [
  {
    id: "step-1",
    stepNumber: "01",
    badge: "AI Image Verification",
    title: "Citizen Photographic Capture",
    subtitle: "Real-Time Geotag & EXIF Tamper Validation",
    description: "Snap a photo of any pothole, broken streetlight, or drainage overflow. Our neural network immediately verifies GPS coordinates, prevents duplicate tickets, and flags safety severity.",
    highlightMetric: "< 1.2s",
    highlightLabel: "AI Classification Time",
    icon: Camera,
    color: "#659a77",
    actionText: "File Grievance Now",
    actionLink: "/report",
    visualPreview: {
      type: "camera",
      headerText: "AI Vision Scanner Active",
      subText: "Geotag: 19.0596° N, 72.8295° E • Ward H-West",
    },
  },
  {
    id: "step-2",
    stepNumber: "02",
    badge: "Automated Ward Routing",
    title: "Instant 24-Ward Executive Triaging",
    subtitle: "Direct Dispatch to Assistant Municipal Commissioners",
    description: "Bypasses bureaucratic delays. The issue is assigned straight to the designated Ward Executive Engineer and pre-approved contractor repair squad within 120 minutes.",
    highlightMetric: "100%",
    highlightLabel: "Geotagged Accuracy",
    icon: Building2,
    color: "#517b60",
    actionText: "Explore Ward Directory",
    actionLink: "/officers",
    visualPreview: {
      type: "radar",
      headerText: "Ward Executive Dispatch Console",
      subText: "Dispatched to Field Squad #14 (Bandra West)",
    },
  },
  {
    id: "step-3",
    stepNumber: "03",
    badge: "Guaranteed SLA Countdown",
    title: "Real-Time Repair Squad Tracking",
    subtitle: "Legally Mandated Public Service Guarantee",
    description: "Under the Maharashtra Right to Public Services Act, critical hazards trigger an automatic 24-48h resolution SLA countdown monitored live by civic administrators.",
    highlightMetric: "24h - 48h",
    highlightLabel: "Mandated Redressal SLA",
    icon: Clock,
    color: "#3c5d48",
    actionText: "Check Priority Queue",
    actionLink: "/top10",
    visualPreview: {
      type: "sla",
      headerText: "SLA Resolution Countdown Active",
      subText: "Status: Contractor Unit On-Site with Bitumen Paver",
    },
  },
  {
    id: "step-4",
    stepNumber: "04",
    badge: "Verified Civic Closure",
    title: "Photo Proof & Citizen Verification",
    subtitle: "Transparent Resolution with Before / After Evidence",
    description: "Before a ticket can be closed, field squads must upload geotagged completion proof. Citizens receive automated SMS and email notifications with verifiable before/after photos.",
    highlightMetric: "96.4%",
    highlightLabel: "Citizen Satisfaction Rate",
    icon: CheckCircle2,
    color: "#283e30",
    actionText: "Browse Resolved Tickets",
    actionLink: "/dashboard?status=Resolved",
    visualPreview: {
      type: "resolved",
      headerText: "Resolution Verified & Signed",
      subText: "Verified by Assistant Commissioner • Closed",
    },
  },
];

export const InteractiveScrollShowcase: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  // Auto cycle timer
  useEffect(() => {
    if (!isPlaying) return;

    const interval = 50; // ms
    const stepDuration = 5000; // 5s per step
    const stepIncrement = (interval / stepDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveStep((curr) => (curr + 1) % STEPS.length);
          return 0;
        }
        return prev + stepIncrement;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, activeStep]);

  const selectStep = (idx: number) => {
    setActiveStep(idx);
    setProgress(0);
  };

  const nextStep = () => {
    setActiveStep((curr) => (curr + 1) % STEPS.length);
    setProgress(0);
  };

  const prevStep = () => {
    setActiveStep((curr) => (curr - 1 + STEPS.length) % STEPS.length);
    setProgress(0);
  };

  const currentStepData = STEPS[activeStep];
  const StepIcon = currentStepData.icon;

  return (
    <section className="relative w-full rounded-3xl bg-evergreen-950 text-white border border-evergreen-800 shadow-xl overflow-hidden p-6 sm:p-8 lg:p-10">
      
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none opacity-30 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-evergreen-600/30 blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-emerald-600/20 blur-[100px]" />
      </div>

      <div className="relative z-10 space-y-6">
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-evergreen-800/80 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-evergreen-800/60 border border-evergreen-700 text-evergreen-200 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-evergreen-300" />
              <span>Interactive Civic Pipeline</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white mt-1.5 tracking-tight">
              How CivicConnect Resolves Grievances
            </h2>
            <p className="text-xs sm:text-sm text-evergreen-300/80 mt-0.5 max-w-xl">
              Inspect the 4-phase end-to-end redressal process from citizen camera capture to verified field closure.
            </p>
          </div>

          {/* Player controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? "Pause Auto-play" : "Resume Auto-play"}
              className="p-2 bg-evergreen-900/80 hover:bg-evergreen-800 border border-evergreen-700 text-evergreen-200 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              <span className="hidden md:inline">{isPlaying ? "Pause" : "Play"}</span>
            </button>
            <button
              onClick={prevStep}
              aria-label="Previous step"
              className="p-2 bg-evergreen-900/80 hover:bg-evergreen-800 border border-evergreen-700 text-evergreen-200 rounded-xl transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextStep}
              aria-label="Next step"
              className="p-2 bg-evergreen-900/80 hover:bg-evergreen-800 border border-evergreen-700 text-evergreen-200 rounded-xl transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4-Step Interactive Pill Navigation */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {STEPS.map((step, idx) => {
            const isActive = idx === activeStep;
            return (
              <button
                key={step.id}
                onClick={() => selectStep(idx)}
                className={`relative p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer overflow-hidden ${
                  isActive
                    ? "bg-evergreen-800/90 border-evergreen-400 text-white shadow-md scale-[1.01]"
                    : "bg-evergreen-900/40 border-evergreen-800/60 text-evergreen-400 hover:bg-evergreen-800/40 hover:text-evergreen-200"
                }`}
              >
                {/* Active Progress Track */}
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-evergreen-950">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 to-evergreen-300 transition-all duration-75"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
                <div className="flex items-center justify-between gap-1 pt-0.5">
                  <span className="text-[10px] font-mono font-black uppercase text-evergreen-400">
                    Phase {step.stepNumber}
                  </span>
                  {isActive && <Zap className="w-3 h-3 text-evergreen-300" />}
                </div>
                <div className="text-xs font-extrabold truncate mt-0.5 text-white">
                  {step.badge}
                </div>
              </button>
            );
          })}
        </div>

        {/* Center Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
          
          {/* Left: Narrative Description */}
          <div className="lg:col-span-6 space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStepData.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0"
                    style={{ backgroundColor: currentStepData.color }}
                  >
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-evergreen-400">
                      Step {currentStepData.stepNumber} &bull; {currentStepData.badge}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                      {currentStepData.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-evergreen-200/90 leading-relaxed font-normal">
                  {currentStepData.description}
                </p>

                {/* Key Metric Card */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-evergreen-900/60 border border-evergreen-700/60 backdrop-blur-sm">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-evergreen-400 block tracking-wider">
                      Key Benchmark
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block">
                      {currentStepData.highlightMetric}
                    </span>
                    <span className="text-[10px] text-evergreen-300 block">
                      {currentStepData.highlightLabel}
                    </span>
                  </div>
                  <div className="border-l border-evergreen-800 pl-3 flex flex-col justify-center">
                    <span className="text-[10px] uppercase font-bold text-evergreen-400 block tracking-wider">
                      Target Authority
                    </span>
                    <span className="text-xs font-bold text-white mt-0.5">
                      BMC 24 Ward Control
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Live Redressal Active
                    </span>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-1">
                  <Link
                    to={currentStepData.actionLink}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-evergreen-600 hover:bg-evergreen-500 text-white text-xs font-black shadow-md transition-all active:scale-95"
                  >
                    <span>{currentStepData.actionText}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Stage Visual Simulator */}
          <div className="lg:col-span-6 bg-gradient-to-br from-evergreen-900/80 to-evergreen-950/90 rounded-2xl border border-evergreen-700 p-5 shadow-xl space-y-4">
            {/* Top Mock Window Bar */}
            <div className="flex items-center justify-between border-b border-evergreen-800/80 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                <span className="text-[10px] font-mono text-evergreen-400 ml-1">
                  civicconnect.live // {currentStepData.visualPreview.headerText}
                </span>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-evergreen-800 text-evergreen-200">
                PHASE {currentStepData.stepNumber}
              </span>
            </div>

            {/* Visual Screens */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`screen-${currentStepData.id}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
              >
                {currentStepData.visualPreview.type === "camera" && (
                  <div className="space-y-3">
                    <div className="relative rounded-xl overflow-hidden border border-evergreen-600 h-44 bg-slate-900 flex items-center justify-center">
                      <img
                        src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"
                        alt="Road repair scan"
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-4 border-2 border-dashed border-emerald-400 rounded-lg pointer-events-none flex flex-col justify-between p-2.5">
                        <div className="flex items-center justify-between text-[9px] font-mono bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-emerald-300">
                          <span>AI HAZARD DETECTED: POTHOLE (87%)</span>
                          <span>HIGH PRIORITY</span>
                        </div>
                        <div className="text-[9px] font-mono bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-white flex items-center gap-1 self-start">
                          <MapPin className="w-3 h-3 text-rose-400" />
                          <span>19.0596° N, 72.8295° E</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-[11px] text-evergreen-300 flex items-center justify-between font-mono bg-evergreen-900/80 p-2.5 rounded-xl border border-evergreen-800">
                      <span>GPS Accuracy: ± 2.4m</span>
                      <span className="text-emerald-400 font-bold">Tamper Verified ✓</span>
                    </div>
                  </div>
                )}

                {currentStepData.visualPreview.type === "radar" && (
                  <div className="space-y-3">
                    <div className="relative rounded-xl overflow-hidden border border-evergreen-600 h-44 bg-evergreen-900/90 flex flex-col justify-between p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                          <span className="text-xs font-bold text-white">Ward H-West Dispatch Channel</span>
                        </div>
                        <span className="text-[10px] font-mono bg-evergreen-800 text-evergreen-200 px-2 py-0.5 rounded">
                          AMC S. Sharma
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="p-2.5 rounded-xl bg-evergreen-950 border border-evergreen-700/80">
                          <span className="text-[9px] text-evergreen-400 block font-semibold">Allocated Unit</span>
                          <span className="text-[11px] font-black text-white mt-0.5 block">Rapid Repair Squad 04</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-evergreen-950 border border-evergreen-700/80">
                          <span className="text-[9px] text-evergreen-400 block font-semibold">Response Time</span>
                          <span className="text-[11px] font-black text-emerald-400 mt-0.5 block">1h 14m Assigned</span>
                        </div>
                      </div>

                      <div className="text-[10px] text-evergreen-300 font-medium truncate">
                        {currentStepData.visualPreview.subText}
                      </div>
                    </div>
                  </div>
                )}

                {currentStepData.visualPreview.type === "sla" && (
                  <div className="space-y-3">
                    <div className="relative rounded-xl overflow-hidden border border-evergreen-600 h-44 bg-evergreen-900/90 flex flex-col items-center justify-center p-4 text-center space-y-2">
                      <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
                        <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: "8s" }} />
                      </div>
                      <div>
                        <div className="text-2xl font-black text-amber-300 font-mono tracking-wider">
                          23h : 41m : 18s
                        </div>
                        <span className="text-[10px] text-evergreen-300 font-semibold block mt-0.5">
                          Remaining in Mandated 48h Resolution Window
                        </span>
                      </div>
                      <div className="w-full bg-evergreen-950 rounded-full h-1.5 overflow-hidden border border-evergreen-800">
                        <div className="bg-gradient-to-r from-emerald-400 to-amber-400 h-full w-[65%]" />
                      </div>
                    </div>
                  </div>
                )}

                {currentStepData.visualPreview.type === "resolved" && (
                  <div className="space-y-3">
                    <div className="relative rounded-xl overflow-hidden border border-emerald-500 h-44 bg-slate-900 flex items-center justify-center">
                      <img
                        src="https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80"
                        alt="Completed resurfacing"
                        className="w-full h-full object-cover opacity-85"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex flex-col justify-between p-3.5">
                        <div className="self-end bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Resolution Certified</span>
                        </div>
                        <div className="text-xs text-white">
                          <p className="font-extrabold text-xs sm:text-sm">Resurfacing Completed</p>
                          <p className="text-[9px] text-emerald-300">Proof uploaded by Engineer &bull; Notification dispatched</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
