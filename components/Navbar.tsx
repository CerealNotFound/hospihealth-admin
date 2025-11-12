'use client';

import { Menu } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

export function Navbar() {
  return (
    <nav className="bg-white border-b border-[#FCF3F3] sticky top-0 z-50 shadow-sm">
      <div className="mx-auto w-full max-w-screen-xl px-4 md:px-6 py-4 flex items-center gap-3">
        <Sheet>
          <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-[rgba(0,0,0,0.7)] hover:bg-[#FCF3F3] focus:outline-none focus:ring-2 focus:ring-[#DBA622] transition-colors">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 bg-[#FCF3F3]">
            <SheetTitle className='p-3 text-[#2e0101] font-semibold'>Hospihealth</SheetTitle>
            <Sidebar />
          </SheetContent>
        </Sheet>
        <h1 className="text-xl font-bold text-[#2e0101]">Hospihealth</h1>
      </div>
    </nav>
  );
}
