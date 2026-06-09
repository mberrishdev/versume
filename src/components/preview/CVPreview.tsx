"use client";

import { CV } from "@/types/cv";

interface Props {
  cv: CV;
}

export function CVPreview({ cv }: Props) {
  const { personal, summary, experience, projects, education, skills, languages } = cv;

  const skillRows = [
    { label: "Languages & Frameworks", value: skills.languages },
    { label: "Architecture & Patterns", value: skills.architecture },
    { label: "Databases & Messaging", value: skills.databases },
    { label: "Cloud & DevOps", value: skills.cloud },
    { label: "APIs", value: skills.apis },
    { label: "Testing & Quality", value: skills.testing },
    { label: "Version Control", value: skills.versionControl },
  ].filter((r) => r.value);

  const projectsByCategory = projects.reduce<Record<string, typeof projects>>(
    (acc, p) => {
      const cat = p.category || "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(p);
      return acc;
    },
    {}
  );

  const contactItems = [
    personal.email,
    personal.phone,
    personal.linkedin,
    personal.website,
  ].filter(Boolean);

  return (
    <div style={{
      background: "#ffffff", color: "#1a1a1a",
      fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      fontSize: 13, lineHeight: 1.5,
      padding: "44px 40px", maxWidth: 816, margin: "0 auto",
      minHeight: 1056,
    }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{
          fontSize: 26, fontWeight: 700, letterSpacing: "-0.025em",
          lineHeight: 1.1, color: "#111", margin: "0 0 4px",
        }}>
          {personal.name || "Your Name"}
        </h1>
        {personal.title && (
          <p style={{ fontSize: 14, color: "#555", margin: "0 0 8px" }}>{personal.title}</p>
        )}
        {contactItems.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 0, alignItems: "center" }}>
            {contactItems.map((item, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center" }}>
                {i > 0 && <span style={{ color: "#ccc", margin: "0 6px", fontSize: 10 }}>·</span>}
                <span style={{ fontSize: 11, color: "#777" }}>{item}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {summary && (
        <p style={{ fontSize: 13, color: "#444", marginBottom: 18, lineHeight: 1.6 }}>{summary}</p>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <PreviewSection title="PROFESSIONAL EXPERIENCE">
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
                <span style={{ fontWeight: 700, fontSize: 13 }}>
                  {exp.role}
                  {exp.company && <span style={{ fontWeight: 400, color: "#666" }}> · {exp.company}</span>}
                </span>
                <span style={{ fontSize: 11, color: "#999", flexShrink: 0, marginLeft: 12 }}>
                  {[exp.period, exp.location].filter(Boolean).join(" · ")}
                </span>
              </div>
              {exp.description && (
                <p style={{ fontSize: 12.5, color: "#555", margin: "2px 0 4px", lineHeight: 1.5 }}>{exp.description}</p>
              )}
              {exp.bullets.length > 0 && (
                <div style={{ marginTop: 4 }}>
                  {exp.bullets.map((b, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", marginBottom: 3 }}>
                      <span style={{
                        color: "#888", fontSize: 14, lineHeight: 1,
                        marginRight: 7, marginTop: 2, flexShrink: 0,
                      }}>·</span>
                      <span style={{ fontSize: 12.5, color: "#333", lineHeight: 1.5 }}>{b}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </PreviewSection>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <PreviewSection title="PROJECTS">
          {Object.entries(projectsByCategory).map(([cat, projs]) => (
            <div key={cat} style={{ marginBottom: 10 }}>
              <p style={{ fontSize: 11, color: "#888", marginBottom: 5, fontWeight: 500 }}>{cat}</p>
              {projs.map((p) => (
                <div key={p.id} style={{ display: "flex", alignItems: "flex-start", marginBottom: 4 }}>
                  <span style={{ color: "#888", fontSize: 14, lineHeight: 1, marginRight: 7, marginTop: 2, flexShrink: 0 }}>·</span>
                  <span style={{ fontSize: 12.5, lineHeight: 1.5 }}>
                    <strong>{p.name}</strong>
                    {p.role && <span style={{ color: "#666" }}> - {p.role}: </span>}
                    {!p.role && " "}
                    <span style={{ color: "#555" }}>{p.description}</span>
                    {p.links.length > 0 && (
                      <span style={{ marginLeft: 4 }}>
                        {p.links.map((l, i) => (
                          <span key={i}>
                            {i > 0 && <span style={{ color: "#ccc" }}> | </span>}
                            <a href={l.url || "#"} style={{ color: "#2563EB" }} target="_blank" rel="noopener noreferrer">{l.label}</a>
                          </span>
                        ))}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </PreviewSection>
      )}

      {/* Education */}
      {education.length > 0 && (
        <PreviewSection title="EDUCATION">
          {education.map((edu) => (
            <div key={edu.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: 13, margin: "0 0 1px" }}>{edu.institution}</p>
                <p style={{ fontSize: 12.5, color: "#555", margin: 0 }}>{edu.degree}</p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                <p style={{ fontSize: 11, color: "#999", margin: "0 0 1px" }}>{edu.location}</p>
                <p style={{ fontSize: 11, color: "#999", margin: 0 }}>{edu.period}</p>
              </div>
            </div>
          ))}
        </PreviewSection>
      )}

      {/* Skills */}
      {skillRows.length > 0 && (
        <PreviewSection title="CORE SKILLS">
          {skillRows.map(({ label, value }) => (
            <p key={label} style={{ fontSize: 12.5, margin: "0 0 3px" }}>
              <strong>{label}:</strong>{" "}
              <span style={{ color: "#555" }}>{value}</span>
            </p>
          ))}
        </PreviewSection>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <PreviewSection title="LANGUAGES">
          {languages.map((l) => (
            <div key={l.id} style={{ display: "flex", alignItems: "flex-start", marginBottom: 3 }}>
              <span style={{ color: "#888", fontSize: 14, lineHeight: 1, marginRight: 7, marginTop: 2, flexShrink: 0 }}>·</span>
              <span style={{ fontSize: 12.5, color: "#333" }}>{l.name}{l.level ? ` — ${l.level}` : ""}</span>
            </div>
          ))}
        </PreviewSection>
      )}
    </div>
  );
}

function PreviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 22, marginBottom: 4 }}>
      <h2 style={{
        fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "#888",
        textTransform: "uppercase",
        borderBottom: "1px solid #E8E8E8", paddingBottom: 4, marginBottom: 10, margin: "0 0 10px",
      }}>
        {title}
      </h2>
      {children}
    </div>
  );
}
