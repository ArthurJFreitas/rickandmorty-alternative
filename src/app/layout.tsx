import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { ApolloProvider } from "@/services/graphql/provider";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import "./globals.css";
import { Suspense } from "react";
import { Spinner } from "@/components/atoms/Spinner/Spinner";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://rickandmorty-alternative.vercel.app'),
  title: {
    default: "Rick and Morty Dashboard | Character Explorer",
    template: "%s | Rick and Morty Dashboard"
  },
  description: "Browse and search through all Rick and Morty characters with infinite scrolling. View character details, filter by status and gender, and explore location distribution charts.",
  keywords: ["Rick and Morty", "characters", "dashboard", "GraphQL", "Next.js", "React", "TypeScript"],
  authors: [{ name: "Arthur Freitas", url: "https://github.com/ArthurJFreitas" }],
  creator: "Arthur Freitas",
  publisher: "Arthur Freitas",
  applicationName: "Rick and Morty Dashboard",
  category: "entertainment",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Rick and Morty Dashboard | Character Explorer",
    url: "https://rickandmorty-alternative.vercel.app",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${roboto.className} app-body`}
      >
        <NuqsAdapter>
          <Suspense fallback={<div className="suspense-fallback"><Spinner size="lg" label="Loading characters" /></div>}>
            <ApolloProvider>{children}</ApolloProvider>
            </Suspense>
        </NuqsAdapter>
      </body>
    </html>
  );
}
