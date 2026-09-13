import { useState } from "react";

const GOLD = "#CFB53B";
const BLACK = "#080808";
const DARK_BG = "#1a1a2e";
const CARD_BG = "#0f0f1a";

const TONES = [
  { value: "professional", label: "Professional" },
  { value: "enthusiastic", label: "Enthusiastic" },
  { value: "concise", label: "Concise & Direct" },
];

export default function CoverLetterGenerator({ user, selectedOrg, selectedEmployer, resumeData }) {
  const [companyName, setCompanyName] = useState(selectedEmployer?.name || "");
  const [roleTitle, setRoleTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [orgHighlight, setOrgHighlight] = useState(selectedOrg?.name || "");
  const [tone, setTone] = useState("professional");
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const generateLetter = async () => {
    if (!companyName.trim() || !roleTitle.trim()) {
      setError("Please enter both a company name and the role you're applying for.");
      return;
    }
    setError("");
    setLoading(true);
    setLetter("");
    setCopied(false);

    const hasResume = resumeData && !resumeData.error;
    const resumeContext = hasResume
      ? `\nResume details to draw from — experience: ${resumeData.experience?.join("; ") || "N/A"}, skills: ${resumeData.skills?.join(", ") || "N/A"}, GPA: ${resumeData.gpa || "N/A"}, coursework: ${resumeData.coursework?.join(", ") || "N/A"}, summary: ${resumeData.summary || "N/A"}.`
      : "";
    const orgContext = orgHighlight.trim()
      ? `\nStudent org leadership to highlight: ${orgHighlight}${selectedOrg?.mission ? ` — mission: "${selectedOrg.mission}"` : ""}${selectedOrg?.skills?.length ? `, skills developed: ${selectedOrg.skills.join(", ")}` : ""}.`
      : "";
    const jdContext = jobDescription.trim()
      ? `\nKey points from the job posting to address: ${jobDescription.trim().slice(0, 1500)}`
      : "";

    const systemPrompt = "You are an expert career coach who writes compelling, natural-sounding cover letters for Vanderbilt University students. Write a complete, ready-to-send cover letter — no placeholders like [Company Address], no markdown formatting, no explanations before or after. Just the letter body, starting with a greeting and ending with a sign-off.";
    const userPrompt = `Write a ${tone} cover letter for ${user?.name || "a Vanderbilt student"} (${user?.major || resumeData?.major || "N/A"}, Class of ${user?.gradYear || resumeData?.gradYear || "N/A"}) applying for the ${roleTitle} role at ${companyName}.${orgContext}${resumeContext}${jdContext}\n\nThe letter should connect their student organization leadership and/or resume experience directly to what ${companyName} would value in this role, be 3-4 paragraphs, and sound like a real person wrote it — specific, not generic. Sign off with "${user?.name || "[Your Name]"}".`;

    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: systemPrompt, messages: [{ role: "user", content: userPrompt }], max_tokens: 900 }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const text = (data && data.content && data.content[0] && data.content[0].text) || (data && data.text) || "";
      setLetter(text.trim());
    } catch (e) {
      setError("Something went wrong generating the letter. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      setError("Could not copy automatically — please select and copy the text manually.");
    }
  };

  const downloadLetter = () => {
    const blob = new Blob([letter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeCompany = (companyName || "cover-letter").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    a.download = `cover-letter-${safeCompany}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const inp = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #333", background: "#0d0d1a", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  const lbl = { display: "block", fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 };
  const pill = (active) => ({ padding: "6px 14px", borderRadius: 20, border: "1.5px solid " + (active ? GOLD : "#333"), background: active ? GOLD : "transparent", color: active ? BLACK : "#ccc", cursor: "pointer", fontSize: 13, fontWeight: active ? 700 : 400 });

  return (
    <div style={{ minHeight: "100vh", background: DARK_BG, color: "#fff", fontFamily: "'Inter', sans-serif", padding: "32px 20px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-block", background: GOLD, color: BLACK, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", padding: "4px 12px", borderRadius: 4, marginBottom: 12 }}>AI-Powered</div>
          <h1 style={{ fontSize: 30, fontWeight: 800, margin: "0 0 8px" }}>Cover Letter Generator</h1>
          <p style={{ color: "#888", fontSize: 15, margin: 0 }}>
            {resumeData && !resumeData.error ? "Personalized using your uploaded resume." : "Tip: upload your resume on the Resume tab first for a more personalized letter."}
          </p>
        </div>

        <div style={{ background: CARD_BG, border: "1px solid #222", borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 220px" }}>
              <label style={lbl}>Company</label>
              <input style={inp} placeholder="e.g. Goldman Sachs" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div style={{ flex: "1 1 220px" }}>
              <label style={lbl}>Role / Position</label>
              <input style={inp} placeholder="e.g. Summer Analyst" value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} />
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>Student Org / Leadership to Highlight <span style={{ color: "#555", fontWeight: 400 }}>(Optional)</span></label>
            <input style={inp} placeholder="e.g. VIC President, SGA Finance Chair..." value={orgHighlight} onChange={(e) => setOrgHighlight(e.target.value)} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>Job Description Highlights <span style={{ color: "#555", fontWeight: 400 }}>(Optional)</span></label>
            <textarea style={{ ...inp, minHeight: 80, resize: "vertical" }} placeholder="Paste a few key requirements or responsibilities from the posting..." value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={lbl}>Tone</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {TONES.map((t) => <button key={t.value} style={pill(tone === t.value)} onClick={() => setTone(t.value)}>{t.label}</button>)}
            </div>
          </div>
          {error && <p style={{ color: "#f87171", fontSize: 13, marginBottom: 12 }}>{error}</p>}
          <button onClick={generateLetter} disabled={loading} style={{ width: "100%", padding: 14, borderRadius: 10, border: "none", background: loading ? "#555" : GOLD, color: BLACK, fontSize: 15, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Writing Your Letter..." : letter ? "Regenerate Letter" : "Generate Cover Letter"}
          </button>
        </div>

        {letter && (
          <div style={{ background: CARD_BG, border: "1px solid #222", borderRadius: 14, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: 1.2, textTransform: "uppercase", margin: 0 }}>Your Cover Letter <span style={{ color: "#555", fontWeight: 400, textTransform: "none" }}>(editable)</span></p>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={copyToClipboard} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #333", background: "transparent", color: copied ? GOLD : "#ccc", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  {copied ? "Copied ✓" : "Copy"}
                </button>
                <button onClick={downloadLetter} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #333", background: "transparent", color: "#ccc", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  Download .txt
                </button>
              </div>
            </div>
            <textarea
              value={letter}
              onChange={(e) => setLetter(e.target.value)}
              style={{ ...inp, minHeight: 360, resize: "vertical", lineHeight: 1.7, fontSize: 14 }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

