# CareerPath AI — Career and Skill-Gap Navigator

A production-grade, full-stack web application designed for university software engineering students to explore career trajectories, self-assess technical competencies, analyze skill gaps against industry requirements, generate 5-stage personalized learning roadmaps, build verifiable portfolio projects, and track progression over time.

Built for a 24-hour University Software Engineering Hackathon.

---

## 1. System Architecture

```
┌─────────────────────────────────┐
│     React 19 + TypeScript       │
│  Tailwind CSS + Recharts UI     │
└────────────────┬────────────────┘
                 │  REST API calls (Bearer JWT)
┌────────────────▼────────────────┐
│      Node.js + Express API      │
│  - JWT & Bcrypt Authentication  │
│  - Deterministic Gap Engine     │
│  - 5-Stage Roadmap Generator    │
└────────────────┬────────────────┘
                 │  Mongoose ODM
┌────────────────▼────────────────┐
│      MongoDB Atlas Cluster      │
│   ionflow.skdrbqo.mongodb.net   │
│     Database: careerpath_ai     │
└─────────────────────────────────┘
```

The frontend never connects directly to the database. All authentication, credential hashing, gap analysis math, and milestone status persistence occur strictly on the server.

---

## 2. MongoDB Atlas Configuration

The application is architected specifically for your existing MongoDB Atlas deployment:

- **Cluster Hostname:** `ionflow.skdrbqo.mongodb.net`
- **Application Database:** `careerpath_ai`
- **Application Name:** `IONFLOW`
- **ODM:** Mongoose

### Connection String Format

```env
MONGODB_URI="mongodb+srv://<DB_USERNAME>:<NEW_PASSWORD>@ionflow.skdrbqo.mongodb.net/careerpath_ai?appName=IONFLOW"
```

### Configuration Instructions in Google AI Studio
1. Open the **Secrets** panel in the AI Studio settings.
2. Add a new secret named `MONGODB_URI`.
3. Set the value to your connection string with your MongoDB database username and password properly URL-encoded.
4. In your MongoDB Atlas web console, ensure **Network Access** includes `0.0.0.0/0` (Allow access from anywhere) so that Google AI Studio / Cloud Run serverless instances can reach the cluster.
5. In the app header, click **DB Setup** / **Atlas Online** at any time to inspect live diagnostics and trigger idempotent seeding.

---

## 3. The 12 Initial Career Paths

The system comes pre-seeded with 12 comprehensive career pathways:

### Software Development
1. **Frontend Developer** — Responsive UI, DOM performance, React, semantic HTML5/CSS3, TypeScript, Web Accessibility.
2. **Backend Developer** — Node.js/Express, database indexing, REST APIs, authentication security, Redis caching.
3. **Full-Stack Developer** — End-to-end TypeScript, client state, server routing, MongoDB modeling, DevOps.

### Cybersecurity and Cloud
4. **Cybersecurity Analyst** — Network protocols, SIEM log analysis, MITRE ATT&CK, incident response, vulnerability management.
5. **Cloud Engineer** — AWS/GCP, Infrastructure as Code (Terraform), Docker containers, CI/CD pipelines, observability.

### Data and Artificial Intelligence
6. **Data Analyst** — Advanced SQL window functions, Power BI visualization, Pandas EDA, business KPI formulation.
7. **Data Scientist** — Statistical inference, Scikit-Learn algorithms, feature engineering, SHAP model explainability.
8. **AI/ML Engineer** — PyTorch deep learning, Transformer architectures, RAG vector search, FastAPI model serving.

### Design
9. **UI/UX Designer** — Figma auto-layout, user research, wireframing, design systems, WCAG 2.2 accessibility.

### Business and Management
10. **Business Analyst** — Requirements elicitation, BPMN 2.0 process modeling, agile user stories (Gherkin), gap analysis.
11. **Digital Marketer** — Technical SEO, Google Analytics 4, paid media advertising, CRO, CAC/LTV economics.
12. **Project Manager** — Agile/Scrum ceremonies, risk registers, critical path Gantt scheduling, stakeholder communication.

---

## 4. Explainable Skill-Gap Formula

The scoring engine is completely deterministic, rule-based, and explainable:

1. **Proficiency Scale (0–5):**
   - Level 0: No experience
   - Level 1: Beginner
   - Level 2: Basic
   - Level 3: Intermediate
   - Level 4: Advanced
   - Level 5: Proficient

2. **Skill Completion Ratio:**
   $$\text{Skill Completion} = \frac{\min(\text{Current Level}, \text{Target Level})}{\text{Target Level}}$$

3. **Readiness Score Calculation:**
   $$\text{Readiness Score} = 100 \times \frac{\sum(\text{Skill Completion} \times \text{Weight})}{\sum(\text{Applicable Weights})}$$

4. **Skill Importance Weights:**
   - **Required:** Weight 3
   - **Important:** Weight 2
   - **Optional:** Weight 1

---

## 5. 5-Stage Personalized Roadmap

Roadmaps dynamically prioritize identified skill gaps into 5 stages:
1. **Foundations** — Core language primitives, theoretical models, and environments.
2. **Core Skills** — Primary frameworks, database operations, and system protocols.
3. **Practical Application** — Applied exercises, architecture patterns, and security hardening.
4. **Portfolio Development** — End-to-end deployable capstone projects with verification criteria.
5. **Career Preparation** — Technical interview challenges, architecture defense, and certifications.

---

## 6. Development & Testing Commands

```bash
# Install dependencies
npm install

# Run automated unit tests for skill-gap math
npx tsx tests/gapAnalysisEngine.test.ts

# Run idempotent database seed script
npm run seed

# Start full-stack development server (Express API + Vite)
npm run dev

# Build production bundle
npm run build
```

---

## 7. Hackathon Demo Walkthrough Scenario

To demonstrate all features during the hackathon evaluation:
1. Click **Sign In / Demo** in the top navigation.
2. Choose **Jane Doe (Cybersecurity Analyst)** for an instant demo profile.
3. Navigate to **Career Explorer** and inspect the 12 pre-seeded careers.
4. Select **Cybersecurity Analyst** as the target career.
5. Switch to **Skills & Assessment** and adjust ratings using the quick checklist.
6. Open **Skill-Gap Engine** to view the live recalculated readiness score and transparent formula breakdown.
7. Open **Learning Roadmap** to review the 5-stage personalized roadmap. Toggle milestone statuses (e.g., mark a milestone *Completed*).
8. Visit **Portfolio & Resources** to review the practical SOC log investigation project and official NIST/OWASP documentation links.
9. Return to **Dashboard** to see the updated readiness score, progress charts, and recent activity timeline.
