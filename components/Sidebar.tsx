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
    <aside className="w-full md:w-64 bg-white border-r border-gray-200 md:min-h-screen p-4">
      <ul className="space-y-2">
        {modules.map((module) => {
          const Icon = module.icon;
          const isActive = pathname === module.path;

          return (
            <li key={module.path}>
              <Link
                href={module.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
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
