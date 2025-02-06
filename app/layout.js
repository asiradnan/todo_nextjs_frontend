import './globals.css';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/ThemeProvider';
import ThemeToggle from '@/components/ThemeToggle';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Todo App',
  description: 'A beautiful and functional todo list application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="container mx-auto py-4 px-4 min-h-screen justify-start flex flex-col">
      <div className="flex justify-between items-center">
        {/* <h1 className="text-4xl font-bold">Todo App</h1> */}
        <Image 
  src="/favicon.ico"
  alt="Todo App Logo"
  width={40}
  height={40}
  priority
  className="dark:invert"
/>
        <ThemeToggle />
      </div>
          {children}
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}