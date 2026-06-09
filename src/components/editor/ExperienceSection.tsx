"use client";

import { CVExperience } from "@/types/cv";
import { v4 as uuidv4 } from "uuid";

interface Props {
  data: CVExperience[];
  onChange: (data: CVExperience[]) => void;
}

export function ExperienceSection({ data, onChange }: Props) {
  const add = () =>
    onChange([
      ...data,
      { id: uuidv4(), company: "", role: "", location: "", period: "", description: "", bullets: [] },
    ]);

  const remove = (id: string) => onChange(data.filter((e) => e.id !== id));

  const update = (id: string, field: keyof CVExperience, value: string | string[]) =>
    onChange(data.map((e) => (e.id === id ? { ...e, [field]: value } : e)));

  const updateBullet = (expId: string, idx: number, value: string) => {
    const exp = data.find((e) => e.id === expId)!;
    const bullets = [...exp.bullets];
    bullets[idx] = value;
    update(expId, "bullets", bullets);
  };

  const addBullet = (expId: string) => {
    const exp = data.find((e) => e.id === expId)!;
    update(expId, "bullets", [...exp.bullets, ""]);
  };

  const removeBullet = (expId: string, idx: number) => {
    const exp = data.find((e) => e.id === expId)!;
    update(expId, "bullets", exp.bullets.filter((_, i) => i !== idx));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {data.map((exp, i) => (
        <div key={exp.id} style={{
          background: "var(--v-bg-2)", border: "1px solid var(--v-border)",
          borderRadius: 10, padding: 14,
        }}>
          {/* Card header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--v-text-1)" }}>
              {exp.company || `Experience ${i + 1}`}
            </span>
            <TrashBtn onClick={() => remove(exp.id)} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
            <InlineField label="Company" value={exp.company} onChange={v => update(exp.id, "company", v)} />
            <InlineField label="Role" value={exp.role} onChange={v => update(exp.id, "role", v)} />
            <InlineField label="Location" value={exp.location} onChange={v => update(exp.id, "location", v)} />
            <InlineField label="Period" value={exp.period} onChange={v => update(exp.id, "period", v)} placeholder="May 2021 - Present" />
          </div>

          <div style={{ marginBottom: 10 }}>
            <FieldLabel>Description</FieldLabel>
            <textarea
              rows={2}
              value={exp.description}
              onChange={e => update(exp.id, "description", e.target.value)}
              style={textareaStyle}
              onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-accent)"}
              onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border)"}
            />
          </div>

          <div>
            <FieldLabel>Bullet Points</FieldLabel>
            {exp.bullets.map((b, idx) => (
              <div key={idx} style={{ display: "flex", gap: 6, marginBottom: 5, alignItems: "center" }}>
                <span style={{ color: "var(--v-text-3)", fontSize: 16, lineHeight: 1, flexShrink: 0, marginTop: 1 }}>·</span>
                <input
                  value={b}
                  onChange={e => updateBullet(exp.id, idx, e.target.value)}
                  placeholder="Achievement or responsibility..."
                  style={{ ...inputStyle, flex: 1 }}
                  onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-accent)"}
                  onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border)"}
                />
                <TrashBtn onClick={() => removeBullet(exp.id, idx)} />
              </div>
            ))}
            <GhostSmallBtn onClick={() => addBullet(exp.id)}>
              + Add bullet
            </GhostSmallBtn>
          </div>
        </div>
      ))}

      <GhostAddBtn onClick={add}>+ Add Experience</GhostAddBtn>
    </div>
  );
}

function InlineField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
        onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-accent)"}
        onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border)"}
      />
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
  );
}

function GhostSmallBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 12, color: "var(--v-text-3)", background: "transparent",
        border: "1px solid var(--v-border)", borderRadius: 5, padding: "3px 10px",
        cursor: "pointer", fontFamily: "var(--font-sans)", transition: "all 0.12s ease",
        marginTop: 2,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.color = "var(--v-text-2)";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border-hover)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.color = "var(--v-text-3)";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border)";
      }}
    >{children}</button>
  );
}

function GhostAddBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
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
    >{children}</button>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", background: "var(--v-bg-0)", color: "var(--v-text-1)",
  border: "1px solid var(--v-border)", borderRadius: 6,
  padding: "6px 10px", fontSize: 13, fontFamily: "var(--font-sans)",
  outline: "none", boxSizing: "border-box", transition: "border-color 0.15s ease",
};

const textareaStyle: React.CSSProperties = {
  width: "100%", background: "var(--v-bg-0)", color: "var(--v-text-1)",
  border: "1px solid var(--v-border)", borderRadius: 6,
  padding: "6px 10px", fontSize: 13, fontFamily: "var(--font-sans)",
  resize: "none", outline: "none", boxSizing: "border-box", lineHeight: 1.5,
  transition: "border-color 0.15s ease",
};
