import { FunctionComponent, ReactElement } from 'react';
import { BaseProps } from '../types';

/**
 * The `UserChatMessage` component props
 */
interface Props extends BaseProps {
  readonly children: string;
}

/**
 * Used to render the content
 * for the user chat message
 *
 * @param props The component props
 * @returns The `UserChatMessage` component
 */
const UserChatMessage: FunctionComponent<Props> = ({ children }): ReactElement<Props> => {
  return (
    <div className="max-w-[380px] sm:max-w-[600px] self-end bg-neutral-900 border-solid border-[1px] border-neutral-800 rounded-2xl pt-2 pb-2 pl-4 pr-4 ml-4 mr-4">
      <p className="font-sans text-white text-md">
        {children}
      </p>
    </div>
  );
};

export default UserChatMessage;
