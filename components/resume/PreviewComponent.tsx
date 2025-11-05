import { ResumeTemplate } from "@/components/resume/ResumeTemplate";
import { ResumeData } from "@/types/resume";

export default function PreviewComponent({ data }: { data: ResumeData }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: "2rem",
        paddingBottom: "2rem",
      }}
    >
      <div
        id="resume"
        style={{
          width: "210mm",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        }}
      >
        <ResumeTemplate data={data} className="pdf-resume" />
      </div>
    </div>
  );
}
