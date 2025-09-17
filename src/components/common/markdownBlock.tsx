import { FunctionComponent, memo, ReactElement, isValidElement, HTMLAttributes } from 'react';
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

          // Make sure the `children` is a valid element
          // If not then throw an error
          if (isValidElement<HTMLAttributes<HTMLElement>>(children) === false) {
            throw Error('Markdown "pre" does not have valid "children"');
          }

          const { props } = children;
          const { className, children: code } = props;

          // If the code is not a string then
          // just render it as is
          if (typeof code !== 'string') {
            return children;
          }

          // Extract the language from the `className` and default
          // to `text` for unknown languages
          const language = className?.replace('language-', '') ?? 'text';

          return (
            <CodeHighlighter
              className="w-full pt-3 pb-3"
              language={language}
            >
              {code}
            </CodeHighlighter>
          );
        },
        code: ({ children }) => {
          return (
            <code className="font-mono text-white text-xs bg-neutral-900 border-solid border-[1px] border-neutral-800 rounded-md p-1 m-1">
              {children}
            </code>
          );
        },
        ol: ({ children }) => {
          return (
            <div className="w-full">
              <ol className="list-decimal flex flex-col gap-y-2 pl-6">
                {children}
              </ol>
            </div>
          );
        },
        ul: ({ children }) => {
          return (
            <div className="w-full">
              <ul className="list-disc flex flex-col gap-y-2 pl-6">
                {children}
              </ul>
            </div>
          );
        },
        li: ({ children }) => {
          return (
            <li className="font-sans text-white text-md pl-1">
              {children}
            </li>
          );
        },
        table: ({ children }) => (
          <div className="w-full mt-3 mb-3 !ml-0 !mr-0 overflow-x-auto no-scrollbar touch-pan-x touch-pan-y">
            <table className="table table-auto">
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
          <th className="border-solid border-1 border-neutral-800 text-start pt-3 pb-3 pl-4 pr-4">
            <span className="font-sans text-md font-bold text-white">
              {children}
            </span>
          </th>
        ),
        td: ({ children }) => (
          <td className="border-solid border-1 border-neutral-800 text-start pt-3 pb-3 pl-4 pr-4">
            <span className="font-sans text-sm text-white">
              {children}
            </span>
          </td>
        ),
        a: ({ href, children }) => {
          return (
            <a
              className="font-sans font-bold text-sm underline underline-offset-2 text-blue-300 pl-1 pr-1"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {
                children
              }
            </a>
          );
        },
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
