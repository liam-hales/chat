import { FunctionComponent, ReactElement } from 'react';
import { AIModelDefinition, BaseProps } from '../types';

/**
 * The `Model` component props
 */
interface Props extends BaseProps {
  readonly definition: AIModelDefinition;
  readonly appearance?: 'light' | 'dark';
  readonly onClick?: () => void;
}

/**
 * Used to render the model button/tag which renders
 * the model and/or allows the user to select it
 *
 * @param props The component props
 * @retruns The `Model` component
 */
const Model: FunctionComponent<Props> = ({ definition, appearance = 'dark', onClick }): ReactElement<Props> => {
  const { name } = definition;

  return (
    <button
      className={`
        border-solid border-[1px] rounded-md pt-1 pb-1 pl-2 pr-2

        ${(appearance === 'light') ? 'bg-zinc-500' : 'bg-zinc-900'}
        ${(appearance === 'light') ? 'border-zinc-400' : 'border-zinc-800'}

        ${(onClick != null) && 'cursor-pointer'}
      `}
      onClick={onClick}
    >
      <p className="font-mono text-white text-[11px]">
        {name}
      </p>
    </button>
  );
};

export default Model;
