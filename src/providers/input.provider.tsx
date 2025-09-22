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
  const [allowDismiss, setAllowDismiss] = useState<boolean>(false);

  /**
   * Used to handle the `scroll`, `focusin` and `focusout` events
   * to set the correct state and dismiss the keyboard
   */
  useEffect(() => {

    const handleFocusIn = (): void => {
      setAllowDismiss(false);
      setState(
        (ref.current === document.activeElement)
          ? 'focused'
          : 'blurred',
      );

      // Do not allow the keyboard to dismiss until a delay of `300` milliseconds
      // This allows the keyboard to focus without immediately being dismissed
      setTimeout(() => setAllowDismiss(true), 300);
    };

    const handleFocusOut = (): void => {
      setState(
        (ref.current === document.activeElement)
          ? 'focused'
          : 'blurred',
      );
    };

    const handleScroll = (): void => {

      // The keyboard focusing will trigger this scroll
      // event so only dismiss the keyboard if allowed
      if (allowDismiss === true) {
        ref.current?.blur();
      }
    };

    window.addEventListener('focusin', handleFocusIn);
    window.addEventListener('focusout', handleFocusOut);
    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('focusout', handleFocusOut);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [ref, allowDismiss]);

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
