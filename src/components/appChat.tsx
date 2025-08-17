'use client';

import { FunctionComponent, ReactElement, useEffect, useMemo, useRef } from 'react';
import { ChatInput, ChatMessage } from '.';
import { useApp } from '../hooks';
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
  const inputRef = useRef<HTMLInputElement>(null);

  const { getChat, setInputValue, setModelDefinition, sendMessage, abortRequest } = useApp();
  const { inputValue, state, messages, modelDefinition } = useMemo(() => getChat(id), [id, getChat]);
  const { limits } = modelDefinition;

  // When calculating if the chat limit has been reached, +1 onto the messages length so as soon as the
  // user sends the last message, the error UI is shown and the input is disabled before the LLM replies
  const chatLimitReached = (
    (messages.length + 1) >=
    (limits?.chatLength ?? Infinity)
  );

  /**
   * Used to focus the `ChatInput` whenever the
   * user chat `id` or `state` changes
   */
  useEffect(() => {
    inputRef.current?.focus();
  }, [id, state]);

  return (
    <div className="w-full h-[calc(100%-56px)] max-w-[910px] relative flex flex-col items-center justify-between pb-4 pl-2 pr-2">
      <div className="absolute w-full h-10 bg-gradient-to-b from-black to-transparent" />
      <div className="w-full flex flex-col items-center gap-y-5 no-scrollbar overflow-y-auto pt-10 pb-10 pl-2 pr-2">
        {
          messages.map((message) => {
            const { id, role, content } = message;
            return (
              <ChatMessage
                key={`${role}-message-${id}`}
                id={id}
                role={role}
              >
                {content}
              </ChatMessage>
            );
          })
        }
        {
          (state === 'loading') && (
            <Loader
              className="self-start"
              appearance="dark"
              text="Thinking..."
            />
          )
        }
      </div>
      <div className="w-full flex flex-col items-start">
        {
          (chatLimitReached === true) && (
            <Error className="mb-4">
              You have reached the chat limit for this model, open a new tab to continue.
            </Error>
          )
        }
        <ChatInput
          ref={inputRef}
          value={inputValue}
          modelDefinition={modelDefinition}
          isDisabled={chatLimitReached}
          onChange={(value) => setInputValue(id, value)}
          onModelChange={
            (messages.length === 0)
              ? (definitionId) => setModelDefinition(id, definitionId)
              : undefined
          }
          onSend={
            (state === 'idle')
              ? () => sendMessage(id)
              : undefined
          }
          onAbort={
            (state !== 'idle')
              ? () => abortRequest(id, 'User aborted request')
              : undefined
          }
        />
      </div>
    </div>
  );
};

export default AppChat;
