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
    `
    : systemMessage;

  /**
   * Executes the request to the LLM and updates
   * the stream with data as the LLM responds
   */
  const executeRequest = async (): Promise<void> => {
    const { textStream } = streamText({
      model: provider.chat(modelId),
      system: system,
      messages: messages,

      // eslint-disable-next-line no-console
      onError: (error) => console.error(error),
    });

    // Loop through the async iterable text stream
    // and update the stream with said text
    for await (const text of textStream) {
      stream.update(text);
    }

    // Once done, mark the stream
    // value as finalized
    stream.done();
  };

  // Execute the request to the LLM but do not `await`, instead return the
  // stream value which will be used on the client to read the text data
  void executeRequest();

  return stream.value;
};

export default streamChat;
