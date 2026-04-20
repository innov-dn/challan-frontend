import api from "../services/api";
import toast from "react-hot-toast";

const STATUS_COLORS = {
    PENDING:   {
        bg: "#fff3cd", text: "#856404", border: "#ffc107"
    },
    PAID:      {
        bg: "#d1e7dd", text: "#0f5132", border: "#198754"
    },
    CANCELLED: {
        bg: "#f8d7da", text: "#842029", border: "#dc3545"
    },
};

export default function ChallanCard({ challan, onUpdate }) {

    const s = STATUS_COLORS[challan.status]
        || STATUS_COLORS.PENDING;

    const markPaid = async () => {
        try {
            await api.updateStatus(challan.id, "PAID");
            toast.success("Challan marked as PAID");
            onUpdate();
        } catch {
            toast.error("Failed to update status");
        }
    };

    const cancelChallan = async () => {
        try {
            await api.updateStatus(challan.id, "CANCELLED");
            toast.success("Challan cancelled");
            onUpdate();
        } catch {
            toast.error("Failed to cancel");
        }
    };

    return (
        <div className="challan-card"
            style={{ borderLeftColor: s.border }}>

            {/* Header */}
            <div className="challan-card-header">
                <div>
                    <span className="challan-num">
                        {challan.challanNumber}
                    </span>
                    <span className="challan-date">
                        {new Date(challan.issuedAt)
                            .toLocaleDateString("en-IN")}
                    </span>
                </div>
                <span className="status-pill"
                    style={{
                        background: s.bg,
                        color: s.text
                    }}>
                    {challan.status}
                </span>
            </div>

            {/* Info Grid */}
            <div className="info-grid">
                <InfoItem label="Vehicle"
                    value={challan.vehicleNumber} />
                <InfoItem label="Owner"
                    value={challan.ownerName} />
                <InfoItem label="Violation"
                    value={challan.violationType} />
                <InfoItem label="MV Act Section"
                    value={challan.motorVehiclesActSection} />
                <InfoItem label="Fine Amount"
                    value={`Rs. ${challan.fineAmount
                        ?.toLocaleString("en-IN")}`} />
                <InfoItem label="Pay By"
                    value={challan.paymentDueDate} />
                <InfoItem label="Location"
                    value={`${challan.location},
                        ${challan.district}`} />
                <InfoItem label="State"
                    value={challan.state} />
                <InfoItem label="Vehicle Type"
                    value={challan.vehicleType} />
                <InfoItem label="Compoundable"
                    value={challan.isCompoundable
                        ? "Yes" : "No"} />
            </div>

            {/* AI Description */}
            <div className="ai-box">
                <p className="ai-label">
                    AI Generated — Legal Description
                </p>
                <p>{challan.challanDescription}</p>
                <p className="penalty-text">
                    <b>Penalty: </b>
                    {challan.penaltyDetails}
                </p>
                <p className="summary-text">
                    <b>Summary: </b>
                    {challan.aiSummary}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="card-actions">
                <button className="btn-pdf"
                    onClick={() =>
                        api.downloadPdf(challan.id)}>
                    Download PDF
                </button>
                {challan.status === "PENDING" && (
                    <>
                        <button className="btn-paid"
                            onClick={markPaid}>
                            Mark as Paid
                        </button>
                        <button className="btn-cancel"
                            onClick={cancelChallan}>
                            Cancel Challan
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

function InfoItem({ label, value }) {
    return (
        <div className="info-item">
            <span className="info-label">{label}</span>
            <span className="info-value">{value}</span>
        </div>
    );
}