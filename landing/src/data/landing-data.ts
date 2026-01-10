import { BarChart3, Mail, Send, TableOfContents, Briefcase, SquareChartGantt } from "lucide-react";

export const howItWorksSteps = [
  {
    title: "Add a Job",
    description: "Complete your profile and add the job you're applying for and the company you're applying to.",
    icon: Briefcase,
  },
  {
    title: "Generate Messages",
    description: "Create context aware referral and follow-up messages tailored to the role and company using AI without relying on generic templates.",
    icon: Mail,
  },
  {
    title: "Manage Outreach",
    description: "Send emails from your inbox, track conversations, and automate follow-ups until the loop is closed.",
    icon: SquareChartGantt,
  },
];

export const features = [
  {
    title: "Context Aware Messaging",
    description: "AI-generated referral and follow-up messages tailored to the job description, company, and role so every outreach feels relevant, not templated.",
    icon: Send
  },
  {
    title: "Track Progress",
    description: "Monitor requests and automate follow-ups with intelligent scheduling. Never lose track of a referral opportunity again.",
    icon: BarChart3,
  },
  {
    title: "Inbox Native Outreach",
    description: "Send, track, and manage referral outreach through your existing Gmail account.",
    icon: Mail,
  },
  {
    title: "Structured Outreach",
    description: "Track referral requests, replies, and follow-ups in a single workflow, without relying on spreadsheets or reminders.",
    icon: TableOfContents,
  },
];

export const benefits = [
  "Context-aware referral and follow-up messages",
  "One place to manage outreach",
  "Automated follow-ups",
  "Send and track emails from Gmail",
  "Less overhead, more focus on applying",
];

export const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      "5 Referral Requests/month",
      "Basic Templates",
      "Community Access",
      "Email Support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    description: "For serious job seekers",
    features: [
      "Unlimited Requests",
      "Premium AI Templates",
      "Priority Support",
      "Advanced Analytics",
      "Profile Verification Badge",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For recruitment agencies",
    features: [
      "Team Management",
      "Custom Branding",
      "API Access",
      "Dedicated Account Manager",
      "SLA Support",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Testimonials", href: "#" },
      { label: "FAQ", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  },
];
