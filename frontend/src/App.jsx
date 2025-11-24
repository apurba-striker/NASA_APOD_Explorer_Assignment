import { useState, useEffect } from 'react';
import './App.css';

const API_BASE = 'https://nasa-apod-explorer-assignment.onrender.com';

function App() {
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [view, setView] = useState('daily');
  const [gallery, setGallery] = useState([]);

  const fetchApod = async (selectedDate) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}?date=${selectedDate}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to fetch');
      }
      const data = await res.json();
      setApod(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchGallery = async () => {
    setLoading(true);
    setView('gallery');
    try {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 10);

      const startStr = start.toISOString().split('T')[0];
      const endStr = end.toISOString().split('T')[0];

      const res = await fetch(`${API_BASE}?start_date=${startStr}&end_date=${endStr}`);
      if (!res.ok) throw new Error('Failed to fetch gallery');

      const data = await res.json();

      if (Array.isArray(data)) {
        setGallery(data.reverse());
      } else {
        throw new Error(data.error || 'Invalid data format');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'daily') fetchApod(date);
  }, [date, view]);

  return (
    <div className="app-container">
      <header>
        <h1>NASA APOD Explorer</h1>
        <nav>
          <button
            onClick={() => setView('daily')}
            className={view === 'daily' ? 'active' : ''}
          >
            Today
          </button>
          <button
            onClick={fetchGallery}
            className={view === 'gallery' ? 'active' : ''}
          >
            Recent Gallery
          </button>
        </nav>
      </header>

      {loading && <div className="loader">Loading Space Data...</div>}
      {error && <div className="error">Error: {error}</div>}

      {!loading && !error && view === 'daily' && apod && (
        <div className="daily-view">
          <div className="controls">
            <label>Pick a Date: </label>
            <input
              type="date"
              value={date}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="media-card">
            {apod.media_type === 'video' ? (
              <iframe
                title={apod.title}
                src={apod.url}
                allowFullScreen
              />
            ) : (
              <img src={apod.url} alt={apod.title} />
            )}
            <div className="info">
              <h2>{apod.title}</h2>
              <p className="date">{apod.date}</p>
              <p className="desc">{apod.explanation}</p>
              <span className="copyright">© {apod.copyright || 'Public Domain'}</span>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && view === 'gallery' && (
        <div className="gallery-grid">
          {gallery.map((item) => (
            <div
              key={item.date}
              className="gallery-item"
              onClick={() => {
                setApod(item);
                setDate(item.date);
                setView('daily');
              }}
            >
              <img
                src={item.thumbnail_url || item.url}
                alt={item.title}
                loading="lazy"
              />
              <div className="overlay">
                <h3>{item.title}</h3>
                <p>{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
