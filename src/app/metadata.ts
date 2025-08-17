import { Metadata, Viewport } from 'next';
import getConfig from 'next/config';

/**
 * Describes the app viewport metadata that is
 * rendered within the page `<head/>` element
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

/**
 * Used to generate the app metadata that is
 * rendered within the `<head/>` element
 *
 * @returns The app metadata
 */
export const generateMetadata = (): Metadata => {

  const { serverRuntimeConfig } = getConfig();
  const { siteUrl } = serverRuntimeConfig;

  const title = 'Chat - Liam Hales';
  const description = 'Chat with AI, all in one place.';

  return {
    metadataBase: new URL(siteUrl as string),
    title: title,
    description: description,
    icons: {
      icon: [
        {
          rel: 'icon',
          url: '/favicon.ico',
          type: 'image/x-icon',
        },
        {
          rel: 'icon',
          url: '/icon.svg',
          type: 'image/svg+xml',
        },
        {
          rel: 'apple-touch-icon',
          url: '/apple-touch-icon.webp',
          type: 'image/webp',
        },
      ],
    },
    openGraph: {
      title: title,
      description: description,
      type: 'website',
      siteName: 'Chat',
      images: [
        {
          url: '/cover.webp',
          type: 'image/webp',
          alt: 'Chat Cover',
        },
      ],
    },
  };
};
