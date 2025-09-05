'use client';

import { FunctionComponent, ReactElement, ReactNode } from 'react';
import { BaseProps } from '../types';
import { useInput } from '../hooks';

/**
 * The `SafeArea` component props
 */
interface Props extends BaseProps {
  readonly children: ReactNode;
}

/**
 * Used to apply a safe area
 * padding to content
 *
 * @param props The component props
 * @returns The `SafeArea` component
 */
const SafeArea: FunctionComponent<Props> = ({ children }): ReactElement<Props> => {
  const { state } = useInput();
  return (
    <div className={`
      pt-safe pl-safe pr-safe
      ${(state === 'focused') ? 'pb-4' : 'pb-safe'}
    `}
    >
      {children}
    </div>
  );
};

export default SafeArea;
