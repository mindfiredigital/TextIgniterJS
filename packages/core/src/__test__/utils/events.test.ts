import { describe, it, expect, vi } from 'vitest';
import EventEmitter from '../../utils/events';

describe('EventEmitter', () => {
  it('calls listener when event is emitted', () => {
    const emitter = new EventEmitter();
    const listener = vi.fn();
    emitter.on('test', listener);
    emitter.emit('test', 42);
    expect(listener).toHaveBeenCalledWith(42);
  });

  it('calls all listeners for the same event', () => {
    const emitter = new EventEmitter();
    const listener1 = vi.fn();
    const listener2 = vi.fn();
    emitter.on('multi', listener1);
    emitter.on('multi', listener2);
    emitter.emit('multi', 'data');
    expect(listener1).toHaveBeenCalledWith('data');
    expect(listener2).toHaveBeenCalledWith('data');
  });

  it('does not call listeners for other events', () => {
    const emitter = new EventEmitter();
    const listener = vi.fn();
    emitter.on('foo', listener);
    emitter.emit('bar', 123);
    expect(listener).not.toHaveBeenCalled();
  });

  it('handles emit with no listeners gracefully', () => {
    const emitter = new EventEmitter();
    expect(() => emitter.emit('none')).not.toThrow();
  });

  it('can handle multiple emits', () => {
    const emitter = new EventEmitter();
    const listener = vi.fn();
    emitter.on('repeat', listener);
    emitter.emit('repeat', 1);
    emitter.emit('repeat', 2);
    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenCalledWith(1);
    expect(listener).toHaveBeenCalledWith(2);
  });
});
