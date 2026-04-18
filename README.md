# Frontend Auth and Session Usage

This frontend now uses a shared session provider. You do not need to fetch
`/api/auth/session` manually inside every page.

## Where Session State Comes From

- `SessionProvider` is mounted in [src/main.tsx](/home/fixn/Documents/cni/frontend/src/main.tsx).
- `useSession()` is re-exported from [src/hooks/useSession.ts](/home/fixn/Documents/cni/frontend/src/hooks/useSession.ts).
- The provider logic lives in [src/providers/SessionProvider.tsx](/home/fixn/Documents/cni/frontend/src/providers/SessionProvider.tsx).

## What `useSession()` Gives You

Inside any component under `SessionProvider`, you can read:

- `user`: the signed-in user object or `null`
- `session`: the raw session object from the backend
- `isAuthenticated`: `true` when the user is signed in
- `isLoading`: `true` while the app is checking the session
- `error`: session-related error message
- `refreshSession()`: re-fetch the latest session from the backend
- `signOut()`: sign the user out

## Using Session Data In The Dashboard

Use the hook directly inside the dashboard page:

```tsx
import { useSession } from "../hooks/useSession";

const ClientDashboard = () => {
  const { user, session, isAuthenticated, isLoading, signOut } = useSession();

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  if (!isAuthenticated || !user) {
    return <div>No active session</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name ?? user.email}</h1>
      <p>Email: {user.email}</p>
      <p>User ID: {user.id}</p>
      <p>Session ID: {String(session?.id ?? "N/A")}</p>

      <button onClick={() => void signOut()}>Sign out</button>
    </div>
  );
};
```

## Recommended Pattern For This Project

For [src/pages/ClientDashboard.tsx](/home/fixn/Documents/cni/frontend/src/pages/ClientDashboard.tsx):

1. Import `useSession`.
2. Read `user` from the hook.
3. Replace hardcoded values like `JD` and demo text with real session values.

Example:

```tsx
const { user } = useSession();

const initials =
  user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "CN";
```

Then use it like:

```tsx
<AvatarFallback>{initials}</AvatarFallback>
<h1>Welcome back, {user?.name ?? "Client"}</h1>
<p>{user?.email}</p>
```

## When To Use `session` vs `user`

- Use `user` for UI: name, email, avatar, greeting, profile labels.
- Use `session` for auth metadata: session id, expiry, future role flags, or audit info.

## Future Upgrades

This structure is ready for future additions such as:

- role-based dashboards
- admin/client branching
- sign-out buttons in the navbar
- refresh after profile updates
- protected API calls using the same session state

## Email Verification And Password Reset

The frontend auth flow now supports:

- email verification after sign-up
- resend verification email
- forgot password request
- reset password form via emailed token

Routes:

- `/verify-email`
- `/forgot-password`
- `/reset-password`

Backend endpoints used by the frontend:

- `POST /api/auth/send-verification-email`
- `GET /api/auth/verify-email`
- `POST /api/auth/request-password-reset`
- `POST /api/auth/reset-password`

## Important Note

Protected pages like `/dashboard` are already guarded by the router. That means:

- signed-out users are redirected to `/login`
- signed-in users are redirected away from `/login` and `/register`

So inside the dashboard, you usually just read `user` and render the page.
