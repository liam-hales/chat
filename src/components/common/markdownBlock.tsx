import { FunctionComponent, memo, ReactElement } from 'react';
import { BaseProps } from '../../types';
import { CodeHighlighter } from './';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * The `MarkdownBlock` component props
 */
interface Props extends BaseProps {
  readonly children: string;
}

/**
 * Used to render a given markdown string
 * using `react-markdown` under the hood.
 *
 * Uses `memo` for performance optimization
 * and rendering efficiency.
 *
 * @param props The component props
 * @returns The `MarkdownBlock` component
 */
const MarkdownBlock: FunctionComponent<Props> = ({ children }): ReactElement<Props> => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => {
          return (
            <h1 className="font-sans font-bold text-white text-3xl pt-2 pb-2">
              {children}
            </h1>
          );
        },
        h2: ({ children }) => {
          return (
            <h2 className="font-sans font-bold text-white text-2xl pt-2 pb-2">
              {children}
            </h2>
          );
        },
        h3: ({ children }) => {
          return (
            <h3 className="font-sans font-bold text-white text-xl pt-2 pb-2">
              {children}
            </h3>
          );
        },
        p: ({ children }) => {
          return (
            <p className="font-sans text-white text-md pt-2 pb-2">
              {children}
            </p>
          );
        },
        strong: ({ children }) => {
          return (
            <span className="font-sans font-bold text-white text-md">
              {children}
            </span>
          );
        },
        em: ({ children }) => {
          return (
            <em className="font-sans italic text-white text-md">
              {children}
            </em>
          );
        },
        code: ({ className, children }) => {
          const language = className?.replace('language-', '');

          // If the children is empty
          // then render nothing
          if (children == null) {
            return <></>;
          }

          // If the children is not a string then it is
          // unsupported and cannot be rendered
          if (typeof children !== 'string') {
            throw new Error(`Unsupported children type "${typeof children}" for "code" markdown`);
          }

          // If there was no language detected then the code is inline then render the
          // code inline, otherwise render the code with full syntax highlighting
          return (language == null)
            ? (
                <code className="font-mono text-white text-xs bg-zinc-900 border-solid border-[1px] border-zinc-800 rounded-md p-1 m-1">
                  {children}
                </code>
              )
            : (
                <CodeHighlighter
                  className="
                  mt-6 mb-6"
                  language={language}
                >
                  {children}
                </CodeHighlighter>
              );
        },
        ol: ({ children }) => {
          return (
            <ol className="list-decimal pt-4 pb-4 pl-10">
              {children}
            </ol>
          );
        },
        ul: ({ children }) => {
          return (
            <ul className="list-disc pt-4 pb-4 pl-10">
              {children}
            </ul>
          );
        },
        li: ({ children }) => {
          return (
            <li className="font-sans text-white text-md pt-1 pb-1 pl-2">
              {children}
            </li>
          );
        },
        table: ({ children }) => (
          <table className="w-full table table-auto bg-zinc-900/80 rounded-lg overflow-hidden mt-6 mb-6">
            {children}
          </table>
        ),
        thead: ({ children }) => (
          <thead className="bg-zinc-800">
            {children}
          </thead>
        ),
        tr: ({ children }) => (
          <tr className="">
            {children}
          </tr>
        ),
        th: ({ children }) => (
          <th className="text-start p-4">
            <span className="font-sans text-lg font-bold text-white">
              {children}
            </span>
          </th>
        ),
        td: ({ children }) => (
          <td className="border-solid border-t-4 border-black text-start p-4">
            <span className="font-sans text-md text-white">
              {children}
            </span>
          </td>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default memo(MarkdownBlock, (previous, next) => {

  // Check if the previous and next markdown string match
  // and if so then return the memoized component
  return (previous.children === next.children);
});
