import { useCallback, useEffect, useState } from 'react';
import { useReview } from './store/useReview';
import { Sidebar } from './components/Sidebar';
import { DeckView } from './components/DeckView';
import { GalleryView } from './components/GalleryView';
import { ToastContainer, pushToast } from './components/Toast';
import { useAutoIntake } from './hooks/useAutoIntake';

export type View = 'deck' | 'gallery';

export function App() {
  const hydrate = useReview((s) => s.hydrate);
  const initialized = useReview((s) => s.initialized);
  const [view, setView] = useState<View>('deck');

  const onNew = useCallback((n: number) => {
    pushToast(`${n} new asset${n > 1 ? 's' : ''} from Cursor`);
  }, []);
  useAutoIntake(onNew);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  if (!initialized) {
    return (
      <div className="app-shell">
        <div />
        <div className="content">
          <div className="deck-area">
            <div className="deck-empty">
              <h2>Loading</h2>
              <p>Restoring your review session.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar view={view} setView={setView} />
      <div className="content">
        {view === 'deck' ? <DeckView /> : <GalleryView />}
      </div>
      <ToastContainer />
    </div>
  );
}
