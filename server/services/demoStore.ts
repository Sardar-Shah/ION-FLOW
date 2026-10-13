import { IUser, IUserSkill } from '../models/User.ts';
import { initialCareers } from '../data/careersData.ts';

// In-memory cache used when MongoDB Atlas is connecting or pending IP whitelist (0.0.0.0/0)
interface StoredUser {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  degree: string;
  educationLevel: string;
  currentSemester: string;
  careerInterests: string[];
  preferredLearningPace: 'accelerated' | 'moderate' | 'relaxed';
  assessedSkills: IUserSkill[];
  targetCareerSlug: string;
  savedCareers: string[];
  createdAt: Date;
  updatedAt: Date;
}

const memoryUsers = new Map<string, StoredUser>();
const memoryRoadmaps = new Map<string, any>();
const memoryProjects = new Map<string, any>();
const memoryResources = new Map<string, any>();
const memoryAssessments = new Map<string, any[]>();
const memoryActivity = new Map<string, any[]>();

// Prepopulate standard demo users for immediate hackathon access
const seedDemoUsers = () => {
  if (memoryUsers.size === 0) {
    // Jane Doe - Cybersecurity Analyst
    const jane: StoredUser = {
      _id: 'demo-user-jane-cyber',
      name: 'Jane Doe',
      email: 'jane.cyber@university.edu',
      passwordHash: '$2a$10$wTf7JzG3.k8mE6xT1oFhEuQ7mD9cZ6v1j3k5l7m9n1p3q5r7s9t1', // pre-hashed
      degree: 'Cybersecurity & Computer Science',
      educationLevel: 'Undergraduate',
      currentSemester: 'Year 3, Semester 1',
      careerInterests: ['cybersecurity-analyst'],
      preferredLearningPace: 'moderate',
      assessedSkills: [
        {
          skillName: 'Network Fundamentals & Protocols',
          normalizedName: 'networking',
          level: 3,
          source: 'Network Security Lab',
          evidence: 'Completed Wireshark packet capture lab',
          updatedAt: new Date()
        },
        {
          skillName: 'Security Information & Event Management (SIEM)',
          normalizedName: 'siem-monitoring',
          level: 2,
          source: 'Self-taught',
          evidence: 'Wazuh testbed deployment',
          updatedAt: new Date()
        },
        {
          skillName: 'Web Application Security (OWASP Top 10)',
          normalizedName: 'owasp-security',
          level: 3,
          source: 'OWASP Juice Shop',
          evidence: 'Resolved 8 vulnerability challenges',
          updatedAt: new Date()
        },
        {
          skillName: 'Security Scripting (Python / Bash)',
          normalizedName: 'security-scripting',
          level: 2,
          source: 'Coursework',
          evidence: '',
          updatedAt: new Date()
        }
      ],
      targetCareerSlug: 'cybersecurity-analyst',
      savedCareers: ['cloud-engineer'],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memoryUsers.set(jane.email, jane);
    memoryUsers.set(jane._id, jane);

    // Alex Chen - Full-Stack Developer
    const alex: StoredUser = {
      _id: 'demo-user-alex-fullstack',
      name: 'Alex Chen',
      email: 'alex.chen@university.edu',
      passwordHash: '$2a$10$wTf7JzG3.k8mE6xT1oFhEuQ7mD9cZ6v1j3k5l7m9n1p3q5r7s9t1',
      degree: 'Software Engineering',
      educationLevel: 'Undergraduate',
      currentSemester: 'Year 3, Semester 2',
      careerInterests: ['full-stack-developer'],
      preferredLearningPace: 'accelerated',
      assessedSkills: [
        {
          skillName: 'React & Client Architecture',
          normalizedName: 'react',
          level: 3,
          source: 'Web Dev Course',
          evidence: '',
          updatedAt: new Date()
        },
        {
          skillName: 'Node.js & Express API Development',
          normalizedName: 'nodejs',
          level: 3,
          source: 'Coursework',
          evidence: '',
          updatedAt: new Date()
        },
        {
          skillName: 'Full-Stack TypeScript',
          normalizedName: 'typescript',
          level: 2,
          source: 'Personal Projects',
          evidence: '',
          updatedAt: new Date()
        }
      ],
      targetCareerSlug: 'full-stack-developer',
      savedCareers: ['backend-developer', 'frontend-developer'],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memoryUsers.set(alex.email, alex);
    memoryUsers.set(alex._id, alex);

    // Maria Garcia - Data Scientist
    const maria: StoredUser = {
      _id: 'demo-user-maria-data',
      name: 'Maria Garcia',
      email: 'maria.data@university.edu',
      passwordHash: '$2a$10$wTf7JzG3.k8mE6xT1oFhEuQ7mD9cZ6v1j3k5l7m9n1p3q5r7s9t1',
      degree: 'Data Science & Statistics',
      educationLevel: 'Undergraduate',
      currentSemester: 'Year 4, Semester 1',
      careerInterests: ['data-scientist', 'aiml-engineer'],
      preferredLearningPace: 'moderate',
      assessedSkills: [
        {
          skillName: 'Statistical Inference & Probability',
          normalizedName: 'statistics-probability',
          level: 4,
          source: 'Statistics Coursework',
          evidence: '',
          updatedAt: new Date()
        },
        {
          skillName: 'Python Scientific Ecosystem (Pandas, SciPy)',
          normalizedName: 'python-scientific',
          level: 4,
          source: 'Data Lab',
          evidence: '',
          updatedAt: new Date()
        },
        {
          skillName: 'Machine Learning Algorithms (Scikit-Learn)',
          normalizedName: 'machine-learning',
          level: 2,
          source: 'Self-study',
          evidence: '',
          updatedAt: new Date()
        }
      ],
      targetCareerSlug: 'data-scientist',
      savedCareers: ['data-analyst'],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    memoryUsers.set(maria.email, maria);
    memoryUsers.set(maria._id, maria);
  }
};

seedDemoUsers();

export const demoStore = {
  getUserByEmail: (email: string) => {
    seedDemoUsers();
    return memoryUsers.get(email.toLowerCase().trim());
  },
  getUserById: (id: string) => {
    seedDemoUsers();
    return memoryUsers.get(id);
  },
  saveUser: (user: StoredUser) => {
    memoryUsers.set(user.email.toLowerCase().trim(), user);
    memoryUsers.set(user._id, user);
    return user;
  },
  getRoadmap: (userId: string, careerSlug: string) => {
    return memoryRoadmaps.get(`${userId}:${careerSlug}`);
  },
  saveRoadmap: (userId: string, careerSlug: string, roadmap: any) => {
    memoryRoadmaps.set(`${userId}:${careerSlug}`, roadmap);
    return roadmap;
  },
  getProjectProgress: (userId: string, careerSlug: string) => {
    const list: any[] = [];
    memoryProjects.forEach((val, key) => {
      if (key.startsWith(`${userId}:${careerSlug}`)) {
        list.push(val);
      }
    });
    return list;
  },
  saveProjectProgress: (userId: string, projectId: string, careerSlug: string, data: any) => {
    const key = `${userId}:${careerSlug}:${projectId}`;
    const merged = { ...data, userId, projectId, careerSlug, updatedAt: new Date() };
    memoryProjects.set(key, merged);
    return merged;
  },
  getResourceProgress: (userId: string, careerSlug: string) => {
    const list: any[] = [];
    memoryResources.forEach((val, key) => {
      if (key.startsWith(`${userId}:${careerSlug}`)) {
        list.push(val);
      }
    });
    return list;
  },
  saveResourceProgress: (userId: string, resourceUrl: string, careerSlug: string, data: any) => {
    const key = `${userId}:${careerSlug}:${resourceUrl}`;
    const merged = { ...data, userId, resourceUrl, careerSlug, updatedAt: new Date() };
    memoryResources.set(key, merged);
    return merged;
  },
  getActivity: (userId: string) => {
    return memoryActivity.get(userId) || [];
  },
  addActivity: (userId: string, activity: any) => {
    const current = memoryActivity.get(userId) || [];
    current.unshift({ ...activity, _id: `act-${Date.now()}`, createdAt: new Date() });
    memoryActivity.set(userId, current.slice(0, 15));
  }
};
