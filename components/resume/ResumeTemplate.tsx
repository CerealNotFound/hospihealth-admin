import { ResumeData } from "@/types/resume";

interface ResumeTemplateProps {
  data: ResumeData;
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

  console.log(data.project_experience);

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

      {/* Education */}
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
              {data.college_name && (
                <>
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
                      College Name, City, Country
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
                      {data.college_name}
                      {data.college_city &&
                        data.college_country &&
                        `, ${data.college_city}, ${data.college_country}`}
                      <br />
                      {data.degree_discipline && (
                        <>
                          {data.degree_discipline}
                          {data.cgpa && ` – CGPA: ${data.cgpa}/10`}
                          <br />
                        </>
                      )}
                      {data.graduation_date &&
                        `Graduation: ${data.graduation_date}`}
                    </td>
                  </tr>
                  {data.relevant_courses &&
                    data.relevant_courses.length > 0 && (
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
                          {data.relevant_courses.join(", ")}
                        </td>
                      </tr>
                    )}
                </>
              )}

              {data.school_name && (
                <tr>
                  <td
                    style={{
                      width: "35%",
                      padding: "0.25rem 0",
                      verticalAlign: "top",
                      fontSize: "14px",
                      color: "#000000",
                      paddingTop: data.college_name ? "1rem" : "0.25rem",
                    }}
                  >
                    School Name, City, Country
                  </td>
                  <td
                    style={{
                      width: "65%",
                      padding: "0.25rem 0",
                      verticalAlign: "top",
                      fontSize: "14px",
                      color: "#000000",
                      paddingTop: data.college_name ? "1rem" : "0.25rem",
                    }}
                  >
                    {data.school_name}
                    {data.school_city &&
                      data.school_country &&
                      `, ${data.school_city}, ${data.school_country}`}
                    <br />
                    {data.higher_secondary_percentage && (
                      <>
                        Higher Secondary Certificate (HSC) –{" "}
                        {data.higher_secondary_percentage}%
                        <br />
                      </>
                    )}
                    {data.school_completion_date &&
                      `Completion: ${data.school_completion_date}`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}

      {/* Work Experience */}
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
          <div
            style={{ fontWeight: "600", fontSize: "14px", color: "#000000" }}
          >
            {data.company_name}
          </div>
          {data.company_city && data.company_country && (
            <div
              style={{
                fontSize: "14px",
                marginTop: "0.125rem",
                color: "#000000",
              }}
            >
              {data.company_city}, {data.company_country}
            </div>
          )}
          {data.designation && (
            <div
              style={{
                fontSize: "14px",
                marginTop: "0.125rem",
                color: "#000000",
              }}
            >
              {data.designation}
            </div>
          )}
          <div
            style={{
              fontSize: "14px",
              marginTop: "0.125rem",
              color: "#000000",
            }}
          >
            {data.work_from && data.work_from}
            {data.work_from && data.work_to && " - "}
            {data.work_to && data.work_to}
          </div>
          {data.work_summary && <ResumeBulletList items={data.work_summary} />}
        </section>
      )}

      {/* Projects */}
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
            ACADEMIC PROJECTS & PAPERS
          </h2>
          {data.project_experience?.map((project, index) => (
            <div key={index} style={{ marginTop: index === 0 ? 0 : "1rem" }}>
              <div
                style={{
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "#000000",
                }}
              >
                {project.project_name}
              </div>
              <p
                style={{
                  fontSize: "14px",
                  color: "#000000",
                }}
              >
                {project.client}
              </p>
              {/* {project.tech_stack && ( */}
              <div style={{ fontSize: "14px", color: "#000000" }}>
                {project.duration}
              </div>
              {/* )} */}
            </div>
          ))}
        </section>
      )}

      {/* Publications */}
      {hasPublication && (
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
            PUBLISHED PAPER
          </h2>
          <div
            style={{ fontWeight: "600", fontSize: "14px", color: "#000000" }}
          >
            {data.published_paper}
          </div>
          <div style={{ fontSize: "14px", color: "#000000" }}>
            {data.journal_name}
            {data.volume_issue && `, ${data.volume_issue}`}
            {data.publication_year && `, ${data.publication_year}`}
          </div>
          {data.issn && (
            <div style={{ fontSize: "14px", color: "#000000" }}>
              ISSN: {data.issn}
            </div>
          )}
        </section>
      )}

      {/* Technical Skills */}
      {data.technical_skills && Object.keys(data.technical_skills).length > 0 && (
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
                rows={Object.entries(data.technical_skills).map(
                  ([category, skills]) => ({
                    label: category,
                    value: skills.join(", "),
                  })
                )}
                showHeader={true}
                labelWidth="35%"
                valueWidth="65%"
                headerLabel="Category"
                headerValue="Skills"
              />
        </section>
      )}

      {/* Languages */}
      {data.languages && data.languages.length > 0 && (
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
            LANGUAGE
          </h2>
          <ResumeTable
            rows={data.languages.map((language) => ({
              label: language,
              value:
                data.language_proficiency || "[Basic, Intermediate, Advanced]",
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
