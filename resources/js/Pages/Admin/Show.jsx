import { Link, router, usePage } from "@inertiajs/react";
import { ArrowLeft, ArrowUpRight, RefreshCw } from "lucide-react";
import AdminLayout from "../../Components/AdminLayout";
import CopyLink from "../../Components/CopyLink";
export default function Show({ invitee }) {
    const { links } = usePage().props;
    return (
        <AdminLayout title="Invitation details">
            <Link href={links.index} className="text-link">
                <ArrowLeft size={16} />
                Back to guest list
            </Link>
            <div className="detail-card">
                <p className="eyebrow">A little envelope, a lot of love</p>
                <h1>{invitee.name}</h1>
                <span className={`badge ${invitee.status.toLowerCase()}`}>
                    {invitee.status}
                </span>
                <p className="muted">
                    Their personal invitation is ready to share.
                </p>
                <label htmlFor="invitation-url" className="eyebrow">
                    Personal invitation link
                </label>
                <input
                    id="invitation-url"
                    className="url-input"
                    value={invitee.url}
                    readOnly
                    onFocus={(e) => e.target.select()}
                />
                <div className="detail-actions">
                    <CopyLink url={invitee.url} />
                    <a
                        className="button"
                        href={invitee.url}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Preview invitation
                        <ArrowUpRight size={16} />
                    </a>
                </div>
                <dl className="detail-meta">
                    <div>
                        <dt>Email</dt>
                        <dd>{invitee.email || "Not provided"}</dd>
                    </div>
                    <div>
                        <dt>Phone</dt>
                        <dd>{invitee.phone || "Not provided"}</dd>
                    </div>
                    <div>
                        <dt>Visits</dt>
                        <dd>{invitee.visit_count}</dd>
                    </div>
                    <div>
                        <dt>Last visited</dt>
                        <dd>
                            {invitee.visited_at
                                ? new Date(invitee.visited_at).toLocaleString()
                                : "Not yet"}
                        </dd>
                    </div>
                </dl>
                <div className="detail-actions">
                    <Link className="text-link" href={invitee.edit_url}>
                        Edit details
                    </Link>
                    <button
                        className="text-link"
                        onClick={() => router.patch(invitee.toggle_url)}
                    >
                        {invitee.is_active
                            ? "Deactivate invitation"
                            : "Activate invitation"}
                    </button>
                    <button
                        className="text-link"
                        onClick={() => {
                            if (
                                window.confirm(
                                    "Create a new invitation link? The previous link will stop working immediately.",
                                )
                            )
                                router.post(invitee.regenerate_url);
                        }}
                    >
                        <RefreshCw size={14} />
                        Regenerate link
                    </button>
                </div>
            </div>
            <Link href={links.create} className="button secondary">
                Add another invitee
                <ArrowUpRight size={16} />
            </Link>
        </AdminLayout>
    );
}
