import Link from "next/link";
import { mainNavItems } from "@/lib/nav";

export function SiteNav({ active }: { active?: string }) {
  return (
    <aside className="site-sidebar nav-glass fixed left-0 top-0 z-40 flex h-[100dvh] w-[var(--side-nav-width)] flex-col overflow-y-auto">
      <div className="site-sidebar-header px-3 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] md:px-4 md:pb-4">
        <Link className="site-sidebar-brand" href="/">
          Rui Zhao
        </Link>
      </div>

      <nav aria-label="Main" className="site-sidebar-nav">
        {mainNavItems.map((item, index) => (
          <Link
            className="site-sidebar-link ui-button group"
            data-active={active === item.id}
            href={item.href}
            key={item.href}
          >
            <span className="site-sidebar-index">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="site-sidebar-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
