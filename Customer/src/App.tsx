import { BrowserRouter } from 'react-router-dom';
import AppRouter from './app/router';
import { AppProviders } from './app/providers';

function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
