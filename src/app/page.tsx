'use client';

import { FunctionComponent, ReactElement, useState, KeyboardEvent } from 'react';
import { Typewriter } from '../components/common';
import { ChatInput } from '../components';

/**
 * The entry point for the `/` app route,
 * used to display the app welcome UI
 *
 * @returns The `AppPage` component
 */
const AppPage: FunctionComponent = (): ReactElement => {

  const [inputValue, setInputValue] = useState<string>('');

  /**
   * Used to handle keyboard events from the `ChatInput`
   * component underlying `input` HTML element
   *
   * @param event The keyboard event
   */
  const onKeyDown = async (event: KeyboardEvent<HTMLInputElement>): Promise<void> => {
    const { key } = event;
  };

  return (
    <div className="h-full flex flex-col items-center pt-36 pb-28 pl-10 pr-10">
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
          value={inputValue}
          onChange={setInputValue}
          onKeyDown={onKeyDown}
        />
      </div>
    </div>
  );
};

export default AppPage;
