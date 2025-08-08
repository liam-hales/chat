import { AIModel, AppTab, ChatMessage } from '../types';

/**
 * Describes the app state which consists of all
 * the app data which is stored in the `AppProvider`
 */
export interface AppState {
  readonly selectedTabId: string;
  readonly tabs: AppTab[];
  readonly messages: ChatMessage[];
}

/**
 * Describes the app different actions that
 * the `AppProvider` can perform
 */
export interface AppActions {

  /**
   * Used to get a specific
   * tab via it's `id`
   *
   * @param id The tab ID
   * @returns The found tab
   */
  readonly getTab: (id: string) => AppTab;

  /**
   * Used to set the input value for a
   * specific tab via it's `id`
   *
   * @param tabId The tab ID
   * @param value The new input value
   */
  readonly setInputValue: (tabId: string, value: string) => void;

  /**
   * Used to set the model for a
   * specific tab via it's `id`
   *
   * @param tabId The tab ID
   * @param value The new model
   */
  readonly setModel: (tabId: string, value: AIModel) => void;

  /**
   * Used to create a new tab
   * with given `data`
   *
   * @param data The data used to create the tab
   */
  readonly createTab: (data: Omit<AppTab, 'id'>) => AppTab;

  /**
   * Used to send a message for
   * a specific tab via it's `id`
   *
   * @param tabId The tab ID
   */
  readonly sendMessage: (tabId: string) => void;
}
