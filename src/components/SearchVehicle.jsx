import { useState } from "react";
import api from "../services/api";
import ChallanCard from "./ChallanCard";
import toast from "react-hot-toast";

export default function SearchVehicle() {

    const [query,    setQuery]    = useState("");
    const [results,  setResults]  = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading,  setLoading]  = useState(false);

    const search = async () => {
        if (!query.trim()) {
            toast.error("Enter a vehicle number");
            return;
        }
        setLoading(true);
        try {
            const res = await api
                .getByVehicle(query.trim().toUpperCase());
            setResults(res.data);
            setSearched(true);
        } catch {
            toast.error("Search failed");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = e => {
        if (e.key === "Enter") search();
    };

    return (
        <div className="card">
            <h2>Search Challans by Vehicle Number</h2>

            <div className="search-bar">
                <input
                    placeholder="Enter vehicle number
                        (e.g. MP04AB1234)"
                    value={query}
                    onChange={e =>
                        setQuery(e.target.value
                            .toUpperCase())}
                    onKeyDown={handleKeyDown}
                    className="search-input" />
                <button
                    className="btn-search"
                    onClick={search}
                    disabled={loading}>
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>

            {searched && results.length === 0 && (
                <div className="empty-state">
                    <p>No challans found for <b>{query}</b></p>
                </div>
            )}

            <div className="results-list">
                {results.map(c => (
                    <ChallanCard
                        key={c.id}
                        challan={c}
                        onUpdate={search} />
                ))}
            </div>
        </div>
    );
}