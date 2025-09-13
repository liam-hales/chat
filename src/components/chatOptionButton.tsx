import { FunctionComponent, ReactElement } from 'react';
import { BaseProps } from '../types';
import { DynamicIcon, IconName } from 'lucide-react/dynamic';

/**
 * The `ChatOptionButton` component props
 */
interface Props extends BaseProps {
  readonly icon: IconName;
  readonly isSelected?: boolean;
  readonly isDisabled?: boolean;
  readonly onClick?: () => void;
  readonly children: string;
}

/**
 * Used to render the chat option button which
 * when selected, toggles a chat option
 *
 * @param props The component props
 * @returns The `ChatOptionButton` component
 */
const ChatOptionButton: FunctionComponent<Props> = (props): ReactElement<Props> => {
  const {
    icon,
    isSelected = false,
    isDisabled = false,
    onClick,
    children,
  } = props;

  return (
    <button
      className={`
        flex flex-row items-center gap-x-2 text-white cursor-pointer border-solid border-[1px] rounded-md group p-[7px]

        sm:pt-[5px] sm:pb-[5px] sm:pl-2 sm:pr-3

        ${(isSelected === true) ? 'bg-zinc-700' : 'bg-zinc-900'}
        ${(isSelected === true) ? 'border-zinc-500' : 'border-zinc-800'}

        disabled:cursor-not-allowed
        disabled:text-zinc-600
        disabled:bg-zinc-900/60
        disabled:border-zinc-800/80
      `}
      disabled={isDisabled}
      onClick={onClick}
    >
      <DynamicIcon
        name={icon}
        size={16}
      />
      <p className="font-sans text-sm hidden sm:block">
        {children}
      </p>
    </button>
  );
};

export default ChatOptionButton;
