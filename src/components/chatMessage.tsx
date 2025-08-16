import { FunctionComponent, ReactElement } from 'react';
import { Markdown } from './common';
import { BaseProps } from '../types';

/**
 * The `ChatMessage` component props
 */
interface Props extends BaseProps {
  readonly id: string;
  readonly role: 'user' | 'assistant';
  readonly children: string;
}

/**
 * Used to render the content for either
 * a user or assistant message
 *
 * @param props The component props
 * @returns The `ChatMessage` component
 */
const ChatMessage: FunctionComponent<Props> = ({ id, role, children }): ReactElement<Props> => {
  return (role === 'user')
    ? (
        <div className="max-w-[600px] self-end bg-zinc-900 border-solid border-[1px] border-zinc-800 rounded-2xl pt-2 pb-2 pl-4 pr-4">
          <p className="font-sans text-white text-md">{children}</p>
        </div>
      )
    : (
        <div className="self-start">
          <Markdown id={id}>
            {children}
          </Markdown>
        </div>
      );
};

export default ChatMessage;
