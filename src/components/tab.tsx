'use client';

import { FunctionComponent, ReactElement, useState } from 'react';
import { X } from 'lucide-react';
import { AIModelDefinition, BaseProps } from '../types';
import { Loader } from './common';
import { Model } from './';

/**
 * The `Tab` component props
 */
interface Props extends BaseProps {
  readonly title: string;
  readonly modelDefinition: AIModelDefinition;
  readonly isLoading?: boolean;
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
const Tab: FunctionComponent<Props> = (props): ReactElement<Props> => {
  const {
    title,
    modelDefinition,
    isLoading = false,
    isSelected = false,
    onSelect,
    onDelete,
  } = props;

  const [isHovering, setIsHovering] = useState<boolean>(false);

  return (
    <div
      className={`
        h-full flex flex-row items-center cursor-pointer border-solid border-[1px] rounded-lg pl-2 pr-2

        ${(isSelected === true) ? 'bg-neutral-700' : 'bg-neutral-950'}
        ${(isSelected === true) ? 'border-neutral-500' : 'border-neutral-800'}
      `}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={onSelect}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {
        (isLoading === true) && (
          <Loader appearance={(isSelected === true) ? 'light' : 'dark'} />
        )
      }
      <p className="font-sans text-white text-sm pr-6 pl-3">
        {title}
      </p>
      <div className="flex flex-row gap-x-2">
        <Model
          definition={modelDefinition}
          appearance={(isSelected === true) ? 'light' : 'dark'}
          form="compact"
        />
        {
          (isHovering === true) && (
            <button
              className="cursor-pointer"
              onClick={(event) => {

                // Prevent propagation to stop the
                // parent div `onClick` being called
                event.stopPropagation();
                onDelete();
              }}
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
