import { Link, useForm, usePage } from "@inertiajs/react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import AdminLayout from "../../Components/AdminLayout";
export default function Form({ invitee }) {
    const { links } = usePage().props;
    const form = useForm({
        name: invitee?.name ?? "",
        email: invitee?.email ?? "",
        phone: invitee?.phone ?? "",
    });
    function submit(e) {
        e.preventDefault();
        invitee ? form.put(invitee.update_url) : form.post(links.store);
    }
    return (
        <AdminLayout
            title={invitee ? "Edit invitation" : "A personal invitation"}
        >
            <Link href={links.index} className="text-link">
                <ArrowLeft size={16} />
                Back to guest list
            </Link>
            <div className="form-layout">
                <div>
                    <p className="eyebrow">
                        A little thoughtfulness goes a long way
                    </p>
                    <h1>
                        {invitee ? "The lovely details." : "Make it personal."}
                    </h1>
                    <p className="muted">
                        Their name. Your special day.
                        <br />
                        An invitation made just for them.
                    </p>
                    <div className="mini-invitation">
                        <p className="eyebrow">Especially for</p>
                        <p>{form.data.name || "Someone you love"}</p>
                        <span className="small-rule" />
                        <small>A beautiful beginning.</small>
                    </div>
                </div>
                <form className="form-card" onSubmit={submit}>
                    <h2>{invitee ? "Edit invitee" : "Add an invitee"}</h2>
                    {[
                        [
                            "name",
                            "Guest / family name",
                            "text",
                            "Mr. & Mrs. Fernando",
                        ],
                        ["email", "Email", "email", "Optional"],
                        ["phone", "Phone", "tel", "Optional"],
                    ].map(([key, label, type, placeholder]) => (
                        <div className="field" key={key}>
                            <label htmlFor={key}>
                                {label}{" "}
                                {key === "name" ? (
                                    <span aria-hidden="true">*</span>
                                ) : (
                                    <small>optional</small>
                                )}
                            </label>
                            <input
                                id={key}
                                type={type}
                                value={form.data[key]}
                                onChange={(e) =>
                                    form.setData(key, e.target.value)
                                }
                                placeholder={placeholder}
                                required={key === "name"}
                                maxLength={key === "phone" ? 40 : 255}
                                aria-invalid={!!form.errors[key]}
                                aria-describedby={
                                    form.errors[key]
                                        ? `${key}-error`
                                        : undefined
                                }
                            />
                            {form.errors[key] && (
                                <p id={`${key}-error`} className="error">
                                    {form.errors[key]}
                                </p>
                            )}
                        </div>
                    ))}
                    <p className="field-hint">
                        Use the name exactly as you’d like it to appear on their
                        invitation.
                    </p>
                    <button className="button full" disabled={form.processing}>
                        {form.processing
                            ? "Saving…"
                            : invitee
                              ? "Save changes"
                              : "Create invitation"}
                        <ArrowUpRight size={17} />
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}
