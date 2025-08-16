import { FunctionComponent, ReactElement } from 'react';
import { BaseProps } from '../../types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy } from 'lucide-react';

/**
 * The `CodeHighlighter` component props
 */
interface Props extends BaseProps {
  readonly language: string;
  readonly children: string;
}

/**
 * Used to render a given code string with syntax highlighting
 * using `react-syntax-highlighter` under the hood
 *
 * @param props The component props
 * @returns The `CodeHighlighter` component
 */
const CodeHighlighter: FunctionComponent<Props> = ({ className, language, children }): ReactElement<Props> => {
  return (
    <div className={`${className ?? ''} flex flex-col items-start gap-y-2 bg-zinc-950 border-solid border-[1px] border-zinc-800 rounded-xl p-4`}>
      <div className="w-full flex flex-row items-center justify-between pr-2">
        <p className="font-mono text-xs text-white">
          {language}
        </p>
        <button
          className="flex flex-row items-center cursor-pointer gap-x-2"
          onClick={() => navigator.clipboard.writeText(children)}
        >
          <Copy
            className="text-white"
            size={16}
          />
          <span className="font-mono text-sm text-white">
            Copy
          </span>
        </button>
      </div>
      <SyntaxHighlighter
        className="w-full font-mono text-xs !bg-transparent !m-0 !p-2"
        language={language}
        style={darcula}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeHighlighter;
