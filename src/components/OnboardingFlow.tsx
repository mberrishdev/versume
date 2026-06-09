"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MIKHEIL_CV } from "@/lib/default-cv";
import { CV_TEMPLATES, CVTemplate } from "@/lib/cv-templates";
import { CVPreview } from "@/components/preview/CVPreview";

export function OnboardingFlow({ username }: { username: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [startChoice, setStartChoice] = useState<StartChoice>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<CVTemplate | null>(null);
  const [cvName, setCvName] = useState("default");
  const [loading, setLoading] = useState(false);

  const totalSteps = startChoice === "template" ? 4 : 3;

  const handleComplete = async () => {
    setLoading(true);
    const name = cvName.trim() || "default";
    let baseCV: ReturnType<CVTemplate["build"]>;
    if (startChoice === "sample") {
      baseCV = { ...MIKHEIL_CV, meta: { ...MIKHEIL_CV.meta, name } };
    } else if (startChoice === "template" && selectedTemplate) {
      baseCV = selectedTemplate.build(name);
    } else {
      baseCV = { ...MIKHEIL_CV, meta: { ...MIKHEIL_CV.meta, name } };
    }
    await fetch("/api/cv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cv: baseCV, message: `Create ${name}` }),
    });
    router.push(`/editor?cv=${encodeURIComponent(name)}`);
  };

  const dotCount = startChoice === "template" ? 4 : 3;
  const StepDots = () => (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 32 }}>
      {Array.from({ length: dotCount }).map((_, i) => {
        const dotStep = i + 1;
        return (
          <div key={i} style={{
            width: dotStep === step ? 24 : 6, height: 6, borderRadius: 3,
            background: dotStep <= step ? "var(--v-accent)" : "var(--v-bg-3)",
            transition: "all 0.3s ease",
          }} />
        );
      })}
    </div>
  );

  const isTemplateStep = step === 3 && startChoice === "template";
  const cardStyle: React.CSSProperties = {
    background: "var(--v-bg-1)", border: "1px solid var(--v-border)",
    borderRadius: 16, padding: "36px 40px",
    width: isTemplateStep ? 820 : 560,
    animation: "fadeIn 0.3s ease",
    transition: "width 0.3s ease",
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--v-bg-0)",
    }}>
      <div style={cardStyle}>
        <StepDots />

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 44, height: 44, borderRadius: 11, background: "var(--v-accent)",
              margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center",
              color: "#0A0A0B", fontWeight: 800, fontSize: 20, fontFamily: "var(--font-mono)",
            }}>V</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--v-text-1)", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
              Welcome, {username}
            </h2>
            <p style={{ fontSize: 14, color: "var(--v-text-2)", margin: "0 0 6px", lineHeight: 1.55 }}>
              We&apos;ll create a private repo called{" "}
              <code style={{
                fontFamily: "var(--font-mono)", color: "var(--v-accent)",
                background: "var(--v-accent-muted)", padding: "1px 6px", borderRadius: 3, fontSize: 13,
              }}>cv-store</code>{" "}
              to store your CV data.
            </p>
            <p style={{ fontSize: 13, color: "var(--v-text-3)", margin: "0 0 32px", lineHeight: 1.5 }}>
              Every change becomes a git commit. Your resume gets full version history.
            </p>
            <PrimaryBtn onClick={() => setStep(2)}>Set up my repo →</PrimaryBtn>
          </div>
        )}

        {/* Step 2: Choose start type */}
        {step === 2 && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--v-text-1)", margin: "0 0 4px", letterSpacing: "-0.02em", textAlign: "center" }}>
              How do you want to start?
            </h2>
            <p style={{ fontSize: 13, color: "var(--v-text-3)", margin: "0 0 24px", textAlign: "center" }}>
              You can always change this later.
            </p>
            <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
              <StartCard
                id="template"
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/>
                    <rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>
                  </svg>
                }
                title="Use a Template"
                desc="Pick from 8 role-specific templates with realistic starter content"
                selected={startChoice === "template"}
                onSelect={setStartChoice}
              />
              <StartCard
                id="sample"
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                    <line x1="10" y1="9" x2="8" y2="9"/>
                  </svg>
                }
                title="Sample CV"
                desc="A fully filled example to explore all the editor features"
                selected={startChoice === "sample"}
                onSelect={setStartChoice}
              />
            </div>
            <PrimaryBtn
              onClick={() => {
                if (startChoice === "template") setStep(3);
                else if (startChoice === "sample") setStep(3);
              }}
              disabled={!startChoice}
            >
              Continue →
            </PrimaryBtn>
          </div>
        )}

        {/* Step 3a: Template picker with live preview */}
        {step === 3 && startChoice === "template" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--v-text-1)", margin: "0 0 4px", letterSpacing: "-0.02em", textAlign: "center" }}>
              Pick a template
            </h2>
            <p style={{ fontSize: 13, color: "var(--v-text-3)", margin: "0 0 20px", textAlign: "center" }}>
              All placeholder content — edit everything in the editor.
            </p>
            <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
              {/* Template list */}
              <div style={{
                display: "flex", flexDirection: "column", gap: 6,
                width: 220, flexShrink: 0,
                maxHeight: 380, overflowY: "auto",
              }}>
                {CV_TEMPLATES.map((tpl) => (
                  <TemplateCard
                    key={tpl.id}
                    template={tpl}
                    selected={selectedTemplate?.id === tpl.id}
                    onSelect={setSelectedTemplate}
                  />
                ))}
              </div>

              {/* Preview panel */}
              <div style={{
                flex: 1, minWidth: 0,
                background: "var(--v-bg-0)", border: "1px solid var(--v-border)",
                borderRadius: 10, overflow: "hidden",
                maxHeight: 380, position: "relative",
              }}>
                {selectedTemplate ? (
                  <div style={{ overflow: "auto", maxHeight: 380 }}>
                    <div style={{
                      transform: "scale(0.52)", transformOrigin: "top left",
                      width: `${100 / 0.52}%`,
                    }}>
                      <CVPreview cv={selectedTemplate.build("preview")} />
                    </div>
                  </div>
                ) : (
                  <div style={{
                    height: "100%", display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: 10,
                    color: "var(--v-text-3)", minHeight: 380,
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    <span style={{ fontSize: 12 }}>Select a template to preview</span>
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <GhostBtn onClick={() => setStep(2)}>← Back</GhostBtn>
              <div style={{ flex: 1 }}>
                <PrimaryBtn onClick={() => setStep(4)} disabled={!selectedTemplate}>
                  Use this template →
                </PrimaryBtn>
              </div>
            </div>
          </div>
        )}

        {/* Step 3b / Step 4: Name your CV */}
        {((step === 3 && startChoice === "sample") || (step === 4 && startChoice === "template")) && (
          <div style={{ textAlign: "center", animation: "fadeIn 0.3s ease" }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--v-text-1)", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
              Name your first CV
            </h2>
            <p style={{ fontSize: 13, color: "var(--v-text-3)", margin: "0 0 24px" }}>
              Create multiple variants later —{" "}
              <code style={{ fontFamily: "var(--font-mono)", color: "var(--v-text-2)", fontSize: 12 }}>backend</code>,{" "}
              <code style={{ fontFamily: "var(--font-mono)", color: "var(--v-text-2)", fontSize: 12 }}>startup</code>
            </p>
            {selectedTemplate && (
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20,
                background: "var(--v-accent-muted)", border: "1px solid rgba(245,158,11,0.2)",
                borderRadius: 6, padding: "5px 12px",
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--v-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span style={{ fontSize: 12, color: "var(--v-accent)", fontWeight: 500 }}>
                  {selectedTemplate.label} template
                </span>
              </div>
            )}
            <div style={{ marginBottom: 24, textAlign: "left" }}>
              <label style={{ display: "block", fontSize: 11, color: "var(--v-text-2)", fontWeight: 500, letterSpacing: "0.02em", textTransform: "uppercase", marginBottom: 6 }}>CV name</label>
              <input
                value={cvName}
                onChange={e => setCvName(e.target.value)}
                placeholder="default"
                onKeyDown={e => e.key === "Enter" && !loading && handleComplete()}
                style={{
                  width: "100%", background: "var(--v-bg-0)", color: "var(--v-text-1)",
                  border: "1px solid var(--v-border)", borderRadius: 6,
                  padding: "10px 14px", fontSize: 15, fontFamily: "var(--font-sans)",
                  outline: "none", textAlign: "center", boxSizing: "border-box",
                }}
                autoFocus
              />
            </div>
            <PrimaryBtn onClick={handleComplete} disabled={loading}>
              {loading ? "Setting up…" : "Open editor →"}
            </PrimaryBtn>
          </div>
        )}
      </div>
    </div>
  );
}

