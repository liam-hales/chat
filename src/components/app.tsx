'use client';

import { FunctionComponent, ReactElement, ReactNode } from 'react';
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
const App: FunctionComponent<Props> = ({ children }): ReactElement<Props> => {

  const {
    selectedChatId,
    chats,
    messages,
    createChat,
    setSelectedChat,
    deleteChat
  } = useApp();

  // If there are no messages in the app state then
  // render the children to render the page
  if (messages.length === 0) {
    return (
      <>
        {children}
      </>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-full flex flex-col items-start">
        <div className="w-full h-14 flex flex-row items-center gap-3 overflow-x-auto whitespace-nowrap p-2">
            {
              chats.map((chat, index) => {
                const { id, title, model, state } = chat;

                return (
                  <Tab
                    key={`tab-${model}-${index}`}
                    title={title}
                    model={model}
                    isLoading={state !== 'idle'}
                    isSelected={(selectedChatId === id)}
                    onSelect={() => setSelectedChat(id)}
                    onDelete={() => deleteChat(id)}
                  />
                );
              })
            }
            <button
              className="w-8 h-8 shrink-0 flex flex-col items-center justify-center cursor-pointer bg-zinc-950 border-solid border-[1px] border-zinc-800 hover:border-zinc-600 rounded-lg"
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
