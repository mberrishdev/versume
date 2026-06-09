import { CV } from "@/types/cv";
import { v4 as uuidv4 } from "uuid";

export function createEmptyCV(name = "My CV"): CV {
  const now = new Date().toISOString();
  return {
    meta: { id: uuidv4(), name, createdAt: now, updatedAt: now },
    personal: {
      name: "",
      title: "",
      email: "",
      phone: "",
      linkedin: "",
      website: "",
    },
    summary: "",
    experience: [],
    projects: [],
    education: [],
    skills: {
      languages: "",
      architecture: "",
      databases: "",
      cloud: "",
      apis: "",
      testing: "",
      versionControl: "",
    },
    languages: [],
  };
}

export const MIKHEIL_CV: CV = {
  meta: {
    id: "mikheil-default",
    name: "default",
    createdAt: "2025-08-01T00:00:00.000Z",
    updatedAt: "2025-08-01T00:00:00.000Z",
  },
  personal: {
    name: "Mikheil Berishvili",
    title: "Software Developer",
    email: "Mikheil.berishvili@outlook.com",
    phone: "+995 591 300 569",
    linkedin: "linkedin.com/mberrish",
    website: "mberrishdev.me",
  },
  summary:
    "Detail-oriented software developer with experience in building robust, scalable, and high-performance systems, and leading product development, expert in C# and .NET Core technologies. My key achievements include developing core systems for commercial and exchange rate management at TBC Bank, and creating EasyDine, a restaurant SaaS system for managing reservations, which enhanced user engagement.",
  experience: [
    {
      id: uuidv4(),
      company: "TBC Bank",
      role: "Software Developer",
      location: "Tbilisi, Georgia",
      period: "May 2021 - Present",
      description:
        "Contributed to the development of multiple high-impact internal systems and customer-facing platforms across online banking, mobile apps, and branch services",
      bullets: [
        "Developed Deal Transactions Portal (.NET 8, SQL Server) enabling customers to request exchange rates with automated/manual validation across channels.",
        "Optimized Rate Engine performance (SignalR, Redis, RabbitMQ, SQL Server) to reliably handle high-volume financial transactions.",
        "Created Jira API Automation Tool, reducing project management time by 30%.",
        "Contributed to reusable internal company libraries, including RabbitMQ idempotency checkers and common templates.",
        "Implemented GraphQL APIs, reducing query times by 40% and enabling real-time personalized data delivery.",
        "Maintained high-quality standards by writing comprehensive unit and integration tests, and following DDD, CQRS, and Clean Architecture principles.",
      ],
    },
    {
      id: uuidv4(),
      company: "Proxima Solutions",
      role: "Software Developer",
      location: "Tbilisi, Georgia",
      period: "Jul 2020 - May 2021",
      description:
        "Customized Microsoft Dynamics AX 2012 ERP modules using X++ and .NET Framework to improve adaptability for diverse client processes.",
      bullets: [],
    },
    {
      id: uuidv4(),
      company: "SmartSoft Gaming",
      role: "Software Developer",
      location: "Tbilisi, Georgia",
      period: "May 2019 - Jul 2020",
      description: "",
      bullets: [
        "Built cross-platform gaming applications using C#, .NET Core, ASP.NET Core MVC, React, Pixi.js.",
        "Integrated SignalR and SQL Server for real-time gameplay synchronization.",
        "Managed CI/CD pipelines in Azure DevOps, halving deployment times and ensuring zero downtime.",
      ],
    },
  ],
  projects: [
    {
      id: uuidv4(),
      category: "Product & SaaS Solutions",
      name: "EasyDine",
      role: "Founder",
      description:
        "Designed and launched a SaaS restaurant reservation system with .NET 8, React, Next.js, Azure/AWS cloud, RabbitMQ, and AWS S3. Delivered real-time booking updates and improved customer retention.",
      links: [],
    },
    {
      id: uuidv4(),
      category: "Product & SaaS Solutions",
      name: "TopWork",
      role: "CTO & Developer",
      description:
        "Built a freelance portal on .NET Core & SQL Server with Azure Blob Storage and secure payment integration.",
      links: [],
    },
    {
      id: uuidv4(),
      category: "Developer Tools & Open Source",
      name: "dct (.NET CLI Tool)",
      role: "Creator",
      description:
        "Created a global CLI for generating CQRS/Clean Architecture components, improving developer productivity.",
      links: [
        { label: "NuGet", url: "" },
        { label: "GitHub", url: "" },
      ],
    },
    {
      id: uuidv4(),
      category: "Developer Tools & Open Source",
      name: "HubDocs",
      role: "Creator",
      description:
        "Built a Swagger-like UI for discovering and documenting SignalR hubs in ASP.NET Core apps.",
      links: [
        { label: "Live", url: "" },
        { label: "GitHub", url: "" },
        { label: "NuGet", url: "" },
      ],
    },
    {
      id: uuidv4(),
      category: "Real-Time & Interactive Applications",
      name: "Fruit Ninja - Multiplayer Game",
      role: "Developer",
      description:
        "Developed a NestJS + Pixi.js multiplayer game with live leaderboards, real-time slicing mechanics, and responsive UI.",
      links: [
        { label: "Live", url: "" },
        { label: "GitHub", url: "" },
      ],
    },
    {
      id: uuidv4(),
      category: "Web Applications",
      name: "RepoPulse",
      role: "Creator",
      description:
        "Created a DevOps dashboard for monitoring CI/CD pipelines and Renovate PRs across Azure DevOps.",
      links: [
        { label: "Live", url: "" },
        { label: "GitHub", url: "" },
      ],
    },
    {
      id: uuidv4(),
      category: "Web Applications",
      name: "SpendWise",
      role: "Creator",
      description:
        "Built a personal finance tracker with React, TypeScript, and Firebase authentication/storage.",
      links: [
        { label: "Live", url: "" },
        { label: "GitHub", url: "" },
      ],
    },
  ],
  education: [
    {
      id: uuidv4(),
      institution: "Business and Technology University",
      location: "Tbilisi, Georgia",
      period: "Sep 2024 - Present",
      degree: "Master's degree of Information Systems - DevOps",
    },
    {
      id: uuidv4(),
      institution: "Caucasus University",
      location: "Tbilisi, Georgia",
      period: "Sep 2020 - Jun 2024",
      degree: "Bachelor's degree of computer engineering",
    },
    {
      id: uuidv4(),
      institution: "IPCB - Politécnico de Castelo Branco",
      location: "Castelo Branco, Portugal",
      period: "Feb 2023 - Jul 2024",
      degree: "Bachelor's degree of computer engineering",
    },
  ],
  skills: {
    languages: "C#, ASP.NET Core, .NET 8/9, JS, TS, React, Next.js, Entity Framework Core",
    architecture:
      "Domain-Driven Design (DDD), CQRS, Microservices, Event-Driven Architecture, Clean Architecture, Cloud-Native Design",
    databases:
      "SQL Server, PostgreSQL, MySQL, Elasticsearch, RabbitMQ, Kafka, Redis, Azure Blob, AWS S3",
    cloud:
      "Azure, AWS, Docker, Kubernetes, CI/CD (Azure DevOps, GitHub Actions, GitLab CI), Infrastructure as Code (Terraform, Bicep), Monitoring & Logging (Prometheus, Grafana, ELK stack)",
    apis: "REST, GraphQL, API Gateway, JWT, OAuth2, OpenID Connect",
    testing:
      "xUnit, FluentAssertions, TDD, Integration Testing, Performance Optimization & Profiling",
    versionControl: "Git, SVN",
  },
  languages: [
    { id: uuidv4(), name: "Georgian", level: "Native" },
    { id: uuidv4(), name: "English", level: "Fluent" },
  ],
};
