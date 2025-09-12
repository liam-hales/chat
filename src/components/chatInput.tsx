'use client';

import { ChangeEvent, FunctionComponent, KeyboardEvent, ReactElement, useState } from 'react';
import TextArea from 'react-textarea-autosize';
import { AIModelDefinition, BaseProps, ChatOptions, UpdateChatOptionPayload } from '../types';
import { withRef } from '../helpers';
import { ArrowUp, Lightbulb, Terminal, X } from 'lucide-react';
import { Model, ModelMenu } from './';
import { Error } from './common';

/**
 * The `ChatInput` component props
 */
interface Props extends BaseProps<HTMLTextAreaElement> {
  readonly value: string;
  readonly modelDefinition: AIModelDefinition;
  readonly isDisabled?: boolean;
  readonly options: ChatOptions;
  readonly onValueChange: (value: string) => void;
  readonly updateOption: <T extends keyof ChatOptions>(payload: UpdateChatOptionPayload<T>) => void;
  readonly onModelChange?: (definitionId: string) => void;
  readonly onSend?: () => void;
  readonly onAbort?: () => void;
}

/**
 * Used to render the chat input which allows the user
 * to enter text used to chat with an LLM
 *
 * @param props The component props
 * @returns The `ChatInput` component
 */
const ChatInput: FunctionComponent<Props> = (props): ReactElement<Props> => {
  const {
    internalRef,
    value,
    modelDefinition,
    isDisabled = false,
    options,
    onValueChange,
    updateOption,
    onModelChange,
    onSend,
    onAbort,
  } = props;

  const { limits, options: modelOptions } = modelDefinition;
  const { reason, prompt } = options;

  const [showPromptInput, setShowPromptInput] = useState<boolean>(false);

  const limitReached = (
    value.length >
    (limits?.maxMessageLength ?? Infinity)
  );

  const _onValueChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {

    // Destructure the event and the event target
    // and pass its value to `onChange`
    const { target } = event;
    const { value } = target;

    onValueChange(value);
  };

  const _onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>): void => {
    const { key, shiftKey } = event;

    // If the user has pressed the enter key,
    // make sure they were not also holding shift
    if (key === 'Enter' && shiftKey === false) {
      event.preventDefault();

      // If the "Enter" key has been pressed, make sure
      // the user is allowed to snd the message
      if (value.trim() !== '' && limitReached === false) {
        onSend?.();
      }
    }
  };

  const _toggleOption = (key: keyof ChatOptions): void => {
    // If the prompt option is being toggled, either show or hide
    // the prompt input depending on the prompt options current state
    if (key === 'prompt') {
      setShowPromptInput(prompt.isEnabled === false);
    }

    updateOption({
      key: key,
      data: {
        isEnabled: (options[key].isEnabled === false),
      },
    });
  };

  const _onPromptValueChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    const { target } = event;
    const { value } = target;

    // Update the prompt chat option with the
    // value extracted from the event
    updateOption({
      key: 'prompt',
      data: {
        value: value,
      },
    });
  };

  return (
    <div className="w-full flex flex-col items-start gap-y-4">
      {
        (limitReached === true) && (
          <Error>
            You have reached the message character limit for this model.
          </Error>
        )
      }
      {
        (showPromptInput === true) && (
          <div className="w-full flex flex-row items-center gap-x-2 border-solid border-[1px] rounded-lg border-zinc-900 p-5">
            <TextArea
              className="w-full max-h-40 text-white placeholder-zinc-600 font-mono text-sm bg-transparent outline-none pl-1 caret-white resize-none"
              placeholder=">_ system prompt"
              value={prompt.value}
              onChange={_onPromptValueChange}
            />
            <X
              className="text-white shrink-0 cursor-pointer"
              size={18}
              onClick={() => setShowPromptInput(false)}
            />
          </div>
        )
      }
      <div className="w-full bg-zinc-950 border-solid border-[1px] rounded-lg border-zinc-900">
        <div className="w-full flex flex-col items-center p-5">
          <TextArea
            ref={internalRef}
            className="w-full max-h-40 text-white placeholder-zinc-600 font-sans text-lg bg-transparent outline-none pl-1 caret-white resize-none"
            placeholder="Chat with AI, ask anything you like"
            value={value}
            disabled={isDisabled}
            onChange={_onValueChange}
            onKeyDown={_onKeyDown}
          />
          <div className="w-full flex flex-row items-end justify-between gap-x-6 pt-8">
            <div className="flex flex-row items-center gap-x-2 sm:gap-x-3">
              {
                (onModelChange != null)
                  ? (
                      <ModelMenu
                        modelDefinition={modelDefinition}
                        onModelChange={onModelChange}
                      />
                    )
                  : (
                      <Model
                        definition={modelDefinition}
                        appearance="dark"
                      />
                    )
              }
              <button
                className={`
                  flex flex-row items-center gap-x-2 text-white cursor-pointer border-solid border-[1px] rounded-md group p-[7px]

                  sm:pt-[5px] sm:pb-[5px] sm:pl-2 sm:pr-3

                  ${(reason.isEnabled === true) ? 'bg-zinc-700' : 'bg-zinc-900'}
                  ${(reason.isEnabled === true) ? 'border-zinc-500' : 'border-zinc-800'}

                  disabled:cursor-not-allowed
                  disabled:text-zinc-600
                  disabled:bg-zinc-900/60
                  disabled:border-zinc-800/80
                `}
                disabled={modelOptions.reason === 'unavailable'}
                onClick={() => _toggleOption('reason')}
              >
                <Lightbulb size={16} />
                <p className="font-sans text-sm hidden sm:block">
                  Reason
                </p>
              </button>
              <button
                className={`
                  flex flex-row items-center gap-x-2 text-white cursor-pointer border-solid border-[1px] rounded-md group p-[7px]

                  sm:pt-[5px] sm:pb-[5px] sm:pl-2 sm:pr-3

                  ${(prompt.isEnabled === true) ? 'bg-zinc-700' : 'bg-zinc-900'}
                  ${(prompt.isEnabled === true) ? 'border-zinc-500' : 'border-zinc-800'}

                  disabled:cursor-not-allowed
                  disabled:text-zinc-600
                  disabled:bg-zinc-900/60
                  disabled:border-zinc-800/80
                `}
                onClick={() => _toggleOption('prompt')}
              >
                <Terminal size={16} />
                <p className="font-sans text-sm hidden sm:block">
                  Prompt
                </p>
              </button>
            </div>
            {
              (onSend != null) && (
                <button
                  className={`
                    text-white cursor-pointer bg-zinc-800 border-solid border-[1px] border-zinc-600 hover:border-zinc-400 rounded-lg p-2

                    disabled:cursor-not-allowed
                    disabled:text-zinc-600
                    disabled:bg-zinc-900
                    disabled:border-zinc-800
                  `}
                  onClick={onSend}
                  disabled={
                    value.trim() === '' ||
                    limitReached === true
                  }
                >
                  <ArrowUp size={20} />
                </button>
              )
            }
            {
              (onAbort != null) && (
                <button
                  className="cursor-pointer bg-zinc-800 border-solid border-[1px] border-zinc-600 hover:border-zinc-400 rounded-lg p-2"
                  onClick={onAbort}
                >
                  <X
                    className="text-white"
                    size={20}
                  />
                </button>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRef(ChatInput);
