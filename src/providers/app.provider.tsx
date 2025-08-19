'use client';

import { FunctionComponent, ReactElement, ReactNode, useCallback, useRef, useState } from 'react';
import { AppContext } from '../context';
import { BaseProps, AppChat, FullAppChat, UpdateChatPayload } from '../types';
import { nanoid } from 'nanoid';
import { aiModelDefinitions } from '../constants';
import { streamChat } from '../helpers';
import { readStreamableValue } from '@ai-sdk/rsc';
import dedent from 'dedent';

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
    state: 'idle',
    modelDefinitionId: aiModelDefinitions[0].id,
    inputValue: '',
    messages: [],
  };

  const [selectedChatId, setSelectedChatId] = useState<string>(defaultChatId);
  const [chats, setChats] = useState<AppChat[]>([defaultChat]);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  /**
   * Used to get a specific chat via it's
   * `id` with its full data from other state
   *
   * @param id The chat ID
   * @returns The full chat
   */
  const getChat = useCallback(
    (id: string): FullAppChat => {
      const chat = chats.find((chat) => chat.id === id);
      const modelDefinition = aiModelDefinitions.find((def) => def.id === chat?.modelDefinitionId);

      // If the chat does not exist
      // then throw an error
      if (chat == null) {
        throw new Error(`No chat with ID "${id}" found`);
      }

      // If the model definition does not
      // exist then throw an error
      if (modelDefinition == null) {
        throw new Error(`No model definition with ID "${chat.modelDefinitionId}" found`);
      }

      // Return the chat data with
      // the messages from state
      return {
        ...chat,
        modelDefinition: modelDefinition,
      };
    },
    [chats],
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
   * Used to set the model definition
   * for a specific chat
   *
   * @param chatId The chat ID
   * @param modelDefinitionId The model definition ID
   */
  const setModelDefinition = (chatId: string, modelDefinitionId: string): void => {
    _updateChat(chatId, {
      modelDefinitionId: modelDefinitionId,
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

    // Abort the request if there is one running
    // for the chat about to be deleted
    abortRequest(chatId, 'User deleted chat');

    setChats((previous) => {
      // Remove the chat from state and if it was the last chat,
      // set the new chats array including the default chat
      const filteredChats = previous.filter((chat) => chat.id !== chatId);
      const newChats = (filteredChats.length === 0)
        ? [defaultChat]
        : filteredChats;

      // If the deleted chat is the one currently
      // selected then select another chat
      if (selectedChatId === chatId) {

        // Calculate the index of the new chat to select and use
        // the ID of said chat to set the selected chat ID state
        const newIndex = (existingIndex < newChats.length) ? existingIndex : existingIndex - 1;
        const { id } = newChats[newIndex];

        setSelectedChatId(id);
      }

      return newChats;
    });
  };

  /**
   * Used to send a message for
   * a specific chat
   *
   * @param chatId The chat ID
   */
  const sendMessage = async (chatId: string): Promise<void> => {
    const { inputValue, messages, modelDefinition } = getChat(chatId);
    const { openRouterId, limits } = modelDefinition;

    const abortController = new AbortController();
    const trimmedValue = inputValue.trim();

    // If there are no messages in the chat then generate
    // a new chat title for the users first message
    if (messages.length === 0) {
      void _generateChatTitle(chatId, trimmedValue);
    }

    // Set the input value state to clear the
    // input and set the chat state to loading
    setInputValue(chatId, '');
    _updateChat(chatId, {
      state: 'loading',
      abortController: abortController,
      messages: (previous) => {
        return [
          ...previous,
          {
            id: nanoid(8),
            chatId: chatId,
            role: 'user',
            content: trimmedValue,
          },
        ];
      },
    });

    try {
      // Set the abort controller to throw if aborted throughout this `try` block so the
      // logic will fall into the `catch` block and the error can be handled

      abortController.signal.throwIfAborted();

      const streamValue = await streamChat({
        modelId: openRouterId,
        messages: [

          // Remove the unknown props
          // from each message
          ...messages.map((message) => {
            return {
              role: message.role,
              content: message.content,
            };
          }),
          {
            role: 'user',
            content: trimmedValue,
          },
        ],
        ...(limits != null) && {
          maxOutputTokens: limits.outputTokens,
        },
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

        // Update the chat state and set the text
        // value to the message content
        _updateChat(chatId, {
          state: 'streaming',
          messages: (previous) => {
            const { id, role, content } = previous[previous.length - 1];

            // If the last message is a user message then we can just append the new message,
            // however if it's an assistant message then we need to replace the message content
            return (role === 'user')
              ? [
                  ...previous,
                  {
                    id: nanoid(8),
                    chatId: chatId,
                    role: 'assistant',
                    content: value,
                  },
                ]
              : [
                  ...previous.slice(0, -1),
                  {
                    id: id,
                    chatId: chatId,
                    role: 'assistant',
                    content: `${content}${value}`,
                  },
                ];
          },
        });
      }

      _updateChat(chatId, {
        state: 'idle',
      });
    }
    catch (error) {
      if (error instanceof Error) {

        // If the error is an abort error
        // then handle it accordingly
        if (error.name === 'AbortError') {
          // eslint-disable-next-line no-console
          console.error(error);
          return;
        }
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

    _updateChat(chatId, {
      state: 'idle',
    });
  };

  /**
   * Used to update a specific chat via
   * it's `id` with the provided `data`
   *
   * @param chatId The chat ID
   * @param payload The payload containing the data or mutation functions
   */
  const _updateChat = (chatId: string, payload: UpdateChatPayload): void => {
    setChats((previous) => {
      const existingChat = previous.find((chat) => chat.id === chatId);

      // If the chat does not exist
      // then throw an error
      if (existingChat == null) {
        throw new Error(`No chat with ID "${chatId}" found`);
      }

      const keys = Object.keys(payload) as (keyof UpdateChatPayload)[];

      // Map the previous chats into an array of new ones,
      // updating the existing chat with the new input value
      return previous.map((chat) => {
        return (chat.id === chatId)
          ? {
              ...chat,
              ...keys.reduce<Partial<AppChat>>((map, key) => {
                const previousValue = chat[key];
                const updater = payload[key] as ((previous: typeof previousValue) => typeof previousValue) | undefined;

                // If the updater does not exist then there
                // is nothing to update for this key
                if (updater == null) {
                  return map;
                }

                // If the updater is a function then call
                // this function with the previous value
                return {
                  ...map,
                  [key]: (typeof updater === 'function') ? updater(previousValue) : updater,
                };
              }, {}),
            }
          : chat;
      });
    });
  };

  /**
   * Used to generate a chat title from a
   * given input using a low latency LLM
   *
   * @param chatId The chat ID
   * @param inputValue The input value
   */
  const _generateChatTitle = async (chatId: string, inputValue: string): Promise<void> => {
    const streamValue = await streamChat({
      modelId: 'openai/gpt-oss-20b:free',
      systemMessage: dedent`
        Generate a chat title which describes the chat based off the users first message.

        - Never use any LLM names or punctuation.
        - Never generate a response more than 25 characters.
      `,
      messages: [
        {
          role: 'user',
          content: inputValue,
        },
      ],
    });

    // process the client stream value
    // and process each part
    for await (const value of readStreamableValue(streamValue)) {
      if (value == null) {
        continue;
      }

      // Update the chat title with the
      // value from the stream
      _updateChat(chatId, {
        title: (title) => `${title ?? ''}${value}`,
      });
    }
  };

  return (
    <AppContext.Provider value={
      {
        inputRef: inputRef,
        selectedChatId: selectedChatId,
        chats: chats,
        getChat: getChat,
        setInputValue: setInputValue,
        setModelDefinition: setModelDefinition,
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
