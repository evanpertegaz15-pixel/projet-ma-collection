import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/http";

export function Register(): React.JSX.Element {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setMessage(null);
    if (password !== confirmPassword) {
      setMessage("Les deux mots de passe doivent être identiques.");
      return;
    }
    try {
      await registerUser({ email, password, confirm_password: confirmPassword });
      setMessage("Compte créé. Vous pouvez maintenant vous connecter.");
      navigate("/login");
    } catch (error: unknown) {
      setMessage(
        error instanceof Error ? error.message : "Échec de l’inscription.",
      );
    }
  }

  return (
    <main className="page form-page">
      <h1>Inscription</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>Email
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required/>
        </label>
        <label>Mot de passe
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} required/>
        </label>
        <label>Confirmer le mot de passe
          <input type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={8} required/>
        </label>
        <button type="submit">Créer mon compte</button>
      </form>
      {message !== null ? <p className="state-message">{message}</p> : null}
      <p>Déjà inscrit ? <Link to="/login">Se connecter</Link></p>
    </main>
  );
}