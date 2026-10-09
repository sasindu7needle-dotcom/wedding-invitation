import { motion, useReducedMotion } from "framer-motion";

export default function WeddingAtmosphere({ chapter = 0 }) {
    const reduced = useReducedMotion();
    if (reduced) return null;
    return (
        <div className="wedding-atmosphere" aria-hidden="true">
            <motion.div
                className="wedding-rings"
                animate={{
                    rotate: chapter * 32 - 25,
                    scale: 1 + chapter * 0.08,
                }}
                transition={{ duration: 1.4 }}
            >
                <i />
                <i />
            </motion.div>
            {Array.from({ length: 28 }, (_, index) => (
                <span
                    className="floating-petal"
                    key={index}
                    style={{
                        "--left": `${(index * 37 + 3) % 100}%`,
                        "--delay": `${-((index * 7.31) % 31)}s`,
                        "--duration": `${17 + ((index * 7) % 19)}s`,
                        "--size": `${6 + ((index * 3) % 11)}px`,
                        "--drift": `${((index * 53) % 220) - 110}px`,
                        "--sway": `${((index * 29) % 90) - 45}px`,
                        "--turn": `${index % 2 ? -280 : 340}deg`,
                        "--angle": `${(index * 47) % 360}deg`,
                        "--petal-opacity": 0.22 + (index % 4) * 0.07,
                    }}
                />
            ))}
        </div>
    );
}
