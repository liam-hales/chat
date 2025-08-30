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
            <h1 className="font-sans font-bold text-white text-3xl">
              {children}
            </h1>
          );
        },
        h2: ({ children }) => {
          return (
            <h2 className="font-sans font-bold text-white text-2xl">
              {children}
            </h2>
          );
        },
        h3: ({ children }) => {
          return (
            <h3 className="font-sans font-bold text-white text-xl">
              {children}
            </h3>
          );
        },
        h4: ({ children }) => {
          return (
            <h4 className="font-sans font-bold text-white text-lg">
              {children}
            </h4>
          );
        },
        h5: ({ children }) => {
          return (
            <h5 className="font-sans font-bold text-white text-md">
              {children}
            </h5>
          );
        },
        h6: ({ children }) => {
          return (
            <h6 className="font-sans font-bold text-white text-sm">
              {children}
            </h6>
          );
        },
        p: ({ children }) => {
          return (
            <p className="font-sans text-white text-md">
              {children}
            </p>
          );
        },
        strong: ({ children }) => {
          return (
            <strong className="font-sans font-bold text-white text-md">
              {children}
            </strong>
          );
        },
        em: ({ children }) => {
          return (
            <em className="font-sans italic text-white text-md">
              {children}
            </em>
          );
        },
        pre: ({ children }) => {
          return (
            <pre className="w-full">
              {children}
            </pre>
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
                  className="w-full mt-3 mb-3"
                  language={language}
                >
                  {children}
                </CodeHighlighter>
              );
        },
        ol: ({ children }) => {
          return (
            <ol className="list-decimal ml-8">
              {children}
            </ol>
          );
        },
        ul: ({ children }) => {
          return (
            <ul className="list-disc ml-8">
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
          <div className="w-full overflow-x-auto mt-3 mb-3 !ml-0 !mr-0">
            <table className="table table-auto ml-4 mr-4">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead>
            {children}
          </thead>
        ),
        tr: ({ children }) => (
          <tr>
            {children}
          </tr>
        ),
        th: ({ children }) => (
          <th className="border-solid border-1 border-zinc-800 text-start pt-3 pb-3 pl-4 pr-4">
            <span className="font-sans text-md font-bold text-white">
              {children}
            </span>
          </th>
        ),
        td: ({ children }) => (
          <td className="border-solid border-1 border-zinc-800 text-start pt-3 pb-3 pl-4 pr-4">
            <span className="font-sans text-sm text-white">
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
