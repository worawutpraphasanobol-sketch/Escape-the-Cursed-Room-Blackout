import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ClueItem } from '../types';
import { KeyRound, Sparkles } from 'lucide-react';

interface HorrorRoomProps {
  flashlightOn: boolean;
  battery: number;
  clues: ClueItem[];
  isTimerStarted?: boolean;
  onSelectClue: (clue: ClueItem) => void;
  onOpenKeypad: () => void;
  onToggleFlashlight: () => void;
}

export const HorrorRoom: React.FC<HorrorRoomProps> = ({
  flashlightOn,
  battery,
  clues,
  isTimerStarted = false,
  onSelectClue,
  onOpenKeypad,
  onToggleFlashlight,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerRectRef = useRef<{ left: number; top: number; width: number; height: number }>({
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const pendingPosRef = useRef<{ x: number; y: number }>({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const rafRef = useRef<number | null>(null);

  // Track illuminated clue id efficiently without re-rendering on every mouse pixel
  const [illuminatedClueId, setIlluminatedClueId] = useState<string | null>(null);
  const [darknessWarning, setDarknessWarning] = useState<string | null>(null);

  // Update container dimensions on mount and window resize without layout thrashing
  const updateContainerRect = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      containerRectRef.current = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      };
    }
  }, []);

  // Flush flashlight position using requestAnimationFrame and CSS Variables
  const flushFlashlight = useCallback(() => {
    if (!containerRef.current) {
      rafRef.current = null;
      return;
    }

    const { x, y } = pendingPosRef.current;
    const container = containerRef.current;

    // Apply CSS Variables directly for smooth 60-120fps hardware acceleration
    container.style.setProperty('--light-x', `${x}px`);
    container.style.setProperty('--light-y', `${y}px`);

    // Check illumination of clues only inside rAF and update state only when changed
    if (flashlightOn) {
      const rect = containerRectRef.current;
      let foundIlluminatedId: string | null = null;

      for (const clue of clues) {
        const itemPxX = (clue.x / 100) * rect.width;
        const itemPxY = (clue.y / 100) * rect.height;
        const dx = x - itemPxX;
        const dy = y - itemPxY;
        const distanceSq = dx * dx + dy * dy;

        // Radius ~160px (160^2 = 25600)
        if (distanceSq < 28900) {
          foundIlluminatedId = clue.id;
          break;
        }
      }

      setIlluminatedClueId((prev) => (prev !== foundIlluminatedId ? foundIlluminatedId : prev));
    } else {
      setIlluminatedClueId((prev) => (prev !== null ? null : prev));
    }

    rafRef.current = null;
  }, [flashlightOn, clues]);

  // Schedule an update frame
  const scheduleUpdate = useCallback((x: number, y: number) => {
    pendingPosRef.current = { x, y };
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(flushFlashlight);
    }
  }, [flushFlashlight]);

  // Measure container rect on mount and resize
  useEffect(() => {
    updateContainerRect();
    const centerX = containerRectRef.current.width / 2;
    const centerY = containerRectRef.current.height / 2;
    scheduleUpdate(centerX, centerY);

    window.addEventListener('resize', updateContainerRect, { passive: true });
    return () => {
      window.removeEventListener('resize', updateContainerRect);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [updateContainerRect, scheduleUpdate]);

  // Re-flush if flashlightOn state toggles
  useEffect(() => {
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(flushFlashlight);
    }
  }, [flashlightOn, flushFlashlight]);

  // High-performance Mousemove listener
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRectRef.current;
    scheduleUpdate(e.clientX - rect.left, e.clientY - rect.top);
  };

  // High-performance Touchmove listener for mobile
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 0) return;
    const rect = containerRectRef.current;
    const touch = e.touches[0];
    scheduleUpdate(touch.clientX - rect.left, touch.clientY - rect.top);
  };

  const handleRoomClick = () => {
    if (!flashlightOn) {
      setDarknessWarning('มืดเกินไป! กดเปิดไฟฉาย (Spacebar) เพื่อมองเห็นสิ่งของ');
      setTimeout(() => setDarknessWarning(null), 2500);
    }
  };

  return (
    <div
      ref={containerRef}
      id="horror-room-canvas"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onClick={handleRoomClick}
      className="relative w-full h-screen overflow-hidden bg-[#050505] cursor-crosshair select-none flex items-center justify-center"
      style={{
        touchAction: 'none',
        // Default initial CSS variables
        ['--light-x' as string]: `${pendingPosRef.current.x}px`,
        ['--light-y' as string]: `${pendingPosRef.current.y}px`,
      }}
    >
      {/* 1. Base Haunted Room Scene (Wall, Floor, Decorations, Door) */}
      <div className="absolute inset-0 w-full h-full bg-[#050507] pointer-events-none">
        {/* Wall texture & high-tech subtle grid */}
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#202028_1px,transparent_1px)] [background-size:24px_24px]" />
        
        {/* Haunted Door (Escape Gateway) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-[10%] w-52 sm:w-68 h-72 sm:h-96 bg-gradient-to-b from-[#161214] via-[#0d0a0c] to-[#060405] border-2 border-neutral-800 hover:border-rose-700/80 rounded-t-2xl shadow-2xl flex flex-col items-center justify-between p-4 pointer-events-auto cursor-pointer group transition-all"
          onClick={(e) => {
            e.stopPropagation();
            onOpenKeypad();
          }}
          title="ประตูทางออกที่ถูกล็อคด้วยรหัส (คลิกเพื่อกรอกรหัส)"
        >
          {/* Iron Chains & Warning Sign */}
          <div className="w-full flex justify-between items-center px-2 pt-1 text-neutral-400">
            <span className="text-xl">⛓️</span>
            <div className="text-center">
              <span className="text-[10px] font-mono tracking-widest text-rose-400 block font-bold text-glow-red">SECURITY LOCK</span>
              <span className="text-xs font-creepster text-rose-400 tracking-wider">RESTRICTED</span>
            </div>
            <span className="text-xl">⛓️</span>
          </div>

          {/* Door Handle & Keypad Device */}
          <div className="w-full flex flex-col items-center gap-2">
            <div className="w-22 h-24 bg-[#101016] border-2 border-rose-600/80 rounded-xl p-2 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.4)] group-hover:border-rose-400 group-hover:shadow-[0_0_30px_rgba(244,63,94,0.8)] transition-all">
              <KeyRound className="w-6 h-6 text-rose-400 animate-pulse drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
              <span className="text-[11px] font-mono text-rose-300 mt-1 font-bold text-glow-red">3-DIGIT</span>
              <span className="text-[10px] font-kanit text-amber-300 font-semibold text-crisp">คลิกใส่รหัส</span>
            </div>
            <div className="w-4 h-10 bg-[#1e1e28] rounded-md border border-neutral-600 shadow-inner" />
          </div>

          <div className="text-xs font-kanit font-semibold text-neutral-200 group-hover:text-rose-300 transition-colors flex items-center gap-1 text-crisp">
            <span>🚪</span> <span>ประตูทางออกห้องสาป</span>
          </div>
        </div>

        {/* Creepy Room Details & Silhouettes */}
        <div className="absolute left-[8%] top-[30%] text-3xl opacity-40 select-none">🕸️</div>
        <div className="absolute right-[10%] top-[25%] text-4xl opacity-40 select-none">🕸️</div>
        <div className="absolute left-[12%] bottom-[18%] text-3xl opacity-30 select-none">🕯️</div>
        <div className="absolute right-[14%] bottom-[18%] text-3xl opacity-30 select-none">🕯️</div>
        <div className="absolute left-1/2 -translate-x-1/2 top-[10%] text-xs font-mono tracking-widest text-neutral-400 font-bold select-none text-crisp">
          SYSTEM ID: #CURSED-ROOM-001
        </div>
      </div>

      {/* 2. Interactive Emoji Clues (📜, 🖼️, 🩸) */}
      {clues.map((clue) => {
        const illuminated = illuminatedClueId === clue.id;
        return (
          <div
            key={clue.id}
            id={`room-item-${clue.id}`}
            onClick={(e) => {
              e.stopPropagation();
              if (flashlightOn) {
                onSelectClue(clue);
              } else {
                setDarknessWarning('คุณมองไม่เห็นอะไรเลยในความมืด! ต้องเปิดไฟฉายก่อน');
                setTimeout(() => setDarknessWarning(null), 2500);
              }
            }}
            style={{
              left: `${clue.x}%`,
              top: `${clue.y}%`,
            }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-200 cursor-pointer ${
              illuminated
                ? 'opacity-100 scale-125 hover:scale-135 pointer-events-auto'
                : flashlightOn
                ? 'opacity-20 scale-95 pointer-events-auto'
                : 'opacity-0 scale-75 pointer-events-none'
            }`}
          >
            {/* Glowing Aura when illuminated */}
            <div className={`relative flex flex-col items-center justify-center p-3.5 rounded-2xl transition-all ${
              illuminated
                ? 'bg-[#1c1404] border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.8)]'
                : ''
            }`}>
              <span className={`text-4xl sm:text-5xl transition-transform ${illuminated ? 'animate-blood-pulse drop-shadow-[0_0_12px_rgba(245,158,11,0.9)]' : ''}`}>
                {clue.emoji}
              </span>

              {/* Tag tooltip when illuminated */}
              {illuminated && (
                <div className="absolute -bottom-9 whitespace-nowrap px-3 py-1 rounded-xl bg-[#0e0e14] border-2 border-amber-400 text-xs font-kanit font-bold text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.6)] flex items-center gap-1.5 animate-bounce">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-glow-amber">คลิกอ่านคำใบ้หลักที่ {clue.digitIndex}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* 3. Dynamic Hardware-Accelerated Flashlight Darkness Overlay */}
      {/* If flashlight is ON: CSS Variables + will-change: background; GPU acceleration */}
      {/* If flashlight is OFF: 100% Solid Blackout mask */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 z-20 ${
          flashlightOn ? 'flashlight-mask' : 'bg-black'
        }`}
      />

      {/* Hardware-Accelerated Flashlight Beam Halo Ring */}
      {flashlightOn && (
        <div
          className="flashlight-halo absolute top-0 left-0 pointer-events-none z-20 w-[280px] h-[280px] rounded-full border border-amber-200/20 shadow-[inset_0_0_40px_rgba(255,220,150,0.15)]"
        />
      )}

      {/* 4. On-Screen Guidance when Pitch Black */}
      {!flashlightOn && (
        <div className="absolute z-25 text-center px-4 pointer-events-auto">
          <div className="inline-block bg-[#0e0e14] border-2 border-rose-600 rounded-3xl p-6 sm:p-8 shadow-[0_0_45px_rgba(244,63,94,0.5)] max-w-md animate-flicker">
            <div className="text-4xl sm:text-5xl mb-2 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]">🔦</div>
            <h3 className="font-creepster text-3xl text-rose-500 tracking-wider text-glow-red">
              TOTAL BLACKOUT
            </h3>
            <p className="text-sm font-kanit text-neutral-100 mt-2 mb-5 leading-relaxed font-medium text-crisp">
              {isTimerStarted ? (
                <>
                  ห้องมืดสนิท! เปิดไฟฉายเพื่อสำรวจห้องต่อและค้นหา 📜, 🖼️, 🩸<br />
                  <span className="text-rose-400 font-bold text-glow-red">(ระวัง: ไฟฉายกินแบตเตอรี่ 5% ต่อวินาที)</span>
                </>
              ) : (
                <>
                  ห้องมืดสนิท! เปิดไฟฉายเพื่อสำรวจห้องและเริ่มจับเวลา 60 วินาที<br />
                  <span className="text-amber-300 font-bold text-glow-amber">(เวลานับถอยหลังจะเริ่มเมื่อเปิดไฟฉายครั้งแรก)</span>
                </>
              )}
            </p>
            <button
              id="btn-center-turn-on-light"
              onClick={onToggleFlashlight}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-black font-kanit font-black text-sm sm:text-base rounded-2xl shadow-[0_0_25px_rgba(245,158,11,0.7)] cursor-pointer active:scale-95 transition-all border-2 border-amber-200"
            >
              {isTimerStarted ? 'เปิดไฟฉายต่อ (Spacebar)' : 'เปิดไฟฉายเพื่อเริ่ม (Spacebar)'}
            </button>
          </div>
        </div>
      )}

      {/* Flash Darkness Warning Notification Toast */}
      {darknessWarning && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 bg-rose-950 border-2 border-rose-400 text-rose-100 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-kanit font-bold shadow-[0_0_25px_rgba(244,63,94,0.9)] animate-bounce pointer-events-none text-glow-red">
          ⚠️ {darknessWarning}
        </div>
      )}
    </div>
  );
};

