'use client';

import { FunctionComponent, ReactElement, ReactNode, useCallback, useState } from 'react';
import { AppContext } from '../context';
import { BaseProps, AppTab, ChatMessage, AIModel } from '../types';

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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [tabs, setTabs] = useState<AppTab[]>([
    {
      id: '123',
      title: 'New chat',
      model: 'gpt-oss-120b',
      inputValue: '',
    },
  ]);

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
    _updateTab(tabId, {
      inputValue: value,
    });
  };

  /**
   * Used to set the model for a
   * specific tab via it's `id`
   *
   * @param tabId The tab ID
   * @param value The new model
   */
  const setModel = (tabId: string, value: AIModel): void => {
    _updateTab(tabId, {
      model: value,
    });
  };

  /**
   * Used to create a new tab
   * with given `data`
   *
   * @param data The data used to create the tab
   */
  const createTab = (data: Omit<AppTab, 'id'>): AppTab => {
    const newTab: AppTab = {
      ...data,
      id: '123',
    };

    // Add the new created tab
    // to the tab state
    setTabs((previous) => {
      return [
        ...previous,
        newTab,
      ];
    });

    return newTab;
  };

  /**
   * Used to send a message for
   * a specific tab via it's `id`
   *
   * @param tabId The tab ID
   */
  const sendMessage = (tabId: string): void => {
    const { model, inputValue } = getTab(tabId);

    // Add the users message to
    // the messages state
    setMessages((previous) => {
      return [
        ...previous,
        {
          tabId: tabId,
          role: 'user',
          content: inputValue,
        },
      ];
    });
  };

  /**
   * Used to update a specific tab via
   * it's `id` with the provided `data`
   *
   * @param tabId The tab ID
   * @param data The new tab data
   */
  const _updateTab = (tabId: string, data: Partial<Omit<AppTab, 'id'>>): void => {
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
              ...data,
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
        setModel: setModel,
        createTab: createTab,
        sendMessage: sendMessage,
      }
    }
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
