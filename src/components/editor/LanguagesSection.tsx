"use client";

import { CVLanguage } from "@/types/cv";
import { v4 as uuidv4 } from "uuid";

interface Props {
  data: CVLanguage[];
  onChange: (data: CVLanguage[]) => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%", background: "var(--v-bg-0)", color: "var(--v-text-1)",
  border: "1px solid var(--v-border)", borderRadius: 6,
  padding: "6px 10px", fontSize: 13, fontFamily: "var(--font-sans)",
  outline: "none", boxSizing: "border-box", transition: "border-color 0.15s ease",
};

export function LanguagesSection({ data, onChange }: Props) {
  const add = () => onChange([...data, { id: uuidv4(), name: "", level: "" }]);
  const remove = (id: string) => onChange(data.filter((l) => l.id !== id));
  const update = (id: string, field: keyof CVLanguage, value: string) =>
    onChange(data.map((l) => (l.id === id ? { ...l, [field]: value } : l)));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {data.map((lang) => (
        <div key={lang.id} style={{
          background: "var(--v-bg-2)", border: "1px solid var(--v-border)",
          borderRadius: 10, padding: "12px 14px",
          display: "flex", gap: 10, alignItems: "flex-end",
        }}>
          <div style={{ flex: 1 }}>
            <FieldLabel>Language</FieldLabel>
            <input
              value={lang.name}
              onChange={e => update(lang.id, "name", e.target.value)}
              placeholder="English"
              style={inputStyle}
              onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-accent)"}
              onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border)"}
            />
          </div>
          <div style={{ width: 140 }}>
            <FieldLabel>Level</FieldLabel>
            <input
              value={lang.level}
              onChange={e => update(lang.id, "level", e.target.value)}
              placeholder="Native / Fluent"
              style={inputStyle}
              onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-accent)"}
              onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border)"}
            />
          </div>
          <button
            onClick={() => remove(lang.id)}
            style={{
              width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
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
      ))}

      <button
        onClick={add}
        style={{
          width: "100%", padding: "8px", fontSize: 13, color: "var(--v-text-3)",
          background: "transparent", border: "1px dashed var(--v-border)", borderRadius: 8,
          cursor: "pointer", fontFamily: "var(--font-sans)", transition: "all 0.12s ease",
          marginTop: 2,
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
      >+ Add Language</button>
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
