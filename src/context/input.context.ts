import { createContext } from 'react';
import { InputState, InputActions } from './types';

/**
 * Used to represent the input context which can be provided with a
 * value using `.Provider` and consumed using the `useContext` hook.
 *
 * _**WARNING:** This context does not store or hold any state_
 */
const InputContext = createContext<(InputState & InputActions) | undefined>(undefined);

export default InputContext;
