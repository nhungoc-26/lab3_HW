
import { useState } from "react";

export function PianoControls({
  pressedCount,
  maxVoices = 8,
  onStopAll,
  onTestAudio,
  sampleStatus = "idle",
  recordedCount = 0,
  isPlayingSequence = false,
  onReplay,
  onStopSequence,
  onClearRecording,
}) {
  const [speed, setSpeed] = useState(1);

  return (
    <div className="piano-controls">
      <div className="piano-controls__info">
        <div className="piano-controls__status">
          <span className="status-dot" />
          <span>POLYPHONIC PIANO</span>
        </div>

        <div className="piano-controls__voices">
          <span>ACTIVE VOICES</span>
          <strong>{pressedCount} / {maxVoices}</strong>
        </div>
      </div>

      <div className="piano-controls__meter">
        {Array.from({ length: maxVoices }, (_, index) => (
          <span
            key={index}
            className={
              index < pressedCount
                ? "voice-bar voice-bar--active"
                : "voice-bar"
            }
          />
        ))}
      </div>

      <div className="piano-controls__actions">
        <button
          type="button"
          className="piano-controls__test"
          onClick={onTestAudio}
          disabled={sampleStatus === "loading"}
        >
          {sampleStatus === "loading"
            ? "LOADING..."
            : "▶ TEST AUDIO QUEUE"}
        </button>

        <button
          type="button"
          className="piano-controls__stop"
          onClick={onStopAll}
        >
          ■ STOP ALL
        </button>
      </div>

      <p className="piano-controls__queue-status" aria-live="polite">
        AUDIO QUEUE: {sampleStatus.toUpperCase()}
      </p>

      <div className="sequence-controls">
        <div className="sequence-controls__heading">
          <strong>MELODY RECORDER</strong>
          <span>{recordedCount} NOTES RECORDED</span>
        </div>

        <div className="sequence-controls__speed">
          <span>PLAYBACK SPEED</span>

          {[0.5, 1, 2].map((value) => (
            <button
              key={value}
              type="button"
              className={speed === value ? "speed-active" : ""}
              onClick={() => setSpeed(value)}
              aria-pressed={speed === value}
              disabled={isPlayingSequence}
            >
              {value.toFixed(1)}x
            </button>
          ))}
        </div>

        <div className="sequence-controls__actions">
          <button
            type="button"
            onClick={() => onReplay(speed)}
            disabled={recordedCount === 0 || isPlayingSequence}
          >
            ▶ REPLAY
          </button>

          <button
            type="button"
            onClick={onStopSequence}
            disabled={!isPlayingSequence}
          >
            ■ STOP SEQUENCE
          </button>

          <button
            type="button"
            onClick={onClearRecording}
            disabled={recordedCount === 0}
          >
            CLEAR
          </button>
        </div>

        <p aria-live="polite">
          {isPlayingSequence
            ? `PLAYING AT ${speed.toFixed(1)}x SPEED`
            : "READY TO RECORD OR REPLAY"}
        </p>
      </div>
    </div>
  );
}
