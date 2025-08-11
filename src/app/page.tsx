'use client';

import { FunctionComponent, ReactElement, useEffect, useRef } from 'react';
import { Typewriter } from '../components/common';
import { ChatInput } from '../components';
import { useApp } from '../hooks';

/**
 * The entry point for the `/` app route,
 * used to display the app welcome UI
 *
 * @returns The `AppPage` component
 */
const AppPage: FunctionComponent = (): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { chats, getChat, setInputValue, setModelDefinition, sendMessage } = useApp();
  const { id, inputValue, modelDefinition } = getChat(chats[0].id);

  /**
   * Used to focus the `ChatInput`
   * when the component is rendered
   */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="h-full flex flex-col items-center pt-24 pb-20 pl-10 pr-10">
      <div className="w-full h-full max-w-[910px] flex flex-col items-center justify-between">
        <div className="w-full max-w-[880px]">
          <Typewriter
            className="font-sans font-bold text-[clamp(40px,11vw,110px)] leading-[clamp(110%,11vw,60%)] text-white"
            onInit={(typewriter) => {
              typewriter
                .pauseFor(400)
                .typeString('Chat with AI')
                .pauseFor(100)
                .typeString('.')
                .pauseFor(400)
                .typeString('<br />')
                .pauseFor(1000)
                .typeString('All in one place')
                .pauseFor(100)
                .typeString('.')
                .start();
            }}
          />
        </div>
        <ChatInput
          ref={inputRef}
          value={inputValue}
          modelDefinition={modelDefinition}
          onChange={(value) => setInputValue(id, value)}
          onModelChange={(definitionId) => setModelDefinition(id, definitionId)}
          onSend={() => sendMessage(id)}
        />
      </div>
    </div>
  );
};

export default AppPage;
