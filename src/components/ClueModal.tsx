import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight, HelpCircle, Lightbulb } from 'lucide-react';
import { ClueItem } from '../types';
import { sound } from '../utils/audio';

interface ClueModalProps {
  clue: ClueItem | null;
  onClose: () => void;
  onOpenKeypad: () => void;
}

export const ClueModal: React.FC<ClueModalProps> = ({ clue, onClose, onOpenKeypad }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  // Reset showAnswer state whenever a new clue is inspected
  useEffect(() => {
    setShowAnswer(false);
  }, [clue?.id]);

  if (!clue) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-6 animate-fade-in overflow-y-auto"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
    >
      <div
        id="clue-inspection-modal"
        style={{ backgroundColor: '#0e0e14' }}
        className="relative w-full max-w-md border-2 border-amber-500 shadow-[0_0_60px_rgba(245,158,11,0.4)] rounded-3xl p-4 sm:p-7 text-white select-none my-auto max-h-[96vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          id="btn-close-clue"
          onClick={onClose}
          aria-label="ปิดการสำรวจ"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 text-neutral-200 hover:text-white bg-[#1a1a24] hover:bg-[#252533] rounded-xl border border-neutral-700 cursor-pointer active:scale-95 transition-all shadow-md z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Clue Icon & Header */}
        <div className="flex items-center gap-3 sm:gap-3.5 mb-3 sm:mb-4 border-b border-neutral-700 pb-3 sm:pb-3.5 pr-8 sm:pr-0">
          <div className="text-3xl sm:text-4xl p-2.5 sm:p-3 bg-[#181822] rounded-2xl border-2 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)] shrink-0">
            {clue.emoji}
          </div>
          <div>
            <div className="text-[11px] sm:text-xs font-kanit font-bold text-amber-300 flex items-center gap-1 sm:gap-1.5 text-glow-amber">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
              <span>คำใบ้ห้องต้องสาป • รหัสหลักที่ {clue.digitIndex}</span>
            </div>
            <h2 className="font-kanit font-bold text-base sm:text-xl text-white mt-0.5 text-glow-white">
              {clue.name}
            </h2>
          </div>
        </div>

        {/* Narrative Lore */}
        <p className="text-xs sm:text-sm font-kanit text-neutral-100 italic mb-3 sm:mb-5 leading-relaxed bg-[#08080c] p-3 sm:p-4 rounded-2xl border border-neutral-700 text-crisp">
          "{clue.story}"
        </p>

        {/* Math Equation Card */}
        <div className="bg-gradient-to-br from-amber-950/80 via-[#181218] to-rose-950/60 border-2 border-amber-400/80 rounded-2xl p-3.5 sm:p-5 mb-3 sm:mb-5 text-center shadow-xl">
          <div className="text-xs font-kanit text-amber-300 font-bold mb-1 text-glow-amber flex items-center justify-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>สมการคณิตศาสตร์ที่จารึกไว้</span>
          </div>

          <div className="font-mono font-black text-xl sm:text-3xl text-amber-200 text-glow-amber tracking-wider my-2.5 sm:my-3 bg-[#0a0a0f] py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-xl border-2 border-amber-400 inline-block shadow-2xl">
            {clue.equation} = ?
          </div>

          <p className="text-[11px] sm:text-xs font-kanit text-neutral-200 font-medium mb-2.5 sm:mb-3 text-crisp">
            คำนวณผลลัพธ์เพื่อใช้เป็นรหัสผ่านหลักที่ {clue.digitIndex}
          </p>

          {/* Answer Toggle / Reveal Section */}
          {!showAnswer ? (
            <div className="mt-1.5 sm:mt-2 pt-2.5 sm:pt-3.5 border-t border-neutral-700/80 flex flex-col items-center gap-1.5 sm:gap-2">
              <button
                id="btn-reveal-clue-answer"
                onClick={() => {
                  setShowAnswer(true);
                  sound.playClueFound();
                }}
                className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-amber-500/20 via-amber-500/30 to-amber-500/20 hover:from-amber-500/35 hover:to-amber-500/45 text-amber-300 border-2 border-amber-400/80 hover:border-amber-300 rounded-xl font-kanit text-xs sm:text-sm font-bold shadow-[0_0_18px_rgba(245,158,11,0.35)] hover:shadow-[0_0_25px_rgba(245,158,11,0.6)] transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer active:scale-95 text-glow-amber touch-manipulation min-h-[44px]"
              >
                <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>เฉลยรหัส (Show Answer)</span>
              </button>
              <span className="text-[10px] sm:text-[11px] font-kanit text-neutral-400">
                (ลองคิดเลขด้วยตัวเองก่อน หากคิดไม่ออกให้กดปุ่มเฉลย)
              </span>
            </div>
          ) : (
            <div className="mt-1.5 sm:mt-2 pt-2.5 sm:pt-3.5 border-t border-neutral-700/80 flex flex-col items-center gap-1.5 sm:gap-2 animate-fade-in">
              <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                <span className="text-xs sm:text-sm font-kanit font-semibold text-neutral-100 text-crisp">
                  ผลลัพธ์ (รหัสหลักที่ {clue.digitIndex}):
                </span>
                <span className="font-mono font-black text-lg sm:text-2xl text-emerald-300 bg-emerald-950 px-3 sm:px-4 py-1 rounded-xl border-2 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.8)] text-glow-emerald animate-pulse">
                  {clue.digitValue}
                </span>
              </div>
              <button
                id="btn-hide-clue-answer"
                onClick={() => setShowAnswer(false)}
                className="text-[11px] font-kanit text-neutral-400 hover:text-neutral-200 underline mt-0.5 cursor-pointer active:scale-95 transition-colors touch-manipulation p-1"
              >
                ซ่อนเฉลย
              </button>
            </div>
          )}
        </div>

        {/* Actions: Continue exploring or Go directly to keypad */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <button
            id="btn-clue-keep-searching"
            onClick={onClose}
            className="py-2.5 sm:py-3 px-2 sm:px-3 bg-[#1c1c26] hover:bg-[#282836] text-white border border-neutral-600 hover:border-neutral-400 rounded-xl font-kanit text-xs sm:text-sm font-bold transition-all cursor-pointer active:scale-95 text-center shadow-md text-crisp touch-manipulation min-h-[44px]"
          >
            สำรวจห้องต่อ
          </button>
          <button
            id="btn-clue-go-unlock"
            onClick={() => {
              onClose();
              onOpenKeypad();
            }}
            className="py-2.5 sm:py-3 px-2 sm:px-3 bg-amber-400 hover:bg-amber-300 text-black rounded-xl font-kanit text-xs sm:text-sm font-black shadow-[0_0_25px_rgba(245,158,11,0.6)] border-2 border-amber-200 transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer active:scale-95 text-center touch-manipulation min-h-[44px]"
          >
            <span>ไปใส่รหัส</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
