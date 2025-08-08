'use client';

import { FunctionComponent, ReactElement, ReactNode } from 'react';
import { BaseProps } from '../types';
import { useApp } from '../hooks';
import { AppTab } from './';

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

  const { selectedChatId, messages } = useApp();

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
      <AppTab chatId={selectedChatId}/>
    </div>
  );
}

export default App;
