interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this content.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 p-8 text-center">
      <h3 className="font-semibold">
        {title}
      </h3>

      <p className="text-sm text-gray-500">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-md border px-4 py-2"
        >
          Try again
        </button>
      )}
    </div>
  );
}