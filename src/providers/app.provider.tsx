'use client';

import { FunctionComponent, ReactElement, ReactNode, useCallback, useState } from 'react';
import { AppContext } from '../context';
import { BaseProps, AppTab, ChatMessage } from '../types';

/**
 * The `AppProvider` component props
 */
interface Props extends BaseProps {
  readonly children: ReactNode;
}

/**
 * Used to provide the global app
 * state and actions
 *
 * @param props The component props
 * @returns The `AppProvider` component
 * @example
 *
 * return (
 *   <AppProvider>
 *     { ... }
 *   </AppProvider>
 * );
 */
const AppProvider: FunctionComponent<Props> = ({ children }): ReactElement<Props> => {
  const [tabs, setTabs] = useState<AppTab[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  /**
   * Used to get a specific
   * tab via it's `id`
   *
   * @param id The tab ID
   * @returns The found tab
   */
  const getTab = useCallback(
    (id: string): AppTab => {
      const tab = tabs.find((tab) => tab.id === id);

      // If the tab does not exist
      // then throw an error
      if (tab == null) {
        throw new Error(`No tab with ID "${id}" found`);
      }

      return tab;
    },
    [tabs],
  );

  /**
   * Used to set the input value for a
   * specific tab via it's `id`
   *
   * @param tabId The tab ID
   * @param value The new input value
   */
  const setInputValue = (tabId: string, value: string): void => {
    setTabs((previous) => {
      const existingTab = tabs.find((tab) => tab.id === tabId);

      // If the tab does not exist
      // then throw an error
      if (existingTab == null) {
        throw new Error(`No tab with ID "${tabId}" found`);
      }

      // Map the previous tabs into an array of new ones,
      // updating the existing tab with the new input value
      return previous.map((tab) => {
        return (tab.id === tabId)
          ? {
              ...tab,
              inputValue: value,
            }
          : tab;
      });
    });
  };

  return (
    <AppContext.Provider value={
      {
        tabs: tabs,
        messages: messages,
        getTab: getTab,
        setInputValue: setInputValue,
      }
    }
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
