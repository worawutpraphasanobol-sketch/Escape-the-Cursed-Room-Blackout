/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, GameOverReason, ClueItem } from './types';
import { generateNewPuzzle } from './utils/puzzles';
import { sound } from './utils/audio';
import { IntroScreen } from './components/IntroScreen';
import { HUD } from './components/HUD';
import { HorrorRoom } from './components/HorrorRoom';
import { KeypadLock } from './components/KeypadLock';
import { ClueModal } from './components/ClueModal';
import { InstructionsModal } from './components/InstructionsModal';
import { GameOverModal } from './components/GameOverModal';
import { VictoryModal } from './components/VictoryModal';

export default function App() {
  // Game States
  const [gameState, setGameState] = useState<GameState>('intro');
  const [gameOverReason, setGameOverReason] = useState<GameOverReason>('time_up');

  // Timers & Battery
  const [timeLeft, setTimeLeft] = useState<number>(60.0);
  const [battery, setBattery] = useState<number>(100.0);
  const [flashlightOn, setFlashlightOn] = useState<boolean>(false);
  const [isTimerStarted, setIsTimerStarted] = useState<boolean>(false);

  // Puzzle Data
  const [targetCode, setTargetCode] = useState<string>('000');
  const [clues, setClues] = useState<ClueItem[]>([]);

  // Modals
  const [activeClueModal, setActiveClueModal] = useState<ClueItem | null>(null);
  const [isKeypadOpen, setIsKeypadOpen] = useState<boolean>(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState<boolean>(false);
  const [soundMuted, setSoundMuted] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);

  // Start new game session
  const startNewGame = useCallback(() => {
    const { code, clues: newClues } = generateNewPuzzle();
    setTargetCode(code);
    setClues(newClues);
    setTimeLeft(60.0);
    setBattery(100.0);
    setFlashlightOn(false);
    setIsTimerStarted(false);
    setActiveClueModal(null);
    setIsKeypadOpen(false);
    setIsInstructionsOpen(false);
    setGameState('playing');

    sound.startDrone();
  }, []);

  // Flashlight toggle handler - Starts the timer on first activation
  const toggleFlashlight = useCallback(() => {
    if (battery <= 0) return;
    setFlashlightOn((prev) => {
      const nextState = !prev;
      sound.playFlashlight(nextState);
      if (nextState) {
        setIsTimerStarted(true);
      }
      return nextState;
    });
  }, [battery]);

  // Sound toggle handler
  const handleToggleSound = useCallback(() => {
    setSoundMuted((prev) => {
      const next = !prev;
      sound.setMuted(next);
      return next;
    });
  }, []);

  // Main 100ms Game Loop (Countdown & Battery depletion)
  useEffect(() => {
    if (gameState !== 'playing') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      // 1. Time countdown (0.1s tick) - Starts on first flashlight activation and runs continuously
      if (isTimerStarted) {
        setTimeLeft((prevTime) => {
          const nextTime = Math.max(0, prevTime - 0.1);
          if (nextTime <= 0) {
            // Time expired!
            sound.stopDrone();
            sound.playJumpscare();
            setGameOverReason('time_up');
            setGameState('game_over');
            setFlashlightOn(false);
          }
          return nextTime;
        });
      }

      // 2. Battery drain if flashlight is ON: 5% per second = 0.5% per 100ms
      setBattery((prevBattery) => {
        if (!flashlightOn) return prevBattery;
        const nextBattery = Math.max(0, prevBattery - 0.5);
        if (nextBattery <= 0) {
          // Battery empty!
          sound.stopDrone();
          sound.playJumpscare();
          setFlashlightOn(false);
          setGameOverReason('battery_empty');
          setGameState('game_over');
        }
        return nextBattery;
      });
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, isTimerStarted, flashlightOn]);

  // Tension Heartbeat Loop when time < 15s or battery < 20%
  useEffect(() => {
    if (gameState !== 'playing' || !isTimerStarted) {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      return;
    }

    const isCritical = timeLeft <= 15 || battery <= 20;
    const intervalMs = timeLeft <= 8 ? 600 : isCritical ? 1000 : 2200;

    heartbeatRef.current = setInterval(() => {
      sound.playHeartbeat(isCritical ? 1.2 : 0.6);
    }, intervalMs);

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    };
  }, [gameState, isTimerStarted, timeLeft, battery]);

  // Keyboard Shortcuts (Spacebar to toggle flashlight, Esc to close modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input field
      const target = e.target as HTMLElement;
      if (target && target.tagName === 'INPUT') {
        return;
      }

      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        if (gameState === 'playing') {
          toggleFlashlight();
        }
      } else if (e.key === 'Escape') {
        setActiveClueModal(null);
        setIsKeypadOpen(false);
        setIsInstructionsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, toggleFlashlight]);

  // Handle Clue Discovery
  const handleSelectClue = (clue: ClueItem) => {
    // Mark clue as found
    setClues((prevClues) =>
      prevClues.map((c) => (c.id === clue.id ? { ...c, found: true } : c))
    );
    sound.playClueFound();
    setActiveClueModal({ ...clue, found: true });
  };

  // Handle Door Unlock Success
  const handleUnlockSuccess = () => {
    sound.stopDrone();
    setIsKeypadOpen(false);
    setActiveClueModal(null);
    setGameState('escaped');
  };

  const discoveredCount = clues.filter((c) => c.found).length;

  return (
    <main id="escape-cursed-room-app" className="relative w-full h-screen overflow-hidden bg-black font-kanit">
      {/* 1. Intro Screen */}
      {gameState === 'intro' && (
        <IntroScreen
          onStartGame={startNewGame}
          soundMuted={soundMuted}
          onToggleSound={handleToggleSound}
        />
      )}

      {/* 2. Active Game Screen */}
      {(gameState === 'playing' || gameState === 'game_over' || gameState === 'escaped') && (
        <>
          {/* Top HUD */}
          <HUD
            timeLeft={timeLeft}
            battery={battery}
            flashlightOn={flashlightOn}
            isTimerStarted={isTimerStarted}
            onToggleFlashlight={toggleFlashlight}
            clues={clues}
            onOpenClue={(clue) => setActiveClueModal(clue)}
            onOpenInstructions={() => setIsInstructionsOpen(true)}
            onOpenKeypad={() => setIsKeypadOpen(true)}
            soundMuted={soundMuted}
            onToggleSound={handleToggleSound}
            discoveredCount={discoveredCount}
          />

          {/* Interactive Horror Room Canvas */}
          <HorrorRoom
            flashlightOn={flashlightOn}
            battery={battery}
            clues={clues}
            isTimerStarted={isTimerStarted}
            onSelectClue={handleSelectClue}
            onOpenKeypad={() => setIsKeypadOpen(true)}
            onToggleFlashlight={toggleFlashlight}
          />
        </>
      )}

      {/* 3. Clue Detail Inspection Modal */}
      <ClueModal
        clue={activeClueModal}
        onClose={() => setActiveClueModal(null)}
        onOpenKeypad={() => setIsKeypadOpen(true)}
      />

      {/* 4. Keypad Lock Unlock Modal */}
      <KeypadLock
        isOpen={isKeypadOpen}
        onClose={() => setIsKeypadOpen(false)}
        targetCode={targetCode}
        onUnlockSuccess={handleUnlockSuccess}
        clues={clues}
      />

      {/* 5. Instructions Modal */}
      <InstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
      />

      {/* 6. Game Over Modal */}
      <GameOverModal
        isOpen={gameState === 'game_over'}
        reason={gameOverReason}
        targetCode={targetCode}
        onRestart={startNewGame}
      />

      {/* 7. Victory Modal */}
      <VictoryModal
        isOpen={gameState === 'escaped'}
        timeLeft={timeLeft}
        batteryLeft={battery}
        targetCode={targetCode}
        onPlayAgain={startNewGame}
      />
    </main>
  );
}
