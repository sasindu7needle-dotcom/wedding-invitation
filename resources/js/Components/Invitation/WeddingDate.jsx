import Reveal from "./Reveal";
import FloralDecoration from "./FloralDecoration";
export default function WeddingDate({ wedding }) {
    return (
        <section className="wedding-date section-pad">
            <FloralDecoration className="date-floral" />
            <Reveal>
                <p className="eyebrow">One beautiful day</p>
                <p className="date-weekday">{wedding.weekday}</p>
                <time dateTime={wedding.date}>
                    <span className="date-number">{wedding.day}</span>
                    <span className="date-month">{wedding.month}</span>
                    <span className="date-year">— {wedding.year} —</span>
                </time>
                <p className="date-note">Keep this day close to your heart.</p>
            </Reveal>
        </section>
    );
}
