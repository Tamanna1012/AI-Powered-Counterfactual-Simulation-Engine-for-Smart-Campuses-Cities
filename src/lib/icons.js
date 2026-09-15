import {
  BrainCircuit,
  Code2,
  Calculator,
  Atom,
  Terminal,
  ClipboardCheck,
  Users,
  BookOpen,
  Building2,
  TrendingUp,
  Trophy,
  Award,
  Star,
  ShieldCheck,
  GraduationCap,
  School,
  Sparkles,
} from 'lucide-react'

export const iconRegistry = {
  BrainCircuit,
  Code2,
  Calculator,
  Atom,
  Terminal,
  ClipboardCheck,
  Users,
  BookOpen,
  Building2,
  TrendingUp,
  Trophy,
  Award,
  Star,
  ShieldCheck,
  GraduationCap,
  School,
  Sparkles,
}

export function getIcon(name) {
  return iconRegistry[name] || Sparkles
}
