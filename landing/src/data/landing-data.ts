import { Zap, BarChart3, Globe, Shield, Search, Mail, Send } from "lucide-react";

export const howItWorksSteps = [
  {
    title: "Find Employees",
    description: "Search for employees at your dream companies who are willing to refer.",
    icon: Search,
  },
  {
    title: "Select Template",
    description: "Choose from our AI-crafted templates to send a personalized request.",
    icon: Mail,
  },
  {
    title: "Get Referred",
    description: "Send your request and track the status until you get referred.",
    icon: Send,
  },
];

export const features = [
  {
    title: "Smart Templates",
    description: "AI-powered email templates crafted specifically for referral success. Our templates are A/B tested to ensure high response rates.",
    icon: Zap,
  },
  {
    title: "Track Progress",
    description: "Monitor requests and automate follow-ups with intelligent scheduling. Never lose track of a referral opportunity again.",
    icon: BarChart3,
  },
  {
    title: "Global Network",
    description: "Connect with employees at top companies worldwide. Access a vast database of professionals willing to refer.",
    icon: Globe,
  },
  {
    title: "Verified Profiles",
    description: "All employee profiles are verified to ensure authenticity. Connect with confidence knowing you're talking to real employees.",
    icon: Shield,
  },
];

export const benefits = [
  "Higher response rates with AI templates",
  "Automated follow-up reminders",
  "Direct access to verified employees",
  "Real-time tracking of applications",
  "Community-driven insights",
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
