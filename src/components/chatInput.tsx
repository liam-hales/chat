import { ChangeEvent, FunctionComponent, KeyboardEvent, ReactElement } from 'react';
import { AIModelDefinition, BaseProps } from '../types';
import { aiModelDefinitions } from '../constants';
import { withRef } from '../helpers';
import { ArrowUp, BadgePoundSterling, X } from 'lucide-react';
import { Model } from './';

/**
 * The `ChatInput` component props
 */
interface Props extends BaseProps<HTMLInputElement> {
  readonly value: string;
  readonly modelDefinition: AIModelDefinition;
  readonly allowModelSelect?: boolean;
  readonly isDisabled?: boolean;
  readonly onChange: (value: string) => void;
  readonly onModelChange: (definitionId: string) => void;
  readonly onSend: () => void;
  readonly onAbort: () => void;
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
    allowModelSelect = true,
    isDisabled = false,
    onChange,
    onModelChange,
    onSend,
    onAbort,
  } = props;

  const _onChange = (event: ChangeEvent<HTMLInputElement>): void => {

    // Destructure the event and the event target
    // and pass its value to `onChange`
    const { target } = event;
    const { value } = target;

    onChange(value);
  };

  const _onKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    const { key } = event;

    // If the "Enter" key has been pressed and the value is
    // not empty then call the `onSend` function
    if (key === 'Enter' && value.trim() !== '') {
      onSend();
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="bg-zinc-950 border-solid border-[1px] rounded-lg border-zinc-900">
        <div className="flex flex-col pt-5 pb-5 pl-5 pr-5">
          <input
            ref={internalRef}
            className="w-full h-6 text-white placeholder-zinc-600 font-sans text-md bg-transparent outline-none pl-1"
            placeholder="Chat with AI, ask anything you like"
            value={value}
            disabled={isDisabled}
            onChange={_onChange}
            onKeyDown={_onKeyDown}
          />
          <div>
            <div className="flex row items-end justify-between gap-x-6 pt-8">
              {
                (allowModelSelect === false) && (
                  <Model
                    definition={modelDefinition}
                    appearance="light"
                  />
                )
              }
              {
                (allowModelSelect === true) && (
                  <div className="max-w-[620px] flex flex-row flex-wrap items-center gap-3">
                    {
                      aiModelDefinitions.map((def) => {
                        return (
                          <Model
                            key={`model-${def.name}`}
                            definition={def}
                            appearance={(modelDefinition.id === def.id) ? 'light' : 'dark'}
                            onClick={() => onModelChange(def.id)}
                          />
                        );
                      })
                    }
                  </div>
                )
              }
              {
                (isDisabled === true)
                  ? (
                      <button
                        className="text-white cursor-pointer bg-zinc-800 border-solid border-[1px] border-zinc-600 hover:border-zinc-400 rounded-lg p-2"
                        onClick={onAbort}
                      >
                        <X />
                      </button>
                    )
                  : (
                      <button
                        className={`
                          text-white cursor-pointer bg-zinc-800 border-solid border-[1px] border-zinc-600 hover:border-zinc-400 rounded-lg p-2

                          disabled:cursor-not-allowed
                          disabled:text-zinc-600
                          disabled:bg-zinc-900
                          disabled:border-zinc-800

                        `}
                        onClick={onSend}
                        disabled={value.trim() === ''}
                      >
                        <ArrowUp />
                      </button>
                    )
              }
            </div>
          </div>
        </div>
      </div>
      {
        (modelDefinition.limits != null) && (
          <div className="flex flex-row items-center border-solid border-[1px] border-zinc-900 rounded-md mt-4 p-4">
            <BadgePoundSterling
              className="text-white shrink-0"
              size={18}
            />
            <p className="font-sans text-zinc-500 text-xs pl-3">
              The AI model you have selected costs and therefore has limits, the models responses and how much you can send will be restricted.
            </p>
          </div>
        )
      }
    </div>
  );
};

export default withRef(ChatInput);
