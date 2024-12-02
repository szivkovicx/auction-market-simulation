import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auction Market Simulation",
  description: "Auction-based market simulation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
