import { motion, useReducedMotion } from "framer-motion";

export default function FloralDecoration({ className = "" }) {
    const reduced = useReducedMotion();
    return (
        <svg
            className={`botanical ${className}`}
            viewBox="0 0 200 300"
            fill="none"
            aria-hidden="true"
        >
            <motion.g
                stroke="currentColor"
                strokeWidth="0.85"
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
            >
                <path d="M91 298C110 233 77 198 103 143C119 110 140 71 127 21M100 207C68 185 38 172 24 132M101 158C142 145 161 123 175 85M111 120C83 106 67 74 67 44" />
                <path d="M99 235C64 231 52 212 49 195C73 195 93 212 99 235ZM100 206C121 183 144 180 158 182C149 203 124 214 100 206ZM96 181C69 171 56 147 60 127C82 137 94 157 96 181ZM106 149C121 122 140 110 157 112C151 133 132 148 106 149ZM119 105C103 86 102 64 109 49C122 68 126 88 119 105ZM128 71C143 53 161 47 173 50C164 67 146 76 128 71ZM128 36C117 24 121 9 126 3C138 15 137 28 128 36ZM69 78C45 73 34 57 36 45C54 46 66 58 69 78ZM84 105C81 82 87 67 95 62C103 79 100 94 84 105ZM40 166C20 168 7 155 4 143C23 141 36 150 40 166ZM157 117C154 97 161 81 171 76C182 94 172 110 157 117Z" />
            </motion.g>
        </svg>
    );
}
