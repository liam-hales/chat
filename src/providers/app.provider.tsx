'use client';

import { FunctionComponent, ReactElement, ReactNode, useCallback, useState } from 'react';
import { AppContext } from '../context';
import { BaseProps, AppChat, ChatMessage, AIModel } from '../types';
import { nanoid } from 'nanoid';
import { aiModels } from '../constants';

/**
 * The `AppProvider` component props
 */
interface Props extends BaseProps {
  readonly children: ReactNode;
}

/**
 * Used to provide the global app
 * state and actions
 *
 * @param props The component props
 * @returns The `AppProvider` component
 * @example
 *
 * return (
 *   <AppProvider>
 *     { ... }
 *   </AppProvider>
 * );
 */
const AppProvider: FunctionComponent<Props> = ({ children }): ReactElement<Props> => {

  // Define the default chat that is initially
  // created when the app is first rendered
  const defaultChatId = nanoid(8);
  const defaultChat: AppChat = {
    id: defaultChatId,
    title: 'New chat',
    model: aiModels[0],
    inputValue: '',
  };

  const [selectedChatId, setSelectedChatId] = useState<string>(defaultChatId);
  const [chats, setChats] = useState<AppChat[]>([defaultChat]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  /**
   * Used to get a specific
   * chat via it's `id`
   *
   * @param id The chat ID
   * @returns The found chat
   */
  const getChat = useCallback(
    (id: string): AppChat => {
      const chat = chats.find((chat) => chat.id === id);

      // If the chat does not exist
      // then throw an error
      if (chat == null) {
        throw new Error(`No chat with ID "${id}" found`);
      }

      return chat;
    },
    [chats],
  );

  /**
   * Used to set the input value for a
   * specific chat via it's `id`
   *
   * @param chatId The chat ID
   * @param value The new input value
   */
  const setInputValue = (chatId: string, value: string): void => {
    _updateChat(chatId, {
      inputValue: value,
    });
  };

  /**
   * Used to set the model for a
   * specific chat via it's `id`
   *
   * @param chatId The chat ID
   * @param value The new model
   */
  const setModel = (chatId: string, value: AIModel): void => {
    _updateChat(chatId, {
      model: value,
    });
  };

  /**
   * Used to create a new chat
   * with given `data`
   *
   * @param data The data used to create the chat
   */
  const createChat = (data: Omit<AppChat, 'id'>): AppChat => {
    const newChat: AppChat = {
      ...data,
      id: nanoid(8),
    };

    // Add the new created chat
    // to the chat state
    setChats((previous) => {
      return [
        ...previous,
        newChat,
      ];
    });

    return newChat;
  };

  /**
   * Used to send a message for
   * a specific chat via it's `id`
   *
   * @param chatId The chat ID
   */
  const sendMessage = (chatId: string): void => {
    const { model, inputValue } = getChat(chatId);

    // Add the users message to
    // the messages state
    setMessages((previous) => {
      return [
        ...previous,
        {
          chatId: chatId,
          role: 'user',
          content: inputValue,
        },
      ];
    });
  };

  /**
   * Used to update a specific chat via
   * it's `id` with the provided `data`
   *
   * @param chatId The chat ID
   * @param data The new chat data
   */
  const _updateChat = (chatId: string, data: Partial<Omit<AppChat, 'id'>>): void => {
    setChats((previous) => {
      const existingChat = chats.find((chat) => chat.id === chatId);

      // If the chat does not exist
      // then throw an error
      if (existingChat == null) {
        throw new Error(`No chat with ID "${chatId}" found`);
      }

      // Map the previous chats into an array of new ones,
      // updating the existing chat with the new input value
      return previous.map((chat) => {
        return (chat.id === chatId)
          ? {
              ...chat,
              ...data,
            }
          : chat;
      });
    });
  };

  return (
    <AppContext.Provider value={
      {
        selectedChatId: selectedChatId,
        chats: chats,
        messages: messages,
        getChat: getChat,
        setInputValue: setInputValue,
        setModel: setModel,
        createChat: createChat,
        sendMessage: sendMessage,
      }
    }
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
