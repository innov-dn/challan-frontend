import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import ChallanForm   from "./components/ChallanForm";
import ChallanCard   from "./components/ChallanCard";
import SearchVehicle from "./components/SearchVehicle";
import Dashboard     from "./components/Dashboard";
import api           from "./services/api";
import "./App.css";

// ✅ Set your secret PIN here
const SECRET_PIN = "challan2024";
const MAX_FREE_REQUESTS = 50; // lock after 50 requests

const TABS = [
    { id: "generate", label: "Issue Challan"  },
    { id: "result",   label: "Last Generated" },
    { id: "all",      label: "All Challans"   },
    { id: "search",   label: "Search"         },
];

export default function App() {

    const [activeTab,    setActiveTab]    = useState("generate");
    const [allChallans,  setAllChallans]  = useState([]);
    const [lastChallan,  setLastChallan]  = useState(null);

    // PIN states
    const [unlocked,     setUnlocked]     = useState(false);
    const [pinInput,     setPinInput]     = useState("");
    const [pinError,     setPinError]     = useState("");
    const [usageCount,   setUsageCount]   = useState(
        () => parseInt(
            localStorage.getItem("challan_usage") || "0")
    );

    const fetchAll = async () => {
        try {
            const res = await api.getAll();
            setAllChallans(res.data);
        } catch {
            console.error("Failed to fetch challans");
        }
    };

    useEffect(() => {
        let ignore = false;
        api.getAll()
            .then(res => {
                if (!ignore) setAllChallans(res.data);
            })
            .catch(() =>
                console.error("Failed to fetch challans"));
        return () => { ignore = true; };
    }, []);

    const handlePinSubmit = () => {
        if (pinInput === SECRET_PIN) {
            setUnlocked(true);
            setPinError("");
        } else {
            setPinError("Wrong PIN. Try again.");
            setPinInput("");
        }
    };

    const handleNewChallan = (challan) => {
        const newCount = usageCount + 1;
        setUsageCount(newCount);
        localStorage.setItem(
            "challan_usage", newCount.toString());
        setLastChallan(challan);
        setActiveTab("result");
        fetchAll();
    };

    // ── PIN Lock Screen ────────────────────────────
    if (!unlocked) {
        return (
            <div className="pin-screen">
                <div className="pin-box">
                    <span className="pin-flag">🇮🇳</span>
                    <h2>AI Challan Generator</h2>
                    <p>Enter PIN to access</p>
                    <input
                        type="password"
                        placeholder="Enter PIN"
                        value={pinInput}
                        onChange={e =>
                            setPinInput(e.target.value)}
                        onKeyDown={e =>
                            e.key === "Enter"
                            && handlePinSubmit()}
                        className="pin-input" />
                    {pinError && (
                        <p className="pin-error">
                            {pinError}
                        </p>
                    )}
                    <button
                        className="pin-btn"
                        onClick={handlePinSubmit}>
                        Unlock
                    </button>
                </div>
            </div>
        );
    }

    // ── Usage Limit Screen ────────────────────────
    if (usageCount >= MAX_FREE_REQUESTS) {
        return (
            <div className="pin-screen">
                <div className="pin-box">
                    <span className="pin-flag">⚠️</span>
                    <h2>Daily Limit Reached</h2>
                    <p>You have used {usageCount} of
                       {MAX_FREE_REQUESTS} free
                       requests today.</p>
                    <p style={{ marginTop: "10px",
                        color: "#888", fontSize: "0.85rem"
                    }}>
                        Resets tomorrow. Contact admin
                        to unlock more.
                    </p>
                    <button
                        className="pin-btn"
                        style={{ marginTop: "16px",
                            background: "#666" }}
                        onClick={() => {
                            localStorage.setItem(
                                "challan_usage", "0");
                            setUsageCount(0);
                        }}>
                        Reset Counter (Admin Only)
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="app">
            <Toaster position="top-right"
                toastOptions={{ duration: 3000 }} />

            {/* Header */}
            <header className="app-header">
                <div className="header-stripe orange" />
                <div className="header-content">
                    <div className="header-left">
                        <span className="header-emblem">
                            🇮🇳
                        </span>
                        <div>
                            <h1>AI Challan Generator</h1>
                            <p>Powered by Google Gemini AI</p>
                        </div>
                    </div>
                    <div className="header-right">
                        <span className="law-tag">
                            Motor Vehicles Act 1988
                        </span>
                        <span className="law-tag">
                            MV Amendment 2019
                        </span>
                        <span className="usage-badge">
                            Requests: {usageCount}/
                            {MAX_FREE_REQUESTS}
                        </span>
                    </div>
                </div>
                <div className="header-stripe green" />
            </header>

            {/* Dashboard */}
            <div className="dashboard-wrapper">
                <Dashboard challans={allChallans} />
            </div>

            {/* Tabs */}
            <nav className="tab-nav">
                {TABS.map(tab => (
                    <button key={tab.id}
                        className={`tab-btn ${
                            activeTab === tab.id
                                ? "active" : ""}`}
                        onClick={() =>
                            setActiveTab(tab.id)}>
                        {tab.label}
                    </button>
                ))}
            </nav>

            {/* Main Content */}
            <main className="app-main">

                {activeTab === "generate" && (
                    <ChallanForm
                        onSuccess={handleNewChallan} />
                )}

                {activeTab === "result" && (
                    lastChallan
                        ? <ChallanCard
                            challan={lastChallan}
                            onUpdate={fetchAll} />
                        : <div className="empty-state">
                            <p>No challan generated yet.
                               Use Issue Challan tab.</p>
                          </div>
                )}

                {activeTab === "all" && (
                    <div>
                        <div className="section-header">
                            <h2>All Challans
                                ({allChallans.length})
                            </h2>
                            <button
                                className="btn-refresh"
                                onClick={fetchAll}>
                                Refresh
                            </button>
                        </div>
                        {allChallans.length === 0
                            ? <div className="empty-state">
                                <p>No challans yet.</p>
                              </div>
                            : allChallans.map(c => (
                                <ChallanCard
                                    key={c.id}
                                    challan={c}
                                    onUpdate={fetchAll} />
                            ))
                        }
                    </div>
                )}

                {activeTab === "search" && (
                    <SearchVehicle />
                )}

            </main>

            <footer className="app-footer">
                <p>Official Use Only | Motor Vehicles
                   Act 1988 |
                   Pay at echallan.parivahan.gov.in
                </p>
            </footer>
        </div>
    );
}