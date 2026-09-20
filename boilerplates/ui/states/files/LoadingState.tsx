interface LoadingStateProps {
  message?: string;
}

export function LoadingState({
  message = "Loading...",
}: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <p className="text-sm text-gray-500">
        {message}
      </p>
    </div>
  );
}