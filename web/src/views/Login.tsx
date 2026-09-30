import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export function Login(): React.JSX.Element {
  const navigate = useNavigate();
  const { signIn, signOut, user, isLoading } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setMessage(null);
    if (email.trim() === "" || password.trim() === "") {
      setMessage("Veuillez renseigner votre email et votre mot de passe.");
      return;
    }
    try {
      await signIn({ email, password });
      navigate("/");
    } catch (error: unknown) {
      setMessage(
        error instanceof Error ? error.message : "Échec de la connexion.",
      );
    }
  }

  return (
    <main className="page form-page">
      <h1>Connexion</h1>
      {isLoading ? <p>Vérification de la session...</p> : user !== null ? (
        <button type="button" onClick={signOut}>Déconnexion</button>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required/>
          </label>
          <label>Mot de passe
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required/>
          </label>
          <button type="submit">Se connecter</button>
        </form>
      )}
      {message !== null ? <p className="state-message">{message}</p> : null}
      {!isLoading && user === null ? (
        <p>Pas encore de compte ? <Link to="/register">S’inscrire</Link></p>
      ) : null}
      <Link className="button-link" to="/">Retour à l’accueil</Link>
    </main>
  );
}