'use client';

import { FunctionComponent, ReactElement, useMemo } from 'react';
import { ChatInput } from '.';
import { useApp } from '../hooks';
import { BaseProps } from '../types';

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

  const { getChat, setInputValue, setModel, sendMessage } = useApp();
  const { model, inputValue, messages } = useMemo(() => getChat(id), [id, getChat]);

  return (
    <div className="w-full h-full max-w-[910px] flex flex-col items-center justify-between pb-10">
      <div />
      <ChatInput
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
