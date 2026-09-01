import React from 'react';
import { Flashlight, FlashlightOff, Clock, BatteryCharging, BatteryWarning, BatteryMedium, Volume2, VolumeX, HelpCircle, KeyRound, Eye } from 'lucide-react';
import { ClueItem } from '../types';

interface HUDProps {
  timeLeft: number;
  battery: number;
  flashlightOn: boolean;
  isTimerStarted?: boolean;
  onToggleFlashlight: () => void;
  clues: ClueItem[];
  onOpenClue: (clue: ClueItem) => void;
  onOpenInstructions: () => void;
  onOpenKeypad: () => void;
  soundMuted: boolean;
  onToggleSound: () => void;
  discoveredCount: number;
}

export const HUD: React.FC<HUDProps> = ({
  timeLeft,
  battery,
  flashlightOn,
  isTimerStarted = false,
  onToggleFlashlight,
  clues,
  onOpenClue,
  onOpenInstructions,
  onOpenKeypad,
  soundMuted,
  onToggleSound,
  discoveredCount,
}) => {
  const isTimeCritical = timeLeft <= 15;
  const isBatteryCritical = battery <= 25;

  const getBatteryIcon = () => {
    if (battery <= 20) return <BatteryWarning className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 animate-pulse drop-shadow-[0_0_6px_rgba(244,63,94,0.8)]" />;
    if (battery <= 60) return <BatteryMedium className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]" />;
    return <BatteryCharging className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]" />;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 pointer-events-auto bg-[#0a0a0e] border-b border-neutral-800 pt-3 pb-3 px-3 sm:px-6 shadow-2xl shadow-black">
      <div className="max-w-6xl mx-auto flex flex-col gap-2.5">
        {/* Top bar: Title, Clues found, Controls */}
        <div className="flex items-center justify-between gap-2">
          {/* Game Title & Instruction Button */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.9)]" />
              <h1 className="font-creepster tracking-wider text-xl sm:text-2xl text-rose-500 text-glow-red select-none">
                BLACKOUT
              </h1>
            </div>
            <button
              id="btn-instructions"
              onClick={onOpenInstructions}
              aria-label="กติกาและวิธีเล่น"
              className="px-2.5 py-1 text-xs font-kanit font-semibold bg-[#16161d] hover:bg-[#22222c] text-neutral-100 hover:text-white border border-neutral-700 hover:border-neutral-500 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md"
            >
              <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden xs:inline text-crisp">วิธีเล่น</span>
            </button>
          </div>

          {/* Quick Clue Discovery Inventory */}
          <div className="flex items-center gap-1.5 bg-[#121218] border border-neutral-700/90 px-3 py-1.5 rounded-xl shadow-lg">
            <span className="text-xs text-neutral-200 font-kanit font-medium hidden sm:inline mr-1 text-crisp">คำใบ้:</span>
            {clues.map((clue) => (
              <button
                key={clue.id}
                id={`hud-clue-${clue.id}`}
                onClick={() => clue.found && onOpenClue(clue)}
                disabled={!clue.found}
                title={clue.found ? `${clue.name} (คลิกเพื่อดูคำใบ้)` : 'ยังไม่พบ (ส่องไฟฉายตามหา)'}
                className={`relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-sm sm:text-base border transition-all ${
                  clue.found
                    ? 'bg-amber-950/80 border-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.6)] hover:scale-105 cursor-pointer active:scale-95 text-white'
                    : 'bg-[#181822] border-neutral-700 text-neutral-500 cursor-not-allowed'
                }`}
              >
                <span>{clue.emoji}</span>
                {clue.found && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-black shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
                )}
              </button>
            ))}
            <div className="ml-1 pl-2 border-l border-neutral-700 flex items-center">
              <span className="text-xs font-mono font-bold text-amber-300 text-glow-amber">
                {discoveredCount}/3
              </span>
            </div>
          </div>

          {/* Audio toggle & Lockbox Shortcut */}
          <div className="flex items-center gap-2">
            <button
              id="btn-sound-toggle"
              onClick={onToggleSound}
              aria-label={soundMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
              className="p-2 bg-[#16161d] hover:bg-[#22222c] text-neutral-100 hover:text-white border border-neutral-700 hover:border-neutral-500 rounded-lg transition-all cursor-pointer active:scale-95 shadow-md"
            >
              {soundMuted ? <VolumeX className="w-4 h-4 text-neutral-400" /> : <Volume2 className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.7)]" />}
            </button>
            <button
              id="btn-open-lockpad"
              onClick={onOpenKeypad}
              className="px-3 sm:px-3.5 py-1.5 bg-gradient-to-r from-rose-900 via-rose-950 to-[#181216] hover:from-rose-800 hover:to-neutral-800 text-rose-100 border border-rose-500 hover:border-rose-400 rounded-lg text-xs sm:text-sm font-kanit font-bold flex items-center gap-1.5 shadow-[0_0_18px_rgba(244,63,94,0.45)] cursor-pointer active:scale-95 transition-all text-glow-red"
            >
              <KeyRound className="w-4 h-4 text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
              <span>ใส่รหัสปลดล็อค</span>
            </button>
          </div>
        </div>

        {/* Status gauges: Real-time Timer & Battery + Flashlight Button */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 items-center bg-[#101016] border border-neutral-700/80 px-3 sm:px-5 py-2.5 rounded-xl shadow-2xl">
          {/* 1. Real-time Timer */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`p-2 rounded-lg transition-colors ${
              isTimeCritical && isTimerStarted
                ? 'bg-rose-950 border border-rose-500 animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.6)]'
                : 'bg-[#181822] border border-neutral-700'
            }`}>
              <Clock className={`w-4 h-4 sm:w-5 sm:h-5 ${isTimeCritical && isTimerStarted ? 'text-rose-400' : 'text-neutral-200'}`} />
            </div>
            <div>
              <div className="text-[11px] sm:text-xs text-neutral-200 font-kanit font-medium leading-none flex items-center gap-1.5 text-crisp">
                <span>เวลาถอยหลัง</span>
                {!isTimerStarted && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-950 border border-amber-400 text-amber-300 rounded font-bold shadow-[0_0_8px_rgba(245,158,11,0.4)]">
                    เปิดไฟเพื่อเริ่ม
                  </span>
                )}
              </div>
              <div className={`font-mono font-black text-base sm:text-2xl leading-tight tracking-tight mt-1 ${
                isTimeCritical && isTimerStarted
                  ? 'text-rose-400 animate-pulse text-glow-red'
                  : 'text-white text-glow-white'
              }`}>
                {timeLeft.toFixed(1)} <span className="text-xs font-semibold text-neutral-300">วินาที</span>
              </div>
            </div>
          </div>

          {/* 2. Flashlight Toggle Center Button */}
          <div className="flex justify-center">
            <button
              id="btn-toggle-flashlight"
              onClick={onToggleFlashlight}
              disabled={battery <= 0}
              className={`w-full max-w-[200px] py-2 px-2.5 sm:px-4 rounded-xl font-kanit font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer active:scale-95 select-none ${
                flashlightOn
                  ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-[0_0_25px_rgba(245,158,11,0.7)] border-2 border-amber-200 ring-2 ring-amber-400/30 font-black'
                  : 'bg-[#181822] hover:bg-[#242430] text-neutral-100 border border-neutral-600 hover:border-neutral-400 shadow-md'
              }`}
            >
              {flashlightOn ? (
                <>
                  <Flashlight className="w-4 h-4 text-black animate-pulse" />
                  <span className="drop-shadow-sm">ไฟฉาย [เปิด]</span>
                </>
              ) : (
                <>
                  <FlashlightOff className="w-4 h-4 text-neutral-300" />
                  <span className="text-crisp">ไฟฉาย [ปิด]</span>
                </>
              )}
              <span className={`hidden md:inline-block text-[10px] px-1.5 py-0.5 rounded font-mono border ${
                flashlightOn ? 'bg-black/30 text-black border-black/30 font-bold' : 'bg-black/60 text-neutral-200 border-neutral-700'
              }`}>
                Space
              </span>
            </button>
          </div>

          {/* 3. Real-time Battery Meter */}
          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <div className="text-right">
              <div className="text-[11px] sm:text-xs text-neutral-200 font-kanit font-medium leading-none flex items-center justify-end gap-1 text-crisp">
                <span>แบตเตอรี่</span>
                {flashlightOn && <span className="text-rose-400 text-[10px] font-bold text-glow-red">(-5%/วิ)</span>}
              </div>
              <div className={`font-mono font-black text-base sm:text-2xl leading-tight mt-1 ${
                isBatteryCritical
                  ? 'text-rose-400 animate-pulse text-glow-red'
                  : 'text-emerald-300 text-glow-emerald'
              }`}>
                {Math.max(0, Math.round(battery))}%
              </div>
            </div>
            <div className={`p-2 rounded-lg transition-colors ${
              isBatteryCritical
                ? 'bg-rose-950 border border-rose-500 animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.6)]'
                : 'bg-[#181822] border border-neutral-700'
            }`}>
              {getBatteryIcon()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
