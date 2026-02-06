import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { ApolloProvider } from "@/services/graphql/provider";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Rick and Morty Dashboard | Character Explorer",
  description: "Browse and search through all Rick and Morty characters with infinite scrolling. View character details, filter by status and gender, and explore location distribution charts.",
  keywords: ["Rick and Morty", "characters", "dashboard", "GraphQL", "Next.js"],
  authors: [{ name: "Arthur Freitas" }],
  creator: "Arthur Freitas",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Rick and Morty Dashboard",
    description: "Explore all Rick and Morty characters with advanced filtering and search",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${roboto.variable} antialiased`}
      >
        <NuqsAdapter>
          <ApolloProvider>{children}</ApolloProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
