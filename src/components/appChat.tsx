'use client';

import { FunctionComponent, ReactElement, useMemo } from 'react';
import { ChatInput, UserChatMessage, AssistantChatMessage, ChatError } from '.';
import { useInput, useChat } from '../hooks';
import { BaseProps } from '../types';
import { Error, Loader } from './common';

/**
 * The `AppChat` component props
 */
interface Props extends BaseProps {
  readonly id: string;
}

/**
 * Used to render a single app chat which consists
 * of the chat input and message thread
 *
 * @param props The component props
 * @returns The `AppChat` component
 */
const AppChat: FunctionComponent<Props> = ({ id }): ReactElement<Props> => {

  const { ref } = useInput();
  const {
    getChat,
    setInputValue,
    setModelDefinition,
    toggleChatOption,
    sendMessage,
    abortRequest,
    retryRequest,
  } = useChat();

  const { state, inputValue, options, messages, modelDefinition } = useMemo(() => getChat(id), [id, getChat]);
  const { limits } = modelDefinition;

  // When calculating if the chat limit has been reached, +1 onto the messages length so as soon as the
  // user sends the last message, the error UI is shown and the input is disabled before the LLM replies
  const chatLimitReached = (
    (messages.length + 1) >=
    (limits?.maxChatLength ?? Infinity)
  );

  return (
    <div className="w-full h-[calc(100%-56px)] max-w-[910px] relative flex flex-col items-center justify-between">
      <div className="absolute w-full h-10 bg-gradient-to-b from-black to-transparent" />
      <div className="w-full flex flex-col items-center gap-y-5 no-scrollbar overflow-y-auto overflow-x-hidden pt-10 pb-10">
        {
          messages.map((message, index) => {
            return (message.role === 'user')
              ? (
                  <UserChatMessage key={`user-message-${message.id}`}>
                    {message.content}
                  </UserChatMessage>
                )
              : (
                  <AssistantChatMessage
                    key={`assistant-message-${message.id}`}
                    id={id}
                    // Only show the message tools if the message is not the latest or if the chat state is idle
                    // This stops the tools from being shown for the latest message if the content is still being streamed
                    showTools={
                      ((index + 1) < messages.length) ||
                      state.id === 'idle'
                    }
                    onRetry={() => retryRequest(id, messages[index - 1].id)}
                    metadata={message.metadata}
                  >
                    {message.content}
                  </AssistantChatMessage>
                );
          })
        }
        {
          (state.id === 'loading') && (
            <Loader
              className="self-start pl-4 pr-4"
              appearance="dark"
              text="Thinking..."
            />
          )
        }
        {
          (state.id === 'reasoning') && (
            <div className="flex flex-col self-start gap-y-2 pl-4 pr-4">
              <Loader
                appearance="dark"
                text="Reasoning..."
              />
              <div className="max-w-[460px] flex flex-col items-end overflow-x-hidden">
                <p className="font-mono text-zinc-700 text-xs whitespace-nowrap">
                  {state.text}
                </p>
              </div>
            </div>
          )
        }
        {
          (state.id === 'error') && (
            <ChatError
              message={state.message}
              onRetry={() => retryRequest(id)}
              onReport={() => console.warn('Error reporting not implemented')}
            />
          )
        }
      </div>
      <div className="w-full flex flex-col items-start pb-4 pl-2 pr-2">
        {
          (chatLimitReached === true) && (
            <Error className="mb-4">
              You have reached the chat limit for this model, open a new tab to continue.
            </Error>
          )
        }
        <ChatInput
          ref={ref}
          value={inputValue}
          modelDefinition={modelDefinition}
          isDisabled={chatLimitReached}
          options={options}
          onValueChange={(value) => setInputValue(id, value)}
          onOptionToggle={(option) => toggleChatOption(id, option)}
          onModelChange={
            (messages.length === 0)
              ? (definitionId) => setModelDefinition(id, definitionId)
              : undefined
          }
          onSend={
            (state.id === 'idle')
              ? () => sendMessage(id)
              : undefined
          }
          onAbort={
            (state.id !== 'idle' && state.id !== 'error')
              ? () => abortRequest(id, 'User aborted request')
              : undefined
          }
        />
      </div>
    </div>
  );
};

export default AppChat;
