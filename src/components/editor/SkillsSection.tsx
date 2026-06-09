"use client";

import { CVSkillItem } from "@/types/cv";
import { v4 as uuidv4 } from "uuid";

interface Props {
  data: CVSkillItem[];
  onChange: (data: CVSkillItem[]) => void;
}

const inputStyle: React.CSSProperties = {
  background: "var(--v-bg-0)", color: "var(--v-text-1)",
  border: "1px solid var(--v-border)", borderRadius: 6,
  padding: "6px 10px", fontSize: 13, fontFamily: "var(--font-sans)",
  outline: "none", boxSizing: "border-box", transition: "border-color 0.15s ease",
  width: "100%",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 10, fontWeight: 500, color: "var(--v-text-2)",
  textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4,
};

export function SkillsSection({ data, onChange }: Props) {
  const add = () => onChange([...data, { id: uuidv4(), label: "New Category", value: "" }]);
  const remove = (id: string) => onChange(data.filter(s => s.id !== id));
  const update = (id: string, field: keyof CVSkillItem, value: string) =>
    onChange(data.map(s => s.id === id ? { ...s, [field]: value } : s));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {data.map((skill) => (
        <div key={skill.id} style={{
          background: "var(--v-bg-2)", border: "1px solid var(--v-border)",
          borderRadius: 10, padding: "12px 14px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <input
              value={skill.label}
              onChange={e => update(skill.id, "label", e.target.value)}
              style={{
                ...inputStyle, fontSize: 11, fontWeight: 600,
                textTransform: "uppercase", letterSpacing: "0.05em",
                color: "var(--v-text-2)", padding: "4px 8px",
              }}
              onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-accent)"}
              onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border)"}
            />
            <button
              onClick={() => remove(skill.id)}
              style={{
                width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center",
                background: "transparent", border: "none", cursor: "pointer",
                color: "var(--v-text-3)", borderRadius: 4, flexShrink: 0,
                transition: "color 0.12s ease",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#EF4444"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--v-text-3)"}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </button>
          </div>
          <textarea
            value={skill.value}
            onChange={e => {
              update(skill.id, "value", e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
            ref={el => { if (el) { el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; } }}
            placeholder="e.g. React, TypeScript, Node.js"
            style={{
              ...inputStyle, resize: "none", lineHeight: 1.5,
              minHeight: 38, overflow: "hidden",
            }}
            onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-accent)"}
            onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border)"}
          />
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
      >+ Add Skill Category</button>
    </div>
  );
}
