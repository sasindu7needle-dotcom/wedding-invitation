import { Link, router, usePage } from "@inertiajs/react";
import { Plus, Search, ArrowUpRight, Pencil, Eye } from "lucide-react";
import { useState } from "react";
import AdminLayout from "../../Components/AdminLayout";
import CopyLink from "../../Components/CopyLink";
const date = (value) =>
    value
        ? new Date(value).toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
              year: "numeric",
          })
        : "Not yet visited";
export default function Index({ invitees, stats, search }) {
    const { links } = usePage().props;
    const [query, setQuery] = useState(search);
    return (
        <AdminLayout title="Your guest list">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">Every name, a part of your story</p>
                    <h1>Your guest list</h1>
                    <p className="muted">
                        A personal invitation for everyone you love.
                    </p>
                </div>
                <Link href={links.create} className="button">
                    <Plus size={17} />
                    Add invitee
                </Link>
            </div>
            <div className="stats-grid">
                {[
                    ["Invitations created", stats.total],
                    ["Invitations viewed", stats.viewed],
                    ["Active invitations", stats.active],
                ].map(([label, count]) => (
                    <div className="stat" key={label}>
                        <span>{label}</span>
                        <strong>{count.toString().padStart(2, "0")}</strong>
                    </div>
                ))}
            </div>
            <div className="list-toolbar">
                <h2>
                    Invitations <span className="count">{invitees.total}</span>
                </h2>
                <form
                    className="search-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        router.get(
                            links.index,
                            { search: query },
                            { preserveState: true },
                        );
                    }}
                >
                    <label className="sr-only" htmlFor="search">
                        Search guest names
                    </label>
                    <input
                        id="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Find a guest…"
                    />
                    <button aria-label="Search" className="icon-button">
                        <Search size={18} />
                    </button>
                </form>
            </div>
            {invitees.data.length === 0 ? (
                <div className="empty-state">
                    <h2>
                        {search
                            ? "No matching names"
                            : "Your celebration starts with a name."}
                    </h2>
                    <p>
                        {search
                            ? "Try another search."
                            : "Create your first invitation and make someone feel special."}
                    </p>
                    <Link href={links.create} className="text-link">
                        Create an invitation <ArrowUpRight size={16} />
                    </Link>
                </div>
            ) : (
                <div className="guest-list">
                    {invitees.data.map((guest) => (
                        <article className="guest-row" key={guest.token}>
                            <div className="guest-avatar" aria-hidden="true">
                                {guest.name[0]}
                            </div>
                            <div className="guest-info">
                                <Link
                                    href={guest.show_url}
                                    className="guest-title"
                                >
                                    {guest.name}
                                </Link>
                                <p className="muted">
                                    Created {date(guest.created_at)}
                                </p>
                                <a
                                    className="guest-url"
                                    href={guest.url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {guest.url}
                                </a>
                            </div>
                            <div className="guest-status">
                                <span
                                    className={`badge ${guest.status.toLowerCase()}`}
                                >
                                    {guest.status}
                                </span>
                                <p>{guest.visit_count} visits</p>
                                <small>{date(guest.visited_at)}</small>
                            </div>
                            <div className="row-actions">
                                <CopyLink url={guest.url} />
                                <Link
                                    href={guest.show_url}
                                    className="icon-button"
                                    aria-label={`View ${guest.name}`}
                                >
                                    <Eye size={17} />
                                </Link>
                                <Link
                                    href={guest.edit_url}
                                    className="icon-button"
                                    aria-label={`Edit ${guest.name}`}
                                >
                                    <Pencil size={16} />
                                </Link>
                                <a
                                    href={guest.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="icon-button"
                                    aria-label={`Open invitation for ${guest.name}`}
                                >
                                    <ArrowUpRight size={18} />
                                </a>
                                <button
                                    className="text-link toggle"
                                    onClick={() =>
                                        router.patch(
                                            guest.toggle_url,
                                            {},
                                            { preserveScroll: true },
                                        )
                                    }
                                >
                                    {guest.is_active
                                        ? "Deactivate"
                                        : "Activate"}
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
            <nav className="pagination" aria-label="Guest list pages">
                {invitees.prev_page_url && (
                    <Link
                        href={invitees.prev_page_url}
                        className="button secondary"
                    >
                        Previous
                    </Link>
                )}
                <span>
                    Page {invitees.current_page} of {invitees.last_page}
                </span>
                {invitees.next_page_url && (
                    <Link
                        href={invitees.next_page_url}
                        className="button secondary"
                    >
                        Next
                    </Link>
                )}
            </nav>
        </AdminLayout>
    );
}
