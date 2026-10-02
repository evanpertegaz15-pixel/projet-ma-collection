import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ErrorState } from "../components/ErrorState";
import { Loader } from "../components/Loader";
import { registerUser } from "../services/http";

export function Register(): React.JSX.Element {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setMessage(null);
    if (password !== confirmPassword) {
      setMessage("Les deux mots de passe doivent être identiques.");
      return;
    }
    setIsSubmitting(true);
    try {
      await registerUser({ email, password, confirm_password: confirmPassword });
      navigate("/login");
    } catch (error: unknown) {
      setMessage(
        error instanceof Error ? error.message : "Échec de l’inscription.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page form-page">
      <h1>Inscription</h1>
      {isSubmitting ? <Loader message="Création du compte..." /> : null}
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>Email
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required disabled={isSubmitting}/>
        </label>
        <label>Mot de passe
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} required disabled={isSubmitting}/>
        </label>
        <label>Confirmer le mot de passe
          <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={8} required disabled={isSubmitting}/>
        </label>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Création..." : "Créer mon compte"}
        </button>
      </form>
      {message !== null ? <ErrorState message={message} /> : null}
      <p>Déjà inscrit ? <Link to="/login">Se connecter</Link></p>
    </main>
  );
}