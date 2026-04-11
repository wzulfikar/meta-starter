# Starter Docs

Collection of scripts, configs, documentations,and LLM prompts to add to your favorite starter/template repositories.

## Why

You have your favorite starter template but there are things that you don't quite like it and so you want to change. With AI agents, it's easy now but you still want some structure. This repo helps with that.

## How it works

I have starter templates that I like. For example, [supa-next-starter](https://github.com/michaeltroya/supa-next-starter) is my default when I want to start a web app project. However, I want to use specific things, like `biome` instead of `eslint`, `tsgo` instead of `tsc`. Instead of tweaking the template manually, I can:

1. Clone the template like usual, e.g. into `my-app`
2. Copy everything in template's folder to the app folder, e.g. from `starter-docs/supa-next-starter/*` to `my-app/`
3. Use AI agent to start the tweak by including `docs/agents/customize-starter-template.md`. The markdown file contains prompt to modify the template to my liking.

With this approach, I can keep my preference and replicate it when starting new projects, without having to keep up with the changes in upstream (because AI agent will handle it on demand).

Hope it helps :)

## Common Tech Stack

Tech stack I use in different platforms.

- Typescript and tsgo: I use Typescript in all platform and will use `tsgo` where possible. It's still in preview but I find it works well so far in all my codebase.
- Tailwind (and ShadCN) for styling: Tailwind works with web platform for web and desktop (Wails is just webview). In Expo, I use compile-time Tailwind library like [mgcrea/react-native-tailwind](https://github.com/mgcrea/react-native-tailwind)
- Biome: faster than eslint/prettier
- Bun for runtime, package manager, and test: Always use bun when possible. When not possible (eg. for test in react-native), use the recommended tool like jest but still wrap it nicely in package.json, eg. having `bun test:all` which run split test for bun test and jest.
- `ky` for fetch and api wrapper: good api interface, good types
- `type-fest`
- `saas-maker`: error handling, route utils
