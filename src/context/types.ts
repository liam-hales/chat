import { AppChat, FullAppChat } from '../types';
import { RefObject } from 'react';

/**
 * Describes the app state which consists of all
 * the app data which is stored in the `AppProvider`
 */
export interface AppState {
  readonly inputRef: RefObject<HTMLTextAreaElement | null>;
  readonly selectedChatId: string;
  readonly chats: AppChat[];
}

/**
 * Describes the app different actions that
 * the `AppProvider` can perform
 */
export interface AppActions {

  /**
   * Used to get a specific chat via it's
   * `id` with its full data from other state
   *
   * @param id The chat ID
   * @returns The full chat
   */
  readonly getChat: (id: string) => FullAppChat;

  /**
   * Used to set the input value
   * for a specific chat
   *
   * @param chatId The chat ID
   * @param value The new input value
   */
  readonly setInputValue: (chatId: string, value: string) => void;

  /**
   * Used to set the model definition
   * for a specific chat
   *
   * @param chatId The chat ID
   * @param modelDefinitionId The model definition ID
   */
  readonly setModelDefinition: (chatId: string, modelDefinitionId: string) => void;

  /**
   * Used to create a new chat and set
   * it as the currently selected one
   */
  readonly createChat: () => void;

  /**
   * Used to set the current
   * selected chat
   *
   * @param chatId The chat ID
   */
  readonly setSelectedChat: (chatId: string) => void;

  /**
   * Used to delete a specific chat
   *
   * @param chatId The chat ID
   */
  readonly deleteChat: (chatId: string) => void;

  /**
   * Used to send a message for
   * a specific chat
   *
   * @param chatId The chat ID
   */
  readonly sendMessage: (chatId: string) => Promise<void>;

  /**
   * Used to abort the request for
   * a specific chat
   *
   * @param chatId The chat ID
   * @param reason The reason for aborting
   */
  readonly abortRequest: (chatId: string, reason?: string) => void;

  /**
   * Used to retry the request
   * for a specific chat
   *
   * @param chatId The chat ID
   */
  readonly retryRequest: (chatId: string) => Promise<void>;
}
