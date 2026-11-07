
export class AudioTaskQueue {
  constructor(audioContext) {
    this.audioContext = audioContext;
    this.queue = [];
    this.isProcessing = false;
    this.activeController = null;
  }

  enqueue(trackUrl) {
    return new Promise((resolve, reject) => {
      const controller = new AbortController();

      this.queue.push({
        trackUrl,
        controller,
        resolve,
        reject,
      });

      this.processNext();
    });
  }

  async processNext() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    const task = this.queue.shift();
    this.activeController = task.controller;

    try {
      const response = await fetch(task.trackUrl, {
        signal: task.controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Audio loading failed: ${response.status}`);
      }

      const audioData = await response.arrayBuffer();

      if (task.controller.signal.aborted) {
        throw new Error("Audio task cancelled");
      }

      const audioBuffer =
        await this.audioContext.decodeAudioData(audioData);

      if (task.controller.signal.aborted) {
        throw new Error("Audio task cancelled");
      }

      task.resolve(audioBuffer);
    } catch (error) {
      task.reject(error);
    } finally {
      this.activeController = null;
      this.isProcessing = false;

      this.processNext();
    }
  }

  cancelCurrent() {
    this.activeController?.abort();
  }

  cancelAll() {
    this.cancelCurrent();

    const error = new Error("Audio queue cancelled");
    error.name = "AbortError";

    this.queue.forEach((task) => {
      task.controller.abort();
      task.reject(error);
    });

    this.queue = [];
  }
}
