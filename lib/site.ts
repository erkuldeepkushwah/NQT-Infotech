export const site = {
  name: "NQT Infotech",
  short: "NQT",
  tagline: "Clear IT solutions for your business",
  description:
    "NQT Infotech delivers web, mobile, cloud and software solutions that help businesses operate efficiently, scale smartly and accelerate growth.",
  heroText:
    "From strategy to implementation, we deliver web, mobile, cloud and software solutions that help you operate efficiently, scale smartly and accelerate growth.",
  email: "nqtinfotech@gmail.com",
  phone: "+91 78986 92133",
  phoneHref: "+917898692133",
  address: "12 Vijay Nagar, Indore, Madhya Pradesh",
  hours: "Monday to Friday: 9 am - 5 pm",
  social: {
    x: "https://x.com/",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/",
    instagram: "https://instagram.com/",
  },
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/courses", label: "Courses" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export type Feature = { title: string; icon: string };

export const features: Feature[] = [
  { title: "Modern technology stack", icon: "layers" },
  { title: "Dependable IT solutions", icon: "shield" },
  { title: "Strategic partnerships for success", icon: "handshake" },
  { title: "Seamless IT support services", icon: "headset" },
];

export type Service = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  points: string[];
  image: string;
};

export const services: Service[] = [
  {
    slug: "web-development",
    title: "Web development",
    description:
      "Fast, accessible websites and web applications built on modern frameworks and clean, maintainable code.",
    icon: "code",
    points: ["Next.js & React", "Headless CMS", "E-commerce", "Performance tuning"],
    image: "nqt-web",
  },
  {
    slug: "mobile-app-development",
    title: "Mobile app development",
    description:
      "Cross-platform Android and iOS apps that feel native, ship quickly and are easy to maintain.",
    icon: "phone",
    points: ["React Native", "Flutter", "Store deployment", "Push notifications"],
    image: "nqt-mobile",
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX design",
    description:
      "Research-led interface design and design systems that turn visitors into loyal customers.",
    icon: "sparkles",
    points: ["Wireframes", "Design systems", "Prototyping", "Usability testing"],
    image: "nqt-design",
  },
  {
    slug: "cloud-devops",
    title: "Cloud & DevOps",
    description:
      "Reliable, scalable infrastructure with automated delivery pipelines and monitoring built in.",
    icon: "cloud",
    points: ["AWS & Azure", "CI/CD pipelines", "Containers", "Monitoring"],
    image: "nqt-cloud",
  },
  {
    slug: "custom-software",
    title: "Custom software",
    description:
      "Tailored business software, ERP and CRM systems that fit the way your teams actually work.",
    icon: "settings",
    points: ["ERP & CRM", "APIs & integrations", "Dashboards", "Automation"],
    image: "nqt-software",
  },
  {
    slug: "it-support",
    title: "IT support & maintenance",
    description:
      "Ongoing support, security and maintenance so your systems keep running without surprises.",
    icon: "headset",
    points: ["Managed support", "Security audits", "Backups", "SLA plans"],
    image: "nqt-support",
  },
  {
    slug: "artificial-intelligence",
    title: "Artificial Intelligence & Machine Learning",
    description:
      "Intelligent AI solutions and machine learning models that automate processes, uncover insights and improve business efficiency.",
    icon: "cpu",
    points: ["Predictive models", "Process automation", "Computer vision", "Chatbots & assistants"],
    image: "nqt-ai",
  },
  {
    slug: "cybersecurity",
    title: "Cybersecurity Solutions",
    description:
      "Protect your business with proactive security assessments, threat detection and solutions designed to safeguard critical data.",
    icon: "shield",
    points: ["Security audits", "Threat detection", "Penetration testing", "Incident response"],
    image: "nqt-cybersecurity",
  },
  {
    slug: "data-analytics-bi",
    title: "Data Analytics & Business Intelligence",
    description:
      "Transform business data into actionable insights through interactive dashboards, advanced analytics and smarter reporting.",
    icon: "chart",
    points: ["Dashboards & reporting", "Data warehousing", "KPI tracking", "Self-serve analytics"],
    image: "nqt-analytics",
  },
  {
    slug: "ecommerce-development",
    title: "E-commerce Development",
    description:
      "Build secure, scalable online stores with intuitive shopping experiences, payment integrations and streamlined order management.",
    icon: "cart",
    points: ["Storefront development", "Payment integration", "Order management", "Inventory sync"],
    image: "nqt-ecommerce",
  },
  {
    slug: "api-development",
    title: "API Development & Integration",
    description:
      "Connect applications, automate data exchange and integrate third-party services with reliable, well-designed APIs.",
    icon: "link",
    points: ["REST & GraphQL", "Third-party integrations", "Authentication", "API documentation"],
    image: "nqt-api",
  },
  {
    slug: "digital-transformation",
    title: "Digital Transformation Consulting",
    description:
      "Modernize business operations with technology roadmaps, workflow optimization and practical digital transformation strategies.",
    icon: "trend",
    points: ["Technology roadmaps", "Workflow automation", "Legacy modernisation", "Change management"],
    image: "nqt-digital",
  },
];

