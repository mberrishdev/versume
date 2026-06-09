"use client";

import { CVExperience } from "@/types/cv";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface Props {
  data: CVExperience[];
  onChange: (data: CVExperience[]) => void;
}

export function ExperienceSection({ data, onChange }: Props) {
  const add = () =>
    onChange([
      ...data,
      {
        id: uuidv4(),
        company: "",
        role: "",
        location: "",
        period: "",
        description: "",
        bullets: [],
      },
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
    <div className="space-y-4">
      {data.map((exp, i) => (
        <div key={exp.id} className="border border-border rounded-lg p-4 space-y-3 bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              {exp.company || `Experience ${i + 1}`}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => remove(exp.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Company</Label>
              <Input
                className="h-8 text-sm"
                value={exp.company}
                onChange={(e) => update(exp.id, "company", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Role</Label>
              <Input
                className="h-8 text-sm"
                value={exp.role}
                onChange={(e) => update(exp.id, "role", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Location</Label>
              <Input
                className="h-8 text-sm"
                value={exp.location}
                onChange={(e) => update(exp.id, "location", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Period</Label>
              <Input
                className="h-8 text-sm"
                value={exp.period}
                onChange={(e) => update(exp.id, "period", e.target.value)}
                placeholder="May 2021 - Present"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Description</Label>
            <Textarea
              className="text-sm resize-none"
              rows={2}
              value={exp.description}
              onChange={(e) => update(exp.id, "description", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Bullet Points</Label>
            {exp.bullets.map((b, idx) => (
              <div key={idx} className="flex gap-2">
                <Input
                  className="h-8 text-sm"
                  value={b}
                  onChange={(e) => updateBullet(exp.id, idx, e.target.value)}
                  placeholder="Achievement or responsibility..."
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => removeBullet(exp.id, idx)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => addBullet(exp.id)}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add bullet
            </Button>
          </div>
        </div>
      ))}

      <Button variant="outline" size="sm" onClick={add} className="w-full h-8 text-xs border-dashed">
        <Plus className="h-3.5 w-3.5 mr-1" />
        Add Experience
      </Button>
    </div>
  );
}
