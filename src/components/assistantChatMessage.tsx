import { FunctionComponent, ReactElement } from 'react';
import { Markdown } from './common';
import { BaseProps, ChatMessageMetadata } from '../types';
import { ChatMessageActions } from './';

/**
 * The `AssistantChatMessage` component props
 */
interface Props extends BaseProps {
  readonly id: string;
  readonly showTools?: boolean;
  readonly metadata?: ChatMessageMetadata;
  readonly onRetry: () => void;
  readonly children: string;
}

/**
 * Used to render the content
 * for the assistant chat message
 *
 * @param props The component props
 * @returns The `AssistantChatMessage` component
 */
const AssistantChatMessage: FunctionComponent<Props> = (props): ReactElement<Props> => {
  const {
    id,
    showTools = false,
    metadata,
    onRetry,
    children,
  } = props;

  return (
    <div className="w-full flex flex-col items-start gap-y-4">
      <Markdown
        className="w-full self-start [&>*]:pl-4 [&>*]:pr-4"
        id={id}
      >
        {children}
      </Markdown>
      {
        (showTools === true) && (
          <ChatMessageActions
            content={children}
            metadata={metadata}
            onRetry={onRetry}
          />
        )
      }
    </div>
  );
};

export default AssistantChatMessage;
