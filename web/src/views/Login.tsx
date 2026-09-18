import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function Login(): React.JSX.Element {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      setMessage("Veuillez renseigner votre email et votre mot de passe.");
      return;
    }

    setMessage(
      "Connexion simulée pour le moment. Elle sera reliée à FastAPI ensuite.",
    );

    window.setTimeout(() => {
      navigate("/");
    }, 1000);
  }

  return (
    <main className="page form-page">
      <h1>Connexion</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label>
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        <button type="submit">Se connecter</button>
      </form>

      {message !== null ? <p className="state-message">{message}</p> : null}

      <p>
        Pas encore de compte ? <Link to="/register">S’inscrire</Link>
      </p>
    </main>
  );
}