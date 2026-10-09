import { motion, useIsPresent, useReducedMotion } from "framer-motion";

export default function ScrollScene({
    children,
    id,
    label,
    direction,
    onArrived,
}) {
    const present = useIsPresent();
    const reduced = useReducedMotion();
    const variants = {
        enter: (travel) => ({
            z: reduced ? 0 : travel > 0 ? -2400 : 850,
            opacity: 0,
            filter: reduced ? "none" : "blur(9px)",
        }),
        center: { z: 0, opacity: 1, filter: "blur(0px)" },
        exit: (travel) => ({
            z: reduced ? 0 : travel > 0 ? 1000 : -2400,
            opacity: 0,
            filter: reduced ? "none" : "blur(12px)",
        }),
    };
    return (
        <motion.section
            id={id}
            className={`depth-scene depth-scene-${id}`}
            aria-label={label}
            tabIndex={-1}
            data-current={present}
            inert={!present}
            aria-hidden={!present}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
                duration: reduced ? 0.15 : 1.35,
                ease: [0.22, 0.68, 0.15, 1],
                opacity: { duration: reduced ? 0.15 : 0.95 },
            }}
            onAnimationComplete={(definition) => {
                if (definition === "center" && present) onArrived();
            }}
        >
            <div className="depth-arch" aria-hidden="true">
                <i />
                <i />
            </div>
            <div className="depth-reader">{children}</div>
        </motion.section>
    );
}
