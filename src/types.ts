import { RefObject } from 'react';
import { aiModelDefinitions } from './constants';

/**
 * Describes the definitions for all available
 * AI models to chat with
 */
export type AIModelDefinition = typeof aiModelDefinitions[number];

/**
 * The props that all component
 * props should `extends`
 *
 * - Generic type `T` for the `internalRef`
 *
 * The `internalRef` prop is used with the `withRef`
 * helper to forward component references
 *
 * @see [React - Forwarding Refs](https://reactjs.org/docs/forwarding-refs.html)
 */
export interface BaseProps<T extends HTMLElement = HTMLElement> {
  readonly internalRef?: RefObject<T | null>;
  readonly className?: string;
}

/**
 * Used to describe the full
 * chat with all of it's data
 */
export interface FullAppChat extends AppChat {
  readonly modelDefinition: AIModelDefinition;
}

/**
 * Describes the app chat data which
 * will be sorted in the app state
 */
export interface AppChat {
  readonly id: string;
  readonly title?: string;
  readonly state: 'idle' | 'loading' | 'streaming' | 'error';
  readonly modelDefinitionId: string;
  readonly inputValue: string;
  readonly messages: ChatMessage[];
  readonly abortController?: AbortController;
  readonly errorMessage?: string;
}

/**
 * Describes the chat message data which
 * will be stored in the app state
 */
export interface ChatMessage {
  readonly id: string;
  readonly chatId: string;
  readonly role: 'user' | 'assistant';
  readonly content: string;
}

/**
 * Used to describe the payload
 * when updating a chat
 */
export type UpdateChatPayload = UpdatePayload<Omit<AppChat, 'id'>>;

/**
 * Used to build an update payload type where for each key
 * contains either the raw value or a mutation function
 *
 * Generic type `T` for the object
 */
export type UpdatePayload<T extends object> = {
  [K in keyof T]?: T[K] | ((previous: T[K]) => T[K]);
};
