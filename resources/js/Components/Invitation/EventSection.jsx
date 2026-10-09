import { motion, useReducedMotion } from "framer-motion";
import Reveal from "./Reveal";
export default function EventSection({
    event,
    number,
    title,
    reverse = false,
}) {
    const reduced = useReducedMotion();
    return (
        <section className={`event-section ${reverse ? "reverse" : ""}`}>
            <div className="event-illustration">
                <span className="event-number">{number}</span>
                <div className="event-photo-frame">
                    <motion.img
                        className="event-photo"
                        src={
                            reverse
                                ? "/images/reception-garden.png"
                                : "/images/ceremony-chapel.png"
                        }
                        alt={
                            reverse
                                ? "Wedding reception inspiration with candlelit tables, white flowers and garden fairy lights"
                                : "Wedding chapel inspiration with white roses and a candlelit aisle"
                        }
                        width="1536"
                        height="1024"
                        initial={reduced ? false : { scale: 1.12 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 2.2, ease: "easeOut" }}
                    />
                </div>
                <p className="eyebrow">
                    {reverse
                        ? "And so the celebration begins"
                        : "Where our forever begins"}
                </p>
            </div>
            <Reveal className="event-copy">
                <p className="eyebrow">{number} / The celebration</p>
                <h2>{title}</h2>
                <p className="event-time">{event.time}</p>
                <h3>{event.name}</h3>
                <p className="body-copy">{event.address}</p>
                <span className="small-rule" />
                <p className="event-note">{event.note}</p>
            </Reveal>
        </section>
    );
}
