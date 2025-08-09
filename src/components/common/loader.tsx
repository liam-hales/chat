'use client';

import { FunctionComponent, ReactElement } from 'react';
import { BaseProps } from '../../types';

/**
 * The `Loader` component props
 */
interface Props extends BaseProps {
  readonly text?: string;
}

/**
 * Used to render the loading spinner to feedback to the
 * user that something is loading or data is being fetched
 *
 * @param props The component props
 * @returns The `Loader` component
 */
const Loader: FunctionComponent<Props> = ({ className, text }): ReactElement<Props> => {
  return (
    <div className={`${className ?? ''} flex flex-row items-center`}>
      <div className="relative">
        <div className="w-6 h-6 absolute rounded-full border-transparent border-t-solid border-4 border-t-white animate-spinner" />
        <div className="w-6 h-6 rounded-full border-t-solid border-4 border-zinc-800" />
      </div>
      {
        (text != null) && (
          <p className="font-sans text-sm text-white pl-3">{text}</p>
        )
      }
    </div>
  );
};

export default Loader;
