import { Navigate, useLocation } from "react-router-dom";
import { Loader } from "./Loader";
import { useAuth } from "../context/useAuth";

export function ProtectedRoute({ children }: { children: React.ReactNode; }): React.JSX.Element {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <main className="page">
        <Loader message="Vérification de la session..." />
      </main>
    );
  }
  if (user === null) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}