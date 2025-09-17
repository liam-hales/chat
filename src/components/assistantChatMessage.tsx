import { FunctionComponent, ReactElement } from 'react';
import { Markdown } from './common';
import { BaseProps, ChatMessageMetadata } from '../types';
import { ChatMessageActions } from './';
import Image from 'next/image';

/**
 * The `AssistantChatMessage` component props
 */
interface Props extends BaseProps {
  readonly id: string;
  readonly showTools?: boolean;
  readonly sourceUrls: string[];
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
    sourceUrls = [],
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
      <div className="flex flex-row items-center gap-x-3 pl-4 pr-4">
        {
          (showTools === true) && (
            <ChatMessageActions
              content={children}
              metadata={metadata}
              onRetry={onRetry}
            />
          )
        }
        {
          (sourceUrls.length > 0) && (
            <div className="flex flex-row items-center gap-x-3 bg-zinc-950 border-solid border-[1px] rounded-lg border-zinc-900 pt-2 pb-2 pl-4 pr-2">
              <p className="font-sans text-sm text-white">
                Sources
              </p>
              <div className="flex flex-row items-center gap-x-1">
                {
                  sourceUrls
                    .map((url) => new URL(url).hostname)
                    .filter((value, index, self) => self.indexOf(value) === index)
                    .map((hostname) => {
                      return (
                        <div
                          key={`icon-${hostname}`}
                          className="border-solid border-[1px] border-zinc-900 rounded-md overflow-hidden p-1"
                        >
                          <Image
                            src={`https://www.google.com/s2/favicons?sz=128&domain=${hostname}`}
                            alt={`${hostname} Icon`}
                            width={15}
                            height={15}
                            unoptimized={true}
                          />
                        </div>
                      );
                    })
                }
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default AssistantChatMessage;
