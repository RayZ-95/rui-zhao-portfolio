import { ContactDetails, ContactProfiles } from "@/components/ContactSection";
import { ResearchSectionLabel } from "@/components/SectionLabel";
import { SiteNav } from "@/components/SiteNav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact information and academic profiles for Rui Zhao."
};

export default function ContactPage() {
  return (
    <>
      <SiteNav active="contact" />
      <main className="site-main research-page bg-[#fafafa] pb-24 pt-10 md:pt-14">
        <h1 className="site-page-title">Contact</h1>

        <div className="research-layout-content">
          <section className="mb-16 md:mb-20">
            <ResearchSectionLabel>Contact</ResearchSectionLabel>
            <ContactDetails />
          </section>

          <section className="mb-16 md:mb-20">
            <ResearchSectionLabel>Profiles</ResearchSectionLabel>
            <ContactProfiles />
          </section>
        </div>
      </main>
    </>
  );
}
