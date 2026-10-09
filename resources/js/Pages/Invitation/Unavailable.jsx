import { Head } from "@inertiajs/react";
import FloralDecoration from "../../Components/Invitation/FloralDecoration";
export default function Unavailable({ inactive = false, status = 404 }) {
    return (
        <main className="unavailable">
            <Head title="A little pause" />
            <FloralDecoration />
            <p className="eyebrow">With love</p>
            <h1>
                {status >= 500
                    ? "A little pause."
                    : inactive
                      ? "A little patience, dear guest."
                      : "An invitation awaits."}
            </h1>
            <p>
                {status >= 500
                    ? "Something went wrong. Please try again in a little while."
                    : inactive
                      ? "This invitation is currently unavailable."
                      : "We couldn’t find this invitation. Please check your personal link."}
            </p>
            <p className="muted">
                If you need a hand, please reach out to the couple.
            </p>
        </main>
    );
}
