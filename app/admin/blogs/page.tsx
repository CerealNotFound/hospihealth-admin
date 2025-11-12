"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BlogForm } from "@/components/BlogForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil, Trash2, Plus, RotateCcw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface Blog {
  id: string;
  title: string;
  content: string | null;
  excerpt: string | null;
  images: any;
  is_deleted: boolean;
  created_at: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [deletingBlogId, setDeletingBlogId] = useState<string | null>(null);
  const [restoringBlogId, setRestoringBlogId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBlog, setIsLoadingBlog] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/blogs?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }
      const result = await response.json();
      setBlogs(result.data || []);
      setPagination(result.pagination || { total: 0, totalPages: 0 });
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
    setIsLoading(false);
  };

  const handleRestore = async (id: string) => {
    try {
      const response = await fetch(`/api/blogs/${id}/restore`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to restore blog");
      }

      setRestoringBlogId(null);
      fetchBlogs();
    } catch (error) {
      console.error("Error restoring blog:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete blog");
      }

      setDeletingBlogId(null);
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const handleEdit = async (blog: Blog) => {
    setIsLoadingBlog(true);
    try {
      const response = await fetch(`/api/blogs/${blog.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch blog details");
      }
      const result = await response.json();
      setEditingBlog(result.data);
      setIsFormOpen(true);
    } catch (error) {
      console.error("Error fetching blog details:", error);
    } finally {
      setIsLoadingBlog(false);
    }
  };


  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 md:px-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#2e0101]">Blogs</h1>
          <p className="text-[rgba(0,0,0,0.7)] mt-1">Manage blog posts</p>
        </div>
        <Button
          onClick={() => {
            setEditingBlog(null);
            setIsFormOpen(true);
          }}
          disabled={isLoadingBlog}
          className="bg-[#DBA622] hover:bg-[#c8951f] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Blog
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-[rgba(0,0,0,0.7)]">Loading blogs...</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-[#FCF3F3] p-12 text-center">
          <p className="text-[rgba(0,0,0,0.7)] mb-4">No blogs found</p>
          <Button
            onClick={() => {
              setEditingBlog(null);
              setIsFormOpen(true);
            }}
            disabled={isLoadingBlog}
            className="bg-[#DBA622] hover:bg-[#c8951f] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Blog
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Card
              key={blog.id}
              className={`flex flex-col ${
                blog.is_deleted ? "opacity-60 bg-[#FCF3F3]" : ""
              }`}
            >
              <CardHeader>
                <CardTitle className="line-clamp-2">
                  <div className="flex items-center gap-2">
                    {blog.title}
                    {blog.is_deleted && (
                      <span className="text-xs bg-[#FCF3F3] text-[#bb0b0b] px-2 py-1 rounded">
                        Deleted
                      </span>
                    )}
                  </div>
                </CardTitle>
                <CardDescription>
                  {new Date(blog.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-[rgba(0,0,0,0.7)] line-clamp-3">
                  {blog.excerpt || "No content"}
                </p>
                {blog.images &&
                  Array.isArray(blog.images) &&
                  blog.images.length > 0 && (
                    <div className="mt-4">
                      <img
                        src={blog.images[0].src}
                        alt={blog.images[0].alt || "Blog image"}
                        className="w-full h-32 object-cover rounded"
                      />
                    </div>
                  )}
              </CardContent>
              <CardFooter className="flex gap-2">
                {blog.is_deleted ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-green-600 hover:text-green-700"
                    onClick={() => setRestoringBlogId(blog.id)}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Restore
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(blog)}
                      disabled={isLoadingBlog}
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1 bg-[#bb0b0b] hover:bg-[#a00a0a] text-white"
                      onClick={() => setDeletingBlogId(blog.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && blogs.length > 0 && pagination.totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => page > 1 && setPage(page - 1)}
                  className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {(() => {
                const pages: (number | "ellipsis")[] = [];
                const totalPages = pagination.totalPages;
                
                if (totalPages <= 7) {
                  for (let i = 1; i <= totalPages; i++) {
                    pages.push(i);
                  }
                } else {
                  pages.push(1);
                  if (page > 3) {
                    pages.push("ellipsis");
                  }
                  const start = Math.max(2, page - 1);
                  const end = Math.min(totalPages - 1, page + 1);
                  for (let i = start; i <= end; i++) {
                    pages.push(i);
                  }
                  if (page < totalPages - 2) {
                    pages.push("ellipsis");
                  }
                  pages.push(totalPages);
                }
                
                return pages.map((item, idx) => {
                  if (item === "ellipsis") {
                    return (
                      <PaginationItem key={`ellipsis-${idx}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return (
                    <PaginationItem key={item}>
                      <PaginationLink
                        onClick={() => setPage(item)}
                        isActive={item === page}
                        className="cursor-pointer"
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  );
                });
              })()}
              <PaginationItem>
                <PaginationNext
                  onClick={() => page < pagination.totalPages && setPage(page + 1)}
                  className={page === pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {isFormOpen && (
        <BlogForm
          blog={editingBlog}
          onClose={() => {
            setEditingBlog(null);
            setIsFormOpen(false);
          }}
          onSuccess={() => {
            setEditingBlog(null);
            fetchBlogs();
            setIsFormOpen(false);
          }}
        />
      )}

      <AlertDialog
        open={!!deletingBlogId}
        onOpenChange={(open) => !open && setDeletingBlogId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will soft-delete the blog post. You can restore it later if
              needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingBlogId && handleDelete(deletingBlogId)}
              className="bg-[#bb0b0b] hover:bg-[#a00a0a] text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!restoringBlogId}
        onOpenChange={(open) => !open && setRestoringBlogId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Blog?</AlertDialogTitle>
            <AlertDialogDescription>
              This will restore the deleted blog post and make it available
              again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => restoringBlogId && handleRestore(restoringBlogId)}
              className="bg-[#DBA622] hover:bg-[#c8951f] text-white"
            >
              Restore
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
