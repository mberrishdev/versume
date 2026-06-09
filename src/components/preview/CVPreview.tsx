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

  return (
    <div
      className="bg-white text-[#1a1a1a] font-sans text-[13px] leading-[1.5] p-10 max-w-[816px] mx-auto"
      style={{ fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight leading-none">
            {personal.name || "Your Name"}
          </h1>
          <p className="text-[14px] text-gray-500 mt-1">{personal.title}</p>
        </div>
        <div className="text-right text-[12px] text-gray-600 space-y-0.5">
          {personal.email && (
            <p className="text-blue-600">{personal.email}</p>
          )}
          {personal.phone && <p>{personal.phone}</p>}
          {personal.linkedin && (
            <p className="text-blue-600">{personal.linkedin}</p>
          )}
          {personal.website && (
            <p className="text-blue-600">{personal.website}</p>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <p className="text-[13px] text-gray-700 mb-6 leading-relaxed">{summary}</p>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <Section title="PROFESSIONAL EXPERIENCE">
          {experience.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[13px]">
                  {exp.company} | {exp.role}
                </span>
                <span className="text-[12px] text-gray-500">
                  {exp.location} | {exp.period}
                </span>
              </div>
              {exp.description && (
                <p className="text-[12.5px] text-gray-700 mt-0.5">{exp.description}</p>
              )}
              {exp.bullets.length > 0 && (
                <ul className="mt-1 space-y-0.5 list-disc list-outside ml-4">
                  {exp.bullets.map((b, i) => (
                    <li key={i} className="text-[12.5px] text-gray-800">
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <Section title="PROJECTS">
          {Object.entries(projectsByCategory).map(([cat, projs]) => (
            <div key={cat} className="mb-3">
              <p className="text-[12px] text-gray-500 mb-1">{cat}</p>
              <ul className="space-y-1 list-disc list-outside ml-4">
                {projs.map((p) => (
                  <li key={p.id} className="text-[12.5px]">
                    <span className="font-bold">{p.name}</span>
                    {p.role && <span className="text-gray-500"> - {p.role}: </span>}
                    <span className="text-gray-700">{p.description}</span>
                    {p.links.length > 0 && (
                      <span className="ml-1">
                        {p.links.map((l, i) => (
                          <span key={i}>
                            {i > 0 && " | "}
                            <a
                              href={l.url || "#"}
                              className="text-blue-600"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {l.label}
                            </a>
                          </span>
                        ))}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <Section title="EDUCATION">
          {education.map((edu) => (
            <div key={edu.id} className="flex justify-between mb-2">
              <div>
                <span className="font-bold text-[13px]">{edu.institution}</span>
                <p className="text-[12.5px] text-gray-600">{edu.degree}</p>
              </div>
              <div className="text-right text-[12px] text-gray-500">
                <p>{edu.location}</p>
                <p>{edu.period}</p>
              </div>
            </div>
          ))}
        </Section>
      )}

      {/* Skills */}
      {skillRows.length > 0 && (
        <Section title="CORE SKILLS">
          <div className="space-y-0.5">
            {skillRows.map(({ label, value }) => (
              <p key={label} className="text-[12.5px]">
                <span className="font-bold">{label}:</span>{" "}
                <span className="text-gray-700">{value}</span>
              </p>
            ))}
          </div>
        </Section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <Section title="LANGUAGES">
          <ul className="list-disc list-outside ml-4 space-y-0.5">
            {languages.map((l) => (
              <li key={l.id} className="text-[12.5px]">
                {l.name} - {l.level}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h2 className="text-[13px] font-bold tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-3">
        {title}
      </h2>
      {children}
    </div>
  );
}
