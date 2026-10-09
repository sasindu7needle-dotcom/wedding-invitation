import Reveal from "./Reveal";
import AnimatedDivider from "./AnimatedDivider";
export default function InvitationMessage({ wedding, guest, sectionRef }) {
    return (
        <section
            ref={sectionRef}
            tabIndex={-1}
            className="invitation-message section-pad"
            id="invitation-message"
        >
            <Reveal>
                <div className="inviting-families">
                    <p className="eyebrow">
                        {wedding.bride_parents[0]} &<br />
                        {wedding.bride_parents[1]}
                    </p>
                    <p className="family-together">Together with</p>
                    <p className="eyebrow">
                        {wedding.groom_parents[0]} &<br />
                        {wedding.groom_parents[1]}
                    </p>
                </div>
                <p className="signature">joyfully invite</p>
            </Reveal>
            <AnimatedDivider />
            <Reveal delay={0.1}>
                <p className="invited-guest">{guest.name}</p>
                <p className="body-copy">
                    to celebrate the marriage of their loving children
                </p>
                <h2 className="formal-couple">
                    {wedding.bride_full_name}
                    <span className="ampersand">&</span>
                    {wedding.groom_full_name}
                </h2>
                <p className="signature">
                    as they begin their beautiful journey together
                </p>
            </Reveal>
        </section>
    );
}
