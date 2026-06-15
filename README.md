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
