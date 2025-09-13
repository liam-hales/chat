import { FunctionComponent, ReactElement } from 'react';
import { BaseProps } from '../types';
import { Repeat2, Forward } from 'lucide-react';
import { Error } from './common';

/**
 * The `ChatError` component props
 */
interface Props extends BaseProps {
  readonly message?: string;
  readonly onRetry: () => void;
  readonly onReport: () => void;
}

/**
 * Used to render the chat error UI used to display the error
 * message to the user and allow them to retry or report
 *
 * @param props The component props
 * @returns The `ChatError` component
 */
const ChatError: FunctionComponent<Props> = ({ message, onRetry, onReport }): ReactElement<Props> => {
  return (
    <Error className="self-start ml-4 mr-4">
      <div className="flex flex-col items-start sm:flex-row sm:items-center gap-4">
        {
          (message == null)
            ? 'Sorry, an unknown internal error has occurred.'
            : (
                <div className="flex flex-col gap-y-1">
                  <p className="font-sans text-white text-sm">
                    Sorry, an internal error occurred while talking to the AI model.
                  </p>
                  <p className="font-mono italic text-white text-[11px] pl-2">
                    {`- "${message}"`}
                  </p>
                </div>
              )
        }
        <div className="flex flex-row gap-x-2 pl-2">
          <button
            className="flex flex-row items-center gap-x-2 text-white cursor-pointer bg-white/20 hover:bg-white/50 border-solid border-[1px] border-white/60 hover:border-white rounded-md pt-1 pb-1 pl-2 pr-2"
            onClick={onRetry}
          >
            <Repeat2
              className="text-white"
              size={16}
            />
            <p className="font-sans text-white text-sm">
              Retry
            </p>
          </button>
          <button
            className="flex flex-row items-center gap-x-2 text-white cursor-pointer bg-white/20 hover:bg-white/50 border-solid border-[1px] border-white/60 hover:border-white rounded-md pt-1 pb-1 pl-2 pr-2"
            onClick={onReport}
          >
            <Forward
              className="text-white"
              size={16}
            />
            <p className="font-sans text-white text-sm">
              Report
            </p>
          </button>
        </div>
      </div>
    </Error>
  );
};

export default ChatError;
