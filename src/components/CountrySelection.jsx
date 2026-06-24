import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { COUNTRIES } from '../data/countries'
import { playClickSound } from '../utils/sound'

const TARGET = 16

export default function CountrySelection({ onStart }) {
  const [selected, setSelected] = useState([])
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return COUNTRIES
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.continent.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
    )
  }, [search])

  const toggle = (country) => {
    playClickSound()
    setSelected((prev) => {
      const isSelected = prev.some((c) => c.code === country.code)
      if (isSelected) return prev.filter((c) => c.code !== country.code)
      if (prev.length >= TARGET) return prev
      return [...prev, country]
    })
  }

  const isSelected = (country) => selected.some((c) => c.code === country.code)
  const remaining = TARGET - selected.length
  const canStart = selected.length === TARGET

  const pickRandom = () => {
    const shuffled = [...COUNTRIES].sort(() => Math.random() - 0.5)
    setSelected(shuffled.slice(0, TARGET))
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-cosmos-950/95 backdrop-blur-md border-b border-cosmos-700/50 safe-area-top">
        <div className="px-4 pt-6 pb-3 max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h1 className="text-2xl font-black tracking-tight">
                ✈️ Travel Tournament
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Pick <span className="text-violet-400 font-bold">16 countries</span> to compete
              </p>
            </div>
            <button
              onClick={pickRandom}
              className="text-xs px-3 py-2 rounded-xl bg-cosmos-700 text-slate-300 hover:bg-cosmos-600 active:scale-95 transition-all font-medium"
            >
              🎲 Random
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-1.5 bg-cosmos-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-600 to-purple-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(selected.length / TARGET) * 100}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {selected.length}/{TARGET} selected
            {remaining > 0 && ` — ${remaining} more to go`}
          </p>

          {/* Search */}
          <div className="relative mt-3">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search countries…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-cosmos-800 border border-cosmos-700 text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Selected Strip */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-cosmos-900/60 border-b border-cosmos-700/40"
          >
            <div className="max-w-lg mx-auto px-4 py-2">
              <p className="text-xs text-slate-500 mb-1.5">Selected — tap to remove:</p>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                {selected.map((c) => (
                  <motion.button
                    key={c.code}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    onClick={() => toggle(c)}
                    className="flex-shrink-0 flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg bg-violet-600/20 border border-violet-500/30 hover:bg-red-500/20 hover:border-red-500/40 transition-colors group"
                    title={`Remove ${c.name}`}
                  >
                    <span className="text-lg leading-none">{c.flag}</span>
                    <span className="text-[9px] text-slate-400 group-hover:text-red-400 transition-colors">{c.code}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Country Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-3 max-w-lg mx-auto w-full">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-600">
            <p className="text-3xl mb-2">🌍</p>
            <p>No countries found for "{search}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {filtered.map((country) => {
              const sel = isSelected(country)
              const disabled = !sel && selected.length >= TARGET
              return (
                <motion.button
                  key={country.code}
                  onClick={() => !disabled && toggle(country)}
                  whileTap={disabled ? {} : { scale: 0.92 }}
                  className={`
                    relative flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all duration-150
                    min-h-[88px] justify-center
                    ${sel
                      ? 'border-violet-500 bg-violet-600/15 glow-purple'
                      : disabled
                      ? 'border-cosmos-800 bg-cosmos-900/30 opacity-35 cursor-not-allowed'
                      : 'border-cosmos-700 bg-cosmos-800/50 hover:border-cosmos-600 active:border-violet-600'
                    }
                  `}
                >
                  {sel && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1.5 right-1.5 w-4 h-4 bg-violet-500 rounded-full flex items-center justify-center"
                    >
                      <span className="text-[8px] text-white font-black">✓</span>
                    </motion.div>
                  )}
                  <span className="text-3xl leading-none">{country.flag}</span>
                  <span className="text-xs font-semibold text-slate-200 text-center leading-tight">
                    {country.name}
                  </span>
                  <span className="text-[9px] text-slate-600">{country.continent}</span>
                </motion.button>
              )
            })}
          </div>
        )}
        <div className="h-28" /> {/* Bottom spacer for CTA */}
      </div>

      {/* Sticky Start Button */}
      <div className="sticky bottom-0 z-20 bg-gradient-to-t from-cosmos-950 via-cosmos-950/95 to-transparent pt-6 pb-6 px-4">
        <div className="max-w-lg mx-auto">
          <motion.button
            onClick={() => canStart && onStart(selected)}
            disabled={!canStart}
            whileTap={canStart ? { scale: 0.97 } : {}}
            className={`
              w-full py-4 rounded-2xl font-black text-lg tracking-wide transition-all duration-200
              ${canStart
                ? 'bg-gradient-to-r from-violet-600 to-purple-500 text-white glow-purple shadow-2xl'
                : 'bg-cosmos-800 text-slate-600 cursor-not-allowed'
              }
            `}
          >
            {canStart
              ? '🏆 Start Tournament!'
              : `Pick ${remaining} more countr${remaining === 1 ? 'y' : 'ies'}`
            }
          </motion.button>
        </div>
      </div>
    </div>
  )
}
