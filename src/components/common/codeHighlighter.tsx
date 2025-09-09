'use client';

import { FunctionComponent, ReactElement, useState } from 'react';
import { BaseProps } from '../../types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';

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
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  const _onCopy = async (): Promise<void> => {
    await navigator.clipboard.writeText(children);

    // Set the has copied state and
    // reset it after 5 seconds
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className={className ?? ''}>
      <div className="w-full flex flex-col items-start gap-y-2 bg-zinc-950 border-solid border-[1px] border-zinc-800 rounded-xl">
        <div className="w-full flex flex-row items-center justify-between pt-4 pl-4 pr-5">
          <p className="font-mono text-xs text-white">
            {language}
          </p>
          <button
            className="flex flex-row items-center cursor-pointer"
            onClick={_onCopy}
          >
            {
              (hasCopied === true)
                ? (
                    <Check
                      className="text-white mr-1"
                      size={16}
                    />
                  )
                : (
                    <Copy
                      className="text-white mr-2"
                      size={14}
                    />
                  )
            }
            <span className="font-sans text-sm text-white">
              {
                (hasCopied === true) ? 'Copied' : 'Copy'
              }
            </span>
          </button>
        </div>
        <SyntaxHighlighter
          className="w-full font-mono text-xs !bg-transparent !m-0 !pt-2 !pb-4 !pl-4 !pr-4 no-scrollbar"
          language={language}
          style={darcula}
        >
          {children}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeHighlighter;
