import { encodePublicAssetPath } from "@/lib/content";

function MatrixImage({
  alt,
  className,
  src
}: {
  alt: string;
  className?: string;
  src: string;
}) {
  return (
    <figure className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt={alt} className="master-matrix__img" draggable={false} src={encodePublicAssetPath(src)} />
    </figure>
  );
}

function MatrixImageSlot({
  alt,
  className,
  index,
  src
}: {
  alt: string;
  className?: string;
  index: number;
  src?: string;
}) {
  if (!src) {
    return null;
  }

  return <MatrixImage alt={`${alt} — ${index + 1}`} className={className} src={src} />;
}

const tangRightSlots = (heroImages: string[]) => [
  { className: "master-matrix__slot--r2c1 master-matrix__slot--top-row", index: 0, src: heroImages[0] },
  { className: "master-matrix__slot--r3c1", index: 1, src: heroImages[1] },
  { className: "master-matrix__slot--r2c2 master-matrix__slot--top-row", index: 2, src: heroImages[3] },
  { className: "master-matrix__slot--r2c3 master-matrix__slot--top-row", index: 3, src: heroImages[4] },
  { className: "master-matrix__slot--r3c3", index: 4, src: heroImages[5] }
];

const lightRightSlots = (heroImages: string[]) => [
  { className: "master-matrix__slot--r2c1", index: 0, src: heroImages[0] },
  { className: "master-matrix__slot--r2c3", index: 1, src: heroImages[1] },
  { className: "master-matrix__slot--r3c1", index: 2, src: heroImages[2] },
  { className: "master-matrix__slot--r3c3", index: 3, src: heroImages[3] }
];

function LightSplitLayout({
  heroImages,
  introImage,
  section,
  sketchImage,
  title,
  year
}: {
  heroImages: string[];
  introImage?: string;
  section: string;
  sketchImage?: string;
  title: string;
  year: string;
}) {
  return (
    <div className="master-matrix master-matrix--light">
      <div className="master-matrix__light-left">
        <p className="master-matrix__eyebrow">
          {section} · {year}
        </p>
        <h1 className="master-matrix__title">{title}</h1>

        <MatrixImageSlot
          alt={`${title} — inspiration`}
          className="master-matrix__intro-image"
          index={0}
          src={introImage}
        />
        <MatrixImageSlot
          alt={`${title} — sketch`}
          className="master-matrix__inline-image"
          index={1}
          src={sketchImage}
        />
      </div>

      <div aria-label="Project gallery" className="master-matrix__light-right">
        {lightRightSlots(heroImages).map((slot) => (
          <MatrixImageSlot
            alt={title}
            className={`master-matrix__slot ${slot.className}`}
            index={slot.index}
            key={slot.className}
            src={slot.src}
          />
        ))}
      </div>
    </div>
  );
}

export function MasterEditorialLayout({
  description,
  heroImages,
  keywords,
  leftImages = [],
  portfolioImages,
  section,
  title,
  year
}: {
  description: string;
  heroImages: string[];
  keywords: string;
  leftImages?: string[];
  portfolioImages: string[];
  section: string;
  title: string;
  year: string;
}) {
  const useLeftImageLayout = leftImages.length > 0;
  const introImage = leftImages[0];
  const sketchImage = leftImages[1];
  const tang7 = heroImages[6];
  const tang3 = heroImages[2];
  const inspirationImage = portfolioImages[0];
  const renderImage = portfolioImages[1];
  const hasPortfolio = portfolioImages.length > 0;

  if (useLeftImageLayout) {
    return (
      <LightSplitLayout
        heroImages={heroImages}
        introImage={introImage}
        section={section}
        sketchImage={sketchImage}
        title={title}
        year={year}
      />
    );
  }

  const rightSlots = tangRightSlots(heroImages);

  return (
    <div className="master-matrix">
      <header className="master-matrix__head">
        <div className="master-matrix__title-bar">
          <p className="master-matrix__eyebrow">
            {section} · {year}
          </p>
          <h1 className="master-matrix__title">{title}</h1>

          {keywords || description ? (
            <div className="master-matrix__copy">
              {keywords ? <p className="master-matrix__keywords">{keywords}</p> : null}
              {description ? (
                <>
                  <p className="master-matrix__intro-label">Introduction</p>
                  <p className="master-matrix__description">{description}</p>
                </>
              ) : null}
            </div>
          ) : null}
        </div>

        {hasPortfolio ? (
          <div className="master-matrix__portfolio">
            <MatrixImageSlot
              alt={title}
              className="master-matrix__portfolio-item"
              index={0}
              src={inspirationImage}
            />
            <MatrixImageSlot
              alt={title}
              className="master-matrix__portfolio-item"
              index={1}
              src={renderImage}
            />
          </div>
        ) : null}
      </header>

      <div className="master-matrix__body">
        <div className="master-matrix__left">
          <MatrixImageSlot alt={title} className="master-matrix__inline-image" index={5} src={tang7} />
          <MatrixImageSlot alt={title} className="master-matrix__inline-image" index={6} src={tang3} />
        </div>

        <div aria-label="Project gallery" className="master-matrix__right">
          {rightSlots.map((slot) => (
            <MatrixImageSlot
              alt={title}
              className={`master-matrix__slot ${slot.className}`}
              index={slot.index}
              key={slot.className}
              src={slot.src}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
