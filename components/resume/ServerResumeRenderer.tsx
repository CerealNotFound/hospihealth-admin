"use server";

import { ResumeData } from "@/types/resume";
import { ResumeTemplate } from "@/components/resume/ResumeTemplate";

export async function renderResumeToString(data: ResumeData): Promise<string> {
  const { renderToString } = await import("react-dom/server");
  return renderToString(
    <div className="pdf-resume">
      <ResumeTemplate data={data} className="pdf-resume" />
    </div>
  );
}
