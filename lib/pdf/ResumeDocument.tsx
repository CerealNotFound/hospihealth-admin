import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ResumeData } from "@/types/resume";
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
  summaryDetails: {
    marginTop: 8,
    fontSize: 14,
    color: "#000000",
  },
  summaryDetailsSmall: {
    marginTop: 4,
    fontSize: 14,
    color: "#000000",
  },
  educationItem: {
    marginTop: 0,
  },
  educationName: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#000000",
  },
  educationDetails: {
    fontSize: 14,
    marginTop: 2,
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
  workSummary: {
    marginTop: 8,
    fontSize: 14,
    color: "#000000",
  },
  projectName: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#000000",
  },
  projectAim: {
    margin: "0 0 8 0",
    fontSize: 14,
    color: "#000000",
  },
  projectTech: {
    fontSize: 14,
    color: "#000000",
  },
  publicationTitle: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#000000",
  },
  publicationDetails: {
    fontSize: 14,
    color: "#000000",
  },
  skillsText: {
    fontSize: 14,
    color: "#000000",
  },
  languagesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  languageItem: {
    fontSize: 14,
    color: "#000000",
  },
});

interface ResumeDocumentProps {
  data: ResumeData;
}

export const createResumeDocument = (data: ResumeData) => (
  <ResumeDocument data={data} />
);

export function ResumeDocument({ data }: ResumeDocumentProps) {
  const hasAddress =
    data.address_line_1 ||
    data.address_line_2 ||
    data.city ||
    data.state ||
    data.pincode;
  const hasEducation = data.college_name || data.school_name;
  const hasWork = data.company_name && (data.work_from || data.work_to);
  const hasProjects =
    data.project_experience && data.project_experience.length > 0;
  const hasPublication = data.published_paper && data.journal_name;

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

        {/* Professional Summary */}
        {data.professional_summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
            <Text style={styles.summaryText}>{data.professional_summary}</Text>
            {data.yoe && (
              <Text style={styles.summaryDetails}>
                Total Work Experience: {data.yoe} Years
              </Text>
            )}
            {data.current_ctc && (
              <Text style={styles.summaryDetailsSmall}>
                Current CTC: {data.current_ctc} LPA
              </Text>
            )}
            {data.domain && data.domain.length > 0 && (
              <Text style={styles.summaryDetailsSmall}>
                Domain of Expertise: {data.domain.join(", ")}
              </Text>
            )}
          </View>
        )}

        {/* Education */}
        {hasEducation && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EDUCATION</Text>
            {data.college_name && (
              <View style={styles.educationItem}>
                <Text style={styles.educationName}>{data.college_name}</Text>
                <Text style={styles.educationDetails}>
                  {data.college_city}, {data.college_country}
                </Text>
                <Text style={styles.educationDetails}>
                  {data.degree_discipline}
                  {data.cgpa && ` - ${data.cgpa} CGPA`}
                </Text>
                {data.graduation_date && (
                  <Text style={styles.educationDetails}>
                    Graduation: {data.graduation_date}
                  </Text>
                )}
                {data.relevant_courses && data.relevant_courses.length > 0 && (
                  <Text style={styles.educationDetails}>
                    Relevant Courses: {data.relevant_courses.join(", ")}
                  </Text>
                )}
              </View>
            )}

            {data.school_name && (
              <View style={styles.educationItem}>
                <Text style={styles.educationName}>{data.school_name}</Text>
                <Text style={styles.educationDetails}>
                  {data.school_city}, {data.school_country}
                </Text>
                {data.higher_secondary_percentage && (
                  <Text style={styles.educationDetails}>
                    Higher Secondary Certificate (HSC) -{" "}
                    {data.higher_secondary_percentage}%
                  </Text>
                )}
                {data.school_completion_date && (
                  <Text style={styles.educationDetails}>
                    Completion: {data.school_completion_date}
                  </Text>
                )}
              </View>
            )}
          </View>
        )}

        {/* Work Experience */}
        {hasWork && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
            <Text style={styles.workCompany}>{data.company_name}</Text>
            {data.company_city && data.company_country && (
              <Text style={styles.workDetails}>
                {data.company_city}, {data.company_country}
              </Text>
            )}
            {data.designation && (
              <Text style={styles.workDetails}>{data.designation}</Text>
            )}
            <Text style={styles.workDetails}>
              {data.work_from && data.work_from}
              {data.work_from && data.work_to && " - "}
              {data.work_to && data.work_to}
            </Text>
            {data.work_summary && (
              // <Text style={styles.workSummary}>{data.work_summary}</Text>
              <ResumeBulletList items={data.work_summary} />
            )}
          </View>
        )}

        {/* Projects */}
        {hasProjects && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ACADEMIC PROJECTS & PAPERS</Text>
            {data.project_experience?.map((project, index) => (
              <View key={index} style={styles.educationItem}>
                <Text style={styles.projectName}>{project.project_name}</Text>
                <Text style={styles.projectAim}>{project.client}</Text>
                {project.duration && (
                  <Text style={styles.projectTech}>{project.duration}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Publications */}
        {hasPublication && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PUBLISHED PAPER</Text>
            <Text style={styles.publicationTitle}>{data.published_paper}</Text>
            <Text style={styles.publicationDetails}>
              {data.journal_name}
              {data.volume_issue && `, ${data.volume_issue}`}
              {data.publication_year && `, ${data.publication_year}`}
            </Text>
            {data.issn && (
              <Text style={styles.publicationDetails}>ISSN: {data.issn}</Text>
            )}
          </View>
        )}

        {/* Technical Skills */}
        {data.technical_skills &&
          Object.keys(data.technical_skills).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>TECHNICAL SKILLS</Text>
              {/* <Text style={styles.skillsText}>
              {data.technical_skills.join(", ")}
            </Text> */}
              <ResumeTable
                rows={Object.entries(data.technical_skills).map(
                  ([category, skills]) => ({
                    label: category,
                    value: skills.join(", "),
                  })
                )}
                showHeader={true}
                labelWidth="35%"
                valueWidth="65%"
              />
            </View>
          )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LANGUAGE</Text>
            {/* <View style={styles.languagesGrid}>
              {data.languages.map((language, index) => (
                <Text key={index} style={styles.languageItem}>
                  {language}
                  {data.language_proficiency &&
                    ` (${data.language_proficiency})`}
                </Text>
              ))}
            </View> */}
            <ResumeTable
              rows={data.languages.map((language) => ({
                label: language,
                value: language,
              }))}
            />
          </View>
        )}
      </Page>
    </Document>
  );
}

// Create styles
// const styles = StyleSheet.create({
//   page: {
//     flexDirection: 'row',
//     backgroundColor: '#FF0000'
//   },
//   section: {
//     margin: 10,
//     padding: 10,
//     flexGrow: 1
//   }
// });

// // Create Document Component
// export const ResumeDocument = () => (
//   <Document>
//     <Page size="A4" style={styles.page}>
//       <View style={styles.section}>
//         <Text>Section #1</Text>
//       </View>
//       <View style={styles.section}>
//         <Text>Section #2</Text>
//       </View>
//     </Page>
//   </Document>
// );
