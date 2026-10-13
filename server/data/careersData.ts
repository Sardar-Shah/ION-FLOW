export interface CareerSeedItem {
  title: string;
  slug: string;
  category:
    | 'Software Development'
    | 'Cybersecurity and Cloud'
    | 'Data and Artificial Intelligence'
    | 'Design'
    | 'Business and Management';
  description: string;
  responsibilities: string[];
  requiredSkills: {
    canonicalName: string;
    normalizedName: string;
    category: string;
    targetLevel: number; // 1-5
    weight: number; // 3, 2, 1
    importance: 'Required' | 'Important' | 'Optional';
    description: string;
  }[];
  learningResources: {
    title: string;
    provider: string;
    relatedSkills: string[];
    resourceType: 'Documentation' | 'Course' | 'Interactive' | 'Guide' | 'Book';
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    estimatedHours: number;
    url: string;
    description: string;
  }[];
  portfolioProjects: {
    projectId: string;
    title: string;
    description: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    estimatedHours: number;
    skillsDeveloped: string[];
    deliverables: string[];
    completionCriteria: string[];
  }[];
  preparationAdvice: string[];
  milestonesTemplate: {
    stage: number;
    stageName: string;
    title: string;
    learningObjective: string;
    skillsCovered: string[];
    practicalTask: string;
    completionCriteria: string;
    estimatedEffort: string;
  }[];
}

