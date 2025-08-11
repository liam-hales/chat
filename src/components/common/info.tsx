import { FunctionComponent, ReactElement } from 'react';
import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import { BaseProps } from '../../types';

/**
 * The `Info` component props
 */
interface Props extends BaseProps {
  readonly icon?: IconName;
  readonly children: string;
}

/**
 * Used to render the info UI used to
 * display information messages to the user
 *
 * @param props The component props
 * @returns The `Info` component
 */
const Info: FunctionComponent<Props> = ({ className, icon, children }): ReactElement<Props> => {
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
      <p className="font-sans text-zinc-500 text-xs">
        {children}
      </p>
    </div>
  );
};

export default Info;
