import { FunctionComponent, ReactElement } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { AIModelDefinition, BaseProps } from '../types';
import { aiModelDefinitions } from '../constants';
import { Model } from './index';

/**
 * The `ModelMenu` component props
 */
interface Props extends BaseProps {
  readonly modelDefinition: AIModelDefinition;
  readonly onModelChange: (definitionId: string) => void;
}

/**
 * Used to render a model button which when actioned, displays
 * a menu of all models where each one can be selected
 *
 * @param props The component props
 * @returns The `ModelMenu` component
 */
const ModelMenu: FunctionComponent<Props> = ({ modelDefinition, onModelChange }): ReactElement<Props> => {
  return (
    <Menu>
      <MenuButton className="cursor-pointer outline-none">
        <Model
          definition={modelDefinition}
          appearance="dark"
        />
      </MenuButton>
      <MenuItems
        className="h-[420px] flex flex-col gap-y-1 w-68 border-solid border-[1px] bg-zinc-900 border-zinc-800 rounded-md  [--anchor-gap:--spacing(3)] p-1 outline-none no-scrollbar"
        transition={true}
        anchor="top start"
      >
        {
          aiModelDefinitions.map((definition) => {
            const { id, name, isDefault, limits } = definition;
            return (
              <MenuItem key={`model-${id}`}>
                <button
                  className="flex flex-row items-center justify-between gap-x-2 cursor-pointer rounded-sm hover:bg-zinc-700 pt-2 pb-2 pl-4 pr-2 group"
                  onClick={() => onModelChange(id)}
                >
                  <p className="font-mono text-white text-xs">
                    {
                      (isDefault === true)
                        ? `${name} (Default)`
                        : name
                    }
                  </p>
                  {
                    (limits != null) && (
                      <div className="border-solid border-[1px] bg-zinc-800 border-zinc-700 rounded-sm pt-1 pb-1 pl-2 pr-2 group-hover:bg-zinc-600 group-hover:border-zinc-500">
                        <p className="font-mono text-white text-[8px]">
                          Limited
                        </p>
                      </div>
                    )
                  }
                </button>
              </MenuItem>
            );
          })
        }
      </MenuItems>
    </Menu>
  );
};

export default ModelMenu;
