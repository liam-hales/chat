import { RefObject } from 'react';
import { aiModelDefinitions } from './constants';
import { streamChatSchema } from './schemas';
import { z } from 'zod';

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
 * will be sorted in the chat state
 */
export interface AppChat {
  readonly id: string;
  readonly title?: string;
  readonly state: AppChatState;
  readonly modelDefinitionId: string;
  readonly inputValue: string;
  readonly options: ChatOptions;
  readonly messages: ChatMessage[];
  readonly abortController?: AbortController;
}

/**
 * Describes the different
 * app chat states
 */
export type AppChatState =
  {
    readonly id: 'idle' | 'loading' | 'streaming';
  }
  | AppChatReasoningState
  | AppChatErrorState;

/**
 * Describes the chat
 * reasoning state
 */
export interface AppChatReasoningState {
  readonly id: 'reasoning';
  readonly text: string;
}

/**
 * Describes the chat
 * error state
 */
export interface AppChatErrorState {
  readonly id: 'error';
  readonly message: string;
}

/**
 * Describes the chat message data which
 * will be stored in the chat state
 */
export type ChatMessage =
  | ChatUserMessage
  | ChatAssistantMessage;

/**
 * Used to describes the
 * different chat options
 */
export type ChatOption = 'reason';

/**
 * Used to describe the chat options that
 * can either be enabled or disabled
 */
export type ChatOptions = Record<ChatOption, boolean>;

/**
 * Describes the chat
 * user message data
 */
export interface ChatUserMessage {
  readonly id: string;
  readonly chatId: string;
  readonly role: 'user';
  readonly content: string;
}

/**
 * Describes the chat assistant
 * message data
 */
export interface ChatAssistantMessage {
  readonly id: string;
  readonly chatId: string;
  readonly role: 'assistant';
  readonly content: string;
  readonly metadata?: ChatMessageMetadata;
}

/**
 * Used to describe the
 * chat message metadata
 */
export interface ChatMessageMetadata {
  readonly reasonedFor: number;
  readonly tokenUsage: TokenUsage;
}

/**
 * Used to describe the payload for the internal
 * app provider `_makeRequest` function
 */
export interface MakeRequestPayload {
  readonly chatId: string;
  readonly modelId: z.infer<typeof streamChatSchema>['modelId'];
  readonly messages: z.infer<typeof streamChatSchema>['messages'];
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

/**
 * Describes the data passed
 * down from the stream
 */
export type StreamData =
  | StreamTextData
  | StreamEndData;

/**
 * Describes the text stream data which
 * contains data such as the text value
 */
export interface StreamTextData {
  readonly type: 'text' | 'reasoning';
  readonly value: string;
}

/**
 * Describes the end stream data which
 * contains data such as token usage
 */
export interface StreamEndData {
  readonly type: 'end';
  readonly reasonedFor: number;
  readonly tokenUsage: TokenUsage;
}

/**
 * Describes the usage tokens
 * for a particular request
 */
export interface TokenUsage {
  readonly input: number;
  readonly output: number;
  readonly reasoning: number;
  readonly total: number;
}
