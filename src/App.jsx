// src/App.jsx - Optimized with correct error handling
import React, { useEffect, memo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// Import pages
import GamePage from './pages/GamePage';
import ShopPage from './pages/ShopPage';
import MapPage from './pages/MapPage';
import CollectionPage from './pages/CollectionPage';
import EventPage from './pages/EventPage';
import RestPage from './pages/RestPage';

// Import components
import GameManager from './components/core/GameManager';
import LoadingScreen from './components/ui/LoadingScreen';
import ErrorScreen from './components/ui/ErrorScreen';
import SaveButton from './components/ui/SaveButton';

// Import thunks and actions
import { loadGame } from './redux/thunks/saveThunks';
import { setActionFeedback } from './redux/slices/uiSlice';
import { setGamePhase } from './redux/slices/gameSlice';

const App = () => {
  const dispatch = useDispatch();

  // Redux state
  const loading = useSelector((state) => state.ui?.loading);
  const error = useSelector((state) => state.ui?.error);

  // Initialize app on first load
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Try to load an existing game
        const result = await dispatch(loadGame()).unwrap();

        // If no save exists, log a message
        if (!result.success) {
          dispatch(
            setActionFeedback({
              message: 'Nouvelle partie démarrée',
              type: 'info',
            })
          );
          dispatch(setGamePhase('exploration'));
        }
      } catch (err) {
        console.error("Erreur lors de l'initialisation du jeu:", err);

        // Dispatch error feedback
        dispatch(
          setActionFeedback({
            message: "Erreur lors de l'initialisation. Une nouvelle partie a été créée.",
            type: 'error',
          })
        );

        // Ensure we're in exploration phase
        dispatch(setGamePhase('exploration'));
      }
    };

    initializeApp();
  }, [dispatch]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen message={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <GameManager>
        {/* Save button present on all pages */}
        <SaveButton />

        <Routes>
          <Route path="/" element={<GamePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/event" element={<EventPage />} />
          <Route path="/rest" element={<RestPage />} />
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </GameManager>
    </div>
  );
};

// Optimize with memo to prevent unnecessary re-renders
export default memo(App);
