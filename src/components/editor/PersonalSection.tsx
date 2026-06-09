"use client";

import { CVPersonal } from "@/types/cv";

interface Props {
  data: CVPersonal;
  onChange: (data: CVPersonal) => void;
}

export function PersonalSection({ data, onChange }: Props) {
  const set = (key: keyof CVPersonal) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...data, [key]: e.target.value });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      <Field label="Full Name" value={data.name} onChange={set("name")} />
      <Field label="Title" value={data.title} onChange={set("title")} />
      <Field label="Email" value={data.email} onChange={set("email")} type="email" />
      <Field label="Phone" value={data.phone} onChange={set("phone")} />
      <Field label="LinkedIn" value={data.linkedin} onChange={set("linkedin")} />
      <Field label="Website" value={data.website} onChange={set("website")} />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <div>
      <label style={{
        display: "block", fontSize: 10, fontWeight: 500, color: "var(--v-text-2)",
        textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5,
      }}>{label}</label>
      <input
        value={value}
        onChange={onChange}
        type={type}
        style={{
          width: "100%", background: "var(--v-bg-0)", color: "var(--v-text-1)",
          border: "1px solid var(--v-border)", borderRadius: 6,
          padding: "6px 10px", fontSize: 13, fontFamily: "var(--font-sans)",
          outline: "none", boxSizing: "border-box", transition: "border-color 0.15s ease",
        }}
        onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-accent)"}
        onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border)"}
      />
    </div>
  );
}
