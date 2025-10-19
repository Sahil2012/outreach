import { log } from "console";
import fs from "fs";
import pdf from "pdf-parse";

interface ContactInfo {
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

interface EducationEntry {
  institution: string;
  degree: string;
  duration: string;
  gpa: string;
}

interface ExperienceEntry {
  title: string;
  company: string;
  duration: string;
  responsibilities: string[];
}

interface ProjectEntry {
  name: string;
  technologies: string[];
  description: string[];
  links: string[];
}

interface Skills {
  languages: string[];
  frameworks: string[];
  databases: string[];
  tools: string[];
  libraries: string[];
  other: string[];
}

interface ResumeData {
  name: string;
  contact: ContactInfo;
  profile: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  skills: Skills;
  achievements: string[];
  languages: string[];
  interests: string[];
}

export class ResumeParser {
  private sectionPatterns: Record<string, RegExp>;
  private contactPatterns: Record<string, RegExp>;
  private datePatterns: { range: RegExp; year: RegExp };
  private degreePatterns: RegExp;
  private skillCategories: Record<string, string[]>;

  constructor() {
    this.sectionPatterns = {
      contact: /^(contact|personal\s+info|contact\s+info)/i,
      profile:
        /^(profile|summary|objective|about|professional\s+summary|career\s+objective)/i,
      education:
        /^(education|academic|qualification|degree|university|college)/i,
      experience:
        /^(experience|work|employment|professional|career|internship)/i,
      projects: /^(projects|portfolio|work\s+samples|personal\s+projects)/i,
      skills:
        /^(skills|technical|technologies|programming|competencies|expertise|technical skills)/i,
      achievements:
        /^(achievements|awards|honors|accomplishments|certifications|certificates)/i,
      languages: /^(languages|linguistic)/i,
      interests: /^(interests|hobbies|activities)/i,
    };

    this.contactPatterns = {
      email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      phone:
        /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+?\d{1,3}[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/g,
      linkedin: /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+/gi,
      github: /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9-]+/gi,
      portfolio:
        /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-z]{2,}(\/[^\s]*)?/gi,
    };

    this.datePatterns = {
      range:
        /((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4})\s*[-–—]\s*((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4}|present|current)/gi,
      year: /\b\d{4}\b/g,
    };

    this.degreePatterns =
      /\b(Bachelor|Master|PhD|Associate|Diploma|Certificate|B\.?Tech|M\.?Tech|B\.?Sc|M\.?Sc|B\.?A|M\.?A|MBA|BBA|HSC|SSC|12th|10th)\b/gi;

    this.skillCategories = {
      languages: [
        "java",
        "python",
        "javascript",
        "typescript",
        "c++",
        "c#",
        "php",
        "ruby",
        "go",
        "rust",
        "swift",
        "kotlin",
        "scala",
        "r",
        "matlab",
        "sql",
        "html",
        "css",
      ],
      frameworks: [
        "react",
        "angular",
        "vue",
        "node.js",
        "express",
        "django",
        "flask",
        "spring",
        "laravel",
        "rails",
        "asp.net",
        "fastapi",
        "nextjs",
        "nuxtjs",
      ],
      databases: [
        "mysql",
        "postgresql",
        "mongodb",
        "redis",
        "sqlite",
        "oracle",
        "sql server",
        "cassandra",
        "dynamodb",
      ],
      tools: [
        "git",
        "docker",
        "kubernetes",
        "jenkins",
        "travis",
        "circleci",
        "aws",
        "azure",
        "gcp",
        "heroku",
        "vercel",
        "netlify",
      ],
      libraries: [
        "pandas",
        "numpy",
        "matplotlib",
        "opencv",
        "tensorflow",
        "pytorch",
        "scikit-learn",
        "jquery",
        "bootstrap",
        "material-ui",
      ],
    };
  }

  // ----- CORE LOGIC -----
  public async parseResume(filePath: string): Promise<ResumeData> {
    try {
      const buffer = fs.readFileSync(filePath);
      const data = await pdf(buffer);
      const lines = this._splitLines(this._cleanText(data.text));

      const resumeData = this._initResumeStructure();
      this._parseHeader(lines.slice(0, 10), resumeData);
      this._parseSections(lines, resumeData);
      this._postProcess(resumeData);

      return resumeData;
    } catch (err: any) {
      throw new Error("Failed to parse resume: " + err.message);
    }
  }

