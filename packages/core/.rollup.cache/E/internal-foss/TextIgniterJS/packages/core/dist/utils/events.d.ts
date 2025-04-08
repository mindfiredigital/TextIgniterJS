declare class EventEmitter {
  private events;
  on(event: string, listener: (data?: any) => void): void;
  emit(event: string, data?: any): void;
}
export default EventEmitter;
