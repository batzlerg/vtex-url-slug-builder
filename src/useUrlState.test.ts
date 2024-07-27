import { renderHook, act } from '@testing-library/react-hooks';
import { useUrlState } from './useUrlState';

describe('useUrlState', () => {
  beforeEach(() => {
    window.location.hash = ''; // Reset the hash before each test
  });

  it('should initialize state from URL hash', () => {
    window.location.hash = '#/initial/state';
    const { result } = renderHook(() => useUrlState(['']));

    expect(result.current[0]).toEqual(['initial', 'state']);
  });

  it('should update state when URL hash changes', () => {
    const { result } = renderHook(() => useUrlState(['']));

    act(() => {
      window.location.hash = '#/updated/state';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    expect(result.current[0]).toEqual(['updated', 'state']);
  });

  it('should update URL hash when state changes', () => {
    const { result } = renderHook(() => useUrlState(['']));

    act(() => {
      result.current[1](['new', 'state']);
    });

    expect(window.location.hash).toBe('#/new/state');
  });

  it('should correctly encode and decode special characters', () => {
    window.location.hash = '#/something%20%26%20something%20else';
    const { result } = renderHook(() => useUrlState(['']));

    expect(result.current[0]).toEqual(['something & something else']);

    act(() => {
      result.current[1](['another & test']);
    });

    expect(window.location.hash).toBe('#/another%20%26%20test');
  });

  it('should handle empty segments correctly', () => {
    window.location.hash = '#/initial//state';
    const { result } = renderHook(() => useUrlState(['']));

    expect(result.current[0]).toEqual(['initial', 'state']);

    act(() => {
      result.current[1](['new', '', 'state']);
    });

    expect(window.location.hash).toBe('#/new/state');
  });
});
