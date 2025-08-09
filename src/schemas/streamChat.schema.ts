import { z } from 'zod';
import { aiModelDefinitions } from '../constants';

/**
 * The schema for the `streamChat` helper used
 * for type inference and to validate options
 */
const streamChatSchema = z.object({
  modelId: z.union(
    aiModelDefinitions.map((model) => z.literal(model.openRouterId)),
  ),
  messages: z
    .array(
      z.object({
        role: z.union([
          z.literal('user'),
          z.literal('assistant'),
        ]),
        content: z.string()
          .min(1)
          .max(4096),
      }),
    )
    .min(1)
    .max(10),
});

export default streamChatSchema;
