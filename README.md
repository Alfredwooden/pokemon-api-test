# Pokémon Browser

A small Pokédex browser built with React and [XState](https://xstate.js.org/), powered by the [PokéAPI](https://pokeapi.co/). Application behaviour is driven by an explicit state machine rather than scattered loading/error flags.

## Features

- **Search** — Look up a Pokémon by name or ID and view its name, types, and base stats
- **Browse** — Paginated list of all Pokémon (20 per page) with previous/next navigation
- **Feedback** — Clear loading and error states, with retry and back-to-list actions

## Tech Stack

- React 19 + Vite
- XState 5 + `@xstate/react`
- [PokéAPI](https://pokeapi.co/api/v2/) (no API key required)

## Getting Started

```bash
pnpm install
pnpm dev
```

Other scripts:

```bash
pnpm build    # production build
pnpm preview  # preview production build
pnpm lint     # run ESLint
```

## State Machine Design

All async behaviour lives in `src/state/pokemonMachine.jsx`. The machine has five top-level states:

| State | Description |
|-------|-------------|
| `idle` | Initial state; accepts `FETCH_LIST` or `SEARCH` |
| `loadingList` | Fetches a paginated list from the API |
| `loadingDetail` | Fetches a single Pokémon by name or ID |
| `successList` | Displays the current page; supports pagination and search |
| `successDetail` | Displays Pokémon detail; supports search and back navigation |
| `failure` | Shows the error message; supports `RETRY` or `BACK_TO_LIST` |

Data fetching is handled via XState promise actors (`fromPromise`), keeping side effects out of the UI layer. Context holds `offset`, `listData`, `selectedPokemon`, `searchQuery`, and `error`.

### Events

| Event | Triggered by |
|-------|--------------|
| `FETCH_LIST` | App mount, retry after a list failure |
| `SEARCH` | Search form submit, clicking a list item |
| `NEXT_PAGE` / `PREV_PAGE` | Pagination buttons |
| `BACK_TO_LIST` | Back button, error recovery |
| `RETRY` | Retry button on failure |

## Project Structure

```
src/
├── App.jsx                  # UI wired to the state machine
├── main.jsx                 # React entry point
└── state/
    └── pokemonMachine.jsx   # XState machine and API actors
```

## What I'd Do Next

- Add unit tests for the state machine transitions (e.g. with `@xstate/test`)
- Persist the current page offset in the URL for shareable links
- Debounce search input and support keyboard navigation in the list
- Add request caching to avoid re-fetching recently viewed Pokémon