export const aboutBullets = [
  "Tailored solutions for every business",
  "Trusted technology expertise",
  "A proven record of successful delivery",
  "A relentless focus on client satisfaction",
];

export type Segment = { title: string; icon: string; description: string; points: string[] };

export const segments: Segment[] = [
  {
    title: "Startups & small businesses",
    icon: "rocket",
    description:
      "Affordable, scalable solutions that help you launch quickly and grow without rework.",
    points: ["MVP development", "Brand & website", "Cloud setup"],
  },
  {
    title: "Mid-sized companies",
    icon: "trend",
    description:
      "Systems and integrations that remove manual work and connect the tools you already use.",
    points: ["Process automation", "System integration", "Reporting"],
  },
  {
    title: "Corporate clients",
    icon: "building",
    description:
      "Enterprise-grade engineering, security and support with clear governance and SLAs.",
    points: ["Dedicated teams", "Security & compliance", "Managed support"],
  },
];

export const benefits = [
  {
    title: "Improve online visibility",
    description:
      "Reach more of the right customers with a fast, findable and credible digital presence.",
  },
  {
    title: "Make informed decisions",
    description:
      "Get the data, dashboards and reporting you need to act with confidence.",
  },
  {
    title: "Reduce technical uncertainty",
    description:
      "Clear roadmaps and architecture so you always know what is being built and why.",
  },
  {
    title: "Plan for sustainable growth",
    description:
      "Solutions designed to scale with your team, your traffic and your ambitions.",
  },
];

export const stats = [
  { value: "8+", label: "Years of experience" },
  { value: "120+", label: "Successful cases" },
  { value: "40+", label: "Clients worldwide" },
  { value: "98.5%", label: "Customer satisfaction" },
];

export const teamStats = [
  { value: "8+", label: "Years of experience" },
  { value: "97.5%", label: "Client satisfaction" },
];

export type Testimonial = {
  metric: string;
  quote: string;
  name: string;
  role: string;
  avatarIndex: number;
};

export const testimonials: Testimonial[] = [
  {
    metric: "Increased online sales by 60%",
    quote:
      "The team rebuilt our storefront and the difference was immediate. Pages load faster, checkout is smoother and our sales are up sharply.",
    name: "Sanjay Kapoor",
    role: "Founder, RetailCo",
    avatarIndex: 12,
  },
  {
    metric: "65% growth in online sales",
    quote:
      "NQT Infotech understood our business before writing a line of code. The new platform has genuinely changed how we sell.",
    name: "Meera Iyer",
    role: "Director, HealthPlus",
    avatarIndex: 45,
  },
  {
    metric: "Custom CRM for software projects",
    quote:
      "We finally have one place for leads, projects and invoices. It replaced four tools and saved the team hours every week.",
    name: "Arjun Deshpande",
    role: "CTO, FinEdge",
    avatarIndex: 33,
  },
];

export const philosophy = [
  {
    title: "Transparent communication",
    description:
      "We keep you informed at every stage - clear scope, honest timelines and regular updates.",
  },
  {
    title: "Excellence in client care",
    description:
      "We build long-term relationships by listening closely and responding quickly.",
  },
  {
    title: "Precision & reliability",
    description:
      "Every solution is tested, documented and built to be dependable in production.",
  },
];

export const whyUsBullets = [
  "Decisions based on real analysis",
  "We focus on your goals",
  "Clear reporting and open communication",
  "Solutions tailored to your needs",
  "Experienced professionals across industries",
];

export type ProcessStep = { title: string; description: string };

export const process: ProcessStep[] = [
  {
    title: "Business & technical assessment",
    description:
      "We begin by understanding your business, current systems and objectives through a review of your infrastructure, workflows and key challenges.",
  },
  {
    title: "Goals & strategy definition",
    description:
      "Together we define clear project goals and priorities, and develop a plan aligned with your business needs, budget and timeline.",
  },
  {
    title: "Technical planning & architecture",
    description:
      "We create detailed technical plans, wireframes and system designs to support decision-making before implementation.",
  },
  {
    title: "Execution & implementation support",
    description:
      "Our engineers build, test and integrate each component, keeping you involved through demos at the end of every sprint.",
  },
  {
    title: "Monitoring & ongoing advisory",
    description:
      "After launch we monitor performance, support your team and advise on the next round of improvements.",
  },
];

export type TeamMember = { name: string; role: string; avatarIndex: number };

export const team: TeamMember[] = [
  { name: "Aarav Sharma", role: "Founder & CEO", avatarIndex: 15 },
  { name: "Neha Verma", role: "Head of Design", avatarIndex: 47 },
  { name: "Rahul Mehta", role: "Lead Engineer", avatarIndex: 11 },
  { name: "Priya Nair", role: "Project Manager", avatarIndex: 44 },
  { name: "Karan Singh", role: "Cloud Architect", avatarIndex: 52 },
];

export type Milestone = { year: string; title: string; description: string; image: string };

