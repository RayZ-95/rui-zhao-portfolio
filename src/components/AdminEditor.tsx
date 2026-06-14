"use client";

import { useState } from "react";
import type { DesignProject, Publication, SiteContent, TeachingExperience } from "@/lib/types";

const emptyContent: SiteContent = {
  designProjects: [],
  homeArchiveImages: [],
  publications: [],
  teachingExperiences: [],
  assets: []
};

function TextField({
  label,
  value,
  onChange,
  textarea = false
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
}) {
  return (
    <label className="grid gap-1 text-[10px] uppercase text-[#777]">
      {label}
      {textarea ? (
        <textarea
          className="min-h-24 border border-[#d8d8d8] bg-[#fafafa] p-2 text-[12px] normal-case text-black outline-none"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className="border border-[#d8d8d8] bg-[#fafafa] p-2 text-[12px] normal-case text-black outline-none"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}

function CheckboxField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-[10px] uppercase text-[#777]">
      <input checked={checked} onChange={(event) => onChange(event.target.checked)} type="checkbox" />
      {label}
    </label>
  );
}

export function AdminEditor() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Enter the admin password to load content.");
  const [content, setContent] = useState<SiteContent>(emptyContent);
  const [active, setActive] = useState<"projects" | "publications" | "teaching">("projects");
  const [uploadAlt, setUploadAlt] = useState("");

  async function loadContent() {
    setStatus("Loading...");
    const response = await fetch("/api/admin/content", {
      headers: { "x-admin-password": password }
    });
    if (!response.ok) {
      setStatus("Could not load content. Check the password.");
      return;
    }
    setContent((await response.json()) as SiteContent);
    setStatus("Content loaded.");
  }

  async function saveContent() {
    setStatus("Saving...");
    const response = await fetch("/api/admin/content", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "x-admin-password": password
      },
      body: JSON.stringify(content)
    });
    setStatus(response.ok ? "Saved." : "Save failed.");
  }

  async function uploadAsset(formData: FormData) {
    setStatus("Uploading...");
    formData.set("altText", uploadAlt);
    const response = await fetch("/api/admin/upload", {
      method: "POST",
      headers: { "x-admin-password": password },
      body: formData
    });
    if (!response.ok) {
      setStatus("Upload failed.");
      return;
    }
    const asset = await response.json();
    setContent((current) => ({ ...current, assets: [asset, ...current.assets] }));
    setUploadAlt("");
    setStatus("Upload complete.");
  }

  function updateProject(index: number, next: DesignProject) {
    setContent((current) => ({
      ...current,
      designProjects: current.designProjects.map((item, itemIndex) => (itemIndex === index ? next : item))
    }));
  }

  function updatePublication(index: number, next: Publication) {
    setContent((current) => ({
      ...current,
      publications: current.publications.map((item, itemIndex) => (itemIndex === index ? next : item))
    }));
  }

  function updateTeaching(index: number, next: TeachingExperience) {
    setContent((current) => ({
      ...current,
      teachingExperiences: current.teachingExperiences.map((item, itemIndex) => (itemIndex === index ? next : item))
    }));
  }

  function addProject() {
    setContent((current) => ({
      ...current,
      designProjects: [
        {
          title: "Untitled Design Project",
          slug: `design-project-${Date.now()}`,
          stage: "PhD",
          section: "PhD",
          year: new Date().getFullYear().toString(),
          category: "Design",
          tags: [],
          description: "",
          coverImage: "",
          galleryImages: [],
          sortOrder: current.designProjects.length + 1,
          featured: false,
          published: false
        },
        ...current.designProjects
      ]
    }));
  }

  function addPublication() {
    setContent((current) => ({
      ...current,
      publications: [
        {
          authors: "Zhao, R.",
          year: new Date().getFullYear().toString(),
          title: "Untitled Publication",
          type: "Journal Articles",
          venue: "",
          status: "Draft",
          doiUrl: "",
          externalUrl: "",
          citationText: "",
          sortOrder: current.publications.length + 1,
          published: false
        },
        ...current.publications
      ]
    }));
  }

  function addTeaching() {
    setContent((current) => ({
      ...current,
      teachingExperiences: [
        {
          courseCode: "",
          courseTitle: "Untitled Course",
          role: "Teaching Assistant",
          institution: "Louisiana State University",
          department: "Department of Textiles, Apparel Design and Merchandising",
          semester: "Fall",
          year: new Date().getFullYear().toString(),
          description: "",
          highlights: [],
          sortOrder: current.teachingExperiences.length + 1,
          published: false
        },
        ...current.teachingExperiences
      ]
    }));
  }

  return (
    <div className="mx-auto max-w-6xl px-3 pb-20 pt-10">
      <div className="mb-8 flex flex-wrap items-end gap-2">
        <TextField label="Admin password" value={password} onChange={setPassword} />
        <button className="ui-button px-4 py-2 uppercase" onClick={loadContent} type="button">
          Load
        </button>
        <button className="ui-button px-4 py-2 uppercase" onClick={saveContent} type="button">
          Save
        </button>
        <p className="text-[10px] uppercase text-[#777]">{status}</p>
      </div>

      <div className="mb-6 flex gap-2">
        {(["projects", "publications", "teaching"] as const).map((tab) => (
          <button className="ui-button px-4 py-3 uppercase" data-active={active === tab} key={tab} onClick={() => setActive(tab)} type="button">
            {tab}
          </button>
        ))}
      </div>

      <form action={uploadAsset} className="mb-8 grid gap-2 border border-[#d8d8d8] p-3 md:grid-cols-[1fr_1fr_auto]">
        <label className="grid gap-1 text-[10px] uppercase text-[#777]">
          Image file
          <input className="border border-[#d8d8d8] bg-[#fafafa] p-2 text-[12px]" name="file" type="file" />
        </label>
        <TextField label="Alt text" value={uploadAlt} onChange={setUploadAlt} />
        <button className="ui-button self-end px-4 py-3 uppercase" type="submit">
          Upload
        </button>
        {content.assets.length > 0 ? (
          <div className="md:col-span-3">
            <p className="mb-2 text-[10px] uppercase text-[#999]">Uploaded assets</p>
            {content.assets.slice(0, 5).map((asset) => (
              <p className="border-t border-[#e2e2e2] py-2 text-[11px]" key={asset.url}>
                {asset.url} <span className="text-[#999]">/{asset.altText || "no alt text"}</span>
              </p>
            ))}
          </div>
        ) : null}
      </form>

      {active === "projects" ? (
        <div className="grid gap-3">
          <button className="ui-button justify-self-start px-4 py-3 uppercase" onClick={addProject} type="button">
            Add Project
          </button>
          {content.designProjects.map((project, index) => (
            <section className="border border-[#d8d8d8] p-3" key={project.slug}>
              <div className="mb-3 grid gap-2 md:grid-cols-3">
                <TextField label="Title" value={project.title} onChange={(value) => updateProject(index, { ...project, title: value })} />
                <TextField label="Slug" value={project.slug} onChange={(value) => updateProject(index, { ...project, slug: value })} />
                <TextField label="Stage" value={project.stage} onChange={(value) => updateProject(index, { ...project, stage: value as DesignProject["stage"] })} />
                <TextField
                  label="Section (PhD / Master / Undergraduate / Fashion Illustration / Draping / Basics of Clothing Design / Garment 3D / Procreate)"
                  value={project.section ?? ""}
                  onChange={(value) =>
                    updateProject(index, {
                      ...project,
                      section: value ? (value as DesignProject["section"]) : undefined
                    })
                  }
                />
                <TextField label="Year" value={project.year} onChange={(value) => updateProject(index, { ...project, year: value })} />
                <TextField label="Category" value={project.category} onChange={(value) => updateProject(index, { ...project, category: value })} />
                <TextField label="Cover image path" value={project.coverImage} onChange={(value) => updateProject(index, { ...project, coverImage: value })} />
                <TextField
                  label="Gallery images comma-separated"
                  value={project.galleryImages.join(", ")}
                  onChange={(value) =>
                    updateProject(index, {
                      ...project,
                      galleryImages: value.split(",").map((item) => item.trim()).filter(Boolean)
                    })
                  }
                />
                <TextField label="Tags comma-separated" value={project.tags.join(", ")} onChange={(value) => updateProject(index, { ...project, tags: value.split(",").map((tag) => tag.trim()).filter(Boolean) })} />
              </div>
              <TextField label="Description" textarea value={project.description} onChange={(value) => updateProject(index, { ...project, description: value })} />
              <div className="mt-3 flex gap-4">
                <CheckboxField label="Featured" checked={project.featured} onChange={(value) => updateProject(index, { ...project, featured: value })} />
                <CheckboxField label="Published" checked={project.published} onChange={(value) => updateProject(index, { ...project, published: value })} />
              </div>
            </section>
          ))}
        </div>
      ) : null}

      {active === "publications" ? (
        <div className="grid gap-3">
          <button className="ui-button justify-self-start px-4 py-3 uppercase" onClick={addPublication} type="button">
            Add Publication
          </button>
          {content.publications.map((publication, index) => (
            <section className="border border-[#d8d8d8] p-3" key={`${publication.year}-${publication.title}`}>
              <div className="mb-3 grid gap-2 md:grid-cols-2">
                <TextField label="Authors" value={publication.authors} onChange={(value) => updatePublication(index, { ...publication, authors: value })} />
                <TextField label="Year" value={publication.year} onChange={(value) => updatePublication(index, { ...publication, year: value })} />
                <TextField label="Title" value={publication.title} onChange={(value) => updatePublication(index, { ...publication, title: value })} />
                <TextField label="Type" value={publication.type} onChange={(value) => updatePublication(index, { ...publication, type: value as Publication["type"] })} />
                <TextField label="Venue" value={publication.venue} onChange={(value) => updatePublication(index, { ...publication, venue: value })} />
                <TextField label="Status" value={publication.status} onChange={(value) => updatePublication(index, { ...publication, status: value })} />
                <TextField label="DOI URL" value={publication.doiUrl} onChange={(value) => updatePublication(index, { ...publication, doiUrl: value })} />
                <CheckboxField label="Published" checked={publication.published} onChange={(value) => updatePublication(index, { ...publication, published: value })} />
              </div>
            </section>
          ))}
        </div>
      ) : null}

      {active === "teaching" ? (
        <div className="grid gap-3">
          <button className="ui-button justify-self-start px-4 py-3 uppercase" onClick={addTeaching} type="button">
            Add Teaching
          </button>
          {content.teachingExperiences.map((teaching, index) => (
            <section className="border border-[#d8d8d8] p-3" key={`${teaching.year}-${teaching.courseTitle}`}>
              <div className="mb-3 grid gap-2 md:grid-cols-3">
                <TextField label="Course code" value={teaching.courseCode} onChange={(value) => updateTeaching(index, { ...teaching, courseCode: value })} />
                <TextField label="Course title" value={teaching.courseTitle} onChange={(value) => updateTeaching(index, { ...teaching, courseTitle: value })} />
                <TextField label="Role" value={teaching.role} onChange={(value) => updateTeaching(index, { ...teaching, role: value })} />
                <TextField label="Semester" value={teaching.semester} onChange={(value) => updateTeaching(index, { ...teaching, semester: value })} />
                <TextField label="Year" value={teaching.year} onChange={(value) => updateTeaching(index, { ...teaching, year: value })} />
                <TextField label="Institution" value={teaching.institution} onChange={(value) => updateTeaching(index, { ...teaching, institution: value })} />
              </div>
              <TextField label="Description" textarea value={teaching.description} onChange={(value) => updateTeaching(index, { ...teaching, description: value })} />
              <div className="mt-3">
                <CheckboxField label="Published" checked={teaching.published} onChange={(value) => updateTeaching(index, { ...teaching, published: value })} />
              </div>
            </section>
          ))}
        </div>
      ) : null}
    </div>
  );
}
