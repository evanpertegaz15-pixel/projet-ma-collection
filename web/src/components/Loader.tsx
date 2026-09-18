type LoaderProps = {
  message?: string;
};

export function Loader({
  message = "Chargement...",
}: LoaderProps): React.JSX.Element {
  return <p className="state-message">{message}</p>;
}