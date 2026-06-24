import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import CountrySelection from './components/CountrySelection'
import Tournament from './components/Tournament'
import WinnerScreen from './components/WinnerScreen'

const SCREENS = {
  SELECTION: 'selection',
  TOURNAMENT: 'tournament',
  WINNER: 'winner',
}

export default function App() {
  const [screen, setScreen] = useState(SCREENS.SELECTION)
  const [selectedCountries, setSelectedCountries] = useState([])
  const [winner, setWinner] = useState(null)

  const handleStartTournament = (countries) => {
    setSelectedCountries(countries)
    setScreen(SCREENS.TOURNAMENT)
  }

  const handleWinner = (country) => {
    setWinner(country)
    setScreen(SCREENS.WINNER)
  }

  const handleRestart = () => {
    setSelectedCountries([])
    setWinner(null)
    setScreen(SCREENS.SELECTION)
  }

  return (
    <div className="min-h-screen bg-cosmos-950 text-slate-100 select-none">
      <AnimatePresence mode="wait">
        {screen === SCREENS.SELECTION && (
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <CountrySelection onStart={handleStartTournament} />
          </motion.div>
        )}

        {screen === SCREENS.TOURNAMENT && (
          <motion.div
            key="tournament"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.35 }}
          >
            <Tournament
              countries={selectedCountries}
              onWinner={handleWinner}
            />
          </motion.div>
        )}

        {screen === SCREENS.WINNER && (
          <motion.div
            key="winner"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, type: 'spring', damping: 15 }}
          >
            <WinnerScreen winner={winner} onRestart={handleRestart} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
