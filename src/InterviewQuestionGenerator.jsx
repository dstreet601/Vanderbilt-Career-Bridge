import { useState } from "react";

const GOLD = "#CFB53B";
const BLACK = "#080808";
const DARK_BG = "#1a1a2e";
const CARD_BG = "#0f0f1a";

const INTERVIEW_TYPES = [
  { value: "behavioral", label: "Behavioral" },
  { value: "technical", label: "Technical" },
  { value: "case", label: "Case / Consulting" },
  { value: "fit", label: "Culture & Fit" },
  { value: "situational", label: "Situational" },
];

const INDUSTRIES = [
  "Investment Banking",
  "Consulting",
  "Technology / Software",
  "Healthcare",
  "Marketing & Advertising",
  "Non-Profit / Government",
  "Law",
  "Real Estate",
  "Asset Management",
  "General / Any Industry",
];

const EXPERIENCE_LEVELS = [
  { value: "internship", label: "Internship" },
  { value: "entry", label: "Entry-Level (0-2 yrs)" },
  { value: "mid", label: "Mid-Level (2-5 yrs)" },
  { value: "senior", label: "Senior / Leadership" },
];

export default function InterviewQuestionGenerator() {
  const [role, setRole] = useState("");
  const [industry, setIndustry] = useState("General / Any Industry");
  const [interviewType, setInterviewType] = useState("behavioral");
  const [experienceLevel, setExperienceLevel] = useState("internship");
  const [orgContext, setOrgContext] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [practiceMode, setPracticeMode] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [activePracticeQ, setActivePracticeQ] = useState(null);

  const generateQuestions = async () => {
    if (!role.trim()) { setError("Please enter the role you are interviewing for."); return; }
    setError(""); setLoading(true); setQuestions([]); setExpandedIdx(null);
    const systemPrompt = "You are an expert career coach for Vanderbilt University students preparing for competitive interviews. Always return a valid JSON array and nothing else.";
    const userPrompt = "Generate 6 " + interviewType + " interview questions for a Vanderbilt student applying to a " + experienceLevel + " " + role + " role in the " + industry + " industry." + (orgContext ? " The student is involved in: " + orgContext + "." : "") + "\n\nReturn ONLY a JSON array with exactly 6 objects each having:\n- question: the interview question\n- why: one sentence on why interviewers ask this\n- tip: 2-3 sentences on how to answer using STAR or relevant framework\n- example_opener: one strong opening sentence\n\nNo markdown, no extra text, just the raw JSON array.";
    try {
      const res = await fetch("/api/claude", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ system: systemPrompt, messages: [{ role: "user", content: userPrompt }], max_tokens: 2000 }) });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const raw = data?.content?.[0]?.text || data?.text || data?.completion || "";
      const cleaned = raw.replace(/```json|```/g, "").trim();
      setQuestions(JSON.parse(cleaned));
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  const getFeedback = async (question) => {
    if (!userAnswer.trim()) return;
    setFeedbackLoading(true); setFeedback("");
    try {
      const res = await fetch("/api/claude", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ system: "You are an expert Vanderbilt career coach giving concise, actionable interview feedback.", messages: [{ role: "user", content: "Question: \"" + question + "\"\n\nAnswer: \"" + userAnswer + "\"\n\nGive feedback in 3 sections:\n1. Strengths (1-2 bullets)\n2. Improve (1-2 bullets)\n3. Revised opener (one better opening sentence)\n\nUnder 200 words." }], max_tokens: 400 }) });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setFeedback(data?.content?.[0]?.text || data?.text || "");
    } catch { setFeedback("Error getting feedback. Please try again."); }
    finally { setFeedbackLoading(false); }
  };

  const startPractice = (idx) => { setActivePracticeQ(idx); setUserAnswer(""); setFeedback(""); setPracticeMode(true); setExpandedIdx(null); };
  const stopPractice = () => { setPracticeMode(false); setActivePracticeQ(null); setUserAnswer(""); setFeedback(""); };

  const pill = (active) => ({ padding: "6px 14px", borderRadius: 20, border: "1.5px solid " + (active ? GOLD : "#333"), background: active ? GOLD : "transparent", color: active ? BLACK : "#ccc", cursor: "pointer", fontSize: 13, fontWeight: active ? 700 : 400 });
  const input = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #333", background: "#0d0d1a", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" };
  const label = { display: "block", fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 };

  return (
    <div style={{ minHeight: "100vh", background: DARK_BG, color: "#fff", fontFamily: "'Inter', sans-serif", padding: "32px 20px" }}>
      <div style={{ maxWidth: 780, margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-block", background: GOLD, color: BLACK, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", padding: "4px 12px", borderRadius: 4, marginBottom: 12 }}>AI-Powered</div>
          <h1 style={{ fontSize: 30, fontWeight: 800, margin: "0 0 8px" }}>Interview Question Generator</h1>
          <p style={{ color: "#888", fontSize: 15, margin: 0 }}>Generate tailored questions with expert tips — then practice with live AI feedback.</p>
        </div>

        <div style={{ background: CARD_BG, border: "1px solid #222", borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <label style={label}>Role / Position</label>
            <input style={input} placeholder="e.g. Investment Banking Analyst, Product Manager..." value={role} onChange={(e) => setRole(e.target.value)} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={label}>Industry</label>
            <select style={{ ...input, cursor: "pointer" }} value={industry} onChange={(e) => setIndustry(e.target.value)}>
              {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={label}>Interview Type</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {INTERVIEW_TYPES.map((t) => <button key={t.value} style={pill(interviewType === t.value)} onClick={() => setInterviewType(t.value)}>{t.label}</button>)}
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={label}>Experience Level</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {EXPERIENCE_LEVELS.map((l) => <button key={l.value} style={pill(experienceLevel === l.value)} onClick={() => setExperienceLevel(l.value)}>{l.label}</button>)}
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={label}>Student Org / Leadership <span style={{ color: "#555", fontWeight: 400 }}>(Optional)</span></label>
            <input style={input} placeholder="e.g. VIC President, SGA Finance Chair..." value={orgContext} onChange={(e) => setOrgContext(e.target.value)} />
          </div>
          {error && <p style={{ color: "#f87171", fontSize: 13, marginBottom: 12 }}>{error}</p>}
          <button onClick={generateQuestions} disabled={loading}
            style={{ width: "100%", padding: 14, borderRadius: 10, border: "none", background: loading ? "#555" : GOLD, color: BLACK, fontSize: 15, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Generating Questions..." : "Generate Interview Questions"}
          </button>
        </div>

        {practiceMode && activePracticeQ !== null && questions[activePracticeQ] && (
          <div style={{ background: "#0a0a18", border: "2px solid " + GOLD, borderRadius: 14, padding: 24, marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ background: GOLD, color: BLACK, fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", padding: "3px 10px", borderRadius: 4 }}>Practice Mode</span>
              <button onClick={stopPractice} style={{ background: "transparent", border: "1px solid #444", color: "#aaa", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontSize: 13 }}>Exit Practice</button>
            </div>
            <p style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.5, marginBottom: 16 }}>{questions[activePracticeQ].question}</p>
            <textarea style={{ ...input, minHeight: 120, resize: "vertical", lineHeight: 1.6 }}
              placeholder="Type your answer... Use STAR: Situation - Task - Action - Result"
              value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} />
            <button onClick={() => getFeedback(questions[activePracticeQ].question)} disabled={feedbackLoading || !userAnswer.trim()}
              style={{ marginTop: 12, padding: "11px 24px", borderRadius: 8, border: "none", background: feedbackLoading || !userAnswer.trim() ? "#333" : GOLD, color: BLACK, fontSize: 14, fontWeight: 700, cursor: feedbackLoading || !userAnswer.trim() ? "not-allowed" : "pointer" }}>
              {feedbackLoading ? "Getting Feedback..." : "Get AI Feedback"}
            </button>
            {feedback && (
              <div style={{ marginTop: 16, padding: "16px 18px", background: "#111125", border: "1px solid #2a2a4a", borderRadius: 10 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: GOLD, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>AI Coach Feedback</p>
                <div style={{ fontSize: 14, lineHeight: 1.7, color: "#ddd", whiteSpace: "pre-wrap" }}>{feedback}</div>
              </div>
            )}
          </div>
        )}

        {questions.length > 0 && !practiceMode && (
          <div>
            <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>{questions.length} questions generated — click any to expand tips</p>
            {questions.map((q, idx) => (
              <div key={idx}
                style={{ background: CARD_BG, border: "1px solid " + (expandedIdx === idx ? GOLD : "#222"), borderRadius: 12, padding: "18px 20px", marginBottom: 12, cursor: "pointer" }}
                onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <span style={{ minWidth: 28, height: 28, borderRadius: "50%", background: expandedIdx === idx ? GOLD : "#1e1e30", color: expandedIdx === idx ? BLACK : GOLD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, flexShrink: 0 }}>{idx + 1}</span>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 600, lineHeight: 1.5, flex: 1 }}>{q.question}</p>
                  <span style={{ color: "#555", fontSize: 18 }}>{expandedIdx === idx ? "▲" : "▼"}</span>
                </div>
                {expandedIdx === idx && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #222" }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ marginBottom: 14 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4 }}>Why they ask this</p>
                      <p style={{ fontSize: 14, color: "#ccc", margin: 0, lineHeight: 1.6 }}>{q.why}</p>
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4 }}>How to answer</p>
                      <p style={{ fontSize: 14, color: "#ccc", margin: 0, lineHeight: 1.6 }}>{q.tip}</p>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4 }}>Strong opening line</p>
                      <p style={{ fontSize: 14, color: "#aad4ff", margin: 0, lineHeight: 1.6, fontStyle: "italic" }}>"{q.example_opener}"</p>
                    </div>
                    <button onClick={() => startPractice(idx)}
                      style={{ padding: "9px 20px", borderRadius: 8, border: "1.5px solid " + GOLD, background: "transparent", color: GOLD, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                      Practice This Question
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
    }
