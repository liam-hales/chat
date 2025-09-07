import { FunctionComponent, ReactElement } from 'react';
import { Markdown } from './common';
import { BaseProps } from '../types';

/**
 * The `AssistantChatMessage` component props
 */
interface Props extends BaseProps {
  readonly id: string;
  readonly children: string;
}

/**
 * Used to render the content
 * for the assistant chat message
 *
 * @param props The component props
 * @returns The `AssistantChatMessage` component
 */
const AssistantChatMessage: FunctionComponent<Props> = ({ id, children }): ReactElement<Props> => {
  return (
    <Markdown
      className="w-full self-start [&>*]:pl-4 [&>*]:pr-4"
      id={id}
    >
      {children}
    </Markdown>
  );
};

export default AssistantChatMessage;
