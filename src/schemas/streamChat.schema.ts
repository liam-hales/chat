import { z } from 'zod';
import { defaultSystemPrompt, aiModelDefinitions } from '../constants';
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

  const contentSchema = z
    .string()
    .min(1);

  // If the model has limits then set a
  // maximum character length for the content
  if (limits != null) {
    contentSchema.max(limits.maxMessageLength);
  }

  const messagesSchema = z
    .array(
      z
        .object({
          role: z.union([
            z.literal('user'),
            z.literal('assistant'),
          ]),
          content: contentSchema,
        })
        .strict(),
    )
    .min(1);

  // If the model has limits then set a
  // maximum length for the messages array
  if (limits != null) {
    messagesSchema.max(limits.maxChatLength);
  }

  const reasonOptionSchema = z
    .object({
      isEnabled: z.boolean(),
      effort: z
        .union([
          z.literal('high'),
          z.literal('medium'),
          z.literal('low'),
        ])
        .optional()
        .default('medium'),
    })
    .strict()
    .optional()
    .default({
      isEnabled: false,
      effort: 'medium',
    });

  const optionsSchema = z
    .object({
      reason: reasonOptionSchema,
    })
    .strict()
    .optional()
    .default({
      reason: {
        isEnabled: false,
        effort: 'medium',
      },
    });

  return z
    .object({
      modelId: z.literal(openRouterId),
      systemMessage: z
        .string()
        .min(1)
        .max(1024)
        .optional()
        .default(defaultSystemPrompt),
      messages: messagesSchema,
      options: optionsSchema,
      maxOutputLength: (limits != null)
        ? z
            .number()
            .min(1)
            .max(limits.maxMessageLength)
            .optional()
            .default(limits.maxMessageLength)
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
