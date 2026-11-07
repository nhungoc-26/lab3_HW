
import { PianoKeyboard } from "./components/PianoKeyboard";
import { PianoControls } from "./components/PianoControls";
import { usePiano } from "./hooks/usePiano";
import "./App.css";

function App() {
  const {
    pressedNotes,
    noteOn,
    noteOff,
    stopAll,
    testAudioQueue,
    sampleStatus,
    recordedSequence,
    isPlayingSequence,
    replaySequence,
    stopSequence,
    clearRecording,
  } = usePiano();

  return (
    <main className="app">
      <header className="app-header">
        <div className="app-header__brand">
          <span className="app-header__icon">♫</span>
          <span>PIANO STUDIO</span>
        </div>

        <span className="app-header__badge">
          88-KEY DIGITAL PIANO
        </span>
      </header>

      <section className="hero">
        <p className="hero__eyebrow">YOUR PERSONAL MUSIC SPACE</p>

        <h1>
          Play Your
          <span> Music.</span>
        </h1>

        <p className="hero__description">
          Explore 88 piano keys and create your own melodies.
        </p>
      </section>

      <section className="piano-section">
        <PianoControls
          pressedCount={pressedNotes.size}
          maxVoices={8}
          onStopAll={stopAll}
          onTestAudio={testAudioQueue}
          sampleStatus={sampleStatus}
          recordedCount={recordedSequence.length}
          isPlayingSequence={isPlayingSequence}
          onReplay={replaySequence}
          onStopSequence={stopSequence}
          onClearRecording={clearRecording}
        />

        <div className="piano-frame">
          <div className="piano-frame__top">
            <span>GRAND PIANO</span>
            <span>A0 — C8</span>
          </div>

          <PianoKeyboard
            pressedNotes={pressedNotes}
            onNoteOn={noteOn}
            onNoteOff={noteOff}
          />
        </div>

        <p className="piano-hint">
          Click or press a piano key to play
        </p>
      </section>

      <footer className="app-footer">
        <span>PIANO STUDIO</span>
        <span>88 KEYS · 8 VOICES · FIFO AUDIO ENGINE</span>
      </footer>
    </main>
  );
}

export default App;
