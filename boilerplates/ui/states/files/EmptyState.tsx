interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = "Nothing here yet",
  description = "There is currently nothing to display.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center p-8 text-center">
      <h3 className="font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
}