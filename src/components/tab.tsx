'use client';

import { FunctionComponent, ReactElement, useState } from 'react';
import { X } from 'lucide-react';
import { AIModel, BaseProps } from '../types';

/**
 * The `Tab` component props
 */
interface Props extends BaseProps {
  readonly title: string;
  readonly model: AIModel;
  readonly isSelected?: boolean;
  readonly onSelect: () => void;
  readonly onDelete: () => void;
}

/**
 * Used to render a single chat tab and details
 * about the chat such as the title and AI model
 *
 * @param props The component props
 * @returns The `Tab` component
 */
const Tab: FunctionComponent<Props> = ({ title, model, isSelected = false, onSelect, onDelete }): ReactElement<Props> => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className={
        `h-full flex flex-row items-center gap-x-10 cursor-pointer border-solid border-[1px] rounded-lg pl-5 pr-2

        ${(isSelected === true) ? 'bg-zinc-700' : 'bg-zinc-900'}
        ${(isSelected === true) ? 'border-zinc-500' : 'border-zinc-800'}
      `
      }
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={onSelect}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <p className="font-sans text-white text-sm">
        {title}
      </p>
      <div className="flex flex-row">
        <p className={`
          font-sans text-white text-xs border-solid border-[1px] rounded-md pt-1 pb-1 pl-2 pr-2

          ${(isSelected === true) ? 'bg-zinc-500' : 'bg-zinc-800'}
          ${(isSelected === true) ? 'border-zinc-400' : 'border-zinc-700'}
        `}
        >
          {model}
        </p>
        {
          (isHovering === true) && (
            <button
              className="cursor-pointer pl-2"
              onClick={onDelete}
            >
              <X
                className="text-white"
                size={18}
              />
            </button>
          )
        }
      </div>
    </div>
  );
};

export default Tab;
