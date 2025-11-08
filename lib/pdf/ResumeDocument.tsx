import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { Application } from "@/types/application";
import { ResumeTable } from "./resume/ResumeTable";
import { ResumeBulletList } from "./resume/ResumeChecklist";

// Create styles using proper react-pdf StyleSheet
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 40,
    fontFamily: "Times-Roman",
    fontSize: 14,
    lineHeight: 1.5,
    color: "#000000",
  },
  header: {
    textAlign: "center",
    marginBottom: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000000",
  },
  address: {
    fontSize: 14,
    marginTop: 4,
    color: "#000000",
  },
  contact: {
    fontSize: 14,
    marginTop: 4,
    color: "#000000",
  },
  linkedin: {
    fontSize: 14,
    marginTop: 4,
    color: "#000000",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4E81BD",
    marginBottom: 8,
    borderBottom: "2px solid #4E81BD",
    paddingBottom: 4,
  },
  summaryText: {
    margin: 0,
    fontSize: 14,
    lineHeight: 1.6,
    color: "#000000",
  },
  workCompany: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#000000",
  },
  workDetails: {
    fontSize: 14,
    marginTop: 2,
    color: "#000000",
  },
  projectName: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#000000",
    marginTop: 8,
  },
  projectAim: {
    fontSize: 14,
    color: "#000000",
    marginTop: 2,
  },
  projectTech: {
    fontSize: 14,
    color: "#000000",
    marginTop: 2,
  },
  publicationTitle: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#000000",
  },
  publicationDetails: {
    fontSize: 14,
    color: "#000000",
    marginTop: 2,
  },
});

interface ResumeDocumentProps {
  data: Application;
}

export const createResumeDocument = (data: Application) => (
  <ResumeDocument data={data} />
);

