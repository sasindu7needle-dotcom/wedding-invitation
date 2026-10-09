import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

export default function Reveal({ children, className = "", delay = 0 }) {
    const ref = useRef(null);
    const seen = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });
    const reduced = useReducedMotion();
    return (
        <motion.div
            ref={ref}
            className={className}
            initial={false}
            animate={{
                opacity: seen || reduced ? 1 : 0,
                y: seen || reduced ? 0 : 24,
            }}
            transition={{
                duration: reduced ? 0 : 0.9,
                delay: reduced ? 0 : delay,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            {children}
        </motion.div>
    );
}
