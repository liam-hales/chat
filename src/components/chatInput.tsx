import { ChangeEvent, FunctionComponent, KeyboardEvent, ReactElement } from 'react';
import { AIModel, BaseProps } from '../types';
import { aiModels } from '../constants';

/**
 * The `ChatInput` component props
 */
interface Props extends BaseProps<HTMLInputElement> {
  readonly value: string;
  readonly model: AIModel;
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

    // If the "Enter" key has been pressed
    // then call the `onSend` function
    if (key === 'Enter') {
      onSend();
    }
  };

  return (
    <div className="w-full bg-zinc-950 border-solid border-[1px] rounded-lg border-zinc-900">
      <div className="flex flex-col pt-5 pb-6 pl-6 pr-6">
        <input
          className="h-6 text-white placeholder-zinc-600 font-sans text-md bg-transparent outline-none"
          placeholder="Chat with AI, ask anything you like"
          value={value}
          disabled={isDisabled}
          onChange={_onChange}
          onKeyDown={_onKeyDown}
        />
        <div className="flex flex-col pt-8">
          <div className="flex flex-row items-center gap-x-3">
            {
              aiModels.map((name) => {
                return (
                  <div
                    className={`cursor-pointer bg-zinc-${(model === name) ? 700 : 900} border-solid border-[1px] rounded-lg border-zinc-${(model === name) ? 500 : 800} pt-2 pb-2 pl-3 pr-3`}
                    key={name}
                    role="button"
                    tabIndex={0}
                    onClick={() => onModelChange(name)}
                    onKeyDown={() => onModelChange(name)}
                  >
                    <p className="font-mono text-xs text-white">
                      {name}
                    </p>
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
