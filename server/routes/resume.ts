import express, { Response } from 'express';
import multer from 'multer';
import { optionalAuth, AuthRequest } from '../middleware/auth.ts';
import { ResumeParserService } from '../services/resumeParser.ts';
import { CareerRecommenderService } from '../services/careerRecommender.ts';
import { ResumeProfile, IResumeProfile } from '../models/ResumeProfile.ts';
import { User } from '../models/User.ts';
import mongoose from 'mongoose';

const router = express.Router();

// Memory storage for file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});

// In-memory fallback cache for guests or transient sessions
const guestProfiles = new Map<string, any>();

// Sample resumes for hackathon judges & instant demo
export const SAMPLE_RESUMES = {
  'cs-sophomore': {
    title: 'CS Sophomore — Software Engineering Student',
    text: `ALEX CHEN
San Francisco, CA | alex.chen@university.edu | github.com/alexchen-dev | linkedin.com/in/alexchen-cs

EDUCATION
University of California, Berkeley
Bachelor of Science in Computer Science | Expected May 2027 | GPA: 3.82
Relevant Coursework: Data Structures & Algorithms, Computer Architecture, Discrete Math, Database Systems

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, Python, C++, SQL, HTML5/CSS3
Frameworks & Libraries: React, Node.js, Express.js, Tailwind CSS, Jest
Databases & Cloud: MongoDB, PostgreSQL, Git, Docker, Linux

PROJECTS
StudySync — Real-Time Collaborative Study Hub (React, Node.js, Socket.io, MongoDB)
• Built a full-stack collaborative markdown editor with live syncing for 500+ student users.
• Developed RESTful API endpoints in Express with JWT authentication and bcrypt password hashing.
• Designed normalized MongoDB schemas with Mongoose and implemented Docker compose setup.

Algorithmic Trading Backtester (Python, Pandas, NumPy)
• Engineered a backtesting engine evaluating moving-average strategies across 5 years of historical S&P 500 data.
• Implemented automated unit tests with PyTest achieving 85% test coverage.

EXPERIENCE
Undergraduate Course Reader — Data Structures
UC Berkeley EECS | Jan 2025 - Present
• Graded weekly programming assignments in Java and Python for 120+ students.
• Conducted weekly office hours explaining graph traversal, heap allocations, and algorithmic complexity.

LEADERSHIP & ACTIVITIES
Hackathon Webmaster — CalHacks | Aug 2024 - Present
• Collaborated in an Agile Scrum team of 8 to build and maintain the annual hackathon registration portal.`
  },
  'ai-junior': {
    title: 'Junior — AI & Data Science Specialist',
    text: `MAYA PATEL
Seattle, WA | maya.patel@uw.edu | github.com/mayapatel-ai | linkedin.com/in/mayapatel-ds

EDUCATION
University of Washington
Bachelor of Science in Informatics & Machine Learning | Expected June 2026 | GPA: 3.90
Coursework: Machine Learning, Deep Neural Networks, Natural Language Processing, Applied Statistics, Cloud Computing

TECHNICAL SKILLS
Languages: Python, SQL, Bash/Shell, R, C++
Frameworks: PyTorch, TensorFlow, Scikit-Learn, FastAPI, Pandas, NumPy, HuggingFace
Cloud & Tools: Docker, AWS (S3, EC2), Git, Linux, Tableau, Jupyter Notebooks

PROJECTS
MedVision — Chest X-Ray Pathology Classifier (PyTorch, ResNet-50, FastAPI)
• Built a deep learning convolutional neural network achieving 92.4% ROC-AUC on NIH ChestX-ray14 dataset.
• Deployed a containerized inference microservice using FastAPI and Docker on AWS EC2.
• Engineered image augmentation pipelines using Torchvision and integrated automated evaluation benchmarks.

EcoRoute — Carbon-Optimized Navigation Analytics (Python, Pandas, OpenStreetMap)
• Developed graph optimization algorithms to calculate lowest-emission vehicle routes across urban transit grids.
• Visualized multi-modal transit telemetry using Tableau dashboards and Matplotlib.

EXPERIENCE
Machine Learning Research Assistant
UW Neural Computation Lab | June 2024 - Present
• Fine-tuned transformer models for scientific paper classification using PyTorch and HuggingFace.
• Authored reproducible data pipelines processing 2M+ research abstracts with Pandas and PostgreSQL.`
  },
  'cyber-student': {
    title: 'Junior — Cybersecurity & Cloud Operations',
    text: `JORDAN TAYLOR
Austin, TX | jordan.taylor@utexas.edu | github.com/jordant-sec | linkedin.com/in/jordantaylor-sec

EDUCATION
University of Texas at Austin
Bachelor of Science in Computer Science (Cybersecurity Track) | Expected Dec 2026 | GPA: 3.75
Coursework: Computer Networks, Network Security, Operating Systems, Cryptography, Cloud Infrastructure

TECHNICAL SKILLS
Security & Networking: Network Security, OWASP Security, Cryptography & Auth, Penetration Testing, Wireshark, SIEM & SOC Analysis
Systems & DevOps: Linux Administration, Bash/Shell, Docker, Kubernetes, AWS, Terraform, Git
Languages: Python, Go, C, SQL, Bash

PROJECTS
ZeroTrust Sentinel — Microservice Identity & Auth Gateway (Go, Docker, JWT)
• Implemented an OAuth 2.0 / OpenID Connect reverse proxy gateway validating mTLS certificates.
• Built automated vulnerability scanning in GitHub Actions using Trivy and OWASP ZAP.
• Deployed multi-container environment on Docker and configured Linux firewall iptables.

PacketGuardian — Network Intrusion Detection System (Python, Scapy, Wireshark)
• Developed real-time packet inspection engine detecting SYN flood attacks and port scanning anomalies.
• Structured automated log forwarding to Elasticsearch and built security alert dashboards.

EXPERIENCE
Security Operations Center (SOC) Student Analyst
UT Austin Information Security Office | Sept 2024 - Present
• Monitored university network traffic using Splunk SIEM, triaging 50+ security incident alerts weekly.
• Conducted vulnerability assessments using Nessus and documented incident response post-mortems.`
  }
};

