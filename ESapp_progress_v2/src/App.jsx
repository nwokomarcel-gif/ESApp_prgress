import { useState, useEffect } from "react";

const PHASES = [
  {
    id: "phase1",
    number: "PHASE 01",
    title: "Project Setup & Database",
    color: "#00ff88",
    colorBg: "rgba(0,255,136,0.08)",
    colorBorder: "rgba(0,255,136,0.3)",
    tasks: [
      { id: "p1t1", text: "Create folder structure (Backend + Frontend)", tag: "DONE", tagClass: "both" },
      { id: "p1t2", text: "Initialize Node.js project — run npm init in Backend folder", tag: "BE", tagClass: "be" },
      { id: "p1t3", text: "Install core packages: express, dotenv, cors, bcrypt, jsonwebtoken, pg", tag: "BE", tagClass: "be" },
      { id: "p1t4", text: "Set up .env file with DB credentials, JWT secret, PORT", tag: "BE", tagClass: "be" },
      { id: "p1t5", text: "Write database schema — users, scooters, rides, transactions tables", tag: "DB", tagClass: "db" },
      { id: "p1t6", text: "Connect to DB in config/db.js and test connection in server.js", tag: "BE", tagClass: "be" },
    ],
  },
  {
    id: "phase2",
    number: "PHASE 02",
    title: "Authentication (Register & Login)",
    color: "#38bdf8",
    colorBg: "rgba(56,189,248,0.08)",
    colorBorder: "rgba(56,189,248,0.3)",
    tasks: [
      { id: "p2t1", text: "Write userQueries.js — createUser, findUserByEmail", tag: "BE", tagClass: "be" },
      { id: "p2t2", text: "Write authServices.js — hash password, compare password, generate JWT", tag: "BE", tagClass: "be" },
      { id: "p2t3", text: "Write authRoutes.js — POST /register and POST /login endpoints", tag: "BE", tagClass: "be" },
      { id: "p2t4", text: "Write authMiddleware.js — verify JWT token on protected routes", tag: "BE", tagClass: "be" },
      { id: "p2t5", text: "Build register.html and login.html pages with forms", tag: "FE", tagClass: "fe" },
      { id: "p2t6", text: "Write auth.js frontend — connect forms to API, store JWT in localStorage", tag: "FE", tagClass: "fe" },
    ],
  },
  {
    id: "phase3",
    number: "PHASE 03",
    title: "Scooter & Ride Management",
    color: "#f59e0b",
    colorBg: "rgba(245,158,11,0.08)",
    colorBorder: "rgba(245,158,11,0.3)",
    tasks: [
      { id: "p3t1", text: "Write ScooterQueries.js — getAvailableScooters, updateScooterStatus", tag: "BE", tagClass: "be" },
      { id: "p3t2", text: "Write scooterService.js and scooterRoutes.js — GET /scooters", tag: "BE", tagClass: "be" },
      { id: "p3t3", text: "Write rideQueries.js — startRide, endRide, getUserRides", tag: "BE", tagClass: "be" },
      { id: "p3t4", text: "Write rideRoutes.js — POST /ride/start, POST /ride/end, GET /ride/history", tag: "BE", tagClass: "be" },
      { id: "p3t5", text: "Complete calculateRideCost.js utility — cost based on duration/distance", tag: "BE", tagClass: "be" },
      { id: "p3t6", text: "Build ride.html and rideSummary.html, wire up with ride.js and rideSummary.js", tag: "FE", tagClass: "fe" },
    ],
  },
  {
    id: "phase4",
    number: "PHASE 04",
    title: "Map Integration",
    color: "#f472b6",
    colorBg: "rgba(244,114,182,0.08)",
    colorBorder: "rgba(244,114,182,0.3)",
    tasks: [
      { id: "p4t1", text: "Get a free Leaflet.js or Google Maps API key", tag: "FE", tagClass: "fe" },
      { id: "p4t2", text: "Build map.js — display map, show user's current location", tag: "FE", tagClass: "fe" },
      { id: "p4t3", text: "Add scooter markers on map from API data — show available scooters nearby", tag: "BOTH", tagClass: "both" },
      { id: "p4t4", text: "Store scooter GPS coordinates in DB and expose via API", tag: "BE", tagClass: "be" },
    ],
  },
  {
    id: "phase5",
    number: "PHASE 05",
    title: "Payment System",
    color: "#a78bfa",
    colorBg: "rgba(167,139,250,0.08)",
    colorBorder: "rgba(167,139,250,0.3)",
    tasks: [
      { id: "p5t1", text: "Write transactionQueries.js — createTransaction, getUserTransactions", tag: "BE", tagClass: "be" },
      { id: "p5t2", text: "Write paymentService.js — handle wallet recharge and ride deductions", tag: "BE", tagClass: "be" },
      { id: "p5t3", text: "Write paymentRoutes.js — POST /payment/recharge, GET /payment/history", tag: "BE", tagClass: "be" },
      { id: "p5t4", text: "Build rechargePayment.html and wire up payment.js on the frontend", tag: "FE", tagClass: "fe" },
      { id: "p5t5", text: "(Optional) Integrate Paystack or Flutterwave for real payments", tag: "BOTH", tagClass: "both" },
    ],
  },
  {
    id: "phase6",
    number: "PHASE 06",
    title: "Admin Panel & Polish",
    color: "#fb923c",
    colorBg: "rgba(251,146,60,0.08)",
    colorBorder: "rgba(251,146,60,0.3)",
    tasks: [
      { id: "p6t1", text: "Add admin role to users table — protect admin routes in middleware", tag: "BE", tagClass: "be" },
      { id: "p6t2", text: "Build admin dashboard — view all users, rides, transactions", tag: "FE", tagClass: "fe" },
      { id: "p6t3", text: "Add scooter management to admin — add, disable, update scooter status", tag: "BOTH", tagClass: "both" },
      { id: "p6t4", text: "Write errorMiddleware.js — global error handler for clean API errors", tag: "BE", tagClass: "be" },
      { id: "p6t5", text: "Add global.css polish — make all pages responsive and consistent", tag: "FE", tagClass: "fe" },
      { id: "p6t6", text: "Test all endpoints with Postman or Thunder Client, fix bugs", tag: "BOTH", tagClass: "both" },
    ],
  },
];

