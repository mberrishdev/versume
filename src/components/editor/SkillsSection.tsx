"use client";

import { CVSkills } from "@/types/cv";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
    <div className="space-y-3">
      {FIELDS.map(({ key, label }) => (
        <div key={key} className="space-y-1">
          <Label className="text-xs text-muted-foreground">{label}</Label>
          <Textarea
            className="text-sm resize-none"
            rows={2}
            value={data[key]}
            onChange={(e) => onChange({ ...data, [key]: e.target.value })}
          />
        </div>
      ))}
    </div>
  );
}
