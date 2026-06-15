import { createMachine, assign, fromPromise } from "xstate";

// 1. Define your async fetchers as Promise Actors
const fetchPokemonList = fromPromise(async ({ input }) => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${input.offset}`,
  );
  if (!response.ok) throw new Error("Failed to fetch list");
  return response.json();
});

const fetchPokemonDetail = fromPromise(async ({ input }) => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${input.query.toLowerCase()}`,
  );
  if (!response.ok) throw new Error("Pokémon not found");
  return response.json();
});

// 2. Build the Machine
export const pokemonMachine = createMachine({
  id: "pokemon",
  initial: "idle",
  context: {
    offset: 0,
    listData: null,
    selectedPokemon: null,
    searchQuery: "",
    error: null,
  },
  states: {
    idle: {
      on: {
        FETCH_LIST: "loadingList",
        SEARCH: {
          target: "loadingDetail",
          actions: assign({
            searchQuery: ({ event }) => event.query,
            offset: 0,
          }),
        },
      },
    },
    loadingList: {
      invoke: {
        src: fetchPokemonList,
        input: ({ context }) => ({ offset: context.offset }),
        onDone: {
          target: "successList",
          actions: assign({
            listData: ({ event }) => event.output,
            error: null,
          }),
        },
        onError: {
          target: "failure",
          actions: assign({ error: ({ event }) => event.error.message }),
        },
      },
    },
    loadingDetail: {
      invoke: {
        src: fetchPokemonDetail,
        input: ({ context }) => ({ query: context.searchQuery }),
        onDone: {
          target: "successDetail",
          actions: assign({
            selectedPokemon: ({ event }) => event.output,
            error: null,
          }),
        },
        onError: {
          target: "failure",
          actions: assign({ error: ({ event }) => event.error.message }),
        },
      },
    },
    successList: {
      on: {
        NEXT_PAGE: {
          target: "loadingList",
          actions: assign({ offset: ({ context }) => context.offset + 20 }),
        },
        PREV_PAGE: {
          target: "loadingList",
          actions: assign({
            offset: ({ context }) => Math.max(0, context.offset - 20),
          }),
        },
        SEARCH: {
          target: "loadingDetail",
          actions: assign({ searchQuery: ({ event }) => event.query }),
        },
      },
    },
    successDetail: {
      on: {
        BACK_TO_LIST: "loadingList",
        SEARCH: {
          target: "loadingDetail",
          actions: assign({ searchQuery: ({ event }) => event.query }),
        },
      },
    },
    failure: {
      on: {
        RETRY: {
          // Smart logic: retry whichever operation failed based on context
          target: "idle",
          actions: ({ context, self }) => {
            if (context.searchQuery) {
              self.send({ type: "SEARCH", query: context.searchQuery });
            } else {
              self.send({ type: "FETCH_LIST" });
            }
          },
        },
        BACK_TO_LIST: "loadingList",
      },
    },
  },
});
