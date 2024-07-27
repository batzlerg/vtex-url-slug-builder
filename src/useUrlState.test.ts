import { describe, test, beforeAll, afterAll, beforeEach, afterEach, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useUrlState } from './useUrlState';

describe('useUrlState', () => {
  const originalLocation = window.location;

  beforeAll(() => {
    // Save the original window.location object
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        hash: '',
        assign: vi.fn(),
        replace: vi.fn(),
        reload: vi.fn(),
      },
      writable: true,
    });
  });

  afterAll(() => {
    // Restore the original window.location object
    window.location = originalLocation;
  });

  beforeEach(() => {
    // Reset the hash before each test
    window.location.hash = '';
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('should initialize state from URL hash', () => {
    window.location.hash = '#/initial/state';
    const { result } = renderHook(() => useUrlState(['']));

    expect(result.current[0]).toEqual(['initial', 'state']);
  });

  test('should update state when URL hash changes', () => {
    const { result } = renderHook(() => useUrlState(['']));

    act(() => {
      window.location.hash = '#/updated/state';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    expect(result.current[0]).toEqual(['updated', 'state']);
  });

  test('should update URL hash when state changes', () => {
    const { result } = renderHook(() => useUrlState(['']));

    act(() => {
      result.current[1](['new', 'state']);
    });

    expect(window.location.hash).toBe('/new/state');
  });

  test('should correctly encode and decode special characters', () => {
    window.location.hash = '#/something%20%26%20something%20else';
    const { result } = renderHook(() => useUrlState(['']));

    expect(result.current[0]).toEqual(['something & something else']);

    act(() => {
      result.current[1](['another & test']);
    });

    expect(window.location.hash).toBe('/another%20%26%20test');
  });

  test('should handle empty segments correctly', () => {
    window.location.hash = '#/initial//state';
    const { result } = renderHook(() => useUrlState(['']));

    expect(result.current[0]).toEqual(['initial', 'state']); // Empty segments are filtered out

    act(() => {
      result.current[1](['new', '', 'state']);
    });

    expect(window.location.hash).toBe('/new/state'); // Empty segments are filtered out
  });
});
