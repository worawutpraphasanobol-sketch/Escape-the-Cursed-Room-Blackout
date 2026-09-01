import React from 'react';
import { Trophy, RotateCcw, Zap, Clock, KeyRound, Sparkles } from 'lucide-react';

interface VictoryModalProps {
  isOpen: boolean;
  timeLeft: number;
  batteryLeft: number;
  targetCode: string;
  onPlayAgain: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  timeLeft,
  batteryLeft,
  targetCode,
  onPlayAgain,
}) => {
  if (!isOpen) return null;

  const timeUsed = (60 - timeLeft).toFixed(1);

  return (
    <div
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        id="victory-modal"
        style={{ backgroundColor: '#08140c' }}
        className="relative w-full max-w-md border-2 border-emerald-400 shadow-[0_0_60px_rgba(16,185,129,0.7)] rounded-3xl p-6 sm:p-7 text-white text-center select-none"
      >
        {/* Trophy Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-[#0c2e1b] border-2 border-emerald-400 flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(16,185,129,0.8)]">
          <Trophy className="w-8 h-8 text-emerald-300 animate-bounce drop-shadow-[0_0_10px_rgba(16,185,129,0.9)]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-950 border-2 border-emerald-400 text-emerald-300 text-xs font-kanit font-bold mb-2 shadow-[0_0_15px_rgba(16,185,129,0.5)] text-glow-emerald">
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>ESCAPED SUCCESSFULLY</span>
        </div>

        <h1 className="font-creepster tracking-wider text-4xl text-emerald-400 drop-shadow-[0_0_18px_rgba(16,185,129,0.9)] mb-1 text-glow-emerald">
          YOU ESCAPED!
        </h1>
        <h2 className="font-kanit font-bold text-lg sm:text-xl text-emerald-100 mb-3 text-glow-emerald">
          คุณหนีออกจากห้องต้องสาปสำเร็จ!
        </h2>

        <p className="text-xs sm:text-sm font-kanit text-neutral-100 mb-5 leading-relaxed bg-[#0c1c12] p-4 rounded-2xl border border-emerald-900 font-medium text-crisp">
          เสียงสลักประตูดังปลดล็อค แสงสว่างสาดส่องเข้ามา คุณรอดพ้นจากคำสาป Blackout ได้อย่างหวุดหวิด!
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 bg-[#101018] border border-neutral-700 rounded-2xl p-4 mb-5 shadow-inner">
          {/* Time Used */}
          <div className="flex flex-col items-center">
            <Clock className="w-5 h-5 text-emerald-400 mb-1" />
            <span className="text-xs font-kanit font-semibold text-neutral-200 text-crisp">ใช้เวลาไป</span>
            <span className="font-mono font-black text-lg text-emerald-300 text-glow-emerald">{timeUsed}s</span>
          </div>

          {/* Battery Left */}
          <div className="flex flex-col items-center border-x border-neutral-700">
            <Zap className="w-5 h-5 text-amber-400 mb-1" />
            <span className="text-xs font-kanit font-semibold text-neutral-200 text-crisp">แบตเหลือ</span>
            <span className="font-mono font-black text-lg text-amber-300 text-glow-amber">{Math.round(batteryLeft)}%</span>
          </div>

          {/* Cracked Code */}
          <div className="flex flex-col items-center">
            <KeyRound className="w-5 h-5 text-rose-400 mb-1" />
            <span className="text-xs font-kanit font-semibold text-neutral-200 text-crisp">รหัสผ่าน</span>
            <span className="font-mono font-black text-lg text-rose-300 text-glow-red">{targetCode}</span>
          </div>
        </div>

        {/* Play Again Button */}
        <button
          id="btn-play-again"
          onClick={onPlayAgain}
          className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black rounded-2xl font-kanit font-black text-base shadow-[0_0_30px_rgba(16,185,129,0.8)] border-2 border-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-crisp"
        >
          <RotateCcw className="w-5 h-5" />
          <span>เล่นอีกรอบ (สุ่มปริศนาใหม่)</span>
        </button>
      </div>
    </div>
  );
};
