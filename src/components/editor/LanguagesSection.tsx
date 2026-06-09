"use client";

import { CVLanguage } from "@/types/cv";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface Props {
  data: CVLanguage[];
  onChange: (data: CVLanguage[]) => void;
}

export function LanguagesSection({ data, onChange }: Props) {
  const add = () => onChange([...data, { id: uuidv4(), name: "", level: "" }]);
  const remove = (id: string) => onChange(data.filter((l) => l.id !== id));
  const update = (id: string, field: keyof CVLanguage, value: string) =>
    onChange(data.map((l) => (l.id === id ? { ...l, [field]: value } : l)));

  return (
    <div className="space-y-2">
      {data.map((lang) => (
        <div key={lang.id} className="flex gap-2">
          <div className="flex-1 space-y-1">
            <Label className="text-xs text-muted-foreground">Language</Label>
            <Input
              className="h-8 text-sm"
              value={lang.name}
              onChange={(e) => update(lang.id, "name", e.target.value)}
              placeholder="English"
            />
          </div>
          <div className="w-36 space-y-1">
            <Label className="text-xs text-muted-foreground">Level</Label>
            <Input
              className="h-8 text-sm"
              value={lang.level}
              onChange={(e) => update(lang.id, "level", e.target.value)}
              placeholder="Native / Fluent"
            />
          </div>
          <div className="pt-6">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => remove(lang.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ))}

      <Button variant="outline" size="sm" onClick={add} className="w-full h-8 text-xs border-dashed mt-2">
        <Plus className="h-3.5 w-3.5 mr-1" />
        Add Language
      </Button>
    </div>
  );
}
