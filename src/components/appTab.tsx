'use client';

import { FunctionComponent, ReactElement, KeyboardEvent, useMemo } from 'react';
import { ChatInput } from '.';
import { useApp } from '../hooks';
import { BaseProps } from '../types';

/**
 * The `AppTab` component props
 */
interface Props extends BaseProps {
  readonly id: string;
}

/**
 * Used to render a single app tab which consists
 * of the chat input and message thread
 *
 * @param props The component props
 * @returns The `AppTab` component
 */
const AppTab: FunctionComponent<Props> = ({ id }): ReactElement<Props> => {

  const { getTab, setInputValue, setModel } = useApp();
  const { model, inputValue } = useMemo(() => getTab(id), [id, getTab]);

  /**
   * Used to handle keyboard events from the `ChatInput`
   * component underlying `input` HTML element
   *
   * @param event The keyboard event
   */
  const onKeyDown = async (event: KeyboardEvent<HTMLInputElement>): Promise<void> => {
    const { key } = event;
  };

  return (
    <ChatInput
      value={inputValue}
      model={model}
      onChange={(value) => setInputValue(id, value)}
      onModelChange={(value) => setModel(id, value)}
      onKeyDown={onKeyDown}
    />
  );
};

export default AppTab;
