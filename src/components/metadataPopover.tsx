import { FunctionComponent, ReactElement } from 'react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { ChartColumn } from 'lucide-react';
import { BaseProps, ChatMessageMetadata } from '../types';

/**
 * The `MetadataPopover` component props
 */
interface Props extends BaseProps {
  readonly metadata: ChatMessageMetadata;
}

/**
 * Used to render a metadata icon which when actioned,
 * displays a popover containing the message metadata
 *
 * @param props The component props
 * @returns The `MetadataPopover` component
 */
const MetadataPopover: FunctionComponent<Props> = ({ metadata }): ReactElement<Props> => {
  const { reasonedFor, tokenUsage } = metadata;

  const titleValues = [
    {
      title: 'Input tokens',
      value: `${tokenUsage.input}`,
    },
    {
      title: 'Output tokens',
      value: `${tokenUsage.output}`,
    },
    {
      title: 'Token tokens',
      value: `${tokenUsage.total}`,
    },
    {
      title: 'Reasoned for',
      value: `${(reasonedFor / 1000).toFixed(1)}s`,
      split: true,
    },
    {
      title: 'Reasoning tokens',
      value: `${tokenUsage.reasoning}`,
    },
  ];

  return (
    <Popover className="flex flex-col items-center">
      <PopoverButton className="cursor-pointer outline-none">
        <ChartColumn
          className="text-white"
          size={14}
        />
      </PopoverButton>
      <PopoverPanel
        className="w-52 flex flex-col items-start bg-zinc-950 border-solid border-[1px] rounded-lg border-zinc-900 [--anchor-gap:--spacing(2)] pt-3 pb-3 pl-5 pr-5 outline-none"
        anchor="bottom start"
        transition={true}
      >
        {
          titleValues.map((item, index) => {
            const { title, value, split } = item;
            return (
              <div
                key={`metadata-${index}`}
                className={`
                  w-full flex flex-row items-center justify-between
                  ${(split === true) ? 'pt-4' : 'pt-0'}
                `}
              >
                <p className="font-sans text-sm text-zinc-400">
                  {title}
                </p>
                <p className="font-mono text-xs text-white">
                  {value}
                </p>
              </div>
            );
          })
        }
      </PopoverPanel>
    </Popover>
  );
};

export default MetadataPopover;
