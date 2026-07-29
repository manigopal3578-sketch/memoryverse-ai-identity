export type SmartCategory =
  | "Certificate"
  | "Resume"
  | "Internship"
  | "Project"
  | "Transcript"
  | "Portfolio"
  | "Event";

const KNOWN_ORGS = [
  "Google", "Microsoft", "Meta", "Amazon", "Apple", "Netflix", "IBM", "Stanford",
  "MIT", "Coursera", "Udemy", "Cipher", "HackCampus", "Devfolio", "Nvidia", "OpenAI",
];

export interface SmartName {
  title: string;
  category: SmartCategory;
  scanned: boolean;
  issuer?: string;
}

export function smartName(fileName: string): SmartName {
  const raw = fileName.replace(/\.[^.]+$/, "");
  const cleaned = raw.replace(/[_\-]+/g, " ").replace(/\s+/g, " ").trim();
  const lower = cleaned.toLowerCase();
  const scanned = /\.(png|jpg|jpeg|webp|heic)$/i.test(fileName);

  const issuer = KNOWN_ORGS.find((o) => lower.includes(o.toLowerCase()));

  let category: SmartCategory = "Project";
  if (/(cert|award|badge|winner)/.test(lower)) category = "Certificate";
  else if (/(intern|offer|letter)/.test(lower)) category = "Internship";
  else if (/(resume|\bcv\b)/.test(lower)) category = "Resume";
  else if (/(transcript|marksheet|grade)/.test(lower)) category = "Transcript";
  else if (/(portfolio|behance|dribbble)/.test(lower)) category = "Portfolio";
  else if (/(hackathon|event|meetup|conference)/.test(lower)) category = "Event";
  else if (/(project|report|capstone|thesis)/.test(lower)) category = "Project";

  // Build a clean title
  let subject = cleaned
    .replace(/certificate|cert|winner|award|badge/gi, "")
    .replace(/internship|offer|letter/gi, "")
    .replace(/resume|cv/gi, "")
    .replace(/transcript|marksheet/gi, "")
    .replace(/portfolio/gi, "")
    .replace(/report|capstone|project/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!subject && issuer) subject = issuer;
  if (!subject) subject = "Untitled";

  // Title Case
  subject = subject
    .split(" ")
    .filter(Boolean)
    .map((w) => (w.length <= 3 && w === w.toLowerCase() ? w : w[0].toUpperCase() + w.slice(1)))
    .join(" ");

  return { title: `${category} — ${subject}`, category, scanned, issuer };
}

export function smartNameFromUrl(url: string): SmartName {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    let category: SmartCategory = "Portfolio";
    if (/github\.com/.test(host)) category = "Project";
    else if (/linkedin\.com/.test(host)) category = "Resume";
    else if (/medium\.com|dev\.to|substack/.test(host)) category = "Portfolio";
    else if (/devfolio|devpost|hackathon/.test(host)) category = "Event";
    else if (/coursera|udemy|edx/.test(host)) category = "Certificate";

    const slug = u.pathname.split("/").filter(Boolean).slice(-1)[0] ?? host;
    const subject = decodeURIComponent(slug).replace(/[-_]+/g, " ").replace(/\.[a-z]+$/i, "");
    const pretty = subject
      .split(" ")
      .filter(Boolean)
      .map((w) => w[0]?.toUpperCase() + w.slice(1))
      .join(" ") || host;
    return {
      title: `${category} — ${pretty}`,
      category,
      scanned: false,
      issuer: host,
    };
  } catch {
    return { title: `Portfolio — ${url.slice(0, 32)}`, category: "Portfolio", scanned: false };
  }
}
