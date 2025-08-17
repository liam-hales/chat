import { FunctionComponent, ReactElement } from 'react';
import { OctagonAlert } from 'lucide-react';
import { BaseProps } from '../../types';

/**
 * The `Error` component props
 */
interface Props extends BaseProps {
  readonly children: string;
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
    <div className={`${className ?? ''} flex flex-row items-center gap-x-3 bg-red-950/50 border-solid border-[1px] rounded-lg border-red-950 p-3`}>
      <OctagonAlert
        className="text-white shrink-0"
        size={18}
      />
      <p className="font-sans text-white text-sm">
        { children}
      </p>
    </div>
  );
};

export default Error;
