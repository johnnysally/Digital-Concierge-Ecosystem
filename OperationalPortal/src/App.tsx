import { Routes, Route, Navigate } from 'react-router-dom';
import OperationsLayout from './layouts/OperationsLayout';
import OperationsRoutes from './features/operations/routes/operationsRoutes';

function App() {
  return (
    <Routes>
      <Route element={<OperationsLayout />}>
        <Route path="/" element={<Navigate to="/operations/dashboard" replace />} />
        <Route path="operations/*" element={<OperationsRoutes />} />
        <Route path="*" element={<Navigate to="/operations/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
