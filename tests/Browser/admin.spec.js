import { test, expect } from "@playwright/test";
import { execFileSync } from "node:child_process";
const php = process.env.PHP_BINARY || "php";
let credentials;
test.beforeAll(() => {
    credentials = JSON.parse(
        execFileSync(php, ["tests/Browser/fixture.php"], { encoding: "utf8" }),
    );
});
test.afterAll(() => {
    if (credentials)
        execFileSync(php, [
            "tests/Browser/fixture.php",
            "cleanup",
            credentials.email,
        ]);
});
test("admin creates, copies, edits, deactivates and regenerates a personalized invitation", async ({
    page,
    context,
}) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/admin/invitees");
    await expect(page).toHaveURL(/\/login$/);
    await page.getByLabel("Email address").fill(credentials.email);
    await page
        .getByLabel("Password", { exact: true })
        .fill(credentials.password);
    await page.getByRole("button", { name: "Enter the studio" }).click();
    await page.getByRole("link", { name: "Add invitee", exact: true }).click();
    await page.getByLabel("Guest / family name").fill("Mr. & Mrs. Fernando");
    await page.getByLabel("Email").fill(credentials.email);
    await page
        .getByRole("button", { name: "Create invitation", exact: true })
        .click();
    await expect(page.getByRole("status")).toContainText(
        "Invitation created successfully",
    );
    const original = await page
        .getByLabel("Personal invitation link")
        .inputValue();
    await page.getByRole("button", { name: "Copy link" }).click();
    await expect(
        page.getByText("Invitation link copied", { exact: true }),
    ).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
        original,
    );
    const guestPage = await context.newPage();
    await guestPage.goto(original);
    await expect(
        guestPage.getByText("Mr. & Mrs. Fernando", { exact: true }),
    ).toBeVisible();
    await guestPage.reload();
    await page.reload();
    await expect(page.locator(".detail-meta")).toContainText("1");
    await page.getByRole("link", { name: "Edit details" }).click();
    await page.getByLabel("Guest / family name").fill("The Fernando Family");
    await page.getByRole("button", { name: "Save changes" }).click();
    await page.getByRole("button", { name: "Deactivate invitation" }).click();
    await expect(page.locator(".badge")).toHaveText("Inactive");
    await guestPage.reload();
    await expect(
        guestPage.getByText("This invitation is currently unavailable."),
    ).toBeVisible();
    await page
        .getByRole("button", { name: "Activate invitation", exact: true })
        .click();
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Regenerate link" }).click();
    await expect(page.getByRole("status")).toContainText("New link created");
    const next = await page.getByLabel("Personal invitation link").inputValue();
    expect(next).not.toBe(original);
    expect((await guestPage.goto(original)).status()).toBe(404);
    await guestPage.goto(next);
    await expect(
        guestPage.getByText("The Fernando Family", { exact: true }),
    ).toBeVisible();
    await page.getByRole("link", { name: "Back to guest list" }).click();
    expect(
        await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
        ),
    ).toBeTruthy();
    await page.screenshot({
        path: "test-results/admin-mobile.png",
        fullPage: true,
    });
    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/login$/);
});
