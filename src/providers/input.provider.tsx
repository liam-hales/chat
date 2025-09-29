'use client';

import { FunctionComponent, ReactElement, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { BaseProps } from '../types';
import { InputContext } from '../context';

/**
 * The `InputProvider` component props
 */
interface Props extends BaseProps {
  readonly children: ReactNode;
}

/**
 * Used to provide the global
 * input state and actions
 *
 * @param props The component props
 * @returns The `InputProvider` component
 * @example
 *
 * return (
 *   <InputProvider>
 *     { ... }
 *   </InputProvider>
 * );
 */
const InputProvider: FunctionComponent<Props> = ({ children }): ReactElement<Props> => {

  const ref = useRef<HTMLTextAreaElement | null>(null);

  const [state, setState] = useState<'focused' | 'blurred'>('blurred');

  /**
   * Used to handle the `scroll`, `focusin` and `focusout` events
   * to set the correct state and dismiss the keyboard
   */
  useEffect(() => {

    const handleFocusIn = (): void => {
      setState(
        (ref.current === document.activeElement)
          ? 'focused'
          : 'blurred',
      );
    };

    const handleFocusOut = (): void => {
      setState(
        (ref.current === document.activeElement)
          ? 'focused'
          : 'blurred',
      );
    };

    window.addEventListener('focusin', handleFocusIn);
    window.addEventListener('focusout', handleFocusOut);

    return () => {
      window.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  /**
   * Used to focus the input
   */
  const focusInput = (): void => {
    ref.current?.focus();
  };

  /**
   * Used to blur the input
   * to lose its focus
   */
  const blurInput = (): void => {
    ref.current?.blur();
  };

  return (
    <InputContext.Provider value={
      {
        ref: ref,
        state: state,
        focusInput: useCallback(focusInput, []),
        blurInput: useCallback(blurInput, []),
      }
    }
    >
      {children}
    </InputContext.Provider>
  );
};

export default InputProvider;
