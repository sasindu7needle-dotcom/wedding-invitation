import "../css/app.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "framer-motion";

createInertiaApp({
    title: (title) => `${title} · With love`,
    resolve: async (name) =>
        (await import.meta.glob("./Pages/**/*.jsx")[`./Pages/${name}.jsx`]())
            .default,
    setup({ el, App, props }) {
        createRoot(el).render(
            <MotionConfig reducedMotion="user">
                <App {...props} />
            </MotionConfig>,
        );
    },
    progress: { color: "#85734f" },
});
