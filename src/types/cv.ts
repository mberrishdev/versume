export interface CVPersonal {
  name: string;
  title: string;
  email: string;
  phone: string;
  linkedin: string;
  website: string;
  customFields?: { id: string; label: string; value: string }[];
}

export interface CVExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  period: string;
  description: string;
  bullets: string[];
}

export interface CVProject {
  id: string;
  category: string;
  name: string;
  role: string;
  description: string;
  links: { label: string; url: string }[];
}

export interface CVEducation {
  id: string;
  institution: string;
  location: string;
  period: string;
  degree: string;
}

export interface CVSkillItem {
  id: string;
  label: string;
  value: string;
}

export interface CVLanguage {
  id: string;
  name: string;
  level: string;
}

export interface CVMeta {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CV {
  meta: CVMeta;
  personal: CVPersonal;
  summary: string;
  experience: CVExperience[];
  projects: CVProject[];
  education: CVEducation[];
  skills: CVSkillItem[];
  languages: CVLanguage[];
}
