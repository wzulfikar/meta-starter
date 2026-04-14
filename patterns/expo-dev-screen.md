# Expo Dev Screen

A hidden debugging screen for development and review builds. Gives you a controlled environment to reset state, inspect logs, and reproduce issues without touching production users.

## When to use it

Add this screen when you need to:

- Reset app to a clean slate (clear storage, auth, cache)
- Inspect recent network requests or errors
- Trigger edge cases that are hard to reproduce manually
- Give reviewers and QA a way to reproduce scenarios without a manual setup guide

Remove it before the public release. Keep it in during App Store review — reviewers sometimes need to see it, and it makes debugging review rejections much easier.

## Access model

Two access modes depending on who is using the build:

| Build                 | Access                                             |
| --------------------- | -------------------------------------------------- |
| Dev (Expo Go / local) | Icon visible in Home screen                        |
| Pre-release (review)  | Icon hidden, but still accessible via tap sequence |
| Production            | Not accessible                                     |

The tap sequence (e.g. 5 taps on the app version label) gives reviewers and QA a path in without exposing the screen to normal users.

Example file structure:

```
src/
  screens/
    DevScreen.tsx
  hooks/
    useMultiTap.ts
```