function StartCard({ id, icon, title, desc, selected, onSelect }: {
  id: string; icon: React.ReactNode; title: string; desc: string;
  selected: boolean; onSelect: (id: StartChoice) => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={() => onSelect(id as StartChoice)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 10, padding: "20px 16px", flex: 1,
        background: selected ? "var(--v-accent-muted)" : hov ? "var(--v-bg-3)" : "var(--v-bg-2)",
        border: `1px solid ${selected ? "var(--v-accent)" : hov ? "var(--v-border-hover)" : "var(--v-border)"}`,
        borderRadius: 10, cursor: "pointer", transition: "all 0.15s ease",
        fontFamily: "var(--font-sans)",
        color: selected ? "var(--v-accent)" : "var(--v-text-3)",
      }}
    >
      {icon}
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--v-text-1)", marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 12, color: "var(--v-text-3)", textAlign: "center", lineHeight: 1.4 }}>{desc}</div>
      </div>
    </button>
  );
}

function TemplateCard({ template, selected, onSelect }: {
  template: CVTemplate; selected: boolean; onSelect: (t: CVTemplate) => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={() => onSelect(template)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 8, padding: "10px 12px", textAlign: "left", width: "100%",
        background: selected ? "var(--v-accent-muted)" : hov ? "var(--v-bg-3)" : "var(--v-bg-2)",
        border: `1px solid ${selected ? "var(--v-accent)" : hov ? "var(--v-border-hover)" : "var(--v-border)"}`,
        borderRadius: 8, cursor: "pointer", transition: "all 0.15s ease",
        fontFamily: "var(--font-sans)", flexShrink: 0,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--v-text-1)", marginBottom: 1 }}>{template.label}</div>
        <div style={{ fontSize: 11, color: "var(--v-text-3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{template.role}</div>
      </div>
      {selected && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--v-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      )}
    </button>
  );
}

type StartChoice = "template" | "sample" | null;

function GhostBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "11px 20px", fontSize: 14, fontWeight: 500,
        background: hov ? "var(--v-bg-3)" : "transparent",
        color: "var(--v-text-2)", border: "1px solid var(--v-border)", borderRadius: 8,
        cursor: "pointer", fontFamily: "var(--font-sans)", transition: "all 0.15s ease",
      }}
    >{children}</button>
  );
}

function PrimaryBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        padding: "11px 24px", fontSize: 15, fontWeight: 600,
        background: disabled ? "rgba(245,158,11,0.4)" : hov ? "var(--v-accent-hover)" : "var(--v-accent)",
        color: "#0A0A0B", border: "none", borderRadius: 8,
        cursor: disabled ? "default" : "pointer",
        fontFamily: "var(--font-sans)", letterSpacing: "-0.01em",
        transition: "all 0.15s ease",
      }}
    >{children}</button>
  );
}
