import { ClueItem } from '../types';

interface MathFormula {
  equation: string;
  result: number;
}

// Generate an interesting, eerie math equation that evaluates to target digit (0..9)
function generateEquationForDigit(digit: number): { equation: string; display: string } {
  const formulas: MathFormula[] = [];

  // 1. Addition / Subtraction
  for (let a = 1; a <= 15; a++) {
    for (let b = 1; b <= 15; b++) {
      if (a + b - digit >= 0 && a + b - digit <= 12) {
        const c = a + b - digit;
        formulas.push({
          equation: `(${a} + ${b}) - ${c}`,
          result: digit
        });
      }
    }
  }

  // 2. Multiplication & Subtraction
  for (let a = 2; a <= 5; a++) {
    for (let b = 2; b <= 5; b++) {
      const prod = a * b;
      if (prod >= digit && prod - digit <= 12) {
        const c = prod - digit;
        formulas.push({
          equation: `(${a} × ${b}) - ${c}`,
          result: digit
        });
      }
    }
  }

  // 3. Multiplication & Addition
  for (let a = 1; a <= 4; a++) {
    for (let b = 1; b <= 4; b++) {
      const prod = a * b;
      if (prod <= digit) {
        const c = digit - prod;
        formulas.push({
          equation: `(${a} × ${b}) + ${c}`,
          result: digit
        });
      }
    }
  }

  // 4. Division & Addition
  for (let div = 2; div <= 6; div++) {
    for (let mult = 0; mult <= digit; mult++) {
      const dividend = mult * div;
      const rem = digit - mult;
      if (dividend > 0 && rem >= 0) {
        formulas.push({
          equation: `(${dividend} ÷ ${div}) + ${rem}`,
          result: digit
        });
      }
    }
  }

  // 5. Square power
  if (digit >= 1 && digit <= 9) {
    for (let base = 2; base <= 4; base++) {
      const sq = base * base;
      if (sq >= digit && sq - digit <= 12) {
        const diff = sq - digit;
        formulas.push({
          equation: `(${base}² - ${diff})`,
          result: digit
        });
      }
    }
  }

  // Pick a random formula from generated
  if (formulas.length === 0) {
    return {
      equation: `${digit} + 0`,
      display: `${digit} + 0 = ${digit}`
    };
  }

  const selected = formulas[Math.floor(Math.random() * formulas.length)];
  return {
    equation: selected.equation,
    display: `${selected.equation} = ?`
  };
}

// Generate randomized puzzle configuration for each new game
export function generateNewPuzzle(): { code: string; clues: ClueItem[] } {
  // Generate 3 random digits 0-9
  const d1 = Math.floor(Math.random() * 10);
  const d2 = Math.floor(Math.random() * 10);
  const d3 = Math.floor(Math.random() * 10);

  const code = `${d1}${d2}${d3}`;

  const eq1 = generateEquationForDigit(d1);
  const eq2 = generateEquationForDigit(d2);
  const eq3 = generateEquationForDigit(d3);

  // Generate distinct corner positions across screen corners to prevent any overlap
  // Zone 1: Top-Left Corner (16-24% X, 22-30% Y)
  // Zone 2: Top-Right Corner (76-84% X, 22-30% Y)
  // Zone 3: Bottom-Left Corner (16-24% X, 70-78% Y)
  const cornerPositions = [
    { x: 18 + Math.floor(Math.random() * 7), y: 24 + Math.floor(Math.random() * 7) },
    { x: 78 + Math.floor(Math.random() * 7), y: 24 + Math.floor(Math.random() * 7) },
    { x: 18 + Math.floor(Math.random() * 7), y: 72 + Math.floor(Math.random() * 7) },
  ];

  // Shuffle positions assignment across items
  const shuffledPositions = [...cornerPositions].sort(() => Math.random() - 0.5);

  const clues: ClueItem[] = [
    {
      id: 'scroll',
      name: 'ม้วนคัมภีร์โบราณ',
      emoji: '📜',
      title: 'คัมภีร์สาปแช่ง (รหัสหลักที่ 1)',
      digitIndex: 1,
      digitValue: d1,
      equation: eq1.equation,
      equationDisplay: `${eq1.equation} = [ ${d1} ]`,
      story: 'กระดาษสาเก่าแก่ถูกจารึกด้วยหมึกสีดำแห้งกรัง มีข้อความลึกลับสลักไว้สำหรับรหัสตัวแรก...',
      hintText: `ถอดรหัสสมการเพื่อหา "รหัสหลักที่ 1"`,
      x: shuffledPositions[0].x,
      y: shuffledPositions[0].y,
      found: false,
    },
    {
      id: 'portrait',
      name: 'กรอบรูปวิญญาณ',
      emoji: '🖼️',
      title: 'ภาพวาดดวงตาปีศาจ (รหัสหลักที่ 2)',
      digitIndex: 2,
      digitValue: d2,
      equation: eq2.equation,
      equationDisplay: `${eq2.equation} = [ ${d2} ]`,
      story: 'ภาพวาดโบราณที่สายตาสบมองตามคุณทุกย่างก้าว ด้านหลังกรอบรูปมีสมการขูดขีดไว้...',
      hintText: `ถอดรหัสสมการเพื่อหา "รหัสหลักที่ 2"`,
      x: shuffledPositions[1].x,
      y: shuffledPositions[1].y,
      found: false,
    },
    {
      id: 'blood',
      name: 'คราบเลือดบนผนัง',
      emoji: '🩸',
      title: 'รอยเลือดสยอง (รหัสหลักที่ 3)',
      digitIndex: 3,
      digitValue: d3,
      equation: eq3.equation,
      equationDisplay: `${eq3.equation} = [ ${d3} ]`,
      story: 'หยดเลือดสีแดงสดที่ยังคงไหลย้อยเป็นตัวเลขคณิตศาสตร์สะท้อนกลิ่นคาวคลุ้ง...',
      hintText: `ถอดรหัสสมการเพื่อหา "รหัสหลักที่ 3"`,
      x: shuffledPositions[2].x,
      y: shuffledPositions[2].y,
      found: false,
    },
  ];

  return { code, clues };
}
