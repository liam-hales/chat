import { FunctionComponent, ReactElement } from 'react';
import { BaseProps } from '../../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * The `Markdown` component props
 */
interface Props extends BaseProps {
  readonly children: string;
}

/**
 * Used to render a given markdown string
 * using `react-markdown` under the hood
 *
 * @param props The component props
 * @returns The `Markdown` component
 */
const Markdown: FunctionComponent<Props> = ({ className, children }): ReactElement<Props> => {
  return (
    <div className={className}>
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

            // If the language cannot be found from the class name then render the
            // code inline, otherwise render the code with full syntax highlighting
            return (language == null)
              ? (
                  <code className="font-mono text-white text-xs bg-zinc-900 border-solid border-[1px] border-zinc-800 rounded-md p-1 m-1">
                    {children}
                  </code>
                )
              : (
                  <p>{children}</p>
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
    </div>
  );
};

export default Markdown;
