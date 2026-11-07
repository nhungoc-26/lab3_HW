import { AudioTaskQueue } from "./AudioTaskQueue";

export class VoiceManager {
  constructor(maxVoices = 8) {
    this.maxVoices = maxVoices;
    this.audioContext = null;

    // Map preserves insertion order, allowing FIFO voice management.
    // Structure: midi -> { osc, gain }
    this.voices = new Map();

    this.audioQueue = null;
  }

  // Create AudioContext when the user first plays a note.
  getAudioContext() {
    if (!this.audioContext) {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContextClass) {
        throw new Error("Web Audio API is not supported.");
      }

      this.audioContext = new AudioContextClass();
      this.audioQueue = new AudioTaskQueue(this.audioContext);
    }

    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    return this.audioContext;
  }

  // Calculate frequency from MIDI note number.
  getFrequency(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  // Load an audio file through AudioTaskQueue.
  loadAudio(trackUrl) {
    this.getAudioContext();
    return this.audioQueue.enqueue(trackUrl);
  }

  // Play a decoded audio buffer.
  playBuffer(audioBuffer) {
    const context = this.getAudioContext();

    const source = context.createBufferSource();
    const gain = context.createGain();

    source.buffer = audioBuffer;
    gain.gain.value = 0.2;

    source.connect(gain);
    gain.connect(context.destination);

    source.start();

    return source;
  }

  // Play a piano note.
  noteOn(midi, freqHz = this.getFrequency(midi)) {
    const context = this.getAudioContext();

    // Prevent duplicate voices for the same MIDI note.
    if (this.voices.has(midi)) {
      return;
    }

    // FIFO voice stealing: release the oldest active voice.
    if (this.voices.size >= this.maxVoices) {
      const oldestMidi = this.voices.keys().next().value;
      this.noteOff(oldestMidi);
    }

    const osc = context.createOscillator();
    const gain = context.createGain();

    osc.type = "triangle";

    osc.frequency.setValueAtTime(
      freqHz,
      context.currentTime
    );

    // Short attack envelope.
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.2,
      context.currentTime + 0.02
    );

    osc.connect(gain);
    gain.connect(context.destination);

    osc.start();

    // Map insertion order records the order in which voices started.
    this.voices.set(midi, { osc, gain });
  }

  // Release one voice with a click-free fade-out.
  noteOff(midi) {
    const voice = this.voices.get(midi);

    if (!voice || !this.audioContext) {
      return;
    }

    const now = this.audioContext.currentTime;
    const currentGain = Math.max(voice.gain.gain.value, 0.0001);

    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(currentGain, now);

    voice.gain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + 0.04
    );

    // Stop after the fade-out ramp.
    voice.osc.stop(now + 0.045);

    voice.osc.onended = () => {
      voice.osc.disconnect();
      voice.gain.disconnect();
    };

    // Removing the entry preserves FIFO order for remaining voices.
    this.voices.delete(midi);
  }

  // Stop all active voices.
  stopAll() {
    for (const midi of [...this.voices.keys()]) {
      this.noteOff(midi);
    }
  }

  // Close AudioContext and cancel queued audio tasks.
  async dispose() {
    this.stopAll();

    if (this.audioQueue) {
      this.audioQueue.cancelAll();
      this.audioQueue = null;
    }

    if (this.audioContext) {
      await this.audioContext.close();
      this.audioContext = null;
    }
  }
}