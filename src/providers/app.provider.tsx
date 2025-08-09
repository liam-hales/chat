'use client';

import { FunctionComponent, ReactElement, ReactNode, useCallback, useState } from 'react';
import { AppContext } from '../context';
import { BaseProps, AppChat, ChatMessage, AIModel } from '../types';
import { nanoid } from 'nanoid';
import { aiModels } from '../constants';
import { streamChat } from '../helpers';
import { readStreamableValue } from '@ai-sdk/rsc';

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
    isLoading: false,
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
    (id: string): AppChat & { readonly messages: ChatMessage[]; } => {
      const chat = chats.find((chat) => chat.id === id);

      // If the chat does not exist
      // then throw an error
      if (chat == null) {
        throw new Error(`No chat with ID "${id}" found`);
      }

      // Return the chat data with
      // the messages from state
      return {
        ...chat,
        messages: messages
          .filter((message) => message.chatId === chat.id),
      };
    },
    [chats, messages],
  );

  /**
   * Used to set the input value
   * for a specific chat
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
   * Used to set the model for
   * a specific chat
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
   * Used to create a new chat and set
   * it as the currently selected one
   */
  const createChat = (): void => {
    // Define a new chat with the same details as
    // the default chat but with a new ID
    const id = nanoid(8);
    const newChat: AppChat = {
      ...defaultChat,
      id: id,
    };

    // Add the new created chat
    // to the chat state
    setChats((previous) => {
      return [
        ...previous,
        newChat,
      ];
    });

    setSelectedChatId(id);
  };

  /**
   * Used to delete a specific chat
   *
   * @param chatId The chat ID
   */
  const deleteChat = (chatId: string): void => {
    const existingIndex = chats.findIndex((chat) => chat.id === chatId);

    // If the chat does not exist
    // then throw an error
    if (existingIndex < 0) {
      throw new Error(`No chat with ID "${chatId}" found`);
    }

    // Remove the existing chat and it's
    // messages from the app state
    const newMessages = messages.filter((message) => message.chatId !== chatId);
    const filteredChats = chats.filter((chat) => chat.id !== chatId);

    // If the last chat has been remove, set the
    // new chats array including the default chat
    const newChats = (filteredChats.length === 0)
      ? [defaultChat]
      : filteredChats;

    setChats(newChats);
    setMessages(newMessages);

    // If the deleted chat is the one currently
    // selected then select another chat
    if (selectedChatId === chatId) {

      // Calculate the index of the new chat to select and use
      // the ID of said chat to set the selected chat ID state
      const newIndex = (existingIndex < newChats.length) ? existingIndex : existingIndex - 1;
      const { id } = newChats[newIndex];

      setSelectedChatId(id);
    }
  };

  /**
   * Used to send a message for
   * a specific chat
   *
   * @param chatId The chat ID
   */
  const sendMessage = async (chatId: string): Promise<void> => {
    const { model, inputValue, messages } = getChat(chatId);
    const abortController = new AbortController();

    // Set the input value state to clear the
    // input and set the chat loading state
    setInputValue(chatId, '');
    _updateChat(chatId, {
      isLoading: true,
      abortController: abortController,
    });

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

    try {
      // Set the abort controller to throw if aborted throughout this `try` block so the
      // logic will fall into the `catch` block and the error can be handled

      abortController.signal.throwIfAborted();

      const streamValue = await streamChat({
        model: model,
        messages: [
          ...messages,
          {
            role: 'user',
            content: inputValue,
          },
        ],
      });

      abortController.signal.throwIfAborted();

      // process the client stream value
      // and process each part
      for await (const value of readStreamableValue(streamValue)) {
        abortController.signal.throwIfAborted();

        // If there is no text value
        // then continue
        if (value == null) {
          continue;
        }

        // Reset the chat loading state
        _updateChat(chatId, {
          isLoading: false,
        });

        // Add the text value to the latest
        // message in the messages state
        setMessages((previous) => {
          const { role, content } = previous[previous.length - 1];

          return (role === 'user')
            ? [
                ...previous,
                {
                  chatId: chatId,
                  role: 'assistant',
                  content: value,
                },
              ]
            : [
                ...previous.slice(0, -1),
                {
                  chatId: chatId,
                  role: 'assistant',
                  content: `${content}${value}`,
                },
              ];
        });
      }
    }
    catch (error) {

      // If the error is an abort error
      // then handle it accordingly
      if (
        error instanceof Error &&
        error.name === 'AbortError'
      ) {

        // eslint-disable-next-line no-console
        console.error(error);

        // Reset the chat loading state
        _updateChat(chatId, {
          isLoading: false,
        });

        return;
      }

      // Unknown error, re-throw it
      throw error;
    }
  };

  /**
   * Used to abort the request for
   * a specific chat
   *
   * @param chatId The chat ID
   * @param reason The reason for aborting
   */
  const abortRequest = (chatId: string, reason?: string): void => {
    const { abortController } = getChat(chatId);

    const error = new Error(reason);
    error.name = 'AbortError';

    // Abort the chat request (if the controller exists)
    // using the chats `AbortController` with a given reason
    abortController?.abort(error);
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
        setSelectedChat: setSelectedChatId,
        deleteChat: deleteChat,
        sendMessage: sendMessage,
        abortRequest: abortRequest,
      }
    }
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
