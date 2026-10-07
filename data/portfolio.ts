export interface ProjectCaseStudy {
  id: string;
  number: string;
  title: string;
  tagline: string;
  category: string;
  role: string;
  type: string;
  summary: string;
  technologies: {
    frontend: string[];
    backend: string[];
    database: string[];
    integrations: string[];
    devops: string[];
  };
  highlights: string[];
  architectureOverview: string;
  problem: string;
  solution: string;
  panelsOrFeatures: {
    title: string;
    description: string;
    items: string[];
  }[];
  engineeringChallenges: {
    challenge: string;
    solution: string;
  }[];
  interactiveDemoType: 'gps-tracker' | 'ecommerce-flow';
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  status: 'Current' | 'Completed';
  location: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  keyHighlights: string[];
}

export interface CapabilityItem {
  number: string;
  title: string;
  headline: string;
  description: string;
  technologies: string[];
  deliverables: string[];
}

export const PORTFOLIO_DATA = {
  personal: {
    name: "Akash Pandey",
    initials: "AP",
    title: "Full-Stack Developer (MERN)",
    roles: [
      "Full-Stack Developer (MERN)",
      "React.js Developer",
      "Node.js & Express.js Backend Developer"
    ],
    headline: "FULL-STACK ENGINEERING. BUILT FOR PRODUCTION.",
    subheadline: "React × Node.js × PostgreSQL × Scalable REST Architecture",
    editorialBio: "I build interfaces users enjoy and robust backend systems they never have to think about. From multi-panel relational platforms to real-time telemetry systems, I engineer end-to-end applications designed to survive real-world production demands.",
    location: "Surat, Gujarat, India",
    email: "pandeyaakash7491@gmail.com",
    phone: "+91 8957447491",
    githubPlaceholder: "https://github.com",
    linkedinPlaceholder: "https://linkedin.com",
    status: "Available for High-Impact Engineering Roles",
    experienceYears: "2+",
  },

  stats: [
    {
      value: "2+",
      unit: "Years",
      label: "Production Engineering",
      detail: "Building end-to-end full-stack systems with React & Node"
    },
    {
      value: "22",
      unit: "Languages",
      label: "Indian Languages Supported",
      detail: "Production multi-language enterprise architecture"
    },
    {
      value: "2",
      unit: "Major",
      label: "Production Platforms",
      detail: "Multi-panel e-commerce & real-time telemetry systems"
    },
    {
      value: "100%",
      unit: "End-to-End",
      label: "Full-Stack Ownership",
      detail: "From database schema design to Nginx reverse proxy on Linux"
    }
  ],

  capabilities: [
    {
      number: "01",
      title: "Frontend Engineering",
      headline: "Modular, performant client applications with state integrity",
      description: "Crafting modern, accessible, and responsive user interfaces with React.js, TypeScript, and Tailwind CSS. Implementing predictable state flows with Redux Toolkit and Context API.",
      technologies: ["React.js", "TypeScript", "Redux Toolkit", "Context API", "Tailwind CSS", "React Query"],
      deliverables: ["Complex Admin & Seller Dashboards", "Interactive Data Visualizations", "Multi-Language (i18n) Systems", "Responsive Mobile-First UIs"]
    },
    {
      number: "02",
      title: "Backend & API Architecture",
      headline: "Scalable REST services with bulletproof routing and logic",
      description: "Designing structured Node.js and Express.js backend services. Clean controller-service architecture, structured error handling, middleware validation, and automated mail delivery with Nodemailer.",
      technologies: ["Node.js", "Express.js", "REST APIs", "Nodemailer", "Middleware Architecture", "Error Handling Pipelines"],
      deliverables: ["RESTful API Endpoints", "Transactional Email Pipelines", "Centralized Validation Middleware", "Service-Oriented Architecture"]
    },
    {
      number: "03",
      title: "Database Design & Modeling",
      headline: "Relational integrity, schema migrations, and high-performance querying",
      description: "Modeling data structures for relational and document databases. Designing schemas with PostgreSQL, MySQL, and MongoDB using modern ORM/ODMs like Prisma and Mongoose.",
      technologies: ["PostgreSQL", "Prisma ORM", "MongoDB", "Mongoose", "MySQL", "SQL"],
      deliverables: ["Relational E-Commerce Schemas", "Complex Relational Joins & Queries", "Document Store Data Models", "Prisma Database Migrations"]
    },
    {
      number: "04",
      title: "Authentication & Security",
      headline: "Multi-role access control, secure tokens, and protected endpoints",
      description: "Implementing defense-in-depth authentication using JSON Web Tokens (JWT), bcrypt hashing, OTP verification flows, password reset lifecycles, and granular Role-Based Access Control (RBAC).",
      technologies: ["JWT", "RBAC", "bcrypt", "OTP Verification", "Password Reset", "Protected APIs"],
      deliverables: ["Multi-Tenant Role Permissions (Admin/HR/Manager/Employee)", "Cryptographic Token Verification", "OTP & Email Reset Flows", "API Route Guards"]
    },
    {
      number: "05",
      title: "Third-Party Integrations",
      headline: "Seamless payment gateways, real-time maps, and external APIs",
      description: "Integrating mission-critical external APIs into enterprise workflows, from PayU payment gateway checkouts with webhook verification to Leaflet.js interactive GPS telemetry mapping.",
      technologies: ["PayU Payment Gateway", "Leaflet.js Mapping", "GPS Telemetry", "REST Integrations", "Webhooks"],
      deliverables: ["End-to-End Payment Flow", "Real-Time GPS Polylines & Live Markers", "External Service Webhooks", "Geospatial Location History"]
    },
    {
      number: "06",
      title: "Production Deployment & DevOps",
      headline: "Linux environments, Nginx reverse proxies, and VPS configuration",
      description: "Deploying and managing production systems on Contabo VPS and Linux servers. Setting up Nginx reverse proxy routing, SSL/TLS certificates, GoDaddy DNS configurations, and Git workflow automation.",
      technologies: ["Linux", "Nginx", "Contabo VPS", "GoDaddy DNS", "SSL / TLS", "Git & GitHub"],
      deliverables: ["Nginx Reverse Proxy & Load Routing", "SSL/TLS Security Automation", "Production VPS Server Provisioning", "CI/CD & Git Branch Workflows"]
    }
  ] as CapabilityItem[],

  projects: [
    {
      id: "harappa-biosciences",
      number: "01",
      title: "Harappa Biosciences",
      tagline: "Multi-Panel E-Commerce & Distribution Platform",
      category: "Full-Stack Enterprise Platform",
      role: "Lead Full-Stack Developer",
      type: "Production Web System",
      summary: "A comprehensive, multi-role e-commerce platform engineered with React, Node.js, Express, PostgreSQL, and Prisma ORM. Built with dedicated Admin, Seller, and Customer panels, automated PayU payment processing, and production Linux/Nginx deployment.",
      technologies: {
        frontend: ["React.js", "Redux Toolkit", "Context API", "Tailwind CSS", "Axios"],
        backend: ["Node.js", "Express.js", "REST APIs", "Nodemailer", "JWT", "RBAC"],
        database: ["PostgreSQL", "Prisma ORM", "Relational Schemas"],
        integrations: ["PayU Payment Gateway", "Transaction Verification"],
        devops: ["Contabo VPS", "Linux Server", "Nginx Reverse Proxy", "SSL/TLS", "GoDaddy DNS"]
      },
      highlights: [
        "Architected 3 distinct role panels: Super Admin, Verified Seller, and End Customer",
        "Engineered relational database schema using PostgreSQL and Prisma ORM for complex product inventories",
        "Integrated PayU payment gateway with secure server-side transaction verification and order status management",
        "Configured production environment on Contabo VPS with Linux, Nginx reverse proxy, and SSL/TLS certificates"
      ],
      architectureOverview: "React client communicating through secure REST endpoints to an Express.js backend layer, authenticated via JWT/RBAC middleware, querying PostgreSQL through Prisma ORM, and executing transactions with PayU gateway.",
      problem: "Traditional single-tier e-commerce templates fail to handle multi-seller segregation, granular role-based permissions, customized billing flows, and reliable relational inventory tracking in a single cohesive platform.",
      solution: "Engineered a modular multi-tier platform with segregated access portals, robust Prisma ORM data modeling, automated inventory locking during checkout, and seamless PayU payment processing.",
      panelsOrFeatures: [
        {
          title: "Admin Panel",
          description: "Global oversight for system operators with complete control over the entire platform ecosystem.",
          items: ["User & Seller Verification", "Global Product Catalog Moderation", "System-Wide Order Tracking", "Revenue & Transaction Reports"]
        },
        {
          title: "Seller Panel",
          description: "Dedicated portal for authorized vendors to operate independent store inventories.",
          items: ["Inventory & SKU Management", "Order Fulfillment & Status Updates", "Pricing & Discount Controls", "Sales Analytics"]
        },
        {
          title: "Customer Experience & Checkout",
          description: "Streamlined storefront with fast catalog search, cart synchronization, and PayU integration.",
          items: ["Category Browsing & Dynamic Search", "Persistent Cart & State Management", "Secure PayU Checkout Flow", "Order History & Real-Time Status"]
        }
      ],
      engineeringChallenges: [
        {
          challenge: "Ensuring strict data isolation between multiple sellers while sharing a unified relational PostgreSQL schema.",
          solution: "Implemented tenant-isolated Prisma queries with strict RBAC middleware validation verifying seller identity on every endpoint."
        },
        {
          challenge: "Handling asynchronous payment webhook confirmations and preventing duplicate order fulfillment.",
          solution: "Engineered idempotent payment callback handlers with cryptographically verified checksums and transactional status transitions."
        }
      ],
      interactiveDemoType: 'ecommerce-flow'
    },
    {
      id: "lantern360",
      number: "02",
      title: "Lantern360",
      tagline: "Workforce Management & Real-Time Performance Platform",
      category: "Enterprise Telemetry & Operations System",
      role: "Full-Stack / Frontend Lead",
      type: "Production Enterprise Application",
      summary: "An enterprise workforce management platform featuring real-time GPS employee telemetry, dynamic Leaflet.js mapping, multi-level RBAC (Admin, HR, Manager, Employee), multi-language internationalization across 22 Indian languages, and comprehensive attendance, travel, and task tracking.",
      technologies: {
        frontend: ["React.js", "Redux Toolkit", "Context API", "Leaflet.js", "Tailwind CSS", "i18n (22 Languages)"],
        backend: ["Node.js", "Express.js", "REST APIs", "JWT", "RBAC"],
        database: ["PostgreSQL", "Prisma / MongoDB", "Time-Series Coordinates"],
        integrations: ["Leaflet.js Maps", "GPS Telemetry", "OpenStreetMap Data"],
        devops: ["Linux", "Nginx", "Contabo VPS", "Git"]
      },
      highlights: [
        "Engineered live GPS employee tracking interface using Leaflet.js with route polylines and location history playback",
        "Architected multi-tier RBAC for 4 distinct organizational hierarchies: Admin, HR, Manager, and Employee",
        "Implemented multi-language system supporting 22 Indian languages across the entire user experience",
        "Streamlined operational modules: Real-time Attendance, Travel Session Tracking, Leave Approvals, and Task Assignment"
      ],
      architectureOverview: "GPS coordinates ingested from field personnel, processed by Express.js backend services, stored with temporal indexes, and streamed to an interactive Leaflet.js map layer with optimized polyline rendering.",
      problem: "Field workforce operations struggle with fragmented reporting, inaccurate travel time logging, lack of live visibility, and communication barriers across diverse multilingual field teams.",
      solution: "Delivered a centralized real-time operations hub uniting live GPS telemetry, automated travel distance calculations, structured task delegations, and native 22-language localization.",
      panelsOrFeatures: [
        {
          title: "Live GPS Telemetry & Mapping",
          description: "Interactive geospatial visualization rendering live staff coordinates, travel routes, and location breadcrumbs.",
          items: ["Real-time Employee Markers", "Dynamic Polyline Route Drawing", "Historical Travel Session Playback", "Geofence Check-in Verification"]
        },
        {
          title: "4-Tier RBAC Organization",
          description: "Granular access policies tailored to corporate hierarchies with distinct administrative boundaries.",
          items: ["Super Admin Global Configurations", "HR Department Policy Controls", "Manager Team Approvals & Tasks", "Employee Self-Service Portal"]
        },
        {
          title: "Workforce Operations Suite",
          description: "Integrated modules streamlining everyday business processes into an actionable single pane of glass.",
          items: ["Automated Attendance Logging", "Travel Session Reimbursement Calculations", "Leave Request & Approval Workflows", "Task Assignment & Performance Scoring"]
        }
      ],
      engineeringChallenges: [
        {
          challenge: "Rendering dense GPS coordinate breadcrumbs and rapid location updates without causing UI frame drops or map lag.",
          solution: "Applied polyline simplification algorithms, debounced coordinate streaming, and memoized Leaflet layer components in React."
        },
        {
          challenge: "Managing extensive localization strings across 22 Indian regional languages while maintaining fast initial bundle load times.",
          solution: "Architected dynamic asynchronous language chunk loading with context-based fallback caching and RTL/LTR layout stability."
        }
      ],
      interactiveDemoType: 'gps-tracker'
    }
  ] as ProjectCaseStudy[],

  techStack: {
    frontend: [
      { name: "React.js", category: "Core Frontend", level: "Expert", description: "Component lifecycle, custom hooks, virtual DOM optimization, enterprise app architecture" },
      { name: "JavaScript (ES6+)", category: "Language", level: "Expert", description: "Asynchronous programming, closures, event loop, modern ECMAScript features" },
      { name: "TypeScript", category: "Language", level: "Proficient", description: "Static typing, interfaces, generics, type-safe API contracts and data models" },
      { name: "Redux Toolkit", category: "State Management", level: "Expert", description: "Centralized store slices, RTK Query integration, predictable state transitions" },
      { name: "Context API", category: "State Management", level: "Expert", description: "Lightweight scoped state management for themes, auth session, and localization" },
      { name: "React Query", category: "Data Fetching", level: "Proficient", description: "Server-state synchronization, background fetching, caching, and optimistic mutations" },
      { name: "Tailwind CSS", category: "Styling", level: "Expert", description: "Utility-first design systems, responsive breakpoints, custom design tokens" },
      { name: "HTML5 & CSS3", category: "Core Web", level: "Expert", description: "Semantic markup, modern layout models (Flexbox, Grid), accessible web standards" },
      { name: "Bootstrap", category: "UI Framework", level: "Proficient", description: "Rapid component prototyping and responsive grid systems" }
    ],
    backend: [
      { name: "Node.js", category: "Runtime", level: "Expert", description: "Event-driven asynchronous I/O, event emitters, stream processing, high-throughput APIs" },
      { name: "Express.js", category: "Framework", level: "Expert", description: "RESTful routing, custom middleware pipelines, error handling controllers" },
      { name: "REST APIs", category: "Architecture", level: "Expert", description: "Resource-oriented API design, standard HTTP verbs, status code protocols, pagination" },
      { name: "Nodemailer", category: "Email Service", level: "Proficient", description: "Automated transactional email dispatch, HTML email templates, password reset workflows" }
    ],
    database: [
      { name: "PostgreSQL", category: "Relational DB", level: "Expert", description: "Relational schema design, complex joins, indexing, constraints, transaction safety" },
      { name: "Prisma ORM", category: "ORM", level: "Expert", description: "Type-safe database client, declarative schema modeling, automated migrations" },
      { name: "MongoDB", category: "NoSQL DB", level: "Proficient", description: "Document-oriented data storage, aggregation pipelines, dynamic schemas" },
      { name: "Mongoose", category: "ODM", level: "Proficient", description: "Schema definition, validation hooks, virtuals, and middleware for MongoDB" },
      { name: "MySQL", category: "Relational DB", level: "Proficient", description: "Relational table structuring, foreign keys, and normalized database queries" },
      { name: "SQL", category: "Query Language", level: "Expert", description: "Structured querying, DDL/DML, index optimization, analytical aggregation" }
    ],
    authSecurity: [
      { name: "JWT (JSON Web Tokens)", category: "Authentication", level: "Expert", description: "Stateless token-based authentication, payload signing, token refresh patterns" },
      { name: "RBAC (Role-Based Access Control)", category: "Authorization", level: "Expert", description: "Granular permission hierarchies (Super Admin, HR, Manager, Seller, Employee, User)" },
      { name: "bcrypt", category: "Cryptography", level: "Expert", description: "Salted password hashing, secure storage, and timing-safe password verification" },
      { name: "OTP Verification", category: "Security", level: "Proficient", description: "Time-bound one-time passwords for multi-factor authorization and verification" },
      { name: "Password Reset Lifecycles", category: "Security", level: "Proficient", description: "Cryptographic reset tokens, expiry constraints, and secure verification endpoints" },
      { name: "Protected API Gateways", category: "Security", level: "Expert", description: "Route authorization middleware, sanitized inputs, defense against injection" }
    ],
    integrations: [
      { name: "PayU Payment Gateway", category: "Payments", level: "Proficient", description: "E-commerce checkout integration, hash generation, webhook callback verification" },
      { name: "Leaflet.js", category: "Geospatial", level: "Expert", description: "Interactive map visualization, custom marker icons, polyline GPS tracking rendering" },
      { name: "GPS Telemetry", category: "Location Services", level: "Expert", description: "Real-time location coordinate ingestion, path tracking, session distance calculations" },
      { name: "REST Integrations", category: "Third-Party APIs", level: "Expert", description: "Consuming and orchestrating external web services and webhook pipelines" }
    ],
    devops: [
      { name: "Linux Server", category: "Operating System", level: "Proficient", description: "Ubuntu/Debian server administration, SSH security, process management, shell scripting" },
      { name: "Nginx", category: "Web Server", level: "Proficient", description: "Reverse proxy configuration, load routing, static file caching, gzip compression" },
      { name: "Contabo VPS", category: "Cloud Hosting", level: "Proficient", description: "Virtual private server provisioning, firewall rules, production application hosting" },
      { name: "Git & GitHub", category: "Version Control", level: "Expert", description: "Feature branching, pull requests, semantic commits, team collaboration" },
      { name: "GoDaddy DNS", category: "Networking", level: "Proficient", description: "A-records, CNAME, MX records, domain mapping, and DNS propagation" },
      { name: "SSL / TLS", category: "Security", level: "Proficient", description: "Certbot Let's Encrypt automated SSL renewal and HTTPS enforcement" }
    ]
  },

  experience: [
    {
      id: "cowberry",
      role: "React.js Developer",
      company: "Cowberry",
      period: "July 2024 – Present",
      status: "Current",
      location: "India",
      description: "Leading frontend engineering for comprehensive workforce and enterprise operations platforms. Spearheading real-time GPS tracking systems, complex RBAC authorization, and high-performance localized user interfaces.",
      responsibilities: [
        "Architected core modules for Workforce Management, Employee Tracking, Attendance, Travel Sessions, Leaves, and Task Delegation.",
        "Integrated Leaflet.js interactive maps for real-time GPS tracking, polyline route calculation, and historical location playback.",
        "Engineered multi-tier Role-Based Access Control (RBAC) supporting distinct boundaries for Admin, HR, Manager, and Employee roles.",
        "Built dynamic multi-language architecture supporting 22 Indian regional languages with seamless runtime switching.",
        "Connected complex client state with backend REST APIs via Redux Toolkit and optimized state re-renders for smooth map rendering."
      ],
      technologies: ["React.js", "Redux Toolkit", "Context API", "Leaflet.js", "REST APIs", "Tailwind CSS", "i18n (22 Languages)", "RBAC"],
      keyHighlights: [
        "Live GPS employee tracking with Leaflet.js polyline mapping",
        "22 Indian regional languages internationalization",
        "Granular 4-tier Role-Based Access Control",
        "High-performance workforce management dashboard"
      ]
    },
    {
      id: "gvclouds",
      role: "Frontend Developer Intern",
      company: "GvClouds Secure",
      period: "Sep 2024 – Feb 2025",
      status: "Completed",
      location: "India",
      description: "Developed modern, responsive web application interfaces and collaborated on frontend component design, API integrations, and UI/UX optimization.",
      responsibilities: [
        "Developed responsive and accessible web user interfaces using React.js and modern CSS frameworks.",
        "Integrated client components with backend REST API services, handling error states and asynchronous data flows.",
        "Participated in code reviews, bug fixes, UI optimizations, and cross-browser testing to ensure consistent rendering.",
        "Collaborated with senior engineers on component reusability, state architecture, and Git version control workflows."
      ],
      technologies: ["React.js", "JavaScript", "HTML5", "CSS3", "REST APIs", "Git", "Responsive Web Design"],
      keyHighlights: [
        "Modular React component architectures",
        "Seamless REST API consumption and error boundaries",
        "Responsive cross-device design implementation"
      ]
    }
  ] as ExperienceItem[],

  education: [
    {
      degree: "M.Sc.",
      institution: "Siddharth University",
      period: "2023 – 2025",
      field: "Postgraduate Studies"
    },
    {
      degree: "B.Sc.",
      institution: "Deen Dayal Upadhyaya Gorakhpur University",
      period: "2019 – 2022",
      field: "Undergraduate Studies"
    }
  ],

  certifications: [
    {
      title: "Front-End Developer Certification",
      organization: "Uncodemy",
      location: "Noida",
      period: "Jan 2024 – Jun 2024",
      description: "6-month intensive training focused on modern React.js, component-based architecture, asynchronous JavaScript, state management, and production-grade web application development.",
      skillsAcquired: ["React.js", "Component Architecture", "Modern Web Development", "REST Integration", "State Management"]
    }
  ],

  philosophy: {
    quote: "Good software isn't just about making it work.",
    tenets: [
      {
        title: "Maintainable",
        description: "Clean modular code, strict interfaces, and predictable state structures that any engineer can pick up without friction."
      },
      {
        title: "Scalable",
        description: "Decoupled frontend and backend architectures, indexed relational databases, and optimized API payloads built for growth."
      },
      {
        title: "Usable",
        description: "Intuitive workflows, instant feedback, crisp micro-interactions, and accessible typography that respects the end user."
      },
      {
        title: "Production-Resilient",
        description: "Guarded with JWT & RBAC security, transactional database safety, robust error boundaries, and Nginx reverse proxy stability."
      }
    ]
  },

  architectureFlow: [
    {
      id: "client",
      title: "Client Layer",
      tech: "React.js • TypeScript • Redux",
      description: "Responsive Single Page Application with optimized component trees, Redux Toolkit state slices, and Leaflet.js rendering.",
      outgoing: ["api-gateway"]
    },
    {
      id: "api-gateway",
      title: "Reverse Proxy & Gateway",
      tech: "Nginx • Linux • SSL/TLS",
      description: "Contabo VPS hosting with Nginx handling SSL termination, reverse proxy routing, gzip compression, and static asset distribution.",
      outgoing: ["backend"]
    },
    {
      id: "backend",
      title: "Application Server",
      tech: "Node.js • Express.js • REST",
      description: "Modular Express services with centralized error handlers, async controllers, request sanitization, and Nodemailer pipelines.",
      outgoing: ["security", "third-party"]
    },
    {
      id: "security",
      title: "Auth & RBAC Middleware",
      tech: "JWT • bcrypt • Role Guards",
      description: "Cryptographic token verification, password hashing, and granular multi-role authorization (Admin, HR, Manager, Seller, Employee).",
      outgoing: ["database"]
    },
    {
      id: "database",
      title: "Data Persistence",
      tech: "PostgreSQL • Prisma ORM • MongoDB",
      description: "Relational database models, type-safe migrations, optimized relational joins, and document storage with Mongoose.",
      outgoing: []
    },
    {
      id: "third-party",
      title: "External Integrations",
      tech: "PayU Gateway • Leaflet GPS",
      description: "E-commerce payment gateway webhooks, real-time GPS coordinates ingestion, and external communications.",
      outgoing: []
    }
  ]
};
