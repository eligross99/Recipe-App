type IconProps = { className?: string };

// A simple line-art sprig — used wherever a recipe or collection doesn't
// have a photo yet, so the app still feels visual instead of showing a
// blank box.
export function LeafIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3c-4 0-8 3-8 9 0 4 3 8 8 9 5-1 8-5 8-9 0-6-4-9-8-9Z" />
      <path d="M12 21V8" />
      <path d="M12 12c2-1 4-1 6-3" />
      <path d="M12 16c-2-1-4-1-6-3" />
    </svg>
  );
}
