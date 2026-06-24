import { motion } from 'framer-motion'
import { ROUND_NAMES } from './Tournament'

const SHORT_NAMES = ['R16', 'QF', 'SF', 'F']

export default function BracketView({ bracket, currentRound, currentMatchup }) {
  return (
    <div className="p-4">
      <p className="text-xs text-slate-600 text-center mb-4 uppercase tracking-widest">Full Bracket</p>
      <div className="overflow-x-auto -mx-4 px-4">
        <div className="flex gap-1.5 min-w-[580px]" style={{ height: '560px' }}>
          {bracket.map((round, rIdx) => (
            <BracketColumn
              key={rIdx}
              round={round}
              rIdx={rIdx}
              label={SHORT_NAMES[rIdx]}
              fullLabel={ROUND_NAMES[rIdx]}
              currentRound={currentRound}
              currentMatchup={currentMatchup}
            />
          ))}
        </div>
      </div>
      <p className="text-xs text-slate-700 text-center mt-3">← Scroll horizontally if needed</p>
    </div>
  )
}

function BracketColumn({ round, rIdx, label, fullLabel, currentRound, currentMatchup }) {
  const numMatchups = round.length
  const cellHeight = 560 / numMatchups // px per matchup

  return (
    <div className="flex flex-col flex-1 min-w-[120px]">
      {/* Column header */}
      <div className="text-center mb-1.5 shrink-0">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-cosmos-800 rounded px-1.5 py-0.5">
          {label}
        </span>
      </div>

      {/* Matchups */}
      <div className="flex flex-col flex-1">
        {round.map((matchup, mIdx) => {
          const isActive = rIdx === currentRound && mIdx === currentMatchup && !matchup.winner
          return (
            <div
              key={mIdx}
              className="flex flex-col justify-center"
              style={{ height: `${cellHeight}px` }}
            >
              <BracketMatchup
                matchup={matchup}
                isActive={isActive}
                isFinal={rIdx === 3}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function BracketMatchup({ matchup, isActive, isFinal }) {
  const [a, b] = matchup.countries

  return (
    <motion.div
      animate={isActive ? { scale: [1, 1.02, 1] } : {}}
      transition={{ repeat: Infinity, duration: 2 }}
      className={`
        mx-0.5 rounded-lg overflow-hidden border
        ${isActive
          ? 'border-violet-500/60 shadow-[0_0_8px_rgba(124,58,237,0.3)]'
          : 'border-cosmos-700/50'
        }
      `}
    >
      <BracketSlot country={a} isWinner={matchup.winner?.code === a?.code} />
      <div className="h-px bg-cosmos-700/40" />
      <BracketSlot country={b} isWinner={matchup.winner?.code === b?.code} />
    </motion.div>
  )
}

function BracketSlot({ country, isWinner }) {
  if (!country) {
    return (
      <div className="px-1.5 py-1.5 bg-cosmos-900/60 flex items-center gap-1 min-h-[22px]">
        <span className="text-[10px] text-slate-700">···</span>
      </div>
    )
  }

  return (
    <div
      className={`
        px-1.5 py-1.5 flex items-center gap-1 min-h-[22px] transition-colors
        ${isWinner
          ? 'bg-amber-400/15 border-l-2 border-l-amber-400'
          : 'bg-cosmos-800/60'
        }
      `}
    >
      <span className="text-sm leading-none">{country.flag}</span>
      <span
        className={`text-[10px] font-semibold leading-tight truncate ${
          isWinner ? 'text-amber-300' : 'text-slate-400'
        }`}
        style={{ maxWidth: '70px' }}
      >
        {country.name}
      </span>
      {isWinner && <span className="text-[9px] ml-auto text-amber-500">✓</span>}
    </div>
  )
}
