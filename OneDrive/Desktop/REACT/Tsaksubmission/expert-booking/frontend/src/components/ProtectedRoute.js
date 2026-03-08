import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireExpert }) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to={requireExpert ? '/expert/login' : '/login'} />;
  if (requireExpert && user.role !== 'expert') 
    return <Navigate to="/" />;
  return children;
}