import React from 'react';
import { X, ShieldAlert, Zap, Clock, Key, Eye } from 'lucide-react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        id="instructions-modal"
        style={{ backgroundColor: '#0e0e14' }}
        className="relative w-full max-w-lg border-2 border-rose-600 shadow-[0_0_50px_rgba(244,63,94,0.4)] rounded-3xl p-6 sm:p-7 text-white select-none max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          id="btn-close-instructions"
          onClick={onClose}
          aria-label="ปิดหน้าต่างวิธีเล่น"
          className="absolute top-4 right-4 p-2 text-neutral-200 hover:text-white bg-[#181822] hover:bg-[#252533] rounded-xl border border-neutral-700 cursor-pointer active:scale-95 transition-all shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-4 border-b border-neutral-700 pb-3.5">
          <div className="p-3 bg-[#1e1015] border-2 border-rose-500 rounded-2xl shadow-[0_0_15px_rgba(244,63,94,0.4)]">
            <ShieldAlert className="w-6 h-6 text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
          </div>
          <div>
            <h2 className="font-creepster tracking-wider text-2xl sm:text-3xl text-rose-500 text-glow-red">
              RULES & SURVIVAL GUIDE
            </h2>
            <p className="text-xs sm:text-sm font-kanit font-semibold text-neutral-200 text-crisp">
              คู่มือเอาชีวิตรอดและถอดรหัสห้องต้องสาป "Blackout"
            </p>
          </div>
        </div>

        {/* 4 Core Rules Breakdown */}
        <div className="space-y-3 font-kanit text-xs sm:text-sm text-neutral-100">
          {/* Rule 1 */}
          <div className="bg-[#14141c] border border-neutral-700 p-4 rounded-2xl flex items-start gap-3 shadow-md">
            <div className="p-2 bg-[#20202c] rounded-xl shrink-0 mt-0.5 border border-neutral-600">
              <Clock className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <div className="font-bold text-white mb-0.5 text-glow-white">1. เวลาจำกัด 60 วินาที</div>
              <p className="text-neutral-200 text-xs sm:text-sm leading-relaxed text-crisp">
                เวลาจะค้างอยู่ที่ 60.0 วิ และ<span className="text-amber-300 font-bold text-glow-amber">เริ่มนับถอยหลังเมื่อเปิดไฟฉายครั้งแรก</span> จากนั้นจะนับต่อเนื่องจนหมดเวลา หากหมดเวลา วิญญาณร้ายจะเข้าครอบงำ (Game Over)
              </p>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="bg-[#14141c] border border-neutral-700 p-4 rounded-2xl flex items-start gap-3 shadow-md">
            <div className="p-2 bg-[#20202c] rounded-xl shrink-0 mt-0.5 border border-neutral-600">
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="font-bold text-white mb-0.5 text-glow-white">2. ไฟฉาย & แบตเตอรี่จำกัด</div>
              <p className="text-neutral-200 text-xs sm:text-sm leading-relaxed text-crisp">
                กดปุ่ม <span className="text-amber-300 font-bold text-glow-amber">ไฟฉาย</span> หรือปุ่ม <span className="text-amber-300 font-mono font-bold">Spacebar</span> เพื่อเปิด/ปิดแสง โดยแบตเตอรี่จะลดลง <span className="text-rose-400 font-bold text-glow-red">5% ต่อวินาที</span> ขณะเปิดไฟ (ถ้าแบตหมด = Game Over)
              </p>
            </div>
          </div>

          {/* Rule 3 */}
          <div className="bg-[#14141c] border border-neutral-700 p-4 rounded-2xl flex items-start gap-3 shadow-md">
            <div className="p-2 bg-[#20202c] rounded-xl shrink-0 mt-0.5 border border-neutral-600">
              <Eye className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <div className="font-bold text-white mb-0.5 text-glow-white">3. ตามหา 3 วัตถุต้องสาป</div>
              <p className="text-neutral-200 text-xs sm:text-sm leading-relaxed text-crisp">
                เลื่อนลำแสงไฟฉายไปทั่วห้องเพื่อค้นหา <span className="text-amber-300 font-bold">📜 ม้วนคัมภีร์ (หลักที่ 1)</span>, <span className="text-amber-300 font-bold">🖼️ กรอบรูป (หลักที่ 2)</span>, และ <span className="text-rose-400 font-bold">🩸 รอยเลือด (หลักที่ 3)</span> แล้วคลิกเพื่ออ่านสมการ
              </p>
            </div>
          </div>

          {/* Rule 4 */}
          <div className="bg-[#14141c] border border-neutral-700 p-4 rounded-2xl flex items-start gap-3 shadow-md">
            <div className="p-2 bg-[#20202c] rounded-xl shrink-0 mt-0.5 border border-neutral-600">
              <Key className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="font-bold text-white mb-0.5 text-glow-white">4. ถอดรหัสสมการ & ปลดล็อคประตู</div>
              <p className="text-neutral-200 text-xs sm:text-sm leading-relaxed text-crisp">
                คำนวณผลลัพธ์ของสมการทั้ง 3 หลัก แล้วกรอกรหัส 3 ตัวลงที่ประตู จากนั้นกด <span className="text-emerald-400 font-bold text-glow-emerald">"Unlock"</span> เพื่อหนีรอด (หากกรอกผิด สามารถลองใหม่ได้เรื่อยๆ ตราบใดที่เวลายังไม่หมด!)
              </p>
            </div>
          </div>
        </div>

        {/* Understand Button */}
        <div className="mt-5">
          <button
            id="btn-understand-instructions"
            onClick={onClose}
            className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-2xl font-kanit font-black text-base shadow-[0_0_25px_rgba(244,63,94,0.6)] border-2 border-rose-400 transition-all cursor-pointer active:scale-95 text-glow-white"
          >
            เข้าใจแล้ว เข้าสู่ห้องสาป
          </button>
        </div>
      </div>
    </div>
  );
};
