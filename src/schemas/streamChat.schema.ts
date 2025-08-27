import { z } from 'zod';
import { aiModelDefinitions } from '../constants';
import { AIModelDefinition } from '../types';

/**
 * Used to build the schema for a specific model
 * `definition` taking into account its `limits`
 *
 * @param definition The model definition
 * @returns The schema
 */
const _buildSchema = (definition: AIModelDefinition) => {
  const { openRouterId, limits } = definition;

  const content = z
    .string()
    .min(1);

  // If the model has limits then set a
  // maximum character length for the content
  if (limits != null) {
    content.max(limits.maxMessageLength);
  }

  const messages = z
    .array(
      z
        .object({
          role: z.union([
            z.literal('user'),
            z.literal('assistant'),
          ]),
          content: content,
        })
        .strict(),
    )
    .min(1);

  // If the model has limits then set a
  // maximum length for the messages array
  if (limits != null) {
    messages.max(limits.maxChatLength);
  }

  return z
    .object({
      modelId: z.literal(openRouterId),
      systemMessage: z
        .string()
        .min(1)
        .max(1024)
        .optional(),
      messages: messages,
      maxOutputLength: (limits != null)
        ? z
            .number()
            .min(1)
            .max(limits.maxMessageLength)
            .default(limits.maxMessageLength)
            .optional()
        : z
            .number()
            .min(1)
            .optional(),
    })
    .strict();
};

/**
 * The schema for the `streamChat` helper used
 * for type inference and to validate options
 */
const streamChatSchema = z.union(
  aiModelDefinitions.map((definition) => _buildSchema(definition)),
);

export default streamChatSchema;
