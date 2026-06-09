"use client";

import { CVPersonal } from "@/types/cv";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  data: CVPersonal;
  onChange: (data: CVPersonal) => void;
}

export function PersonalSection({ data, onChange }: Props) {
  const set = (key: keyof CVPersonal) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...data, [key]: e.target.value });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Full Name" value={data.name} onChange={set("name")} />
        <Field label="Title" value={data.title} onChange={set("title")} />
        <Field label="Email" value={data.email} onChange={set("email")} type="email" />
        <Field label="Phone" value={data.phone} onChange={set("phone")} />
        <Field label="LinkedIn" value={data.linkedin} onChange={set("linkedin")} />
        <Field label="Website" value={data.website} onChange={set("website")} />
      </div>
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
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input value={value} onChange={onChange} type={type} className="h-8 text-sm" />
    </div>
  );
}
