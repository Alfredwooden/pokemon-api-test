import { useState } from 'react';
import { useMachine } from '@xstate/react';
import { pokemonMachine } from './state/pokemonMachine';
import './App.css';

export default function App() {
  const [state, send] = useMachine(pokemonMachine);
  const [searchInput, setSearchInput] = useState('');
  const { listData, selectedPokemon, error, offset } = state.context;

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (query) {
      send({ type: 'SEARCH', query });
    }
  };

  return (
    <div className="app">
      <h1 className="app__title">Pokédex</h1>

      {/* Global Search Bar */}
      <form className="search-form" onSubmit={handleSearch}>
        <input
          className="search-form__input"
          type="text"
          placeholder="Search by name or ID..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button className="search-form__button" type="submit">Search</button>
      </form>

      <hr className="divider" />

      {/* 1. LOADING STATES */}
      {state.matches('loadingList') && <p className="loading">Loading Pokémon list...</p>}
      {state.matches('loadingDetail') && <p className="loading">Searching for Pokémon...</p>}

      {/* 2. FAILURE STATE */}
      {state.matches('failure') && (
        <div className="error">
          <p className="error__message">Error: {error}</p>
          <button className="error__retry-button" onClick={() => send({ type: 'RETRY' })}>🔄 Retry</button>
          <button className="error__back-button" onClick={() => send({ type: 'BACK_TO_LIST' })}>Back to List</button>
        </div>
      )}

      {/* 3. SUCCESS: LIST VIEW */}
      {state.matches('successList') && listData && (
        <div className="pokemon-list">
          <h3 className="pokemon-list__title">All Pokémon</h3>
          <ul className="pokemon-list__items">
            {listData.results.map((p) => (
              <li key={p.name}>
                <button
                  type="button"
                  className="pokemon-list__item"
                  onClick={() => send({ type: 'SEARCH', query: p.name })}
                >
                  {p.name}
                </button>
              </li>
            ))}
          </ul>
          <div className="pagination">
            <button className="pagination__button" onClick={() => send({ type: 'PREV_PAGE' })} disabled={offset === 0}>Previous</button>
            <span className="pagination__info"> Page {offset / 20 + 1} </span>
            <button className="pagination__button" onClick={() => send({ type: 'NEXT_PAGE' })} disabled={!listData.next}>Next</button>
          </div>
        </div>
      )}

      {/* 4. SUCCESS: DETAIL VIEW */}
      {state.matches('successDetail') && selectedPokemon && (
        <div className="pokemon-detail">
          <button className="pokemon-detail__back-button" onClick={() => send({ type: 'BACK_TO_LIST' })}>← Back to List</button>
          <h2 className="pokemon-detail__name">{selectedPokemon.name.toUpperCase()} (#{selectedPokemon.id})</h2>

          <h4 className="pokemon-detail__section-title">Types:</h4>
          <ul className="pokemon-detail__list">
            {selectedPokemon.types.map(t => <li key={t.type.name} className="pokemon-detail__item">{t.type.name}</li>)}
          </ul>

          <h4 className="pokemon-detail__section-title">Base Stats:</h4>
          <ul className="pokemon-detail__list">
            {selectedPokemon.stats.map(s => (
              <li key={s.stat.name} className="pokemon-detail__item pokemon-detail__item--stat">
                <span className="pokemon-detail__stat-name">{s.stat.name.replaceAll('-', ' ')}</span>
                <span className="pokemon-detail__stat-value">{s.base_stat}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
