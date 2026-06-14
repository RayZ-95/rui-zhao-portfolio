import type { Publication } from "@/lib/types";

function formatTitle(title: string) {
  if (!title) return title;
  const trimmed = title.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function highlightAuthor(authors: string) {
  const parts = authors.split(/(Zhao,\s*R\.\*?)/gi);

  return parts.map((part, index) =>
    /^Zhao,\s*R\.\*?$/i.test(part) ? (
      <strong className="font-semibold text-[#111]" key={`${part}-${index}`}>
        {part}
      </strong>
    ) : (
      <span className="text-[#666]" key={`${part}-${index}`}>
        {part}
      </span>
    )
  );
}

function formatDoi(url: string) {
  return url.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "doi: ");
}

function isUnderReview(status: string) {
  return status.toLowerCase().includes("under review");
}

function isAccepted(status: string) {
  return status.toLowerCase().includes("accepted");
}

function EntryBody({ item }: { item: Publication }) {
  const journalHref = item.doiUrl || item.externalUrl || undefined;

  return (
    <article className="border-t border-[#e2e2e2] py-5 md:py-6">
      <h4 className="max-w-4xl text-[12px] font-semibold normal-case leading-snug text-[#111] md:text-[14px]">
        {formatTitle(item.title)}
      </h4>

      <p className="mt-2 max-w-4xl text-[12px] normal-case leading-relaxed md:text-[14px]">
        {highlightAuthor(item.authors)}
      </p>

      {item.highlight ? (
        <p className="mt-2 max-w-4xl text-[12px] normal-case leading-relaxed text-[#444] md:text-[13px]">
          <span className="font-semibold text-[#111]">Highlight: </span>
          {item.highlight}
        </p>
      ) : null}

      <p className="mt-2 max-w-3xl text-[12px] normal-case leading-relaxed text-[#666] md:text-[13px]">
        {item.venue} ({item.year})
      </p>

      {item.doiUrl ? (
        <a
          className="mt-2 inline-block text-[11px] normal-case text-[#3a8fb5] underline-offset-2 hover:underline md:text-[12px]"
          href={item.doiUrl}
          rel="noreferrer"
          target="_blank"
        >
          {formatDoi(item.doiUrl)}
        </a>
      ) : null}

      {journalHref ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            className="inline-flex items-center rounded-full border border-[#9ec9de] px-3 py-1 text-[11px] normal-case text-[#3a8fb5] transition-colors hover:bg-[#f3f9fc] md:text-[12px]"
            href={journalHref}
            rel="noreferrer"
            target="_blank"
          >
            {item.type === "Conference Proceedings" ? "Proceedings" : "Journal"}
          </a>
          {item.externalUrl && item.doiUrl ? (
            <a
              className="inline-flex items-center rounded-full border border-[#d8d8d8] px-3 py-1 text-[11px] normal-case text-[#666] transition-colors hover:bg-[#f7f7f7] md:text-[12px]"
              href={item.externalUrl}
              rel="noreferrer"
              target="_blank"
            >
              Article
            </a>
          ) : null}
        </div>
      ) : null}

      {item.tags && item.tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <span
              className="rounded-full bg-[#efefef] px-2.5 py-0.5 text-[10px] normal-case text-[#666] md:text-[11px]"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}

function EntryGroup({ label, items }: { label: string; items: Publication[] }) {
  if (items.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#222] md:text-[14px]">
        {label}
      </h3>
      {items.map((item) => (
        <EntryBody item={item} key={`${item.year}-${item.title}`} />
      ))}
    </div>
  );
}

export function ResearchEntryList({ items }: { items: Publication[] }) {
  const underReview = items.filter((item) => isUnderReview(item.status));
  const accepted = items.filter((item) => isAccepted(item.status) && !isUnderReview(item.status));
  const published = items.filter((item) => !isUnderReview(item.status) && !isAccepted(item.status));

  if (items.length === 0) {
    return (
      <p className="border-t border-[#e2e2e2] py-5 normal-case text-[#9a9a9a] md:py-6">No entries yet.</p>
    );
  }

  return (
    <>
      <EntryGroup items={published} label="Published" />
      <EntryGroup items={accepted} label="Accepted" />
      <EntryGroup items={underReview} label="Under Review" />
    </>
  );
}

function highlightZhao(text: string) {
  const parts = text.split(/(Zhao,\s*R\.)/gi);

  return parts.map((part, index) =>
    /^Zhao,\s*R\.$/i.test(part) ? (
      <strong className="font-semibold text-[#111]" key={`${part}-${index}`}>
        {part}
      </strong>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    )
  );
}

type GrantGroup = {
  label?: string;
  sublabel?: string;
  grants: readonly string[];
};

export function ResearchGrantList({ groups }: { groups: readonly GrantGroup[] }) {
  return (
    <div>
      {groups.map((group, groupIndex) => (
        <div className={groupIndex > 0 ? "mt-10 md:mt-12" : undefined} key={group.label ?? `grant-group-${groupIndex}`}>
          {group.label ? (
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.04em] text-[#222] md:mb-4 md:text-[14px]">
              {group.label}
            </h3>
          ) : null}
          {group.sublabel ? (
            <h4 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#222] md:text-[12px]">
              {group.sublabel}
            </h4>
          ) : null}
          {group.grants.map((grant) => (
            <div
              className="border-t border-[#e2e2e2] py-5 text-[14px] normal-case leading-relaxed text-[#222] md:py-6 md:text-[17px]"
              key={grant}
            >
              {highlightZhao(grant)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
