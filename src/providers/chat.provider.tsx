'use client';

import { FunctionComponent, ReactElement, ReactNode, useCallback, useState } from 'react';
import { ChatContext } from '../context';
import {
  BaseProps,
  AppChat,
  FullAppChat,
  UpdateChatPayload,
  MakeRequestPayload,
  AIModelDefinition,
  ChatOptions,
  UpdateChatOptionPayload,
} from '../types';
import { nanoid } from 'nanoid';
import { aiModelDefinitions } from '../constants';
import { useInput } from '../hooks';
import { streamChat } from '../helpers';
import { readStreamableValue } from '@ai-sdk/rsc';
import dedent from 'dedent';

/**
 * The `ChatProvider` component props
 */
interface Props extends BaseProps {
  readonly children: ReactNode;
}

/**
 * Used to provide the global
 * chat state and actions
 *
 * @param props The component props
 * @returns The `ChatProvider` component
 * @example
 *
 * return (
 *   <ChatProvider>
 *     { ... }
 *   </ChatProvider>
 * );
 */
const ChatProvider: FunctionComponent<Props> = ({ children }): ReactElement<Props> => {

  const { blurInput } = useInput();

  const defaultModel = aiModelDefinitions
    .find((definition) => definition.isDefault === true);

  // Define the default chat that is initially
  // created when the app is first rendered
  const defaultChatId = nanoid(8);
  const defaultChat: AppChat = {
    id: defaultChatId,
    state: {
      id: 'idle',
    },
    modelDefinitionId: defaultModel?.id ?? '',
    inputValue: '',
    options: {
      prompt: {
        isEnabled: false,
      },
    },
    messages: [],
  };

  const [selectedChatId, setSelectedChatId] = useState<string>(defaultChatId);
  const [chats, setChats] = useState<AppChat[]>([defaultChat]);

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

      // If the chat does not exist
      // then throw an error
      if (chat == null) {
        throw new Error(`No chat with ID "${id}" found`);
      }

      // Return the chat data with
      // the messages from state
      const modelDefinition = _getModelDefinition(chat.modelDefinitionId);
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
   * @param definitionId The model definition ID
   */
  const setModelDefinition = (chatId: string, definitionId: string): void => {
    _updateChat(chatId, {
      modelDefinitionId: definitionId,
      // TODO: Update logic to set default options
      //  for selected model definition
      options: (previous) => previous,
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
   * Used to update a specific chat option using by
   * merging it with the current option data
   *
   * @param chatId The chat ID
   * @param payload The update chat option payload
   */
  const updateOption = <T extends keyof ChatOptions>(chatId: string, payload: UpdateChatOptionPayload<T>): void => {
    const { key, data } = payload;

    _updateChat(chatId, {
      options: (previous) => {
        return {
          ...previous,
          [key]: {
            ...previous[key],
            ...data,
          },
        };
      },
    });
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
    const { inputValue, options, messages, modelDefinition } = getChat(chatId);
    const { openRouterId } = modelDefinition;

    const trimmedValue = inputValue.trim();

    // If there are no messages in the chat then generate
    // a new chat title for the users first message
    if (messages.length === 0) {
      void _generateChatTitle(chatId, trimmedValue);
    }

    // Blur the input so
    // it loses its focus
    blurInput();

    // Set the input value state to clear
    // the input and set the chat state
    setInputValue(chatId, '');
    _updateChat(chatId, {
      state: {
        id: 'loading',
      },
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

    // Make the request with the messages from
    // the chat plus the users new message
    await _makeRequest({
      chatId: chatId,
      modelId: openRouterId,
      options: options,
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
    });
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
      state: {
        id: 'idle',
      },
    });
  };

  /**
   * Used to retry the request
   * for a specific chat
   *
   * @param chatId The chat ID
   * @param fromMessageId The ID of the message to retry from
   */
  const retryRequest = async (chatId: string, fromMessageId?: string): Promise<void> => {
    const { options, messages, modelDefinition } = getChat(chatId);
    const { openRouterId } = modelDefinition;

    // If the `fromMessageId` has been set, we need to remove any messages that were created after
    // the message with said ID by working out the index where the messages array needs to be split
    const fromIndex = (fromMessageId != null)
      ? messages.findIndex((message) => message.id === fromMessageId) + 1
      : messages.length;

    _updateChat(chatId, {
      state: {
        id: 'loading',
      },
      // Only set the messages state if the `fromMessageId` has been
      // set, otherwise the messages array does not need to change
      ...(fromMessageId != null) && {
        messages: (previous) => previous.slice(0, fromIndex),
      },
    });

    // Retry the request with the same
    // messages from the chat state
    await _makeRequest({
      chatId: chatId,
      modelId: openRouterId,
      options: options,
      messages: [
        // Remove the unknown props
        // from each message
        ...messages
          .slice(0, fromIndex)
          .map((message) => {
            return {
              role: message.role,
              content: message.content,
            };
          }),
      ],
    });
  };

  /**
   * Used to make a request to the LLM, handle the stream, handle
   * any errors and update chat state with the response data
   *
   * Used for the `sendMessage` and `retryRequest` actions
   *
   * @param payload The request payload
   */
  const _makeRequest = async (payload: MakeRequestPayload): Promise<void> => {
    const {
      chatId,
      modelId,
      options,
      messages,
    } = payload;

    // Define a new abort controller for each
    // request and store it in the chat state
    const abortController = new AbortController();

    _updateChat(chatId, {
      abortController: abortController,
    });

    try {
      // Set the abort controller to throw if aborted throughout this `try` block so the
      // logic will fall into the `catch` block and the error can be handled

      abortController.signal.throwIfAborted();

      const streamValue = await streamChat({
        modelId: modelId,
        messages: messages,
        options: options,
      });

      abortController.signal.throwIfAborted();

      // process the client stream value
      // and process each part
      for await (const part of readStreamableValue(streamValue)) {
        abortController.signal.throwIfAborted();

        // If there is no stream
        // part then continue
        if (part == null) {
          continue;
        }

        switch (part.type) {

          case 'reasoning': {
            // Update the chat state and set the text
            // value to the chat reasoning text
            _updateChat(chatId, {
              state: (previous) => {
                return {
                  id: 'reasoning',
                  text: `${(previous.id === 'reasoning') ? previous.text : ''}${part.value}`,
                };
              },
            });

            break;
          }

          case 'text': {
            // Update the chat state and set the text
            // value to the message content
            _updateChat(chatId, {
              state: {
                id: 'streaming',
              },
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
                        content: part.value,
                      },
                    ]
                  : [
                      ...previous.slice(0, -1),
                      {
                        id: id,
                        chatId: chatId,
                        role: 'assistant',
                        content: `${content}${part.value}`,
                      },
                    ];
              },
            });

            break;
          }

          case 'end': {
            // Reset the chat state and
            // set the message metadata
            _updateChat(chatId, {
              state: {
                id: 'idle',
              },
              messages: (previous) => {
                return [
                  ...previous.slice(0, -1),
                  {
                    ...previous[previous.length - 1],
                    metadata: {
                      reasonedFor: part.reasonedFor,
                      tokenUsage: part.tokenUsage,
                    },
                  },
                ];
              },
            });
          }
        }
      }

      _updateChat(chatId, {
        state: {
          id: 'idle',
        },
      });
    }
    catch (error) {
      console.error('sendMessage() ->', error);

      if (error instanceof Error) {

        // If the error is an abort error
        // then handle it accordingly
        if (error.name === 'AbortError') {
          return;
        }
      }

      // Extract the error message. If the error is not an `Error` then it
      // will most likely be the error message string from the stream.
      const message = (error instanceof Error)
        ? error.message
        : `${error}`;

      _updateChat(chatId, {
        state: {
          id: 'error',
          message: message,
        },
      });
    }
  };

  /**
   * Used to update a specific chat via
   * it's `id` with the provided `payload`
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
   * Used to get a specific model
   * definition via it's `id`
   *
   * @param id The model definition ID
   * @returns The model definition
   */
  const _getModelDefinition = (id: string): AIModelDefinition => {
    const definition = aiModelDefinitions.find((def) => def.id === id);

    // If the model definition does not
    // exist then throw an error
    if (definition == null) {
      throw new Error(`No model definition with ID "${id}" found`);
    }

    return definition;
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
      modelId: 'deepseek/deepseek-chat-v3.1:free',
      systemMessage: dedent`
        Generate a short chat title which describes the chat based off the users first message.
        This will be used to easily identify each chat.

        Rules:
          - Always use normal sentence casing.
          - Never include LLM names.
          - Never include punctuation.
          - Never include code.
      `,
      messages: [
        {
          role: 'user',
          content: inputValue,
        },
      ],
      maxOutputLength: 25,
    });

    try {
      // process the client stream value
      // and process each part
      for await (const part of readStreamableValue(streamValue)) {
        if (part == null) {
          continue;
        }

        // For generating chat titles we only
        // care about text stream parts
        if (part.type !== 'text') {
          continue;
        }

        // Update the chat title with the
        // value from the stream
        _updateChat(chatId, {
          title: (title) => `${title ?? ''}${part.value}`,
        });
      }
    }
    catch (error) {
      console.error('_generateChatTitle() ->', error);
    }
  };

  return (
    <ChatContext.Provider value={
      {
        selectedChatId: selectedChatId,
        chats: chats,
        getChat: getChat,
        setInputValue: setInputValue,
        setModelDefinition: setModelDefinition,
        createChat: createChat,
        setSelectedChat: setSelectedChatId,
        updateOption: updateOption,
        deleteChat: deleteChat,
        sendMessage: sendMessage,
        abortRequest: abortRequest,
        retryRequest: retryRequest,
      }
    }
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
