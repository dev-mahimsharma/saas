# Auth Behavior

This file documents the authentication behavior requested for the app.

## Sign In State In Navbar

- When the user is not signed in, the navbar shows a `Sign In` button.
- When the user is signed in, the navbar shows the user avatar instead of the `Sign In` button.
- Clicking the avatar opens a profile dropdown.
- The dropdown shows read-only user information:
  - name
  - email
- The dropdown includes a `Log Out` button.
- When the user logs out, the `Sign In` button appears again.

## Session Persistence

- If a user signs in and visits the website again while their session is still valid, they should remain signed in automatically.
- Sessions are configured as a 7-day sliding session.
- If the user does not visit the website for 7 days, they should be logged out for security.
- If the user keeps visiting the website within that 7-day window, the session stays active.

## Access Rules

- Users should be able to browse the website even if they are not signed in.
- Pages are not globally protected by auth.
- Users can still see the web development and app development pages without signing in.
- Users can still see the generate/download buttons without signing in.

## Protected Actions

- Users must be signed in to generate and download the project zip.
- This rule applies to web development flows.
- This rule applies to app development flows.
- This rule is enforced in the UI by redirecting unauthenticated users to the sign-in page when they try to generate/download.
- This rule is also enforced on the server in the generate API so the protection cannot be bypassed by calling the endpoint directly.

## Sign In Redirects

- If an unauthenticated user tries to generate/download, they are redirected to the sign-in page.
- After successful sign-in, they are sent back to the page they came from using `callbackUrl`.
- If a user is already signed in and opens the sign-in page, they are redirected away from it.

