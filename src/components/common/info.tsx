import { FunctionComponent, ReactElement } from 'react';
import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import { BaseProps } from '../../types';
import { X } from 'lucide-react';

/**
 * The `Info` component props
 */
interface Props extends BaseProps {
  readonly icon?: IconName;
  readonly children: string;
  readonly onDismiss?: () => void;
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
    <div className={`${className ?? ''} w-full flex flex-row items-center gap-x-3 border-solid border-[1px] border-zinc-900 rounded-md p-4`}>
      {
        (icon != null) && (
          <DynamicIcon
            className="text-white shrink-0"
            name={icon}
            size={18}
          />
        )
      }
      <p className="w-full font-sans text-zinc-500 text-xs">
        {children}
      </p>
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
