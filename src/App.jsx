import { useEffect, useState } from 'react';
import { useMachine } from '@xstate/react';
import { pokemonMachine } from './state/pokemonMachine';

export default function App() {
  const [state, send] = useMachine(pokemonMachine);
  const [searchInput, setSearchInput] = useState('');
  const { listData, selectedPokemon, error, offset } = state.context;

  // Trigger initial fetch on load
  useEffect(() => {
    send({ type: 'FETCH_LIST' });
  }, [send]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      send({ type: 'SEARCH', query: searchInput });
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Pokédex (XState Powered)</h1>

      {/* Global Search Bar */}
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          placeholder="Search by name or ID..." 
          value={searchInput} 
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <hr />

      {/* 1. LOADING STATES */}
      {state.matches('loadingList') && <p>Loading Pokémon list...</p>}
      {state.matches('loadingDetail') && <p>Searching for Pokémon...</p>}

      {/* 2. FAILURE STATE */}
      {state.matches('failure') && (
        <div style={{ color: 'red' }}>
          <p>Error: {error}</p>
          <button onClick={() => send({ type: 'RETRY' })}>🔄 Retry</button>
          <button onClick={() => send({ type: 'BACK_TO_LIST' })}>Back to List</button>
        </div>
      )}

      {/* 3. SUCCESS: LIST VIEW */}
      {state.matches('successList') && listData && (
        <div>
          <h3>All Pokémon</h3>
          <ul>
            {listData.results.map((p) => (
              <li key={p.name} style={{ cursor: 'pointer', color: 'blue' }} onClick={() => send({ type: 'SEARCH', query: p.name })}>
                {p.name}
              </li>
            ))}
          </ul>
          <button onClick={() => send({ type: 'PREV_PAGE' })} disabled={offset === 0}>Previous</button>
          <span> Page {offset / 20 + 1} </span>
          <button onClick={() => send({ type: 'NEXT_PAGE' })} disabled={!listData.next}>Next</button>
        </div>
      )}

      {/* 4. SUCCESS: DETAIL VIEW */}
      {state.matches('successDetail') && selectedPokemon && (
        <div>
          <button onClick={() => send({ type: 'BACK_TO_LIST' })}>← Back to List</button>
          <h2>{selectedPokemon.name.toUpperCase()} (#{selectedPokemon.id})</h2>
          
          <h4>Types:</h4>
          <ul>
            {selectedPokemon.types.map(t => <li key={t.type.name}>{t.type.name}</li>)}
          </ul>

          <h4>Base Stats:</h4>
          <ul>
            {selectedPokemon.stats.map(s => (
              <li key={s.stat.name}>
                <strong>{s.stat.name}:</strong> {s.base_stat}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}