import React, { useState } from "react";
import { MessageSquare, X, Send, ChevronDown, LifeBuoy } from "lucide-react";
import { useToast } from "../hooks/useToast";

type Ticket = { name: string; email: string; message: string; submitted: boolean };

export const ChatWidget: React.FC = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [ticket, setTicket] = useState<Ticket>({ name: "", email: "", message: "", submitted: false });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket.name.trim() || !ticket.message.trim()) return;
    setTicket((t) => ({ ...t, submitted: true }));
    toast({ message: "Support ticket submitted! We'll get back to you shortly.", type: "success" });
  };

  const reset = () => setTicket({ name: "", email: "", message: "", submitted: false });

  return (
    <>
      {/* Floating BMC Support Trigger Button — Stacked above KAISER AI Assistant */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-24 right-6 z-50 px-4 py-3 bg-[#242424] hover:bg-[#000000] text-white font-mono rounded-full shadow-2xl flex items-center gap-2 transition-all duration-300 hover:scale-105 group border border-[#cecac8] cursor-pointer"
          aria-label="Open BMC Support Request"
          title="BMC Human Support Request"
        >
          <LifeBuoy className="w-5 h-5 text-[#cfdaf5] group-hover:rotate-45 transition-transform" />
          <span className="text-xs font-mono font-medium uppercase tracking-wider hidden sm:inline-block">
            BMC Support
          </span>
        </button>
      )}

      {/* Support Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-[#f6f3f1] rounded-[32px] shadow-2xl border border-[#cecac8] overflow-hidden font-mono text-[#242424]">
          {/* Header */}
          <div className="flex items-center gap-2.5 px-5 py-4 bg-[#242424] text-white">
            <LifeBuoy className="w-4 h-4 text-[#cfdaf5]" />
            <div className="flex-1">
              <div className="text-xs font-mono font-medium uppercase tracking-wider text-white">BMC Human Support</div>
              <div className="text-[10px] font-mono text-[#cecac8]">Submit a direct municipal support ticket</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/20 text-[#cecac8] hover:text-white transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            {ticket.submitted ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#2b59d1] flex items-center justify-center mx-auto text-white">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-base font-serif font-normal text-[#242424]">Ticket Submitted!</div>
                <p className="text-xs font-mono text-[#797776]">A BMC representative will contact you within 24 hours.</p>
                <button
                  onClick={reset}
                  className="mt-2 text-xs font-mono text-[#2b59d1] hover:underline uppercase tracking-wider cursor-pointer"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono font-medium uppercase text-[#797776] mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={ticket.name}
                    onChange={(e) => setTicket((t) => ({ ...t, name: e.target.value }))}
                    placeholder="Rahul Sharma"
                    className="w-full text-xs font-mono bg-white border border-[#cecac8] rounded-full px-4 py-2.5 outline-none focus:border-[#2b59d1] text-[#242424]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-medium uppercase text-[#797776] mb-1">Email (optional)</label>
                  <input
                    type="email"
                    value={ticket.email}
                    onChange={(e) => setTicket((t) => ({ ...t, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="w-full text-xs font-mono bg-white border border-[#cecac8] rounded-full px-4 py-2.5 outline-none focus:border-[#2b59d1] text-[#242424]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-medium uppercase text-[#797776] mb-1">Message *</label>
                  <textarea
                    required
                    rows={3}
                    value={ticket.message}
                    onChange={(e) => setTicket((t) => ({ ...t, message: e.target.value }))}
                    placeholder="Describe the issue you need help with…"
                    className="w-full text-xs font-mono bg-white border border-[#cecac8] rounded-[20px] px-4 py-2.5 outline-none focus:border-[#2b59d1] text-[#242424] resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#2b59d1] hover:bg-[#2247ab] text-white text-xs font-mono uppercase tracking-wider rounded-full transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
