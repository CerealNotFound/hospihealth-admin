'use client';

import { Menu } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

export function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="mx-auto w-full max-w-screen-xl px-4 md:px-6 py-4 flex items-center gap-3">
        <Sheet>
          <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SheetTitle className='p-3'>Admin Panel</SheetTitle>
            <Sidebar />
          </SheetContent>
        </Sheet>
        <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
      </div>
    </nav>
  );
}
