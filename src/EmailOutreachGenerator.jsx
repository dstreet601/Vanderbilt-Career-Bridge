import { useState } from "react";

const GOLD = "#CFB53B";
const BLACK = "#080808";
const DARK_BG = "#1a1a2e";
const CARD_BG = "#0f0f1a";

const PURPOSES = [
  { value: "informational", label: "Informational Interview" },
  { value: "networking", label: "Networking Intro" },
  { value: "cold", label: "Cold Outreach" },
  { value: "referral", label: "Referral Request" },
  { value: "followup", label: "Thank You / Follow-Up" },
];

const TONES = [
  { value: "professional", label: "Professional" },
  { value: "warm", label: "Warm & Personal" },
  { value: "concise", label: "Concise" },
];

export default function EmailOutreachGenerator({ user, selectedOrg, selectedEmployer, resumeData }) {
  const [purpose, setPurpose] = useState("informational");
  const [companyName, setCompanyName] = useState(selectedEmployer?.name || "");
  const [recipientInfo, setRecipientInfo] = useState("");
  const [connectionPoint, setConnectionPoint] = useState("");
  const [orgHighlight, setOrgHighlight] = useState(selectedOrg?.name || "");
  const [tone, setTone] = useState("professional");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const purposeLabel = PURPOSES.find(p => p.value === purpose)?.label || "outreach";

  const generateEmail = async () => {
    if (!companyName.trim()) {
      setError("Please enter the company you're reaching out to.");
      return;
    }
    setError("");
    setLoading(true);
    setSubject("");
    setBody("");
    setCopied("");

    const hasResume = resumeData && !resumeData.error;
    const resumeContext = hasResume
      ? `\nResume context — experience: ${resumeData.experience?.join("; ") || "N/A"}, skills: ${resumeData.skills?.join(", ") || "N/A"}, summary: ${resumeData.summary || "N/A"}.`
      : "";
    const orgContext = orgHighlight.trim()
      ? `\nStudent org leadership to mention: ${orgHighlight}${selectedOrg?.mission ? ` — mission: "${selectedOrg.mission}"` : ""}${selectedOrg?.skills?.length ? `, skills developed: ${selectedOrg.skills.join(", ")}` : ""}.`
      : "";
    const senderName = user?.name || "[Your Name]";
    const recipientLine = recipientInfo.trim()
      ? `RECIPIENT (who this email is addressed to — greet them by name, but do NOT sign the email as them; they are not the sender): ${recipientInfo.trim()}, at ${companyName}.`
      : `RECIPIENT (no specific person named — address it generically, e.g. "Hi there" or to the team): someone at ${companyName}.`;
    const connectionContext = connectionPoint.trim() ? `\nConnection point to reference: ${connectionPoint.trim()}.` : "";

    const systemPrompt = "You are an expert career coach who writes short, effective networking and outreach emails for Vanderbilt University students. Emails should be genuine, specific, and respectful of the recipient's time — never generic or salesy. CRITICAL: every email is written FROM the student (the sender) TO the recipient. Always sign off using the SENDER's name. NEVER sign off using the recipient's name, even if the recipient's name appears elsewhere in the prompt. Return ONLY a valid JSON object with no markdown fences, no preamble, in this exact schema: {\"subject\":\"short subject line\",\"body\":\"full email body including greeting and sign-off\"}.";
    const userPrompt = `SENDER (write this email as this person, and sign off with their name — this is who is sending the email, not who is receiving it): ${senderName}, ${user?.major || resumeData?.major || "N/A"}, Class of ${user?.gradYear || resumeData?.gradYear || "N/A"}.\n${recipientLine}${connectionContext}${orgContext}${resumeContext}\n\nWrite a ${tone} ${purposeLabel.toLowerCase()} email. Keep the body under 150 words and make a clear, specific ask appropriate for a "${purposeLabel}" email. End the email with a sign-off using the SENDER's name, "${senderName}" — do not, under any circumstances, sign off using the recipient's name. Return ONLY the JSON schema described.`;

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
      setSubject(parsed.subject || "");
      setBody(parsed.body || "");
    } catch (e) {
      setError("Something went wrong generating the email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(""), 2000);
    } catch (e) {
      setError("Could not copy automatically — please select and copy the text manually.");
    }
  };

  const downloadEmail = () => {
    const blob = new Blob([`Subject: ${subject}\n\n${body}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeCompany = (companyName || "outreach-email").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    a.download = `outreach-email-${safeCompany}.txt`;
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
          <h1 style={{ fontSize: 30, fontWeight: 800, margin: "0 0 8px" }}>Email Outreach Generator</h1>
          <p style={{ color: "#888", fontSize: 15, margin: 0 }}>
            {resumeData && !resumeData.error ? "Personalized using your uploaded resume." : "Tip: upload your resume on the Resume tab first for a more personalized email."}
          </p>
        </div>

        <div style={{ background: CARD_BG, border: "1px solid #222", borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>Purpose</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {PURPOSES.map((p) => <button key={p.value} style={pill(purpose === p.value)} onClick={() => setPurpose(p.value)}>{p.label}</button>)}
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 220px" }}>
              <label style={lbl}>Company</label>
              <input style={inp} placeholder="e.g. Goldman Sachs" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div style={{ flex: "1 1 220px" }}>
              <label style={lbl}>Recipient <span style={{ color: "#555", fontWeight: 400 }}>(Optional)</span></label>
              <input style={inp} placeholder="e.g. Jane Smith, Campus Recruiter" value={recipientInfo} onChange={(e) => setRecipientInfo(e.target.value)} />
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>Connection Point <span style={{ color: "#555", fontWeight: 400 }}>(Optional)</span></label>
            <input style={inp} placeholder="e.g. Met at the Vanderbilt career fair, alum referred me..." value={connectionPoint} onChange={(e) => setConnectionPoint(e.target.value)} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>Student Org / Leadership to Mention <span style={{ color: "#555", fontWeight: 400 }}>(Optional)</span></label>
            <input style={inp} placeholder="e.g. VIC President, SGA Finance Chair..." value={orgHighlight} onChange={(e) => setOrgHighlight(e.target.value)} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={lbl}>Tone</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {TONES.map((t) => <button key={t.value} style={pill(tone === t.value)} onClick={() => setTone(t.value)}>{t.label}</button>)}
            </div>
          </div>
          {error && <p style={{ color: "#f87171", fontSize: 13, marginBottom: 12 }}>{error}</p>}
          <button onClick={generateEmail} disabled={loading} style={{ width: "100%", padding: 14, borderRadius: 10, border: "none", background: loading ? "#555" : GOLD, color: BLACK, fontSize: 15, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Writing Your Email..." : body ? "Regenerate Email" : "Generate Email"}
          </button>
        </div>

        {body && (
          <div style={{ background: CARD_BG, border: "1px solid #222", borderRadius: 14, padding: 24 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={lbl}>Subject</label>
                <button onClick={() => copy(subject, "subject")} style={{ padding: "4px 12px", borderRadius: 6, border: "1px solid #333", background: "transparent", color: copied === "subject" ? GOLD : "#ccc", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                  {copied === "subject" ? "Copied ✓" : "Copy"}
                </button>
              </div>
              <input style={inp} value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: 1.2, textTransform: "uppercase", margin: 0 }}>Body <span style={{ color: "#555", fontWeight: 400, textTransform: "none" }}>(editable)</span></p>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => copy(`Subject: ${subject}\n\n${body}`, "full")} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #333", background: "transparent", color: copied === "full" ? GOLD : "#ccc", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  {copied === "full" ? "Copied ✓" : "Copy Full Email"}
                </button>
                <button onClick={downloadEmail} style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #333", background: "transparent", color: "#ccc", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                  Download .txt
                </button>
              </div>
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              style={{ ...inp, minHeight: 240, resize: "vertical", lineHeight: 1.7, fontSize: 14 }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
