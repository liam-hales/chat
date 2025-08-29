'use client';

import { FunctionComponent, ReactElement, ReactNode, useEffect } from 'react';
import { BaseProps } from '../types';
import { useApp } from '../hooks';
import { AppChat, Tab } from './';
import { Plus } from "lucide-react";

/**
 * The `App` component props
 */
interface Props extends BaseProps {
  readonly children: ReactNode;
}

/**
 * Used to render the main application
 *
 * @param props The component props
 * @returns The `App` component
 */
const App: FunctionComponent<Props> = ({ children }): ReactElement<Props> | ReactNode => {
  const {
    inputRef,
    selectedChatId,
    chats,
    getChat,
    createChat,
    setSelectedChat,
    deleteChat
  } = useApp();

  /**
   * Used to handle dismissing the keyboard when a scroll event is triggered
   * but also allowing enough time for the keyboard to focus correctly
   */
  useEffect(() => {
    let allowDismiss = false;

    const handleFocus = (): void => {

      // Do not allow the keyboard to dismiss until a delay of `300` milliseconds
      // This allows the keyboard to focus without immediately being dismissed
      allowDismiss = false;
      setTimeout(() => allowDismiss = true, 300);
    };

    const handleScroll = (): void => {

      // The keyboard focusing will trigger this scroll
      // event so only dismiss the keyboard if allowed
      if (allowDismiss === true) {
        inputRef?.current?.blur();
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('focusin', handleFocus);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('focusin', handleFocus);
    };
  }, [inputRef]);

  // Calculate if any of the
  // chats have messages
  const hasMessages = chats
    .some((chat) => chat.messages.length > 0);

  // If there are no messages in the app state then
  // render the children to render the page
  if (hasMessages === false) {
    return (
      <>
        {children}
      </>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full flex flex-col items-start">
        <div className="w-full h-14 flex flex-row items-center gap-3 no-scrollbar overflow-x-auto whitespace-nowrap p-2">
            {
              chats.map((chat, index) => {
                const { id, title, state, modelDefinition } = getChat(chat.id);

                return (
                  <Tab
                    key={`tab-${modelDefinition.name}-${index}`}
                    title={title ?? 'New chat'}
                    modelDefinition={modelDefinition}
                    isLoading={
                      state === 'loading' ||
                      state === 'streaming'
                    }
                    isSelected={(selectedChatId === id)}
                    onSelect={() => setSelectedChat(id)}
                    onDelete={() => deleteChat(id)}
                  />
                );
              })
            }
            <button
              className="w-8 h-8 shrink-0 flex flex-col items-center justify-center cursor-pointer bg-zinc-950 border-solid border-[1px] border-zinc-800 hover:border-zinc-500 rounded-lg"
              onClick={createChat}
            >
              <Plus
                className="text-white"
                size={20}
              />
            </button>
        </div>
      </div>
      <AppChat id={selectedChatId}/>
    </div>
  );
}

export default App;
