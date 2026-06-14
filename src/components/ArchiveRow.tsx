export function ArchiveRow({
  year,
  title,
  meta,
  href
}: {
  year: string;
  title: string;
  meta: string;
  href?: string;
}) {
  const body = (
    <div className="archive-grid border-t border-[#e2e2e2] py-2 text-[11px] uppercase leading-tight text-[#111]">
      <span className="text-[#9a9a9a]">{year}</span>
      <span>{title}</span>
      <span className="text-[#727272]">{meta}</span>
    </div>
  );

  return href ? (
    <a href={href} rel="noreferrer" target="_blank">
      {body}
    </a>
  ) : (
    body
  );
}
