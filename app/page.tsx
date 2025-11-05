import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full max-w-screen-xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Welcome to Admin Panel
      </h1>
      <p className="text-gray-600 mb-6">
        Manage your jobs, applications, and blog posts from the sidebar
        navigation.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href={"/admin/jobs"}>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Jobs</h2>
            <p className="text-gray-600">Create and manage job postings</p>
          </div>
        </Link>
        <Link href={"/admin/applications"}>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Applications
            </h2>
            <p className="text-gray-600">View and manage job applications</p>
          </div>
        </Link>
        <Link href={"/admin/blogs"}>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Blogs</h2>
            <p className="text-gray-600">Create and publish blog posts</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
