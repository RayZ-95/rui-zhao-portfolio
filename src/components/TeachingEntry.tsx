import type { TeachingExperience } from "@/lib/types";

function formatTeachingTitle(item: TeachingExperience) {
  const course = [item.courseCode, item.courseTitle].filter(Boolean).join(" ");
  return `${item.role}, ${course}`;
}

function TeachingEntryBody({ item }: { item: TeachingExperience }) {
  return (
    <article className="teaching-entry">
      <div className="teaching-entry__head">
        <div className="teaching-entry__lead">
          <p className="teaching-entry__title">{formatTeachingTitle(item)}</p>
          {item.institution ? <p className="teaching-entry__institution">{item.institution}</p> : null}
        </div>
        <p className="teaching-entry__term">
          {item.semester} {item.year}
        </p>
      </div>

      {item.description ? <p className="teaching-entry__description">{item.description}</p> : null}

      {item.highlights.length > 0 ? (
        <div className="teaching-entry__tags">
          {item.highlights.map((highlight) => (
            <span className="teaching-entry__tag" key={highlight}>
              {highlight}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}

export function TeachingEntryList({ items }: { items: TeachingExperience[] }) {
  if (items.length === 0) {
    return <p className="teaching-entry__empty">No entries yet.</p>;
  }

  return (
    <div className="teaching-entry-list">
      {items.map((item) => (
        <TeachingEntryBody
          item={item}
          key={`${item.year}-${item.semester}-${item.courseCode || item.courseTitle}`}
        />
      ))}
    </div>
  );
}
