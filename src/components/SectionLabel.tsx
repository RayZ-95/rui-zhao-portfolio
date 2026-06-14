export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-4 text-[10px] uppercase text-[#9a9a9a]">{children}</h2>;
}

export function ResearchSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-6 max-w-4xl text-[clamp(14px,1.99vw,24px)] font-semibold uppercase leading-[1.15] text-[#111] md:mb-7">
      {children}
    </h2>
  );
}
