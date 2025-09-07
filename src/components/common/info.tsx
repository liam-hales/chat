import { Fragment, FunctionComponent, ReactElement, ReactNode } from 'react';
import { BaseProps } from '../../types';
import { X } from 'lucide-react';

/**
 * The `Info` component props
 */
interface Props extends BaseProps {
  readonly icon?: ReactNode;
  readonly onDismiss?: () => void;
  readonly children: ReactNode;
}

/**
 * Used to render the info UI used to
 * display information messages to the user
 *
 * @param props The component props
 * @returns The `Info` component
 */
const Info: FunctionComponent<Props> = ({ className, icon, children, onDismiss }): ReactElement<Props> => {
  return (
    <div className={`${className ?? ''} flex flex-row items-center gap-x-4 border-solid border-[1px] border-zinc-900 rounded-md p-4`}>
      {
        (icon != null) && (
          <Fragment>
            {icon}
          </Fragment>
        )
      }
      {
        (typeof children === 'string')
          ? (
              <p className="font-sans text-white text-sm">
                {children}
              </p>
            )
          : children
      }
      {
        (onDismiss != null) && (
          <X
            className="text-white shrink-0 cursor-pointer"
            size={18}
            onClick={onDismiss}
          />
        )
      }
    </div>
  );
};

export default Info;
