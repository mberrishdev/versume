"use client";

import { CVEducation } from "@/types/cv";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface Props {
  data: CVEducation[];
  onChange: (data: CVEducation[]) => void;
}

export function EducationSection({ data, onChange }: Props) {
  const add = () =>
    onChange([
      ...data,
      { id: uuidv4(), institution: "", location: "", period: "", degree: "" },
    ]);

  const remove = (id: string) => onChange(data.filter((e) => e.id !== id));

  const update = (id: string, field: keyof CVEducation, value: string) =>
    onChange(data.map((e) => (e.id === id ? { ...e, [field]: value } : e)));

  return (
    <div className="space-y-4">
      {data.map((edu, i) => (
        <div key={edu.id} className="border border-border rounded-lg p-4 space-y-3 bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              {edu.institution || `Education ${i + 1}`}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => remove(edu.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1">
              <Label className="text-xs text-muted-foreground">Institution</Label>
              <Input
                className="h-8 text-sm"
                value={edu.institution}
                onChange={(e) => update(edu.id, "institution", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Location</Label>
              <Input
                className="h-8 text-sm"
                value={edu.location}
                onChange={(e) => update(edu.id, "location", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Period</Label>
              <Input
                className="h-8 text-sm"
                value={edu.period}
                onChange={(e) => update(edu.id, "period", e.target.value)}
                placeholder="Sep 2020 - Jun 2024"
              />
            </div>
            <div className="col-span-2 space-y-1">
              <Label className="text-xs text-muted-foreground">Degree</Label>
              <Input
                className="h-8 text-sm"
                value={edu.degree}
                onChange={(e) => update(edu.id, "degree", e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <Button variant="outline" size="sm" onClick={add} className="w-full h-8 text-xs border-dashed">
        <Plus className="h-3.5 w-3.5 mr-1" />
        Add Education
      </Button>
    </div>
  );
}