const STORAGE_KEY = "esapp-roadmap-progress";

const tagColors = {
  be: { bg: "rgba(56,189,248,0.12)", color: "#38bdf8" },
  fe: { bg: "rgba(244,114,182,0.12)", color: "#f472b6" },
  both: { bg: "rgba(167,139,250,0.12)", color: "#a78bfa" },
  db: { bg: "rgba(245,158,11,0.12)", color: "#f59e0b" },
};

export default function ESAppRoadmap() {
  const [done, setDone] = useState({});
  const [open, setOpen] = useState({ phase1: true });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState(null); // 'saved' | 'error' | null

  const totalTasks = PHASES.reduce((a, p) => a + p.tasks.length, 0);
  const doneTasks = Object.values(done).filter(Boolean).length;
  const pct = Math.round((doneTasks / totalTasks) * 100);

// Load progress on mount
useEffect(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      setDone(JSON.parse(saved));
    }
  } catch (e) {
    console.error("Failed to load progress", e);
  } finally {
    setLoading(false);
  }
}, []);


  // Save progress whenever done changes (debounced)
// Save progress whenever done changes
useEffect(() => {
  if (loading) return;

  const timer = setTimeout(() => {
    setSaving(true);
    setSaveStatus(null);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
      setSaveStatus("saved");
    } catch (e) {
      console.error("Failed to save progress", e);
      setSaveStatus("error");
    } finally {
      setSaving(false);

      setTimeout(() => {
        setSaveStatus(null);
      }, 2000);
    }
  }, 600);

  return () => clearTimeout(timer);
}, [done, loading]);

  function toggleTask(taskId) {
    setDone(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  }

  function togglePhase(phaseId) {
    setOpen(prev => ({ ...prev, [phaseId]: !prev[phaseId] }));
  }

  if (loading) {
    return (
      <div style={{ background: "#0a0a0f", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, border: "2px solid #00ff88", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "#64748b", fontFamily: "monospace", fontSize: 13 }}>Loading your progress...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      background: "#0a0a0f",
      minHeight: "100vh",
      fontFamily: "'Syne', 'Segoe UI', sans-serif",
      color: "#e2e8f0",
      backgroundImage: "linear-gradient(rgba(0,255,136,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.025) 1px, transparent 1px)",
      backgroundSize: "40px 40px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .task-row:hover { background: rgba(255,255,255,0.04) !important; }
        .phase-header:hover { opacity: 0.85; }
      `}</style>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "52px 20px" }}>

        {/* Header */}
        <div style={{ marginBottom: 48, animation: "fadeUp 0.5s ease both" }}>
          <div style={{
            display: "inline-block",
            background: "rgba(0,255,136,0.08)",
            border: "1px solid rgba(0,255,136,0.25)",
            color: "#00ff88",
            fontFamily: "monospace",
            fontSize: 11,
            letterSpacing: 2,
            padding: "5px 14px",
            borderRadius: 2,
            marginBottom: 18,
          }}>DEV ROADMAP</div>

          <h1 style={{ fontSize: "clamp(1.8rem,5vw,3rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: 10 }}>
            Building <span style={{ color: "#00ff88" }}>ESApp</span><br />from Zero
          </h1>
          <p style={{ color: "#64748b", fontFamily: "monospace", fontSize: 13 }}>
            // Full-stack escooter app · 6 phases · Progress auto-saved
          </p>

          {/* Stats */}
          <div style={{
            display: "flex", gap: 28, marginTop: 28,
            padding: "18px 22px",
            background: "#13131a",
            border: "1px solid #1e1e2e",
            borderRadius: 4, flexWrap: "wrap",
          }}>
            {[
              { num: "6", label: "Phases" },
              { num: totalTasks, label: "Tasks" },
              { num: doneTasks, label: "Completed" },
              { num: pct + "%", label: "Progress" },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#00ff88", fontFamily: "monospace" }}>{s.num}</div>
                <div style={{ fontSize: 11, color: "#64748b", letterSpacing: 1, textTransform: "uppercase" }}>{s.label}</div>
              </div>
            ))}

            {/* Save status */}
            <div style={{ marginLeft: "auto", alignSelf: "center", fontFamily: "monospace", fontSize: 11 }}>
              {saving && (
                <span style={{ color: "#64748b", animation: "pulse 1s infinite" }}>● saving...</span>
              )}
              {saveStatus === "saved" && !saving && (
                <span style={{ color: "#00ff88" }}>✓ saved</span>
              )}
              {saveStatus === "error" && !saving && (
                <span style={{ color: "#f87171" }}>✗ save failed</span>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 11, color: "#64748b", marginBottom: 8 }}>
              <span>OVERALL PROGRESS</span>
              <span>{pct}%</span>
            </div>
            <div style={{ height: 4, background: "#1e1e2e", borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: pct + "%",
                background: "linear-gradient(90deg, #00ff88, #38bdf8)",
                borderRadius: 2,
                transition: "width 0.4s ease",
              }} />
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ position: "relative", paddingLeft: 28 }}>
          {/* Vertical line */}
          <div style={{
            position: "absolute", left: 0, top: 8, bottom: 8,
            width: 1,
            background: "linear-gradient(to bottom, #00ff88, #38bdf8, #f59e0b, #f472b6, #a78bfa, #fb923c)",
            opacity: 0.35,
          }} />

          {PHASES.map((phase, i) => {
            const phaseDone = phase.tasks.filter(t => done[t.id]).length;
            const isOpen = open[phase.id];

            return (
              <div key={phase.id} style={{ marginBottom: 32, animation: `fadeUp 0.4s ${i * 0.08}s ease both` }}>

                {/* Dot */}
                <div style={{
                  position: "absolute", left: -6, marginTop: 18,
                  width: 12, height: 12, borderRadius: "50%",
                  background: phase.color,
                  boxShadow: `0 0 8px ${phase.color}55`,
                }} />

                {/* Phase header */}
                <div
                  className="phase-header"
                  onClick={() => togglePhase(phase.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    cursor: "pointer", marginBottom: isOpen ? 12 : 0,
                    padding: "10px 0",
                  }}
                >
                  <span style={{
                    fontFamily: "monospace", fontSize: 10, fontWeight: 700,
                    letterSpacing: 1, padding: "3px 10px", borderRadius: 2,
                    border: `1px solid ${phase.colorBorder}`,
                    background: phase.colorBg, color: phase.color,
                    flexShrink: 0,
                  }}>{phase.number}</span>

                  <span style={{ fontSize: 16, fontWeight: 700, color: phase.color, flex: 1 }}>
                    {phase.title}
                  </span>

                  <span style={{ fontFamily: "monospace", fontSize: 11, color: "#64748b" }}>
                    {phaseDone}/{phase.tasks.length}
                  </span>

                  <span style={{
                    fontSize: 18, color: "#64748b",
                    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                    fontFamily: "monospace", lineHeight: 1,
                  }}>+</span>
                </div>

                {/* Phase body */}
                {isOpen && (
                  <div style={{
                    background: "#13131a",
                    border: "1px solid #1e1e2e",
                    borderRadius: 4,
                    padding: 16,
                    display: "flex", flexDirection: "column", gap: 8,
                  }}>
                    {phase.tasks.map(task => {
                      const isDone = !!done[task.id];
                      const tc = tagColors[task.tagClass] || tagColors.both;
                      return (
                        <div
                          key={task.id}
                          className="task-row"
                          onClick={() => toggleTask(task.id)}
                          style={{
                            display: "flex", alignItems: "flex-start", gap: 12,
                            padding: "10px 12px",
                            background: isDone ? "rgba(0,255,136,0.04)" : "rgba(255,255,255,0.02)",
                            border: `1px solid ${isDone ? "rgba(0,255,136,0.15)" : "rgba(255,255,255,0.05)"}`,
                            borderRadius: 3,
                            cursor: "pointer",
                            transition: "all 0.2s",
                            opacity: isDone ? 0.6 : 1,
                          }}
                        >
                          {/* Checkbox */}
                          <div style={{
                            width: 18, height: 18, borderRadius: 3, flexShrink: 0,
                            border: `1.5px solid ${isDone ? "#00ff88" : "#475569"}`,
                            background: isDone ? "#00ff88" : "transparent",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11, color: "#000", fontWeight: 700,
                            transition: "all 0.2s", marginTop: 1,
                          }}>
                            {isDone ? "✓" : ""}
                          </div>

                          {/* Text */}
                          <span style={{
                            fontSize: 13, lineHeight: 1.5, flex: 1,
                            textDecoration: isDone ? "line-through" : "none",
                            color: isDone ? "#64748b" : "#e2e8f0",
                          }}>{task.text}</span>

                          {/* Tag */}
                          <span style={{
                            fontFamily: "monospace", fontSize: 10,
                            padding: "2px 8px", borderRadius: 2, flexShrink: 0,
                            background: isDone ? "rgba(0,255,136,0.1)" : tc.bg,
                            color: isDone ? "#00ff88" : tc.color,
                            alignSelf: "flex-start",
                          }}>{isDone ? "DONE" : task.tag}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 48, paddingTop: 20,
          borderTop: "1px solid #1e1e2e",
          display: "flex", justifyContent: "space-between",
          fontFamily: "monospace", fontSize: 11, color: "#334155",
          flexWrap: "wrap", gap: 8,
        }}>
          <span>ESAPP · BUILT BY MARCEL</span>
          <span>Progress saved automatically ☁</span>
        </div>

      </div>
    </div>
  );
}
