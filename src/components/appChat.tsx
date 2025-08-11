'use client';

import { FunctionComponent, ReactElement, useEffect, useMemo, useRef } from 'react';
import { ChatInput } from '.';
import { useApp } from '../hooks';
import { BaseProps } from '../types';
import { Error, Loader, Markdown } from './common';

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

  const chatLimitReached = (
    messages.length >=
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
    <div className="w-full h-[calc(100%-56px)] max-w-[910px] flex flex-col items-center justify-between pb-4 pl-4 pr-4">
      <div className="w-full flex flex-col items-center gap-y-5 overflow-y-auto pt-10 pb-10 pl-3 pr-3">
        {
          messages.map((message, index) => {
            const { role, content } = message;

            return (role === 'user')
              ? (
                  <div
                    className="max-w-[600px] self-end bg-zinc-900 border-solid border-[1px] border-zinc-800 rounded-2xl pt-2 pb-2 pl-4 pr-4"
                    key={index}
                  >
                    <p className="font-sans text-white text-md">{content}</p>
                  </div>
                )
              : (
                  <div
                    className="self-start"
                    key={index}
                  >
                    <Markdown>{content}</Markdown>
                  </div>
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
