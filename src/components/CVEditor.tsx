"use client";

import { useState, useCallback, useEffect } from "react";
import { CV } from "@/types/cv";
import { CVPreview } from "@/components/preview/CVPreview";
import { PersonalSection } from "@/components/editor/PersonalSection";
import { ExperienceSection } from "@/components/editor/ExperienceSection";
import { ProjectsSection } from "@/components/editor/ProjectsSection";
import { EducationSection } from "@/components/editor/EducationSection";
import { SkillsSection } from "@/components/editor/SkillsSection";
import { LanguagesSection } from "@/components/editor/LanguagesSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  Eye,
  EyeOff,
  GitFork,
  Clock,
  CheckCircle,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  initialCV: CV;
  cvName: string;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface VersionEntry {
  sha: string;
  message: string;
  date: string;
  author: string;
}

const DRAFT_KEY = (name: string) => `cv-draft:${name}`;

export function CVEditor({ initialCV, cvName }: Props) {
  const [cv, setCV] = useState<CV>(() => {
    if (typeof window === "undefined") return initialCV;
    try {
      const raw = localStorage.getItem(DRAFT_KEY(cvName));
      if (!raw) return initialCV;
      const draft = JSON.parse(raw) as CV;
      const draftTime = new Date(draft.meta.updatedAt).getTime();
      const serverTime = new Date(initialCV.meta.updatedAt).getTime();
      return draftTime > serverTime ? draft : initialCV;
    } catch {
      return initialCV;
    }
  });
  const [hasDraft, setHasDraft] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [commitMessage, setCommitMessage] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<VersionEntry[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Persist draft to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY(cvName), JSON.stringify(cv));
      const serverTime = new Date(initialCV.meta.updatedAt).getTime();
      const draftTime = new Date(cv.meta.updatedAt).getTime();
      setHasDraft(draftTime > serverTime);
    } catch {}
  }, [cv, cvName, initialCV.meta.updatedAt]);

  const update = useCallback(<K extends keyof CV>(key: K, value: CV[K]) => {
    setCV((prev) => ({
      ...prev,
      [key]: value,
      meta: { ...prev.meta, updatedAt: new Date().toISOString() },
    }));
    setSaveStatus("idle");
  }, []);

  const save = async (message?: string) => {
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv, message }),
      });
      if (!res.ok) throw new Error();
      localStorage.removeItem(DRAFT_KEY(cvName));
      setHasDraft(false);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch {
      setSaveStatus("error");
    }
  };

  const openSaveDialog = () => {
    setCommitMessage(`Update ${cvName}`);
    setShowSaveDialog(true);
  };

  const handleSave = async () => {
    setShowSaveDialog(false);
    await save(commitMessage);
  };

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch(`/api/cv/history?name=${cvName}`);
      const data = await res.json();
      setHistory(data.history || []);
    } finally {
      setLoadingHistory(false);
    }
  };

  const restoreVersion = async (sha: string) => {
    const res = await fetch(`/api/cv/history?name=${cvName}&sha=${sha}`);
    if (res.ok) {
      const restored = await res.json();
      localStorage.removeItem(DRAFT_KEY(cvName));
      setCV(restored);
      setHasDraft(false);
      setShowHistory(false);
      setSaveStatus("idle");
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        openSaveDialog();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Topbar */}
      <header className="flex items-center justify-between px-4 h-12 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-sm">Versume</span>
          <Badge variant="outline" className="text-xs font-mono">
            {cvName}
          </Badge>
          {hasDraft && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-amber-500 font-medium">unsaved draft</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-muted-foreground hover:text-destructive px-1.5"
                onClick={() => {
                  localStorage.removeItem(DRAFT_KEY(cvName));
                  setCV(initialCV);
                  setHasDraft(false);
                  setSaveStatus("idle");
                }}
              >
                Discard
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {saveStatus === "saved" && (
            <span className="flex items-center gap-1 text-xs text-emerald-500">
              <CheckCircle className="h-3.5 w-3.5" />
              Saved to GitHub
            </span>
          )}
          {saveStatus === "error" && (
            <span className="text-xs text-destructive">Save failed</span>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => {
              setShowHistory(true);
              loadHistory();
            }}
          >
            <Clock className="h-3.5 w-3.5 mr-1" />
            History
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setShowPreview((v) => !v)}
          >
            {showPreview ? (
              <>
                <EyeOff className="h-3.5 w-3.5 mr-1" />
                Hide Preview
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5 mr-1" />
                Show Preview
              </>
            )}
          </Button>

          <Button
            size="sm"
            className="h-7 text-xs"
            onClick={openSaveDialog}
            disabled={saveStatus === "saving"}
          >
            {saveStatus === "saving" ? (
              <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5 mr-1" />
            )}
            <GitFork className="h-3.5 w-3.5 mr-1" />
            Save
          </Button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor Panel */}
        <div
          className={`overflow-y-auto border-r border-border bg-background ${
            showPreview ? "w-[420px] shrink-0" : "flex-1"
          }`}
        >
          <div className="p-4">
            <Tabs defaultValue="personal">
              <TabsList className="w-full grid grid-cols-3 mb-4 h-8">
                <TabsTrigger value="personal" className="text-xs">Personal</TabsTrigger>
                <TabsTrigger value="experience" className="text-xs">Experience</TabsTrigger>
                <TabsTrigger value="projects" className="text-xs">Projects</TabsTrigger>
              </TabsList>
              <TabsList className="w-full grid grid-cols-3 mb-4 h-8">
                <TabsTrigger value="education" className="text-xs">Education</TabsTrigger>
                <TabsTrigger value="skills" className="text-xs">Skills</TabsTrigger>
                <TabsTrigger value="languages" className="text-xs">Languages</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="mt-0 space-y-4">
                <SectionHeader label="Personal Info" />
                <PersonalSection
                  data={cv.personal}
                  onChange={(v) => update("personal", v)}
                />
                <SectionHeader label="Summary" />
                <Textarea
                  className="text-sm resize-none"
                  rows={5}
                  value={cv.summary}
                  onChange={(e) => update("summary", e.target.value)}
                  placeholder="Professional summary..."
                />
              </TabsContent>

              <TabsContent value="experience" className="mt-0">
                <SectionHeader label="Experience" />
                <ExperienceSection
                  data={cv.experience}
                  onChange={(v) => update("experience", v)}
                />
              </TabsContent>

              <TabsContent value="projects" className="mt-0">
                <SectionHeader label="Projects" />
                <ProjectsSection
                  data={cv.projects}
                  onChange={(v) => update("projects", v)}
                />
              </TabsContent>

              <TabsContent value="education" className="mt-0">
                <SectionHeader label="Education" />
                <EducationSection
                  data={cv.education}
                  onChange={(v) => update("education", v)}
                />
              </TabsContent>

              <TabsContent value="skills" className="mt-0">
                <SectionHeader label="Core Skills" />
                <SkillsSection
                  data={cv.skills}
                  onChange={(v) => update("skills", v)}
                />
              </TabsContent>

              <TabsContent value="languages" className="mt-0">
                <SectionHeader label="Languages" />
                <LanguagesSection
                  data={cv.languages}
                  onChange={(v) => update("languages", v)}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-zinc-900 p-6">
            <div className="shadow-xl rounded-sm overflow-hidden">
              <CVPreview cv={cv} />
            </div>
          </div>
        )}
      </div>

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save to GitHub</DialogTitle>
            <DialogDescription>
              This will commit your CV to your <code>cv-store</code> repository.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Commit message</Label>
              <Input
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="Describe what changed..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                <GitFork className="h-3.5 w-3.5 mr-1" />
                Commit & Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Version History</DialogTitle>
            <DialogDescription>
              All commits for <code>{cvName}.json</code> in your GitHub repo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-80 overflow-y-auto pt-2">
            {loadingHistory && (
              <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            )}
            {!loadingHistory && history.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No history yet. Save your CV to create the first version.
              </p>
            )}
            {history.map((v) => (
              <div
                key={v.sha}
                className="flex items-center justify-between p-3 rounded-md border border-border hover:bg-muted/50 group"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{v.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(v.date).toLocaleString()} · {v.sha.slice(0, 7)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs shrink-0 ml-2 opacity-0 group-hover:opacity-100"
                  onClick={() => restoreVersion(v.sha)}
                >
                  Restore
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
      {label}
    </h3>
  );
}
