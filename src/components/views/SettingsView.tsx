import React, { useState } from "react";
import { ThemeType } from "../../types";
import { Sparkles, Palette, ShieldAlert, Key, Server, RefreshCw } from "lucide-react";

interface SettingsViewProps {
  currentTheme: ThemeType;
  onThemeChanged: (theme: ThemeType) => void;
  accentBtn: string;
}

const THEME_LISTS: { id: ThemeType; label: string; icon: string; desc: string }[] = [
  { id: "clover", label: "Lucky Clover 🍀", icon: "🍀", desc: "Suasana nyaman bernuansa semanggi hijau sage dan krem hangat." },
  { id: "koi", label: "Koi Garden 🐟", icon: "🐟", desc: "Estetika tenang bernuansa jingga kemerahan dengan ornamen ikan koi berenang." },
  { id: "polka", label: "Polka Dot ⚪", icon: "⚪", desc: "Desain retro polkadot yang asyik dengan kartu bersudut tegas." },
  { id: "notebook", label: "Notebook 📓", icon: "📓", desc: "Tampilan kertas catatan bergaris dengan binder merah lucu di sisi kiri." },
  { id: "nature", label: "Soft Nature 🌿", icon: "🌿", desc: "Nuansa pepohonan damai dengan tombol melingkar hijau botani." },
  { id: "minimal", label: "Minimalist ✨", icon: "✨", desc: "Gaya monokromatis modern bersiluet tipis, mengedepankan kelapangan ruang." },
  { id: "cute", label: "Cute Gen Z 🎀", icon: "🎀", desc: "Warna pastel ungu-merah muda menggemaskan dilengkapi hiasan bintang berkilau." }
];

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentTheme, onThemeChanged, accentBtn
}) => {
  const [supabaseUrl, setSupabaseUrl] = useState(localStorage.getItem("melotalk_supabase_url") || "");
  const [supabaseKey, setSupabaseKey] = useState(localStorage.getItem("melotalk_supabase_key") || "");
  const [saveNotify, setSaveNotify] = useState(false);

  const handleSaveConfigs = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("melotalk_supabase_url", supabaseUrl);
    localStorage.setItem("melotalk_supabase_key", supabaseKey);
    setSaveNotify(true);
    setTimeout(() => setSaveNotify(false), 3000);
  };

  const handleClearHistory = () => {
    if (confirm("Apakah kamu yakin ingin mereset seluruh histori latihan dan kemajuan semanggi di MeloTalk? Tindakan ini tidak dapat dibatalkan.")) {
      localStorage.removeItem("melotalk_auth_session");
      // Clear IndexedDB completely
      const req = indexedDB.deleteDatabase("MeloTalkDB");
      req.onsuccess = () => {
        window.location.reload();
      };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in p-1">
      
      {/* ⚙️ Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-1">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center space-x-1.5">
          <span>⚙️ Custom Settings & Integrations</span>
        </h2>
        <p className="text-xs text-slate-400">Atur visualisasi aplikasimu! Ganti tema visual yang mengubah seluruh tata letak komponen secara dramatis, atau sambungkan database cloud Supabase milikmu.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* 🎨 LEFT: Theme switcher (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1.5 border-b pb-2">
            <Palette className="w-4 h-4 text-amber-600" />
            <span>Pilih Tema Visual MeloTalk</span>
          </h3>

          <div className="grid grid-cols-1 gap-3.5">
            {THEME_LISTS.map((theme) => (
              <button
                key={theme.id}
                onClick={() => onThemeChanged(theme.id)}
                className={`p-4 rounded-2xl text-left border-2 transition-all flex items-start gap-4 ${
                  currentTheme === theme.id 
                    ? "bg-[#FAF8ED] border-amber-500 shadow-sm scale-[1.01]" 
                    : "bg-white hover:bg-slate-50 border-slate-100"
                }`}
              >
                <span className="text-4xl p-2 bg-white rounded-2xl shadow-inner select-none leading-none">
                  {theme.icon}
                </span>
                
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-850 uppercase tracking-wider">{theme.label}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{theme.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 🔌 RIGHT: Supabase configuration & Reset system (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Supabase Client Integration Form */}
          <form onSubmit={handleSaveConfigs} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-700 flex items-center gap-1.5 border-b pb-2">
              <Server className="w-4 h-4 text-indigo-500" />
              <span>Koneksi Database Supabase</span>
            </h3>

            <p className="text-[11px] text-slate-400 leading-relaxed font-sans mt-1">
              Hubungkan database Supabase-mu untuk menyimpan data rekaman audio secara permanen di cloud! Jika dibiarkan kosong, MeloTalk akan menyimpan data dengan sangat andal di IndexedDB database browser lokalmu.
            </p>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Supabase URL</label>
                <input
                  type="text"
                  placeholder="https://your-project.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 bg-[#FAF9F6] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#BABF94]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Supabase Anon Key</label>
                <input
                  type="password"
                  placeholder="eyJhIjo..."
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 bg-[#FAF9F6] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#BABF94]"
                />
              </div>
            </div>

            {saveNotify && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px] rounded-xl">
                Kredensial Supabase berhasil disimpan secara lokal! 🍀
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-2 rounded-xl text-xs font-bold ${accentBtn}`}
            >
              Simpan Kredensial Database
            </button>
          </form>

          {/* Destructive Clear stats section */}
          <div className="bg-red-50/50 p-5 rounded-2xl border border-red-200/40 space-y-2">
            <h4 className="text-xs font-bold text-red-800 flex items-center gap-1">
              <ShieldAlert className="w-4 h-4" />
              <span>Hapus & Reset Aplikasi</span>
            </h4>
            <p className="text-[11px] text-slate-550 leading-relaxed font-sans">
              Menghapus seluruh progress latihan bicaramu, koleksi tabungan kosakata, daily streaks, dan mereset profil ke status baru dasar (A1).
            </p>
            <button
              onClick={handleClearHistory}
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition"
            >
              Reset Semua Progress
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
