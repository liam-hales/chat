import { createContext } from 'react';
import { ChatActions, ChatState } from './types';

/**
 * Used to represent the chat context which can be provided with a
 * value using `.Provider` and consumed using the `useContext` hook.
 *
 * _**WARNING:** This context does not store or hold any state_
 */
const ChatContext = createContext<(ChatState & ChatActions) | undefined>(undefined);

export default ChatContext;
