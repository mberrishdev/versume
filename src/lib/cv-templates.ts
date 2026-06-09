import { CV } from "@/types/cv";
import { v4 as uuidv4 } from "uuid";

export interface CVTemplate {
  id: string;
  label: string;
  role: string;
  tags: string[];
  build: (name: string) => CV;
}

function base(name: string): CV {
  const now = new Date().toISOString();
  return {
    meta: { id: uuidv4(), name, createdAt: now, updatedAt: now },
    personal: { name: "", title: "", email: "", phone: "", linkedin: "", website: "" },
    summary: "",
    experience: [],
    projects: [],
    education: [],
    skills: { languages: "", architecture: "", databases: "", cloud: "", apis: "", testing: "", versionControl: "" },
    languages: [],
  };
}

export const CV_TEMPLATES: CVTemplate[] = [
  {
    id: "backend-engineer",
    label: "Backend Engineer",
    role: "Server-side & APIs",
    tags: ["Node.js", "Go", "APIs"],
    build: (name) => ({
      ...base(name),
      personal: { name: "Your Name", title: "Senior Backend Engineer", email: "you@email.com", phone: "", linkedin: "linkedin.com/in/yourname", website: "" },
      summary: "Backend engineer with 5+ years building scalable APIs and distributed systems. Focused on clean architecture, performance, and reliability at scale.",
      experience: [
        {
          id: uuidv4(), company: "Acme Corp", role: "Senior Backend Engineer",
          location: "Remote", period: "Jan 2022 – Present", description: "Lead backend development for the core platform serving 2M+ users.",
          bullets: [
            "Designed and built REST & GraphQL APIs consumed by web and mobile clients.",
            "Reduced p99 API latency by 60% through query optimization and caching layers.",
            "Architected event-driven microservices using Kafka for async processing.",
          ],
        },
        {
          id: uuidv4(), company: "StartupXYZ", role: "Backend Engineer",
          location: "New York, NY", period: "Jun 2019 – Dec 2021", description: "Built the backend from scratch for a fintech product.",
          bullets: [
            "Implemented OAuth2 authentication and role-based access control.",
            "Integrated third-party payment providers with idempotent retry logic.",
          ],
        },
      ],
      education: [{ id: uuidv4(), institution: "State University", location: "New York, NY", period: "2015 – 2019", degree: "B.S. Computer Science" }],
      skills: {
        languages: "Go, Node.js, TypeScript, Python",
        architecture: "Microservices, Event-Driven, Domain-Driven Design, Clean Architecture",
        databases: "PostgreSQL, Redis, MongoDB, Kafka, Elasticsearch",
        cloud: "AWS (ECS, RDS, S3, SQS), Docker, Kubernetes, Terraform, GitHub Actions",
        apis: "REST, GraphQL, gRPC, Webhooks, JWT, OAuth2",
        testing: "Unit Testing, Integration Testing, Load Testing (k6), TDD",
        versionControl: "Git, GitHub",
      },
      languages: [{ id: uuidv4(), name: "English", level: "Native" }],
    }),
  },
  {
    id: "frontend-developer",
    label: "Frontend Developer",
    role: "UI & Web Interfaces",
    tags: ["React", "TypeScript", "CSS"],
    build: (name) => ({
      ...base(name),
      personal: { name: "Your Name", title: "Frontend Developer", email: "you@email.com", phone: "", linkedin: "linkedin.com/in/yourname", website: "yourportfolio.dev" },
      summary: "Frontend developer specialising in React and TypeScript. Passionate about pixel-perfect UI, accessibility, and fast user experiences.",
      experience: [
        {
          id: uuidv4(), company: "Product Co", role: "Frontend Developer",
          location: "Remote", period: "Mar 2021 – Present", description: "Own the design system and core web app used by 500k+ monthly active users.",
          bullets: [
            "Built and maintained a component library used across 4 product teams.",
            "Improved Core Web Vitals (LCP < 1.2s, CLS < 0.05) through code splitting and lazy loading.",
            "Implemented complex data visualisations using D3.js and Recharts.",
          ],
        },
        {
          id: uuidv4(), company: "Agency Inc", role: "Junior Frontend Developer",
          location: "London, UK", period: "Sep 2019 – Feb 2021", description: "Delivered client websites and SPAs on tight timelines.",
          bullets: [
            "Developed responsive landing pages with WCAG 2.1 AA accessibility compliance.",
            "Integrated CMS platforms (Contentful, Sanity) with Next.js frontends.",
          ],
        },
      ],
      education: [{ id: uuidv4(), institution: "City College", location: "London, UK", period: "2016 – 2019", degree: "B.Sc. Software Engineering" }],
      skills: {
        languages: "TypeScript, JavaScript, React, Next.js, CSS/SCSS, HTML",
        architecture: "Component-Driven Development, Micro-frontends, Atomic Design",
        databases: "REST APIs, GraphQL (Apollo), Firebase, Supabase",
        cloud: "Vercel, Netlify, AWS S3/CloudFront, Docker",
        apis: "REST, GraphQL, WebSockets",
        testing: "Jest, React Testing Library, Cypress, Storybook, Visual Regression Testing",
        versionControl: "Git, GitHub, GitLab",
      },
      languages: [{ id: uuidv4(), name: "English", level: "Native" }],
    }),
  },
  {
    id: "fullstack-developer",
    label: "Full-Stack Developer",
    role: "End-to-end product",
    tags: ["React", "Node.js", "DB"],
    build: (name) => ({
      ...base(name),
      personal: { name: "Your Name", title: "Full-Stack Developer", email: "you@email.com", phone: "", linkedin: "linkedin.com/in/yourname", website: "" },
      summary: "Full-stack developer building end-to-end web products with React and Node.js. Comfortable owning features from database schema to UI.",
      experience: [
        {
          id: uuidv4(), company: "Growth Startup", role: "Full-Stack Developer",
          location: "Berlin, Germany", period: "Aug 2021 – Present", description: "One of three engineers on a B2B SaaS platform.",
          bullets: [
            "Built multi-tenant billing system integrated with Stripe, handling €1M+ MRR.",
            "Designed PostgreSQL schema and ORM layer with Prisma for complex relational data.",
            "Created React dashboard with real-time updates via WebSocket.",
          ],
        },
        {
          id: uuidv4(), company: "Consultancy Ltd", role: "Software Developer",
          location: "Berlin, Germany", period: "Jan 2020 – Jul 2021", description: "Delivered bespoke web applications for SME clients.",
          bullets: [
            "Built REST APIs in Express.js, deployed on AWS Lambda with API Gateway.",
            "Developed admin dashboards with role-based access using Next.js and NextAuth.",
          ],
        },
      ],
      projects: [
        {
          id: uuidv4(), category: "Side Projects", name: "OpenRecipe",
          role: "Creator", description: "Recipe sharing platform with AI-generated meal plans. Built with Next.js, tRPC, and PostgreSQL.",
          links: [{ label: "GitHub", url: "" }],
        },
      ],
      education: [{ id: uuidv4(), institution: "Technical University", location: "Berlin, Germany", period: "2016 – 2020", degree: "B.Sc. Computer Science" }],
      skills: {
        languages: "TypeScript, JavaScript, React, Next.js, Node.js, SQL",
        architecture: "REST APIs, tRPC, MVC, Domain-Driven Design",
        databases: "PostgreSQL, Redis, Prisma ORM, Supabase",
        cloud: "AWS, Vercel, Docker, GitHub Actions",
        apis: "REST, tRPC, GraphQL, Stripe, OAuth2",
        testing: "Jest, Vitest, Playwright, React Testing Library",
        versionControl: "Git, GitHub",
      },
      languages: [{ id: uuidv4(), name: "English", level: "Fluent" }],
    }),
  },
  {
    id: "devops-engineer",
    label: "DevOps / Platform",
    role: "Infrastructure & CI/CD",
    tags: ["Kubernetes", "Terraform", "AWS"],
    build: (name) => ({
      ...base(name),
      personal: { name: "Your Name", title: "Platform Engineer", email: "you@email.com", phone: "", linkedin: "linkedin.com/in/yourname", website: "" },
      summary: "Platform engineer with expertise in cloud infrastructure, Kubernetes, and developer tooling. Focused on reliability, automation, and fast feedback loops.",
      experience: [
        {
          id: uuidv4(), company: "CloudNative Inc", role: "Senior Platform Engineer",
          location: "Remote", period: "Feb 2022 – Present", description: "Own the internal developer platform used by 60+ engineers.",
          bullets: [
            "Migrated 40+ microservices from EC2 to EKS, reducing infrastructure cost by 35%.",
            "Built self-service deployment platform using Backstage, Argo CD, and Terraform.",
            "Implemented observability stack (Prometheus, Grafana, OpenTelemetry) with SLO alerting.",
          ],
        },
        {
          id: uuidv4(), company: "FinServe Ltd", role: "DevOps Engineer",
          location: "London, UK", period: "Sep 2019 – Jan 2022", description: "Managed CI/CD pipelines and cloud infrastructure for a regulated financial platform.",
          bullets: [
            "Designed GitOps workflow with GitHub Actions and ArgoCD, cutting deployment time by 50%.",
            "Maintained 99.95% uptime SLA through proactive capacity planning and runbook automation.",
          ],
        },
      ],
      education: [{ id: uuidv4(), institution: "University of Technology", location: "London, UK", period: "2015 – 2019", degree: "B.Eng. Computer Systems" }],
      skills: {
        languages: "Python, Bash, Go, HCL (Terraform)",
        architecture: "GitOps, Infrastructure as Code, SRE Practices, Observability",
        databases: "PostgreSQL, Redis, InfluxDB",
        cloud: "AWS, GCP, Kubernetes (EKS/GKE), Terraform, Helm, Argo CD, GitHub Actions, GitLab CI",
        apis: "REST, gRPC, Prometheus Remote Write",
        testing: "Terratest, Integration Testing, Chaos Engineering (Litmus)",
        versionControl: "Git, GitHub, GitLab",
      },
      languages: [{ id: uuidv4(), name: "English", level: "Native" }],
    }),
  },
  {
    id: "data-scientist",
    label: "Data Scientist",
    role: "ML & Analytics",
    tags: ["Python", "ML", "SQL"],
    build: (name) => ({
      ...base(name),
      personal: { name: "Your Name", title: "Data Scientist", email: "you@email.com", phone: "", linkedin: "linkedin.com/in/yourname", website: "" },
      summary: "Data scientist with experience in building and deploying ML models for product and operations use cases. Strong in Python, statistical modelling, and communicating insights to stakeholders.",
      experience: [
        {
          id: uuidv4(), company: "Retail Analytics Co", role: "Data Scientist",
          location: "Amsterdam, Netherlands", period: "Jan 2022 – Present", description: "Embedded data scientist in the growth and personalisation team.",
          bullets: [
            "Built recommendation engine (matrix factorisation + contextual bandit) increasing CTR by 22%.",
            "Developed churn prediction model with 89% recall, enabling proactive retention campaigns.",
            "Created automated A/B testing framework reducing experiment setup time by 70%.",
          ],
        },
        {
          id: uuidv4(), company: "Consulting Firm", role: "Data Analyst",
          location: "Amsterdam, Netherlands", period: "Jul 2020 – Dec 2021", description: "Delivered insights and dashboards for FMCG clients.",
          bullets: [
            "Built SQL-based ETL pipelines processing 50GB+ daily transaction data.",
            "Produced executive dashboards in Looker tracking KPIs for 3 business units.",
          ],
        },
      ],
      education: [
        { id: uuidv4(), institution: "University of Amsterdam", location: "Amsterdam, Netherlands", period: "2018 – 2020", degree: "M.Sc. Artificial Intelligence" },
        { id: uuidv4(), institution: "TU Delft", location: "Delft, Netherlands", period: "2014 – 2018", degree: "B.Sc. Applied Mathematics" },
      ],
      skills: {
        languages: "Python (pandas, scikit-learn, PyTorch, statsmodels), R, SQL",
        architecture: "ML Pipelines, Feature Engineering, Experiment Design, A/B Testing",
        databases: "PostgreSQL, BigQuery, Snowflake, dbt, Airflow",
        cloud: "AWS SageMaker, GCP Vertex AI, Docker, MLflow",
        apis: "REST APIs, Streamlit, FastAPI",
        testing: "pytest, Great Expectations, Data Validation",
        versionControl: "Git, DVC (Data Version Control)",
      },
      languages: [{ id: uuidv4(), name: "English", level: "Fluent" }, { id: uuidv4(), name: "Dutch", level: "Conversational" }],
    }),
  },
  {
    id: "product-manager",
    label: "Product Manager",
    role: "Product & Strategy",
    tags: ["Roadmap", "Agile", "Growth"],
    build: (name) => ({
      ...base(name),
      personal: { name: "Your Name", title: "Product Manager", email: "you@email.com", phone: "", linkedin: "linkedin.com/in/yourname", website: "" },
      summary: "Product manager with 5 years of experience shipping consumer and B2B products. Skilled at bridging user research, engineering constraints, and business goals to build products people love.",
      experience: [
        {
          id: uuidv4(), company: "SaaS Platform", role: "Senior Product Manager",
          location: "San Francisco, CA", period: "Mar 2021 – Present", description: "PM for the core collaboration product used by 100k+ teams.",
          bullets: [
            "Led 0→1 launch of real-time commenting feature, achieving 40% adoption in 60 days.",
            "Managed roadmap prioritisation across 5 engineering squads using RICE scoring.",
            "Ran 20+ user interviews and usability tests to inform quarterly planning.",
          ],
        },
        {
          id: uuidv4(), company: "E-commerce Co", role: "Product Manager",
          location: "New York, NY", period: "Jul 2018 – Feb 2021", description: "Owned checkout and payments product for $200M GMV platform.",
          bullets: [
            "Reduced checkout abandonment by 18% through A/B-tested UX improvements.",
            "Launched buy-now-pay-later integration increasing AOV by 25%.",
          ],
        },
      ],
      education: [{ id: uuidv4(), institution: "Wharton School, UPenn", location: "Philadelphia, PA", period: "2014 – 2018", degree: "B.S. Economics & Information Systems" }],
      skills: {
        languages: "SQL, basic Python for data analysis",
        architecture: "Agile/Scrum, OKRs, Jobs-to-be-Done, Product-Led Growth",
        databases: "Amplitude, Mixpanel, Looker, dbt",
        cloud: "Jira, Linear, Notion, Figma, Miro",
        apis: "API fluency for technical stakeholder discussions",
        testing: "A/B Testing, Feature Flags, Hypothesis-Driven Development",
        versionControl: "Git (comfortable reviewer)",
      },
      languages: [{ id: uuidv4(), name: "English", level: "Native" }],
    }),
  },
  {
    id: "ux-designer",
    label: "UX / Product Designer",
    role: "Design & Research",
    tags: ["Figma", "UX", "Research"],
    build: (name) => ({
      ...base(name),
      personal: { name: "Your Name", title: "Product Designer", email: "you@email.com", phone: "", linkedin: "linkedin.com/in/yourname", website: "yourdesignportfolio.com" },
      summary: "Product designer with a user research background. I create clear, inclusive interfaces backed by real user insight — from early discovery through to shipped features.",
      experience: [
        {
          id: uuidv4(), company: "Digital Product Studio", role: "Senior Product Designer",
          location: "London, UK", period: "Apr 2021 – Present", description: "Lead designer across 3 client products in fintech and healthtech.",
          bullets: [
            "Ran end-to-end discovery and design for a patient scheduling app, increasing booking completion by 34%.",
            "Created and maintained design system of 200+ components in Figma, used by 4 engineering teams.",
            "Facilitated weekly design critiques and cross-functional design reviews.",
          ],
        },
        {
          id: uuidv4(), company: "Agency XYZ", role: "UX Designer",
          location: "London, UK", period: "Sep 2018 – Mar 2021", description: "UX design and research for web and mobile projects.",
          bullets: [
            "Conducted 50+ moderated user interviews and synthesised insights into actionable recommendations.",
            "Delivered high-fidelity prototypes for usability testing using Figma and ProtoPie.",
          ],
        },
      ],
      projects: [
        {
          id: uuidv4(), category: "Case Studies", name: "Fintech Onboarding Redesign",
          role: "Lead Designer", description: "End-to-end redesign of KYC onboarding flow, reducing drop-off from 42% to 18%.",
          links: [{ label: "Case Study", url: "" }],
        },
      ],
      education: [{ id: uuidv4(), institution: "Royal College of Art", location: "London, UK", period: "2016 – 2018", degree: "M.A. Interaction Design" }],
      skills: {
        languages: "Figma, Sketch, Adobe XD, ProtoPie, Framer",
        architecture: "Design Systems, Atomic Design, Accessibility (WCAG), Design Thinking",
        databases: "UserTesting, Maze, Hotjar, Amplitude",
        cloud: "Notion, Jira, Miro, Zeroheight",
        apis: "HTML/CSS fundamentals, Familiar with REST API concepts",
        testing: "Moderated & unmoderated usability testing, A/B testing, Card Sorting",
        versionControl: "Git (basic), Abstract, Figma branching",
      },
      languages: [{ id: uuidv4(), name: "English", level: "Native" }],
    }),
  },
  {
    id: "recent-graduate",
    label: "Recent Graduate",
    role: "Entry level · Any field",
    tags: ["Projects", "Internship", "CS"],
    build: (name) => ({
      ...base(name),
      personal: { name: "Your Name", title: "Software Engineer", email: "you@email.com", phone: "", linkedin: "linkedin.com/in/yourname", website: "github.com/yourname" },
      summary: "Computer science graduate passionate about building impactful software. Strong foundations in algorithms, system design, and modern web technologies. Looking for my first full-time engineering role.",
      experience: [
        {
          id: uuidv4(), company: "Tech Company", role: "Software Engineering Intern",
          location: "Remote", period: "Jun 2024 – Aug 2024", description: "Summer internship on the platform engineering team.",
          bullets: [
            "Built an internal CLI tool in Go that automated repetitive deployment tasks, saving the team ~3 hours/week.",
            "Contributed bug fixes and tests to the core Python service (10+ merged PRs).",
          ],
        },
      ],
      projects: [
        {
          id: uuidv4(), category: "Personal Projects", name: "DevTask",
          role: "Creator", description: "Terminal-based task manager built in Rust. Supports tags, priorities, and local persistence.",
          links: [{ label: "GitHub", url: "" }],
        },
        {
          id: uuidv4(), category: "Personal Projects", name: "Campus Connect",
          role: "Developer", description: "Final year project — event discovery platform for university students. React + Node.js + PostgreSQL, deployed on AWS.",
          links: [{ label: "GitHub", url: "" }, { label: "Demo", url: "" }],
        },
      ],
      education: [
        {
          id: uuidv4(), institution: "University of Edinburgh", location: "Edinburgh, UK",
          period: "2020 – 2024", degree: "B.Sc. Computer Science (First Class Honours)",
        },
      ],
      skills: {
        languages: "Python, TypeScript, JavaScript, React, Node.js, Java, SQL, Rust (learning)",
        architecture: "REST APIs, MVC, Agile/Scrum",
        databases: "PostgreSQL, SQLite, Firebase, Redis (basic)",
        cloud: "AWS (EC2, S3 basics), Docker, GitHub Actions",
        apis: "REST, basic GraphQL, JWT",
        testing: "pytest, Jest, unit testing fundamentals",
        versionControl: "Git, GitHub",
      },
      languages: [{ id: uuidv4(), name: "English", level: "Native" }],
    }),
  },
];
