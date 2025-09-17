import { FunctionComponent, ReactElement } from 'react';
import { AIModelDefinition, BaseProps } from '../types';

/**
 * The `Model` component props
 */
interface Props extends BaseProps {
  readonly definition: AIModelDefinition;
  readonly appearance?: 'light' | 'dark';
  readonly form?: 'standard' | 'compact';
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
    form = 'standard',
    onClick,
  } = props;
  const { name, limits, isDefault } = definition;

  return (
    <div
      className={`
        ${className ?? ''}

        border-solid border-[1px] pl-2

        ${(form === 'standard') ? 'h-8' : 'h-auto pt-1 pb-1'}
        ${(form === 'standard') ? 'rounded-md' : 'rounded-sm'}
        ${(form === 'standard' && limits != null) ? 'pr-1' : 'pr-2'}

        ${(appearance === 'light') ? 'bg-neutral-500' : 'bg-neutral-900'}
        ${(appearance === 'light') ? 'border-neutral-400' : 'border-neutral-800'}

        ${(onClick != null) && 'cursor-pointer'}
      `}
      role={(onClick != null) ? 'button' : undefined}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onClick}
    >
      <div className="h-full flex flex-row items-center gap-x-3">
        <p className="font-mono text-white text-[11px]">
          {
            (form === 'standard' && isDefault === true)
              ? `${name} (Default)`
              : name
          }
        </p>
        {
          (form === 'standard' && limits != null) && (
            <div className="border-solid border-[1px] bg-neutral-800 border-neutral-700 rounded-sm pt-1 pb-1 pl-2 pr-2">
              <p className="font-mono text-white text-[8px]">
                Limited
              </p>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default Model;
