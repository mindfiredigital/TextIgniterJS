import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SpeechToTextHandler } from '../../handlers/speechToText';
import TextDocument from '../../textDocument';
import EditorView from '../../view/editorView';

describe('SpeechToTextHandler', () => {
  let document: any;
  let editorView: any;
  let onStateChange: any;
  let insertText: any;
  let handler: SpeechToTextHandler;
  let mockRecognitionInstance: any;

  beforeEach(() => {
    document = {} as TextDocument;
    editorView = {} as EditorView;
    onStateChange = vi.fn();
    insertText = vi.fn();

    mockRecognitionInstance = {
      start: vi.fn(),
      stop: vi.fn(),
      continuous: false,
      interimResults: false,
    };

    const mockSpeechRecognition = vi.fn(() => mockRecognitionInstance);
    (window as any).SpeechRecognition = mockSpeechRecognition;
    (window as any).webkitSpeechRecognition = undefined;

    handler = new SpeechToTextHandler(
      document,
      editorView,
      onStateChange,
      insertText
    );
  });

  it('correctly intialized when sppechrecognization is supported', () => {
    expect((handler as any).recognition).toBeDefined();
    expect((handler as any).recognition.continuous).toBe(true);
    expect((handler as any).recognition.interimResults).toBe(false);
  });

  it('toggele recording button for the start the recording', () => {
    handler.toggleRecording();
    expect(mockRecognitionInstance.start).toHaveBeenCalled();
    expect((handler as any).isRecording).toBe(true);
    expect(onStateChange).toHaveBeenCalledWith(true);
  });

  it('toggle recording button for the stop the recording', () => {
    handler.toggleRecording();
    handler.toggleRecording();
    expect(mockRecognitionInstance.stop).toHaveBeenCalled();
    expect((handler as any).isRecording).toBe(false);
    expect(onStateChange).toHaveBeenCalledWith(false);
  });

  it('after speak text should be inserted', () => {
    handler.toggleRecording();

    const mockEvent = {
      results: [
        Object.assign([{ transcript: 'hello world' }], { isFinal: true }),
      ],
    } as any;
    mockEvent.results[0].isFinal = true;

    (handler as any).recognition.onresult(mockEvent);
    expect(insertText).toHaveBeenCalledWith('hello world ');
  });

  it('handles recognition errors', () => {
    handler.toggleRecording();
    const spyOnConsole = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    (handler as any).recognition.onerror({ error: 'network' });
    expect(spyOnConsole).toHaveBeenCalled();
    expect(mockRecognitionInstance.stop).toHaveBeenCalled();
    expect((handler as any).isRecording).toBe(false);

    spyOnConsole.mockRestore();
  });

  it('ignores no-speech error gracefully', () => {
    handler.toggleRecording();
    const spyOnConsole = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    (handler as any).recognition.onerror({ error: 'no-speech' });
    expect(spyOnConsole).toHaveBeenCalled();
    expect(mockRecognitionInstance.stop).not.toHaveBeenCalled();

    spyOnConsole.mockRestore();
  });

  it('stops recording on recognition end event', () => {
    handler.toggleRecording();
    expect((handler as any).isRecording).toBe(true);

    (handler as any).recognition.onend();
    expect(mockRecognitionInstance.stop).toHaveBeenCalled();
    expect((handler as any).isRecording).toBe(false);
  });
});
