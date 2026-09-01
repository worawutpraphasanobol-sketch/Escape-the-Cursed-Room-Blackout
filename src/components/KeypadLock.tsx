import React, { useState, useEffect, useRef } from 'react';
import { X, Lock, Unlock, Delete, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ClueItem } from '../types';
import { sound } from '../utils/audio';

interface KeypadLockProps {
  isOpen: boolean;
  onClose: () => void;
  targetCode: string;
  onUnlockSuccess: () => void;
  clues: ClueItem[];
}

export const KeypadLock: React.FC<KeypadLockProps> = ({
  isOpen,
  onClose,
  targetCode,
  onUnlockSuccess,
  clues,
}) => {
  const [inputCode, setInputCode] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [isWrong, setIsWrong] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input on modal open
  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setIsShaking(false);
      setIsWrong(false);
      setIsSuccess(false);
      setInputCode('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDigitPress = (digit: string) => {
    if (isSuccess) return;
    if (inputCode.length < 3) {
      const nextCode = inputCode + digit;
      setInputCode(nextCode);
      sound.playKeypad(digit);
      setErrorMsg(null);
      setIsWrong(false);
    }
  };

  const handleBackspace = () => {
    if (isSuccess) return;
    if (inputCode.length > 0) {
      setInputCode(inputCode.slice(0, -1));
      sound.playKeypad('clear');
      setErrorMsg(null);
      setIsWrong(false);
    }
  };

  const handleClear = () => {
    if (isSuccess) return;
    setInputCode('');
    sound.playKeypad('clear');
    setErrorMsg(null);
    setIsWrong(false);
    inputRef.current?.focus();
  };

  const handleUnlockSubmit = () => {
    if (isSuccess) return;
    if (inputCode.length !== 3) {
      setErrorMsg('กรุณากรอกรหัสผ่านให้ครบ 3 หลัก!');
      sound.playWrongCode();
      setIsShaking(true);
      setIsWrong(true);
      setTimeout(() => {
        setIsShaking(false);
        setIsWrong(false);
      }, 500);
      return;
    }

    if (inputCode === targetCode) {
      // Correct!
      setIsSuccess(true);
      setIsWrong(false);
      setErrorMsg(null);
      sound.playUnlockSuccess();
      setTimeout(() => {
        onUnlockSuccess();
      }, 900);
    } else {
      // Incorrect! Clear input immediately so user can retry right away, shake & flash red
      setInputCode('');
      setErrorMsg('รหัสผ่านไม่ถูกต้อง! ลองใหม่อีกครั้ง (เวลายังไม่หมด)');
      sound.playWrongCode();
      setIsShaking(true);
      setIsWrong(true);
      inputRef.current?.focus();

      setTimeout(() => {
        setIsShaking(false);
        setIsWrong(false);
      }, 700);
    }
  };

  // Physical keyboard listeners
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleUnlockSubmit();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      style={{ backgroundColor: isWrong ? 'rgba(50, 10, 20, 0.96)' : 'rgba(0, 0, 0, 0.95)' }}
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 animate-fade-in transition-colors duration-200"
    >
      <div
        id="keypad-lock-modal"
        style={{ backgroundColor: '#0e0e14' }}
        className={`relative w-full max-w-sm border-2 ${
          isSuccess
            ? 'border-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.7)]'
            : isWrong || isShaking
            ? 'border-rose-500 shadow-[0_0_45px_rgba(244,63,94,0.9)] animate-shake ring-4 ring-rose-500/50'
            : 'border-rose-600/80 shadow-[0_0_40px_rgba(244,63,94,0.3)]'
        } rounded-3xl p-6 text-white select-none transition-all`}
      >
        {/* Close Modal Button */}
        <button
          id="btn-close-keypad"
          onClick={onClose}
          disabled={isSuccess}
          aria-label="ปิดหน้าต่างรหัส"
          className="absolute top-4 right-4 p-2 text-neutral-200 hover:text-white bg-[#181822] hover:bg-[#252533] rounded-xl border border-neutral-700 cursor-pointer active:scale-95 transition-all shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Header */}
        <div className="text-center mb-4">
          <div className={`inline-flex items-center justify-center p-3 rounded-2xl ${
            isWrong ? 'bg-rose-950 border-2 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.7)]' : 'bg-[#181822] border border-neutral-700'
          } mb-2 shadow-inner transition-colors`}>
            {isSuccess ? (
              <Unlock className="w-7 h-7 text-emerald-400 animate-bounce drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            ) : isWrong ? (
              <AlertTriangle className="w-7 h-7 text-rose-400 animate-bounce drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
            ) : (
              <Lock className="w-7 h-7 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
            )}
          </div>
          <h2 className="font-creepster tracking-wider text-2xl sm:text-3xl text-rose-500 text-glow-red">
            {isSuccess ? 'DOOR UNLOCKED!' : isWrong ? 'INCORRECT CODE!' : 'CURSED LOCKBOX'}
          </h2>
          <p className="text-xs sm:text-sm font-kanit font-medium text-neutral-200 mt-1 text-crisp">
            กรอกรหัสผ่าน 3 หลักที่ได้จากสมการเพื่อปลดล็อคประตู
          </p>
        </div>

        {/* Quick Clue Reminder Strip */}
        <div className="bg-[#121218] border border-neutral-700 rounded-xl p-3 mb-4 flex items-center justify-around text-xs font-kanit shadow-inner">
          {clues.map((clue) => (
            <div key={clue.id} className="flex items-center gap-1.5" title={clue.found ? `${clue.name}: ${clue.equation}` : 'ยังไม่พบคำใบ้'}>
              <span className="text-base">{clue.emoji}</span>
              <span className="text-neutral-200 text-xs font-medium text-crisp">หลัก {clue.digitIndex}:</span>
              <span className={`font-mono font-bold text-xs sm:text-sm ${clue.found ? 'text-amber-300 text-glow-amber' : 'text-neutral-500'}`}>
                {clue.found ? clue.equation : '?'}
              </span>
            </div>
          ))}
        </div>

        {/* 3-Digit Display Boxes + Native Input */}
        <div className="relative mb-4">
          <div className="flex justify-center gap-3">
            {[0, 1, 2].map((idx) => {
              const char = inputCode[idx];
              const isCurrent = inputCode.length === idx;
              return (
                <div
                  key={idx}
                  className={`w-14 h-16 rounded-2xl border-2 flex items-center justify-center text-3xl font-mono font-black transition-all ${
                    isWrong
                      ? 'border-rose-500 bg-rose-950 text-rose-300 shadow-[0_0_25px_rgba(244,63,94,0.9)] ring-2 ring-rose-500 animate-pulse text-glow-red'
                      : char !== undefined
                      ? 'border-amber-400 bg-amber-950/70 text-amber-200 shadow-[0_0_18px_rgba(245,158,11,0.5)] text-glow-amber'
                      : isCurrent
                      ? 'border-rose-500 bg-[#181822] text-neutral-300 animate-pulse ring-2 ring-rose-500/40'
                      : 'border-neutral-700 bg-[#121218] text-neutral-500'
                  }`}
                >
                  {isWrong ? '✕' : char !== undefined ? char : '•'}
                </div>
              );
            })}
          </div>

          {/* Hidden input to capture physical keyboard input seamlessly */}
          <input
            ref={inputRef}
            id="keypad-native-input"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={3}
            value={inputCode}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 3);
              setInputCode(val);
              if (val.length > inputCode.length) {
                sound.playKeypad(val[val.length - 1]);
              }
              setErrorMsg(null);
              setIsWrong(false);
            }}
            onKeyDown={handleKeyDown}
            className="absolute inset-0 opacity-0 cursor-default"
            aria-label="ช่องกรอกรหัส 3 หลัก"
          />
        </div>

        {/* Error message banner */}
        {errorMsg && (
          <div className="mb-4 p-2.5 bg-rose-950 border-2 border-rose-500 text-rose-200 text-xs sm:text-sm font-kanit font-bold rounded-xl text-center flex items-center justify-center gap-1.5 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.5)] text-glow-red">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Keypad Buttons Grid (0-9, Clear, Backspace) */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              id={`btn-pad-${num}`}
              onClick={() => handleDigitPress(num)}
              disabled={isSuccess}
              className="py-3.5 bg-[#181822] hover:bg-[#262636] active:bg-amber-950 border border-neutral-700 hover:border-neutral-500 rounded-xl text-xl font-mono font-black text-white transition-all cursor-pointer active:scale-95 shadow-md text-glow-white"
            >
              {num}
            </button>
          ))}
          <button
            id="btn-pad-clear"
            onClick={handleClear}
            disabled={isSuccess}
            className="py-3.5 bg-[#14141c] hover:bg-[#20202c] border border-neutral-700 hover:border-neutral-500 rounded-xl text-xs sm:text-sm font-kanit font-bold text-neutral-200 hover:text-white transition-all cursor-pointer active:scale-95 text-crisp"
          >
            ล้าง (C)
          </button>
          <button
            id="btn-pad-0"
            onClick={() => handleDigitPress('0')}
            disabled={isSuccess}
            className="py-3.5 bg-[#181822] hover:bg-[#262636] active:bg-amber-950 border border-neutral-700 hover:border-neutral-500 rounded-xl text-xl font-mono font-black text-white transition-all cursor-pointer active:scale-95 shadow-md text-glow-white"
          >
            0
          </button>
          <button
            id="btn-pad-backspace"
            onClick={handleBackspace}
            disabled={isSuccess}
            aria-label="ลบตัวเลขล่าสุด"
            className="py-3.5 bg-[#14141c] hover:bg-[#20202c] border border-neutral-700 hover:border-neutral-500 rounded-xl flex items-center justify-center text-neutral-200 hover:text-white transition-all cursor-pointer active:scale-95"
          >
            <Delete className="w-5 h-5 text-neutral-200" />
          </button>
        </div>

        {/* Unlock Action Button */}
        <button
          id="btn-submit-unlock"
          onClick={handleUnlockSubmit}
          disabled={isSuccess}
          className={`w-full py-3.5 rounded-xl font-kanit font-black text-base flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer active:scale-95 ${
            isSuccess
              ? 'bg-emerald-500 text-black shadow-[0_0_30px_rgba(16,185,129,0.8)] border-2 border-emerald-300'
              : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-[0_0_25px_rgba(244,63,94,0.7)] border-2 border-rose-400 text-glow-white'
          }`}
        >
          {isSuccess ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-black animate-spin" />
              <span>ปลดล็อคสำเร็จ! กำลังเปิดประตู...</span>
            </>
          ) : (
            <>
              <Unlock className="w-5 h-5" />
              <span>Unlock (ปลดล็อคประตู)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
