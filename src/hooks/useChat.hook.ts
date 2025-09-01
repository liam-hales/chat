import { useContext } from 'react';
import { ChatContext } from '../context';
import { ChatState, ChatActions } from '../context/types';

/**
 * Used to access the global chat state and
 * actions provided by the `ChatProvider`
 *
 * @returns The chat context value
 */
const useChat = (): ChatState & ChatActions => {

  // Check if the context value exists, if not then this
  // hook is being used outside of it's provider
  const context = useContext(ChatContext);
  if (context == null) {
    throw new Error('The "useChat" hook must be used within "ChatProvider"');
  }

  return context;
};

export default useChat;
