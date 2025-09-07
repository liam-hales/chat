import { FunctionComponent, ReactElement, memo, useMemo } from 'react';
import { BaseProps } from '../../types';
import { MarkdownBlock } from './';
import { marked } from 'marked';

/**
 * The `Markdown` component props
 */
interface Props extends BaseProps {
  readonly id: string;
  readonly children: string;
}

/**
 * Used to parse a given markdown string into blocks and
 * render each one using the `Markdown` component.
 *
 * Uses `memo` and `useMemo` for performance
 * optimization and rendering efficiency.
 *
 * @param props The component props
 * @returns The `Markdown` component
 */
const Markdown: FunctionComponent<Props> = ({ className, id, children }): ReactElement<Props> => {
  const blocks = useMemo(() => {

    // Parse the markdown string into blocks
    // using the `marked` lexer
    return marked
      .lexer(children)
      .map((token) => token.raw);
  }, [children]);

  return (
    <div className={`${className ?? ''} flex flex-col items-start gap-y-4`}>
      {
        blocks.map((block, index) => {
          return (
            <MarkdownBlock key={`markdown-${id}-block-${index}`}>
              {block}
            </MarkdownBlock>
          );
        })
      }
    </div>
  );
};

export default memo(Markdown);
