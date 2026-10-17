export const site = {
  name: "NQT Infotech",
  shortName: "NQT",
  tagline: "Technology that moves your business forward",
  description:
    "NQT Infotech is an IT services company delivering web, mobile, cloud and software engineering solutions for growing businesses.",
  email: "hello@nqtinfotech.com",
  phone: "+91 98765 43210",
  address: "Indore, Madhya Pradesh, India",
  hours: "Mon - Sat, 10:00 - 19:00 IST",
  social: {
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
    twitter: "https://twitter.com/",
  },
};

export type Service = {
  title: string;
  description: string;
  icon: string;
  points: string[];
};

export const services: Service[] = [
  {
    title: "Web Development",
    description:
      "Fast, accessible and SEO-friendly websites and web apps built on modern frameworks.",
    icon: "globe",
    points: ["Next.js & React", "Headless CMS", "E-commerce", "Performance tuning"],
  },
  {
    title: "Mobile App Development",
    description:
      "Cross-platform Android and iOS apps that feel native and ship quickly.",
    icon: "phone",
    points: ["React Native", "Flutter", "App Store deployment", "Push notifications"],
  },
  {
    title: "Cloud & DevOps",
    description:
      "Reliable, scalable infrastructure with automated delivery pipelines.",
    icon: "cloud",
    points: ["AWS & Azure", "CI/CD pipelines", "Containers", "Monitoring"],
  },
  {
    title: "Custom Software",
    description:
      "Tailored business software, ERP and CRM systems that fit the way you work.",
    icon: "code",
    points: ["ERP & CRM", "APIs & integrations", "Dashboards", "Automation"],
  },
  {
    title: "UI/UX Design",
    description:
      "Research-led interface design that turns visitors into customers.",
    icon: "sparkles",
    points: ["Wireframes", "Design systems", "Prototyping", "Usability testing"],
  },
  {
    title: "IT Support & Maintenance",
    description:
      "Ongoing support, security and maintenance so your systems keep running.",
    icon: "shield",
    points: ["Managed support", "Security audits", "Backups", "SLA plans"],
  },
];

export const stats = [
  { value: "120+", label: "Projects delivered" },
  { value: "8+", label: "Years of experience" },
  { value: "40+", label: "Happy clients" },
  { value: "99.9%", label: "Uptime maintained" },
];

export const values = [
  {
    title: "Quality first",
    description:
      "Clean code, tested releases and documentation as standard on every project.",
    icon: "check",
  },
  {
    title: "Transparent delivery",
    description:
      "Clear scope, weekly updates and no surprises on timelines or cost.",
    icon: "eye",
  },
  {
    title: "Built to scale",
    description:
      "Solutions architected to grow with your business, not against it.",
    icon: "trend",
  },
  {
    title: "Real partnership",
    description:
      "We stay involved after launch, supporting and improving what we build.",
    icon: "users",
  },
];

export const process = [
  {
    step: "01",
    title: "Discover",
    description:
      "We understand your goals, users and constraints, then agree on scope.",
  },
  {
    step: "02",
    title: "Design",
    description:
      "Wireframes and UI designs that you review and approve before we build.",
  },
  {
    step: "03",
    title: "Build",
    description:
      "Iterative development with demos at the end of every sprint.",
  },
  {
    step: "04",
    title: "Launch & support",
    description:
      "We deploy, monitor and keep improving your product after go-live.",
  },
];

export const techStack = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "PostgreSQL",
  "MongoDB",
  "AWS",
  "Docker",
  "React Native",
  "Flutter",
  "Figma",
];
