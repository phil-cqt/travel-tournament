import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Matchup({ matchup, onPick, onRandom, roundName, matchNum, totalMatches, locked }) {
  const [chosen, setChosen] = useState(null)
  const [a, b] = matchup.countries

  // Reset when matchup changes
  useEffect(() => { setChosen(null) }, [matchup])

  const handlePick = (country) => {
    if (locked || chosen) return
    setChosen(country)
    setTimeout(() => onPick(country), 550)
  }

  const stateOf = (c) => {
    if (!chosen) return 'idle'
    return chosen.code === c.code ? 'winner' : 'loser'
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 flex flex-col items-center">
      {/* Match label */}
      <div className="text-center mb-6">
        <p className="text-xs text-slate-600 uppercase tracking-widest font-semibold">
          Match {matchNum} / {totalMatches}
        </p>
        <p className="text-sm text-slate-400 mt-0.5">Tap the country you'd rather visit</p>
      </div>

      <div className="w-full flex flex-col gap-3">
        <CountryCard
          country={a}
          state={stateOf(a)}
          onClick={() => handlePick(a)}
        />

        {/* VS divider */}
        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-cosmos-700" />
          <motion.span
            animate={chosen ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="text-xl font-black text-cosmos-600 px-2"
          >
            VS
          </motion.span>
          <div className="flex-1 h-px bg-cosmos-700" />
        </div>

        <CountryCard
          country={b}
          state={stateOf(b)}
          onClick={() => handlePick(b)}
        />
      </div>

      {/* Random pick */}
      <AnimatePresence>
        {!chosen && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ delay: 0.3 }}
            onClick={onRandom}
            disabled={locked}
            className="mt-6 text-xs text-slate-600 hover:text-slate-400 underline underline-offset-2 transition-colors disabled:opacity-30 flex items-center gap-1"
          >
            🎲 Can't decide? Pick randomly
          </motion.button>
        )}
      </AnimatePresence>

      {/* Winner announcement */}
      <AnimatePresence>
        {chosen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="mt-6 text-center"
          >
            <motion.p
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 0.4 }}
              className="text-base font-black text-amber-400"
            >
              {chosen.flag} {chosen.name} advances! 🚀
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CountryCard({ country, state, onClick }) {
  const isWinner = state === 'winner'
  const isLoser = state === 'loser'

  return (
    <motion.button
      onClick={onClick}
      animate={
        isWinner
          ? { scale: 1.04, opacity: 1 }
          : isLoser
          ? { scale: 0.94, opacity: 0.25 }
          : { scale: 1, opacity: 1 }
      }
      whileTap={state === 'idle' ? { scale: 0.96 } : {}}
      transition={{ duration: 0.35, type: 'spring', stiffness: 300, damping: 20 }}
      className={`
        relative w-full flex items-center gap-4 px-5 py-5 rounded-2xl border-2 transition-colors duration-200
        min-h-[88px] overflow-hidden
        ${isWinner
          ? 'border-amber-400 bg-amber-400/10 glow-gold-sm'
          : isLoser
          ? 'border-cosmos-800 bg-cosmos-900/40'
          : 'border-cosmos-700 bg-cosmos-800/60 hover:border-violet-600/50 active:border-violet-500'
        }
      `}
    >
      {/* Shimmer on winner */}
      {isWinner && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent skew-x-12 pointer-events-none"
        />
      )}

      <span className="text-5xl shrink-0 leading-none">{country.flag}</span>

      <div className="flex-1 text-left min-w-0">
        <p className={`text-lg font-black leading-tight truncate ${isWinner ? 'text-amber-300' : 'text-slate-100'}`}>
          {country.name}
        </p>
        <p className={`text-xs mt-0.5 ${isWinner ? 'text-amber-500' : 'text-slate-600'}`}>
          {country.continent ?? ''}
        </p>
      </div>

      {/* State icon */}
      <div className="shrink-0">
        {isWinner ? (
          <motion.span
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="text-2xl"
          >
            ✅
          </motion.span>
        ) : isLoser ? (
          <span className="text-2xl opacity-60">❌</span>
        ) : (
          <span className="text-cosmos-600 text-xl">›</span>
        )}
      </div>
    </motion.button>
  )
}
