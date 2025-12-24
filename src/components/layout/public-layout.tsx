import type { ReactNode } from 'react';
import Navbar from './navbar';
import Footer from './footer';

interface PublicLayoutProps {
  children: ReactNode;
  className?: string;
}

export function PublicLayout({ children, className = '' }: PublicLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-1 ${className}`}>{children}</main>
      <Footer />
    </div>
  );
}
