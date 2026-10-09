import { motion, useReducedMotion } from "framer-motion";
export default function AnimatedDivider() {
    const reduced = useReducedMotion();
    return (
        <div className="divider" aria-hidden="true">
            <motion.span
                initial={reduced ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
            />
            <span className="diamond" />
            <motion.span
                initial={reduced ? false : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
            />
        </div>
    );
}
