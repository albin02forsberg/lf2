from playwright.sync_api import sync_playwright, Page, expect

def run(page: Page):
    # Go to signup page and create a user
    page.goto("http://localhost:3000/signup")
    page.get_by_label("Email address").fill("admin@test.com")
    page.get_by_label("Password").fill("password")
    page.get_by_role("button", name="Create account").click()

    # Wait for navigation to the login page
    expect(page).to_have_url("http://localhost:3000/login")

    # Log in
    page.get_by_label("Email address").fill("admin@test.com")
    page.get_by_label("Password").fill("password")
    page.get_by_role("button", name="Sign in").click()

    # Wait for navigation to the home page
    expect(page).to_have_url("http://localhost:3000/")

    # Go to the admin permissions page
    page.goto("http://localhost:3000/admin/permissions")

    # Wait for the heading to be visible
    expect(page.get_by_role("heading", name="Manage Permissions")).to_be_visible()

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/admin_permissions_page.png")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    run(page)
    browser.close()
