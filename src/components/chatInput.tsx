import { ChangeEvent, FunctionComponent, KeyboardEvent, ReactElement } from 'react';
import { AIModel, BaseProps } from '../types';
import { aiModels } from '../constants';
import { ArrowUp } from 'lucide-react';

/**
 * The `ChatInput` component props
 */
interface Props extends BaseProps<HTMLInputElement> {
  readonly value: string;
  readonly model: AIModel;
  readonly allowModelSelect?: boolean;
  readonly isDisabled?: boolean;
  readonly onChange: (value: string) => void;
  readonly onModelChange: (value: AIModel) => void;
  readonly onSend: () => void;
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
    value,
    model,
    allowModelSelect = true,
    isDisabled = false,
    onChange,
    onModelChange,
    onSend,
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
    <div className="w-full bg-zinc-950 border-solid border-[1px] rounded-lg border-zinc-900">
      <div className="flex flex-col pt-5 pb-5 pl-5 pr-5">
        <input
          className="w-full h-6 text-white placeholder-zinc-600 font-sans text-md bg-transparent outline-none pl-1"
          placeholder="Chat with AI, ask anything you like"
          value={value}
          disabled={isDisabled}
          onChange={_onChange}
          onKeyDown={_onKeyDown}
        />
        <div className="flex row items-end justify-between gap-x-6 pt-8">
          {
            (allowModelSelect === false) && (
              <div className="font-mono text-[11px] text-white border-solid border-[1px] border-zinc-500 bg-zinc-700 rounded-md pt-[6px] pb-[6px] pl-[10px] pr-[10px]">
                {model}
              </div>
            )
          }
          {
            (allowModelSelect === true) && (

              <div className="max-w-[620px] flex flex-row flex-wrap items-center gap-3">
                {
                  aiModels.map((name) => {
                    return (
                      <button
                        className={`
                          font-mono text-[11px] text-white cursor-pointer border-solid border-[1px] rounded-md pt-[6px] pb-[6px] pl-[10px] pr-[10px]

                          ${(model === name) ? 'bg-zinc-700' : 'bg-zinc-900'}
                          ${(model === name) ? 'border-zinc-500' : 'border-zinc-800'}
                        `}
                        key={name}
                        onClick={() => onModelChange(name)}
                      >
                        {name}
                      </button>
                    );
                  })
                }
              </div>
            )
          }
          <button
            className={`
              text-white cursor-pointer bg-zinc-800 border-solid border-[1px] border-zinc-600 rounded-lg p-2

              disabled:cursor-not-allowed
              disabled:text-zinc-500
              disabled:bg-zinc-900
              disabled:border-zinc-800
            `}
            onClick={() => onSend()}
            disabled={isDisabled === true || value.trim() === ''}
          >
            <ArrowUp />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
