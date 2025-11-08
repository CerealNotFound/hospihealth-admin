import { Fragment } from "react";
import { Application } from "@/types/application";

interface ResumeTemplateProps {
  data: Application;
  className?: string;
}

// Table Component for JSX
interface TableRow {
  label: string;
  value: string;
}

interface TableProps {
  rows: TableRow[];
  showHeader?: boolean;
  labelWidth?: string;
  valueWidth?: string;
  headerLabel?: string;
  headerValue?: string;
}

function ResumeTable({
  rows,
  showHeader = false,
  labelWidth = "35%",
  valueWidth = "65%",
  headerLabel = "Skill",
  headerValue = "Description",
}: TableProps) {
  return (
    <table
      style={{ width: "100%", borderCollapse: "collapse", marginTop: "0.5rem" }}
    >
      {showHeader && (
        <thead>
          <tr>
            <th
              style={{
                width: labelWidth,
                textAlign: "left",
                padding: "0.25rem",
                borderBottom: "1px solid #ddd",
                fontWeight: "700",
              }}
            >
              {headerLabel}
            </th>
            <th
              style={{
                width: valueWidth,
                textAlign: "left",
                padding: "0.25rem",
                borderBottom: "1px solid #ddd",
                fontWeight: "700",
              }}
            >
              {headerValue}
            </th>
          </tr>
        </thead>
      )}
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            <td
              style={{
                width: labelWidth,
                padding: "0.25rem",
                verticalAlign: "top",
              }}
            >
              {row.label}
            </td>
            <td
              style={{
                width: valueWidth,
                padding: "0.25rem",
                verticalAlign: "top",
              }}
            >
              {row.value}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Bullet List Component for JSX
interface BulletListProps {
  items: string[];
}

function ResumeBulletList({ items }: BulletListProps) {
  const bulletPoints = items;

  return (
    <ul
      style={{
        marginTop: "0.5rem",
        paddingLeft: "1.5rem",
        listStyleType: "disc",
      }}
    >
      {bulletPoints.map((item, index) => (
        <li
          key={index}
          style={{
            fontSize: "14px",
            lineHeight: "1.5",
            marginBottom: "0.25rem",
            color: "#000000",
          }}
        >
          {item.trim()}
        </li>
      ))}
    </ul>
  );
}

export function ResumeTemplate({ data, className }: ResumeTemplateProps) {
  // ---- Presence checks (normalized arrays) ----
  const hasAddress =
    data.address_line_1 ||
    data.address_line_2 ||
    data.city ||
    data.state ||
    data.pincode;
  const hasEducation =
    Array.isArray(data.education) && data.education.length > 0;
  const hasWork =
    Array.isArray(data.work_experience) && data.work_experience.length > 0;
  const hasProjects = Array.isArray(data.projects) && data.projects.length > 0;
  const hasPublications =
    Array.isArray(data.published_papers) && data.published_papers.length > 0;
  const hasTechSkills =
    Array.isArray(data.technical_skills) && data.technical_skills.length > 0;
  const hasLanguages =
    Array.isArray(data.languages) && data.languages.length > 0;

  return (
    <div
      style={{
        width: "210mm",
        minHeight: "297mm",
        backgroundColor: "#ffffff",
        padding: "2.5rem",
        fontFamily: "Times New Roman, Times, serif",
        fontSize: "14px",
        lineHeight: "1.5",
        color: "#000000",
        ...(className && { className }),
      }}
    >
      {/* Header */}
      <header style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "700",
            marginBottom: "0.5rem",
            color: "#000000",
          }}
        >
          {data.full_name}
        </h1>
        {hasAddress && (
          <address
            style={{
              fontStyle: "normal",
              marginTop: "0.25rem",
              fontSize: "14px",
              color: "#000000",
            }}
          >
            {data.address_line_1 && <span>{data.address_line_1}, </span>}
            {data.address_line_2 && <span>{data.address_line_2}, </span>}
            {data.city && <span>{data.city}, </span>}
            {data.state && <span>{data.state} </span>}
            {data.pincode && <span>{data.pincode}</span>}
          </address>
        )}
        <div
          style={{
            fontSize: "14px",
            marginTop: "0.25rem",
            color: "#000000",
          }}
        >
          {data.email && <span>Email: {data.email}</span>}
          {data.email && data.phone && <span> | </span>}
          {data.phone && <span>Phone: {data.phone}</span>}
        </div>
        {data.linkedin && (
          <div
            style={{
              fontSize: "14px",
              marginTop: "0.25rem",
              color: "#000000",
            }}
          >
            <span>LinkedIn: {data.linkedin}</span>
          </div>
        )}
      </header>

      {/* Current Details Section */}
      {(data.current_ctc ||
        data.yoe ||
        (data.domain && data.domain.length > 0) ||
        data.preferred_job_role ||
        data.preferred_job_location) && (
        <section style={{ marginBottom: "1.5rem" }}>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#4E81BD",
              marginBottom: "0.5rem",
              borderBottom: "2px solid #4E81BD",
              paddingBottom: "0.25rem",
            }}
          >
            CURRENT DETAILS
          </h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {data.current_ctc && (
                <tr>
                  <td
                    style={{
                      width: "35%",
                      padding: "0.25rem 0",
                      verticalAlign: "top",
                      fontSize: "14px",
                      color: "#000000",
                    }}
                  >
                    Current CTC:
                  </td>
                  <td
                    style={{
                      width: "65%",
                      padding: "0.25rem 0",
                      verticalAlign: "top",
                      fontSize: "14px",
                      color: "#000000",
                    }}
                  >
                    ₹{data.current_ctc} LPA
                  </td>
                </tr>
              )}
              {data.yoe && (
                <tr>
                  <td
                    style={{
                      width: "35%",
                      padding: "0.25rem 0",
                      verticalAlign: "top",
                      fontSize: "14px",
                      color: "#000000",
                    }}
                  >
                    Total Work Experience:
                  </td>
                  <td
                    style={{
                      width: "65%",
                      padding: "0.25rem 0",
                      verticalAlign: "top",
                      fontSize: "14px",
                      color: "#000000",
                    }}
                  >
                    {data.yoe} Years
                  </td>
                </tr>
              )}
              {data.domain && data.domain.length > 0 && (
                <tr>
                  <td
                    style={{
                      width: "35%",
                      padding: "0.25rem 0",
                      verticalAlign: "top",
                      fontSize: "14px",
                      color: "#000000",
                    }}
                  >
                    Domain of Expertise:
                  </td>
                  <td
                    style={{
                      width: "65%",
                      padding: "0.25rem 0",
                      verticalAlign: "top",
                      fontSize: "14px",
                      color: "#000000",
                    }}
                  >
                    {data.domain.join(", ")}
                  </td>
                </tr>
              )}
              {data.preferred_job_role && (
                <tr>
                  <td
                    style={{
                      width: "35%",
                      padding: "0.25rem 0",
                      verticalAlign: "top",
                      fontSize: "14px",
                      color: "#000000",
                    }}
                  >
                    Preferred Job Role/Function:
                  </td>
                  <td
                    style={{
                      width: "65%",
                      padding: "0.25rem 0",
                      verticalAlign: "top",
                      fontSize: "14px",
                      color: "#000000",
                    }}
                  >
                    {data.preferred_job_role.join(", ")}
                  </td>
                </tr>
              )}
              {data.preferred_job_location && (
                <tr>
                  <td
                    style={{
                      width: "35%",
                      padding: "0.25rem 0",
                      verticalAlign: "top",
                      fontSize: "14px",
                      color: "#000000",
                    }}
                  >
                    Preferred Job Location:
                  </td>
                  <td
                    style={{
                      width: "65%",
                      padding: "0.25rem 0",
                      verticalAlign: "top",
                      fontSize: "14px",
                      color: "#000000",
                    }}
                  >
                    {data.preferred_job_location.join(", ")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}

      {/* Professional Summary */}
      {data.professional_summary && (
        <section style={{ marginBottom: "1.5rem" }}>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#4E81BD",
              marginBottom: "0.5rem",
              borderBottom: "2px solid #4E81BD",
              paddingBottom: "0.25rem",
            }}
          >
            PROFESSIONAL SUMMARY
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              lineHeight: "1.6",
              color: "#000000",
            }}
          >
            {data.professional_summary}
          </p>
        </section>
      )}

      {/* Education - Now iterating over education array */}
      {hasEducation && (
        <section style={{ marginBottom: "1.5rem" }}>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#4E81BD",
              marginBottom: "0.5rem",
              borderBottom: "2px solid #4E81BD",
              paddingBottom: "0.25rem",
            }}
          >
            EDUCATION
          </h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {data.education.map((edu, index) => (
                <Fragment key={edu.id || index}>
                  <tr>
                    <td
                      style={{
                        width: "35%",
                        padding: "0.25rem 0",
                        verticalAlign: "top",
                        fontSize: "14px",
                        color: "#000000",
                        paddingTop: index > 0 ? "1rem" : "0.25rem",
                      }}
                    >
                      {edu.level ? edu.level.toUpperCase() : "Institution"}
                    </td>
                    <td
                      style={{
                        width: "65%",
                        padding: "0.25rem 0",
                        verticalAlign: "top",
                        fontSize: "14px",
                        color: "#000000",
                        paddingTop: index > 0 ? "1rem" : "0.25rem",
                      }}
                    >
                      {edu.institution_name}
                      {edu.city &&
                        edu.country &&
                        `, ${edu.city}, ${edu.country}`}
                      <br />
                      {edu.degree_discipline && (
                        <>
                          {edu.degree_discipline}
                          {edu.cgpa && ` – CGPA: ${edu.cgpa}/10`}
                          {edu.percentage &&
                            ` – Percentage: ${edu.percentage}%`}
                          <br />
                        </>
                      )}
                      {edu.graduation_date &&
                        `Graduation: ${edu.graduation_date}`}
                    </td>
                  </tr>
                  {edu.relevant_courses && edu.relevant_courses.length > 0 && (
                    <tr>
                      <td
                        style={{
                          width: "35%",
                          padding: "0.25rem 0",
                          verticalAlign: "top",
                          fontSize: "14px",
                          color: "#000000",
                        }}
                      >
                        Relevant Courses:
                      </td>
                      <td
                        style={{
                          width: "65%",
                          padding: "0.25rem 0",
                          verticalAlign: "top",
                          fontSize: "14px",
                          color: "#000000",
                        }}
                      >
                        {edu.relevant_courses.join(", ")}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Work Experience - Now iterating over work_experience array */}
      {hasWork && (
        <section style={{ marginBottom: "1.5rem" }}>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#4E81BD",
              marginBottom: "0.5rem",
              borderBottom: "2px solid #4E81BD",
              paddingBottom: "0.25rem",
            }}
          >
            PROFESSIONAL EXPERIENCE
          </h2>
          {data.work_experience.map((work, index) => (
            <div
              key={work.id || index}
              style={{
                marginBottom:
                  index < data.work_experience.length - 1 ? "1rem" : "0",
              }}
            >
              {work.company_name && (
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "14px",
                    color: "#000000",
                  }}
                >
                  {work.company_name}
                </div>
              )}
              {(work.company_city || work.company_country) && (
                <div
                  style={{
                    fontSize: "14px",
                    marginTop: "0.125rem",
                    color: "#000000",
                  }}
                >
                  {[work.company_city, work.company_country]
                    .filter(Boolean)
                    .join(", ")}
                </div>
              )}
              {work.designation && (
                <div
                  style={{
                    fontSize: "14px",
                    marginTop: "0.125rem",
                    color: "#000000",
                  }}
                >
                  {work.designation}
                </div>
              )}
              {(work.work_from || work.work_to) && (
                <div
                  style={{
                    fontSize: "14px",
                    marginTop: "0.125rem",
                    color: "#000000",
                  }}
                >
                  {work.work_from && work.work_from}
                  {work.work_from && work.work_to && " - "}
                  {work.work_to && work.work_to}
                </div>
              )}
              {work.work_summary && work.work_summary.length > 0 && (
                <ResumeBulletList items={work.work_summary} />
              )}
            </div>
          ))}
        </section>
      )}

      {/* Projects - Now iterating over projects array */}
      {hasProjects && (
        <section style={{ marginBottom: "1.5rem" }}>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#4E81BD",
              marginBottom: "0.5rem",
              borderBottom: "2px solid #4E81BD",
              paddingBottom: "0.25rem",
            }}
          >
            PROJECTS
          </h2>
          {data.projects.map((project, index) => (
            <div
              key={project.id || index}
              style={{ marginTop: index === 0 ? 0 : "1rem" }}
            >
              {project.project_name && (
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "14px",
                    color: "#000000",
                  }}
                >
                  {project.project_name}
                </div>
              )}
              {project.project_aim && (
                <p
                  style={{
                    fontSize: "14px",
                    color: "#000000",
                    margin: "0.25rem 0",
                  }}
                >
                  {project.project_aim}
                </p>
              )}
              {project.tech_stack && project.tech_stack.length > 0 && (
                <div style={{ fontSize: "14px", color: "#000000" }}>
                  Tech: {project.tech_stack.join(", ")}
                </div>
              )}
              {project.achievements && project.achievements.length > 0 && (
                <ResumeBulletList items={project.achievements} />
              )}
            </div>
          ))}
        </section>
      )}

      {/* Publications - Now iterating over published_papers array */}
      {hasPublications && (
        <section style={{ marginBottom: "1.5rem" }}>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#4E81BD",
              marginBottom: "0.5rem",
              borderBottom: "2px solid #4E81BD",
              paddingBottom: "0.25rem",
            }}
          >
            PUBLICATIONS
          </h2>
          {data.published_papers.map((pub, index) => (
            <div
              key={pub.id || index}
              style={{ marginTop: index === 0 ? 0 : "1rem" }}
            >
              {pub.paper_title && (
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "14px",
                    color: "#000000",
                  }}
                >
                  {pub.paper_title}
                </div>
              )}
              {(pub.journal_name ||
                pub.volume_issue ||
                pub.publication_year) && (
                <div style={{ fontSize: "14px", color: "#000000" }}>
                  {[pub.journal_name, pub.volume_issue, pub.publication_year]
                    .filter(Boolean)
                    .join(", ")}
                </div>
              )}
              {pub.issn && (
                <div style={{ fontSize: "14px", color: "#000000" }}>
                  ISSN: {pub.issn}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Technical Skills - Now using normalized array structure */}
      {hasTechSkills && (
        <section style={{ marginBottom: "1.5rem" }}>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#4E81BD",
              marginBottom: "0.5rem",
              borderBottom: "2px solid #4E81BD",
              paddingBottom: "0.25rem",
            }}
          >
            TECHNICAL SKILLS
          </h2>
          <ResumeTable
            rows={data.technical_skills.map((t) => ({
              label: t.skill_category,
              value: (t.skills || []).join(", "),
            }))}
            showHeader={true}
            labelWidth="35%"
            valueWidth="65%"
            headerLabel="Category"
            headerValue="Skills"
          />
        </section>
      )}

      {/* Languages - Now using normalized array structure */}
      {hasLanguages && (
        <section style={{ marginBottom: "1.5rem" }}>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#4E81BD",
              marginBottom: "0.5rem",
              borderBottom: "2px solid #4E81BD",
              paddingBottom: "0.25rem",
            }}
          >
            LANGUAGES
          </h2>
          <ResumeTable
            rows={data.languages.map((l) => ({
              label: l.language_name,
              value:
                l.proficiency.charAt(0).toUpperCase() + l.proficiency.slice(1),
            }))}
            showHeader={true}
            labelWidth="35%"
            valueWidth="65%"
            headerLabel="Name"
            headerValue="Proficiency Level"
          />
        </section>
      )}
    </div>
  );
}
