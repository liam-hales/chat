import { AppTab, ChatMessage } from '../types';

/**
 * Describes the app state which consists of all
 * the app data which is stored in the `AppProvider`
 */
export interface AppState {
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
}
