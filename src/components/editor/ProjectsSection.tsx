"use client";

import { CVProject } from "@/types/cv";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GripVertical, Link } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface Props {
  data: CVProject[];
  onChange: (data: CVProject[]) => void;
}

export function ProjectsSection({ data, onChange }: Props) {
  const add = () =>
    onChange([
      ...data,
      { id: uuidv4(), category: "", name: "", role: "", description: "", links: [] },
    ]);

  const remove = (id: string) => onChange(data.filter((p) => p.id !== id));

  const update = (id: string, field: keyof CVProject, value: unknown) =>
    onChange(data.map((p) => (p.id === id ? { ...p, [field]: value } : p)));

  return (
    <div className="space-y-4">
      {data.map((proj, i) => (
        <div key={proj.id} className="border border-border rounded-lg p-4 space-y-3 bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              {proj.name || `Project ${i + 1}`}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => remove(proj.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Project Name</Label>
              <Input
                className="h-8 text-sm"
                value={proj.name}
                onChange={(e) => update(proj.id, "name", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Role</Label>
              <Input
                className="h-8 text-sm"
                value={proj.role}
                onChange={(e) => update(proj.id, "role", e.target.value)}
              />
            </div>
            <div className="col-span-2 space-y-1">
              <Label className="text-xs text-muted-foreground">Category</Label>
              <Input
                className="h-8 text-sm"
                value={proj.category}
                onChange={(e) => update(proj.id, "category", e.target.value)}
                placeholder="Product & SaaS Solutions"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Description</Label>
            <Textarea
              className="text-sm resize-none"
              rows={2}
              value={proj.description}
              onChange={(e) => update(proj.id, "description", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Links</Label>
            {proj.links.map((link, idx) => (
              <div key={idx} className="flex gap-2">
                <Input
                  className="h-8 text-sm w-24 shrink-0"
                  value={link.label}
                  onChange={(e) => {
                    const links = [...proj.links];
                    links[idx] = { ...links[idx], label: e.target.value };
                    update(proj.id, "links", links);
                  }}
                  placeholder="Label"
                />
                <Input
                  className="h-8 text-sm"
                  value={link.url}
                  onChange={(e) => {
                    const links = [...proj.links];
                    links[idx] = { ...links[idx], url: e.target.value };
                    update(proj.id, "links", links);
                  }}
                  placeholder="https://..."
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    update(proj.id, "links", proj.links.filter((_, i) => i !== idx));
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => update(proj.id, "links", [...proj.links, { label: "", url: "" }])}
            >
              <Link className="h-3 w-3 mr-1" />
              Add link
            </Button>
          </div>
        </div>
      ))}

      <Button variant="outline" size="sm" onClick={add} className="w-full h-8 text-xs border-dashed">
        <Plus className="h-3.5 w-3.5 mr-1" />
        Add Project
      </Button>
    </div>
  );
}
