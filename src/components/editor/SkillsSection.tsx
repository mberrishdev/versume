"use client";

import { CVSkills } from "@/types/cv";

interface Props {
  data: CVSkills;
  onChange: (data: CVSkills) => void;
}

const FIELDS: { key: keyof CVSkills; label: string }[] = [
  { key: "languages", label: "Languages & Frameworks" },
  { key: "architecture", label: "Architecture & Patterns" },
  { key: "databases", label: "Databases & Messaging" },
  { key: "cloud", label: "Cloud & DevOps" },
  { key: "apis", label: "APIs" },
  { key: "testing", label: "Testing & Quality" },
  { key: "versionControl", label: "Version Control" },
];

export function SkillsSection({ data, onChange }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {FIELDS.map(({ key, label }) => (
        <div key={key}>
          <label style={{
            display: "block", fontSize: 10, fontWeight: 500, color: "var(--v-text-2)",
            textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5,
          }}>{label}</label>
          <textarea
            rows={2}
            value={data[key]}
            onChange={e => onChange({ ...data, [key]: e.target.value })}
            style={{
              width: "100%", background: "var(--v-bg-0)", color: "var(--v-text-1)",
              border: "1px solid var(--v-border)", borderRadius: 6,
              padding: "6px 10px", fontSize: 13, fontFamily: "var(--font-sans)",
              resize: "none", outline: "none", boxSizing: "border-box", lineHeight: 1.5,
              transition: "border-color 0.15s ease",
            }}
            onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-accent)"}
            onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border)"}
          />
        </div>
      ))}
    </div>
  );
}
