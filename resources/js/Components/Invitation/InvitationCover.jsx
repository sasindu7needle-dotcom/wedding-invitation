import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import FloralDecoration from "./FloralDecoration";
import GuestGreeting from "./GuestGreeting";

export default function InvitationCover({
    wedding,
    guest,
    onOpen,
    opened,
    preview,
}) {
    const reduced = useReducedMotion();
    return (
        <section className="invitation-cover" aria-label="Your invitation">
            <div className="cover-photo">
                <motion.img
                    src="/images/garden-1400.jpg"
                    srcSet="/images/garden-800.jpg 800w, /images/garden-1400.jpg 1400w"
                    sizes="(min-width: 900px) 48vw, 100vw"
                    alt="A romantic sunlit garden with soft green foliage"
                    fetchPriority="high"
                />
                <div className="photo-shade" />
                <p className="photo-caption">
                    A little moment. A lifetime of love.
                </p>
            </div>
            <motion.div className="cover-paper">
                <div className="cover-top">
                    <span className="monogram">{wedding.initials}</span>
                    <span className="eyebrow">The wedding invitation</span>
                    {preview && <span className="sample-label">Sample</span>}
                </div>
                <div className="cover-frame">
                    <FloralDecoration className="cover-floral" />
                    <div className="cover-content">
                        <motion.p
                            className="eyebrow"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: reduced ? 0 : 1 }}
                        >
                            With full hearts & open arms
                        </motion.p>
                        <motion.h1
                            initial={reduced ? false : { opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.2, delay: 0.15 }}
                        >
                            {wedding.bride}
                            <span className="ampersand">&</span>
                            {wedding.groom}
                        </motion.h1>
                        <p className="cover-subtitle">
                            joyfully invite you to their wedding
                        </p>
                        <div className="cover-date">
                            <span>{wedding.day}</span>
                            <i /> <span>{wedding.month}</span>
                            <i />
                            <span>{wedding.year}</span>
                        </div>
                        <GuestGreeting name={guest.name} />
                        <button className="open-button" onClick={onOpen}>
                            {opened
                                ? "Explore the invitation"
                                : "Open invitation"}
                            <ArrowUpRight size={17} />
                        </button>
                        <p className="cover-footnote">
                            A day made more beautiful with you in it.
                        </p>
                    </div>
                </div>
                <div className="cover-bottom">
                    <span className="eyebrow">{wedding.location}</span>
                    <span className="eyebrow">
                        Scroll to step inside <ArrowDown size={12} />
                    </span>
                </div>
            </motion.div>
        </section>
    );
}
