import { nanoid } from 'nanoid';

/**
 * Describes the definitions for all the
 * available AI models to chat with
 */
export const aiModelDefinitions = [
  {
    id: nanoid(8),
    name: 'gpt-oss-20b',
    openRouterId: 'openai/gpt-oss-20b',
    isDefault: true,
    limits: {
      maxMessageLength: 8192,
      maxChatLength: 10,
    },
  },
  {
    id: nanoid(8),
    name: 'gpt-oss-120b',
    openRouterId: 'openai/gpt-oss-120b',
    isDefault: false,
    limits: {
      maxMessageLength: 4096,
      maxChatLength: 10,
    },
  },
  {
    id: nanoid(8),
    name: 'gpt-5-mini',
    openRouterId: 'openai/gpt-5-mini',
    isDefault: false,
    limits: {
      maxMessageLength: 4096,
      maxChatLength: 10,
    },
  },
  {
    id: nanoid(8),
    name: 'gemini-2.0-flash',
    openRouterId: 'google/gemini-2.0-flash-exp:free',
    isDefault: false,
    limits: null,
  },
  {
    id: nanoid(8),
    name: 'grok-3-mini',
    openRouterId: 'x-ai/grok-3-mini',
    isDefault: false,
    limits: {
      maxMessageLength: 4096,
      maxChatLength: 10,
    },
  },
  {
    id: nanoid(8),
    name: 'grok-code-fast-1',
    openRouterId: 'x-ai/grok-code-fast-1',
    isDefault: false,
    limits: {
      maxMessageLength: 4096,
      maxChatLength: 10,
    },
  },
  {
    id: nanoid(8),
    name: 'claude-3-haiku',
    openRouterId: 'anthropic/claude-3-haiku',
    isDefault: false,
    limits: {
      maxMessageLength: 4096,
      maxChatLength: 10,
    },
  },
  {
    id: nanoid(8),
    name: 'deepseek-r1',
    openRouterId: 'deepseek/deepseek-r1-0528:free',
    isDefault: false,
    limits: null,
  },
  {
    id: nanoid(8),
    name: 'deepseek-v3',
    openRouterId: 'deepseek/deepseek-chat-v3-0324:free',
    isDefault: false,
    limits: null,
  },
  {
    id: nanoid(8),
    name: 'gemma-3-27b',
    openRouterId: 'google/gemma-3-27b-it:free',
    isDefault: false,
    limits: null,
  },
  {
    id: nanoid(8),
    name: 'gemma-3n-4b',
    openRouterId: 'google/gemma-3n-e4b-it:free',
    isDefault: false,
    limits: null,
  },
  {
    id: nanoid(8),
    name: 'qwen3-4b',
    openRouterId: 'qwen/qwen3-4b:free',
    isDefault: false,
    limits: null,
  },
  {
    id: nanoid(8),
    name: 'qwen3-235b',
    openRouterId: 'qwen/qwen3-235b-a22b:free',
    isDefault: false,
    limits: null,
  },
  {
    id: nanoid(8),
    name: 'qwen3-30b',
    openRouterId: 'qwen/qwen3-30b-a3b:free',
    isDefault: false,
    limits: null,
  },
] as const;