/**
 * POST /api/resume/parse
 * Handles upload of PDF, DOCX, TXT or direct text payload
 */
router.post('/parse', optionalAuth, upload.single('resumeFile'), async (req: AuthRequest, res: Response) => {
  try {
    let rawText = '';
    let fileName = 'pasted-resume.txt';
    let fileType: 'pdf' | 'docx' | 'txt' | 'pasted' = 'pasted';
    let fileSize = 0;

    if (req.file) {
      fileName = req.file.originalname;
      fileSize = req.file.size;
      const ext = fileName.toLowerCase().split('.').pop();
      if (ext === 'pdf') fileType = 'pdf';
      else if (ext === 'docx') fileType = 'docx';
      else fileType = 'txt';

      rawText = await ResumeParserService.extractRawTextFromBuffer(req.file.buffer, fileType, fileName);
    } else if (req.body.text && typeof req.body.text === 'string' && req.body.text.trim().length > 20) {
      rawText = req.body.text.trim();
      fileName = req.body.fileName || 'submitted-resume.txt';
      fileType = req.body.fileType || 'pasted';
      fileSize = rawText.length;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF, DOCX, or TXT resume file, or paste your resume text (at least 20 characters).'
      });
    }

    // Step 1: Deep structured parsing
    const parsedData = ResumeParserService.parseResumeText(rawText);

    // Step 2: Dynamic career recommendation generation
    const recResult = await CareerRecommenderService.generateRecommendations({
      skills: parsedData.skills,
      projects: parsedData.projects,
      experience: parsedData.experience,
      education: parsedData.education,
      strengths: parsedData.strengths,
      userInterests: req.user?.careerInterests
    });

    // Step 3: Persistence to MongoDB Atlas
    const userId = req.user ? req.user._id : undefined;
    const guestId = req.headers['x-guest-id']?.toString() || `guest-${Date.now()}`;

    let profileDoc: IResumeProfile | null = null;
    if (mongoose.connection.readyState === 1) {
      try {
        if (userId) {
          profileDoc = await ResumeProfile.findOneAndUpdate(
            { userId },
            {
              $set: {
                rawText,
                fileName,
                fileType,
                fileSize,
                personalInfo: parsedData.personalInfo,
                education: parsedData.education,
                skills: parsedData.skills,
                experience: parsedData.experience,
                projects: parsedData.projects,
                certifications: parsedData.certifications,
                toolsAndTech: parsedData.toolsAndTech,
                transferableSkills: parsedData.transferableSkills,
                strengths: parsedData.strengths,
                recommendedCareers: recResult.recommendations,
                isReviewed: false,
                aiAnalysisStatus: recResult.aiStatus,
                aiAnalysisMessage: recResult.message
              }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );

          // Update user assessed skills in User document as well for backward compatibility
          await User.findByIdAndUpdate(userId, {
            $set: {
              degree: parsedData.education[0]?.degree || 'Computer Science',
              assessedSkills: parsedData.skills.map((s) => ({
                skillName: s.name,
                normalizedName: s.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
                level: s.level,
                source: s.sourceSection,
                evidence: s.evidence,
                updatedAt: new Date()
              }))
            }
          });
        } else {
          profileDoc = await ResumeProfile.findOneAndUpdate(
            { guestId },
            {
              $set: {
                rawText,
                fileName,
                fileType,
                fileSize,
                personalInfo: parsedData.personalInfo,
                education: parsedData.education,
                skills: parsedData.skills,
                experience: parsedData.experience,
                projects: parsedData.projects,
                certifications: parsedData.certifications,
                toolsAndTech: parsedData.toolsAndTech,
                transferableSkills: parsedData.transferableSkills,
                strengths: parsedData.strengths,
                recommendedCareers: recResult.recommendations,
                isReviewed: false,
                aiAnalysisStatus: recResult.aiStatus,
                aiAnalysisMessage: recResult.message
              }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
        }
      } catch (dbErr: any) {
        console.warn('[ResumeRoute] MongoDB save error, falling back to memory:', dbErr.message);
      }
    }

    // Save in guest map as well
    const payload = {
      _id: profileDoc?._id || `profile-${guestId}`,
      guestId,
      rawText,
      fileName,
      fileType,
      fileSize,
      personalInfo: parsedData.personalInfo,
      education: parsedData.education,
      skills: parsedData.skills,
      experience: parsedData.experience,
      projects: parsedData.projects,
      certifications: parsedData.certifications,
      toolsAndTech: parsedData.toolsAndTech,
      transferableSkills: parsedData.transferableSkills,
      strengths: parsedData.strengths,
      recommendedCareers: recResult.recommendations,
      isReviewed: false,
      aiAnalysisStatus: recResult.aiStatus,
      aiAnalysisMessage: recResult.message,
      createdAt: new Date()
    };

    guestProfiles.set(guestId, payload);
    if (userId) guestProfiles.set(userId.toString(), payload);

    return res.json({
      success: true,
      profile: payload,
      message: 'Resume analyzed successfully. Review and confirm extracted skills.'
    });
  } catch (error: any) {
    console.error('[ResumeRoute] Error analyzing resume:', error);
    return res.status(500).json({
      success: false,
      message: `Resume processing error: ${error?.message || 'Failed to parse document'}`
    });
  }
});

/**
 * GET /api/resume/latest
 * Retrieves latest analyzed resume for user or guest
 */
router.get('/latest', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user ? req.user._id : undefined;
    const guestId = req.headers['x-guest-id']?.toString() || 'default-guest';

    if (mongoose.connection.readyState === 1) {
      const query = userId ? { userId } : { guestId };
      const doc = await ResumeProfile.findOne(query).sort({ updatedAt: -1 });
      if (doc) {
        return res.json({ success: true, profile: doc });
      }
    }

    const cached = (userId && guestProfiles.get(userId.toString())) || guestProfiles.get(guestId);
    if (cached) {
      return res.json({ success: true, profile: cached });
    }

    // Fallback: Default sample profile so judges have rich data on first click
    const defaultSample = SAMPLE_RESUMES['cs-sophomore'];
    const parsed = ResumeParserService.parseResumeText(defaultSample.text);
    const recs = await CareerRecommenderService.generateRecommendations({
      skills: parsed.skills,
      projects: parsed.projects,
      experience: parsed.experience,
      education: parsed.education,
      strengths: parsed.strengths
    });

    const fallbackProfile = {
      _id: 'default-preview-profile',
      guestId,
      rawText: defaultSample.text,
      fileName: 'Alex_Chen_UCBerkeley_Resume.pdf',
      fileType: 'pdf',
      fileSize: 42000,
      personalInfo: parsed.personalInfo,
      education: parsed.education,
      skills: parsed.skills,
      experience: parsed.experience,
      projects: parsed.projects,
      certifications: parsed.certifications,
      toolsAndTech: parsed.toolsAndTech,
      transferableSkills: parsed.transferableSkills,
      strengths: parsed.strengths,
      recommendedCareers: recs.recommendations,
      isReviewed: true,
      aiAnalysisStatus: 'deterministic_parser',
      aiAnalysisMessage: 'Ready for interactive review and target role selection.',
      createdAt: new Date()
    };

    return res.json({ success: true, profile: fallbackProfile, isDefaultPreview: true });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * PUT /api/resume/review
 * Saves user corrections, modified skills, added skills, or deleted items
 */
router.put('/review', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { skills, education, experience, projects } = req.body;
    if (!Array.isArray(skills)) {
      return res.status(400).json({ success: false, message: 'Skills array is required.' });
    }

    const userId = req.user ? req.user._id : undefined;
    const guestId = req.headers['x-guest-id']?.toString() || 'default-guest';

    // Recalculate recommendations based on reviewed skills
    const recResult = await CareerRecommenderService.generateRecommendations({
      skills,
      projects: projects || [],
      experience: experience || [],
      education: education || [],
      strengths: skills.filter((s: any) => s.level >= 4).map((s: any) => `${s.name} Proficiency`)
    });

    let updatedDoc: any = null;
    if (mongoose.connection.readyState === 1) {
      const query = userId ? { userId } : { guestId };
      updatedDoc = await ResumeProfile.findOneAndUpdate(
        query,
        {
          $set: {
            skills,
            isReviewed: true,
            recommendedCareers: recResult.recommendations,
            ...(education ? { education } : {}),
            ...(experience ? { experience } : {}),
            ...(projects ? { projects } : {})
          }
        },
        { new: true }
      );
    }

    const updatedProfile = updatedDoc || {
      guestId,
      skills,
      education,
      experience,
      projects,
      isReviewed: true,
      recommendedCareers: recResult.recommendations
    };

    if (userId) guestProfiles.set(userId.toString(), updatedProfile);
    guestProfiles.set(guestId, updatedProfile);

    return res.json({
      success: true,
      profile: updatedProfile,
      message: 'Resume profile reviewed and confirmed successfully!'
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/resume/samples
 * Returns list of hackathon sample resumes
 */
router.get('/samples', (_req, res) => {
  return res.json({
    success: true,
    samples: [
      { id: 'cs-sophomore', title: SAMPLE_RESUMES['cs-sophomore'].title, text: SAMPLE_RESUMES['cs-sophomore'].text },
      { id: 'ai-junior', title: SAMPLE_RESUMES['ai-junior'].title, text: SAMPLE_RESUMES['ai-junior'].text },
      { id: 'cyber-student', title: SAMPLE_RESUMES['cyber-student'].title, text: SAMPLE_RESUMES['cyber-student'].text }
    ]
  });
});

export default router;
