import { contactProfile } from "@/lib/content";
import {
  LinkedInIcon,
  MailIcon,
  ResearchGateIcon
} from "@/components/ContactIcons";

function ContactActionLink({
  ariaLabel,
  href,
  children
}: {
  ariaLabel: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      aria-label={ariaLabel}
      className="contact-entry__action"
      href={href}
      rel="noopener noreferrer"
      target={href.startsWith("mailto:") ? undefined : "_blank"}
    >
      {children}
    </a>
  );
}

function ContactRow({
  action,
  description,
  plain = false,
  title
}: {
  action?: { ariaLabel: string; href: string; icon: React.ReactNode };
  description?: string[];
  plain?: boolean;
  title: string;
}) {
  return (
    <article className={plain ? "contact-entry contact-entry--plain" : "contact-entry"}>
      <div className="contact-entry__head">
        <div className="contact-entry__lead">
          <p className="contact-entry__title">{title}</p>
        </div>
        {action ? (
          <ContactActionLink ariaLabel={action.ariaLabel} href={action.href}>
            {action.icon}
          </ContactActionLink>
        ) : null}
      </div>

      {description && description.length > 0 ? (
        <div className="contact-entry__description">
          {description.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      ) : null}
    </article>
  );
}

const profileIcons = {
  linkedin: LinkedInIcon,
  researchgate: ResearchGateIcon
} as const;

export function ContactDetails() {
  const { affiliation, email } = contactProfile;

  return (
    <div className="contact-entry-list">
      <ContactRow
        action={{
          ariaLabel: `Email ${email}`,
          href: `mailto:${email}`,
          icon: <MailIcon className="contact-entry__icon" />
        }}
        title={email}
      />

      <ContactRow description={affiliation.lines} plain title={affiliation.name} />
    </div>
  );
}

export function ContactProfiles() {
  return (
    <div className="contact-entry-list">
      {contactProfile.profiles.map((profile) => {
        const Icon = profileIcons[profile.id];

        return (
          <ContactRow
            action={{
              ariaLabel: `Visit ${profile.label}`,
              href: profile.href,
              icon: <Icon className="contact-entry__icon contact-entry__icon--brand" />
            }}
            key={profile.id}
            title={profile.label}
          />
        );
      })}
    </div>
  );
}
