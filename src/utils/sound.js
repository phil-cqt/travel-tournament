let audioCtx = null

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

function playNote(ctx, freq, startTime, duration, volume = 0.25, type = 'sine') {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(volume, startTime)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
  osc.start(startTime)
  osc.stop(startTime + duration)
}

export function playWinSound() {
  try {
    const ctx = getCtx()
    const t = ctx.currentTime
    // Ascending C major chord arpeggio
    playNote(ctx, 523.25, t, 0.3)        // C5
    playNote(ctx, 659.25, t + 0.1, 0.3)  // E5
    playNote(ctx, 783.99, t + 0.2, 0.35) // G5
  } catch (e) { /* Silently ignore audio errors */ }
}

export function playFinalFanfare() {
  try {
    const ctx = getCtx()
    const t = ctx.currentTime
    // Triumphant fanfare
    const melody = [
      [523.25, 0, 0.2],
      [523.25, 0.15, 0.2],
      [523.25, 0.3, 0.2],
      [415.30, 0.45, 0.15],
      [523.25, 0.6, 0.5],
      [659.25, 0.75, 0.2],
      [783.99, 0.95, 0.6],
    ]
    melody.forEach(([freq, delay, dur]) => {
      playNote(ctx, freq, t + delay, dur, 0.3, 'triangle')
    })
  } catch (e) { /* Silently ignore audio errors */ }
}

export function playClickSound() {
  try {
    const ctx = getCtx()
    const t = ctx.currentTime
    playNote(ctx, 880, t, 0.08, 0.1, 'sine')
  } catch (e) { /* Silently ignore */ }
}

export function playRoundEndSound() {
  try {
    const ctx = getCtx()
    const t = ctx.currentTime
    // Gentle success chord
    playNote(ctx, 392.0, t, 0.4)  // G4
    playNote(ctx, 523.25, t + 0.05, 0.4) // C5
    playNote(ctx, 659.25, t + 0.1, 0.5)  // E5
  } catch (e) { /* Silently ignore */ }
}
