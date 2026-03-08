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
} from "lucide-react";
import { TextHoverEffect, FooterBackgroundGradient } from "@/components/ui/hover-footer";

const footerLinks = [
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
      { label: "Careers", href: "/careers", pulse: true },
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
  { icon: Globe, label: "Website", href: "#" },
];

export function Footer() {
  return (
    <footer className="relative bg-black/60 rounded-3xl overflow-hidden m-4 sm:m-6 lg:m-8 border border-white/10">
      <div className="max-w-7xl mx-auto p-8 sm:p-10 lg:p-14 z-40 relative">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 lg:gap-12 pb-10">

          {/* Brand section */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shadow-lg shadow-violet-500/10 group-hover:bg-violet-500/30 transition-colors">
                <Bot className="h-5 w-5 text-violet-400" />
              </div>
              <span className="text-white text-xl font-bold tracking-tight">
                MultiAgent <span className="text-violet-400">AI</span>
              </span>
            </Link>

            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              Empowering businesses with intelligent AI agents for coding, marketing, content creation, and more.
            </p>

            {/* Social icons */}
            <div className="flex flex-wrap gap-2 pt-2">
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

          {/* Link sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-white text-sm font-semibold uppercase tracking-widest mb-5">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label} className="relative">
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-violet-400 transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                    {link.pulse && (
                      <span className="absolute top-1 -right-4 w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact section */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-widest mb-5">
              Contact Us
            </h4>
            <ul className="space-y-4">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <item.icon size={17} className="text-violet-400 mt-0.5 shrink-0" />
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm text-white/50 hover:text-violet-400 transition-colors leading-snug break-all"
                    >
                      {item.text}
                    </a>
                  ) : (
                    <span className="text-sm text-white/50 leading-snug">{item.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-t border-white/10 my-6" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-white/30 gap-3">
          <p>© {new Date().getFullYear()} MultiAgent AI. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="hover:text-violet-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-violet-400 transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-violet-400 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>

      {/* Text hover effect — desktop only */}
      <div className="lg:flex hidden h-[30rem] -mt-52 -mb-36 z-10 relative">
        <TextHoverEffect text="MultiAI" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}
