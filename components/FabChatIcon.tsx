import type { SVGProps } from "react";

export function FabChatIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="fab-chat-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="11" r="7" />
      <path d="M8 16.5 6.5 19.5 9.5 18" />
    </svg>
  );
}
