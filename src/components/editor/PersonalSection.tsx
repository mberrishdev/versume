"use client";

import { CVPersonal } from "@/types/cv";
import { v4 as uuidv4 } from "uuid";

interface Props {
  data: CVPersonal;
  onChange: (data: CVPersonal) => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%", background: "var(--v-bg-0)", color: "var(--v-text-1)",
  border: "1px solid var(--v-border)", borderRadius: 6,
  padding: "6px 10px", fontSize: 13, fontFamily: "var(--font-sans)",
  outline: "none", boxSizing: "border-box", transition: "border-color 0.15s ease",
};

const labelInputStyle: React.CSSProperties = {
  background: "var(--v-bg-0)", color: "var(--v-text-2)",
  border: "1px solid var(--v-border)", borderRadius: 6,
  padding: "4px 8px", fontSize: 10, fontWeight: 600,
  fontFamily: "var(--font-sans)", textTransform: "uppercase",
  letterSpacing: "0.05em", outline: "none",
  boxSizing: "border-box", transition: "border-color 0.15s ease",
  width: "100%",
};

export function PersonalSection({ data, onChange }: Props) {
  const set = (key: keyof CVPersonal) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...data, [key]: e.target.value });

  const customFields = data.customFields ?? [];

  const addField = () =>
    onChange({ ...data, customFields: [...customFields, { id: uuidv4(), label: "Custom Field", value: "" }] });

  const removeField = (id: string) =>
    onChange({ ...data, customFields: customFields.filter(f => f.id !== id) });

  const updateField = (id: string, key: "label" | "value", value: string) =>
    onChange({ ...data, customFields: customFields.map(f => f.id === id ? { ...f, [key]: value } : f) });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      <Field label="Full Name" value={data.name} onChange={set("name")} />
      <Field label="Title" value={data.title} onChange={set("title")} />
      <Field label="Email" value={data.email} onChange={set("email")} type="email" />
      <Field label="Phone" value={data.phone} onChange={set("phone")} />
      <Field label="LinkedIn" value={data.linkedin} onChange={set("linkedin")} />
      <Field label="Website" value={data.website} onChange={set("website")} />

      {/* Custom fields */}
      {customFields.map(field => (
        <div key={field.id} style={{ gridColumn: "1 / -1", display: "flex", gap: 8, alignItems: "flex-end" }}>
          <div style={{ width: 140, flexShrink: 0 }}>
            <label style={{ display: "block", fontSize: 10, fontWeight: 500, color: "var(--v-text-2)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
              Label
            </label>
            <input
              value={field.label}
              onChange={e => updateField(field.id, "label", e.target.value)}
              style={labelInputStyle}
              onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-accent)"}
              onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border)"}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 10, fontWeight: 500, color: "var(--v-text-2)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
              Value
            </label>
            <input
              value={field.value}
              onChange={e => updateField(field.id, "value", e.target.value)}
              style={inputStyle}
              onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-accent)"}
              onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border)"}
            />
          </div>
          <button
            onClick={() => removeField(field.id)}
            style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer", color: "var(--v-text-3)", borderRadius: 4, flexShrink: 0, transition: "color 0.12s ease" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#EF4444"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--v-text-3)"}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </button>
        </div>
      ))}

      <div style={{ gridColumn: "1 / -1" }}>
        <button
          onClick={addField}
          style={{ width: "100%", padding: "7px", fontSize: 12, color: "var(--v-text-3)", background: "transparent", border: "1px dashed var(--v-border)", borderRadius: 7, cursor: "pointer", fontFamily: "var(--font-sans)", transition: "all 0.12s ease" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--v-text-2)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border-hover)"; (e.currentTarget as HTMLElement).style.background = "var(--v-bg-2)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--v-text-3)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >+ Add custom field</button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: {
  label: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 10, fontWeight: 500, color: "var(--v-text-2)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>{label}</label>
      <input
        value={value} onChange={onChange} type={type} style={inputStyle}
        onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-accent)"}
        onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border)"}
      />
    </div>
  );
}
