import { Ref } from 'react';
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
  readonly internalRef?: Ref<T>;
  readonly className?: string;
}

/**
 * Used to describe the full
 * chat with all of it's data
 */
export interface FullAppChat extends AppChat {
  readonly messages: ChatMessage[];
  readonly modelDefinition: AIModelDefinition;
}

/**
 * Describes the app chat data which
 * will be sorted in the app state
 */
export interface AppChat {
  readonly id: string;
  readonly title: string;
  readonly modelDefinitionId: string;
  readonly inputValue: string;
  readonly state: 'idle' | 'loading' | 'streaming';
  readonly abortController?: AbortController;
}

/**
 * Describes the chat message data which
 * will be stored in the app state
 */
export interface ChatMessage {
  readonly chatId: string;
  readonly role: 'user' | 'assistant';
  readonly content: string;
}
