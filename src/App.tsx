import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
import AppRoutes from './routes';
import './styles/main.scss';

// Instantiate React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevent refetching on click-away for smooth mock experience
      retry: 1,
    },
  },
});

const AppContent: React.FC = () => {
  // Sync page document element attribute with current Redux store theme on boot
  useEffect(() => {
    const currentTheme = store.getState().ui.theme;
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
