'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, Award, ChevronRight } from 'lucide-react';

interface BattleLogViewerProps {
  logs: string[];
  victory: boolean;
  onFinished?: () => void;
}

export function BattleLogViewer({ logs, victory, onFinished }: BattleLogViewerProps) {
  const [displayedLogs, setDisplayedLogs] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentIndex < logs.length && isTyping) {
      const timer = setTimeout(() => {
        setDisplayedLogs((prev) => [...prev, logs[currentIndex]]);
        setCurrentIndex((prev) => prev + 1);
      }, 500);
      return () => clearTimeout(timer);
    } else if (currentIndex >= logs.length) {
      setIsTyping(false);
      onFinished?.();
    }
  }, [currentIndex, logs, isTyping, onFinished]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayedLogs]);

  const handleSkip = () => {
    setDisplayedLogs(logs);
    setCurrentIndex(logs.length);
    setIsTyping(false);
    onFinished?.();
  };

  const getLogStyle = (log: string) => {
    const lowerLog = log.toLowerCase();
    if (lowerLog.includes('victory') || lowerLog.includes('defeated') || lowerLog.includes('vaincu') || lowerLog.includes('remporte')) {
      return 'text-[#8b5006] font-bold font-serif text-lg py-2 border-y border-[#c2c8bf]/30 my-2 flex items-center gap-2 bg-[#f2a65a]/10 px-3 rounded-lg';
    }
    if (lowerLog.includes('level up') || lowerLog.includes('gagne')) {
      return 'text-[#8b5006] font-bold bg-[#f2a65a]/5 px-2 py-1 rounded';
    }
    // Attaque du héros (généralement la première ligne ou alternée)
    if (lowerLog.includes('attacks') && !lowerLog.includes('attacks hero') && !lowerLog.includes('attacks ' + logs[0]?.split(' ')[0]?.toLowerCase())) {
      // Pour faire simple, si la phrase ne parle pas d'attaquer le héros
      return 'text-primary font-medium flex items-center gap-1.5';
    }
    // Attaque du monstre
    if (lowerLog.includes('attacks') || lowerLog.includes('dégâts') || lowerLog.includes('damage')) {
      return 'text-red-700 font-medium flex items-center gap-1.5';
    }
    return 'text-[#393E41] flex items-center gap-1.5';
  };

  return (
    <div className="flex flex-col h-full bg-[#f2eeee]/30 border border-card-border rounded-xl p-5 shadow-inner">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-serif font-semibold text-lg text-[#171c1f] flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-primary" />
          Journal de Combat
        </h3>
        {isTyping && (
          <Button variant="ghost" size="sm" onClick={handleSkip} className="text-xs">
            Passer l'animation
          </Button>
        )}
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2.5 max-h-[350px] min-h-[250px] border border-card-border/50 rounded-lg p-3 bg-white"
      >
        {displayedLogs.map((log, index) => {
          const isSpecial = log.toLowerCase().includes('victory') || log.toLowerCase().includes('defeated') || log.toLowerCase().includes('remporte');
          return (
            <div
              key={index}
              className={`text-sm py-1.5 transition-all duration-300 animate-fade-in ${getLogStyle(log)}`}
            >
              {!isSpecial && <ChevronRight className="h-3.5 w-3.5 text-gray-400 shrink-0" />}
              {isSpecial && <Award className="h-5 w-5 text-[#8b5006] shrink-0 animate-bounce" />}
              <span>{log}</span>
            </div>
          );
        })}
      </div>

      {!isTyping && (
        <div className="mt-4 p-4 rounded-xl border border-[#c2c8bf]/50 bg-[#fbf6f6] flex flex-col items-center justify-center text-center shadow-sm">
          {victory ? (
            <>
              <h4 className="font-serif font-bold text-xl text-[#8b5006] mb-1">Victoire Glorieuse !</h4>
              <p className="text-xs text-[#393E41]/80">Le monstre a été terrassé. Vos exploits résonnent dans tout le royaume d'Aethelgard !</p>
            </>
          ) : (
            <>
              <h4 className="font-serif font-bold text-xl text-red-600 mb-1">Défaite</h4>
              <p className="text-xs text-[#393E41]/80">Votre héros a succombé au combat. Prenez du repos, renforcez vos équipements et retentez votre chance.</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
