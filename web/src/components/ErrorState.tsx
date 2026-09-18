type ErrorStateProps = {
  message: string;
};

export function ErrorState({
  message,
}: ErrorStateProps): React.JSX.Element {
  return <p className="state-message state-message--error">{message}</p>;
}