# How to run

- pnpm install (Need Node 18+)
- pnpm dev
- Open http://localhost:5173/

# Overview

Build a small Pokémon browser application using the PokéAPI. The goal is not to build a polished UI, we're evaluating how you model application behaviour as a state machine and how you structure your code.

You may use any frontend language or framework. React is preferred.

## Requirements

Build a small application that lets a user:

- Search for a Pokémon by name or ID and view its name, types, and base stats
- Browse a paginated list of all Pokémon, moving forward and backward through pages
- See clear feedback when something is loading or when a request fails, with the ability to retry

Application behaviour should be driven by observable state, not scattered boolean flags or ad-hoc conditionals.

Transitions between states should be explicit and traceable, not implicit flag juggling.

## What We're Evaluating

- **State machine design:** Are states and transitions clearly defined? Is invalid state representable?
- **Project structure:** Is the code organised in a way that scales? Are concerns separated sensibly?
- **Data fetching:** How are async operations handled within the state machine?
- **No UI polish needed:** Plain HTML elements are fine. We are not evaluating CSS.

## Notes

- You may use established state machine frameworks, a hand-rolled reducer, or any other approach.
- External libraries are fine, but don't reach for one unless you have a reason.
- If you run out of time, leave a short note in the README on what you'd do next.

---

XState has been used as an external library since Ive catched that the company was working with it. All this machinery could have been done using `reducers` / `useEffect` / `useState` and would have the same results.

# TODO: 
- Search Handling: At the moment we only search when firing the submit, I would like to have more time to do some more updates like search when typing, but have to be done carefully to not hit the API too many times.
- Cache: I would cache the list so we dont have to search whatever items we have already searched or updated before. This way we can have a more responsive experience :)
- UI Updates: I asked cursor to generate a minimal interface of what I have, but I would do a proper UI indicating states all the states that are happening and giving more feedback to the user.
- Back to list: It's always re-fetching, I would like to implement a cache system so its not needed to refetch.
- State test: At the moment I dont have any unit test for the app or for the State Machines, I would like to implement vitest or xstate/test to help me with this.
- State management: At the moment I've everything living inside the `pokemonMachine.jsx`, but with more time I would separate this into actors and the state machines into different files (`services/` & `actors/`)