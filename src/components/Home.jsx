import React, { useState } from 'react';

const Home = () => {
  const [pokemon, setPokemon] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setError(null);
    setPokemon(null);

    const apiUrl = `https://localhost:7064/api/Pokemon/name/${searchTerm.trim().toLowerCase()}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setPokemon(data);
    } catch (err) {
      setError(`${err.message} - This may be a CORS issue or the API is not running.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get a gradient background based on Pokémon type
  const getTypeGradient = (type) => {
    const typeColors = {
      fire: 'linear-gradient(135deg, #ff9d54, #ff4747)',
      water: 'linear-gradient(135deg, #5090d6, #0a51a1)',
      grass: 'linear-gradient(135deg, #63bd5b, #216d00)',
      electric: 'linear-gradient(135deg, #f8d030, #a88600)',
      psychic: 'linear-gradient(135deg, #ff6eb4, #cc3380)',
      ice: 'linear-gradient(135deg, #8ed2d2, #45a8a8)',
      dragon: 'linear-gradient(135deg, #7766ee, #5544aa)',
      dark: 'linear-gradient(135deg, #775544, #332211)',
      fairy: 'linear-gradient(135deg, #ffacff, #ff85ff)',
      normal: 'linear-gradient(135deg, #9099a1, #6d7886)',
      fighting: 'linear-gradient(135deg, #cf3f6a, #901a3d)',
      flying: 'linear-gradient(135deg, #92aade, #5d76b5)',
      poison: 'linear-gradient(135deg, #ab69c7, #682a9f)',
      ground: 'linear-gradient(135deg, #d97845, #a43f12)',
      rock: 'linear-gradient(135deg, #c7b78b, #8b7d41)',
      bug: 'linear-gradient(135deg, #91c12f, #5f8a00)',
      ghost: 'linear-gradient(135deg, #5269ac, #2d3c85)',
      steel: 'linear-gradient(135deg, #5a8ea1, #2d616f)',
    };
    
    return typeColors[type?.toLowerCase()] || 'linear-gradient(135deg, #9099a1, #6d7886)';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.titleContainer}>
          <h1 style={styles.heading}>Pokédex</h1>
          <p style={styles.subheading}>Search for your favorite Pokémon</p>
        </div>
     
      </div>

      <form onSubmit={handleSearch} style={styles.form}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter Pokémon name (e.g. Pikachu)"
          style={styles.input}
        />
        <button type="submit" style={styles.button} disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>

      {isLoading && (
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Catching Pokémon data...</p>
        </div>
      )}

      {error && (
        <div style={styles.errorBox}>
          <div style={styles.errorIcon}>!</div>
          <div>
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      {pokemon && (
        <div style={{
          ...styles.card,
          background: getTypeGradient(pokemon.type)
        }}>
          <div style={styles.cardContent}>
            <h2 style={styles.cardTitle}>{pokemon.name}</h2>
            <div style={styles.pokeId}>#{String(pokemon.id).padStart(3, '0')}</div>
            
            <div style={styles.typeContainer}>
              <div style={styles.typeTag}>{pokemon.type}</div>
              {pokemon.secondaryType && (
                <div style={styles.typeTag}>{pokemon.secondaryType}</div>
              )}
            </div>
            
            <div style={styles.detailsContainer}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Generation</span>
                <span style={styles.detailValue}>{pokemon.generation}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!pokemon && !isLoading && !error && searchTerm && (
        <div style={styles.emptyState}>
          <div style={styles.emptyStateIcon}>?</div>
          <p>No Pokémon found matching "{searchTerm}"</p>
          <p style={styles.emptyStateHint}>Try checking the spelling or search for a different Pokémon</p>
        </div>
      )}
      
      {!searchTerm && !isLoading && !pokemon && !error && (
        <div style={styles.welcomeState}>
          <p>Enter a Pokémon name above to begin your search!</p>
          <p style={styles.suggestions}>Popular searches: Charizard, Squirtle, Bulbasaur</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '650px',
    margin: '40px auto',
    padding: '30px 40px 40px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    borderRadius: '24px',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    position: 'relative'
  },
  titleContainer: {
    flex: '1'
  },
  heading: {
    fontSize: '36px',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
    color: '#263238',
    position: 'relative'
  },
  subheading: {
    margin: '0',
    fontSize: '16px',
    color: '#546e7a',
    fontWeight: 'normal'
  },
  form: {
    display: 'flex',
    gap: '12px',
    marginBottom: '25px'
  },
  input: {
    padding: '16px 20px',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    width: '100%',
    fontSize: '16px',
    transition: 'border-color 0.3s',
    outline: 'none',
    '&:focus': {
      borderColor: '#3f51b5'
    }
  },
  button: {
    padding: '0 30px',
    backgroundColor: '#ee1515',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s',
    minWidth: '120px',
    '&:hover': {
      backgroundColor: '#d10a0a',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(238, 21, 21, 0.3)'
    },
    '&:disabled': {
      backgroundColor: '#ccc',
      cursor: 'not-allowed'
    }
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '30px',
    backgroundColor: '#f5f5f5',
    borderRadius: '12px',
    marginBottom: '20px'
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(0, 0, 0, 0.1)',
    borderLeftColor: '#ee1515',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    marginTop: '15px',
    color: '#666',
    fontSize: '16px'
  },
  errorBox: {
    padding: '20px',
    backgroundColor: '#ffebee',
    borderRadius: '12px',
    color: '#d32f2f',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  errorIcon: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: '#d32f2f',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold'
  },
  card: {
    padding: '25px',
    borderRadius: '16px',
    color: 'white',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
    position: 'relative',
    overflow: 'hidden'
  },
  cardContent: {
    position: 'relative',
    zIndex: 2
  },
  cardTitle: {
    margin: '0 0 5px 0',
    fontSize: '32px',
    fontWeight: 'bold',
    textTransform: 'capitalize',
    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
  },
  pokeId: {
    fontSize: '18px',
    fontWeight: 'bold',
    opacity: '0.8',
    marginBottom: '20px'
  },
  typeContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '25px'
  },
  typeTag: {
    padding: '8px 16px',
    borderRadius: '30px',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(5px)',
    textTransform: 'capitalize',
    fontSize: '15px',
    fontWeight: 'bold'
  },
  detailsContainer: {
    marginTop: '15px',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '12px',
    padding: '15px',
    backdropFilter: 'blur(5px)'
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px'
  },
  detailLabel: {
    fontWeight: 'bold',
    opacity: '0.9'
  },
  detailValue: {
    fontWeight: 'bold'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '16px',
    color: '#546e7a'
  },
  emptyStateIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#90a4ae',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '36px',
    margin: '0 auto 20px',
    fontWeight: 'bold'
  },
  emptyStateHint: {
    fontSize: '14px',
    opacity: '0.8',
    marginTop: '15px'
  },
  welcomeState: {
    textAlign: 'center',
    padding: '30px',
    backgroundColor: '#e8f5e9',
    borderRadius: '16px',
    color: '#2e7d32'
  },
  suggestions: {
    fontSize: '14px',
    color: '#439a46',
    marginTop: '10px'
  }
};

export default Home;