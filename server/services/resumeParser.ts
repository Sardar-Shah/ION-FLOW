import { createRequire } from 'module';
import type { IExtractedSkill, IEducationItem, IExperienceItem, IProjectItem, ICertificationItem } from '../models/ResumeProfile.ts';

const require = createRequire(import.meta.url);
const { PDFParse, InvalidPDFException, PasswordException } = require('pdf-parse');
const mammoth = require('mammoth');

// Comprehensive Canonical Skills Taxonomy with categories
export interface SkillTaxonomyEntry {
  canonicalName: string;
  category: string;
  patterns: RegExp[];
  defaultLevel: number;
}

export const SKILL_TAXONOMY: SkillTaxonomyEntry[] = [
  // Programming Languages
  { canonicalName: 'TypeScript', category: 'Languages', patterns: [/\btypescript\b/i, /\bts\b/i], defaultLevel: 3 },
  { canonicalName: 'JavaScript', category: 'Languages', patterns: [/\bjavascript\b/i, /\bjs\b/i, /\bes6\b/i], defaultLevel: 3 },
  { canonicalName: 'Python', category: 'Languages', patterns: [/\bpython\b/i, /\bpython3\b/i], defaultLevel: 3 },
  { canonicalName: 'Java', category: 'Languages', patterns: [/\bjava\b/i, /\bjdk\b/i, /\bjvm\b/i], defaultLevel: 3 },
  { canonicalName: 'C++', category: 'Languages', patterns: [/\bc\+\+\b/i, /\bcpp\b/i], defaultLevel: 3 },
  { canonicalName: 'C', category: 'Languages', patterns: [/\bc language\b/i, /\bansi c\b/i], defaultLevel: 2 },
  { canonicalName: 'C#', category: 'Languages', patterns: [/\bc#\b/i, /\bcsharp\b/i, /\b\.net\b/i], defaultLevel: 3 },
  { canonicalName: 'Go', category: 'Languages', patterns: [/\bgolang\b/i, /\bgo language\b/i], defaultLevel: 3 },
  { canonicalName: 'Rust', category: 'Languages', patterns: [/\brust\b/i, /\bcargo\b/i], defaultLevel: 3 },
  { canonicalName: 'SQL', category: 'Languages', patterns: [/\bsql\b/i, /\bstructured query language\b/i], defaultLevel: 3 },
  { canonicalName: 'HTML5/CSS3', category: 'Languages', patterns: [/\bhtml5?\b/i, /\bcss3?\b/i], defaultLevel: 4 },
  { canonicalName: 'Bash/Shell', category: 'Languages', patterns: [/\bbash\b/i, /\bshell scripting\b/i, /\bzsh\b/i], defaultLevel: 3 },

  // Frontend & Mobile
  { canonicalName: 'React', category: 'Frontend', patterns: [/\breact(?:\.js)?\b/i, /\breact hooks\b/i], defaultLevel: 3 },
  { canonicalName: 'Next.js', category: 'Frontend', patterns: [/\bnext(?:\.js)?\b/i, /\bssr\b/i], defaultLevel: 3 },
  { canonicalName: 'Vue.js', category: 'Frontend', patterns: [/\bvue(?:\.js)?\b/i, /\bnuxt\b/i], defaultLevel: 3 },
  { canonicalName: 'Angular', category: 'Frontend', patterns: [/\bangular\b/i, /\bangularjs\b/i], defaultLevel: 3 },
  { canonicalName: 'Tailwind CSS', category: 'Frontend', patterns: [/\btailwind(?:\s*css)?\b/i], defaultLevel: 4 },
  { canonicalName: 'Redux', category: 'Frontend', patterns: [/\bredux\b/i, /\bredux toolkit\b/i, /\bzustand\b/i], defaultLevel: 3 },
  { canonicalName: 'React Native', category: 'Frontend', patterns: [/\breact native\b/i, /\bexpo\b/i], defaultLevel: 3 },
  { canonicalName: 'Flutter', category: 'Frontend', patterns: [/\bflutter\b/i, /\bdart\b/i], defaultLevel: 3 },

  // Backend & APIs
  { canonicalName: 'Node.js', category: 'Backend', patterns: [/\bnode(?:\.js)?\b/i], defaultLevel: 3 },
  { canonicalName: 'Express.js', category: 'Backend', patterns: [/\bexpress(?:\.js)?\b/i], defaultLevel: 3 },
  { canonicalName: 'FastAPI', category: 'Backend', patterns: [/\bfastapi\b/i], defaultLevel: 3 },
  { canonicalName: 'Django', category: 'Backend', patterns: [/\bdjango\b/i], defaultLevel: 3 },
  { canonicalName: 'Flask', category: 'Backend', patterns: [/\bflask\b/i], defaultLevel: 3 },
  { canonicalName: 'Spring Boot', category: 'Backend', patterns: [/\bspring boot\b/i, /\bspring framework\b/i], defaultLevel: 3 },
  { canonicalName: 'RESTful APIs', category: 'Backend', patterns: [/\brest(?:ful)?\s*api(?:s)?\b/i, /\bweb services\b/i], defaultLevel: 3 },
  { canonicalName: 'GraphQL', category: 'Backend', patterns: [/\bgraphql\b/i, /\bapollo\b/i], defaultLevel: 3 },
  { canonicalName: 'gRPC', category: 'Backend', patterns: [/\bgrpc\b/i, /\bprotobuf\b/i], defaultLevel: 3 },
  { canonicalName: 'Microservices Architecture', category: 'Backend', patterns: [/\bmicroservices?\b/i, /\bservice-oriented\b/i], defaultLevel: 3 },

  // Databases & Storage
  { canonicalName: 'MongoDB', category: 'Databases', patterns: [/\bmongodb\b/i, /\bmongoose\b/i, /\bdocumentdb\b/i], defaultLevel: 3 },
  { canonicalName: 'PostgreSQL', category: 'Databases', patterns: [/\bpostgresql\b/i, /\bpostgres\b/i], defaultLevel: 3 },
  { canonicalName: 'MySQL', category: 'Databases', patterns: [/\bmysql\b/i, /\bmariadb\b/i], defaultLevel: 3 },
  { canonicalName: 'Redis', category: 'Databases', patterns: [/\bredis\b/i, /\bin-memory cache\b/i], defaultLevel: 3 },
  { canonicalName: 'Prisma / Drizzle ORM', category: 'Databases', patterns: [/\bprisma\b/i, /\bdrizzle\b/i, /\btypeorm\b/i], defaultLevel: 3 },

  // Cloud & DevOps
  { canonicalName: 'Docker', category: 'Cloud & DevOps', patterns: [/\bdocker\b/i, /\bcontainerization\b/i, /\bdockerfile\b/i], defaultLevel: 3 },
  { canonicalName: 'Kubernetes', category: 'Cloud & DevOps', patterns: [/\bkubernetes\b/i, /\bk8s\b/i], defaultLevel: 3 },
  { canonicalName: 'AWS', category: 'Cloud & DevOps', patterns: [/\baws\b/i, /\bamazon web services\b/i, /\bs3\b/i, /\bec2\b/i, /\blambda\b/i], defaultLevel: 3 },
  { canonicalName: 'Google Cloud Platform (GCP)', category: 'Cloud & DevOps', patterns: [/\bgoogle cloud\b/i, /\bgcp\b/i, /\bcloud run\b/i], defaultLevel: 3 },
  { canonicalName: 'Microsoft Azure', category: 'Cloud & DevOps', patterns: [/\bazure\b/i], defaultLevel: 3 },
  { canonicalName: 'CI/CD Pipelines', category: 'Cloud & DevOps', patterns: [/\bci\s*\/\s*cd\b/i, /\bgithub actions\b/i, /\bjenkins\b/i, /\bgitlab ci\b/i], defaultLevel: 3 },
  { canonicalName: 'Terraform', category: 'Cloud & DevOps', patterns: [/\bterraform\b/i, /\biac\b/i, /\binfrastructure as code\b/i], defaultLevel: 3 },
  { canonicalName: 'Linux Administration', category: 'Cloud & DevOps', patterns: [/\blinux\b/i, /\bubuntu\b/i, /\bdebian\b/i, /\bredhat\b/i], defaultLevel: 3 },

  // Cybersecurity
  { canonicalName: 'Network Security', category: 'Cybersecurity', patterns: [/\bnetwork security\b/i, /\bfirewall\b/i, /\btcp\/ip\b/i, /\bwireshark\b/i], defaultLevel: 3 },
  { canonicalName: 'Penetration Testing', category: 'Cybersecurity', patterns: [/\bpenetration testing\b/i, /\bpen testing\b/i, /\bethical hacking\b/i, /\bmetasploit\b/i], defaultLevel: 3 },
  { canonicalName: 'OWASP Security', category: 'Cybersecurity', patterns: [/\bowasp\b/i, /\bvulnerability assessment\b/i, /\bxss\b/i, /\bsql injection\b/i], defaultLevel: 3 },
  { canonicalName: 'Cryptography & Auth', category: 'Cybersecurity', patterns: [/\bcryptography\b/i, /\boauth\b/i, /\bjwt\b/i, /\bssl\/tls\b/i, /\bencryption\b/i], defaultLevel: 3 },
  { canonicalName: 'SIEM & SOC Analysis', category: 'Cybersecurity', patterns: [/\bsiem\b/i, /\bsplunk\b/i, /\bsoc\b/i, /\bincident response\b/i], defaultLevel: 3 },

  // AI & Data Science
  { canonicalName: 'Machine Learning', category: 'Data & AI', patterns: [/\bmachine learning\b/i, /\bml\b/i, /\bscikit-learn\b/i], defaultLevel: 3 },
  { canonicalName: 'Deep Learning', category: 'Data & AI', patterns: [/\bdeep learning\b/i, /\bneural networks\b/i, /\bpytorch\b/i, /\btensorflow\b/i, /\bkeras\b/i], defaultLevel: 3 },
  { canonicalName: 'Generative AI & LLMs', category: 'Data & AI', patterns: [/\bgenerative ai\b/i, /\bllm(?:s)?\b/i, /\bgemini\b/i, /\blangchain\b/i, /\brag\b/i, /\bprompt engineering\b/i], defaultLevel: 3 },
  { canonicalName: 'Data Analysis & Pandas', category: 'Data & AI', patterns: [/\bpandas\b/i, /\bnumpy\b/i, /\bdata analysis\b/i, /\beda\b/i], defaultLevel: 3 },
  { canonicalName: 'Data Visualization', category: 'Data & AI', patterns: [/\btableau\b/i, /\bpower\s*bi\b/i, /\bmatplotlib\b/i, /\bseaborn\b/i, /\bd3\.js\b/i], defaultLevel: 3 },
  { canonicalName: 'Data Engineering & ETL', category: 'Data & AI', patterns: [/\betl\b/i, /\bdata pipeline\b/i, /\bspark\b/i, /\bairflow\b/i], defaultLevel: 3 },

  // Testing & Tooling
  { canonicalName: 'Git & Version Control', category: 'Developer Tools', patterns: [/\bgit\b/i, /\bgithub\b/i, /\bgitlab\b/i, /\bversion control\b/i], defaultLevel: 4 },
  { canonicalName: 'Automated Testing (Unit/E2E)', category: 'Quality & Testing', patterns: [/\bjest\b/i, /\bcypress\b/i, /\bplaywright\b/i, /\bvitest\b/i, /\bpytest\b/i, /\bunit testing\b/i], defaultLevel: 3 },
  { canonicalName: 'Agile & Scrum', category: 'Practices', patterns: [/\bagile\b/i, /\bscrum\b/i, /\bsprint\b/i, /\bjira\b/i], defaultLevel: 3 },
  { canonicalName: 'System Design & Architecture', category: 'Architecture', patterns: [/\bsystem design\b/i, /\bsoftware architecture\b/i, /\bscalability\b/i, /\bhigh availability\b/i], defaultLevel: 3 }
];

export class ResumeParserService {
  /**
   * Extracts raw text from uploaded Buffer according to file type
   */
  static async extractRawTextFromBuffer(buffer: Buffer, fileType: 'pdf' | 'docx' | 'txt' | 'pasted', originalName: string = ''): Promise<string> {
    if (!buffer || buffer.length === 0) {
      throw new Error('The uploaded file is empty (0 bytes). Please upload a valid resume document.');
    }

    if (fileType === 'pdf' || originalName.toLowerCase().endsWith('.pdf')) {
      // 1. Enforce max file size limit (10MB)
      const MAX_PDF_SIZE = 10 * 1024 * 1024;
      if (buffer.length > MAX_PDF_SIZE) {
        throw new Error('PDF file exceeds the maximum size limit of 10MB. Please upload a smaller document.');
      }

      // 2. Validate PDF signature in header bytes
      const headerChunk = buffer.subarray(0, Math.min(buffer.length, 1024)).toString('latin1');
      if (!headerChunk.includes('%PDF-')) {
        throw new Error('Uploaded file does not appear to be a valid PDF (missing %PDF- header). Please ensure you upload an authentic PDF file.');
      }

      // 3. Class-based PDFParse invocation with destroy in finally
      let parser: any = null;
      try {
        parser = new PDFParse({ data: buffer });
        const res = await parser.getText();
        const extracted = res?.text || '';

        // Strip page delimiter markers added by pdf-parse v2 (e.g. "-- 1 of 2 --")
        const cleanText = extracted.replace(/--\s*\d+\s*of\s*\d+\s*--/gi, '').trim();

        // 4. Validate that meaningful text was extracted (detect scanned/image-only PDFs)
        const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
        if (!cleanText || cleanText.length < 30 || wordCount < 5) {
          throw new Error('The PDF file contains no extractable text layer (it may be a scanned image or photo). Please upload a text-based PDF, DOCX file, or paste your resume text directly.');
        }

        return cleanText;
      } catch (err: any) {
        // Re-throw our friendly validation errors directly
        if (
          err.message &&
          (err.message.includes('scanned image') ||
            err.message.includes('extractable text layer') ||
            err.message.includes('missing %PDF-') ||
            err.message.includes('empty'))
        ) {
          throw err;
        }

        if (err instanceof PasswordException || err?.name === 'PasswordException' || /password/i.test(err?.message || '')) {
          throw new Error('This PDF is password-protected or encrypted. Please remove password protection and upload an unlocked resume.');
        }

        if (err instanceof InvalidPDFException || err?.name === 'InvalidPDFException' || /invalid|corrupt|format/i.test(err?.message || '')) {
          throw new Error('Corrupted or malformed PDF structure. Please re-export or save your resume as a clean PDF.');
        }

        throw new Error(`PDF extraction error: ${err.message || 'Corrupted or unreadable PDF'}`);
      } finally {
        if (parser && typeof parser.destroy === 'function') {
          try {
            await parser.destroy();
          } catch {
            // Ignore cleanup release errors
          }
        }
      }
    }

    if (fileType === 'docx' || originalName.toLowerCase().endsWith('.docx')) {
      try {
        const result = await mammoth.extractRawText({ buffer });
        if (result.value && result.value.trim().length > 20) {
          return result.value.trim();
        }
        throw new Error('DOCX document contained no readable text.');
      } catch (err: any) {
        throw new Error(`DOCX extraction error: ${err.message || 'Corrupted DOCX'}`);
      }
    }

    // Default: TXT or UTF-8 buffer
    const text = buffer.toString('utf-8');
    if (text.trim().length === 0) {
      throw new Error('File is empty.');
    }
    return text.trim();
  }

  /**
   * Performs deep structured parsing of resume text
   */
  static parseResumeText(rawText: string): {
    personalInfo: { fullName?: string; email?: string; phone?: string; github?: string; linkedin?: string };
    education: IEducationItem[];
    skills: IExtractedSkill[];
    experience: IExperienceItem[];
    projects: IProjectItem[];
    certifications: ICertificationItem[];
    toolsAndTech: string[];
    transferableSkills: string[];
    strengths: string[];
  } {
    const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
    const textLower = rawText.toLowerCase();

    // 1. Extract Personal Info
    const emailMatch = rawText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    const phoneMatch = rawText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    const githubMatch = rawText.match(/(?:github\.com\/)([a-zA-Z0-9-]+)/i);
    const linkedinMatch = rawText.match(/(?:linkedin\.com\/in\/)([a-zA-Z0-9-]+)/i);

    // Heuristic for name: Usually first line or non-contact line at top
    let fullName = '';
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const candidate = lines[i];
      if (
        candidate.length > 2 &&
        candidate.length < 50 &&
        !candidate.includes('@') &&
        !candidate.includes('http') &&
        !candidate.toLowerCase().includes('resume') &&
        !candidate.toLowerCase().includes('curriculum') &&
        !phoneMatch?.[0]?.includes(candidate)
      ) {
        fullName = candidate.replace(/[^\w\s-]/g, '').trim();
        break;
      }
    }

    // 2. Identify Sections & Paragraphs
    const sectionKeywords = [
      { key: 'education', patterns: [/^education\b/i, /^academic background\b/i, /^qualifications\b/i] },
      { key: 'experience', patterns: [/^experience\b/i, /^work experience\b/i, /^employment\b/i, /^internships?\b/i] },
      { key: 'projects', patterns: [/^projects\b/i, /^technical projects\b/i, /^academic projects\b/i] },
      { key: 'skills', patterns: [/^skills\b/i, /^technical skills\b/i, /^core competencies\b/i, /^technologies\b/i] },
      { key: 'certifications', patterns: [/^certifications?\b/i, /^licenses\b/i, /^training\b/i] }
    ];

    const sectionIndices: Array<{ key: string; lineIndex: number }> = [];
    lines.forEach((line, idx) => {
      for (const sec of sectionKeywords) {
        if (sec.patterns.some((p) => p.test(line)) && line.length < 40) {
          sectionIndices.push({ key: sec.key, lineIndex: idx });
          break;
        }
      }
    });

    const getSectionText = (key: string): string => {
      const idx = sectionIndices.find((s) => s.key === key);
      if (!idx) return '';
      const nextIdx = sectionIndices.find((s) => s.lineIndex > idx.lineIndex);
      const endLine = nextIdx ? nextIdx.lineIndex : lines.length;
      return lines.slice(idx.lineIndex + 1, endLine).join('\n');
    };

    const educationText = getSectionText('education');
    const experienceText = getSectionText('experience');
    const projectsText = getSectionText('projects');
    const skillsSectionText = getSectionText('skills');
    const certsText = getSectionText('certifications');

    // 3. Extract Education Items
    const education: IEducationItem[] = [];
    const degreeRegex = /(?:bachelor|master|b\.s\.|b\.tech|m\.s\.|phd|associate|diploma|bootcamp)[\w\s&,]*(?:in|of)?\s*[\w\s&]*/i;
    const eduParagraphs = (educationText || rawText).split(/\n\s*\n|\n(?=[A-Z])/).filter((p) => p.trim().length > 10);
    
    // Look for universities / degrees
    const universityKeywords = ['university', 'college', 'institute', 'polytechnic', 'school of', 'academy'];
    eduParagraphs.forEach((p) => {
      const pLower = p.toLowerCase();
      const hasUni = universityKeywords.some((u) => pLower.includes(u));
      const hasDegree = degreeRegex.test(p);
      if (hasUni || hasDegree) {
        const pLines = p.split('\n').map((l) => l.trim()).filter(Boolean);
        const schoolLine = pLines.find((l) => universityKeywords.some((u) => l.toLowerCase().includes(u))) || pLines[0] || 'University';
        const degreeMatch = p.match(degreeRegex);
        const yearMatch = p.match(/(?:19|20)\d{2}\s*(?:-|–|to)?\s*(?:(?:19|20)\d{2}|present|expected)/i);
        const gpaMatch = p.match(/gpa[:\s]*(\d\.\d{1,2}(?:\s*\/\s*\d\.\d{1,2})?)/i);

        education.push({
          school: schoolLine,
          degree: degreeMatch ? degreeMatch[0].trim() : 'Computer Science / Engineering Degree',
          year: yearMatch ? yearMatch[0] : '2023 - Present',
          gpa: gpaMatch ? gpaMatch[1] : undefined
        });
      }
    });

    if (education.length === 0) {
      education.push({
        school: 'University Program',
        degree: 'Bachelor of Science in Computer Science or Related Field',
        year: 'Expected 2026'
      });
    }

    // 4. Extract Projects
    const projects: IProjectItem[] = [];
    const projectBlocks = (projectsText || '').split(/\n\s*\n/).filter((b) => b.trim().length > 15);
    projectBlocks.forEach((block) => {
      const bLines = block.split('\n').map((l) => l.trim()).filter(Boolean);
      if (bLines.length > 0) {
        const titleLine = bLines[0];
        const highlights = bLines.slice(1);
        
        // Find tech stack in title or bullet points
        const foundTech: string[] = [];
        SKILL_TAXONOMY.forEach((st) => {
          if (st.patterns.some((p) => p.test(block))) {
            foundTech.push(st.canonicalName);
          }
        });

        projects.push({
          title: titleLine.replace(/^[-*•]\s*/, '').replace(/\|.*$/, '').trim(),
          techStack: Array.from(new Set(foundTech)).slice(0, 6),
          description: highlights.join(' '),
          highlights: highlights.map((h) => h.replace(/^[-*•]\s*/, ''))
        });
      }
    });

    // 5. Extract Experience
    const experience: IExperienceItem[] = [];
    const expBlocks = (experienceText || '').split(/\n\s*\n/).filter((b) => b.trim().length > 15);
    expBlocks.forEach((block) => {
      const eLines = block.split('\n').map((l) => l.trim()).filter(Boolean);
      if (eLines.length > 0) {
        const header = eLines[0];
        const highlights = eLines.slice(1);
        const durationMatch = block.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|[0-9]{4})\s*[-–]\s*(?:Present|[0-9]{4}|[a-zA-Z]+)/i);

        experience.push({
          role: header.split(/[-|–,]/)[0]?.trim() || header,
          company: header.split(/[-|–,]/)[1]?.trim() || 'Software Organization',
          duration: durationMatch ? durationMatch[0] : 'Recent',
          highlights: highlights.map((h) => h.replace(/^[-*•]\s*/, ''))
        });
      }
    });

    // 6. Extract Certifications
    const certifications: ICertificationItem[] = [];
    if (certsText) {
      certsText.split('\n').forEach((line) => {
        const trimmed = line.replace(/^[-*•]\s*/, '').trim();
        if (trimmed.length > 5) {
          certifications.push({
            name: trimmed,
            issuer: trimmed.includes('AWS') ? 'Amazon Web Services' : trimmed.includes('Google') ? 'Google Cloud' : undefined
          });
        }
      });
    }

    // 7. Extract Skills with Sentence-Level EVIDENCE and Confidence
    const extractedSkills: IExtractedSkill[] = [];
    const sentences = rawText.split(/(?<=[.!?\n])\s+/);

    SKILL_TAXONOMY.forEach((item) => {
      let isPresent = false;
      let matchedEvidence = '';
      let confidence: 'demonstrated' | 'partially_demonstrated' | 'inferred' = 'inferred';
      let sourceSection = 'Skills';
      let level = item.defaultLevel;

      // Check projects text first (Demonstrated)
      for (const sent of sentences) {
        if (item.patterns.some((p) => p.test(sent))) {
          isPresent = true;
          const sentClean = sent.replace(/\s+/g, ' ').trim();

          // Check if in projects or experience
          const inProjects = projectsText.includes(sent.trim());
          const inExp = experienceText.includes(sent.trim());
          const hasActionVerb = /\b(?:built|developed|implemented|engineered|architected|designed|deployed|optimized|refactored|integrated|created|led)\b/i.test(sent);

          if (inProjects || inExp || hasActionVerb) {
            confidence = 'demonstrated';
            sourceSection = inExp ? 'Experience' : 'Projects';
            matchedEvidence = sentClean.length > 150 ? sentClean.slice(0, 147) + '...' : sentClean;
            level = Math.min(5, item.defaultLevel + 1);
            break;
          } else if (!matchedEvidence) {
            matchedEvidence = sentClean.length > 150 ? sentClean.slice(0, 147) + '...' : sentClean;
          }
        }
      }

      // If matched in skills section only
      if (!isPresent && skillsSectionText) {
        if (item.patterns.some((p) => p.test(skillsSectionText))) {
          isPresent = true;
          confidence = 'inferred';
          sourceSection = 'Skills Section';
          matchedEvidence = `Listed in resume Technical Skills section under ${item.category}`;
          level = item.defaultLevel;
        }
      }

      if (isPresent) {
        extractedSkills.push({
          name: item.canonicalName,
          category: item.category,
          level,
          evidence: matchedEvidence || `Demonstrated knowledge of ${item.canonicalName} identified in resume`,
          confidence,
          sourceSection
        });
      }
    });

    // 8. Transferable skills and strengths
    const transferable: string[] = [];
    if (/\b(?:team|collaborat|pair programming|agile|cross-functional)\b/i.test(rawText)) {
      transferable.push('Cross-Functional Collaboration');
    }
    if (/\b(?:problem solv|analytical|troubleshoot|debug)\b/i.test(rawText)) {
      transferable.push('Analytical Problem Solving');
    }
    if (/\b(?:document|present|communicat|written)\b/i.test(rawText)) {
      transferable.push('Technical Communication');
    }
    if (/\b(?:deadline|ownership|autonomous|lead|mentor)\b/i.test(rawText)) {
      transferable.push('Engineering Ownership & Initiative');
    }
    if (/\b(?:ci\/cd|testing|clean code|code review|quality)\b/i.test(rawText)) {
      transferable.push('Software Quality & Testing Rigor');
    }

    const strengths: string[] = [];
    if (extractedSkills.some((s) => s.category === 'Frontend' && s.confidence === 'demonstrated')) {
      strengths.push('Demonstrated Frontend Web Engineering');
    }
    if (extractedSkills.some((s) => s.category === 'Backend' && s.confidence === 'demonstrated')) {
      strengths.push('Demonstrated REST & Server Architecture');
    }
    if (extractedSkills.some((s) => s.category === 'Databases')) {
      strengths.push('Relational & Document Database Competency');
    }
    if (extractedSkills.some((s) => s.category === 'Cloud & DevOps')) {
      strengths.push('Containerization & Cloud Deployment Awareness');
    }
    if (extractedSkills.some((s) => s.category === 'Cybersecurity')) {
      strengths.push('Security-First Mindset & Vulnerability Analysis');
    }
    if (extractedSkills.some((s) => s.category === 'Data & AI')) {
      strengths.push('Applied Machine Learning & Data Pipeline Experience');
    }

    const toolsAndTech = extractedSkills.map((s) => s.name);

    return {
      personalInfo: {
        fullName: fullName || 'Candidate Student',
        email: emailMatch ? emailMatch[0] : undefined,
        phone: phoneMatch ? phoneMatch[0] : undefined,
        github: githubMatch ? `https://github.com/${githubMatch[1]}` : undefined,
        linkedin: linkedinMatch ? `https://linkedin.com/in/${linkedinMatch[1]}` : undefined
      },
      education,
      skills: extractedSkills,
      experience,
      projects,
      certifications,
      toolsAndTech,
      transferableSkills: transferable.length > 0 ? transferable : ['Analytical Problem Solving', 'Technical Communication', 'Collaborative Coding'],
      strengths: strengths.length > 0 ? strengths : ['Full-Stack Foundations', 'Continuous Learning Aptitude']
    };
  }
}
