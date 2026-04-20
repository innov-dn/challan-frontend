import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const VIOLATIONS = [
    "Signal Jump",
    "Overspeeding",
    "No Helmet",
    "No Seatbelt",
    "Drunk Driving (DUI)",
    "Wrong Side Driving",
    "Using Mobile While Driving",
    "No Insurance",
    "No Driving Licence",
    "No RC (Registration Certificate)",
    "Wrong Parking",
    "Overloading",
    "No PUC Certificate",
    "Rash and Negligent Driving",
    "Triple Riding",
    "Driving Without Registration",
    "Without Permit"
];

const VEHICLE_TYPES = [
    "Two-Wheeler (Motorcycle/Scooter)",
    "Three-Wheeler (Auto Rickshaw)",
    "Four-Wheeler (Private Car)",
    "Four-Wheeler (Taxi/Cab)",
    "Commercial Vehicle (Goods)",
    "Bus (Private)",
    "Bus (State Transport)",
    "Heavy Vehicle / Truck",
    "Tractor / Agricultural Vehicle"
];

const STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam",
    "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan",
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi (NCT)", "Jammu & Kashmir", "Ladakh",
    "Chandigarh", "Puducherry"
];

const EMPTY = {
    vehicleNumber: "", ownerName: "",
    vehicleType: "",   violationType: "",
    location: "",      district: "",
    state: ""
};

export default function ChallanForm({ onSuccess }) {

    const [form,    setForm]    = useState(EMPTY);
    const [loading, setLoading] = useState(false);

    const handleChange = e =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const validate = () => {
        const reg = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;
        if (!reg.test(form.vehicleNumber.toUpperCase())) {
            toast.error(
                "Invalid vehicle number! Format: MP04AB1234");
            return false;
        }
        return true;
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const res = await api.generate({
                ...form,
                vehicleNumber: form.vehicleNumber.toUpperCase()
            });
            toast.success("Challan generated successfully!");
            onSuccess(res.data);
            setForm(EMPTY);
        } catch (err) {
            const msg = err.response?.data
                || "Failed. Check backend.";
            toast.error("Error: " + msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h2>Issue New Challan</h2>
                <span className="badge-law">
                    Motor Vehicles Act 1988 | Amendment 2019
                </span>
            </div>

            <form onSubmit={handleSubmit}
                className="challan-form">
                <div className="form-grid">

                    <div className="form-group">
                        <label>Vehicle Number *</label>
                        <input
                            name="vehicleNumber"
                            placeholder="e.g. MP04AB1234"
                            value={form.vehicleNumber}
                            onChange={handleChange}
                            className="input-upper"
                            required />
                        <small>
                            Format: StateCode + RTO +
                            Series + Number
                        </small>
                    </div>

                    <div className="form-group">
                        <label>Owner / Driver Name *</label>
                        <input
                            name="ownerName"
                            placeholder="Full name as per RC"
                            value={form.ownerName}
                            onChange={handleChange}
                            required />
                    </div>

                    <div className="form-group">
                        <label>Vehicle Type *</label>
                        <select
                            name="vehicleType"
                            value={form.vehicleType}
                            onChange={handleChange}
                            required>
                            <option value="">-- Select --</option>
                            {VEHICLE_TYPES.map(v =>
                                <option key={v} value={v}>
                                    {v}
                                </option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Violation Type *</label>
                        <select
                            name="violationType"
                            value={form.violationType}
                            onChange={handleChange}
                            required>
                            <option value="">-- Select --</option>
                            {VIOLATIONS.map(v =>
                                <option key={v} value={v}>
                                    {v}
                                </option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Exact Location / Road *</label>
                        <input
                            name="location"
                            placeholder="e.g. Near DB Mall, MP Nagar"
                            value={form.location}
                            onChange={handleChange}
                            required />
                    </div>

                    <div className="form-group">
                        <label>District *</label>
                        <input
                            name="district"
                            placeholder="e.g. Bhopal"
                            value={form.district}
                            onChange={handleChange}
                            required />
                    </div>

                    <div className="form-group full-width">
                        <label>State / UT *</label>
                        <select
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                            required>
                            <option value="">
                                -- Select State --
                            </option>
                            {STATES.map(s =>
                                <option key={s} value={s}>
                                    {s}
                                </option>)}
                        </select>
                    </div>

                </div>

                <button
                    type="submit"
                    className="btn-generate"
                    disabled={loading}>
                    {loading
                        ? "Gemini AI is generating challan..."
                        : "Generate AI Challan"}
                </button>
            </form>
        </div>
    );
}