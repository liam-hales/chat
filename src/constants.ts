/**
 * Describes the definitions for all the
 * available AI models to chat with
 */
export const aiModelDefinitions = [
  {
    name: 'gpt-oss-20b',
    openRouterId: 'openai/gpt-oss-20b',
  },
  {
    name: 'gpt-oss-120b',
    openRouterId: 'openai/gpt-oss-120b',
  },
  {
    name: 'gpt-5-mini',
    openRouterId: 'openai/gpt-5-mini',
  },
] as const;
