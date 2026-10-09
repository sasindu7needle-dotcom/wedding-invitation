import { Head, useForm, usePage, Link } from "@inertiajs/react";
import { ArrowUpRight } from "lucide-react";
import FloralDecoration from "../../Components/Invitation/FloralDecoration";
export default function Login() {
    const { links } = usePage().props;
    const form = useForm({ email: "", password: "" });
    return (
        <main className="login-page">
            <Head title="Welcome back" />
            <div className="login-intro">
                <FloralDecoration />
                <p className="eyebrow">The invitation studio</p>
                <h1>
                    Beautiful moments.
                    <br />
                    <em>Thoughtfully shared.</em>
                </h1>
                <p>A little care for every name on your list.</p>
            </div>
            <form
                className="form-card login-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    form.post(links.login, {
                        onFinish: () => form.reset("password"),
                    });
                }}
            >
                <p className="eyebrow">With love</p>
                <h2>Welcome back.</h2>
                <p className="muted">Sign in to your invitation studio.</p>
                <div className="field">
                    <label htmlFor="email">Email address</label>
                    <input
                        id="email"
                        type="email"
                        autoComplete="username"
                        required
                        value={form.data.email}
                        onChange={(e) => form.setData("email", e.target.value)}
                    />
                    {form.errors.email && (
                        <p className="error" role="alert">
                            {form.errors.email}
                        </p>
                    )}
                </div>
                <div className="field">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={form.data.password}
                        onChange={(e) =>
                            form.setData("password", e.target.value)
                        }
                    />
                    {form.errors.password && (
                        <p className="error" role="alert">
                            {form.errors.password}
                        </p>
                    )}
                </div>
                <button className="button full" disabled={form.processing}>
                    {form.processing ? "Signing in…" : "Enter the studio"}
                    <ArrowUpRight size={16} />
                </button>
                <Link href={links.home} className="text-link">
                    View the invitation design
                </Link>
            </form>
        </main>
    );
}
