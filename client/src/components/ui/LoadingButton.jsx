import ClipLoader from "react-spinners/ClipLoader";

export default function LoadingButton({
  loading = false,
  children,
  className = "",
  spinnerSize = 18,
  spinnerColor = "#ffffff",
  ...props
}) {
  const disabled = loading || props.disabled;

  return (
    <button
      {...props}
      disabled={disabled}
      aria-busy={loading ? "true" : "false"}
      className={[
        // base button style — tweak to match your palette
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2",
        "bg-indigo-600 text-white font-medium",
        "transition hover:bg-indigo-700",
        "disabled:opacity-80 disabled:hover:bg-indigo-600",
        "w-full",
        className,
      ].join(" ")}
    >
      {loading && <ClipLoader size={spinnerSize} color={spinnerColor} speedMultiplier={0.9} />}
      <span>{loading ? "Please wait..." : children}</span>
    </button>
  );
}
