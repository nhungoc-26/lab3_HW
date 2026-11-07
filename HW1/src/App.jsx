import { useCallback, useMemo, useRef, useState } from 'react';
import { DecibelMeter } from './components/DecibelMeter';
import { DrumPad } from './components/DrumPad';
import { HitLog } from './components/HitLog';
import { drumPads } from './data/drumPads';
import { useDrumKeyboard } from './hooks/useDrumKeyboard';
import './App.css';

const MAX_HIT_HISTORY = 8;

function App() {
  const [activePads, setActivePads] = useState(new Set());
  const [hits, setHits] = useState([]);
  const [decibels, setDecibels] = useState(-60);

  const audioContextRef = useRef(null);
  const masterGainRef = useRef(null);
  const analyserRef = useRef(null);

  const padMap = useMemo(
    () => new Map(drumPads.map((pad) => [pad.code, pad])),
    []
  );

  const createAudioContext = useCallback(() => {
    if (audioContextRef.current) {
      return audioContextRef.current;
    }

    const AudioContext =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContext) {
      return null;
    }

    const context = new AudioContext();

    const masterGain = context.createGain();
    masterGain.gain.value = 0.7;

    const analyser = context.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.75;

    masterGain.connect(analyser);
    analyser.connect(context.destination);

    audioContextRef.current = context;
    masterGainRef.current = masterGain;
    analyserRef.current = analyser;

    return context;
  }, []);

  const playDrumSound = useCallback(
    (pad) => {
      const context = createAudioContext();

      if (!context) {
        return;
      }

      if (context.state === 'suspended') {
        context.resume();
      }

      const oscillator = context.createOscillator();
      const gain = context.createGain();

      const now = context.currentTime;

      const soundSettings = {
        kick: {
          frequency: 110,
          endFrequency: 45,
          duration: 0.35,
          type: 'sine',
        },
        snare: {
          frequency: 180,
          endFrequency: 120,
          duration: 0.18,
          type: 'triangle',
        },
        hihat: {
          frequency: 900,
          endFrequency: 500,
          duration: 0.08,
          type: 'square',
        },
        tom: {
          frequency: 180,
          endFrequency: 90,
          duration: 0.25,
          type: 'sine',
        },
        clap: {
          frequency: 700,
          endFrequency: 350,
          duration: 0.12,
          type: 'square',
        },
        crash: {
          frequency: 600,
          endFrequency: 250,
          duration: 0.4,
          type: 'sawtooth',
        },
        ride: {
          frequency: 500,
          endFrequency: 300,
          duration: 0.35,
          type: 'triangle',
        },
      };

      const settings =
        soundSettings[pad.id] || soundSettings.kick;

      oscillator.type = settings.type;
      oscillator.frequency.setValueAtTime(
        settings.frequency,
        now
      );

      oscillator.frequency.exponentialRampToValueAtTime(
        settings.endFrequency,
        now + settings.duration
      );

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.8, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + settings.duration
      );

      oscillator.connect(gain);
      gain.connect(masterGainRef.current);

      oscillator.start(now);
      oscillator.stop(now + settings.duration);

      setDecibels(-6);

      window.setTimeout(() => {
        setDecibels(-60);
      }, 180);
    },
    [createAudioContext]
  );

  const triggerPad = useCallback(
    (padId) => {
      const pad = drumPads.find((item) => item.id === padId);

      if (!pad) {
        return;
      }

      setActivePads((current) => {
        const next = new Set(current);
        next.add(padId);
        return next;
      });

      playDrumSound(pad);

      const newHit = {
        id: `${padId}-${Date.now()}`,
        name: pad.name,
        key: pad.key,
        time: new Date().toLocaleTimeString(),
      };

      setHits((current) =>
        [newHit, ...current].slice(0, MAX_HIT_HISTORY)
      );
    },
    [playDrumSound]
  );

  const releasePad = useCallback((padId) => {
    setActivePads((current) => {
      const next = new Set(current);
      next.delete(padId);
      return next;
    });
  }, []);

  useDrumKeyboard(
    padMap,
    triggerPad,
    releasePad,
    true
  );

  const handlePointerTrigger = useCallback(
    (padId) => {
      triggerPad(padId);
    },
    [triggerPad]
  );

  const handlePointerRelease = useCallback(
    (padId) => {
      releasePad(padId);
    },
    [releasePad]
  );

  return (
    <main className="studio">
      <header className="studio__header">
        <div>
          <p className="eyebrow">PRODUCTION STUDIO</p>

          <h1>Drum Kit</h1>

          <p className="studio__description">
            Play the studio kit with your keyboard or mouse.
            Use W, A, S, D, J, K and L.
          </p>
        </div>

        <div
          className="keyboard-status"
          aria-label="Keyboard controls"
        >
          <span>Keyboard</span>
          <strong>W A S D J K L</strong>
        </div>
      </header>

      <DecibelMeter decibels={decibels} />

      <section
        className="drum-grid"
        aria-labelledby="drum-grid-title"
      >
        <h2 id="drum-grid-title" className="sr-only">
          Drum pads
        </h2>

        {drumPads.map((pad) => (
          <DrumPad
            key={pad.id}
            pad={pad}
            isActive={activePads.has(pad.id)}
            onTrigger={handlePointerTrigger}
            onRelease={handlePointerRelease}
          />
        ))}
      </section>

      <HitLog hits={hits} />

      <footer className="studio__footer">
        <p>
          Tip: Press and release a key to trigger a drum pad.
        </p>
      </footer>
    </main>
  );
}

export default App;