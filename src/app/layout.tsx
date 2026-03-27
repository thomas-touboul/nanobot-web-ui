import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AgentProvider } from "@/contexts/AgentContext";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Agent Admin",
  description: "AI Agent Administration Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AgentProvider>
            <div className="flex h-screen overflow-hidden bg-background text-foreground">
              {/* Desktop Sidebar */}
              <Sidebar />
              
              <div className="relative flex flex-1 flex-col h-full overflow-hidden">
                {/* Top Bar */}
                <TopBar />
                
                {/* Main Content */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                  <main className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full pt-4">
                    {children}
                  </main>
                </div>
              </div>
            </div>
          </AgentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
