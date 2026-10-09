import { Head, Link, usePage } from "@inertiajs/react";
import { LogOut, ArrowUpRight, Flower2 } from "lucide-react";
export default function AdminLayout({ title, children }) {
    const { links, flash } = usePage().props;
    return (
        <div className="admin-shell">
            <Head title={title} />
            <header className="admin-header">
                <Link className="admin-brand" href={links.index}>
                    <Flower2 size={25} />
                    <span>
                        With love<small>THE INVITATION STUDIO</small>
                    </span>
                </Link>
                <nav>
                    <Link href={links.home} className="text-link">
                        View design <ArrowUpRight size={15} />
                    </Link>
                    <Link
                        href={links.logout}
                        as="button"
                        method="post"
                        className="icon-button"
                        aria-label="Sign out"
                    >
                        <LogOut size={18} />
                    </Link>
                </nav>
            </header>
            <main className="admin-main">
                {flash?.success && (
                    <div className="notice" role="status">
                        {flash.success}
                    </div>
                )}
                {children}
            </main>
            <footer className="admin-footer">
                A thoughtful beginning to your beautiful day.
            </footer>
        </div>
    );
}
