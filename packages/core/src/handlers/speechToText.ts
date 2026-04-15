import TextDocument from '../textDocument';
import EditorView from '../view/editorView';

export class SpeechToTextHandler {
  private document: TextDocument;
  private editorView: EditorView;
  private recognition: any;
  private isRecording: boolean = false;
  private silenceTimer: NodeJS.Timeout | null = null;
  private onStateChange: (isRecording: boolean) => void;
  private insertText: (text: string) => void;

  constructor(
    document: TextDocument,
    editorView: EditorView,
    onStateChange: (isRecording: boolean) => void,
    insertText: (text: string) => void
  ) {
    this.document = document;
    this.editorView = editorView;
    this.onStateChange = onStateChange;
    this.insertText = insertText;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = false;

      this.recognition.onresult = (event: any) => {
        this.resetSilenceTimer();
        const result = event.results[event.results.length - 1];
        if (result.isFinal) {
          const text = result[0].transcript + ' ';
          this.insertText(text);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          this.stopRecording();
        }
      };

      this.recognition.onend = () => {
        this.stopRecording();
      };
    } else {
      console.warn('Speech Recognition API not supported in this browser.');
    }
  }

  public toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  private startRecording() {
    if (!this.recognition) return;
    try {
      this.recognition.start();
      this.isRecording = true;
      this.onStateChange(true);
      this.resetSilenceTimer();
    } catch (e) {
      console.error('Failed to start speech recognition:', e);
    }
  }

  private stopRecording() {
    if (!this.recognition || !this.isRecording) return;
    try {
      this.recognition.stop();
    } catch (e) {
      console.warn('Some problem occur during the stop recording  . . . ', e);
    }
    this.isRecording = false;
    this.onStateChange(false);
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
  }

  private resetSilenceTimer() {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
    }
    this.silenceTimer = setTimeout(() => {
      this.stopRecording();
    }, 4000);
  }
}
