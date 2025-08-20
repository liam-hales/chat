import { nanoid } from 'nanoid';

/**
 * Describes the definitions for all the
 * available AI models to chat with
 */
export const aiModelDefinitions = [
  {
    id: nanoid(8),
    name: 'gpt-oss-20b',
    openRouterId: 'openai/gpt-oss-20b:free',
    isDefault: true,
    limits: null,
  },
  {
    id: nanoid(8),
    name: 'gpt-oss-120b',
    openRouterId: 'openai/gpt-oss-120b',
    isDefault: false,
    limits: {
      outputTokens: 1024,
      messageLength: 4096,
      chatLength: 10,
    },
  },
  {
    id: nanoid(8),
    name: 'gpt-5-mini',
    openRouterId: 'openai/gpt-5-mini',
    isDefault: false,
    limits: {
      outputTokens: 1024,
      messageLength: 4096,
      chatLength: 10,
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
    name: 'gemma-3-27b',
    openRouterId: 'google/gemma-3-27b-it:free',
    isDefault: false,
    limits: null,
  },
  {
    id: nanoid(8),
    name: 'gemma-3n-2b',
    openRouterId: 'google/gemma-3n-e2b-it:free',
    isDefault: false,
    limits: null,
  },
] as const;
