import { Head } from "@inertiajs/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import InvitationCover from "../../Components/Invitation/InvitationCover";
import InvitationMessage from "../../Components/Invitation/InvitationMessage";
import CoupleStory from "../../Components/Invitation/CoupleStory";
import WeddingDate from "../../Components/Invitation/WeddingDate";
import EventSection from "../../Components/Invitation/EventSection";
import InvitationFooter from "../../Components/Invitation/InvitationFooter";
import ScrollScene from "../../Components/Invitation/ScrollScene";
import WeddingAtmosphere from "../../Components/Invitation/WeddingAtmosphere";

const chapters = [
    ["cover", "Welcome"],
    ["opening", "Invitation"],
    ["our-story", "Our story"],
    ["the-date", "The date"],
    ["ceremony", "Ceremony"],
    ["reception", "Reception"],
    ["with-love", "RSVP"],
];

export default function Show({ wedding, guest, preview = false }) {
    const [journey, setJourney] = useState({ index: 0, direction: 1 });
    const [moving, setMoving] = useState(false);
    const current = useRef(0);
    const locked = useRef(false);
    const stage = useRef(null);
    const focusScene = useRef(false);
    const reduced = useReducedMotion();
    const goTo = useCallback((index, focus = false) => {
        const next = Math.max(0, Math.min(chapters.length - 1, index));
        if (locked.current || next === current.current) return;
        locked.current = true;
        focusScene.current = focus;
        setMoving(true);
        setJourney({ index: next, direction: next > current.current ? 1 : -1 });
        current.current = next;
    }, []);
    const arrived = useCallback(() => {
        locked.current = false;
        setMoving(false);
        if (focusScene.current) {
            const panel = stage.current?.querySelector('[data-current="true"]');
            (panel?.querySelector("#invitation-message") ?? panel)?.focus({
                preventScroll: true,
            });
            focusScene.current = false;
        }
    }, []);
    useEffect(() => {
        const root = stage.current;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        let wheelTotal = 0;
        let lastWheel = 0;
        let touchStart = null;
        const canReadMore = (target, delta) => {
            const reader = target.closest?.(".depth-reader");
            return (
                reader &&
                (delta > 0
                    ? reader.scrollTop + reader.clientHeight <
                      reader.scrollHeight - 2
                    : reader.scrollTop > 2)
            );
        };
        const wheel = (event) => {
            if (event.ctrlKey || canReadMore(event.target, event.deltaY))
                return;
            event.preventDefault();
            const now = performance.now();
            const quiet = now - lastWheel > 180;
            lastWheel = now;
            if (locked.current) {
                wheelTotal = 0;
                return;
            }
            if (quiet || Math.sign(wheelTotal) !== Math.sign(event.deltaY))
                wheelTotal = 0;
            wheelTotal +=
                event.deltaY *
                (event.deltaMode === 1
                    ? 16
                    : event.deltaMode === 2
                      ? window.innerHeight
                      : 1);
            if (Math.abs(wheelTotal) >= 65) {
                goTo(current.current + Math.sign(wheelTotal));
                wheelTotal = 0;
            }
        };
        const key = (event) => {
            if (
                event.target.closest(
                    'input, textarea, select, button, a, [contenteditable="true"]',
                )
            )
                return;
            const step = ["ArrowDown", "ArrowRight", "PageDown", " "].includes(
                event.key,
            )
                ? 1
                : ["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key)
                  ? -1
                  : 0;
            if (!step && !["Home", "End"].includes(event.key)) return;
            event.preventDefault();
            if (event.repeat) return;
            goTo(
                event.key === "Home"
                    ? 0
                    : event.key === "End"
                      ? chapters.length - 1
                      : current.current + step,
                true,
            );
        };
        const start = (event) => {
            if (event.touches.length === 1)
                touchStart = {
                    x: event.touches[0].clientX,
                    y: event.touches[0].clientY,
                };
        };
        const move = (event) => {
            if (!touchStart || event.touches.length !== 1) return;
            const delta = touchStart.y - event.touches[0].clientY;
            if (!canReadMore(event.target, delta)) event.preventDefault();
        };
        const cancel = () => {
            touchStart = null;
        };
        const end = (event) => {
            if (!touchStart) return;
            const delta = touchStart.y - event.changedTouches[0].clientY;
            const horizontal = Math.abs(
                touchStart.x - event.changedTouches[0].clientX,
            );
            touchStart = null;
            if (
                Math.abs(delta) > 55 &&
                Math.abs(delta) > horizontal &&
                !canReadMore(event.target, delta)
            )
                goTo(current.current + Math.sign(delta));
        };
        root.addEventListener("wheel", wheel, { passive: false });
        root.addEventListener("touchstart", start, { passive: true });
        root.addEventListener("touchmove", move, { passive: false });
        root.addEventListener("touchcancel", cancel);
        root.addEventListener("touchend", end, { passive: true });
        window.addEventListener("keydown", key);
        return () => {
            document.body.style.overflow = previousOverflow;
            root.removeEventListener("wheel", wheel);
            root.removeEventListener("touchstart", start);
            root.removeEventListener("touchmove", move);
            root.removeEventListener("touchcancel", cancel);
            root.removeEventListener("touchend", end);
            window.removeEventListener("keydown", key);
        };
    }, [goTo]);
    const scenes = [
        <InvitationCover
            {...{ wedding, guest, preview }}
            onOpen={() => goTo(1, true)}
        />,
        <InvitationMessage {...{ wedding, guest }} />,
        <CoupleStory wedding={wedding} />,
        <WeddingDate wedding={wedding} />,
        <div className="events">
            <EventSection
                event={wedding.ceremony}
                number="01"
                title="The ceremony"
            />
        </div>,
        <div className="events">
            <EventSection
                event={wedding.reception}
                number="02"
                title="The reception"
                reverse
            />
        </div>,
        <InvitationFooter wedding={wedding} />,
    ];
    return (
        <main
            ref={stage}
            className="invitation cinematic-invitation depth-journey"
            data-moving={moving}
        >
            <Head title={`${wedding.bride} & ${wedding.groom}`} />
            <motion.div
                className="depth-backdrop"
                aria-hidden="true"
                animate={{ scale: reduced ? 1 : 1 + journey.index * 0.09 }}
                transition={{ duration: 1.4 }}
            />
            <div className="depth-vignette" aria-hidden="true" />
            <WeddingAtmosphere chapter={journey.index} />
            <header className="depth-header">
                <span className="monogram">{wedding.initials}</span>
                <span className="eyebrow">A journey into forever</span>
            </header>
            <div className="depth-camera">
                <AnimatePresence initial={false} custom={journey.direction}>
                    <ScrollScene
                        key={journey.index}
                        id={chapters[journey.index][0]}
                        label={chapters[journey.index][1]}
                        direction={journey.direction}
                        onArrived={arrived}
                    >
                        {scenes[journey.index]}
                    </ScrollScene>
                </AnimatePresence>
            </div>
            <div className="depth-controls">
                <p className="depth-hint" aria-live="polite">
                    {journey.index === 6
                        ? "Our forever begins with you"
                        : "Scroll or swipe to step inside"}
                </p>
                <div className="depth-navigation">
                    <button
                        className="depth-arrow"
                        onClick={() => goTo(journey.index - 1, true)}
                        disabled={moving || journey.index === 0}
                        aria-label="Previous scene"
                    >
                        <ArrowLeft size={17} />
                    </button>
                    <nav aria-label="Invitation chapters">
                        {chapters.map(([id, label], index) => (
                            <button
                                key={id}
                                aria-label={label}
                                aria-current={
                                    journey.index === index ? "step" : undefined
                                }
                                disabled={moving}
                                onClick={() => goTo(index, true)}
                            >
                                <span />
                                <span className="depth-nav-label">{label}</span>
                            </button>
                        ))}
                    </nav>
                    <button
                        className="depth-arrow"
                        onClick={() => goTo(journey.index + 1, true)}
                        disabled={moving || journey.index === 6}
                        aria-label="Next scene"
                    >
                        <ArrowRight size={17} />
                    </button>
                </div>
                <p className="depth-caption">
                    <span>0{journey.index + 1} / 07</span>
                    {chapters[journey.index][1]}
                </p>
            </div>
        </main>
    );
}
