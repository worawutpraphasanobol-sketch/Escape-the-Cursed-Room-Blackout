import React from 'react';
import { Skull, RotateCcw, AlertOctagon, BatteryWarning, Clock } from 'lucide-react';
import { GameOverReason } from '../types';

interface GameOverModalProps {
  isOpen: boolean;
  reason: GameOverReason;
  targetCode: string;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  reason,
  targetCode,
  onRestart,
}) => {
  if (!isOpen) return null;

  const getReasonDetails = () => {
    switch (reason) {
      case 'battery_empty':
        return {
          icon: <BatteryWarning className="w-8 h-8 text-red-500 animate-pulse" />,
          title: 'BATTERY DEPLETED',
          thaiTitle: 'แบตเตอรี่ไฟฉายหมดสนิท!',
          desc: 'ไฟฉายของคุณดับลงท่ามกลางความมืดมิด เสียงกรีดร้องในเงามืดคืบคลานเข้าหาคุณ...',
        };
      case 'time_up':
        return {
          icon: <Clock className="w-8 h-8 text-red-500 animate-pulse" />,
          title: 'TIME EXPIRED',
          thaiTitle: 'หมดเวลา 60 วินาที!',
          desc: 'คำสาปเวลาหมดลง ห้องถูกผนึกตายตลอดกาล คุณไม่สามารถหนีออกไปได้อีกต่อไป...',
        };
      default:
        return {
          icon: <AlertOctagon className="w-8 h-8 text-red-500 animate-pulse" />,
          title: 'CURSE CONSUMED YOU',
          thaiTitle: 'คำสาปครอบงำ!',
          desc: 'คุณไม่สามารถปลดล็อคประตูได้ทันเวลา...',
        };
    }
  };

  const details = getReasonDetails();

  return (
    <div
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
      className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4 animate-fade-in overflow-y-auto"
    >
      <div
        id="game-over-modal"
        style={{ backgroundColor: '#10080a' }}
        className="relative w-full max-w-md border-2 border-rose-500 shadow-[0_0_60px_rgba(244,63,94,0.6)] rounded-3xl p-4 sm:p-7 text-white text-center select-none my-auto max-h-[96vh] overflow-y-auto"
      >
        {/* Skull Horror Icon */}
        <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#240c12] border-2 border-rose-500 flex items-center justify-center mb-3 sm:mb-4 shadow-[0_0_25px_rgba(244,63,94,0.7)]">
          <Skull className="w-7 h-7 sm:w-8 sm:h-8 text-rose-400 animate-bounce drop-shadow-[0_0_10px_rgba(244,63,94,0.9)]" />
        </div>

        <h1 className="font-creepster tracking-wider text-3xl sm:text-4xl text-rose-500 drop-shadow-[0_0_18px_rgba(244,63,94,0.9)] mb-1 text-glow-red">
          {details.title}
        </h1>
        <h2 className="font-kanit font-bold text-base sm:text-xl text-rose-200 mb-2.5 sm:mb-3 text-glow-red">
          {details.thaiTitle}
        </h2>

        <p className="text-xs sm:text-sm font-kanit text-neutral-100 mb-3.5 sm:mb-5 leading-relaxed bg-[#160a0e] p-3 sm:p-4 rounded-2xl border border-rose-900 font-medium text-crisp">
          {details.desc}
        </p>

        {/* Revealed Secret Code */}
        <div className="bg-[#121218] border border-neutral-700 rounded-2xl p-3 sm:p-4 mb-3.5 sm:mb-5 shadow-inner">
          <span className="text-xs font-kanit font-semibold text-neutral-200 block mb-1.5 sm:mb-2 text-crisp">รหัสปลดล็อคที่แท้จริงคือ:</span>
          <span className="font-mono font-black text-2xl sm:text-3xl text-amber-300 tracking-widest bg-[#1c1c28] px-5 sm:px-6 py-1.5 sm:py-2 rounded-xl border-2 border-amber-400 inline-block shadow-lg text-glow-amber">
            {targetCode}
          </span>
        </div>

        {/* Restart Button */}
        <button
          id="btn-restart-game"
          onClick={onRestart}
          className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-2xl font-kanit font-black text-base shadow-[0_0_30px_rgba(244,63,94,0.7)] border-2 border-rose-400 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-glow-white touch-manipulation min-h-[44px]"
        >
          <RotateCcw className="w-5 h-5" />
          <span>ลองใหม่อีกครั้ง (Retry)</span>
        </button>
      </div>
    </div>
  );
};
