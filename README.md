# Career & Skill-Gap Navigator

**A career-planning and skill-development platform for software engineering students.**

Career & Skill-Gap Navigator helps learners understand how their current skills compare with the requirements of a target career, identify the most important gaps, and turn those gaps into a structured learning plan. The project was developed for a **24-hour University Software Engineering Hackathon**.

> The repository may still be named `ION-FLOW`, and some internal identifiers may retain the earlier name `CareerPath AI`.

## Table of Contents

- [Overview](#overview)
- [Core Workflow](#core-workflow)
- [Features](#features)
- [Initial Career Examples](#initial-career-examples)
- [Explainable Skill-Gap Engine](#explainable-skill-gap-engine)
- [Five-Stage Learning Roadmap](#five-stage-learning-roadmap)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Development and Testing](#development-and-testing)
- [Hackathon Demo Walkthrough](#hackathon-demo-walkthrough)
- [Security Notes](#security-notes)
- [Limitations](#limitations)
- [Contributing](#contributing)

## Overview

Students often know what they have studied but are unsure which careers fit their experience, which skills employers expect, or what they should learn next. This application brings career exploration, skills assessment, gap analysis, and action planning into one workflow.

The platform is designed around **evidence-based, explainable recommendations**. It can use a resume/profile and a target role or job description as inputs, compare current proficiency with target proficiency, and organize the resulting skill gaps into a practical five-stage roadmap.

## Core Workflow

The main journey is organized into four stages:

1. **Profile & Resume** — Build a learner profile and upload a resume to extract relevant experience and skills.
2. **Skill-Gap Analysis** — Compare current skill levels with the requirements of a selected target career or job description.
3. **Job Opportunities** — Review job requirements and assess how well the current skill profile aligns with a target opportunity.
4. **Action Roadmap** — Follow a prioritized learning plan, complete milestones, and develop portfolio evidence.

A dashboard and portfolio tools support this workflow by helping learners review progress and keep track of practical work.

## Features

- **Resume-based profile building:** Extract and organize relevant experience and skills from supported resume formats.
- **Career exploration:** Start with seeded career examples and tailor the target role to the learner's interests and goals.
- **Targeted skill assessment:** Rate proficiency on a consistent 0–5 scale.
- **Transparent gap analysis:** Calculate readiness using skill completion ratios and explicit importance weights.
- **Job-description comparison:** Use a real target job description to identify relevant requirements and skill gaps.
- **Personalized five-stage roadmap:** Translate identified gaps into ordered learning stages and milestones.
- **Portfolio-oriented practice:** Connect learning goals with practical projects and evidence of completed work.
- **Progress tracking:** Review readiness and learning progress on the dashboard as data becomes available.
- **Server-side persistence:** Store application data through the Express API and MongoDB Atlas rather than connecting the browser directly to the database.
- **Authentication:** Use JWT-based authentication and password hashing with bcrypt.

*Feature availability can depend on the current deployment configuration and which optional AI services are enabled.*

## Initial Career Examples

The seed dataset includes examples across several fields. These are **starting points, not a limit on the kinds of careers a learner may pursue**.

| Area | Example career paths | Illustrative skills |
|---|---|---|
| Software Development | Frontend Developer, Backend Developer, Full-Stack Developer | HTML/CSS, JavaScript/TypeScript, React, REST APIs, databases, application architecture |
| Cybersecurity and Cloud | Cybersecurity Analyst, Cloud Engineer | Networking, SIEM analysis, incident response, vulnerability management, cloud services, containers, CI/CD |
| Data and AI | Data Analyst, Data Scientist, AI/ML Engineer | SQL, data visualization, statistics, Python, machine learning, model explainability, retrieval-augmented generation |
| Design | UI/UX Designer | User research, wireframing, design systems, Figma, accessibility |
| Business and Management | Business Analyst, Digital Marketer, Project Manager | Requirements elicitation, process modeling, analytics, SEO, Agile planning, risk and stakeholder management |

Skill requirements should be adapted to the selected role and, where available, the actual job description rather than assumed to be identical for every employer.

## Explainable Skill-Gap Engine

The scoring engine uses a deterministic, rule-based calculation so that users can understand how a readiness estimate is produced.

### Proficiency scale

| Level | Label | Meaning |
|---:|---|---|
| 0 | No experience | No practical experience with the skill yet |
| 1 | Beginner | Familiar with basic concepts |
| 2 | Basic | Can complete simple tasks with guidance |
| 3 | Intermediate | Can complete common tasks independently |
| 4 | Advanced | Can handle complex tasks and troubleshoot issues |
| 5 | Proficient | Demonstrates strong, consistent practical ability |

### Formula

For each skill with a target level greater than zero:

\[
\text{Completion Ratio}_i = \frac{\min(\text{Current Level}_i,\ \text{Target Level}_i)}{\text{Target Level}_i}
\]

The overall readiness estimate is the weighted average of skill completion ratios:

\[
\text{Readiness Score} = 100 \times \frac{\sum_i(\text{Completion Ratio}_i \times \text{Weight}_i)}{\sum_i \text{Weight}_i}
\]

### Skill importance weights

| Importance | Weight | How it is used |
|---|---:|---|
| Required | 3 | Highest priority; usually essential for the target role |
| Important | 2 | Strongly beneficial for effective job performance |
| Optional | 1 | Useful additional skill, but generally lower priority |

The score is intended to support learning decisions; it is not a guarantee of employment or a substitute for an employer's assessment.

## Five-Stage Learning Roadmap

The roadmap organizes identified gaps into five ordered stages:

1. **Foundation and Baseline** — Establish prerequisites, core concepts, tools, and a baseline assessment.
2. **Core Skill Development** — Learn the principal languages, frameworks, systems, and role-specific techniques.
3. **Applied Practice** — Reinforce skills through exercises, realistic scenarios, and problem-solving tasks.
4. **Portfolio Projects** — Build practical projects with clear deliverables and evidence that can be reviewed.
5. **Readiness Verification and Career Launch** — Reassess skills, review project evidence, prepare for interviews, and plan next career steps.

Milestones should be completed in sequence where prerequisites apply. Users should be able to track progress as they move through the roadmap.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Styling and UI | Tailwind CSS, Lucide icons, Motion |
| Charts | Recharts |
| Backend | Node.js, Express |
| Authentication | JSON Web Tokens (JWT), bcryptjs |
| Database and ODM | MongoDB Atlas, Mongoose |
| Resume processing | `pdf-parse`, `mammoth` |
| Optional AI features | Google Gemini API via `@google/genai` |

The browser communicates with the application through REST API endpoints. Database credentials and privileged operations must remain on the server.

## System Architecture

```text
┌────────────────────────────────────────┐
│       React 19 + TypeScript UI         │
│       Tailwind CSS + Recharts          │
└───────────────────┬────────────────────┘
                    │ REST API (Bearer JWT)
┌───────────────────▼────────────────────┐
│           Node.js + Express             │
│  Authentication • Resume Processing    │
│  Skill-Gap Engine • Roadmap Services    │
└───────────────────┬────────────────────┘
                    │ Mongoose ODM
┌───────────────────▼────────────────────┐
│             MongoDB Atlas               │
│         Database: careerpath_ai         │
└────────────────────────────────────────┘
```

### Deployment configuration

- **MongoDB Atlas cluster hostname:** `ionflow.skdrbqo.mongodb.net`
- **Database name:** `careerpath_ai`
- **Application name in connection string:** `IONFLOW`
- **Hosting:** The application can be deployed to a Node-compatible web service, such as Render, with environment variables configured in the hosting dashboard.

## Getting Started

### Prerequisites

- Node.js and npm compatible with the versions used by this project
- A MongoDB Atlas database, or another supported MongoDB deployment
- A Gemini API key if you want to enable optional AI-powered features
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Sardar-Shah/ION-FLOW.git
cd ION-FLOW
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create your environment file

Copy the example file:

**Windows PowerShell**

```powershell
Copy-Item .env.example .env
```

**macOS / Linux**

```bash
cp .env.example .env
```

Open `.env` and replace every placeholder with the correct local value. Do not reuse the example JWT value or commit a real `.env` file to Git.

### 4. Configure environment variables

See [Environment Variables](#environment-variables) below.

### 5. Seed initial data (when needed)

```bash
npm run seed
```

Run the seed command only against the database you intend to initialize. Confirm that the seed operation is appropriate for your data before running it against a shared or production database.

### 6. Start the application

```bash
npm run dev
```

Open `http://localhost:3000` in your browser unless your terminal reports a different port.

## Environment Variables

Create these variables in your local `.env` file and configure the same secrets in your hosting provider's environment settings.

| Variable | Required? | Purpose | Example / guidance |
|---|---|---|---|
| `MONGODB_URI` | Yes | MongoDB connection string | `mongodb+srv://<username>:<password>@ionflow.skdrbqo.mongodb.net/careerpath_ai?appName=IONFLOW` |
| `JWT_SECRET` | Yes | Signs authentication tokens | Generate a long, random, unique secret; do not use the example value |
| `PORT` | Optional | HTTP server port | `3000` locally; hosting providers may supply this automatically |
| `GEMINI_API_KEY` | Optional, for AI features | Authenticates requests to Gemini | Set a valid key privately in the environment |
| `APP_URL` | Optional / deployment-specific | Public application URL where needed | Your deployed application URL |

If the MongoDB password contains reserved URL characters, URL-encode the password before placing it in the connection string. Never paste database credentials, JWT secrets, or API keys into source code, issue reports, screenshots, or public commits.

## Database Setup

1. Create or select a MongoDB Atlas cluster.
2. Create a dedicated database user for this application with only the permissions it requires for `careerpath_ai`.
3. Add the deployed server's required outbound IP addresses or use the hosting provider's supported network configuration to allow database connectivity.
4. Put the full connection string in `MONGODB_URI` in your local `.env` file or hosting environment settings.
5. Start the application and review server logs for connection errors.
6. Run `npm run seed` only when initial seed data is needed.

**Avoid leaving Atlas Network Access set to `0.0.0.0/0` in production.** That rule permits connection attempts from any IP address; prefer the narrowest network access rule supported by your deployment. Database authorization should still be enforced with a dedicated least-privilege database user.

## Development and Testing

Available commands from `package.json`:

| Command | Purpose |
|---|---|
| `npm run dev` | Start the full-stack development server |
| `npm run start` | Start the application server |
| `npm run build` | Build the frontend for production |
| `npm run lint` | Run the TypeScript compiler check (`tsc --noEmit`) |
| `npm run seed` | Run the database seed script |
| `npm run preview` | Preview the built frontend with Vite |

If the repository includes the gap-analysis engine test file, run it with:

```bash
npx tsx tests/gapAnalysisEngine.test.ts
```

Before deploying a change, run the relevant checks and manually verify the main user journey with the same environment configuration used by the target deployment.

## Hackathon Demo Walkthrough

Use the demo account/profile provided by the current deployment. If the demo option is available, the following sequence demonstrates the main journey:

1. **Sign in / Demo** — Select the available demonstration profile, such as Jane Doe (Cybersecurity Analyst), if configured.
2. **Profile & Resume** — Review the sample profile and resume-derived skills.
3. **Career Explorer** — Explore the seeded career examples and select a target role.
4. **Skills & Assessment** — Set proficiency ratings using the 0–5 scale.
5. **Skill-Gap Analysis** — Review the readiness estimate, weights, and skill-by-skill gaps.
6. **Job Opportunities** — Compare the learner profile with a target job description when this workflow is available.
7. **Action Roadmap** — Review the five stages and update milestone statuses.
8. **Portfolio** — Inspect the available project suggestions or record practical project evidence.
9. **Dashboard** — Return to the dashboard to review saved progress and updated metrics.

Demo profiles and seeded records are demonstration data, not production user data. Results depend on the database contents and services configured for the current deployment.

## Security Notes

- Keep `.env` out of version control; commit only sanitized examples such as `.env.example`.
- Replace all example secrets with unique, randomly generated values.
- Keep the MongoDB URI and AI API keys on the server; never expose them in browser code.
- Use a database user with the minimum permissions needed by the application.
- Restrict database network access instead of leaving the cluster accessible from all IPs.
- Use HTTPS in deployed environments and set production secrets through the host's secret/environment configuration.
- Before production use, review authentication, authorization, upload validation, rate limiting, error handling, logging, and dependency updates.

## Limitations

This project was built in a time-constrained hackathon setting. AI-powered behavior may require a valid Gemini API key, while dashboard values, demo profiles, and career options depend on available database records. Resume extraction quality can vary by file structure and formatting. Readiness scores are directional learning aids and should not be interpreted as a formal certification or a guarantee of hiring outcomes.

## Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make a focused change and add tests where appropriate.
4. Run the relevant checks locally.
5. Open a pull request describing the change and how it was verified.

Please do not include API keys, connection strings, personal resumes, or other sensitive information in commits or pull requests.

---

**Project repository:** [Sardar-Shah/ION-FLOW](https://github.com/Sardar-Shah/ION-FLOW)
