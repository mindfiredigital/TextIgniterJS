export class TextToSpeechHandler {
  private synth: SpeechSynthesis;
  private isSpeaking: boolean = false;
  private onStateChange: (isSpeaking: boolean) => void;

  constructor(onStateChange: (isSpeaking: boolean) => void) {
    this.synth = window.speechSynthesis;
    this.onStateChange = onStateChange;
  }

  private getHindiVoice(): SpeechSynthesisVoice | null {
    const voices = this.synth.getVoices();
    return (
      voices.find(v => v.name === 'Google हिन्दी' || v.lang === 'hi-IN') || null
    );
  }

  public speak(text: string) {
    if (!text || text.trim() === '') return;

    if (this.synth.speaking) {
      this.synth.cancel();
    }

    const utter = new SpeechSynthesisUtterance(text);

    const hindiVoice = this.getHindiVoice();
    if (hindiVoice) {
      utter.voice = hindiVoice;
      utter.lang = 'hi-IN';
    }

    utter.onstart = () => {
      this.isSpeaking = true;
      this.onStateChange(true);
    };

    utter.onend = () => {
      this.isSpeaking = false;
      this.onStateChange(false);
    };

    utter.onerror = () => {
      this.isSpeaking = false;
      this.onStateChange(false);
    };

    this.synth.speak(utter);
  }

  public stop() {
    if (this.synth.speaking) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.onStateChange(false);
    }
  }

  public toggle(text: string) {
    if (this.isSpeaking) {
      this.stop();
    } else {
      this.speak(text);
    }
  }
}
