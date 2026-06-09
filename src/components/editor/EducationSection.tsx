"use client";

import { CVEducation } from "@/types/cv";
import { v4 as uuidv4 } from "uuid";

interface Props {
  data: CVEducation[];
  onChange: (data: CVEducation[]) => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%", background: "var(--v-bg-0)", color: "var(--v-text-1)",
  border: "1px solid var(--v-border)", borderRadius: 6,
  padding: "6px 10px", fontSize: 13, fontFamily: "var(--font-sans)",
  outline: "none", boxSizing: "border-box", transition: "border-color 0.15s ease",
};

export function EducationSection({ data, onChange }: Props) {
  const add = () =>
    onChange([...data, { id: uuidv4(), institution: "", location: "", period: "", degree: "" }]);

  const remove = (id: string) => onChange(data.filter((e) => e.id !== id));

  const update = (id: string, field: keyof CVEducation, value: string) =>
    onChange(data.map((e) => (e.id === id ? { ...e, [field]: value } : e)));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {data.map((edu, i) => (
        <div key={edu.id} style={{
          background: "var(--v-bg-2)", border: "1px solid var(--v-border)",
          borderRadius: 10, padding: 14,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--v-text-1)" }}>
              {edu.institution || `Education ${i + 1}`}
            </span>
            <TrashBtn onClick={() => remove(edu.id)} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <FieldLabel>Institution</FieldLabel>
              <input
                value={edu.institution}
                onChange={e => update(edu.id, "institution", e.target.value)}
                style={inputStyle}
                onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-accent)"}
                onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border)"}
              />
            </div>
            <div>
              <FieldLabel>Location</FieldLabel>
              <input
                value={edu.location}
                onChange={e => update(edu.id, "location", e.target.value)}
                style={inputStyle}
                onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-accent)"}
                onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border)"}
              />
            </div>
            <div>
              <FieldLabel>Period</FieldLabel>
              <input
                value={edu.period}
                onChange={e => update(edu.id, "period", e.target.value)}
                placeholder="Sep 2020 - Jun 2024"
                style={inputStyle}
                onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-accent)"}
                onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border)"}
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <FieldLabel>Degree</FieldLabel>
              <input
                value={edu.degree}
                onChange={e => update(edu.id, "degree", e.target.value)}
                style={inputStyle}
                onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-accent)"}
                onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border)"}
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={add}
        style={{
          width: "100%", padding: "8px", fontSize: 13, color: "var(--v-text-3)",
          background: "transparent", border: "1px dashed var(--v-border)", borderRadius: 8,
          cursor: "pointer", fontFamily: "var(--font-sans)", transition: "all 0.12s ease",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.color = "var(--v-text-2)";
          (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border-hover)";
          (e.currentTarget as HTMLElement).style.background = "var(--v-bg-2)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.color = "var(--v-text-3)";
          (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border)";
          (e.currentTarget as HTMLElement).style.background = "transparent";
        }}
      >+ Add Education</button>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label style={{
      display: "block", fontSize: 10, fontWeight: 500, color: "var(--v-text-2)",
      textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4,
    }}>{children}</label>
  );
}

function TrashBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center",
        background: "transparent", border: "none", cursor: "pointer",
        color: "var(--v-text-3)", borderRadius: 4,
        transition: "color 0.12s ease",
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#EF4444"}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--v-text-3)"}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
      </svg>
    </button>
  );
}
