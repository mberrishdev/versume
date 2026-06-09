"use client";

import { CVProject } from "@/types/cv";
import { v4 as uuidv4 } from "uuid";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy,
  useSortable, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  data: CVProject[];
  onChange: (data: CVProject[]) => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%", background: "var(--v-bg-0)", color: "var(--v-text-1)",
  border: "1px solid var(--v-border)", borderRadius: 6,
  padding: "6px 10px", fontSize: 13, fontFamily: "var(--font-sans)",
  outline: "none", boxSizing: "border-box", transition: "border-color 0.15s ease",
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ display: "block", fontSize: 10, fontWeight: 500, color: "var(--v-text-2)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
      {children}
    </label>
  );
}

function SortableProject({ proj, index, onUpdate, onRemove }: {
  proj: CVProject; index: number;
  onUpdate: (id: string, field: keyof CVProject, value: unknown) => void;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: proj.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: "var(--v-bg-2)", border: "1px solid var(--v-border)",
    borderRadius: 10, padding: 14, marginBottom: 0,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Drag handle */}
          <button
            {...attributes} {...listeners}
            style={{
              width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center",
              background: "transparent", border: "none", cursor: "grab", color: "var(--v-text-3)",
              borderRadius: 3, padding: 0, touchAction: "none",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
          </button>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--v-text-1)" }}>
            {proj.name || `Project ${index + 1}`}
          </span>
        </div>
        <button
          onClick={() => onRemove(proj.id)}
          style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer", color: "var(--v-text-3)", borderRadius: 4, transition: "color 0.12s ease" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#EF4444"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--v-text-3)"}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div>
          <FieldLabel>Project Name</FieldLabel>
          <input value={proj.name} onChange={e => onUpdate(proj.id, "name", e.target.value)} style={inputStyle}
            onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-accent)"}
            onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border)"} />
        </div>
        <div>
          <FieldLabel>Role</FieldLabel>
          <input value={proj.role} onChange={e => onUpdate(proj.id, "role", e.target.value)} style={inputStyle}
            onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-accent)"}
            onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border)"} />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <FieldLabel>Category</FieldLabel>
          <input value={proj.category} onChange={e => onUpdate(proj.id, "category", e.target.value)} placeholder="Product & SaaS Solutions" style={inputStyle}
            onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-accent)"}
            onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border)"} />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <FieldLabel>Description</FieldLabel>
          <textarea
            rows={2} value={proj.description}
            onChange={e => { onUpdate(proj.id, "description", e.target.value); e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; }}
            ref={el => { if (el) { el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; } }}
            style={{ ...inputStyle, resize: "none", lineHeight: 1.5, minHeight: 60, overflow: "hidden" }}
            onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-accent)"}
            onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border)"}
          />
        </div>
      </div>

      {/* Links */}
      <div style={{ marginTop: 8 }}>
        <FieldLabel>Links</FieldLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {proj.links.map((link, idx) => (
            <div key={idx} style={{ display: "flex", gap: 6 }}>
              <input
                value={link.label} placeholder="Label"
                onChange={e => { const links = [...proj.links]; links[idx] = { ...links[idx], label: e.target.value }; onUpdate(proj.id, "links", links); }}
                style={{ ...inputStyle, width: 90, flexShrink: 0 }}
                onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-accent)"}
                onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border)"}
              />
              <input
                value={link.url} placeholder="https://..."
                onChange={e => { const links = [...proj.links]; links[idx] = { ...links[idx], url: e.target.value }; onUpdate(proj.id, "links", links); }}
                style={inputStyle}
                onFocus={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-accent)"}
                onBlur={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border)"}
              />
              <button
                onClick={() => onUpdate(proj.id, "links", proj.links.filter((_, i) => i !== idx))}
                style={{ width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer", color: "var(--v-text-3)", borderRadius: 4, flexShrink: 0, transition: "color 0.12s ease" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#EF4444"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--v-text-3)"}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          ))}
          <button
            onClick={() => onUpdate(proj.id, "links", [...proj.links, { label: "", url: "" }])}
            style={{ alignSelf: "flex-start", fontSize: 11, color: "var(--v-text-3)", background: "transparent", border: "1px dashed var(--v-border)", borderRadius: 5, padding: "3px 10px", cursor: "pointer", fontFamily: "var(--font-sans)", transition: "all 0.12s ease" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--v-text-2)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border-hover)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--v-text-3)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border)"; }}
          >+ Add link</button>
        </div>
      </div>
    </div>
  );
}

export function ProjectsSection({ data, onChange }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = data.findIndex(p => p.id === active.id);
      const newIndex = data.findIndex(p => p.id === over.id);
      onChange(arrayMove(data, oldIndex, newIndex));
    }
  };

  const add = () => onChange([...data, { id: uuidv4(), category: "", name: "", role: "", description: "", links: [] }]);
  const remove = (id: string) => onChange(data.filter(p => p.id !== id));
  const update = (id: string, field: keyof CVProject, value: unknown) =>
    onChange(data.map(p => p.id === id ? { ...p, [field]: value } : p));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={data.map(p => p.id)} strategy={verticalListSortingStrategy}>
          {data.map((proj, i) => (
            <SortableProject key={proj.id} proj={proj} index={i} onUpdate={update} onRemove={remove} />
          ))}
        </SortableContext>
      </DndContext>

      <button
        onClick={add}
        style={{ width: "100%", padding: "8px", fontSize: 13, color: "var(--v-text-3)", background: "transparent", border: "1px dashed var(--v-border)", borderRadius: 8, cursor: "pointer", fontFamily: "var(--font-sans)", transition: "all 0.12s ease" }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--v-text-2)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border-hover)"; (e.currentTarget as HTMLElement).style.background = "var(--v-bg-2)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--v-text-3)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--v-border)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
      >+ Add Project</button>
    </div>
  );
}
