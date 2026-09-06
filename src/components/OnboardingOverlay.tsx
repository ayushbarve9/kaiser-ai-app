import React, { useState, useEffect } from "react";
import { MapPin, FileText, BarChart2, ShieldCheck, ArrowRight, X, CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    icon: FileText,
    color: "bg-red-600",
    title: "Report Civic Issues",
    desc: "Photograph a pothole, leaking pipe, garbage dump or broken streetlight and submit it in under 60 seconds. AI auto-classifies severity and routes it to the correct BMC department.",
  },
  {
    icon: MapPin,
    color: "bg-slate-800",
    title: "Live Ward Map",
    desc: "See every open complaint plotted on Mumbai's 24-ward map in real time. Filter by category, urgency or ward to spot patterns across the city.",
  },
  {
    icon: BarChart2,
    color: "bg-red-600",
    title: "Live Analytics Dashboard",
    desc: "Track resolution rates, SLA compliance, ward-level performance and category breakdowns — updated live as BMC field teams resolve issues.",
  },
  {
    icon: ShieldCheck,
    color: "bg-slate-800",
    title: "Officer Control Room",
    desc: "Ward officers can log in to assign, escalate and close complaints, attach resolution photos and send automated email notifications to reporters.",
  },
];

const STORAGE_KEY = "civicconnect_onboarded_v1";

export const OnboardingOverlay: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      // Small delay so the app renders first
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      localStorage.setItem(STORAGE_KEY, "1");
    }, 300);
  };

  if (!visible) return null;

  const current = STEPS[step];
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-300 ${
        exiting ? "opacity-0" : "opacity-100"
      }`}
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
    >
      <div
        className={`relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${
          exiting ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* Progress bar */}
        <div className="h-1 bg-slate-100 w-full">
          <div
            className="h-1 bg-red-600 transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-slate-500" />
        </button>

        <div className="p-8 space-y-6">
          {/* Icon */}
          <div className={`w-14 h-14 rounded-2xl ${current.color} flex items-center justify-center shadow-lg`}>
            <Icon className="w-7 h-7 text-white" />
          </div>

          {/* Step counter */}
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? "bg-red-600 w-6" : i < step ? "bg-red-300 w-3" : "bg-slate-200 w-3"
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h2 className="text-xl font-black text-slate-900 leading-tight">{current.title}</h2>
            <p className="text-sm text-slate-500 leading-relaxed">{current.desc}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={dismiss}
              className="text-xs text-slate-400 hover:text-slate-600 transition"
            >
              Skip tour
            </button>

            <button
              onClick={() => (isLast ? dismiss() : setStep((s) => s + 1))}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition shadow-sm shadow-red-200"
            >
              {isLast ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Get Started</span>
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
