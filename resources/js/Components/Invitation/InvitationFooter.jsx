import Reveal from "./Reveal";
import FloralDecoration from "./FloralDecoration";
export default function InvitationFooter({ wedding }) {
    return (
        <footer className="invitation-footer section-pad">
            <FloralDecoration />
            <Reveal>
                <p className="eyebrow">The best things in life are shared</p>
                <h2>
                    We can't wait to
                    <br />
                    <em>celebrate with you.</em>
                </h2>
                <p className="signature">
                    With love, {wedding.bride} & {wedding.groom}
                </p>
                <div className="wedding-contacts">
                    <p className="eyebrow">
                        Kindly RSVP by{" "}
                        <time dateTime={wedding.rsvp.date}>
                            {wedding.rsvp.label}
                        </time>
                    </p>
                    <div className="contact-links">
                        {wedding.contacts.map((contact) => (
                            <a key={contact.tel} href={`tel:${contact.tel}`}>
                                <span>{contact.phone}</span>
                                <em>{contact.name}</em>
                            </a>
                        ))}
                    </div>
                </div>
                <span className="footer-monogram">{wedding.initials}</span>
                <p className="eyebrow">
                    {wedding.day} · {wedding.month} · {wedding.year}
                </p>
            </Reveal>
        </footer>
    );
}
