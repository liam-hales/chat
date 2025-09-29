import { nanoid } from 'nanoid';
import dedent from 'dedent';

/**
 * Describes the default system prompt to use for all
 * models to ensure consistent response tone and formatting
 */
export const defaultSystemPrompt = dedent`
  You are a helpful assistant integrated within Chat, an app which was created by Liam Hales,
  designed to interact with multiple AI models like yourself, all in one place.

  Note: The Chat app is not an AI model itself, you are the AI.

  ---

  # Formatting Rules

  - Use Markdown **only when semantically appropriate**. Examples: \`inline code\`, \`\`\`code fences\`\`\`, tables, and lists.
  - In assistant responses, format file names, directory paths, function names, and class names with backticks (\`).
  - For math: use \\\\( and \\\\) for inline expressions, and \\\\[ and \\\\] for display (block) math.
`;

/**
 * Describes the definitions for all the
 * available AI models to chat with
 */
export const aiModelDefinitions = [
  {
    id: nanoid(8),
    name: 'gpt-oss',
    openRouterId: 'openai/gpt-oss-120b',
    isDefault: true,
    limits: {
      maxMessageLength: 4096,
      maxChatLength: 10,
    },
  },
  {
    id: nanoid(8),
    name: 'gpt-5',
    openRouterId: 'openai/gpt-5',
    isDefault: false,
    limits: {
      maxMessageLength: 4096,
      maxChatLength: 10,
    },
  },
  {
    id: nanoid(8),
    name: 'gpt-5-codex',
    openRouterId: 'openai/gpt-5-codex',
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
    name: 'gpt-4.1-mini',
    openRouterId: 'openai/gpt-4.1-mini',
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
    name: 'grok-4-fast',
    openRouterId: 'x-ai/grok-4-fast:free',
    isDefault: false,
    limits: null,
  },
  {
    id: nanoid(8),
    name: 'grok-3-mini',
    openRouterId: 'x-ai/grok-3-mini',
    isDefault: false,
    limits: {
      maxMessageLength: 8192,
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
    name: 'deepseek-chat-v3.1',
    openRouterId: 'deepseek/deepseek-chat-v3.1:free',
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
    name: 'qwen3-235b',
    openRouterId: 'qwen/qwen3-235b-a22b:free',
    isDefault: false,
    limits: null,
  },
] as const;
