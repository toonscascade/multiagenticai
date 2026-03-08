"use client"

import { useState } from "react"
import Link from "next/link"
import { Bot, Mail, Lock, User, ArrowRight, Github, Twitter } from "lucide-react"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Gradient Elements - Same as main page */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            background: 'linear-gradient(to top right, oklch(0.7 0.15 280), oklch(0.6 0.2 320))'
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>

      <div className="relative isolate px-6 pt-32 pb-20">
        <div className="mx-auto max-w-sm">
          {/* Logo and Title - Blended style */}
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center justify-center gap-2.5 mb-8 group">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shadow-lg shadow-violet-500/10 group-hover:bg-violet-500/30 transition-all duration-300">
                <Bot className="h-7 w-7 text-violet-400" />
              </div>
            </Link>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-3">
              Create account
            </h1>
            <p className="text-lg text-muted-foreground">
              Start your journey with AI agents
            </p>
          </div>

          {/* Signup Form - No card, blended into page */}
          <form className="space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground ml-1">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-border/60 bg-background/40 backdrop-blur-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 focus:bg-background/60 transition-all"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground ml-1">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-border/60 bg-background/40 backdrop-blur-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 focus:bg-background/60 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-border/60 bg-background/40 backdrop-blur-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 focus:bg-background/60 transition-all"
                />
              </div>
              <p className="text-xs text-muted-foreground/70 ml-1">
                Must be at least 8 characters
              </p>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 px-1">
              <input
                id="terms"
                type="checkbox"
                required
                className="w-4 h-4 mt-0.5 rounded-md border-border/60 bg-background/40 text-primary focus:ring-primary/30 focus:ring-offset-0"
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:text-primary/80 font-medium">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:text-primary/80 font-medium">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Create Account
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Divider - More subtle */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/40"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background/80 backdrop-blur-sm px-4 text-muted-foreground/70">or sign up with</span>
            </div>
          </div>

          {/* Social Signup - Pill style like navbar */}
          <div className="flex justify-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border/60 bg-background/40 backdrop-blur-sm px-6 py-3 text-sm font-medium text-foreground hover:bg-background/60 hover:border-primary/30 transition-all duration-200"
            >
              <Github size={18} />
              <span className="hidden sm:inline">GitHub</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border/60 bg-background/40 backdrop-blur-sm px-6 py-3 text-sm font-medium text-foreground hover:bg-background/60 hover:border-primary/30 transition-all duration-200"
            >
              <Twitter size={18} />
              <span className="hidden sm:inline">Twitter</span>
            </button>
          </div>

          {/* Login Link */}
          <p className="text-center mt-10 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
