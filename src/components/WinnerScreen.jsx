import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Confetti from 'react-confetti'
import { playFinalFanfare } from '../utils/sound'

export default function WinnerScreen({ winner, onRestart }) {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })
  const [confettiActive, setConfettiActive] = useState(true)
  const [shared, setShared] = useState(false)

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    // Play fanfare on mount
    const timer = setTimeout(() => playFinalFanfare(), 300)
    // Stop confetti after 8 seconds
    const stopTimer = setTimeout(() => setConfettiActive(false), 8000)
    return () => {
      clearTimeout(timer)
      clearTimeout(stopTimer)
    }
  }, [])

  const handleShare = async () => {
    const text = `🏆 Our group chose ${winner.flag} ${winner.name} as our next travel destination! Decided by Travel Tournament ✈️`
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Travel Tournament Winner!', text })
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      } catch (e) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(text)
        setShared(true)
        setTimeout(() => setShared(false), 2000)
      } catch (e) {}
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Confetti */}
      {confettiActive && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={400}
          gravity={0.25}
          colors={['#7c3aed', '#a855f7', '#f59e0b', '#fbbf24', '#10b981', '#3b82f6', '#ef4444', '#ec4899']}
          tweenDuration={8000}
        />
      )}

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm mx-auto">
        {/* Trophy */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 12 }}
          className="animate-float"
        >
          <span className="text-7xl">🏆</span>
        </motion.div>

        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-xs font-black text-amber-500 uppercase tracking-[0.3em] mt-4 mb-2"
        >
          Your next destination
        </motion.p>

        {/* Flag */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 250, damping: 14 }}
          className="my-3"
        >
          <span className="text-[6rem] leading-none filter drop-shadow-2xl">
            {winner.flag}
          </span>
        </motion.div>

        {/* Country name */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
          className="text-4xl font-black mt-2 text-white glow-gold leading-tight"
        >
          {winner.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          className="text-slate-400 mt-2 text-sm"
        >
          🎉 The group has decided — pack your bags!
        </motion.p>

        {/* Stars decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex gap-1 mt-3 text-amber-400"
        >
          {[...Array(5)].map((_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1 + i * 0.08, type: 'spring' }}
              className="text-lg"
            >
              ⭐
            </motion.span>
          ))}
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col gap-3 mt-8 w-full"
        >
          {/* Share button */}
          <button
            onClick={handleShare}
            className={`
              w-full py-4 rounded-2xl font-black text-base transition-all active:scale-97
              ${shared
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-violet-600 to-purple-500 text-white glow-purple'
              }
            `}
          >
            {shared ? '✅ Copied to clipboard!' : '📲 Share the winner'}
          </button>

          {/* Play again */}
          <button
            onClick={onRestart}
            className="w-full py-4 rounded-2xl font-bold text-base bg-cosmos-800 text-slate-300 border border-cosmos-700 hover:bg-cosmos-700 active:scale-97 transition-all"
          >
            🔄 New Tournament
          </button>
        </motion.div>
      </div>
    </div>
  )
}
