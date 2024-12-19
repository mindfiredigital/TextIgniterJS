class EventEmitter {
    private events: { [key: string]: ((data?: any) => void)[] } = {};
    on(event: string, listener: (data?: any) => void): void {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(listener);
    }
    emit(event: string, data?: any): void {
        if (this.events[event]) {
            this.events[event].forEach(listener => listener(data));
        }
    }
}

export default EventEmitter;