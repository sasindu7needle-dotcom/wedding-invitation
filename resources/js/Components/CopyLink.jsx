import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";
export default function CopyLink({ url }) {
    const [state, setState] = useState("");
    useEffect(() => {
        if (state !== "Invitation link copied") return;
        const timer = window.setTimeout(() => setState(""), 3500);
        return () => window.clearTimeout(timer);
    }, [state]);
    async function copy() {
        try {
            await navigator.clipboard.writeText(url);
            setState("Invitation link copied");
        } catch {
            setState("Copy unavailable. Select and copy the link below.");
        }
    }
    return (
        <div className="copy-control">
            <button type="button" className="button secondary" onClick={copy}>
                {state === "Invitation link copied" ? (
                    <Check size={16} />
                ) : (
                    <Copy size={16} />
                )}
                Copy link
            </button>
            {state && (
                <div role="status" className="copy-feedback">
                    {state}
                    {state.startsWith("Copy unavailable") && (
                        <input
                            aria-label="Invitation URL to copy"
                            readOnly
                            value={url}
                            onFocus={(e) => e.target.select()}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
