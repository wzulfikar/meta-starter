# MSW in Tests

Use MSW (Mock Service Worker) for integration tests that cross a network boundary. It intercepts at the network layer rather than patching `fetch`, so component code runs exactly as it would in production.

## Three kinds of tests

**Unit tests:** test an individual function or component in isolation. No real I/O, no network, no other components.

**Integration tests:** test multiple functions or components working together, including real rendering, state transitions, and side effects. When the subject crosses a network boundary, use MSW to mock the response.

**E2e tests:** run against a real running instance of the app and its services (e.g. Playwright, Maestro). These are slow by nature and reserved for critical paths.

Fast tests = unit + integration, slow tests = e2e.

## Why MSW over mocking fetch

Mocking `fetch` or `axios` directly ties tests to implementation details. MSW intercepts at the network boundary, which means:

- Your HTTP client code (headers, serialization, error handling) runs for real
- Handlers are reusable across test environments and even the browser during development
- Tests break for the right reasons: actual behavior changes, not fetch call site changes

## MSW or nock?

Both intercept at the network layer rather than patching `fetch`. The difference is environment.

**MSW** works in both browser and Node. Use it when testing UI components or hooks, or when you want the same handlers shared between dev (browser Service Worker) and tests (`msw/node`).

**nock** is Node-only. Use it when testing pure Node code: API clients, server-side route handlers, scripts. No browser story, but simpler setup for Node-only codebases.

If you are already using MSW for component tests, use it for Node tests too via `msw/node` and keep one handler set. Only reach for nock if there are no browser-side tests and you prefer its explicit, per-test intercept style.

## When to use MSW

Use it when the test subject has a network boundary: a component that calls an endpoint, a form that submits to an API, a hook that fetches data.

Skip it for pure unit tests with no network involvement.

## The pattern

Define handlers once, share them across tests:

```ts
// src/test/handlers.ts
import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("/api/contact", () => {
    return HttpResponse.json({ success: true });
  }),

  http.post("/api/contact/error", () => {
    return HttpResponse.json({ message: "Server error" }, { status: 500 });
  }),
];
```

Set up the server in your test setup file:

```ts
// src/test/setup.ts
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Example: form submit with success and error paths

```tsx
// ContactForm.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "@/test/setup";
import { ContactForm } from "./ContactForm";

test("shows success message after submit", async () => {
  render(<ContactForm />);

  await userEvent.type(screen.getByLabelText("Email"), "user@example.com");
  await userEvent.type(screen.getByLabelText("Message"), "Hello");
  await userEvent.click(screen.getByRole("button", { name: "Send" }));

  expect(await screen.findByText("Message sent!")).toBeInTheDocument();
});

test("shows error message when request fails", async () => {
  server.use(
    http.post("/api/contact", () => {
      return HttpResponse.json({ message: "Server error" }, { status: 500 });
    }),
  );

  render(<ContactForm />);

  await userEvent.type(screen.getByLabelText("Email"), "user@example.com");
  await userEvent.type(screen.getByLabelText("Message"), "Hello");
  await userEvent.click(screen.getByRole("button", { name: "Send" }));

  expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
});
```

Per-test overrides via `server.use(...)` let you test error paths without separate handler files. The override is reset after each test by `server.resetHandlers()`.

## File structure

```
src/
  test/
    setup.ts       # server setup, beforeAll/afterAll
    handlers.ts    # default happy-path handlers
  components/
    ContactForm.tsx
    ContactForm.test.tsx
```
