'use client';

import { FunctionComponent, ReactElement, useEffect, useState } from 'react';
import { Info, Typewriter } from '../components/common';
import { ChatInput } from '../components';
import { useInput, useChat } from '../hooks';

/**
 * The entry point for the `/` app route,
 * used to display the app welcome UI
 *
 * @returns The `AppPage` component
 */
const AppPage: FunctionComponent = (): ReactElement => {

  const { ref, focusInput } = useInput();
  const { chats, getChat, setInputValue, setModelDefinition, sendMessage } = useChat();
  const { id, inputValue, modelDefinition } = getChat(chats[0].id);

  const [isLimitVisible, setIsLimitVisible] = useState<boolean>(true);

  /**
   * Used to focus the chat input
   * when the component is rendered
   */
  useEffect(() => focusInput(), [focusInput]);

  return (
    <div className="h-full flex flex-col items-center pt-4 pb-4 md:pb-28 pl-2 pr-2">
      <div className="w-full h-full max-w-[910px] flex flex-col items-center justify-between">
        {
          (modelDefinition.limits != null && isLimitVisible === true) && (
            <Info
              className="w-full md:max-w-[580px]"
              icon={(
                <div className="border-solid border-[1px] bg-zinc-800 border-zinc-700 rounded-sm pt-1 pb-1 pl-2 pr-2">
                  <p className="font-mono text-white text-[10px]">
                    Limited
                  </p>
                </div>
              )}
              onDismiss={() => setIsLimitVisible(false)}
            >
              The limited icon means the model incurs costs and therefore has usage limits, its responses and how much data you can send will be restricted.
            </Info>
          )
        }
        <div className="w-full h-full flex flex-col items-start justify-center pl-5 pr-5">
          <Typewriter
            className="font-sans font-bold text-[clamp(40px,11.6vw,110px)] leading-[clamp(110%,11.6vw,60%)] text-white"
            onInit={(typewriter) => {
              // Define the list of AI names to render
              // as part of the typewriter text
              const names = [
                'GPT',
                'Gemini',
                'DeepSeek',
                'Claude',
                'Grok',
              ];

              // Apply the initial typewriter
              // text effect
              typewriter
                .pauseFor(400)
                .typeString('Chat with AI.')
                .pauseFor(300)
                .typeString('<br />')
                .pauseFor(800)
                .typeString('All in one place.')
                .pauseFor(2000)
                .changeDeleteSpeed(12)
                .deleteChars(20)
                .pauseFor(80)
                .typeString('<br />')
                .pauseFor(400);

              // For each name apply the typewriter
              // text effect for said name
              for (const name of names) {
                const text = `${name}.`;

                typewriter
                  .pauseFor(100)
                  .typeString(text)
                  .pauseFor(1500)
                  .deleteChars(text.length);
              }

              // Apply the final typewriter
              // text effect
              typewriter
                .deleteChars(1)
                .pauseFor(80)
                .typeString(' AI.')
                .pauseFor(300)
                .typeString('<br />')
                .pauseFor(800)
                .typeString('All in one place.')
                .start();
            }}
          />
        </div>
        <ChatInput
          ref={ref}
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
