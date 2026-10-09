'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  return (
    <html lang="es">
      <body className="bg-gray-50 font-sans">
        <div className="flex min-h-screen">
          <Sidebar
            abierto={sidebarAbierto}
            onCerrar={() => setSidebarAbierto(false)}
          />

          <div className="flex-1 flex flex-col min-w-0">
            <Navbar onToggleSidebar={() => setSidebarAbierto((v) => !v)} />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50">{children}</main>
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}