  private _initResumeStructure(): ResumeData {
    return {
      name: "",
      contact: {},
      profile: "",
      education: [],
      experience: [],
      projects: [],
      skills: {
        languages: [],
        frameworks: [],
        databases: [],
        tools: [],
        libraries: [],
        other: [],
      },
      achievements: [],
      languages: [],
      interests: [],
    };
  }

  // ----- TEXT CLEANUP -----
  private _cleanText(text: string): string {
    return text
      .replace(/[\u0080-\uFFFF]/g, " ")
      .replace(/\s*\n\s*/g, "\n")
      .replace(/\s{2,}/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .trim();
  }

  private _splitLines(text: string): string[] {
    const rawLines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const merged: string[] = [];
    let buffer = "";

    for (let line of rawLines) {
      if (this._shouldMerge(buffer, line)) {
        buffer += " " + line;
      } else {
        if (buffer) merged.push(buffer.trim());
        buffer = line;
      }
    }
    if (buffer) merged.push(buffer.trim());
    return merged;
  }

  private _shouldMerge(curr: string, next: string): boolean {
    if (!curr) return false;
    if (this._isSectionHeader(next)) return false;
    if (this.datePatterns.range.test(next)) return false;
    if (/^[•\-*]\s/.test(next)) return false;
    return curr.length < 50 && !this.contactPatterns.email.test(curr);
  }

  // ----- HEADER + CONTACT -----
  private _parseHeader(lines: string[], data: ResumeData) {
    for (let i = 0; i < Math.min(3, lines.length); i++) {
      if (this._isLikelyName(lines[i])) {
        data.name = lines[i];
        break;
      }
    }
    for (const line of lines) {
      this._extractContact(line, data.contact);
    }
  }

  private _isLikelyName(line: string): boolean {
    const words = line.split(/\s+/);
    if (words.length > 5 || /\d|@|\.com/.test(line)) return false;
    return /^[A-Z][a-z]+\s[A-Z][a-z]+/.test(line);
  }

  private _extractContact(line: string, contact: ContactInfo) {
    for (const [type, regex] of Object.entries(this.contactPatterns)) {
      const match = line.match(regex);
      if (match && !contact[type as keyof ContactInfo]) {
        contact[type as keyof ContactInfo] = match[0];
      }
    }
  }

  private sectionParsers: Record<string, (lines: string[]) => any> = {
    education: this._parse_education.bind(this),
    experience: this._parse_experience.bind(this),
    projects: this._parse_projects.bind(this),
    skills: this._parse_skills.bind(this),
    achievements: this._parse_achievements.bind(this),
    languages: this._parse_languages.bind(this),
    interests: this._parse_interests.bind(this),
  };

  // ----- SECTION DETECTION -----
  private _parseSections(lines: string[], data: ResumeData) {
    let current: string | null = null;
    let buffer: string[] = [];

    for (const line of lines) {
      const section = this._detectSection(line);
      if (section) {
        if (current) this._processSection(current, buffer, data);
        current = section;
        buffer = [];
      } else if (current) {
        buffer.push(line);
      }
    }
    if (current) this._processSection(current, buffer, data);
  }

  private _detectSection(line: string): string | null {
    const normalized = line
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .trim();
    for (const [section, pattern] of Object.entries(this.sectionPatterns)) {
      if (pattern.test(normalized)) return section;
    }
    return null;
  }

  private _isSectionHeader(line: string): boolean {
    return this._detectSection(line) !== null;
  }

  private _processSection(section: string, lines: string[], data: ResumeData) {
    const parser = this.sectionParsers[section];
    if (parser) {
      (data as any)[section] = parser(lines);
    } else if (section === "profile") {
      (data as any)[section] = lines.join(" ");
    }
  }

  // ----- SECTION PARSERS -----
  private _parse_education(lines: string[]): EducationEntry[] {
    const entries: EducationEntry[] = [];
    let current: Partial<EducationEntry> = {};

    for (const line of lines) {
      if (this.containsInstitution(line)) {
        if (Object.keys(current).length)
          entries.push(current as EducationEntry);
        current = { institution: line, degree: "", duration: "", gpa: "" };
      }
      const degree = line.match(this.degreePatterns);
      const duration = line.match(this.datePatterns.range);
      const gpa = line.match(/GPA[:\s]*([\d.]+)/i);
      if (degree) current.degree = degree[0];
      if (duration) current.duration = duration[0];
      if (gpa) current.gpa = gpa[1];
    }
    if (Object.keys(current).length) entries.push(current as EducationEntry);
    return entries;
  }

  private _parse_experience(lines: string[]): ExperienceEntry[] {
    const entries: ExperienceEntry[] = [];
    let current: ExperienceEntry = {
      title: "",
      company: "",
      duration: "",
      responsibilities: [],
    };

    for (const line of lines) {
      const duration = line.match(this.datePatterns.range);
      if (duration) {
        if (current.title) entries.push(current);
        current = {
          title: "",
          company: "",
          duration: duration[0],
          responsibilities: [],
        };
        const [before, after] = line.split(duration[0]);
        if (after && after.includes("@")) {
          [current.title, current.company] = after
            .split("@")
            .map((x) => x.trim());
        } else {
          current.title = before.trim();
        }
      } else if (/^[•\-*]\s/.test(line)) {
        current.responsibilities.push(line.replace(/^[•\-*]\s/, "").trim());
      }
    }
    if (current.title) entries.push(current);
    return entries;
  }

  private _parse_projects(lines: string[]): ProjectEntry[] {
    const projects: ProjectEntry[] = [];
    let current: ProjectEntry = {
      name: "",
      technologies: [],
      description: [],
      links: [],
    };

    for (const line of lines) {
      if (line.includes("|") || this.datePatterns.range.test(line)) {
        if (current.name) projects.push(current);
        current = {
          name: line.split("|")[0].trim(),
          technologies: [],
          description: [],
          links: [],
        };

        const techMatch = line.match(/\|(.+)$/);
        if (techMatch) {
          current.technologies = techMatch[1]
            .split(/[,;]/)
            .map((t) => t.trim());
        }

        const links =
          line.match(this.contactPatterns.github) ||
          line.match(this.contactPatterns.portfolio);
        if (links) current.links.push(...links);
      } else if (/^[•\-*]\s/.test(line)) {
        current.description.push(line.replace(/^[•\-*]\s/, "").trim());
      }
    }
    if (current.name) projects.push(current);
    return projects;
  }

  private _parse_skills(lines: string[]): Skills {
    log("Parsing skills from lines:", lines);
  const skills: Skills = { languages: [], frameworks: [], databases: [], tools: [], libraries: [], other: [] };

  for (const line of lines) {
    const cleanLine = line.replace(/^[•\-*]\s*/, '').trim(); // remove bullets
    const match = cleanLine.match(/^([^:]+):\s*(.+)$/);
    const items = match ? match[2] : cleanLine;
    const skillList = items.split(/[,;/]/).map(x => x.trim()).filter(Boolean);

    this._categorizeSkills(skillList, skills);
  }

  // Deduplicate
  for (const key in skills) {
    skills[key as keyof Skills] = [...new Set(skills[key as keyof Skills].map(s => s.toLowerCase()))];
  }

  return skills;
}


  private _parse_achievements(lines: string[]): string[] {
    return lines.map((l) => l.replace(/^[•\-*]\s/, "").trim()).filter(Boolean);
  }

  private _parse_languages(lines: string[]): string[] {
    return [
      ...new Set(lines.flatMap((l) => l.split(/[,;]/).map((x) => x.trim()))),
    ];
  }

  private _parse_interests(lines: string[]): string[] {
    return [
      ...new Set(lines.flatMap((l) => l.split(/[,;]/).map((x) => x.trim()))),
    ];
  }

  private _categorizeSkills(list: string[], target: Skills) {
    for (const skill of list) {
      const lower = skill.toLowerCase();
      let found = false;
      for (const [cat, terms] of Object.entries(this.skillCategories)) {
        if (terms.includes(lower)) {
          target[cat as keyof Skills].push(skill);
          found = true;
          break;
        }
      }
      if (!found) target.other.push(skill);
    }
  }

  private containsInstitution(line: string): boolean {
    return (
      /university|college|institute|school|hsc|ssc/i.test(line) ||
      this.datePatterns.range.test(line)
    );
  }

  // ----- CLEANUP -----
  private _postProcess(data: ResumeData) {
    if (!data.name) data.name = "Unknown";
    for (const key of Object.keys(data.contact)) {
      if (!data.contact[key as keyof ContactInfo])
        delete data.contact[key as keyof ContactInfo];
    }
    for (const key of Object.keys(data)) {
      if (
        Array.isArray(data[key as keyof ResumeData]) &&
        (data[key as keyof ResumeData] as any[]).length === 0
      ) {
        delete data[key as keyof ResumeData];
      }
    }
  }
}