export const initialCareers: CareerSeedItem[] = [
  // 1. Frontend Developer
  {
    title: 'Frontend Developer',
    slug: 'frontend-developer',
    category: 'Software Development',
    description:
      'Designs, builds, and optimizes modern, responsive, and accessible user interfaces for web applications using modern JavaScript/TypeScript, React, and browser APIs.',
    responsibilities: [
      'Translate UI/UX wireframes and mockups into responsive, accessible code',
      'Architect client-side state management, routing, and real-time data sync',
      'Optimize web performance, Core Web Vitals, asset bundling, and rendering pipelines',
      'Ensure cross-browser compatibility and strict WCAG AA accessibility standards',
      'Collaborate with backend engineers to integrate RESTful and GraphQL APIs'
    ],
    requiredSkills: [
      {
        canonicalName: 'HTML5 & Semantic Markup',
        normalizedName: 'html5',
        category: 'Frontend Engineering',
        targetLevel: 5,
        weight: 3,
        importance: 'Required',
        description: 'Semantic elements, web forms, DOM hierarchy, and accessibility landmarks.'
      },
      {
        canonicalName: 'CSS3 & Responsive Design',
        normalizedName: 'css3',
        category: 'Frontend Engineering',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'Flexbox, CSS Grid, media queries, CSS variables, and modern styling utilities.'
      },
      {
        canonicalName: 'JavaScript (ES6+)',
        normalizedName: 'javascript',
        category: 'Frontend Engineering',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'Asynchronous programming (Promises, async/await), closures, and DOM manipulation.'
      },
      {
        canonicalName: 'TypeScript',
        normalizedName: 'typescript',
        category: 'Frontend Engineering',
        targetLevel: 3,
        weight: 3,
        importance: 'Required',
        description: 'Static typing, interfaces, generics, union types, and compiler configuration.'
      },
      {
        canonicalName: 'React & Component Architecture',
        normalizedName: 'react',
        category: 'Frontend Engineering',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'Functional components, hooks, component lifecycle, and state propagation.'
      },
      {
        canonicalName: 'Web Accessibility (a11y & WCAG)',
        normalizedName: 'accessibility',
        category: 'Frontend Engineering',
        targetLevel: 3,
        weight: 2,
        importance: 'Important',
        description: 'ARIA attributes, keyboard navigation, color contrast, and screen reader testing.'
      },
      {
        canonicalName: 'Client-Side State Management',
        normalizedName: 'state-management',
        category: 'Frontend Engineering',
        targetLevel: 3,
        weight: 2,
        importance: 'Important',
        description: 'React Context, Redux Toolkit, Zustand, or TanStack Query caching.'
      },
      {
        canonicalName: 'Web Performance Optimization',
        normalizedName: 'web-performance',
        category: 'Frontend Engineering',
        targetLevel: 3,
        weight: 2,
        importance: 'Important',
        description: 'Core Web Vitals (LCP, FID/INP, CLS), code-splitting, lazy loading, and Lighthouse audits.'
      },
      {
        canonicalName: 'Git & Version Control',
        normalizedName: 'git',
        category: 'Developer Tooling',
        targetLevel: 3,
        weight: 2,
        importance: 'Important',
        description: 'Branching strategies, pull requests, merge conflict resolution, and code reviews.'
      },
      {
        canonicalName: 'Automated Frontend Testing',
        normalizedName: 'frontend-testing',
        category: 'Testing & Quality',
        targetLevel: 2,
        weight: 1,
        importance: 'Optional',
        description: 'Unit and integration testing with Vitest, Jest, and React Testing Library.'
      }
    ],
    learningResources: [
      {
        title: 'MDN Web Docs — Learn Web Development',
        provider: 'Mozilla Developer Network',
        relatedSkills: ['HTML5 & Semantic Markup', 'CSS3 & Responsive Design', 'JavaScript (ES6+)'],
        resourceType: 'Documentation',
        difficulty: 'Beginner',
        estimatedHours: 40,
        url: 'https://developer.mozilla.org/en-US/docs/Learn',
        description: 'Authoritative, comprehensive curriculum covering HTML, CSS, JavaScript, and accessibility basics.'
      },
      {
        title: 'React Official Documentation — Learn React',
        provider: 'React Core Team',
        relatedSkills: ['React & Component Architecture', 'JavaScript (ES6+)'],
        resourceType: 'Interactive',
        difficulty: 'Intermediate',
        estimatedHours: 25,
        url: 'https://react.dev/learn',
        description: 'Interactive guides and best practices for thinking in React, state management, and custom hooks.'
      },
      {
        title: 'Web.dev Accessibility & Core Web Vitals Guides',
        provider: 'Google Chrome Team',
        relatedSkills: ['Web Accessibility (a11y & WCAG)', 'Web Performance Optimization'],
        resourceType: 'Guide',
        difficulty: 'Intermediate',
        estimatedHours: 15,
        url: 'https://web.dev/learn/accessibility',
        description: 'Practical, industry-standard guides to building accessible, high-performance web applications.'
      }
    ],
    portfolioProjects: [
      {
        projectId: 'fe-proj-01',
        title: 'Responsive Developer Portfolio & Interactive Showcase',
        description:
          'Build an accessible, high-performance personal portfolio showcasing projects, interactive themes, and clean typography.',
        difficulty: 'Beginner',
        estimatedHours: 20,
        skillsDeveloped: ['HTML5 & Semantic Markup', 'CSS3 & Responsive Design', 'TypeScript', 'React & Component Architecture'],
        deliverables: [
          'Live deployed responsive website with custom domain/subdomain',
          'Lighthouse audit score >= 90 across Performance and Accessibility',
          'Public GitHub repository with structured commits and documentation'
        ],
        completionCriteria: [
          'Zero horizontal overflow on mobile viewports (320px - 1440px)',
          'Complete keyboard navigation support with visible focus outlines',
          'Dynamic project filtering and dark/light theme switching'
        ]
      },
      {
        projectId: 'fe-proj-02',
        title: 'Collaborative Kanban Task Board with Optimistic UI',
        description:
          'Develop a high-density Kanban dashboard featuring drag-and-drop task reordering, optimistic state updates, and local persistence.',
        difficulty: 'Intermediate',
        estimatedHours: 35,
        skillsDeveloped: ['React & Component Architecture', 'Client-Side State Management', 'TypeScript', 'Web Accessibility (a11y & WCAG)'],
        deliverables: [
          'Single-page application with multi-column task boards',
          'Optimistic UI state persistence with search, tags, and status tracking',
          'Clean automated component test suite covering board mutations'
        ],
        completionCriteria: [
          'State persistence across page reloads without data corruption',
          'Keyboard-accessible task movement between columns',
          'Proper ARIA live regions announcing task position changes'
        ]
      }
    ],
    preparationAdvice: [
      'Master fundamental vanilla JavaScript and DOM mechanics before relying heavily on abstraction libraries',
      'Build every interface with mobile-first responsiveness and keyboard accessibility from day one',
      'Deploy your projects publicly on Vercel, Netlify, or GitHub Pages with clean README files'
    ],
    milestonesTemplate: [
      {
        stage: 1,
        stageName: 'Foundations',
        title: 'Semantic HTML5 & Accessible CSS Layouts',
        learningObjective: 'Master semantic document trees, Flexbox, Grid, and mobile-first responsive breakpoints.',
        skillsCovered: ['HTML5 & Semantic Markup', 'CSS3 & Responsive Design'],
        practicalTask: 'Build a multi-column responsive landing page without layout frameworks.',
        completionCriteria: 'Passes W3C HTML validator and scales cleanly from 320px to 1440px.',
        estimatedEffort: '15 hours'
      },
      {
        stage: 2,
        stageName: 'Core Skills',
        title: 'Modern JavaScript & TypeScript Fluency',
        learningObjective: 'Write type-safe asynchronous logic handling API requests and complex data structures.',
        skillsCovered: ['JavaScript (ES6+)', 'TypeScript'],
        practicalTask: 'Construct a type-safe data explorer fetching and filtering public API records.',
        completionCriteria: 'Zero any types used; strict compiler flags enabled.',
        estimatedEffort: '25 hours'
      },
      {
        stage: 3,
        stageName: 'Practical Application',
        title: 'React Architecture & State Orchestration',
        learningObjective: 'Structure reusable component hierarchies with clean prop contracts and custom hooks.',
        skillsCovered: ['React & Component Architecture', 'Client-Side State Management'],
        practicalTask: 'Implement a multi-step checkout/survey flow with form validation and state caching.',
        completionCriteria: 'Zero prop-drilling beyond 2 levels; snappy UI rendering without unnecessary re-renders.',
        estimatedEffort: '30 hours'
      },
      {
        stage: 4,
        stageName: 'Portfolio Development',
        title: 'Production Portfolio Project Engineering',
        learningObjective: 'Complete and deploy a feature-complete portfolio application with test coverage.',
        skillsCovered: ['React & Component Architecture', 'Web Performance Optimization', 'Automated Frontend Testing'],
        practicalTask: 'Build the Collaborative Kanban Board with automated test verification.',
        completionCriteria: 'Deployed online; passes Lighthouse audits with 90+ in all core metrics.',
        estimatedEffort: '35 hours'
      },
      {
        stage: 5,
        stageName: 'Career Preparation',
        title: 'Frontend Technical Interview & System Design Mastery',
        learningObjective: 'Prepare for DOM coding challenges, frontend architecture diagrams, and behavioral reviews.',
        skillsCovered: ['Git & Version Control', 'Web Performance Optimization'],
        practicalTask: 'Document your engineering decisions in detailed README case studies.',
        completionCriteria: 'Publish 2 project case studies with architectural diagrams and trade-off reflections.',
        estimatedEffort: '15 hours'
      }
    ]
  },

  // 2. Backend Developer
  {
    title: 'Backend Developer',
    slug: 'backend-developer',
    category: 'Software Development',
    description:
      'Designs, develops, and maintains server-side architecture, RESTful/gRPC APIs, database schemas, authentication systems, and microservices.',
    responsibilities: [
      'Design and document secure, scalable RESTful and GraphQL APIs',
      'Architect relational and NoSQL database schemas with indexes and transactions',
      'Implement robust authentication, authorization (RBAC), and session management',
      'Optimize database queries, connection pooling, and caching layers (Redis)',
      'Set up logging, monitoring, and automated unit/integration test suites'
    ],
    requiredSkills: [
      {
        canonicalName: 'Node.js & Express / Fastify',
        normalizedName: 'nodejs',
        category: 'Backend Engineering',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'Event loop, asynchronous I/O, middleware patterns, and HTTP server lifecycle.'
      },
      {
        canonicalName: 'Database Modeling & SQL / NoSQL',
        normalizedName: 'databases',
        category: 'Database Engineering',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'Schema normalization, indexing, Mongoose/Prisma ORMs, aggregation pipelines.'
      },
      {
        canonicalName: 'RESTful API Architecture',
        normalizedName: 'rest-api',
        category: 'Backend Engineering',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'HTTP status codes, idempotent methods, request validation, and OpenAPI documentation.'
      },
      {
        canonicalName: 'Authentication & Authorization',
        normalizedName: 'auth-security',
        category: 'Security & Auth',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'Password hashing (bcrypt), JWT, refresh tokens, sessions, and Role-Based Access Control.'
      },
      {
        canonicalName: 'Data Validation & Sanitization',
        normalizedName: 'data-validation',
        category: 'Backend Engineering',
        targetLevel: 3,
        weight: 2,
        importance: 'Important',
        description: 'Input validation schemas using Zod/Joi, defense against SQL/NoSQL injection and XSS.'
      },
      {
        canonicalName: 'Caching & Performance (Redis)',
        normalizedName: 'caching-redis',
        category: 'Backend Engineering',
        targetLevel: 3,
        weight: 2,
        importance: 'Important',
        description: 'In-memory key-value caching, cache invalidation strategies, and rate limiting.'
      },
      {
        canonicalName: 'Automated Testing (Unit & Integration)',
        normalizedName: 'backend-testing',
        category: 'Testing & Quality',
        targetLevel: 3,
        weight: 2,
        importance: 'Important',
        description: 'Supertest, Jest, or Vitest mocking database connections and testing API contracts.'
      },
      {
        canonicalName: 'Docker & Containerization Basics',
        normalizedName: 'docker',
        category: 'DevOps & Tooling',
        targetLevel: 2,
        weight: 1,
        importance: 'Optional',
        description: 'Writing Dockerfiles, multi-stage builds, and running local multi-service containers.'
      }
    ],
    learningResources: [
      {
        title: 'Node.js Official Documentation & Guides',
        provider: 'OpenJS Foundation',
        relatedSkills: ['Node.js & Express / Fastify', 'RESTful API Architecture'],
        resourceType: 'Documentation',
        difficulty: 'Beginner',
        estimatedHours: 30,
        url: 'https://nodejs.org/en/docs',
        description: 'Official API reference and core conceptual guides for the Node.js runtime.'
      },
      {
        title: 'MongoDB University — Mongoose & Data Modeling',
        provider: 'MongoDB',
        relatedSkills: ['Database Modeling & SQL / NoSQL', 'Data Validation & Sanitization'],
        resourceType: 'Course',
        difficulty: 'Intermediate',
        estimatedHours: 25,
        url: 'https://learn.mongodb.com/',
        description: 'Comprehensive curriculum on document data modeling, indexing, aggregation, and connection pooling.'
      },
      {
        title: 'OWASP REST Security Cheat Sheet',
        provider: 'OWASP Foundation',
        relatedSkills: ['Authentication & Authorization', 'Data Validation & Sanitization'],
        resourceType: 'Guide',
        difficulty: 'Intermediate',
        estimatedHours: 10,
        url: 'https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html',
        description: 'Crucial security guidelines for token storage, CORS, rate limiting, and parameter validation.'
      }
    ],
    portfolioProjects: [
      {
        projectId: 'be-proj-01',
        title: 'Multi-Tenant RBAC E-Commerce API with Token Refresh',
        description:
          'Construct a production-grade RESTful API featuring JWT authentication, refresh token rotation, role permissions, and database transactions.',
        difficulty: 'Intermediate',
        estimatedHours: 35,
        skillsDeveloped: ['Node.js & Express / Fastify', 'Database Modeling & SQL / NoSQL', 'Authentication & Authorization'],
        deliverables: [
          'Full Express/TypeScript server repository with OpenAPI 3.0 documentation',
          'Postman collection or Swagger UI testing all endpoints',
          'Integration test suite with >80% code coverage'
        ],
        completionCriteria: [
          'Passwords securely salted and hashed with bcrypt',
          'Protected endpoints reject expired or forged JWT tokens with 401',
          'Role-based middleware enforces admin vs customer authorization with 403'
        ]
      },
      {
        projectId: 'be-proj-02',
        title: 'High-Throughput Order Processing API with Redis Rate Limiter',
        description:
          'Architect an asynchronous ordering and inventory reservation service with Redis-backed rate limiting and idempotency keys.',
        difficulty: 'Advanced',
        estimatedHours: 40,
        skillsDeveloped: ['Caching & Performance (Redis)', 'RESTful API Architecture', 'Automated Testing (Unit & Integration)'],
        deliverables: [
          'Service repository featuring Redis token-bucket rate limiter',
          'Idempotency key middleware preventing duplicate payment submissions',
          'Load testing report demonstrating graceful degradation under concurrency'
        ],
        completionCriteria: [
          'Duplicate requests with identical idempotency headers return identical cached responses',
          'Excessive requests beyond quota receive 429 Too Many Requests headers'
        ]
      }
    ],
    preparationAdvice: [
      'Focus heavily on understanding database indexing, query execution plans, and connection management',
      'Never store sensitive information in plain text or commit credentials to version control',
      'Always validate and sanitize all user input at the server boundary before processing'
    ],
    milestonesTemplate: [
      {
        stage: 1,
        stageName: 'Foundations',
        title: 'Server Runtime & Asynchronous Fundamentals',
        learningObjective: 'Master the event loop, streams, buffers, and non-blocking I/O in server environments.',
        skillsCovered: ['Node.js & Express / Fastify'],
        practicalTask: 'Write a basic HTTP file-streaming server with error handlers.',
        completionCriteria: 'Handles concurrent file downloads without crashing or memory leaks.',
        estimatedEffort: '15 hours'
      },
      {
        stage: 2,
        stageName: 'Core Skills',
        title: 'REST Architecture & Database Schemas',
        learningObjective: 'Design normalized data schemas, write complex queries, and implement CRUD endpoints.',
        skillsCovered: ['Database Modeling & SQL / NoSQL', 'RESTful API Architecture'],
        practicalTask: 'Build a relational/document data model with compound indexes and validation.',
        completionCriteria: 'Indexes created; queries execute with index scans verified via explain plan.',
        estimatedEffort: '25 hours'
      },
      {
        stage: 3,
        stageName: 'Practical Application',
        title: 'Authentication & Security Hardening',
        learningObjective: 'Implement secure login, session tokens, password hashing, and role checks.',
        skillsCovered: ['Authentication & Authorization', 'Data Validation & Sanitization'],
        practicalTask: 'Implement token rotation with HTTP-only cookies and role-based guards.',
        completionCriteria: 'Passes security tests against token replay, brute force, and injection.',
        estimatedEffort: '30 hours'
      },
      {
        stage: 4,
        stageName: 'Portfolio Development',
        title: 'Production API Project Deployment',
        learningObjective: 'Complete, containerize, and deploy the RBAC E-Commerce API with automated tests.',
        skillsCovered: ['Node.js & Express / Fastify', 'Automated Testing (Unit & Integration)', 'Docker & Containerization Basics'],
        practicalTask: 'Deploy API to cloud hosting with CI/CD running automated Supertest specs.',
        completionCriteria: '100% test pass rate in CI; live Swagger documentation accessible.',
        estimatedEffort: '35 hours'
      },
      {
        stage: 5,
        stageName: 'Career Preparation',
        title: 'System Design & Backend Architecture Reviews',
        learningObjective: 'Study database sharding, horizontal scaling, microservices, and message queues.',
        skillsCovered: ['Caching & Performance (Redis)', 'RESTful API Architecture'],
        practicalTask: 'Draft a system architecture design document for scaling to 100k daily active users.',
        completionCriteria: 'Address database bottlenecks, caching invalidation, and failover redundancy.',
        estimatedEffort: '15 hours'
      }
    ]
  },

  // 3. Full-Stack Developer
  {
    title: 'Full-Stack Developer',
    slug: 'full-stack-developer',
    category: 'Software Development',
    description:
      'Engineers end-to-end web applications, uniting responsive frontend user interfaces, robust backend APIs, database management, and cloud deployment pipelines.',
    responsibilities: [
      'Build end-to-end features spanning React frontend and Node.js/Express backend',
      'Model and maintain database schemas, migrations, and relationship constraints',
      'Implement unified authentication flows between client state and server sessions',
      'Design RESTful API contracts and ensure end-to-end type safety with TypeScript',
      'Deploy full-stack applications with monitoring, health checks, and CI/CD pipelines'
    ],
    requiredSkills: [
      {
        canonicalName: 'Full-Stack TypeScript',
        normalizedName: 'typescript',
        category: 'Full-Stack Engineering',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'End-to-end shared types, Zod schemas, interfaces, and compiler configurations.'
      },
      {
        canonicalName: 'React & Client Architecture',
        normalizedName: 'react',
        category: 'Frontend Engineering',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'Modern component design, state hooks, responsive design, and accessible markup.'
      },
      {
        canonicalName: 'Node.js & Express API Development',
        normalizedName: 'nodejs',
        category: 'Backend Engineering',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'Middleware chaining, REST routing, error handling, and server lifecycle.'
      },
      {
        canonicalName: 'Database Design (MongoDB / SQL)',
        normalizedName: 'databases',
        category: 'Database Engineering',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'Mongoose schemas, indexing, aggregation, relational mapping, and ACID transactions.'
      },
      {
        canonicalName: 'Auth & Session Security',
        normalizedName: 'auth-security',
        category: 'Security & Auth',
        targetLevel: 3,
        weight: 3,
        importance: 'Required',
        description: 'Bcrypt hashing, JWT tokens, secure cookie handling, and route protection.'
      },
      {
        canonicalName: 'API Integration & Network State',
        normalizedName: 'api-integration',
        category: 'Full-Stack Engineering',
        targetLevel: 3,
        weight: 2,
        importance: 'Important',
        description: 'TanStack Query / Axios, error interceptors, optimistic updates, and cache invalidation.'
      },
      {
        canonicalName: 'DevOps & Cloud Deployment',
        normalizedName: 'deployment',
        category: 'DevOps & Tooling',
        targetLevel: 3,
        weight: 2,
        importance: 'Important',
        description: 'Environment variables management, Docker basics, Cloud Run/Vercel deployment, and health monitoring.'
      },
      {
        canonicalName: 'Automated Testing (E2E & Unit)',
        normalizedName: 'testing',
        category: 'Testing & Quality',
        targetLevel: 2,
        weight: 1,
        importance: 'Optional',
        description: 'Playwright, Cypress, or Vitest for cross-stack verification.'
      }
    ],
    learningResources: [
      {
        title: 'Full Stack Open — Deep Dive Into Modern Web Development',
        provider: 'University of Helsinki',
        relatedSkills: ['React & Client Architecture', 'Node.js & Express API Development', 'Database Design (MongoDB / SQL)'],
        resourceType: 'Course',
        difficulty: 'Intermediate',
        estimatedHours: 60,
        url: 'https://fullstackopen.com/en/',
        description: 'Renowned university curriculum covering React, Redux, Node.js, Express, MongoDB, and TypeScript.'
      },
      {
        title: 'TypeScript Official Handbook',
        provider: 'Microsoft TypeScript Team',
        relatedSkills: ['Full-Stack TypeScript'],
        resourceType: 'Documentation',
        difficulty: 'Beginner',
        estimatedHours: 20,
        url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
        description: 'Comprehensive guide to TypeScript syntax, types, interfaces, generics, and compiler options.'
      },
      {
        title: 'Pragmatic Web Application Security — OWASP Top 10',
        provider: 'OWASP Foundation',
        relatedSkills: ['Auth & Session Security'],
        resourceType: 'Guide',
        difficulty: 'Intermediate',
        estimatedHours: 12,
        url: 'https://owasp.org/www-project-top-ten/',
        description: 'Industry-standard awareness document for developers to avoid the ten most critical security flaws.'
      }
    ],
    portfolioProjects: [
      {
        projectId: 'fs-proj-01',
        title: 'Collaborative Workspace & Real-Time Note Platform',
        description:
          'Construct a full-stack workspace application with document editing, search, user permissions, and persistent MongoDB storage.',
        difficulty: 'Intermediate',
        estimatedHours: 40,
        skillsDeveloped: ['Full-Stack TypeScript', 'React & Client Architecture', 'Node.js & Express API Development', 'Database Design (MongoDB / SQL)'],
        deliverables: [
          'Full-stack application deployed on cloud container runtime',
          'Live database connection to MongoDB Atlas with automated indexes',
          'README detailing environment setup, architecture diagram, and API routes'
        ],
        completionCriteria: [
          'End-to-end user registration, authentication, and session persistence',
          'Document CRUD with optimistic client updates and server confirmation',
          'Zero plaintext credentials or secrets leaked to client bundle'
        ]
      },
      {
        projectId: 'fs-proj-02',
        title: 'University Career & Mentorship Matcher Application',
        description:
          'Build an end-to-end matchmaking portal connecting university students with industry mentors based on shared skill requirements.',
        difficulty: 'Advanced',
        estimatedHours: 45,
        skillsDeveloped: ['Auth & Session Security', 'API Integration & Network State', 'DevOps & Cloud Deployment'],
        deliverables: [
          'Responsive React UI connected to authenticated Express REST API',
          'Search and recommendation algorithm matching student gaps with mentor expertise',
          'Automated database seeding and health-check monitoring endpoint'
        ],
        completionCriteria: [
          'Matching queries return calculated compatibility scores',
          'Role-based views separating student dashboards from mentor dashboards'
        ]
      }
    ],
    preparationAdvice: [
      'Maintain clear boundaries: keep business logic on the server and use client components strictly for presentation',
      'Share data models and validation schemas between frontend and backend using TypeScript and Zod',
      'Always test error flows, network drops, and unauthorized access scenarios'
    ],
    milestonesTemplate: [
      {
        stage: 1,
        stageName: 'Foundations',
        title: 'Full-Stack JavaScript & HTTP Mechanics',
        learningObjective: 'Master client-server communication, JSON encoding, request headers, and async flows.',
        skillsCovered: ['Full-Stack TypeScript', 'Node.js & Express API Development'],
        practicalTask: 'Build a command-line client interacting with a custom Express service.',
        completionCriteria: 'Handles network timeouts and invalid responses gracefully.',
        estimatedEffort: '15 hours'
      },
      {
        stage: 2,
        stageName: 'Core Skills',
        title: 'React Client & Express REST Pipeline',
        learningObjective: 'Connect dynamic React components with authenticated Express backend endpoints.',
        skillsCovered: ['React & Client Architecture', 'Database Design (MongoDB / SQL)'],
        practicalTask: 'Implement end-to-end CRUD application with schema validation.',
        completionCriteria: 'Zero runtime type errors; complete validation on both client and server.',
        estimatedEffort: '30 hours'
      },
      {
        stage: 3,
        stageName: 'Practical Application',
        title: 'Secure Authentication & Session State',
        learningObjective: 'Architect JWT/session flow with protected routes and persistent user profiles.',
        skillsCovered: ['Auth & Session Security', 'API Integration & Network State'],
        practicalTask: 'Add login, token refresh, and user profile management to the full-stack app.',
        completionCriteria: 'Unauthorized routes redirect; tokens stored safely.',
        estimatedEffort: '25 hours'
      },
      {
        stage: 4,
        stageName: 'Portfolio Development',
        title: 'Production Full-Stack Application Deployment',
        learningObjective: 'Engineer and deploy the Collaborative Workspace platform to a production environment.',
        skillsCovered: ['DevOps & Cloud Deployment', 'Database Design (MongoDB / SQL)'],
        practicalTask: 'Deploy client and server to cloud with live MongoDB Atlas database.',
        completionCriteria: 'Live URL accessible; health checks reporting 200 OK.',
        estimatedEffort: '40 hours'
      },
      {
        stage: 5,
        stageName: 'Career Preparation',
        title: 'Architecture Presentation & Code Review Defense',
        learningObjective: 'Synthesize full-stack technical vocabulary for interviews and system design panels.',
        skillsCovered: ['Full-Stack TypeScript', 'DevOps & Cloud Deployment'],
        practicalTask: 'Prepare a 5-minute video walkthrough explaining architectural trade-offs.',
        completionCriteria: 'Clearly explain why specific database indexes, state strategies, and auth patterns were chosen.',
        estimatedEffort: '15 hours'
      }
    ]
  },

  // 4. Cybersecurity Analyst
  {
    title: 'Cybersecurity Analyst',
    slug: 'cybersecurity-analyst',
    category: 'Cybersecurity and Cloud',
    description:
      'Monitors, detects, analyzes, and mitigates security threats, investigates vulnerabilities, enforces incident response procedures, and hardens enterprise defenses.',
    responsibilities: [
      'Monitor security operations center (SOC) alerts and SIEM telemetry feeds',
      'Investigate indicators of compromise (IoCs) and execute incident response playbooks',
      'Conduct vulnerability scans, threat modeling, and risk assessments',
      'Audit access controls, firewall rules, identity permissions, and encryption standards',
      'Prepare security incident post-mortems and compliance compliance documentation'
    ],
    requiredSkills: [
      {
        canonicalName: 'Network Fundamentals & Protocols',
        normalizedName: 'networking',
        category: 'Cybersecurity',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'TCP/IP stack, DNS, subnetting, TLS/SSL handshakes, HTTP/HTTPS, and packet inspection.'
      },
      {
        canonicalName: 'Security Information & Event Management (SIEM)',
        normalizedName: 'siem-monitoring',
        category: 'Cybersecurity',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'Log analysis, detection rules (Splunk, Elastic, Wazuh), telemetry correlation, and alert triage.'
      },
      {
        canonicalName: 'Threat Analysis & MITRE ATT&CK',
        normalizedName: 'mitre-attack',
        category: 'Cybersecurity',
        targetLevel: 3,
        weight: 3,
        importance: 'Required',
        description: 'Mapping attacker tactics, techniques, and procedures (TTPs), malware analysis basics.'
      },
      {
        canonicalName: 'Incident Response & Forensic Triage',
        normalizedName: 'incident-response',
        category: 'Cybersecurity',
        targetLevel: 3,
        weight: 3,
        importance: 'Required',
        description: 'Identification, containment, eradication, recovery, and evidence chain of custody.'
      },
      {
        canonicalName: 'Vulnerability Assessment & Hardening',
        normalizedName: 'vulnerability-mgmt',
        category: 'Cybersecurity',
        targetLevel: 3,
        weight: 2,
        importance: 'Important',
        description: 'CVEs, CVSS scoring, Nessus/Nmap scanning, and OS baseline hardening (CIS benchmarks).'
      },
      {
        canonicalName: 'Web Application Security (OWASP Top 10)',
        normalizedName: 'owasp-security',
        category: 'Cybersecurity',
        targetLevel: 3,
        weight: 2,
        importance: 'Important',
        description: 'SQLi, XSS, CSRF, SSRF, broken object level authorization (BOLA), and defense-in-depth.'
      },
      {
        canonicalName: 'Security Scripting (Python / Bash)',
        normalizedName: 'security-scripting',
        category: 'Cybersecurity',
        targetLevel: 3,
        weight: 2,
        importance: 'Important',
        description: 'Automating log parsing, IP reputation lookups, and regex pattern matching.'
      },
      {
        canonicalName: 'Identity & Access Management (IAM)',
        normalizedName: 'iam',
        category: 'Cybersecurity',
        targetLevel: 3,
        weight: 2,
        importance: 'Important',
        description: 'Least privilege, MFA, OAuth2/SAML, Kerberos, and directory services.'
      }
    ],
    learningResources: [
      {
        title: 'NIST Cybersecurity Framework (CSF 2.0)',
        provider: 'National Institute of Standards and Technology',
        relatedSkills: ['Incident Response & Forensic Triage', 'Vulnerability Assessment & Hardening'],
        resourceType: 'Guide',
        difficulty: 'Beginner',
        estimatedHours: 20,
        url: 'https://www.nist.gov/cyberframework',
        description: 'Industry-standard framework for managing and reducing cybersecurity risk across organizations.'
      },
      {
        title: 'MITRE ATT&CK Enterprise Matrix Documentation',
        provider: 'MITRE Corporation',
        relatedSkills: ['Threat Analysis & MITRE ATT&CK'],
        resourceType: 'Documentation',
        difficulty: 'Intermediate',
        estimatedHours: 25,
        url: 'https://attack.mitre.org/',
        description: 'Globally accessible knowledge base of adversary tactics, techniques, and real-world procedures.'
      },
      {
        title: 'OWASP Web Security Testing Guide (WSTG)',
        provider: 'OWASP Foundation',
        relatedSkills: ['Web Application Security (OWASP Top 10)', 'Vulnerability Assessment & Hardening'],
        resourceType: 'Guide',
        difficulty: 'Intermediate',
        estimatedHours: 30,
        url: 'https://owasp.org/www-project-web-security-testing-guide/',
        description: 'Premier cybersecurity manual for testing web application security posture and vulnerability remediation.'
      }
    ],
    portfolioProjects: [
      {
        projectId: 'sec-proj-01',
        title: 'Automated Security Log Triage & SIEM Alert Investigation Lab',
        description:
          'Analyze multi-source authentication and web server access logs to uncover brute-force attacks, privilege escalation, and data exfiltration.',
        difficulty: 'Intermediate',
        estimatedHours: 30,
        skillsDeveloped: [
          'Security Information & Event Management (SIEM)',
          'Security Scripting (Python / Bash)',
          'Threat Analysis & MITRE ATT&CK'
        ],
        deliverables: [
          'Python script parsing Apache/Nginx and Linux auth.log files with regex extractors',
          'Correlation report mapping malicious indicators to MITRE ATT&CK techniques',
          'Formal Incident Response triage brief with containment recommendations'
        ],
        completionCriteria: [
          'Successfully flags anomalous login spikes above baseline threshold',
          'Extracts IP geographic reputational data and identifies top attack vectors',
          'Generates actionable remediation checklist adhering to NIST guidelines'
        ]
      },
      {
        projectId: 'sec-proj-02',
        title: 'Vulnerability Assessment & System Hardening Playbook',
        description:
          'Perform automated and manual vulnerability assessment against a target testbed and draft a production hardening blueprint.',
        difficulty: 'Intermediate',
        estimatedHours: 35,
        skillsDeveloped: [
          'Vulnerability Assessment & Hardening',
          'Network Fundamentals & Protocols',
          'Web Application Security (OWASP Top 10)'
        ],
        deliverables: [
          'Comprehensive CVSS 3.1 scored vulnerability assessment report',
          'Hardening script disabling insecure ciphers, legacy protocols, and default accounts',
          'Executive summary detailing residual risk posture'
        ],
        completionCriteria: [
          'Identifies at least 5 distinct vulnerability categories with accurate CVSS ratings',
          'Provides step-by-step verified remediation instructions for each finding'
        ]
      }
    ],
    preparationAdvice: [
      'Practice analyzing raw PCAP network captures in Wireshark and examining server logs line by line',
      'Understand the principles of Least Privilege and Zero Trust architecture deeply',
      'Learn how to write structured incident response reports for both technical leads and executive stakeholders'
    ],
    milestonesTemplate: [
      {
        stage: 1,
        stageName: 'Foundations',
        title: 'Networking & Operating System Security',
        learningObjective: 'Master OSI model layers, TCP/UDP packets, Linux permissions, and firewall rule configurations.',
        skillsCovered: ['Network Fundamentals & Protocols', 'Identity & Access Management (IAM)'],
        practicalTask: 'Analyze a Wireshark capture file and identify anomalous DNS/HTTP traffic.',
        completionCriteria: 'Pinpoint port scans, handshake anomalies, and unauthorized connection attempts.',
        estimatedEffort: '20 hours'
      },
      {
        stage: 2,
        stageName: 'Core Skills',
        title: 'Log Telemetry & SIEM Rule Construction',
        learningObjective: 'Configure log aggregation, write detection queries, and establish alerting baselines.',
        skillsCovered: ['Security Information & Event Management (SIEM)', 'Security Scripting (Python / Bash)'],
        practicalTask: 'Ingest sample server logs and create detection rules for brute-force patterns.',
        completionCriteria: 'Triggers automated alerts with zero false negatives on test vectors.',
        estimatedEffort: '25 hours'
      },
      {
        stage: 3,
        stageName: 'Practical Application',
        title: 'Threat Modeling & MITRE ATT&CK Mapping',
        learningObjective: 'Identify adversary tactics, evaluate attack surfaces, and classify IoCs.',
        skillsCovered: ['Threat Analysis & MITRE ATT&CK', 'Web Application Security (OWASP Top 10)'],
        practicalTask: 'Map a simulated multi-stage breach against MITRE ATT&CK tactics.',
        completionCriteria: 'Trace initial access, execution, persistence, and exfiltration phases.',
        estimatedEffort: '30 hours'
      },
      {
        stage: 4,
        stageName: 'Portfolio Development',
        title: 'End-to-End SOC Incident Investigation Lab',
        learningObjective: 'Execute and document the automated log triage and investigation lab.',
        skillsCovered: ['Security Information & Event Management (SIEM)', 'Incident Response & Forensic Triage'],
        practicalTask: 'Publish the completed SOC incident investigation lab with actionable recommendations.',
        completionCriteria: 'Completed incident response report adhering to NIST SP 800-61 guidelines.',
        estimatedEffort: '35 hours'
      },
      {
        stage: 5,
        stageName: 'Career Preparation',
        title: 'Security Certifications & Scenario Interviews',
        learningObjective: 'Prepare for CompTIA Security+, CySA+, or junior SOC analyst technical interviews.',
        skillsCovered: ['Incident Response & Forensic Triage', 'Vulnerability Assessment & Hardening'],
        practicalTask: 'Complete 3 mock incident triage interviews with timed scenario responses.',
        completionCriteria: 'Demonstrate calm methodical triage under simulated time pressure.',
        estimatedEffort: '15 hours'
      }
    ]
  },

  // 5. Cloud Engineer
  {
    title: 'Cloud Engineer',
    slug: 'cloud-engineer',
    category: 'Cybersecurity and Cloud',
    description:
      'Architects, deploys, and maintains reliable, cost-efficient cloud infrastructure, containerized environments, networking topologies, and Infrastructure as Code (IaC).',
    responsibilities: [
      'Design resilient cloud architectures spanning compute, storage, VPCs, and serverless',
      'Author Infrastructure as Code (IaC) using Terraform or CloudFormation',
      'Containerize applications and manage orchestrators (Docker, Kubernetes)',
      'Establish CI/CD pipelines with automated testing, linting, and zero-downtime deployments',
      'Monitor cloud cost, reliability metrics (SLOs/SLAs), and cloud security baselines'
    ],
    requiredSkills: [
      {
        canonicalName: 'Cloud Provider Core Services (AWS / GCP / Azure)',
        normalizedName: 'cloud-platforms',
        category: 'Cloud Architecture',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'Compute (EC2/Cloud Run), Storage (S3/GCS), IAM policies, and VPC networking.'
      },
      {
        canonicalName: 'Infrastructure as Code (Terraform)',
        normalizedName: 'terraform',
        category: 'Cloud Architecture',
        targetLevel: 3,
        weight: 3,
        importance: 'Required',
        description: 'Declarative resource provisioning, state files, variables, modules, and providers.'
      },
      {
        canonicalName: 'Docker & Containerization',
        normalizedName: 'docker',
        category: 'DevOps & Containers',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'Multi-stage Dockerfiles, image optimization, container networking, and volumes.'
      },
      {
        canonicalName: 'CI/CD Pipelines (GitHub Actions / GitLab CI)',
        normalizedName: 'cicd',
        category: 'DevOps & Tooling',
        targetLevel: 3,
        weight: 3,
        importance: 'Required',
        description: 'Workflow files, automated testing stages, artifact publishing, and secrets management.'
      },
      {
        canonicalName: 'Linux Administration & Shell Scripting',
        normalizedName: 'linux-shell',
        category: 'Systems Engineering',
        targetLevel: 3,
        weight: 2,
        importance: 'Important',
        description: 'Systemd, SSH key management, process monitoring, cron, and bash automation.'
      },
      {
        canonicalName: 'Cloud Networking & DNS',
        normalizedName: 'cloud-networking',
        category: 'Cloud Architecture',
        targetLevel: 3,
        weight: 2,
        importance: 'Important',
        description: 'VPC subnets, route tables, internet gateways, NAT, security groups, and DNS routing.'
      },
      {
        canonicalName: 'Observability & Monitoring',
        normalizedName: 'observability',
        category: 'DevOps & Tooling',
        targetLevel: 3,
        weight: 2,
        importance: 'Important',
        description: 'Prometheus, Grafana, CloudWatch logs, uptime alerts, and SLO tracking.'
      },
      {
        canonicalName: 'Kubernetes Fundamentals',
        normalizedName: 'kubernetes',
        category: 'DevOps & Containers',
        targetLevel: 2,
        weight: 1,
        importance: 'Optional',
        description: 'Pods, Deployments, Services, Ingress, and ConfigMaps.'
      }
    ],
    learningResources: [
      {
        title: 'AWS Well-Architected Framework Documentation',
        provider: 'Amazon Web Services',
        relatedSkills: ['Cloud Provider Core Services (AWS / GCP / Azure)', 'Cloud Networking & DNS'],
        resourceType: 'Documentation',
        difficulty: 'Intermediate',
        estimatedHours: 25,
        url: 'https://aws.amazon.com/architecture/well-architected/',
        description: 'Authoritative cloud design pillars: Operational Excellence, Security, Reliability, Performance, and Cost.'
      },
      {
        title: 'Terraform Official Tutorials & Documentation',
        provider: 'HashiCorp',
        relatedSkills: ['Infrastructure as Code (Terraform)'],
        resourceType: 'Interactive',
        difficulty: 'Beginner',
        estimatedHours: 20,
        url: 'https://developer.hashicorp.com/terraform/tutorials',
        description: 'Hands-on tracks for defining, modifying, and managing infrastructure safely with declarative code.'
      },
      {
        title: 'Docker Official Get Started Curriculum',
        provider: 'Docker',
        relatedSkills: ['Docker & Containerization', 'CI/CD Pipelines (GitHub Actions / GitLab CI)'],
        resourceType: 'Guide',
        difficulty: 'Beginner',
        estimatedHours: 15,
        url: 'https://docs.docker.com/get-started/',
        description: 'Complete guide to building container images, multi-container compose, and registry management.'
      }
    ],
    portfolioProjects: [
      {
        projectId: 'cld-proj-01',
        title: 'Multi-Tier Web App Deployed with Terraform and GitHub Actions',
        description:
          'Provision a secure VPC with public/private subnets, load balancers, container runtime, and automated CI/CD pipeline.',
        difficulty: 'Intermediate',
        estimatedHours: 35,
        skillsDeveloped: [
          'Infrastructure as Code (Terraform)',
          'Cloud Provider Core Services (AWS / GCP / Azure)',
          'CI/CD Pipelines (GitHub Actions / GitLab CI)'
        ],
        deliverables: [
          'Terraform codebase with modularized VPC, compute, and security group definitions',
          'GitHub Actions workflow performing terraform plan on PR and apply on main',
          'Architecture diagram detailing traffic flow through load balancer to private subnets'
        ],
        completionCriteria: [
          'Database/backend isolated in private subnets with zero direct public IP exposure',
          'Pipeline securely consumes cloud credentials via OIDC or secret vault',
          'Infrastructure deploys cleanly from scratch and tears down via terraform destroy'
        ]
      },
      {
        projectId: 'cld-proj-02',
        title: 'Cloud Cost Optimization & Observability Stack',
        description:
          'Implement automated metric collection, alerting thresholds, and serverless cost optimization policies.',
        difficulty: 'Advanced',
        estimatedHours: 30,
        skillsDeveloped: ['Observability & Monitoring', 'Linux Administration & Shell Scripting'],
        deliverables: [
          'Grafana/CloudWatch dashboard visualizing CPU, memory, and HTTP 5xx rates',
          'Automated alerting notification webhook to Slack/Discord on anomaly',
          'Cost optimization report identifying idle resources and recommended savings'
        ],
        completionCriteria: [
          'Alert triggers within 60 seconds of simulated error injection',
          'Demonstrates actionable cost-reduction plan reducing testbed expense'
        ]
      }
    ],
    preparationAdvice: [
      'Always treat infrastructure as immutable code rather than clicking manually in cloud web consoles',
      'Understand the shared responsibility model: cloud provider secures the cloud, you secure what runs in the cloud',
      'Monitor billing alerts aggressively to prevent unexpected cloud charges during learning experiments'
    ],
    milestonesTemplate: [
      {
        stage: 1,
        stageName: 'Foundations',
        title: 'Linux Systems & Network Routing',
        learningObjective: 'Master shell scripting, process management, SSH keys, CIDR blocks, and DNS records.',
        skillsCovered: ['Linux Administration & Shell Scripting', 'Cloud Networking & DNS'],
        practicalTask: 'Configure a virtual Linux machine with hardened SSH and basic firewall rules.',
        completionCriteria: 'Non-root user created; password authentication disabled; key-only access active.',
        estimatedEffort: '15 hours'
      },
      {
        stage: 2,
        stageName: 'Core Skills',
        title: 'Containerization & Cloud Core Primitives',
        learningObjective: 'Package apps into multi-stage Docker images and deploy to cloud compute services.',
        skillsCovered: ['Docker & Containerization', 'Cloud Provider Core Services (AWS / GCP / Azure)'],
        practicalTask: 'Write an optimized Dockerfile reducing image size below 150MB.',
        completionCriteria: 'Image builds cleanly and runs in container runtime with non-root user.',
        estimatedEffort: '25 hours'
      },
      {
        stage: 3,
        stageName: 'Practical Application',
        title: 'Infrastructure as Code with Terraform',
        learningObjective: 'Author modular Terraform configurations managing cloud compute, storage, and IAM.',
        skillsCovered: ['Infrastructure as Code (Terraform)', 'CI/CD Pipelines (GitHub Actions / GitLab CI)'],
        practicalTask: 'Provision a cloud storage bucket and serverless app using Terraform modules.',
        completionCriteria: 'Zero manual console clicks; code adheres to terraform fmt and tflint standards.',
        estimatedEffort: '30 hours'
      },
      {
        stage: 4,
        stageName: 'Portfolio Development',
        title: 'Production Multi-Tier Cloud Deployment',
        learningObjective: 'Engineer and deploy the Multi-Tier Web App project with automated CI/CD.',
        skillsCovered: ['Infrastructure as Code (Terraform)', 'Observability & Monitoring'],
        practicalTask: 'Deploy complete cloud stack with continuous integration and health alerts.',
        completionCriteria: 'Live deployment accessible; metrics reporting cleanly to monitoring dashboard.',
        estimatedEffort: '35 hours'
      },
      {
        stage: 5,
        stageName: 'Career Preparation',
        title: 'Cloud Certification & Architecture Defense',
        learningObjective: 'Prepare for AWS Solutions Architect Associate or Google Cloud Associate Cloud Engineer.',
        skillsCovered: ['Cloud Provider Core Services (AWS / GCP / Azure)', 'Observability & Monitoring'],
        practicalTask: 'Present an architecture diagram defending security and high-availability choices.',
        completionCriteria: 'Pass practice certification exams with >= 85% score.',
        estimatedEffort: '15 hours'
      }
    ]
  },

  // 6. Data Analyst
  {
    title: 'Data Analyst',
    slug: 'data-analyst',
    category: 'Data and Artificial Intelligence',
    description:
      'Transforms complex raw datasets into actionable business insights through SQL queries, statistical analysis, interactive dashboards, and executive storytelling.',
    responsibilities: [
      'Extract, clean, and validate data from relational databases and external APIs',
      'Author complex SQL queries with window functions, subqueries, and CTEs',
      'Design interactive dashboards and KPI scorecards in Power BI, Tableau, or Metabase',
      'Perform exploratory data analysis (EDA) to uncover trends, outliers, and patterns',
      'Translate quantitative data findings into clear executive presentations and reports'
    ],
    requiredSkills: [
      {
        canonicalName: 'Advanced SQL Querying',
        normalizedName: 'sql',
        category: 'Data Analysis',
        targetLevel: 5,
        weight: 3,
        importance: 'Required',
        description: 'Window functions (RANK, ROW_NUMBER), common table expressions (CTEs), GROUP BY, joins.'
      },
      {
        canonicalName: 'Data Visualization & BI Tools',
        normalizedName: 'bi-visualization',
        category: 'Data Analysis',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'Power BI, Tableau, Recharts, design principles, chart selection, and executive storytelling.'
      },
      {
        canonicalName: 'Python for Data Analysis (Pandas & NumPy)',
        normalizedName: 'python-pandas',
        category: 'Data Analysis',
        targetLevel: 3,
        weight: 3,
        importance: 'Required',
        description: 'DataFrames, data cleaning, aggregation, reshaping (melt/pivot), and missing value imputation.'
      },
      {
        canonicalName: 'Exploratory Data Analysis (EDA)',
        normalizedName: 'eda',
        category: 'Data Analysis',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'Summary statistics, distribution analysis, correlation matrices, and anomaly identification.'
      },
      {
        canonicalName: 'Spreadsheets (Excel / Google Sheets Mastery)',
        normalizedName: 'spreadsheets',
        category: 'Data Analysis',
        targetLevel: 4,
        weight: 2,
        importance: 'Important',
        description: 'XLOOKUP, INDEX/MATCH, pivot tables, conditional logic, and financial modeling basics.'
      },
      {
        canonicalName: 'Business KPI Formulation & Metrics',
        normalizedName: 'business-kpis',
        category: 'Business Intelligence',
        targetLevel: 3,
        weight: 2,
        importance: 'Important',
        description: 'Customer churn rate, CAC, LTV, conversion funnels, and retention cohort analysis.'
      },
      {
        canonicalName: 'Basic Applied Statistics & A/B Testing',
        normalizedName: 'statistics-ab-testing',
        category: 'Data Analysis',
        targetLevel: 3,
        weight: 2,
        importance: 'Important',
        description: 'Hypothesis testing, p-values, sample size calculations, and statistical significance.'
      },
      {
        canonicalName: 'Data Storytelling & Executive Communication',
        normalizedName: 'data-storytelling',
        category: 'Communication',
        targetLevel: 3,
        weight: 1,
        importance: 'Optional',
        description: 'Translating charts into actionable business decisions without overwhelming technical jargon.'
      }
    ],
    learningResources: [
      {
        title: 'PostgreSQL Official Documentation — Tutorial & SQL Queries',
        provider: 'PostgreSQL Global Development Group',
        relatedSkills: ['Advanced SQL Querying'],
        resourceType: 'Documentation',
        difficulty: 'Beginner',
        estimatedHours: 25,
        url: 'https://www.postgresql.org/docs/current/tutorial.html',
        description: 'Comprehensive guide to relational database architecture, joins, aggregates, and window queries.'
      },
      {
        title: 'Pandas Official User Guide',
        provider: 'Pandas Development Team',
        relatedSkills: ['Python for Data Analysis (Pandas & NumPy)', 'Exploratory Data Analysis (EDA)'],
        resourceType: 'Documentation',
        difficulty: 'Intermediate',
        estimatedHours: 30,
        url: 'https://pandas.pydata.org/docs/user_guide/index.html',
        description: 'In-depth reference for indexing, slicing, merging, grouping, and cleaning tabular data.'
      },
      {
        title: 'Storytelling with Data — Visual Best Practices',
        provider: 'Cole Nussbaumer Knaflic',
        relatedSkills: ['Data Visualization & BI Tools', 'Data Storytelling & Executive Communication'],
        resourceType: 'Guide',
        difficulty: 'Beginner',
        estimatedHours: 15,
        url: 'https://www.storytellingwithdata.com/chart-guide',
        description: 'Essential principles for eliminating chart clutter and focusing audience attention on crucial insights.'
      }
    ],
    portfolioProjects: [
      {
        projectId: 'da-proj-01',
        title: 'SaaS Customer Churn & Cohort Retention Dashboard',
        description:
          'Analyze multi-year customer subscription and renewal data to identify leading indicators of customer churn.',
        difficulty: 'Beginner',
        estimatedHours: 25,
        skillsDeveloped: ['Advanced SQL Querying', 'Data Visualization & BI Tools', 'Business KPI Formulation & Metrics'],
        deliverables: [
          'SQL script with modular CTEs calculating monthly retention cohorts',
          'Interactive dashboard featuring churn trends, MRR loss, and cohort heatmaps',
          'Executive 1-page memo summarizing high-risk customer segments and action items'
        ],
        completionCriteria: [
          'Accurately calculates customer retention percentage by monthly signup cohorts',
          'Identifies statistically significant churn triggers with data-backed recommendations'
        ]
      },
      {
        projectId: 'da-proj-02',
        title: 'E-Commerce Marketing Channel Attribution & Conversion Analysis',
        description:
          'Perform exploratory data analysis on multi-channel marketing campaigns to optimize ad spend and compute ROAS.',
        difficulty: 'Intermediate',
        estimatedHours: 30,
        skillsDeveloped: [
          'Python for Data Analysis (Pandas & NumPy)',
          'Exploratory Data Analysis (EDA)',
          'Basic Applied Statistics & A/B Testing'
        ],
        deliverables: [
          'Jupyter/Python notebook with comprehensive data cleaning and anomaly detection',
          'First-touch vs last-touch marketing attribution model comparison',
          'A/B test statistical significance evaluation report with confidence intervals'
        ],
        completionCriteria: [
          'Handles null values and invalid timestamps without silently dropping valid records',
          'Computes p-values and 95% confidence intervals for conversion rate differences'
        ]
      }
    ],
    preparationAdvice: [
      'Master SQL window functions and aggregation cold; they are tested in almost every data analyst interview',
      'Always question data quality: check for missing values, unexpected duplicates, and outliers before reporting numbers',
      'Frame insights around business decisions rather than reciting isolated numbers'
    ],
    milestonesTemplate: [
      {
        stage: 1,
        stageName: 'Foundations',
        title: 'Relational Databases & SQL Foundations',
        learningObjective: 'Master SELECT statements, WHERE filters, multi-table JOINs, and GROUP BY aggregations.',
        skillsCovered: ['Advanced SQL Querying', 'Spreadsheets (Excel / Google Sheets Mastery)'],
        practicalTask: 'Write queries calculating monthly sales totals and customer lifetime transactions.',
        completionCriteria: 'Queries return correct summary metrics without Cartesian product bugs.',
        estimatedEffort: '15 hours'
      },
      {
        stage: 2,
        stageName: 'Core Skills',
        title: 'Advanced SQL & Python Data Manipulation',
        learningObjective: 'Implement window functions, CTEs, and write Pandas scripts for data wrangling.',
        skillsCovered: ['Advanced SQL Querying', 'Python for Data Analysis (Pandas & NumPy)'],
        practicalTask: 'Calculate running totals, rank orderings, and period-over-period growth rates.',
        completionCriteria: 'Uses window functions correctly without subquery performance bottlenecks.',
        estimatedEffort: '25 hours'
      },
      {
        stage: 3,
        stageName: 'Practical Application',
        title: 'Interactive Dashboard Design & KPI Modeling',
        learningObjective: 'Build clean, high-contrast dashboards communicating business performance clearly.',
        skillsCovered: ['Data Visualization & BI Tools', 'Business KPI Formulation & Metrics'],
        practicalTask: 'Create an executive dashboard tracking MRR, Churn, and CAC metrics.',
        completionCriteria: 'Eliminates chart junk; enables interactive filtering by date and segment.',
        estimatedEffort: '30 hours'
      },
      {
        stage: 4,
        stageName: 'Portfolio Development',
        title: 'Cohort Retention Portfolio Project Publication',
        learningObjective: 'Execute and publish the SaaS Customer Churn analysis project with clear documentation.',
        skillsCovered: ['Exploratory Data Analysis (EDA)', 'Data Storytelling & Executive Communication'],
        practicalTask: 'Publish the completed analysis notebook and dashboard to GitHub with case study write-up.',
        completionCriteria: 'README includes executive summary, chart callouts, and recommendations.',
        estimatedEffort: '30 hours'
      },
      {
        stage: 5,
        stageName: 'Career Preparation',
        title: 'SQL Live Coding & Business Case Interview Prep',
        learningObjective: 'Solve timed live SQL challenges and practice articulating insights under interview conditions.',
        skillsCovered: ['Advanced SQL Querying', 'Data Storytelling & Executive Communication'],
        practicalTask: 'Complete 10 LeetCode / HackerRank SQL medium challenges under timed constraints.',
        completionCriteria: 'Explain time complexity and query optimization techniques clearly.',
        estimatedEffort: '15 hours'
      }
    ]
  },

  // 7. Data Scientist
  {
    title: 'Data Scientist',
    slug: 'data-scientist',
    category: 'Data and Artificial Intelligence',
    description:
      'Applies rigorous statistical modeling, machine learning algorithms, and predictive analytics to solve complex business problems and uncover non-obvious patterns in data.',
    responsibilities: [
      'Formulate business questions as testable mathematical and statistical hypotheses',
      'Build end-to-end predictive modeling pipelines from feature engineering to model evaluation',
      'Train supervised and unsupervised machine learning models (regression, classification, clustering)',
      'Evaluate model performance using ROC-AUC, precision-recall curves, and cross-validation',
      'Interpret model feature importances (SHAP, LIME) and present findings to cross-functional teams'
    ],
    requiredSkills: [
      {
        canonicalName: 'Statistical Inference & Probability',
        normalizedName: 'statistics-probability',
        category: 'Data Science',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'Probability distributions, central limit theorem, hypothesis testing, Bayesian inference.'
      },
      {
        canonicalName: 'Machine Learning Algorithms (Scikit-Learn)',
        normalizedName: 'machine-learning',
        category: 'Data Science',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'Linear/logistic regression, decision trees, random forests, gradient boosting (XGBoost/LightGBM).'
      },
      {
        canonicalName: 'Feature Engineering & Preprocessing',
        normalizedName: 'feature-engineering',
        category: 'Data Science',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'Encoding categorical variables, scaling, normalization, handling class imbalance (SMOTE), PCA.'
      },
      {
        canonicalName: 'Python Scientific Ecosystem (Pandas, SciPy)',
        normalizedName: 'python-scientific',
        category: 'Data Science',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'Vectorized computing with NumPy, statistical tests with SciPy, tabular operations in Pandas.'
      },
      {
        canonicalName: 'Model Validation & Evaluation Metrics',
        normalizedName: 'model-evaluation',
        category: 'Data Science',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'K-fold cross-validation, confusion matrices, ROC-AUC, PR curves, MSE/RMSE/MAE.'
      },
      {
        canonicalName: 'Model Explainability (SHAP & LIME)',
        normalizedName: 'model-explainability',
        category: 'Data Science',
        targetLevel: 3,
        weight: 2,
        importance: 'Important',
        description: 'Global and local feature attribution, understanding model bias, and interpreting predictions.'
      },
      {
        canonicalName: 'SQL & Data Extraction',
        normalizedName: 'sql',
        category: 'Data Engineering',
        targetLevel: 3,
        weight: 2,
        importance: 'Important',
        description: 'Querying analytical databases, window functions, and joining complex event tables.'
      },
      {
        canonicalName: 'Experimental Design & A/B Testing',
        normalizedName: 'experimental-design',
        category: 'Data Science',
        targetLevel: 3,
        weight: 2,
        importance: 'Important',
        description: 'Power analysis, minimum detectable effect, stratification, and sample ratio mismatch checks.'
      }
    ],
    learningResources: [
      {
        title: 'Scikit-Learn Official User Guide & API',
        provider: 'Scikit-Learn Developers',
        relatedSkills: ['Machine Learning Algorithms (Scikit-Learn)', 'Model Validation & Evaluation Metrics'],
        resourceType: 'Documentation',
        difficulty: 'Intermediate',
        estimatedHours: 35,
        url: 'https://scikit-learn.org/stable/user_guide.html',
        description: 'Exemplary documentation covering preprocessing, supervised learning, clustering, and model selection.'
      },
      {
        title: 'Introduction to Statistical Learning (ISLR)',
        provider: 'Stanford University (James, Witten, Hastie, Tibshirani)',
        relatedSkills: ['Statistical Inference & Probability', 'Machine Learning Algorithms (Scikit-Learn)'],
        resourceType: 'Book',
        difficulty: 'Intermediate',
        estimatedHours: 50,
        url: 'https://www.statlearning.com/',
        description: 'Gold-standard academic text covering statistical learning concepts with accessible mathematical rigor.'
      },
      {
        title: 'Kaggle Learn — Machine Learning & Feature Engineering',
        provider: 'Kaggle',
        relatedSkills: ['Feature Engineering & Preprocessing', 'Model Validation & Evaluation Metrics'],
        resourceType: 'Interactive',
        difficulty: 'Beginner',
        estimatedHours: 20,
        url: 'https://www.kaggle.com/learn',
        description: 'Hands-on interactive notebooks covering essential data cleaning, modeling, and evaluation patterns.'
      }
    ],
    portfolioProjects: [
      {
        projectId: 'ds-proj-01',
        title: 'Predictive Credit Default Classification with SHAP Explainability',
        description:
          'Develop an end-to-end predictive classification pipeline forecasting loan defaults while explaining risk factors to loan officers.',
        difficulty: 'Intermediate',
        estimatedHours: 35,
        skillsDeveloped: [
          'Machine Learning Algorithms (Scikit-Learn)',
          'Feature Engineering & Preprocessing',
          'Model Explainability (SHAP & LIME)',
          'Model Validation & Evaluation Metrics'
        ],
        deliverables: [
          'Reproducible Jupyter notebook with data preprocessing, stratified k-fold split, and baseline comparisons',
          'Tuned XGBoost model evaluated via PR-AUC and ROC-AUC curves',
          'SHAP summary plots demonstrating feature attribution for credit risk'
        ],
        completionCriteria: [
          'Prevents data leakage by computing transformers inside cross-validation splits',
          'Compares multiple algorithms (Logistic Regression vs Random Forest vs Gradient Boosting)',
          'Generates clear executive documentation of model limitations and ethical safeguards'
        ]
      },
      {
        projectId: 'ds-proj-02',
        title: 'Healthcare Readmission Risk Time-to-Event Modeling',
        description:
          'Build a risk stratification model estimating 30-day patient readmission likelihood from clinical indicators.',
        difficulty: 'Advanced',
        estimatedHours: 40,
        skillsDeveloped: [
          'Statistical Inference & Probability',
          'Feature Engineering & Preprocessing',
          'Experimental Design & A/B Testing'
        ],
        deliverables: [
          'Complete pipeline handling skewed features and missing clinical records',
          'Calibration curves evaluating probability reliability across risk deciles',
          'Clinical decision trade-off analysis comparing sensitivity vs specificity thresholds'
        ],
        completionCriteria: [
          'Model calibration verified with Brier score and calibration plots',
          'Recommends optimal threshold balancing false positives against false negatives'
        ]
      }
    ],
    preparationAdvice: [
      'Never train a machine learning model without establishing a simple baseline heuristic first',
      'Guard rigorously against data leakage: fit transformers exclusively on training folds',
      'Understand why an algorithm makes a specific prediction, not just its aggregate accuracy metric'
    ],
    milestonesTemplate: [
      {
        stage: 1,
        stageName: 'Foundations',
        title: 'Probability Distributions & Statistical Hypotheses',
        learningObjective: 'Master parametric tests, p-values, confidence intervals, and probability distributions.',
        skillsCovered: ['Statistical Inference & Probability', 'Python Scientific Ecosystem (Pandas, SciPy)'],
        practicalTask: 'Perform two-sample t-tests and Chi-square independence tests on medical trial records.',
        completionCriteria: 'Verify test assumptions (normality, variance homogeneity) before computing statistics.',
        estimatedEffort: '20 hours'
      },
      {
        stage: 2,
        stageName: 'Core Skills',
        title: 'Supervised Learning & Validation Discipline',
        learningObjective: 'Implement regression, classification, cross-validation, and hyperparameter tuning.',
        skillsCovered: ['Machine Learning Algorithms (Scikit-Learn)', 'Model Validation & Evaluation Metrics'],
        practicalTask: 'Build a Scikit-Learn pipeline with GridSearchCV and StratifiedKFold.',
        completionCriteria: 'Prevents target leakage; demonstrates evaluation on holdout test set.',
        estimatedEffort: '30 hours'
      },
      {
        stage: 3,
        stageName: 'Practical Application',
        title: 'Feature Engineering & Model Interpretation',
        learningObjective: 'Engineer domain-specific features and calculate SHAP values for model transparency.',
        skillsCovered: ['Feature Engineering & Preprocessing', 'Model Explainability (SHAP & LIME)'],
        practicalTask: 'Generate SHAP waterfall and summary plots for an ensemble model.',
        completionCriteria: 'Articulate individual prediction drivers in plain business language.',
        estimatedEffort: '25 hours'
      },
      {
        stage: 4,
        stageName: 'Portfolio Development',
        title: 'Predictive Modeling Project Publication',
        learningObjective: 'Complete and publish the Predictive Credit Default Classification project.',
        skillsCovered: ['Machine Learning Algorithms (Scikit-Learn)', 'Model Explainability (SHAP & LIME)'],
        practicalTask: 'Publish the reproducible notebook, requirements, and interactive Streamlit/web demo.',
        completionCriteria: 'Clean code with docstrings; runs end-to-end without errors.',
        estimatedEffort: '35 hours'
      },
      {
        stage: 5,
        stageName: 'Career Preparation',
        title: 'Data Science Technical Interviews & Case Studies',
        learningObjective: 'Prepare for statistical modeling questions, algorithm derivations, and ML system design.',
        skillsCovered: ['Experimental Design & A/B Testing', 'Statistical Inference & Probability'],
        practicalTask: 'Walk through an end-to-end ML case study defending metric selection and trade-offs.',
        completionCriteria: 'Succinctly explain the bias-variance tradeoff and regularization mechanics.',
        estimatedEffort: '15 hours'
      }
    ]
  },

  // 8. AI/ML Engineer
  {
    title: 'AI/ML Engineer',
    slug: 'aiml-engineer',
    category: 'Data and Artificial Intelligence',
    description:
      'Engineers, optimizes, and deploys deep learning architectures, Large Language Model (LLM) pipelines, neural networks, and scalable ML inference systems to production.',
    responsibilities: [
      'Train, fine-tune, and evaluate deep learning models using PyTorch or TensorFlow',
      'Build generative AI pipelines, Retrieval-Augmented Generation (RAG), and vector search',
      'Optimize model inference speed, memory footprint (quantization), and batching pipelines',
      'Deploy models as resilient microservices with low latency and high availability',
      'Track experiments and model artifacts using MLOps tooling (MLflow, Weights & Biases)'
    ],
    requiredSkills: [
      {
        canonicalName: 'Deep Learning Frameworks (PyTorch / TensorFlow)',
        normalizedName: 'deep-learning-pytorch',
        category: 'Machine Learning',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'Tensors, autograd, custom layers, loss functions, optimizers, and GPU training.'
      },
      {
        canonicalName: 'Transformer Architectures & LLM Fundamentals',
        normalizedName: 'transformers-llm',
        category: 'Generative AI',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'Self-attention mechanisms, tokenization, embeddings, prompt engineering, and decoding strategies.'
      },
      {
        canonicalName: 'Retrieval-Augmented Generation (RAG) & Vector DBs',
        normalizedName: 'rag-vector-db',
        category: 'Generative AI',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'Document chunking, dense vector embeddings, similarity search, semantic reranking.'
      },
      {
        canonicalName: 'ML Inference Serving & FastAPI',
        normalizedName: 'ml-serving',
        category: 'MLOps',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'FastAPI REST endpoints, ONNX runtime, streaming responses, and latency benchmarking.'
      },
      {
        canonicalName: 'Model Fine-Tuning & Parameter Efficient Tuning (PEFT)',
        normalizedName: 'fine-tuning-peft',
        category: 'Generative AI',
        targetLevel: 3,
        weight: 2,
        importance: 'Important',
        description: 'LoRA, QLoRA, instruction tuning datasets, and evaluation benchmarks.'
      },
      {
        canonicalName: 'MLOps & Experiment Tracking (MLflow / W&B)',
        normalizedName: 'mlops-tracking',
        category: 'MLOps',
        targetLevel: 3,
        weight: 2,
        importance: 'Important',
        description: 'Logging hyperparameters, model checkpoints, data versioning, and deployment registries.'
      },
      {
        canonicalName: 'Model Quantization & Optimization',
        normalizedName: 'quantization-optimization',
        category: 'Machine Learning',
        targetLevel: 3,
        weight: 2,
        importance: 'Important',
        description: 'FP16, INT8/INT4 quantization, pruning, and KV-cache optimization.'
      },
      {
        canonicalName: 'Docker & GPU Containerization',
        normalizedName: 'docker-gpu',
        category: 'Systems & DevOps',
        targetLevel: 3,
        weight: 1,
        importance: 'Optional',
        description: 'NVIDIA Docker, CUDA drivers, and containerizing ML inference workloads.'
      }
    ],
    learningResources: [
      {
        title: 'PyTorch Official Tutorials & Documentation',
        provider: 'PyTorch Foundation',
        relatedSkills: ['Deep Learning Frameworks (PyTorch / TensorFlow)'],
        resourceType: 'Interactive',
        difficulty: 'Beginner',
        estimatedHours: 40,
        url: 'https://pytorch.org/tutorials/',
        description: 'Essential guides covering tensor manipulation, building neural nets, and training pipelines.'
      },
      {
        title: 'Hugging Face NLP Course — Transformers & Tokenizers',
        provider: 'Hugging Face',
        relatedSkills: ['Transformer Architectures & LLM Fundamentals', 'Model Fine-Tuning & Parameter Efficient Tuning (PEFT)'],
        resourceType: 'Course',
        difficulty: 'Intermediate',
        estimatedHours: 35,
        url: 'https://huggingface.co/learn/nlp-course',
        description: 'The premier hands-on curriculum for using Transformers, datasets, tokenizers, and fine-tuning.'
      },
      {
        title: 'Google Generative AI Developer Documentation',
        provider: 'Google AI Studio',
        relatedSkills: ['Transformer Architectures & LLM Fundamentals', 'Retrieval-Augmented Generation (RAG) & Vector DBs'],
        resourceType: 'Documentation',
        difficulty: 'Intermediate',
        estimatedHours: 20,
        url: 'https://ai.google.dev/docs',
        description: 'Documentation for multimodal prompting, structured JSON outputs, embeddings, and API integration.'
      }
    ],
    portfolioProjects: [
      {
        projectId: 'ai-proj-01',
        title: 'Enterprise Document Q&A Engine with RAG and Semantic Reranker',
        description:
          'Architect an end-to-end RAG system that ingests PDF policies, generates dense embeddings, retrieves relevant chunks, and synthesizes grounded answers.',
        difficulty: 'Intermediate',
        estimatedHours: 35,
        skillsDeveloped: [
          'Retrieval-Augmented Generation (RAG) & Vector DBs',
          'Transformer Architectures & LLM Fundamentals',
          'ML Inference Serving & FastAPI'
        ],
        deliverables: [
          'Python FastAPI service exposing streaming question-answering endpoints',
          'Vector database indexing pipeline with recursive text chunking and metadata filtering',
          'Evaluation script computing retrieval precision and groundedness metrics'
        ],
        completionCriteria: [
          'Cites source document and page number with every generated response',
          'Sub-second retrieval latency verified across a corpus of 500+ document chunks',
          'Includes defensive guards against prompt injection and hallucinated claims'
        ]
      },
      {
        projectId: 'ai-proj-02',
        title: 'Low-Latency Sentiment & Intent Classifier with PyTorch and ONNX',
        description:
          'Train, quantize, and serve a compact Transformer classifier for customer support tickets with sub-15ms latency.',
        difficulty: 'Advanced',
        estimatedHours: 40,
        skillsDeveloped: [
          'Deep Learning Frameworks (PyTorch / TensorFlow)',
          'Model Quantization & Optimization',
          'MLOps & Experiment Tracking (MLflow / W&B)'
        ],
        deliverables: [
          'PyTorch training script with learning rate scheduling and early stopping',
          'ONNX exported and INT8 quantized model package',
          'Benchmarking script comparing latency and throughput between PyTorch and ONNX'
        ],
        completionCriteria: [
          'Achieves >= 88% Macro F1-score across all intent categories',
          'Demonstrates at least 3x inference speedup post-quantization with <1% accuracy loss'
        ]
      }
    ],
    preparationAdvice: [
      'Understand the inner workings of matrix multiplication, backpropagation, and self-attention deeply',
      'Focus heavily on inference latency, memory constraints, and deployment cost rather than just training loss',
      'Build evaluation pipelines with real ground-truth benchmarks before tweaking prompts or fine-tuning models'
    ],
    milestonesTemplate: [
      {
        stage: 1,
        stageName: 'Foundations',
        title: 'Tensors, Neural Layers & Backpropagation',
        learningObjective: 'Master tensor mechanics, computational graphs, activation functions, and gradient descent.',
        skillsCovered: ['Deep Learning Frameworks (PyTorch / TensorFlow)'],
        practicalTask: 'Implement a multi-layer perceptron with custom backward pass in PyTorch.',
        completionCriteria: 'Loss decreases steadily; weights update verified against numerical gradients.',
        estimatedEffort: '20 hours'
      },
      {
        stage: 2,
        stageName: 'Core Skills',
        title: 'Transformer Architecture & Embeddings',
        learningObjective: 'Understand multi-head attention, positional encoding, and vector embeddings.',
        skillsCovered: ['Transformer Architectures & LLM Fundamentals', 'Retrieval-Augmented Generation (RAG) & Vector DBs'],
        practicalTask: 'Build a semantic search tool over documentation chunks using dense embeddings.',
        completionCriteria: 'Returns top-3 semantically relevant paragraphs for arbitrary natural language queries.',
        estimatedEffort: '25 hours'
      },
      {
        stage: 3,
        stageName: 'Practical Application',
        title: 'Production RAG System Architecture',
        learningObjective: 'Build and optimize an end-to-end RAG pipeline with chunking and reranking.',
        skillsCovered: ['Retrieval-Augmented Generation (RAG) & Vector DBs', 'ML Inference Serving & FastAPI'],
        practicalTask: 'Expose the RAG engine over a streaming FastAPI server with health checks.',
        completionCriteria: 'Stream tokens smoothly with accurate source citations.',
        estimatedEffort: '30 hours'
      },
      {
        stage: 4,
        stageName: 'Portfolio Development',
        title: 'Enterprise Document Q&A Portfolio Publication',
        learningObjective: 'Complete and deploy the Enterprise Document Q&A project with performance benchmarks.',
        skillsCovered: ['ML Inference Serving & FastAPI', 'Model Quantization & Optimization'],
        practicalTask: 'Publish the documented repository with Dockerfile and evaluation report.',
        completionCriteria: 'Live demo running; documentation details latency, memory usage, and safeguards.',
        estimatedEffort: '35 hours'
      },
      {
        stage: 5,
        stageName: 'Career Preparation',
        title: 'ML System Design & Architecture Defense',
        learningObjective: 'Design scalable inference architectures handling high QPS and large model weights.',
        skillsCovered: ['MLOps & Experiment Tracking (MLflow / W&B)', 'ML Inference Serving & FastAPI'],
        practicalTask: 'Defend an ML system design diagram addressing model drift, fallback caching, and latency.',
        completionCriteria: 'Articulate trade-offs between local inference vs managed LLM APIs.',
        estimatedEffort: '15 hours'
      }
    ]
  },

  // 9. UI/UX Designer
  {
    title: 'UI/UX Designer',
    slug: 'ui-ux-designer',
    category: 'Design',
    description:
      'Creates intuitive, accessible, and delightful digital user experiences by conducting user research, crafting wireframes, building design systems, and validating interactive prototypes.',
    responsibilities: [
      'Conduct user interviews, usability tests, and synthesize qualitative/quantitative feedback',
      'Map user journeys, task flows, information architectures, and personas',
      'Design low-to-high fidelity wireframes, interactive prototypes, and micro-interactions in Figma',
      'Establish and maintain cohesive design systems with tokens, variants, and auto-layout',
      'Collaborate with software engineers to ensure high-fidelity implementation and accessibility'
    ],
    requiredSkills: [
      {
        canonicalName: 'Figma Mastery & Component Variants',
        normalizedName: 'figma',
        category: 'Product Design',
        targetLevel: 5,
        weight: 3,
        importance: 'Required',
        description: 'Auto-layout, design tokens, component properties, variants, and interactive prototyping.'
      },
      {
        canonicalName: 'User Research & Usability Testing',
        normalizedName: 'user-research',
        category: 'UX Research',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'Qualitative interviews, usability heuristics, cognitive walkthroughs, and affinity mapping.'
      },
      {
        canonicalName: 'Information Architecture & Wireframing',
        normalizedName: 'wireframing-ia',
        category: 'Product Design',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'Site maps, user flows, low-fidelity sketching, and hierarchical content layout.'
      },
      {
        canonicalName: 'Design Systems & Component Architecture',
        normalizedName: 'design-systems',
        category: 'Product Design',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'Color palettes, typographic scales, spacing units (8pt grid), and accessible component states.'
      },
      {
        canonicalName: 'Accessibility (WCAG 2.2 AA Standards)',
        normalizedName: 'design-accessibility',
        category: 'Accessibility',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'Color contrast ratios, touch targets (>=44px), focus states, and screen reader affordances.'
      },
      {
        canonicalName: 'Interaction Design & Micro-animations',
        normalizedName: 'interaction-design',
        category: 'Product Design',
        targetLevel: 3,
        weight: 2,
        importance: 'Important',
        description: 'State transitions, feedback cues, loading skeletons, and interactive component prototypes.'
      },
      {
        canonicalName: 'Frontend Fundamentals (HTML/CSS Understanding)',
        normalizedName: 'html-css-basics',
        category: 'Design-Dev Bridge',
        targetLevel: 3,
        weight: 2,
        importance: 'Important',
        description: 'Box model, CSS flexbox/grid, responsive breakpoints, and developer handoff specs.'
      },
      {
        canonicalName: 'Product Strategy & Metrics (HEART Framework)',
        normalizedName: 'ux-metrics',
        category: 'Product Design',
        targetLevel: 3,
        weight: 1,
        importance: 'Optional',
        description: 'Google HEART framework, task completion rate, time-on-task, and Net Promoter Score.'
      }
    ],
    learningResources: [
      {
        title: 'Figma Community & Design System Tutorials',
        provider: 'Figma',
        relatedSkills: ['Figma Mastery & Component Variants', 'Design Systems & Component Architecture'],
        resourceType: 'Interactive',
        difficulty: 'Beginner',
        estimatedHours: 30,
        url: 'https://help.figma.com/hc/en-us/categories/360002042553-Figma-design',
        description: 'Official guides for mastering auto-layout, design tokens, component variants, and prototyping.'
      },
      {
        title: 'Nielsen Norman Group — UX Research & Usability Heuristics',
        provider: 'Nielsen Norman Group (NN/g)',
        relatedSkills: ['User Research & Usability Testing', 'Information Architecture & Wireframing'],
        resourceType: 'Guide',
        difficulty: 'Beginner',
        estimatedHours: 25,
        url: 'https://www.nngroup.com/articles/ten-usability-heuristics/',
        description: 'Foundational 10 usability heuristics for user interface design by Jakob Nielsen.'
      },
      {
        title: 'W3C Web Accessibility Guidelines (WCAG 2.2)',
        provider: 'World Wide Web Consortium (W3C)',
        relatedSkills: ['Accessibility (WCAG 2.2 AA Standards)'],
        resourceType: 'Documentation',
        difficulty: 'Intermediate',
        estimatedHours: 15,
        url: 'https://www.w3.org/WAI/standards-guidelines/wcag/',
        description: 'Authoritative international accessibility standards for text contrast, touch targets, and assistive tech.'
      }
    ],
    portfolioProjects: [
      {
        projectId: 'ux-proj-01',
        title: 'Student Internship Discovery Portal: Full UX Case Study',
        description:
          'Conduct user research, synthesize student journey friction, build an accessible design system, and test an interactive prototype.',
        difficulty: 'Intermediate',
        estimatedHours: 35,
        skillsDeveloped: [
          'User Research & Usability Testing',
          'Figma Mastery & Component Variants',
          'Design Systems & Component Architecture',
          'Accessibility (WCAG 2.2 AA Standards)'
        ],
        deliverables: [
          'Comprehensive Figma file with documented design system (tokens, colors, components, states)',
          'Interactive high-fidelity clickable prototype covering the core application flow',
          'Written case study presenting research findings, personas, iterations, and usability test metrics'
        ],
        completionCriteria: [
          'All text meets or exceeds WCAG AA 4.5:1 contrast ratio verified by Stark/Figma plugins',
          'Interactive prototype covers at least 5 complete user paths with back/forward transitions',
          'Demonstrates at least 2 major design iterations driven directly by usability test feedback'
        ]
      },
      {
        projectId: 'ux-proj-02',
        title: 'Fintech Mobile Banking App: Micro-Interactions & Redesign',
        description:
          'Redesign a complex financial onboarding and transfer flow with emphasis on clarity, security cues, and micro-interactions.',
        difficulty: 'Intermediate',
        estimatedHours: 30,
        skillsDeveloped: [
          'Interaction Design & Micro-animations',
          'Information Architecture & Wireframing',
          'Frontend Fundamentals (HTML/CSS Understanding)'
        ],
        deliverables: [
          'Mobile task flow mapping out error prevention and verification steps',
          'High-fidelity animated prototype demonstrating payment confirmation and error states',
          'Developer handoff documentation detailing padding, tokens, and CSS properties'
        ],
        completionCriteria: [
          'All clickable mobile targets meet minimum 44px by 44px touch bounding box',
          'Eliminates ambiguous financial jargon; provides clear undo windows and confirm modals'
        ]
      }
    ],
    preparationAdvice: [
      'Document your reasoning: employers evaluate how you think through trade-offs much more than visual polish alone',
      'Test your designs with real people early and often using simple paper or clickable wireframes',
      'Build empathy with developers by understanding CSS layout math, flexbox, and component state props'
    ],
    milestonesTemplate: [
      {
        stage: 1,
        stageName: 'Foundations',
        title: 'User Research & Usability Heuristics',
        learningObjective: 'Conduct user interviews, identify usability flaws, and formulate actionable personas.',
        skillsCovered: ['User Research & Usability Testing', 'Information Architecture & Wireframing'],
        practicalTask: 'Perform a heuristic evaluation of an existing student university portal.',
        completionCriteria: 'Identify at least 5 heuristic violations with concrete design remediation ideas.',
        estimatedEffort: '15 hours'
      },
      {
        stage: 2,
        stageName: 'Core Skills',
        title: 'Figma Auto-Layout & Design System Tokens',
        learningObjective: 'Master Figma components, nested auto-layout, spacing grids, and design tokens.',
        skillsCovered: ['Figma Mastery & Component Variants', 'Design Systems & Component Architecture'],
        practicalTask: 'Build a cohesive UI kit with typography, colors, buttons, inputs, and card components.',
        completionCriteria: 'Components resize cleanly with auto-layout; dark and light color tokens defined.',
        estimatedEffort: '25 hours'
      },
      {
        stage: 3,
        stageName: 'Practical Application',
        title: 'High-Fidelity Prototyping & Accessibility Audit',
        learningObjective: 'Create interactive prototypes and verify strict WCAG 2.2 AA accessibility compliance.',
        skillsCovered: ['Figma Mastery & Component Variants', 'Accessibility (WCAG 2.2 AA Standards)'],
        practicalTask: 'Connect screens with interactive transitions and verify contrast across all states.',
        completionCriteria: 'Zero contrast failures; all interactive states (hover, focus, disabled, active) mapped.',
        estimatedEffort: '30 hours'
      },
      {
        stage: 4,
        stageName: 'Portfolio Development',
        title: 'Comprehensive UX Case Study Publication',
        learningObjective: 'Complete and publish the Student Internship Discovery Portal case study.',
        skillsCovered: ['Figma Mastery & Component Variants', 'User Research & Usability Testing'],
        practicalTask: 'Publish a detailed portfolio case study detailing research, wireframes, iterations, and results.',
        completionCriteria: 'Case study articulates the user problem, research methodology, and business impact.',
        estimatedEffort: '35 hours'
      },
      {
        stage: 5,
        stageName: 'Career Preparation',
        title: 'Portfolio Presentation & Whiteboard Challenge Prep',
        learningObjective: 'Master the design portfolio walkthrough and timed design thinking whiteboard challenges.',
        skillsCovered: ['Product Strategy & Metrics (HEART Framework)', 'Information Architecture & Wireframing'],
        practicalTask: 'Conduct a recorded 15-minute case study presentation defending design decisions.',
        completionCriteria: 'Articulate trade-offs, constraints, and metrics with clarity and confidence.',
        estimatedEffort: '15 hours'
      }
    ]
  },

  // 10. Business Analyst
  {
    title: 'Business Analyst',
    slug: 'business-analyst',
    category: 'Business and Management',
    description:
      'Bridges the gap between business stakeholders and technical engineering teams by eliciting requirements, analyzing business processes, writing specifications, and verifying solutions.',
    responsibilities: [
      'Facilitate stakeholder interviews and requirements elicitation workshops',
      'Author detailed Business Requirements Documents (BRDs) and functional user stories',
      'Model current-state (As-Is) and future-state (To-Be) business processes in BPMN',
      'Perform gap analysis between existing system capabilities and organizational goals',
      'Define acceptance criteria (Given-When-Then) and coordinate User Acceptance Testing (UAT)'
    ],
    requiredSkills: [
      {
        canonicalName: 'Requirements Elicitation & BRD Authoring',
        normalizedName: 'requirements-brd',
        category: 'Business Analysis',
        targetLevel: 5,
        weight: 3,
        importance: 'Required',
        description: 'Interviews, focus groups, functional vs non-functional requirements, and traceability.'
      },
      {
        canonicalName: 'Process Modeling (BPMN 2.0 & UML)',
        normalizedName: 'bpmn-process-modeling',
        category: 'Process Modeling',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'Swimlane diagrams, activity flows, decision trees, sequence diagrams, and use case diagrams.'
      },
      {
        canonicalName: 'Agile User Stories & Acceptance Criteria (Gherkin)',
        normalizedName: 'agile-user-stories',
        category: 'Agile Delivery',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'INVEST criteria, Given-When-Then syntax, backlog prioritization (MoSCoW).'
      },
      {
        canonicalName: 'Gap Analysis & Feasibility Evaluation',
        normalizedName: 'gap-analysis',
        category: 'Business Analysis',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'Comparing As-Is vs To-Be states, cost-benefit analysis, and risk registers.'
      },
      {
        canonicalName: 'SQL & Data Verification',
        normalizedName: 'sql',
        category: 'Data & Analytics',
        targetLevel: 3,
        weight: 2,
        importance: 'Important',
        description: 'Querying tables to validate business assumptions, metrics, and report accuracy.'
      },
      {
        canonicalName: 'Stakeholder Management & Conflict Resolution',
        normalizedName: 'stakeholder-management',
        category: 'Communication',
        targetLevel: 4,
        weight: 2,
        importance: 'Important',
        description: 'RACI matrices, stakeholder mapping, consensus building, and change management.'
      },
      {
        canonicalName: 'User Acceptance Testing (UAT) Coordination',
        normalizedName: 'uat-testing',
        category: 'Quality Assurance',
        targetLevel: 3,
        weight: 2,
        importance: 'Important',
        description: 'Authoring test scenarios, bug tracking, verification sign-offs, and go/no-go readiness.'
      },
      {
        canonicalName: 'Jira & Confluence Documentation',
        normalizedName: 'jira-confluence',
        category: 'Agile Tooling',
        targetLevel: 3,
        weight: 1,
        importance: 'Optional',
        description: 'Epics, sprint backlogs, release notes, and knowledge base curation.'
      }
    ],
    learningResources: [
      {
        title: 'IIBA BABOK Guide (Business Analysis Body of Knowledge)',
        provider: 'International Institute of Business Analysis (IIBA)',
        relatedSkills: ['Requirements Elicitation & BRD Authoring', 'Gap Analysis & Feasibility Evaluation'],
        resourceType: 'Guide',
        difficulty: 'Intermediate',
        estimatedHours: 40,
        url: 'https://www.iiba.org/standards-and-resources/babok/',
        description: 'Global standard for the practice of business analysis, covering knowledge areas and techniques.'
      },
      {
        title: 'BPMN 2.0 Quick Guide & Modeling Principles',
        provider: 'Object Management Group (OMG)',
        relatedSkills: ['Process Modeling (BPMN 2.0 & UML)'],
        resourceType: 'Documentation',
        difficulty: 'Beginner',
        estimatedHours: 15,
        url: 'https://www.omg.org/bpmn/',
        description: 'Standard notation for modeling business workflows, events, gateways, and swimlanes.'
      },
      {
        title: 'Agile Alliance — User Stories & Acceptance Criteria Guide',
        provider: 'Agile Alliance',
        relatedSkills: ['Agile User Stories & Acceptance Criteria (Gherkin)', 'User Acceptance Testing (UAT) Coordination'],
        resourceType: 'Guide',
        difficulty: 'Beginner',
        estimatedHours: 12,
        url: 'https://www.agilealliance.org/glossary/user-stories/',
        description: 'Best practices for writing clear user stories with testable acceptance criteria.'
      }
    ],
    portfolioProjects: [
      {
        projectId: 'ba-proj-01',
        title: 'University Course Enrollment System Modernization: Complete BRD',
        description:
          'Analyze an obsolete university enrollment system, document process bottlenecks, model To-Be swimlanes, and draft a complete functional specification.',
        difficulty: 'Intermediate',
        estimatedHours: 35,
        skillsDeveloped: [
          'Requirements Elicitation & BRD Authoring',
          'Process Modeling (BPMN 2.0 & UML)',
          'Gap Analysis & Feasibility Evaluation',
          'Agile User Stories & Acceptance Criteria (Gherkin)'
        ],
        deliverables: [
          'Formal Business Requirements Document (BRD) with scope, constraints, and non-functional requirements',
          'BPMN 2.0 swimlane workflow diagrams comparing As-Is vs To-Be enrollment flows',
          'Product backlog with 15 INVEST-compliant user stories formatted in Given-When-Then'
        ],
        completionCriteria: [
          'Requirements matrix covers 100% of defined business use cases with unique IDs',
          'Identifies concrete bottlenecks and quantifies expected operational time savings'
        ]
      },
      {
        projectId: 'ba-proj-02',
        title: 'Retail Inventory Management System UAT Plan & Traceability Matrix',
        description:
          'Create a requirements traceability matrix (RTM) and execute a User Acceptance Testing strategy for a stock replenishment portal.',
        difficulty: 'Beginner',
        estimatedHours: 25,
        skillsDeveloped: ['User Acceptance Testing (UAT) Coordination', 'SQL & Data Verification', 'Stakeholder Management & Conflict Resolution'],
        deliverables: [
          'Requirements Traceability Matrix linking business requirements to test cases',
          'UAT test scenario workbook with step-by-step verification instructions',
          'Defect severity triage guide and executive sign-off template'
        ],
        completionCriteria: [
          'Demonstrates bidirectional traceability from initial requirement to test execution result'
        ]
      }
    ],
    preparationAdvice: [
      'Always focus on the root business problem ("Why?") rather than blindly taking solution orders ("How?")',
      'Write user stories that are genuinely testable with unambiguous Given-When-Then acceptance criteria',
      'Learn how to translate technical trade-offs into business risks and financial impacts'
    ],
    milestonesTemplate: [
      {
        stage: 1,
        stageName: 'Foundations',
        title: 'Requirements Elicitation & Scope Definition',
        learningObjective: 'Master interviewing techniques, stakeholder identification, and scope boundary definitions.',
        skillsCovered: ['Requirements Elicitation & BRD Authoring', 'Stakeholder Management & Conflict Resolution'],
        practicalTask: 'Draft a Project Charter and RACI matrix for a new software feature.',
        completionCriteria: 'Clearly delineates in-scope vs out-of-scope boundaries.',
        estimatedEffort: '15 hours'
      },
      {
        stage: 2,
        stageName: 'Core Skills',
        title: 'BPMN Process Modeling & Gap Analysis',
        learningObjective: 'Model complex workflows in standard BPMN 2.0 and map As-Is to To-Be gaps.',
        skillsCovered: ['Process Modeling (BPMN 2.0 & UML)', 'Gap Analysis & Feasibility Evaluation'],
        practicalTask: 'Create swimlane process diagrams for an end-to-end refund workflow.',
        completionCriteria: 'Diagram adheres to OMG BPMN syntax with proper start/intermediate/end events.',
        estimatedEffort: '25 hours'
      },
      {
        stage: 3,
        stageName: 'Practical Application',
        title: 'Agile User Stories & Acceptance Criteria',
        learningObjective: 'Author detailed user stories with Gherkin acceptance criteria and MoSCoW prioritization.',
        skillsCovered: ['Agile User Stories & Acceptance Criteria (Gherkin)', 'SQL & Data Verification'],
        practicalTask: 'Break down an epic into 10 user stories with Gherkin test scenarios.',
        completionCriteria: 'Passes INVEST criteria with zero ambiguity in validation criteria.',
        estimatedEffort: '25 hours'
      },
      {
        stage: 4,
        stageName: 'Portfolio Development',
        title: 'System Modernization BRD Publication',
        learningObjective: 'Complete and compile the University Course Enrollment Modernization BRD.',
        skillsCovered: ['Requirements Elicitation & BRD Authoring', 'Process Modeling (BPMN 2.0 & UML)'],
        practicalTask: 'Publish the completed specification package and present the business case.',
        completionCriteria: 'Comprehensive document ready for engineering estimation and review.',
        estimatedEffort: '35 hours'
      },
      {
        stage: 5,
        stageName: 'Career Preparation',
        title: 'BA Case Interview Prep & ECBA Certification Study',
        learningObjective: 'Prepare for business analysis case interviews and IIBA certification standards.',
        skillsCovered: ['Gap Analysis & Feasibility Evaluation', 'Stakeholder Management & Conflict Resolution'],
        practicalTask: 'Solve 3 timed business analysis case scenarios addressing conflicting stakeholder goals.',
        completionCriteria: 'Demonstrate structured thinking and clear consensus-building frameworks.',
        estimatedEffort: '15 hours'
      }
    ]
  },

  // 11. Digital Marketer
  {
    title: 'Digital Marketer',
    slug: 'digital-marketer',
    category: 'Business and Management',
    description:
      'Plans, executes, and optimizes multi-channel digital growth campaigns across search (SEO/SEM), paid media, content, email automation, and conversion rate optimization (CRO).',
    responsibilities: [
      'Develop data-driven omnichannel growth marketing and customer acquisition strategies',
      'Optimize websites for search engines (technical SEO, keyword research, on-page optimization)',
      'Manage and analyze paid advertising campaigns across Google Ads, Meta Ads, and LinkedIn',
      'Design email marketing automation flows, lead nurture drip campaigns, and segmentation',
      'Analyze web traffic and conversion funnels in Google Analytics 4 (GA4) to improve ROI'
    ],
    requiredSkills: [
      {
        canonicalName: 'Search Engine Optimization (Technical & On-Page SEO)',
        normalizedName: 'seo',
        category: 'Search Marketing',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'Keyword research, meta tags, search intent, site architecture, structured data, backlink audits.'
      },
      {
        canonicalName: 'Web Analytics (Google Analytics 4 & Tag Manager)',
        normalizedName: 'ga4-analytics',
        category: 'Analytics & Attribution',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'Event tracking, conversion funnels, custom dimensions, UTM parameters, attribution models.'
      },
      {
        canonicalName: 'Paid Media Advertising (Google Ads & Meta Ads)',
        normalizedName: 'paid-ads',
        category: 'Paid Acquisition',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'Search campaigns, ad copywriting, audience targeting, bidding strategies (tCPA/tROAS), A/B testing.'
      },
      {
        canonicalName: 'Conversion Rate Optimization (CRO & Landing Page Design)',
        normalizedName: 'cro',
        category: 'Growth Marketing',
        targetLevel: 3,
        weight: 3,
        importance: 'Required',
        description: 'Call-to-action optimization, form friction reduction, value propositions, heatmaps.'
      },
      {
        canonicalName: 'Content Marketing & Copywriting',
        normalizedName: 'content-copywriting',
        category: 'Content Strategy',
        targetLevel: 4,
        weight: 2,
        importance: 'Important',
        description: 'Editorial planning, brand voice, persuasive copywriting, lead magnets, and distribution.'
      },
      {
        canonicalName: 'Email Marketing & Marketing Automation',
        normalizedName: 'email-automation',
        category: 'Retention Marketing',
        targetLevel: 3,
        weight: 2,
        importance: 'Important',
        description: 'Welcome series, re-engagement workflows, list hygiene, deliverability, and open/click optimization.'
      },
      {
        canonicalName: 'Customer Acquisition Economics (CAC, LTV, ROAS)',
        normalizedName: 'marketing-economics',
        category: 'Growth Marketing',
        targetLevel: 3,
        weight: 2,
        importance: 'Important',
        description: 'Unit economics, payback periods, blended CAC, and marketing efficiency ratios.'
      },
      {
        canonicalName: 'Social Media Strategy & Community Management',
        normalizedName: 'social-media',
        category: 'Brand Marketing',
        targetLevel: 3,
        weight: 1,
        importance: 'Optional',
        description: 'Organic platform algorithms, brand engagement, creator collaborations, and sentiment tracking.'
      }
    ],
    learningResources: [
      {
        title: 'Google Analytics 4 (GA4) Official Documentation & Skillshop',
        provider: 'Google',
        relatedSkills: ['Web Analytics (Google Analytics 4 & Tag Manager)', 'Customer Acquisition Economics (CAC, LTV, ROAS)'],
        resourceType: 'Guide',
        difficulty: 'Beginner',
        estimatedHours: 20,
        url: 'https://support.google.com/analytics/answer/10089681',
        description: 'Official setup, measurement, and event tracking guide for modern GA4 properties.'
      },
      {
        title: 'Google Search Central — SEO Starter Guide',
        provider: 'Google Search Central',
        relatedSkills: ['Search Engine Optimization (Technical & On-Page SEO)'],
        resourceType: 'Documentation',
        difficulty: 'Beginner',
        estimatedHours: 15,
        url: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide',
        description: 'The definitive search engine optimization best-practices guide directly from Google.'
      },
      {
        title: 'HubSpot Academy — Inbound & Content Marketing Certification',
        provider: 'HubSpot Academy',
        relatedSkills: ['Content Marketing & Copywriting', 'Email Marketing & Marketing Automation'],
        resourceType: 'Course',
        difficulty: 'Beginner',
        estimatedHours: 20,
        url: 'https://academy.hubspot.com/courses/inbound-marketing',
        description: 'Industry-standard training in inbound marketing methodology, lead generation, and customer funnels.'
      }
    ],
    portfolioProjects: [
      {
        projectId: 'dm-proj-01',
        title: 'Data-Informed Multi-Channel Launch Campaign & Attribution Strategy',
        description:
          'Design an acquisition campaign for a new SaaS product with landing page wireframes, UTM taxonomy, and budget allocation model.',
        difficulty: 'Intermediate',
        estimatedHours: 30,
        skillsDeveloped: [
          'Paid Media Advertising (Google Ads & Meta Ads)',
          'Web Analytics (Google Analytics 4 & Tag Manager)',
          'Customer Acquisition Economics (CAC, LTV, ROAS)'
        ],
        deliverables: [
          'Multi-channel media plan detailing ad budget allocation across Google, Meta, and LinkedIn',
          'Standardized UTM tracking taxonomy and GA4 custom event tracking schema',
          'Financial spreadsheet model simulating CAC, conversion rates, and projected ROAS'
        ],
        completionCriteria: [
          'Budget model accurately connects ad spend to target CAC and payback period',
          'Includes at least 3 distinct ad copy variations with headline and value prop testing'
        ]
      },
      {
        projectId: 'dm-proj-02',
        title: 'Technical & Content SEO Audit and Organic Growth Strategy',
        description:
          'Conduct a comprehensive SEO audit of an existing website and formulate a 6-month organic growth editorial roadmap.',
        difficulty: 'Intermediate',
        estimatedHours: 25,
        skillsDeveloped: [
          'Search Engine Optimization (Technical & On-Page SEO)',
          'Conversion Rate Optimization (CRO & Landing Page Design)',
          'Content Marketing & Copywriting'
        ],
        deliverables: [
          'Technical SEO audit covering Core Web Vitals, indexability, crawl depth, and structured data',
          'Keyword research matrix mapping search volume, keyword difficulty, and searcher intent',
          'Content cluster strategy with 10 pillar and cluster article outlines'
        ],
        completionCriteria: [
          'Prioritizes technical fixes by impact and engineering complexity',
          'Maps keywords directly to target conversion funnels (ToFu, MoFu, BoFu)'
        ]
      }
    ],
    preparationAdvice: [
      'Always connect marketing activities to bottom-line revenue (CAC and LTV) rather than vanity impressions',
      'Test hypotheses rigorously with disciplined A/B tests rather than personal intuition',
      'Master UTM parameter naming conventions and analytics attribution models from day one'
    ],
    milestonesTemplate: [
      {
        stage: 1,
        stageName: 'Foundations',
        title: 'Marketing Funnels & Web Analytics Setup',
        learningObjective: 'Master acquisition funnels, GA4 event modeling, UTM tagging, and conversion goals.',
        skillsCovered: ['Web Analytics (Google Analytics 4 & Tag Manager)', 'Customer Acquisition Economics (CAC, LTV, ROAS)'],
        practicalTask: 'Set up GA4 event tags for form submissions and button clicks via Google Tag Manager.',
        completionCriteria: 'Custom events record in GA4 debug view with correct parameter payloads.',
        estimatedEffort: '15 hours'
      },
      {
        stage: 2,
        stageName: 'Core Skills',
        title: 'Search Optimization & Content Clusters',
        learningObjective: 'Execute keyword research, analyze searcher intent, and optimize on-page schema.',
        skillsCovered: ['Search Engine Optimization (Technical & On-Page SEO)', 'Content Marketing & Copywriting'],
        practicalTask: 'Conduct keyword research and write an SEO-optimized pillar guide with schema markup.',
        completionCriteria: 'Validates on Schema.org test tool; targets high-intent commercial keywords.',
        estimatedEffort: '25 hours'
      },
      {
        stage: 3,
        stageName: 'Practical Application',
        title: 'Paid Advertising Campaigns & CRO Testing',
        learningObjective: 'Structure Google and Meta ad campaigns, author persuasive copy, and optimize landing pages.',
        skillsCovered: ['Paid Media Advertising (Google Ads & Meta Ads)', 'Conversion Rate Optimization (CRO & Landing Page Design)'],
        practicalTask: 'Design a landing page with A/B copy variations and calculate expected ROAS.',
        completionCriteria: 'Clear single value proposition; removes form friction to maximize conversion.',
        estimatedEffort: '25 hours'
      },
      {
        stage: 4,
        stageName: 'Portfolio Development',
        title: 'Omnichannel Launch Campaign Publication',
        learningObjective: 'Complete and document the Multi-Channel Launch Campaign portfolio project.',
        skillsCovered: ['Paid Media Advertising (Google Ads & Meta Ads)', 'Customer Acquisition Economics (CAC, LTV, ROAS)'],
        practicalTask: 'Compile the complete campaign plan, budget model, and UTM schema into a presentation.',
        completionCriteria: 'Presents a compelling, data-backed business case ready for client review.',
        estimatedEffort: '30 hours'
      },
      {
        stage: 5,
        stageName: 'Career Preparation',
        title: 'Marketing Certifications & Growth Case Interviews',
        learningObjective: 'Earn GA4 and Google Ads certifications and practice answering growth strategy interview prompts.',
        skillsCovered: ['Customer Acquisition Economics (CAC, LTV, ROAS)', 'Web Analytics (Google Analytics 4 & Tag Manager)'],
        practicalTask: 'Solve a growth case challenge proposing acquisition strategies for a troubled product.',
        completionCriteria: 'Demonstrate disciplined unit economics analysis and prioritized test roadmap.',
        estimatedEffort: '15 hours'
      }
    ]
  },

  // 12. Project Manager
  {
    title: 'Project Manager',
    slug: 'project-manager',
    category: 'Business and Management',
    description:
      'Leads cross-functional teams to deliver complex projects on time, within scope, and on budget by managing schedules, mitigating risks, facilitating communication, and steering Agile ceremonies.',
    responsibilities: [
      'Define project charters, work breakdown structures (WBS), timelines, and milestones',
      'Facilitate Agile/Scrum ceremonies (sprint planning, daily standups, reviews, retrospectives)',
      'Manage project budgets, resource allocation, critical path schedules, and dependencies',
      'Identify, assess, and actively mitigate project risks using formal risk registers',
      'Provide transparent progress reports, burn-down metrics, and status updates to leadership'
    ],
    requiredSkills: [
      {
        canonicalName: 'Agile & Scrum Framework Mastery',
        normalizedName: 'agile-scrum',
        category: 'Project Management',
        targetLevel: 5,
        weight: 3,
        importance: 'Required',
        description: 'Scrum ceremonies, sprint backlog grooming, velocity tracking, burn-down/burn-up charts.'
      },
      {
        canonicalName: 'Risk Management & Mitigation Planning',
        normalizedName: 'risk-management',
        category: 'Project Management',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'Risk register (probability vs impact), risk response strategies (mitigate, accept, avoid, transfer).'
      },
      {
        canonicalName: 'Schedule Management & Critical Path (Gantt)',
        normalizedName: 'schedule-critical-path',
        category: 'Project Management',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'Work breakdown structures (WBS), dependency mapping, Gantt charts, critical path calculation.'
      },
      {
        canonicalName: 'Stakeholder Communication & Status Reporting',
        normalizedName: 'stakeholder-communication',
        category: 'Communication',
        targetLevel: 4,
        weight: 3,
        importance: 'Required',
        description: 'Executive dashboards, RAG (Red/Amber/Green) status reporting, escalation paths.'
      },
      {
        canonicalName: 'Budgeting & Resource Allocation',
        normalizedName: 'budget-resource',
        category: 'Project Management',
        targetLevel: 3,
        weight: 2,
        importance: 'Important',
        description: 'Cost estimation (bottom-up, analogous), resource capacity leveling, variance analysis.'
      },
      {
        canonicalName: 'Project Management Software (Jira / Linear / Asana)',
        normalizedName: 'pm-software',
        category: 'Tooling',
        targetLevel: 4,
        weight: 2,
        importance: 'Important',
        description: 'Board configuration, workflow automation, custom fields, epic organization.'
      },
      {
        canonicalName: 'Scope Management & Change Control',
        normalizedName: 'scope-change-control',
        category: 'Project Management',
        targetLevel: 3,
        weight: 2,
        importance: 'Important',
        description: 'Preventing scope creep, managing change requests, impact assessments.'
      },
      {
        canonicalName: 'Conflict Resolution & Team Leadership',
        normalizedName: 'team-leadership',
        category: 'Leadership',
        targetLevel: 3,
        weight: 1,
        importance: 'Optional',
        description: 'Servant leadership, unblocking engineers, psychological safety, and team alignment.'
      }
    ],
    learningResources: [
      {
        title: 'Scrum Guide — The Definitive Guide to Scrum',
        provider: 'Ken Schwaber & Jeff Sutherland (Scrum.org)',
        relatedSkills: ['Agile & Scrum Framework Mastery', 'Project Management Software (Jira / Linear / Asana)'],
        resourceType: 'Guide',
        difficulty: 'Beginner',
        estimatedHours: 15,
        url: 'https://scrumguides.org/scrum-guide.html',
        description: 'The official rulebook and definition of Scrum roles, events, artifacts, and commitments.'
      },
      {
        title: 'Project Management Institute (PMI) — PMBOK Standards Guide',
        provider: 'Project Management Institute (PMI)',
        relatedSkills: ['Risk Management & Mitigation Planning', 'Schedule Management & Critical Path (Gantt)'],
        resourceType: 'Documentation',
        difficulty: 'Intermediate',
        estimatedHours: 40,
        url: 'https://www.pmi.org/pmbok-guide-standards',
        description: 'Global standard principles for predictive, hybrid, and adaptive project delivery.'
      },
      {
        title: 'Atlassian Agile Coach — Sprint Planning & Burn-Downs',
        provider: 'Atlassian',
        relatedSkills: ['Agile & Scrum Framework Mastery', 'Stakeholder Communication & Status Reporting'],
        resourceType: 'Guide',
        difficulty: 'Beginner',
        estimatedHours: 15,
        url: 'https://www.atlassian.com/agile',
        description: 'Comprehensive tutorials on story points, velocity, estimating work, and running retrospectives.'
      }
    ],
    portfolioProjects: [
      {
        projectId: 'pm-proj-01',
        title: 'Software Product Launch Plan, Schedule & Dynamic Risk Register',
        description:
          'Construct a comprehensive project management package for a high-stakes mobile app release, including Gantt schedule, RACI, and risk register.',
        difficulty: 'Intermediate',
        estimatedHours: 35,
        skillsDeveloped: [
          'Schedule Management & Critical Path (Gantt)',
          'Risk Management & Mitigation Planning',
          'Stakeholder Communication & Status Reporting'
        ],
        deliverables: [
          'Work Breakdown Structure (WBS) with task dependencies and identified critical path',
          'Dynamic risk register matrix scoring 10+ operational and technical risks with mitigation playbooks',
          'Weekly executive status report template with RAG indicators and milestone tracking'
        ],
        completionCriteria: [
          'Identifies critical path tasks where delay impacts the launch release date',
          'Every risk item contains an assigned owner, trigger indicator, and contingency plan'
        ]
      },
      {
        projectId: 'pm-proj-02',
        title: 'Agile Sprint Simulation & Team Velocity Retrospective Analysis',
        description:
          'Simulate a 4-sprint agile release cycle with velocity fluctuations, scope changes, and sprint retrospective action items.',
        difficulty: 'Beginner',
        estimatedHours: 25,
        skillsDeveloped: ['Agile & Scrum Framework Mastery', 'Scope Management & Change Control', 'Budgeting & Resource Allocation'],
        deliverables: [
          'Simulated sprint burn-down and velocity tracking charts',
          'Scope change assessment documenting impact of mid-sprint feature requests',
          'Retrospective summary report identifying continuous improvement action items'
        ],
        completionCriteria: [
          'Accurately calculates sprint velocity and forecasts remaining release timeline',
          'Demonstrates professional change control handling without demoralizing the team'
        ]
      }
    ],
    preparationAdvice: [
      'Focus on enabling and unblocking the team rather than micromanaging individual tasks',
      'Maintain an active, living risk register: predict roadblocks weeks before they halt delivery',
      'Communicate early and transparently: bad news does not age well in project delivery'
    ],
    milestonesTemplate: [
      {
        stage: 1,
        stageName: 'Foundations',
        title: 'Project Charters & Work Breakdown Structures',
        learningObjective: 'Master scope definition, WBS decomposition, and milestone establishment.',
        skillsCovered: ['Schedule Management & Critical Path (Gantt)', 'Stakeholder Communication & Status Reporting'],
        practicalTask: 'Decompose a software project into a 4-level Work Breakdown Structure.',
        completionCriteria: 'All deliverables accounted for; zero overlapping scopes between packages.',
        estimatedEffort: '15 hours'
      },
      {
        stage: 2,
        stageName: 'Core Skills',
        title: 'Agile Ceremonies & Sprint Orchestration',
        learningObjective: 'Facilitate standups, sprint planning, backlog refinement, and retrospectives.',
        skillsCovered: ['Agile & Scrum Framework Mastery', 'Project Management Software (Jira / Linear / Asana)'],
        practicalTask: 'Configure a Jira/Linear board with custom workflows, WIP limits, and epics.',
        completionCriteria: 'Configures clear issue states and transitions adhering to team definition of done.',
        estimatedEffort: '25 hours'
      },
      {
        stage: 3,
        stageName: 'Practical Application',
        title: 'Risk Registers & Critical Path Management',
        learningObjective: 'Identify dependencies, calculate critical path float, and formulate risk responses.',
        skillsCovered: ['Risk Management & Mitigation Planning', 'Scope Management & Change Control'],
        practicalTask: 'Create a risk matrix with probability/impact ratings and mitigation triggers.',
        completionCriteria: 'Assigns clear risk owners and contingency budgets.',
        estimatedEffort: '25 hours'
      },
      {
        stage: 4,
        stageName: 'Portfolio Development',
        title: 'Software Launch Plan Portfolio Publication',
        learningObjective: 'Complete and present the Software Product Launch Plan portfolio project.',
        skillsCovered: ['Schedule Management & Critical Path (Gantt)', 'Risk Management & Mitigation Planning'],
        practicalTask: 'Assemble the WBS, Gantt schedule, risk register, and executive reporting package.',
        completionCriteria: 'Professional presentation-ready project plan suitable for executive defense.',
        estimatedEffort: '35 hours'
      },
      {
        stage: 5,
        stageName: 'Career Preparation',
        title: 'CAPM / PSM I Exam Prep & Scenario Interviews',
        learningObjective: 'Prepare for Certified Associate in Project Management (CAPM) or Professional Scrum Master I.',
        skillsCovered: ['Agile & Scrum Framework Mastery', 'Conflict Resolution & Team Leadership'],
        practicalTask: 'Practice behavioral interview questions dealing with missed deadlines and scope creep.',
        completionCriteria: 'Articulate the STAR method with concrete conflict resolution examples.',
        estimatedEffort: '15 hours'
      }
    ]
  }
];
