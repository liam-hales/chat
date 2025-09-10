import { AppChat, ChatOption, FullAppChat } from '../types';
import { RefObject } from 'react';

/**
 * Describes the input state which consists
 * of all data stored in the `InputProvider`
 */
export interface InputState {
  readonly ref: RefObject<HTMLTextAreaElement | null>;
  readonly state: 'focused' | 'blurred';
}

/**
 * Describes the different actions that
 * the `InputProvider` can perform
 */
export interface InputActions {

  /**
   * Used to focus the input
   */
  readonly focusInput: () => void;

  /**
   * Used to blur the input
   * to lose its focus
   */
  readonly blurInput: () => void;
}

/**
 * Describes the chat state which consists of all
 * the chat data which is stored in the `ChatProvider`
 */
export interface ChatState {
  readonly selectedChatId: string;
  readonly chats: AppChat[];
}

/**
 * Describes the different actions that
 * the `ChatProvider` can perform
 */
export interface ChatActions {

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
   * Used to toggle a chat option to
   * either enable or disable it
   *
   * @param chatId The chat ID
   * @param option The chat option to toggle
   */
  readonly toggleChatOption: (chatId: string, option: ChatOption) => void;

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
   * @param fromMessageId The ID of the message to retry from
   */
  readonly retryRequest: (chatId: string, fromMessageId?: string) => Promise<void>;
}
