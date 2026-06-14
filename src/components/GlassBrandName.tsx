/** Homepage hero name only. Sidebar uses fixed styles in SiteNav. */
export function GlassBrandName({ children = "Rui Zhao" }: { children?: string }) {
  return <span className="brand-name brand-name--lg">{children}</span>;
}
