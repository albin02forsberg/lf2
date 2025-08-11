import time
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Go to signup page
    page.goto("http://localhost:3000/signup")

    # Generate random user credentials
    import random
    import string
    random_string = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    email = f"testuser_{random_string}@example.com"
    password = "password123"

    # Fill out the signup form
    page.get_by_label("Email").fill(email)
    page.get_by_label("Password").fill(password)
    page.get_by_role("button", name="Sign Up").click()

    # After signup, it should redirect to the main page.
    # Wait for the main page to load and the dashboard header to be visible.
    expect(page.get_by_role("heading", name="Dashboard")).to_be_visible()

    # Take a screenshot of the main page with the new layout
    page.screenshot(path="../jules-scratch/verification/main_layout.png")

    # Click the profile button to open the dropdown
    profile_button = page.locator('img[alt=""]').first
    profile_button.click()

    # Wait for the dropdown to be visible
    expect(page.get_by_text("Your Profile")).to_be_visible()

    # Take a screenshot of the open dropdown
    page.screenshot(path="../jules-scratch/verification/profile_dropdown.png")

    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
