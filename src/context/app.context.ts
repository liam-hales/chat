import { createContext } from 'react';
import { AppActions, AppState } from './types';

/**
 * Used to represent the app context which can be provided with a
 * value using `.Provider` and consumed using the `useContext` hook.
 *
 * _**WARNING:** This context does not store or hold any state_
 */
const AppContext = createContext<AppState & AppActions | undefined>(undefined);

export default AppContext;
