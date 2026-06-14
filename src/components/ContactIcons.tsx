type IconProps = {
  className?: string;
};

export function MailIcon({ className }: IconProps) {
  return (
    <svg aria-hidden className={className} fill="none" viewBox="0 0 16 16">
      <path
        d="M2.5 4.5h11v7h-11v-7Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.1"
      />
      <path d="M2.5 5.5 8 9.25 13.5 5.5" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.1" />
    </svg>
  );
}

export function ExternalLinkIcon({ className }: IconProps) {
  return (
    <svg aria-hidden className={className} fill="none" viewBox="0 0 16 16">
      <path d="M6.25 3.75h6v6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.1" />
      <path d="M9.75 6.25 3.25 12.75" stroke="currentColor" strokeLinecap="round" strokeWidth="1.1" />
      <path d="M8.25 3.75h3.75v3.75" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.1" />
    </svg>
  );
}

export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg aria-hidden className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function ResearchGateIcon({ className }: IconProps) {
  return (
    <svg aria-hidden className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M21.5 0h-8.35L6.654 13.002H2.424L0 19.005h5.012c1.326 0 2.463-.757 3.036-1.858L9.5 14.5l2.238 7.328c.581 1.103 1.732 1.858 3.036 1.858H24V7.004L21.5 0zm-1.834 2.582L22.15 7.004v12.297h-3.716l-2.3-7.535-2.415 7.535H10.44l2.684-8.761 6.78-8.423z" />
    </svg>
  );
}
