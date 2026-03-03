"use client"

import { NavBar } from '@/components/ui/tubelight-navbar'
import { Home, Bot, DollarSign, BookOpen } from 'lucide-react'

export function TubelightNavWrapper() {
  const navItems = [
    { name: 'Home', url: '#', icon: Home },
    { name: 'Agents', url: '/agents', icon: Bot },
    { name: 'Pricing', url: '#pricing', icon: DollarSign },
    { name: 'Docs', url: '/docs', icon: BookOpen }
  ]

  return <NavBar items={navItems} />
}
