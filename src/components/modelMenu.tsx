import { FunctionComponent, ReactElement } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { AIModelDefinition, BaseProps } from '../types';
import { aiModelDefinitions } from '../constants';
import { Model } from './index';
import { BadgePoundSterling } from 'lucide-react';

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
          showDefaultLabel={true}
        />
      </MenuButton>
      <MenuItems
        className="flex flex-col gap-y-1 w-52 border-solid border-[1px] bg-zinc-900 border-zinc-800 rounded-md  [--anchor-gap:--spacing(3)] p-1 outline-none"
        transition={true}
        anchor="top start"
      >
        {
          aiModelDefinitions.map((definition) => {
            const { id, name, isDefault, limits } = definition;
            return (
              <MenuItem key={`model-${id}`}>
                <button
                  className="flex flex-row items-center justify-between gap-x-2 cursor-pointer rounded-sm hover:bg-zinc-600 pt-2 pb-2 pl-4 pr-4"
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
                      <BadgePoundSterling
                        className="text-white"
                        size={16}
                      />
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
