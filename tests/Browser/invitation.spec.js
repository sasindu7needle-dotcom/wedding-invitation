import { test, expect } from "@playwright/test";

async function settled(page) {
    await expect(page.locator(".depth-journey")).toHaveAttribute(
        "data-moving",
        "false",
    );
}

for (const width of [375, 390, 430, 1440]) {
    test(`fixed invitation opens and reaches RSVP at ${width}px`, async ({
        page,
    }) => {
        await page.setViewportSize({ width, height: 900 });
        const errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        await page.goto("/");
        await expect(page.getByRole("heading", { level: 1 })).toContainText(
            "Dishala",
        );
        await expect(
            page
                .getByRole("region", { name: "Your invitation" })
                .getByText("Our dearest friends & family", { exact: true }),
        ).toBeVisible();
        await page.getByRole("button", { name: "Open invitation" }).click();
        await settled(page);
        await expect(page.locator("#invitation-message")).toBeFocused();
        await page
            .getByRole("button", { name: "Ceremony", exact: true })
            .click();
        await settled(page);
        await expect(
            page.getByRole("heading", { name: "The ceremony" }),
        ).toBeInViewport();
        await page.getByRole("button", { name: "RSVP", exact: true }).click();
        await settled(page);
        await expect(
            page.getByRole("heading", {
                name: "We can't wait to celebrate with you.",
            }),
        ).toBeInViewport();
        await expect(
            page.getByRole("link", { name: /0707000865/ }),
        ).toHaveAttribute("href", "tel:+94707000865");
        expect(
            await page.evaluate(() => ({
                y: scrollY,
                overflow: document.documentElement.scrollWidth > innerWidth,
            })),
        ).toEqual({ y: 0, overflow: false });
        expect(errors).toEqual([]);
        await page.screenshot({ path: `test-results/depth-rsvp-${width}.png` });
    });
}

test("wheel travels inward and reverses without moving the document", async ({
    page,
}) => {
    await page.goto("/");
    await expect(
        page.getByRole("button", { name: "Open invitation" }),
    ).toBeVisible();
    await page.mouse.move(10, 350);
    await page.mouse.wheel(0, 160);
    await expect(page.locator("#opening")).toBeAttached();
    await expect
        .poll(() =>
            page
                .locator("#opening")
                .evaluate((el) => getComputedStyle(el).transform),
        )
        .not.toBe("none");
    await settled(page);
    await expect(page.locator("#invitation-message")).toBeInViewport();
    await page.mouse.wheel(0, -160);
    await settled(page);
    await expect(
        page.getByRole("button", { name: "Open invitation" }),
    ).toBeVisible();
    expect(await page.evaluate(() => scrollY)).toBe(0);
});

test("keyboard and touch navigate scenes and respect journey boundaries", async ({
    page,
}) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("heading", { level: 1 }).waitFor();
    await page.keyboard.press("ArrowRight");
    await settled(page);
    await expect(page.locator("#invitation-message")).toBeFocused();
    const touch = await page.context().newCDPSession(page);
    await touch.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x: 150, y: 500 }],
    });
    await touch.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: 155, y: 250 }],
    });
    await touch.send("Input.dispatchTouchEvent", {
        type: "touchEnd",
        touchPoints: [],
    });
    await settled(page);
    await expect(
        page.getByRole("heading", { name: "It was always going to be you." }),
    ).toBeInViewport();
    await page.keyboard.press("End");
    await settled(page);
    await expect(
        page.getByRole("button", { name: "Next scene", exact: true }),
    ).toBeDisabled();
    await page.keyboard.press("Home");
    await settled(page);
    await expect(
        page.getByRole("button", { name: "Previous scene", exact: true }),
    ).toBeDisabled();
});

test("reduced motion retains navigation and missing invitations still return 404", async ({
    page,
}) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.getByRole("button", { name: "The date", exact: true }).click();
    await settled(page);
    await expect(page.locator(".wedding-date")).toBeInViewport();
    await expect(page.locator(".depth-camera")).toHaveCSS(
        "perspective",
        "none",
    );
    await expect(page.locator(".wedding-atmosphere")).toHaveCount(0);
    const response = await page.goto("/invite/invalid");
    expect(response.status()).toBe(404);
    await expect(
        page.getByText(
            /We couldn.t find this invitation. Please check your personal link\./,
        ),
    ).toBeVisible();
});
