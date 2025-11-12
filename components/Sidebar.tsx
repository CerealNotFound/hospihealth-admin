"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, FileText, Users } from "lucide-react";

const modules = [
  { name: "Jobs", path: "/admin/jobs", icon: Briefcase },
  { name: "Applications", path: "/admin/applications", icon: Users },
  { name: "Blogs", path: "/admin/blogs", icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 bg-white border-r border-[#FCF3F3] md:min-h-screen p-4">
      <ul className="space-y-2">
        {modules.map((module) => {
          const Icon = module.icon;
          const isActive = pathname === module.path;

          return (
            <li key={module.path}>
              <Link
                href={module.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-[#FCF3F3] text-[#2e0101] font-semibold shadow-sm"
                    : "text-[rgba(0,0,0,0.7)] hover:bg-[#FCF3F3] hover:text-[#2e0101]"
                }`}
              >
                <Icon className="w-5 h-5" />
                {module.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
