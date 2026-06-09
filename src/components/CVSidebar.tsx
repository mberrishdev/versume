"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, Plus, LogOut, GitFork, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { signOut } from "next-auth/react";

interface Props {
  cvList: string[];
  activeCv: string;
  username: string;
}

export function CVSidebar({ cvList, activeCv, username }: Props) {
  const router = useRouter();
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const createCV = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    const { createEmptyCV } = await import("@/lib/default-cv");
    const cv = createEmptyCV(newName.trim());
    await fetch("/api/cv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cv, message: `Create ${newName}` }),
    });
    setShowNew(false);
    setNewName("");
    setCreating(false);
    router.push(`/editor?cv=${encodeURIComponent(newName.trim())}`);
    router.refresh();
  };

  return (
    <aside className="w-52 shrink-0 flex flex-col border-r border-border bg-card h-full">
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <GitFork className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground truncate">
            {username}/cv-store
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          CVs
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5"
          onClick={() => setShowNew(true)}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
        {cvList.map((name) => (
          <div key={name} className="group flex items-center gap-1">
            <Link href={`/editor?cv=${encodeURIComponent(name)}`} className="flex-1 min-w-0">
              <div
                className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                  name === activeCv
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <FileText className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate text-xs">{name}</span>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
              onClick={(e) => { e.preventDefault(); setConfirmDelete(name); }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </nav>

      <div className="p-2 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start h-8 text-xs text-muted-foreground"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-3.5 w-3.5 mr-2" />
          Sign out
        </Button>
      </div>

      <Dialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete CV</DialogTitle>
            <DialogDescription>
              This will permanently delete <strong>{confirmDelete}</strong> from your GitHub repo. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={deleting}
              onClick={async () => {
                if (!confirmDelete) return;
                setDeleting(true);
                await fetch(`/api/cv?name=${encodeURIComponent(confirmDelete)}`, { method: "DELETE" });
                localStorage.removeItem(`cv-draft:${confirmDelete}`);
                setConfirmDelete(null);
                setDeleting(false);
                if (confirmDelete === activeCv) {
                  router.push("/editor");
                }
                router.refresh();
              }}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>New CV</DialogTitle>
            <DialogDescription>
              Creates a new empty CV file in your cv-store repo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. backend, fullstack, startup"
              onKeyDown={(e) => e.key === "Enter" && createCV()}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowNew(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={createCV} disabled={creating || !newName.trim()}>
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