export function ResumeDocument({ data }: ResumeDocumentProps) {
  console.log(data, "data in Resume document")
  // ---- top bar ----
  const hasAddress =
    !!(data.address_line_1 || data.address_line_2 || data.city || data.state || data.pincode);

  // ---- sections presence (normalized) ----
  const hasEducation = Array.isArray(data.education) && data.education.length > 0;
  const hasWork = Array.isArray(data.work_experience) && data.work_experience.length > 0;
  const hasProjects = Array.isArray(data.projects) && data.projects.length > 0;
  const hasPublications =
    Array.isArray(data.published_papers) && data.published_papers.length > 0;
  const hasTechSkills =
    Array.isArray(data.technical_skills) && data.technical_skills.length > 0;
  const hasLanguages = Array.isArray(data.languages) && data.languages.length > 0;

  // ---- CURRENT DETAILS table ----
  const currentDetailsRows: Array<{ label: string; value: string }> = [];
  if (data.current_ctc != null) {
    currentDetailsRows.push({
      label: "Current CTC:",
      value: `₹${data.current_ctc} LPA`,
    });
  }
  if (data.yoe != null) {
    currentDetailsRows.push({
      label: "Total Work Experience:",
      value: `${data.yoe} Years`,
    });
  }
  if (data.domain && data.domain.length > 0) {
    currentDetailsRows.push({
      label: "Domain of Expertise:",
      value: data.domain.join(", "),
    });
  }
  if (data.preferred_job_role && data.preferred_job_role.length > 0) {
    currentDetailsRows.push({
      label: "Preferred Job Role/Function:",
      value: data.preferred_job_role.join(", "),
    });
  }
  if (data.preferred_job_location && data.preferred_job_location.length > 0) {
    currentDetailsRows.push({
      label: "Preferred Job Location:",
      value: data.preferred_job_location.join(", "),
    });
  }

  // ---- EDUCATION table (normalized -> rows) ----
  const educationRows: Array<{ label: string; value: string }> = [];
  if (hasEducation) {
    data.education.forEach((e) => {
      const line1 = [e.institution_name, e.city, e.country].filter(Boolean).join(", ");
      const line2 = [
        e.degree_discipline ? `${e.degree_discipline}` : null,
        e.cgpa != null ? `CGPA: ${e.cgpa}/10` : null,
        e.percentage != null ? `Percentage: ${e.percentage}%` : null,
      ]
        .filter(Boolean)
        .join(" • ");
      const line3 = e.graduation_date ? `Graduation: ${e.graduation_date}` : null;
      const value = [line1, line2, line3].filter(Boolean).join("\n");
      educationRows.push({
        label:
          e.level
            ? e.level.toUpperCase()
            : "EDUCATION",
        value,
      });

      if (e.relevant_courses && e.relevant_courses.length > 0) {
        educationRows.push({
          label: "Relevant Courses:",
          value: e.relevant_courses.join(", "),
        });
      }
    });
  }

  // ---- TECH SKILLS rows (normalized array -> table) ----
  const techSkillRows: Array<{ label: string; value: string }> = hasTechSkills
    ? data.technical_skills.map((t) => ({
        label: t.skill_category,
        value: (t.skills || []).join(", "),
      }))
    : [];

  // ---- LANGUAGES rows (normalized array -> table) ----
  const languageRows: Array<{ label: string; value: string }> = hasLanguages
    ? data.languages.map((l) => ({
        label: l.language_name,
        value:
          l.proficiency.charAt(0).toUpperCase() + l.proficiency.slice(1), // capitalize
      }))
    : [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.full_name}</Text>
          {hasAddress && (
            <Text style={styles.address}>
              {data.address_line_1 && `${data.address_line_1}, `}
              {data.address_line_2 && `${data.address_line_2}, `}
              {data.city && `${data.city}, `}
              {data.state && `${data.state} `}
              {data.pincode && data.pincode}
            </Text>
          )}
          <Text style={styles.contact}>
            {data.email && `Email: ${data.email}`}
            {data.email && data.phone && " | "}
            {data.phone && `Phone: ${data.phone}`}
          </Text>
          {data.linkedin && (
            <Text style={styles.linkedin}>LinkedIn: {data.linkedin}</Text>
          )}
        </View>

        {/* Current Details */}
        {currentDetailsRows.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CURRENT DETAILS</Text>
            <ResumeTable rows={currentDetailsRows} />
          </View>
        )}

        {/* Professional Summary */}
        {data.professional_summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
            <Text style={styles.summaryText}>{data.professional_summary}</Text>
          </View>
        )}

        {/* Education (normalized) */}
        {hasEducation && educationRows.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EDUCATION</Text>
            <ResumeTable rows={educationRows} />
          </View>
        )}

        {/* Work Experience (normalized) */}
        {hasWork && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
            {data.work_experience.map((w) => (
              <View key={w.id} wrap={false}>
                {w.company_name && (
                  <Text style={styles.workCompany}>{w.company_name}</Text>
                )}
                {(w.company_city || w.company_country) && (
                  <Text style={styles.workDetails}>
                    {[w.company_city, w.company_country].filter(Boolean).join(", ")}
                  </Text>
                )}
                {(w.designation || w.work_from || w.work_to) && (
                  <Text style={styles.workDetails}>
                    {w.designation ? `${w.designation}` : ""}
                    {w.designation && (w.work_from || w.work_to) ? " • " : ""}
                    {[w.work_from, w.work_to].filter(Boolean).join(" - ")}
                  </Text>
                )}
                {Array.isArray(w.work_summary) && w.work_summary.length > 0 && (
                  <ResumeBulletList items={w.work_summary} />
                )}
              </View>
            ))}
          </View>
        )}

        {/* Projects (normalized) */}
        {hasProjects && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROJECTS</Text>
            {data.projects.map((p) => (
              <View key={p.id}>
                {p.project_name && (
                  <Text style={styles.projectName}>{p.project_name}</Text>
                )}
                {p.project_aim && (
                  <Text style={styles.projectAim}>{p.project_aim}</Text>
                )}
                {p.tech_stack && p.tech_stack.length > 0 && (
                  <Text style={styles.projectTech}>
                    Tech: {p.tech_stack.join(", ")}
                  </Text>
                )}
                {p.achievements && p.achievements.length > 0 && (
                  <ResumeBulletList items={p.achievements} />
                )}
              </View>
            ))}
          </View>
        )}

        {/* Publications (normalized) */}
        {hasPublications && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PUBLICATIONS</Text>
            {data.published_papers.map((pub) => (
              <View key={pub.id}>
                {pub.paper_title && (
                  <Text style={styles.publicationTitle}>{pub.paper_title}</Text>
                )}
                {(pub.journal_name || pub.volume_issue || pub.publication_year) && (
                  <Text style={styles.publicationDetails}>
                    {[
                      pub.journal_name,
                      pub.volume_issue,
                      pub.publication_year,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </Text>
                )}
                {pub.issn && (
                  <Text style={styles.publicationDetails}>ISSN: {pub.issn}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Technical Skills (normalized) */}
        {hasTechSkills && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TECHNICAL SKILLS</Text>
            <ResumeTable
              rows={techSkillRows}
              showHeader={true}
              labelWidth="35%"
              valueWidth="65%"
              headerOne="Category"
              headerTwo="Skills"
            />
          </View>
        )}

        {/* Languages (normalized) */}
        {hasLanguages && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LANGUAGES</Text>
            <ResumeTable
              rows={languageRows}
              showHeader={true}
              labelWidth="35%"
              valueWidth="65%"
              headerOne="Name"
              headerTwo="Proficiency Level"
            />
          </View>
        )}
      </Page>
    </Document>
  );
}