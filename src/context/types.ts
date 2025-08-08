import { AIModel, AppChat, ChatMessage } from '../types';

/**
 * Describes the app state which consists of all
 * the app data which is stored in the `AppProvider`
 */
export interface AppState {
  readonly selectedChatId: string;
  readonly chats: AppChat[];
  readonly messages: ChatMessage[];
}

/**
 * Describes the app different actions that
 * the `AppProvider` can perform
 */
export interface AppActions {

  /**
   * Used to get a specific
   * chat via it's `id`
   *
   * @param id The chat ID
   * @returns The found chat
   */
  readonly getChat: (id: string) => AppChat & { readonly messages: ChatMessage[]; };

  /**
   * Used to set the input value for a
   * specific chat via it's `id`
   *
   * @param chatId The chat ID
   * @param value The new input value
   */
  readonly setInputValue: (chatId: string, value: string) => void;

  /**
   * Used to set the model for a
   * specific chat via it's `id`
   *
   * @param chatId The chat ID
   * @param value The new model
   */
  readonly setModel: (chatId: string, value: AIModel) => void;

  /**
   * Used to create a new chat and set
   * it as the currently selected one
   */
  readonly createChat: () => void;

  /**
   * Used to send a message for
   * a specific chat via it's `id`
   *
   * @param chatId The chat ID
   */
  readonly sendMessage: (chatId: string) => void;
}
