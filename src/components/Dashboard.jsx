export default function Dashboard({ challans }) {

    const total     = challans.length;
    const pending   = challans.filter(c => c.status === "PENDING").length;
    const paid      = challans.filter(c => c.status === "PAID").length;
    const cancelled = challans.filter(c => c.status === "CANCELLED").length;
    const totalFine = challans
        .filter(c => c.status !== "CANCELLED")
        .reduce((sum, c) => sum + (c.fineAmount || 0), 0);

    return (
        <div className="dashboard">
            <StatCard label="Total Challans"
                value={total}        color="#1a237e" />
            <StatCard label="Pending"
                value={pending}      color="#f59e0b" />
            <StatCard label="Paid"
                value={paid}         color="#10b981" />
            <StatCard label="Cancelled"
                value={cancelled}    color="#ef4444" />
            <StatCard label="Total Fine (Rs.)"
                value={`Rs.${totalFine
                    .toLocaleString("en-IN")}`} color="#7c3aed" />
        </div>
    );
}

function StatCard({ label, value, color }) {
    return (
        <div className="stat-card" style={{ borderTopColor: color }}>
            <div className="stat-value" style={{ color }}>
                {value}
            </div>
            <div className="stat-label">{label}</div>
        </div>
    );
}