export const milestones: Milestone[] = [
  {
    year: "2016",
    title: "Our first steps",
    description:
      "We started with a small team and a focus on building reliable software for local businesses, working closely with early clients.",
    image: "nqt-mile-2016",
  },
  {
    year: "2019",
    title: "Recognised for quality",
    description:
      "Our work was recognised within the region for dependable delivery, and we grew our team across design and engineering.",
    image: "nqt-mile-2019",
  },
  {
    year: "2022",
    title: "New office & expanded services",
    description:
      "We opened our Vijay Nagar office and expanded into cloud, mobile and support services alongside web development.",
    image: "nqt-mile-2022",
  },
  {
    year: "2026",
    title: "Expansion & growth",
    description:
      "We now serve clients across industries, pairing deep technical expertise with a genuinely consultative approach.",
    image: "nqt-mile-2026",
  },
];

export type Course = {
  title: string;
  category: string;
  description: string;
  duration: string;
  level: string;
  price: string;
  oldPrice: string;
  discount: string;
  image: string;
};

export const courses: Course[] = [
  {
    title: "Data Analytics",
    category: "Data Analytics",
    description:
      "Work with Excel, SQL, Python and Power BI to turn raw data into clear business insights.",
    duration: "4 Months",
    level: "Beginner",
    price: "14,999",
    oldPrice: "20,000",
    discount: "25% OFF",
    image: "course-analytics",
  },
  {
    title: "Data Science",
    category: "Data Science",
    description:
      "Learn statistics, Python, machine learning and data visualisation to solve real business problems.",
    duration: "6 Months",
    level: "Beginner to Advanced",
    price: "24,999",
    oldPrice: "35,000",
    discount: "29% OFF",
    image: "course-datascience",
  },
  {
    title: "Full Stack Web Development",
    category: "Web Development",
    description:
      "Master HTML, CSS, JavaScript, React, Node.js and databases to build production-ready applications.",
    duration: "6 Months",
    level: "Beginner to Advanced",
    price: "19,999",
    oldPrice: "30,000",
    discount: "33% OFF",
    image: "course-fullstack",
  },
  {
    title: "Python Programming",
    category: "Programming",
    description:
      "Build a strong programming foundation with Python, from fundamentals to automation and scripting.",
    duration: "3 Months",
    level: "Beginner",
    price: "12,999",
    oldPrice: "18,000",
    discount: "28% OFF",
    image: "course-python",
  },
  {
    title: "Cloud & DevOps",
    category: "Cloud",
    description:
      "Deploy and operate real systems with AWS, Docker, CI/CD pipelines and monitoring.",
    duration: "4 Months",
    level: "Intermediate",
    price: "21,999",
    oldPrice: "28,000",
    discount: "21% OFF",
    image: "course-cloud",
  },
  {
    title: "UI/UX Design",
    category: "Design",
    description:
      "Learn user research, wireframing, prototyping and design systems in Figma.",
    duration: "3 Months",
    level: "Beginner",
    price: "16,999",
    oldPrice: "22,000",
    discount: "23% OFF",
    image: "course-uiux",
  },
];

export const courseBenefits = [
  "Live instructor-led sessions",
  "Real projects and portfolio work",
  "Placement and interview preparation",
  "Lifetime access to recordings",
];

export type BlogPost = {
  title: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
};

export const blogCategories = [
  "Company news",
  "Expert advice",
  "Industry news",
  "Insights",
];

export const blogPosts: BlogPost[] = [
  {
    title: "Preparing your business for growth and uncertainty",
    category: "Insights",
    date: "January 11, 2026",
    excerpt:
      "How to build technology foundations that stay useful when markets and priorities shift.",
    image: "blog-growth",
  },
  {
    title: "How AI is transforming web development",
    category: "Industry news",
    date: "June 22, 2025",
    excerpt:
      "Where AI genuinely helps delivery teams today, and where human judgement still matters most.",
    image: "blog-ai",
  },
  {
    title: "Expanding our IT service offerings",
    category: "Company news",
    date: "March 29, 2025",
    excerpt:
      "We have added cloud, mobile and managed support services to serve clients end to end.",
    image: "blog-services",
  },
  {
    title: "Why more businesses are investing in cloud technology",
    category: "Expert advice",
    date: "May 11, 2024",
    excerpt:
      "The practical reasons growing companies move to the cloud - and how to do it without disruption.",
    image: "blog-cloud",
  },
  {
    title: "Why a strong digital presence is essential for growth",
    category: "Expert advice",
    date: "May 5, 2024",
    excerpt:
      "A credible, fast and findable website still does more for your pipeline than any other channel.",
    image: "blog-digital",
  },
  {
    title: "Launching our enhanced IT support services",
    category: "Company news",
    date: "February 1, 2024",
    excerpt:
      "Faster response times, proactive monitoring and clearer SLAs for every support client.",
    image: "blog-support",
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

export const clientLogos = [
  "Nexora",
  "WISDOM",
  "educore",
  "LUMEN",
  "SCIPHERS",
  "VERTEXA",
];
