import { useState, useMemo } from "react";

const GOLD = "#CFB53B";
const BLACK = "#080808";
const DARK_BG = "#1a1a2e";
const CARD_BG = "#0f0f1a";
const GREEN = "#4ade80";
const GREEN_DIM = "rgba(74,222,128,0.1)";
const RED = "#f87171";
const RED_DIM = "rgba(248,113,113,0.1)";

function fuzzyIncludes(a, b) {
  const la = a.toLowerCase().trim();
  const lb = b.toLowerCase().trim();
  return la.includes(lb) || lb.includes(la);
}

export default function SkillsGapAnalysis({ user, selectedOrg, resumeData, employers = [] }) {
  const [targetEmployerId, setTargetEmployerId] = useState("");
  const [customCompany, setCustomCompany] = useState("");
  const [customSkills, setCustomSkills] = useState("");
  const [manualCurrentSkills, setManualCurrentSkills] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const targetEmployer = employers.find(e => String(e.id) === String(targetEmployerId)) || null;
  const hasResume = resumeData && !resumeData.error;

  const currentSkills = useMemo(() => {
    const fromResume = hasResume ? (resumeData.skills || []) : [];
    const fromOrg = selectedOrg ? (selectedOrg.skills || []) : [];
    const fromManual = manualCurrentSkills.split(",").map(s => s.trim()).filter(Boolean);
    return [...new Set([...fromResume, ...fromOrg, ...fromManual])];
  }, [hasResume, resumeData, selectedOrg, manualCurrentSkills]);

  const targetSkills = useMemo(() => {
    const fromEmployer = targetEmployer ? (targetEmployer.tags || []) : [];
    const fromCustom = customSkills.split(",").map(s => s.trim()).filter(Boolean);
    return [...new Set([...fromEmployer, ...fromCustom])];
  }, [targetEmployer, customSkills]);

  const runAnalysis = async () => {
    const companyLabel = targetEmployer?.name || customCompany.trim();
    if (!companyLabel) {
      setError("Please select an employer or enter a company name.");
      return;
    }
    if (targetSkills.length === 0) {
      setError("Please select an employer, or list a few target skills (comma-separated).");
      return;
    }
    if (currentSkills.length === 0) {
      setError("No current skills found — upload a resume, select a student org, or list your skills manually below.");
      return;
    }

    const matched = targetSkills.filter(t => currentSkills.some(c => fuzzyIncludes(t, c)));
    const gaps = targetSkills.filter(t => !currentSkills.some(c => fuzzyIncludes(t, c)));
    const readiness = Math.round((matched.length / targetSkills.length) * 100);

    setError("");
    setLoading(true);
    setResult(null);

    if (gaps.length === 0) {
      setResult({ companyLabel, matched, gaps, readiness, suggestions: [], summary: "Great news — based on what's listed, you already cover every target skill. Focus your prep on articulating specific examples for each one." });
      setLoading(false);
      return;
    }

    const systemPrompt = "You are an expert career coach for Vanderbilt University students. For each missing skill, give ONE concrete, specific, achievable way a busy student could build it in the next semester — a class, campus resource, certification, project idea, or student org role. Be specific, not generic. Return ONLY a valid JSON object with no markdown fences, no preamble, in this exact schema: {\"summary\":\"2-sentence overall readiness summary\",\"suggestions\":[{\"skill\":\"skill name\",\"suggestion\":\"one specific, concrete action\"}]}.";
    const userPrompt = `Student: ${user?.name || "a Vanderbilt student"}, ${user?.major || resumeData?.major || "N/A"}, Class of ${user?.gradYear || resumeData?.gradYear || "N/A"}.${selectedOrg ? ` Involved in ${selectedOrg.name} (${selectedOrg.mission}).` : ""}\nTarget company: ${companyLabel}${targetEmployer?.industry ? ` (${targetEmployer.industry})` : ""}.\nSkills already covered: ${matched.join(", ") || "none yet"}.\nMissing skills to address: ${gaps.join(", ")}.\n\nFor each missing skill listed, give one specific suggestion. Return ONLY the JSON schema described.`;

    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: systemPrompt, messages: [{ role: "user", content: userPrompt }], max_tokens: 900 }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const raw = (data && data.content && data.content[0] && data.content[0].text) || (data && data.text) || "";
      const clean = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
      const start = clean.indexOf("{");
      const end = clean.lastIndexOf("}");
      if (start === -1 || end === -1) throw new Error("No JSON found in response");
      const parsed = JSON.parse(clean.slice(start, end + 1));
      setResult({ companyLabel, matched, gaps, readiness, suggestions: parsed.suggestions || [], summary: parsed.summary || "" });
    } catch (e) {
      setResult({ companyLabel, matched, gaps, readiness, suggestions: [], summary: "" });
      setError("Got the gap breakdown, but couldn't generate suggestions for closing them — please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inp = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #333", background: "#0d0d1a", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  const lbl = { display: "block", fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 };

  const readinessColor = result ? (result.readiness >= 70 ? GREEN : result.readiness >= 40 ? GOLD : RED) : GOLD;

  return (
    <div style={{ minHeight: "100vh", background: DARK_BG, color: "#fff", fontFamily: "'Inter', sans-serif", padding: "32px 20px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-block", background: GOLD, color: BLACK, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", padding: "4px 12px", borderRadius: 4, marginBottom: 12 }}>AI-Powered</div>
          <h1 style={{ fontSize: 30, fontWeight: 800, margin: "0 0 8px" }}>Skills Gap Analysis</h1>
          <p style={{ color: "#888", fontSize: 15, margin: 0 }}>See exactly which skills you already have for a target employer — and how to build the rest.</p>
        </div>

        <div style={{ background: CARD_BG, border: "1px solid #222", borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>Target Employer</label>
            <select style={{ ...inp, cursor: "pointer" }} value={targetEmployerId} onChange={(e) => setTargetEmployerId(e.target.value)}>
              <option value="">Select an employer...</option>
              {employers.map(e => <option key={e.id} value={e.id}>{e.name} — {e.industry}</option>)}
            </select>
          </div>
          {!targetEmployerId && (
            <div style={{ marginBottom: 20 }}>
              <label style={lbl}>Or Enter a Company Manually <span style={{ color: "#555", fontWeight: 400 }}>(Optional)</span></label>
              <input style={inp} placeholder="e.g. a company not in the list" value={customCompany} onChange={(e) => setCustomCompany(e.target.value)} />
            </div>
          )}
          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>Additional Target Skills <span style={{ color: "#555", fontWeight: 400 }}>(Optional, comma-separated — e.g. from a job posting)</span></label>
            <input style={inp} placeholder="e.g. SQL, Financial modeling, Stakeholder management" value={customSkills} onChange={(e) => setCustomSkills(e.target.value)} />
          </div>
          <div style={{ marginBottom: 8, padding: "12px 16px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid #222" }}>
            <p style={{ fontSize: 12, color: "#888", margin: 0, lineHeight: 1.6 }}>
              Using your current skills from: {hasResume ? "your uploaded resume" : null}{hasResume && selectedOrg ? " + " : null}{selectedOrg ? `${selectedOrg.name}` : null}{!hasResume && !selectedOrg ? "nothing yet — upload a resume, select a student org, or add skills manually below" : ""}.
            </p>
          </div>
          <div style={{ margin: "16px 0 24px" }}>
            <label style={lbl}>Add Your Skills Manually <span style={{ color: "#555", fontWeight: 400 }}>(Optional, comma-separated)</span></label>
            <input style={inp} placeholder="e.g. Public speaking, Excel, Project management" value={manualCurrentSkills} onChange={(e) => setManualCurrentSkills(e.target.value)} />
          </div>
          {error && <p style={{ color: RED, fontSize: 13, marginBottom: 12 }}>{error}</p>}
          <button onClick={runAnalysis} disabled={loading} style={{ width: "100%", padding: 14, borderRadius: 10, border: "none", background: loading ? "#555" : GOLD, color: BLACK, fontSize: 15, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Analyzing..." : result ? "Re-run Analysis" : "Analyze Skills Gap"}
          </button>
        </div>

        {result && (
          <div style={{ animation: "fadeUp .4s ease both" }}>
            <div style={{ background: CARD_BG, border: "1px solid #222", borderRadius: 14, padding: 24, marginBottom: 20, textAlign: "center" }}>
              <p style={{ fontSize: 11, color: GOLD, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 8px" }}>Readiness for {result.companyLabel}</p>
              <div style={{ fontSize: 48, fontWeight: 800, color: readinessColor, lineHeight: 1 }}>{result.readiness}%</div>
              <div style={{ height: 8, background: "#222", borderRadius: 4, margin: "16px 0", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${result.readiness}%`, background: readinessColor, borderRadius: 4, transition: "width .6s ease" }} />
              </div>
              {result.summary && <p style={{ fontSize: 14, color: "#ccc", lineHeight: 1.6, margin: "12px 0 0" }}>{result.summary}</p>}
            </div>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
              <div style={{ flex: "1 1 300px", background: CARD_BG, border: "1px solid #222", borderRadius: 14, padding: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: GREEN, letterSpacing: 1.2, textTransform: "uppercase", margin: "0 0 12px" }}>✓ Skills You Have ({result.matched.length})</p>
                {result.matched.length === 0 ? (
                  <p style={{ fontSize: 13, color: "#666", margin: 0 }}>No overlap found yet.</p>
                ) : result.matched.map((s, i) => (
                  <span key={i} style={{ display: "inline-block", fontSize: 12, color: GREEN, background: GREEN_DIM, border: "1px solid rgba(74,222,128,.2)", padding: "4px 10px", borderRadius: 20, margin: "0 6px 6px 0" }}>{s}</span>
                ))}
              </div>
              <div style={{ flex: "1 1 300px", background: CARD_BG, border: "1px solid #222", borderRadius: 14, padding: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: RED, letterSpacing: 1.2, textTransform: "uppercase", margin: "0 0 12px" }}>Gaps to Close ({result.gaps.length})</p>
                {result.gaps.length === 0 ? (
                  <p style={{ fontSize: 13, color: "#666", margin: 0 }}>None — you're fully covered!</p>
                ) : result.gaps.map((s, i) => (
                  <span key={i} style={{ display: "inline-block", fontSize: 12, color: RED, background: RED_DIM, border: "1px solid rgba(248,113,113,.2)", padding: "4px 10px", borderRadius: 20, margin: "0 6px 6px 0" }}>{s}</span>
                ))}
              </div>
            </div>

            {result.suggestions.length > 0 && (
              <div style={{ background: CARD_BG, border: "1px solid #222", borderRadius: 14, padding: 24 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: 1.2, textTransform: "uppercase", margin: "0 0 16px" }}>How to Close Each Gap</p>
                {result.suggestions.map((s, i) => (
                  <div key={i} style={{ marginBottom: i === result.suggestions.length - 1 ? 0 : 16, paddingBottom: i === result.suggestions.length - 1 ? 0 : 16, borderBottom: i === result.suggestions.length - 1 ? "none" : "1px solid #222" }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>{s.skill}</p>
                    <p style={{ fontSize: 13, color: "#aaa", margin: 0, lineHeight: 1.6 }}>{s.suggestion}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
