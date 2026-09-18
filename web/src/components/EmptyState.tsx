type EmptyStateProps = {
  message: string;
};

export function EmptyState({
  message,
}: EmptyStateProps): React.JSX.Element {
  return <p className="state-message">{message}</p>;
}