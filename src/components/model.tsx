import { FunctionComponent, ReactElement } from 'react';
import { AIModelDefinition, BaseProps } from '../types';
import { BadgePoundSterling } from 'lucide-react';

/**
 * The `Model` component props
 */
interface Props extends BaseProps {
  readonly definition: AIModelDefinition;
  readonly appearance?: 'light' | 'dark';
  readonly size?: 'small' | 'large';
  readonly showDefaultLabel?: boolean;
  readonly onClick?: () => void;
}

/**
 * Used to render the model button/tag which renders
 * the model and/or allows the user to select it
 *
 * @param props The component props
 * @retruns The `Model` component
 */
const Model: FunctionComponent<Props> = (props): ReactElement<Props> => {
  const {
    className,
    definition,
    appearance = 'dark',
    size = 'small',
    showDefaultLabel = false,
    onClick,
  } = props;
  const { name, limits, isDefault } = definition;

  return (
    <div
      className={`
        ${className ?? ''}

        border-solid border-[1px] rounded-md

        ${(size === 'small') ? 'pt-1 pb-1 pl-2 pr-2' : 'pt-2 pb-2 pl-3 pr-3'}

        ${(appearance === 'light') ? 'bg-zinc-500' : 'bg-zinc-900'}
        ${(appearance === 'light') ? 'border-zinc-400' : 'border-zinc-800'}

        ${(onClick != null) && 'cursor-pointer'}
      `}
      role={(onClick != null) ? 'button' : undefined}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onClick}
    >
      <div className="flex flex-row items-center gap-x-2">
        <p className={`
          font-mono text-white
          ${(size === 'small') ? 'text-[11px]' : 'text-xs'}
        `}
        >
          {
            (isDefault === true && showDefaultLabel === true)
              ? `${name} (Default)`
              : name
          }
        </p>
        {
          (limits != null) && (
            <BadgePoundSterling
              className="text-white"
              size={(size === 'small') ? 14 : 16}
            />
          )
        }
      </div>
    </div>
  );
};

export default Model;
