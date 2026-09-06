import React, { useState } from "react";
import { 
  PhoneCall, ShieldAlert, AlertTriangle, MapPin, Copy, Check, 
  X, Flame, HeartPulse, Shield, Siren, ExternalLink
} from "lucide-react";

export const EmergencySOSModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);

  const emergencyContacts = [
    {
      title: "BMC Disaster Control Room",
      number: "1916",
      desc: "Flood, Tree Fall, Landslide, Water Main Burst",
      icon: Siren,
      bg: "bg-red-600 text-white",
    },
    {
      title: "Mumbai Fire Brigade",
      number: "101",
      desc: "Fire Outbreak, Cylinder Blast, Rescue Ops",
      icon: Flame,
      bg: "bg-red-700 text-white",
    },
    {
      title: "Emergency Ambulance & Trauma",
      number: "108",
      desc: "Medical Emergencies & Critical Care Transit",
      icon: HeartPulse,
      bg: "bg-red-600 text-white",
    },
    {
      title: "Mumbai Police Control Room",
      number: "100 / 112",
      desc: "Law & Order, Road Hazard, Emergency Dispatch",
      icon: Shield,
      bg: "bg-slate-900 text-white",
    },
    {
      title: "Women's Helpline (Mumbai)",
      number: "1090",
      desc: "24x7 Transit Safety & Crisis Assistance",
      icon: ShieldAlert,
      bg: "bg-slate-900 text-white",
    },
  ];

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocating(false);
      },
      (err) => {
        console.error("GPS error", err);
        // Fallback to Mumbai BMC HQ coordinates
        setUserLocation({ lat: 18.9401, lng: 72.8347 });
        setLocating(false);
      }
    );
  };

  const handleCopyCoords = () => {
    if (!userLocation) return;
    const text = `EMERGENCY LOCATION: Latitude ${userLocation.lat.toFixed(6)}, Longitude ${userLocation.lng.toFixed(6)} (Mumbai) https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}`;
    navigator.clipboard.writeText(text);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 3000);
  };

  return (
    <>
      {/* Floating Red SOS Trigger Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-4 py-3 rounded-full shadow-xl shadow-red-600/30 transition-all active:scale-95 cursor-pointer border-2 border-white"
          title="Mumbai Emergency Speed Dial & SOS"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping absolute -top-1 -right-1" />
          <Siren className="w-4 h-4 animate-bounce" />
          <span className="tracking-wider uppercase">SOS Emergency 1916</span>
        </button>
      </div>

      {/* Emergency Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white max-w-lg w-full rounded-3xl border-2 border-red-600 shadow-2xl overflow-hidden space-y-5 p-6 animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/25 shrink-0">
                  <Siren className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    Mumbai Civic Emergency Helpline
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Direct dispatch hotlines • Available 24x7 toll-free
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* GPS Rapid Dispatch Locator */}
            <div className="p-3.5 bg-slate-900 text-white rounded-2xl space-y-2 border border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-400">
                  <MapPin className="w-4 h-4" />
                  <span>My Incident GPS Coordinates</span>
                </div>
                {!userLocation ? (
                  <button
                    onClick={handleGetLocation}
                    disabled={locating}
                    className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] rounded-lg transition-colors cursor-pointer"
                  >
                    {locating ? "Fetching..." : "Fetch GPS"}
                  </button>
                ) : (
                  <button
                    onClick={handleCopyCoords}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] rounded-lg flex items-center gap-1 transition-colors cursor-pointer border border-slate-700"
                  >
                    {copiedCoords ? <Check className="w-3 h-3 text-red-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCoords ? "Copied!" : "Copy for Dispatch"}</span>
                  </button>
                )}
              </div>

              {userLocation ? (
                <div className="font-mono text-xs text-slate-300 bg-slate-950 p-2 rounded-xl flex items-center justify-between">
                  <span>
                    Lat: {userLocation.lat.toFixed(5)}, Lng: {userLocation.lng.toFixed(5)}
                  </span>
                  <a
                    href={`https://maps.google.com/?q=${userLocation.lat},${userLocation.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-red-400 hover:underline flex items-center gap-1 text-[10px]"
                  >
                    Open Map <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400">
                  Click 'Fetch GPS' to generate exact coordinates to provide to the emergency operator.
                </p>
              )}
            </div>

            {/* Emergency Numbers List */}
            <div className="space-y-2 max-h-[42vh] overflow-y-auto pr-1">
              {emergencyContacts.map((contact) => {
                const Icon = contact.icon;
                return (
                  <div
                    key={contact.number}
                    className="p-3 bg-slate-50 hover:bg-red-50/50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${contact.bg} flex items-center justify-center shrink-0 font-bold shadow-xs`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{contact.title}</div>
                        <div className="text-[10px] text-slate-500">{contact.desc}</div>
                      </div>
                    </div>

                    <a
                      href={`tel:${contact.number.split(" ")[0].replace("/", "")}`}
                      className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-mono font-black text-xs rounded-xl shadow-xs shrink-0 flex items-center gap-1.5 transition-all active:scale-95"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{contact.number}</span>
                    </a>
                  </div>
                );
              })}
            </div>

            {/* Disclaimer */}
            <div className="text-[10px] text-slate-400 text-center pt-1 border-t border-slate-100">
              For civic maintenance (potholes, garbage, streetlights), please use the regular grievance filing portal.
            </div>
          </div>
        </div>
      )}
    </>
  );
};
