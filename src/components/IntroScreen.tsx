import React from 'react';
import { Play, ShieldAlert, Sparkles, Volume2, VolumeX, Flashlight, Clock, Zap } from 'lucide-react';

interface IntroScreenProps {
  onStartGame: () => void;
  soundMuted: boolean;
  onToggleSound: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  onStartGame,
  soundMuted,
  onToggleSound,
}) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[#050505] text-white overflow-hidden select-none">
      {/* Background eerie subtle radial gradient and high-tech grid points */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(80,15,22,0.3)_0%,rgba(5,5,5,0.98)_70%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:36px_36px] pointer-events-none" />

      {/* Spooky Sound Controls Header */}
      <div className="absolute top-4 right-4 z-20">
        <button
          id="btn-intro-sound-toggle"
          onClick={onToggleSound}
          aria-label={soundMuted ? 'เปิดเสียงเกม' : 'ปิดเสียงเกม'}
          className="p-2.5 bg-[#121215]/90 hover:bg-[#1a1a20] border border-neutral-800 hover:border-neutral-700 rounded-xl text-neutral-300 hover:text-white transition-all flex items-center gap-2 text-xs font-kanit cursor-pointer active:scale-95 shadow-xl backdrop-blur-md"
        >
          {soundMuted ? <VolumeX className="w-4 h-4 text-neutral-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          <span>{soundMuted ? 'เสียง: ปิด' : 'เสียง: เปิด'}</span>
        </button>
      </div>

      {/* Main Intro Card */}
      <div className="relative z-10 max-w-xl w-full text-center flex flex-col items-center">
        {/* Horror Eerie Icon */}
        <div className="relative mb-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-b from-rose-950/80 to-[#0e0e11] border border-rose-600/60 flex items-center justify-center shadow-[0_0_35px_rgba(244,63,94,0.4)] animate-blood-pulse">
            <span className="text-4xl sm:text-5xl">🗝️</span>
          </div>
          <span className="absolute -top-2 -right-2 text-2xl animate-bounce">🩸</span>
        </div>

        {/* Title & Subtitle */}
        <h1 className="font-creepster tracking-wider text-4xl sm:text-6xl text-rose-500 drop-shadow-[0_0_20px_rgba(244,63,94,0.7)] leading-none mb-1">
          ESCAPE THE CURSED ROOM
        </h1>
        <div className="font-nosifer text-lg sm:text-2xl text-rose-400 tracking-widest mb-4 opacity-90">
          - BLACKOUT -
        </div>

        {/* Description & Lore */}
        <p className="font-kanit text-xs sm:text-sm text-neutral-300 max-w-md mb-6 leading-relaxed bg-[#0c0c0f]/80 p-4 sm:p-5 rounded-2xl border border-white/5 backdrop-blur-md shadow-2xl shadow-black/80">
          คุณตื่นขึ้นมาในห้องขังต้องสาปที่มืดสนิท... ประตูเหล็กถูกล็อคด้วยรหัสปริศนา 3 หลัก 
          จงใช้ไฟฉายส่องค้นหา <span className="text-amber-300 font-semibold">📜 คัมภีร์</span>, <span className="text-amber-300 font-semibold">🖼️ กรอบรูป</span>, และ <span className="text-rose-400 font-semibold">🩸 รอยเลือด</span> 
          เพื่อถอดรหัสสมการคณิตศาสตร์แล้วหนีออกไปก่อนไฟฉายหรือเวลาจะหมดลง!
        </p>

        {/* Quick Rules Pills */}
        <div className="grid grid-cols-3 gap-2.5 w-full max-w-md mb-7 text-xs font-kanit">
          <div className="bg-[#0e0e12]/90 border border-neutral-800/90 p-3 rounded-xl flex flex-col items-center shadow-lg">
            <Clock className="w-4 h-4 text-rose-400 mb-1" />
            <span className="text-neutral-400 text-[10px]">เวลาจำกัด</span>
            <span className="font-bold text-white">60 วินาที</span>
          </div>
          <div className="bg-[#0e0e12]/90 border border-neutral-800/90 p-3 rounded-xl flex flex-col items-center shadow-lg">
            <Zap className="w-4 h-4 text-amber-400 mb-1" />
            <span className="text-neutral-400 text-[10px]">ไฟฉายกินแบต</span>
            <span className="font-bold text-amber-300">5% / วินาที</span>
          </div>
          <div className="bg-[#0e0e12]/90 border border-neutral-800/90 p-3 rounded-xl flex flex-col items-center shadow-lg">
            <Flashlight className="w-4 h-4 text-purple-400 mb-1" />
            <span className="text-neutral-400 text-[10px]">ควบคุมไฟฉาย</span>
            <span className="font-bold text-purple-300">ปุ่ม / Spacebar</span>
          </div>
        </div>

        {/* Enter the Room Main Action Button */}
        <button
          id="btn-enter-the-room"
          onClick={onStartGame}
          className="group relative w-full max-w-md py-3.5 sm:py-4.5 px-6 bg-gradient-to-r from-rose-700 via-red-600 to-rose-700 hover:from-rose-600 hover:via-red-500 hover:to-rose-600 text-white font-kanit font-black text-base sm:text-xl rounded-2xl shadow-[0_0_35px_rgba(244,63,94,0.6)] hover:shadow-[0_0_50px_rgba(244,63,94,0.85)] border border-rose-400/40 transition-all duration-300 flex items-center justify-center gap-2.5 sm:gap-3 cursor-pointer active:scale-95 touch-manipulation min-h-[48px]"
        >
          <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-white group-hover:scale-110 transition-transform" />
          <span>Enter the Room (เข้าสู่ห้องสาป)</span>
        </button>

        <p className="text-[11px] font-kanit text-neutral-500 mt-4">
          💡 แนะนำให้เปิดเสียงเพื่อเพิ่มอรรถรสความตื่นเต้นสยองขวัญแบบ 100%
        </p>
      </div>
    </div>
  );
};
