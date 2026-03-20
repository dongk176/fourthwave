import type { Metadata } from 'next';
import { Suspense } from "react";
import ContactCopyToast from "./contact-copy-toast";
import './globals.css';
import InitialViewportHeight from "./initial-viewport-height";
import SiteHeader from "./site-header";
import SubmissionSuccessToast from "./submission-success-toast";

export const metadata: Metadata = {
  title: 'FOURTHWAVE PRODUCTION | K-Pop Artist Development',
  description: 'Premium music production and K-Pop artist development in Korea.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 overflow-x-hidden selection:bg-primary selection:text-background-dark">
        <InitialViewportHeight />
        <SiteHeader />
        <Suspense fallback={null}>
          <SubmissionSuccessToast />
        </Suspense>
        <ContactCopyToast />
        {children}
      </body>
    </html>
  );
}
