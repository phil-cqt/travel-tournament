import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Matchup from './Matchup'
import BracketView from './BracketView'
import { playWinSound, playRoundEndSound } from '../utils/sound'

export const ROUND_NAMES = ['Round of 16', 'Quarter Finals', 'Semi Finals', '⚡ Final']
const ROUND_EMOJIS = ['⚔️', '🔥', '💥', '👑']

function initBracket(countries) {
  const shuffled = [...countries].sort(() => Math.random() - 0.5)
  return [
    // Round of 16 — 8 matchups
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      countries: [shuffled[i * 2], shuffled[i * 2 + 1]],
      winner: null,
    })),
    // Quarter Finals — 4 matchups
    Array.from({ length: 4 }, (_, i) => ({
      id: i,
      countries: [null, null],
      winner: null,
    })),
    // Semi Finals — 2 matchups
    Array.from({ length: 2 }, (_, i) => ({
      id: i,
      countries: [null, null],
      winner: null,
    })),
    // Final — 1 matchup
    [{ id: 0, countries: [null, null], winner: null }],
  ]
}

export default function Tournament({ countries, onWinner }) {
  const [bracket, setBracket] = useState(() => initBracket(countries))
  const [roundIdx, setRoundIdx] = useState(0)
  const [matchupIdx, setMatchupIdx] = useState(0)
  const [view, setView] = useState('matchup') // 'matchup' | 'bracket'
  const [isLocked, setIsLocked] = useState(false)
  const [roundTransition, setRoundTransition] = useState(null) // null | roundName

  const totalInRound = bracket[roundIdx].length
  const currentMatchup = bracket[roundIdx][matchupIdx]
  const matchesPlayed = bracket.slice(0, roundIdx).reduce((a, r) => a + r.length, 0) + matchupIdx
  const totalMatches = 8 + 4 + 2 + 1

  const advanceGame = useCallback((country, curRoundIdx, curMatchupIdx) => {
    // Determine next state
    const roundLen = bracket[curRoundIdx].length
    const isLastInRound = curMatchupIdx + 1 >= roundLen
    const isFinal = curRoundIdx === 3

    if (isFinal) {
      setTimeout(() => onWinner(country), 800)
      return
    }

    if (isLastInRound) {
      playRoundEndSound()
      const nextRound = ROUND_NAMES[curRoundIdx + 1]
      setRoundTransition(nextRound)
      setTimeout(() => {
        setRoundTransition(null)
        setRoundIdx(curRoundIdx + 1)
        setMatchupIdx(0)
        setIsLocked(false)
      }, 1800)
    } else {
      setTimeout(() => {
        setMatchupIdx(curMatchupIdx + 1)
        setIsLocked(false)
      }, 400)
    }
  }, [bracket, onWinner])

  const pickWinner = useCallback((country) => {
    if (isLocked) return
    setIsLocked(true)
    playWinSound()

    const curRoundIdx = roundIdx
    const curMatchupIdx = matchupIdx

    setBracket((prev) => {
      const next = prev.map((round) =>
        round.map((m) => ({ ...m, countries: [...m.countries] }))
      )
      next[curRoundIdx][curMatchupIdx].winner = country

      // Advance winner to next round
      if (curRoundIdx < 3) {
        const nextMatchup = Math.floor(curMatchupIdx / 2)
        const slot = curMatchupIdx % 2
        next[curRoundIdx + 1][nextMatchup].countries[slot] = country
      }
      return next
    })

    advanceGame(country, curRoundIdx, curMatchupIdx)
  }, [isLocked, roundIdx, matchupIdx, advanceGame])

  const pickRandom = useCallback(() => {
    if (isLocked) return
    const { countries: mc } = currentMatchup
    const both = mc.filter(Boolean)
    if (both.length < 2) return
    const random = both[Math.floor(Math.random() * 2)]
    pickWinner(random)
  }, [isLocked, currentMatchup, pickWinner])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-cosmos-950/95 backdrop-blur-md border-b border-cosmos-700/50">
        <div className="max-w-lg mx-auto px-4 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{ROUND_EMOJIS[roundIdx]}</span>
                <span className="text-sm font-black text-violet-400 uppercase tracking-widest">
                  {ROUND_NAMES[roundIdx]}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Match {matchupIdx + 1} of {totalInRound}
                <span className="ml-2 text-slate-600">·</span>
                <span className="ml-2">{matchesPlayed}/{totalMatches} total</span>
              </p>
            </div>
            <button
              onClick={() => setView(v => v === 'matchup' ? 'bracket' : 'matchup')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cosmos-800 text-xs font-semibold text-slate-300 hover:bg-cosmos-700 active:scale-95 transition-all border border-cosmos-700"
            >
              {view === 'matchup' ? (
                <><span>🏆</span> Bracket</>
              ) : (
                <><span>⚔️</span> Match</>
              )}
            </button>
          </div>

          {/* Overall progress */}
          <div className="mt-2.5 h-1 bg-cosmos-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full"
              animate={{ width: `${(matchesPlayed / totalMatches) * 100}%` }}
              transition={{ type: 'spring', stiffness: 200, damping: 30 }}
            />
          </div>
        </div>
      </div>

      {/* Round transition overlay */}
      <AnimatePresence>
        {roundTransition && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-cosmos-950/90 backdrop-blur-sm"
          >
            <div className="text-center">
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="text-6xl mb-4">🎉</motion.div>
              <p className="text-slate-400 text-sm uppercase tracking-widest mb-2">Up next</p>
              <h2 className="text-3xl font-black text-white">{roundTransition}</h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="flex-1">
        {view === 'matchup' ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${roundIdx}-${matchupIdx}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.25 }}
            >
              <Matchup
                matchup={currentMatchup}
                onPick={pickWinner}
                onRandom={pickRandom}
                roundName={ROUND_NAMES[roundIdx]}
                matchNum={matchupIdx + 1}
                totalMatches={totalInRound}
                locked={isLocked}
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <BracketView bracket={bracket} roundNames={ROUND_NAMES} currentRound={roundIdx} currentMatchup={matchupIdx} />
        )}
      </div>
    </div>
  )
}
