import { useContext } from 'react';
import { InputContext } from '../context';
import { InputState, InputActions } from '../context/types';

/**
 * Used to access the global input state and
 * actions provided by the `InputProvider`
 *
 * @returns The input context value
 */
const useInput = (): InputState & InputActions => {

  // Check if the context value exists, if not then this
  // hook is being used outside of it's provider
  const context = useContext(InputContext);
  if (context == null) {
    throw new Error('The "useInput" hook must be used within "InputProvider"');
  }

  return context;
};

export default useInput;
