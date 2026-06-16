// Using XState since the company uses this framework.
import { createMachine, assign, fromPromise } from "xstate";

// Fetch list of pokemons
const fetchPokemonList = fromPromise(async ({ input }) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${input.offset}`);
  if (!response.ok) throw new Error("Failed to fetch list");
  return response.json();
});

// Fetch details of a pokemon
const fetchPokemonDetail = fromPromise(async ({ input }) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${input.query.toLowerCase().trim()}`);
  if (!response.ok) throw new Error("Pokémon not found");
  return response.json();
});

// State machine
export const pokemonMachine = createMachine({
  id: "pokemon",
  initial: "loadingList",
  // Context of the state machine
  context: {
    offset: 0,
    listData: null,
    selectedPokemon: null,
    searchQuery: "",
    error: null,
  },
  // States of the state machine
  states: {
    // Loading list of pokemons
    loadingList: {
      // Clear selected pokemon when loading list
      entry: assign({ selectedPokemon: null }),
      // Fetch list of pokemons
      invoke: {
        src: fetchPokemonList,
        input: ({ context }) => ({ offset: context.offset }),
        onDone: {
          target: "successList",
          actions: assign({ listData: ({ event }) => event.output, error: null }),
        },
        onError: {
          target: "failure",
          actions: assign({ error: ({ event }) => event.error.message }),
        },
      },
    },
    // Loading details of a pokemon
    loadingDetail: {
      // Clear error when loading detail
      entry: assign({ error: null }),
      // Fetch details of a pokemon
      invoke: {
        src: fetchPokemonDetail,
        input: ({ context }) => ({ query: context.searchQuery }),
        onDone: {
          target: "successDetail",
          actions: assign({ selectedPokemon: ({ event }) => event.output, error: null }),
        },
        onError: {
          target: "failure",
          actions: assign({ error: ({ event }) => event.error.message }),
        },
      },
    },
    // Successfully loaded list of pokemons
    successList: {
      // Actions when next page is clicked
      on: {
        NEXT_PAGE: {
          target: "loadingList",
          actions: assign({ offset: ({ context }) => context.offset + 20 }),
        },
        PREV_PAGE: {
          target: "loadingList",
          actions: assign({ offset: ({ context }) => Math.max(0, context.offset - 20) }),
        },
        SEARCH: {
          guard: ({ event }) => !!event.query?.trim(),
          target: "loadingDetail",
          actions: assign({ searchQuery: ({ event }) => event.query.trim() }),
        },
      },
    },
    // Successfully loaded details of a pokemon
    successDetail: {
      // Actions when back to list is clicked
      on: {
        BACK_TO_LIST: {
          target: "loadingList",
          actions: assign({ searchQuery: "" }),
        },
        // Actions when search is clicked
        SEARCH: {
          guard: ({ event }) => !!event.query?.trim(),
          target: "loadingDetail",
          actions: assign({ searchQuery: ({ event }) => event.query.trim() }),
        },
      },
    },
    // Failed to load list of pokemons or details of a pokemon
    failure: {
      // Actions when retry is clicked
      on: {
        RETRY: [
          {
            // Guard to check if search query is not empty
            guard: ({ context }) => !!context.searchQuery,
            target: "loadingDetail",
          },
          {
            target: "loadingList",
          },
        ],
        BACK_TO_LIST: {
          target: "loadingList",
          actions: assign({ searchQuery: "" }),
        },
      },
    },
  },
});