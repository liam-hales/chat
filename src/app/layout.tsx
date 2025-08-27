import './globals.css';

import { FunctionComponent, ReactElement, ReactNode } from 'react';
import { BaseProps } from '../types';
import { crimsonText, firaCode } from '../fonts';
import { Analytics } from '@vercel/analytics/next';
import { App } from '../components';
import { AppProvider } from '../providers';
import { viewport, generateMetadata } from './metadata';

/**
 * The `AppLayout` component props
 */
interface Props extends BaseProps {
  readonly children: ReactNode;
}

/**
 * The root layout component used as the entry point to the app which renders
 * the main `App` component and configures things such as fonts and app state
 *
 * @param props The component props
 * @returns The `AppLayout` component
 */
const AppLayout: FunctionComponent<Props> = ({ children }): ReactElement<Props> => {
  return (
    <html
      lang="en"
      className={`h-full ${crimsonText.variable} ${firaCode.variable} overscroll-none`}
    >
      <body className="h-full bg-black p-safe">
        <Analytics />
        <AppProvider>
          <App>
            {children}
          </App>
        </AppProvider>
      </body>
    </html>
  );
};

export default AppLayout;
export {
  viewport,
  generateMetadata,
};
