import React, { ReactNode } from "react";
import { ThemeType } from "../types";

interface ThemeWrapperProps {
  theme: ThemeType;
  children: ReactNode;
}

export const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ theme, children }) => {
  // Translate theme to specific Tailwind style configurations
  const getThemeStyles = () => {
    switch (theme) {
      case "clover":
        return {
          bgClass: "bg-gradient-to-tr from-[#FAF8ED] via-[#F3E4C9] to-[#E2E6CC]",
          cardClass: "bg-white/80 backdrop-blur-md border-2 border-[#BABF94]/40 shadow-[4px_4px_0px_#BABF94] rounded-2xl",
          textClass: "text-[#4A3E3D]",
          accentBtn: "bg-[#BABF94] hover:bg-[#A3A87D] text-[#333C14] font-medium shadow-[2px_2px_0px_#333C14]",
          secondaryBtn: "bg-[#F3E4C9] hover:bg-[#FAF8ED] text-[#A98B76] border-2 border-[#BFA28C]/30",
          accentColor: "#BABF94"
        };
      case "koi":
        return {
          bgClass: "bg-gradient-to-br from-[#FFF5EE] via-[#FFE4E1] to-[#FFF8DC]",
          cardClass: "bg-white/90 backdrop-blur-sm border-2 border-[#BFA28C]/30 shadow-[0_10px_30px_rgba(244,164,96,0.15)] rounded-3xl",
          textClass: "text-[#5C4033]",
          accentBtn: "bg-gradient-to-r from-[#FF7F50] to-[#FF6347] hover:brightness-105 text-white font-medium shadow-md shadow-coral/20",
          secondaryBtn: "bg-[#FFE4E1]/50 hover:bg-[#FFE4E1] text-[#E9967A] border border-[#FF7F50]/20",
          accentColor: "#FF7F50"
        };
      case "polka":
        return {
          bgClass: "bg-[#F0F4F8] bg-[radial-gradient(#CBD5E1_1.5px,transparent_1.5px)] [background-size:24px_24px]",
          cardClass: "bg-white border-4 border-slate-700 shadow-[8px_8px_0px_rgba(51,65,85,1)] rounded-none",
          textClass: "text-slate-800 font-mono",
          accentBtn: "bg-[#38BDF8] hover:bg-[#0EA5E9] text-slate-900 font-black border-2 border-slate-700 shadow-[2px_2px_0px_rgba(51,65,85,1)]",
          secondaryBtn: "bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-700",
          accentColor: "#38BDF8"
        };
      case "notebook":
        return {
          bgClass: "bg-[#FAF9F6]",
          cardClass: "bg-white border-l-[12px] border-l-red-400 border-2 border-slate-300 shadow-[0_4px_12px_rgba(0,0,0,0.06)] rounded-sm notebook-ruled font-sans",
          textClass: "text-slate-700",
          accentBtn: "bg-slate-800 hover:bg-slate-700 text-[#FAF9F6] font-medium border border-slate-600 rounded-sm",
          secondaryBtn: "bg-[#FAF9F6] hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-sm",
          accentColor: "#F43F5E"
        };
      case "nature":
        return {
          bgClass: "bg-gradient-to-b from-[#E8F0E6] to-[#CBDCC4]",
          cardClass: "bg-stone-50/95 border-2 border-[#8DA47E] shadow-[0_8px_20px_rgba(141,164,126,0.25)] rounded-[2rem]",
          textClass: "text-stone-800",
          accentBtn: "bg-[#8DA47E] hover:bg-[#728765] text-stone-100 font-semibold rounded-full",
          secondaryBtn: "bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 rounded-full",
          accentColor: "#8DA47E"
        };
      case "minimal":
        return {
          bgClass: "bg-[#FBFBFB] text-[#111111]",
          cardClass: "bg-white border border-neutral-200 shadow-sm rounded-lg hover:shadow-md transition-shadow duration-300",
          textClass: "text-neutral-900 font-light",
          accentBtn: "bg-black hover:bg-neutral-800 text-white font-normal rounded-md",
          secondaryBtn: "bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 rounded-md",
          accentColor: "#000000"
        };
      case "cute":
        return {
          bgClass: "bg-gradient-to-tr from-[#E0C3FC] via-[#FCE4EC] to-[#FFF0F5] bg-[size:150%_150%] animate-pulse-slow",
          cardClass: "bg-white/95 border-4 border-[#FF8DA1] shadow-[5px_5px_0px_#FF8DA1] rounded-3xl",
          textClass: "text-[#5E35B1] font-sans",
          accentBtn: "bg-[#FF8DA1] hover:bg-[#FF738B] text-white font-bold rounded-full shadow-[2px_2px_0px_#5E35B1] animate-bounce-slow",
          secondaryBtn: "bg-[#E0C3FC] hover:bg-[#D1A3FC] text-[#5E35B1] font-bold rounded-full shadow-[2px_2px_0px_#5E35B1]",
          accentColor: "#FF8DA1"
        };
      default:
        return {
          bgClass: "bg-gradient-to-br from-[#FAF8ED] via-[#F3E4C9] to-[#E2E6CC]",
          cardClass: "bg-white/85 border border-[#BABF94]/50 shadow-md rounded-2xl",
          textClass: "text-[#4A3E3D]",
          accentBtn: "bg-[#BABF94] hover:bg-[#A3A87D] text-[#333C14]",
          secondaryBtn: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300",
          accentColor: "#BABF94"
        };
    }
  };

  const currentStyle = getThemeStyles();

  return (
    <div className={`min-h-screen w-full relative transition-all duration-700 ease-in-out ${currentStyle.bgClass} overflow-hidden`}>
      {/* 🌪️ Theme Ornaments and Floating Particles Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        
        {/* 🍀 Lucky Clover Ornaments (for Clover & Nature themes) */}
        {(theme === "clover" || theme === "nature") && (
          <>
            <div className="absolute top-[12%] left-[4%] text-4xl clover-sway opacity-20">🍀</div>
            <div className="absolute bottom-[10%] left-[8%] text-5xl clover-sway opacity-15">🍀</div>
            <div className="absolute top-[35%] right-[5%] text-4xl clover-sway opacity-20">🍀</div>
            <div className="absolute top-[80%] right-[10%] text-6xl clover-sway opacity-10">🍀</div>
            <div className="absolute top-[60%] left-[25%] text-2xl clover-sway opacity-30 animate-bounce">🌱</div>
          </>
        )}

        {/* 🐟 Koi Garden Swimming Fish Silhouettes (for Koi & Cute themes) */}
        {(theme === "koi" || theme === "cute") && (
          <>
            <div className="absolute top-[20%] right-[15%] text-8xl koi-swim opacity-15 select-none text-[#FF7F50] dark:opacity-10">🐟</div>
            <div className="absolute bottom-[15%] left-[12%] text-7xl koi-swim opacity-20 text-[#FFF5EE] dark:opacity-5">🐟</div>
            <div className="absolute top-[65%] left-[45%] text-6xl koi-swim opacity-10 text-[#FF6347]">🐟</div>
          </>
        )}

        {/* 🌿 Falling Leaves & Nature Ornaments */}
        {theme === "nature" && (
          <>
            <div className="absolute top-[15%] left-[20%] text-3xl opacity-20 animate-wiggle">🌿</div>
            <div className="absolute bottom-[30%] right-[12%] text-4xl opacity-15">🍂</div>
            <div className="absolute top-[45%] left-[5%] text-4xl opacity-25">🍃</div>
          </>
        )}

        {/* ✨ Floating Particles for Cute, Koi & minimal */}
        {(theme === "cute" || theme === "minimal" || theme === "clover") && (
          <>
            <div className="absolute top-[25%] left-[30%] w-3 h-3 bg-white rounded-full opacity-60 particle-float"></div>
            <div className="absolute top-[75%] left-[15%] w-2 h-2 bg-[#BABF94] rounded-full opacity-50 particle-float" style={{ animationDelay: "2s" }}></div>
            <div className="absolute top-[40%] right-[25%] w-4 h-4 bg-[#FF8DA1] rounded-full opacity-30 particle-float" style={{ animationDelay: "4s" }}></div>
            <div className="absolute bottom-[20%] right-[30%] w-2 h-2 bg-yellow-200 rounded-full opacity-60 particle-float" style={{ animationDelay: "1s" }}></div>
          </>
        )}

        {/* 🎀 Sticker aesthetic for Cute Gen Z theme */}
        {theme === "cute" && (
          <>
            <div className="absolute top-[5%] left-[8%] text-5xl opacity-45 rotate-12">💖</div>
            <div className="absolute bottom-[8%] right-[5%] text-5xl opacity-35 -rotate-12">⭐</div>
            <div className="absolute top-[45%] right-[2%] text-4xl opacity-40">🍼</div>
            <div className="absolute top-[82%] left-[18%] text-5xl opacity-35 rotate-45">✨</div>
          </>
        )}

        {/* 📓 Ruled Notebook Grid decoration header */}
        {theme === "notebook" && (
          <div className="absolute top-0 left-[8%] right-0 h-full border-l border-red-300/40 pointer-events-none"></div>
        )}
      </div>

      {/* 🚀 Render primary app children container */}
      <div className="relative z-10 w-full h-full min-h-screen">
        {children}
      </div>
    </div>
  );
};
