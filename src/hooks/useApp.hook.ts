import { useContext } from 'react';
import { AppContext } from '../context';
import { AppState, AppActions } from '../context/types';

/**
 * Used to access the global app state and
 * actions provided by the `AppProvider`
 *
 * @returns The app context value
 */
const useApp = (): AppState & AppActions => {

  // Check if the context value exists, if not then this
  // hook is being used outside of it's provider
  const context = useContext(AppContext);
  if (context == null) {
    throw new Error('The "useApp" hook must be used within "AppProvider"');
  }

  return context;
};

export default useApp;
