import {
    motion,
    useScroll,
    useTransform,
    useReducedMotion,
} from "framer-motion";
import { useRef } from "react";
import Reveal from "./Reveal";
export default function CoupleStory({ wedding }) {
    const ref = useRef(null);
    const reduced = useReducedMotion();
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
    const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);
    return (
        <section className="story" ref={ref}>
            <motion.img
                style={reduced ? {} : { y, scale }}
                src="/images/story-1400.jpg"
                srcSet="/images/story-800.jpg 800w, /images/story-1400.jpg 1400w"
                sizes="100vw"
                alt="A couple sharing a quiet moment together in the countryside"
                loading="lazy"
                width="1400"
                height="1000"
            />
            <div className="story-shade" />
            <div className="story-copy">
                <Reveal>
                    <p className="eyebrow">Our favourite chapter</p>
                    <h2>
                        It was always
                        <br />
                        <em>going to be you.</em>
                    </h2>
                    <p>{wedding.story}</p>
                </Reveal>
            </div>
            <span className="image-caption eyebrow">
                The beginning of forever · {wedding.year}
            </span>
        </section>
    );
}
