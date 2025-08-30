'use server';

import { createStreamableValue, StreamableValue } from '@ai-sdk/rsc';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';
import { z } from 'zod';
import { streamChatSchema } from '../schemas';
import getConfig from 'next/config';
import dedent from 'dedent';

/**
 * Used to stream the chat response from the LLM to the client
 * using the OpenRouter API and `ai` package under the hood
 *
 * @param options The options
 * @returns The client streamable value
 */
const streamChat = async (options: z.infer<typeof streamChatSchema>): Promise<StreamableValue<string>> => {

  // As this is a server action, we need to
  // validate the options before using them
  const validated = streamChatSchema.parse(options);
  const { modelId, systemMessage, messages, maxOutputLength } = validated;

  const { serverRuntimeConfig } = getConfig();
  const { openRouterApiKey } = serverRuntimeConfig;

  // Create the stream used to send the text data to the client
  // Create the OpenAI provider with the API key
  const stream = createStreamableValue<string>();
  const provider = createOpenRouter({
    apiKey: openRouterApiKey,
    compatibility: 'strict',
  });

  // If the `maxOutputLength` has been set then append a max character
  // usage prompt to the system message for the LLM to comply with
  const system = (maxOutputLength != null)
    ? dedent`
      ${systemMessage ?? ''}

      Your response must never exceed ${maxOutputLength} characters.
      If you need to use more characters then tell the user that you are limited due to costs.
    `.trim()
    : systemMessage;

  /**
   * Executes the request to the LLM and updates
   * the stream with data as the LLM responds
   */
  const executeRequest = async (): Promise<void> => {
    const { fullStream } = streamText({
      model: provider.chat(modelId),
      system: system,
      messages: messages,
    });

    // Loop through the async iterable text stream
    // and update the stream with said text
    for await (const part of fullStream) {
      switch (part.type) {

        case 'text-delta': {
          // Update the stream with the text
          // to stream it to the client
          stream.update(part.text);
          break;
        }

        case 'error': {
          if (part.error instanceof Error) {
            const { message } = part.error;

            // Update the stream with the error
            // to stream it to the client
            stream.error(message);
          }

          break;
        }

        case 'finish':
        case 'abort': {
          // Once done, mark the stream
          // value as finalized
          stream.done();
        }
      }
    }
  };

  // Execute the request to the LLM but do not `await`, instead return the
  // stream value which will be used on the client to read the text data
  void executeRequest();

  return stream.value;
};

export default streamChat;
