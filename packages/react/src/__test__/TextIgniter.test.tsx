import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { TextigniterReact } from '../components/TextIgniter';

// Mock the dynamic import for the web component
vi.mock('@mindfiredigital/textigniter-web-component', () => ({}));

describe('TextigniterReact', () => {
  it('renders a <text-igniter> element', () => {
    render(<TextigniterReact config={{ foo: 'bar' }} />);
    const el = document.querySelector('text-igniter');
    expect(el).not.toBeNull();
  });

  it('sets the config attribute on the web component', () => {
    render(<TextigniterReact config={{ foo: 'bar' }} />);
    const el = document.querySelector('text-igniter');
    expect(el?.getAttribute('config')).toContain('foo');
  });

  it('updates the config attribute when the prop changes', () => {
    const { rerender } = render(<TextigniterReact config={{ foo: 'bar' }} />);
    const el = document.querySelector('text-igniter');
    rerender(<TextigniterReact config={{ foo: 'baz' }} />);
    expect(el?.getAttribute('config')).toContain('baz');
  });
});
