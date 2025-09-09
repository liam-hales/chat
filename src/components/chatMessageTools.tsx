'use client';

import { FunctionComponent, ReactElement, useState } from 'react';
import { BaseProps, ChatMessageMetadata } from '../types';
import { Check, Copy, Repeat2 } from 'lucide-react';
import { MetadataPopover } from './index';

/**
 * The `ChatMessageTools` component props
 */
interface Props extends BaseProps {
  readonly content: string;
  readonly metadata?: ChatMessageMetadata;
  readonly onRetry: () => void;
}

/**
 * Used to render the tools for a chat message to show
 * message metadata and perform tasks such as copy and retry
 *
 * @param props The component props
 * @returns The `ChatMessageTools` component
 */
const ChatMessageTools: FunctionComponent<Props> = ({ content, metadata, onRetry }): ReactElement<Props> => {
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  const _onCopy = async (): Promise<void> => {
    await navigator.clipboard.writeText(content);

    // Set the has copied state and
    // reset it after 5 seconds
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="bg-zinc-950 border-solid border-[1px] rounded-lg border-zinc-900 p-3 ml-4 mr-4">
      <div className="flex flex-row items-center gap-x-4">
        <button
          className="cursor-pointer"
          onClick={_onCopy}
        >
          {
            (hasCopied === true)
              ? (
                  <Check
                    className="text-white"
                    size={14}
                  />
                )
              : (
                  <Copy
                    className="text-white"
                    size={14}
                  />
                )
          }
        </button>
        <button
          className="cursor-pointer"
          onClick={onRetry}
        >
          <Repeat2
            className="text-white"
            size={17}
          />
        </button>
        {
          (metadata != null) && (
            <MetadataPopover metadata={metadata} />
          )
        }
      </div>
    </div>
  );
};

export default ChatMessageTools;
