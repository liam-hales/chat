import { FunctionComponent, ReactElement, ReactNode } from 'react';
import { OctagonX } from 'lucide-react';
import { BaseProps } from '../../types';

/**
 * The `Error` component props
 */
interface Props extends BaseProps {
  readonly children: ReactNode;
}

/**
 * Used to render the error UI used to
 * display error messages to the user
 *
 * @param props The component props
 * @returns The `Error` component
 */
const Error: FunctionComponent<Props> = ({ className, children }): ReactElement<Props> => {
  return (
    <div className={`${className ?? ''} flex flex-row items-center gap-x-4 bg-red-950/60 border-solid border-[1px] rounded-lg border-red-900/60 p-4`}>
      <OctagonX
        className="text-white shrink-0"
        size={18}
      />
      {
        (typeof children === 'string')
          ? (
              <p className="font-sans text-white text-sm">
                {children}
              </p>
            )
          : children
      }
    </div>
  );
};

export default Error;
