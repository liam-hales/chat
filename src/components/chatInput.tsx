import { ChangeEvent, FunctionComponent, KeyboardEvent, ReactElement } from 'react';
import { AIModelDefinition, BaseProps } from '../types';
import { aiModelDefinitions } from '../constants';
import { withRef } from '../helpers';
import { ArrowUp, X } from 'lucide-react';
import { Model } from './';
import { Error, Info } from './common';

/**
 * The `ChatInput` component props
 */
interface Props extends BaseProps<HTMLInputElement> {
  readonly value: string;
  readonly modelDefinition: AIModelDefinition;
  readonly isDisabled?: boolean;
  readonly onChange: (value: string) => void;
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
    onChange,
    onModelChange,
    onSend,
    onAbort,
  } = props;

  const { limits } = modelDefinition;

  const limitReached = (
    value.length >
    (limits?.messageLength ?? Infinity)
  );

  const _onChange = (event: ChangeEvent<HTMLInputElement>): void => {

    // Destructure the event and the event target
    // and pass its value to `onChange`
    const { target } = event;
    const { value } = target;

    onChange(value);
  };

  const _onKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    const { key } = event;

    if (key === 'Enter') {

      // If the "Enter" key has been pressed, make sure
      // the user is allowed to snd the message
      if (value.trim() !== '' && limitReached === false && onSend != null) {
        onSend();
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-start">
      {
        (limitReached === true) && (
          <Error className="mb-4">
            You have reached the message character limit for this model.
          </Error>
        )
      }
      <div className="w-full bg-zinc-950 border-solid border-[1px] rounded-lg border-zinc-900">
        <div className="w-full flex flex-col items-center pt-5 pb-5 pl-5 pr-5">
          <input
            ref={internalRef}
            className="w-full h-6 text-white placeholder-zinc-600 font-sans text-md bg-transparent outline-none pl-1"
            placeholder="Chat with AI, ask anything you like"
            value={value}
            disabled={isDisabled}
            onChange={_onChange}
            onKeyDown={_onKeyDown}
          />
          <div className="w-full flex row items-end justify-between gap-x-6 pt-8">
            {
              (onModelChange == null) && (
                <Model
                  definition={modelDefinition}
                  appearance="light"
                />
              )
            }
            {
              (onModelChange != null) && (
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
                  <ArrowUp />
                </button>
              )
            }
            {
              (onAbort != null) && (
                <button
                  className="text-white cursor-pointer bg-zinc-800 border-solid border-[1px] border-zinc-600 hover:border-zinc-400 rounded-lg p-2"
                  onClick={onAbort}
                >
                  <X />
                </button>
              )
            }
          </div>
        </div>
      </div>
      {
        (modelDefinition.limits != null) && (
          <Info
            className="mt-4"
            icon="badge-pound-sterling"
          >
            The AI model you have selected costs and therefore has limits, the models responses and how much you can send will be restricted.
          </Info>
        )
      }
    </div>
  );
};

export default withRef(ChatInput);
