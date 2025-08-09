'use client';

import { FunctionComponent, ReactElement, useEffect, useMemo, useRef } from 'react';
import { ChatInput } from '.';
import { useApp } from '../hooks';
import { BaseProps } from '../types';
import { Loader } from './common';

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

  const { getChat, setInputValue, setModel, sendMessage } = useApp();
  const { model, inputValue, messages } = useMemo(() => getChat(id), [id, getChat]);

  /**
   * Used to focus the `ChatInput` whenever the
   * user switches tabs and the `id` prop changes
   */
  useEffect(() => {
    inputRef.current?.focus();
  }, [id]);

  return (
    <div className="w-full h-[calc(100%-56px)] max-w-[910px] flex flex-col items-center justify-between pb-4 pl-4 pr-4">
      <div className="w-full flex flex-col items-center gap-y-5 overflow-y-auto pt-10 pb-10 pl-3 pr-3">
        {
          messages.map((message, index) => {
            const { role, content } = message;

            return (role === 'user')
              ? (
                  <div
                    className="self-end bg-zinc-900 border-solid border-[1px] border-zinc-800 rounded-2xl pt-2 pb-2 pl-4 pr-4"
                    key={index}
                  >
                    <p className="text-white">{content}</p>
                  </div>
                )
              : (
                  <div
                    className="self-start"
                    key={index}
                  >
                    <p className="text-white">{content}</p>
                  </div>
                );
          })
        }
      </div>
      <ChatInput
        ref={inputRef}
        value={inputValue}
        model={model}
        allowModelSelect={messages.length === 0}
        onChange={(value) => setInputValue(id, value)}
        onModelChange={(value) => setModel(id, value)}
        onSend={() => sendMessage(id)}
      />
    </div>
  );
};

export default AppChat;
