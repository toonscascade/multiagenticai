"use client";

import Link from "next/link";
import { 
  Bot, 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Globe,
  X
} from "lucide-react";

const sidebarLinks = [
  {
    title: "Product",
    links: [
      { label: "All Agents", href: "/agents" },
      { label: "Software Engineer", href: "/agents/software-engineer" },
      { label: "Marketing Agent", href: "/agents/marketing" },
      { label: "YouTube Agent", href: "/agents/youtube" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const contactInfo = [
  {
    icon: Mail,
    text: "hello@multiagentai.com",
    href: "mailto:hello@multiagentai.com",
  },
  {
    icon: Phone,
    text: "+1 (800) 123-4567",
    href: "tel:+18001234567",
  },
  {
    icon: MapPin,
    text: "San Francisco, CA",
  },
];

const socialLinks = [
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:block w-80 bg-black/60 rounded-2xl overflow-hidden border border-white/10 mr-8 mt-8 self-start sticky top-8 h-fit">
      <div className="p-8">
        {/* Brand section */}
        <div className="flex flex-col space-y-4 mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shadow-lg shadow-violet-500/10 group-hover:bg-violet-500/30 transition-colors">
              <Bot className="h-5 w-5 text-violet-400" />
            </div>
            <span className="text-white text-xl font-bold tracking-tight">
              MultiAgent <span className="text-violet-400">AI</span>
            </span>
          </Link>

          <p className="text-sm text-white/50 leading-relaxed">
            Empowering businesses with intelligent AI agents for coding, marketing, content creation, and more.
          </p>
        </div>

        {/* Navigation sections */}
        <div className="space-y-8 mb-8">
          {sidebarLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-white text-sm font-semibold uppercase tracking-widest mb-4">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-violet-400 transition-colors duration-150 block py-1"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Resources section */}
        <div className="mb-8">
          <h4 className="text-white text-sm font-semibold uppercase tracking-widest mb-4">
            Resources
          </h4>
          <ul className="space-y-3">
            <li>
              <Link href="/docs" className="text-sm text-white/50 hover:text-violet-400 transition-colors duration-150 block py-1">
                Documentation
              </Link>
            </li>
            <li>
              <Link href="/api" className="text-sm text-white/50 hover:text-violet-400 transition-colors duration-150 block py-1">
                API Reference
              </Link>
            </li>
            <li>
              <Link href="/tutorials" className="text-sm text-white/50 hover:text-violet-400 transition-colors duration-150 block py-1">
                Tutorials
              </Link>
            </li>
            <li>
              <Link href="/community" className="text-sm text-white/50 hover:text-violet-400 transition-colors duration-150 block py-1">
                Community
              </Link>
            </li>
          </ul>
        </div>

        {/* Social icons */}
        <div className="flex flex-wrap gap-2">
          {socialLinks.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="w-9 h-9 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-white/40 hover:text-violet-400 hover:border-violet-500/30 hover:bg-violet-500/10 transition-all duration-200"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}