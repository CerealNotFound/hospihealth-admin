import { supabase } from "@/lib/supabase";
import PreviewComponent from "@/components/resume/PreviewComponent";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: application, error } = await supabase
    .from("job_applications")
    .select(`
      *,
      education:education(*),
      work_experience:work_experience(*),
      projects:projects(*),
      published_papers:published_papers(*),
      technical_skills:technical_skills(*),
      languages:languages(*)
    `)
    .eq("id", id)
    .single();

  if (error || !application) {
    throw new Error("Failed to load application");
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 md:px-6 overflow-x-auto">
      <div className="min-w-[360px] md:min-w-0">
        <PreviewComponent data={application} />
      </div>
    </div>
  );
}
