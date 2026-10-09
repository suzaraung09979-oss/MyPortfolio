'use client'

/**
 * app/page.tsx — Su Zar Aung · Portfolio (v2)
 * Setup:  npm i framer-motion lucide-react
 * Files (put in /public):
 *   /public/profile.jpg        ← your photo (convert .jfif to .jpg first)
 *   /public/SuZarAung_CV.pdf   ← your CV
 */

import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import {
  motion, AnimatePresence, useScroll, useSpring, useMotionValue, useReducedMotion, type Variants,
} from 'framer-motion'
import {
  Moon, Sun, Menu, X, MapPin, Mail, Send, CheckCircle2, AlertCircle, Briefcase, GraduationCap, Trophy,
  Languages, Code2, Server, Database, ArrowDown, Zap, Brain, Rocket, HeartHandshake, CalendarDays, Boxes,
  FileSearch, Puzzle, Compass, ArrowUp, Download, Eye, ExternalLink, type LucideIcon,
} from 'lucide-react'
import { Fraunces, Manrope } from 'next/font/google'

const display = Fraunces({ subsets: ['latin'], variable: '--font-display' })
const body = Manrope({ subsets: ['latin'], variable: '--font-body' })

type BrandIconProps = { size?: number; className?: string }
const Github = ({ size = 18, className }: BrandIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
)
const Linkedin = ({ size = 18, className }: BrandIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
)

/* ───────────── Content ───────────── */
const PROFILE_IMAGE = '/SZAProfile.png'
const CV_FILE = '/SuZarAung_CV.pdf'
const CONTACT_ENDPOINT = 'https://formspree.io/f/mvkzadwl'
const CONTACT = { email: 'suaung09979@gmail.com', github: '', linkedin: '' }

const NAV = [
  { id: 'about', label: 'About' }, { id: 'skills', label: 'Skills' }, { id: 'journey', label: 'Journey' },
  { id: 'projects', label: 'Projects' }, { id: 'contact', label: 'Contact' },
]

const TRAITS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Zap, title: 'Fast execution', text: 'Turns an idea into a running feature quickly, then refines it.' },
  { icon: Brain, title: 'Problem solver', text: 'Breaks tangled problems into small steps and works through them.' },
  { icon: Rocket, title: 'Highly motivated', text: 'Keeps learning new tools and takes on work that stretches her.' },
]

const SKILLS: { cat: string; icon: LucideIcon; items: string[] }[] = [
  { cat: 'Frontend', icon: Code2, items: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Next.js', 'Vue.js', 'Vuetify', 'Bootstrap', 'Drupal'] },
  { cat: 'Backend', icon: Server, items: ['Node.js', 'Express.js', 'C#', '.NET Framework', 'Clean Architecture'] },
  { cat: 'Databases & tools', icon: Database, items: ['MS SQL Server', 'MySQL', 'Git', 'GitHub', 'VS Code', 'Visual Studio', 'SSMS', 'Postman', 'Swagger'] },
]

const TIMELINE: { icon: LucideIcon; kind: string; hue: string; title: string; org: string; when: string; text: string }[] = [
  { icon: Briefcase, kind: 'Work', hue: 'var(--jade)', title: 'Software Development Intern', org: 'Naung Yoe Technologies Co., Ltd.', when: 'May 2026 – July 2026',
    text: 'Contributed to the Warehouse and Finance modules of the Inventory Control System using Next.js, Node.js, Vue.js, Drupal, Vuetify, Express.js, C# and MS SQL Server.' },
  { icon: GraduationCap, kind: 'Education', hue: 'var(--lotus)', title: 'Computer Science Degree', org: 'University of Computer Studies, Meiktila', when: 'Awaiting graduation',
    text: 'Finished the computer science programme and waiting to graduate. Built full-stack projects across web, desktop and NLP along the way.' },
  { icon: Trophy, kind: 'Award', hue: 'var(--gold)', title: '3rd Prize, Scenario-based Design', org: 'Competition: Interior Home Decoration', when: 'Achievement',
    text: 'Placed third in a competition on scenario-based design.' },
]

const PROJECTS: { icon: LucideIcon; title: string; text: string; tech: string[] }[] = [
  { icon: HeartHandshake, title: 'Unity-Care', text: 'Web platform for managing charity events, volunteer participation and user activities.', tech: ['Vue.js', 'Node.js', 'Express.js', 'MySQL'] },
  { icon: CalendarDays, title: 'University Events & Volunteers', text: 'Manages university events, volunteer registration and participation.', tech: ['Next.js', 'Node.js', 'Express.js', 'MS SQL Server'] },
  { icon: Boxes, title: 'Inventory Management', text: 'Warehouse and Finance modules covering stock, budget approvals and supplier ordering workflows.', tech: ['Vuetify', 'C#', '.NET Framework', 'MS SQL Server'] },
  { icon: FileSearch, title: 'Resume Analysis (NLP)', text: 'Extracts resume information and ranks candidates by similarity to job requirements.', tech: ['Python', 'Streamlit'] },
  { icon: Puzzle, title: 'IQ Test Game', text: 'Interactive IQ test with multiple-choice questions, answer validation and score calculation.', tech: ['C#'] },
  { icon: Compass, title: 'Tour Guide Website', text: 'Full-stack site for exploring destinations, managing profiles and accessing travel info.', tech: ['Next.js', 'Node.js', 'MySQL'] },
]

/* ───────────── Styles ───────────── */
const CSS = `
:root{--bg:#eef2fb;--fg:#101733;--muted:#555f85;--card:rgba(255,255,255,.72);--border:rgba(16,23,51,.12);--lotus:#5b43e6;--jade:#0a9c79;--gold:#b87400;--orb:.3;color-scheme:light}
[data-theme=dark]{--bg:#070b1a;--fg:#eef1ff;--muted:#9aa3c7;--card:rgba(255,255,255,.055);--border:rgba(255,255,255,.12);--lotus:#8f7dff;--jade:#2ee6b6;--gold:#ffc94d;--orb:.5;color-scheme:dark}
html{scroll-behavior:smooth;scrollbar-width:thin;scrollbar-color:var(--lotus) var(--bg)}
body{background:var(--bg);color:var(--fg)}
::-webkit-scrollbar{width:10px}::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:linear-gradient(var(--lotus),var(--jade));border-radius:99px;border:2px solid var(--bg)}
::selection{background:var(--lotus);color:#fff}
section[id]{scroll-margin-top:4.5rem}
.glass{background:var(--card);border:1px solid var(--border);-webkit-backdrop-filter:blur(18px) saturate(140%);backdrop-filter:blur(18px) saturate(140%);box-shadow:0 12px 40px -16px rgba(0,0,0,.45)}
.font-display{font-family:var(--font-display),Georgia,serif}
.grad-bg{background:linear-gradient(100deg,var(--lotus),var(--jade) 60%,var(--gold))}
.ring-focus:focus-visible{outline:2px solid var(--jade);outline-offset:3px}
.spot{position:relative;overflow:hidden}
.spot::before{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity .3s;background:radial-gradient(320px circle at var(--mx,50%) var(--my,50%),color-mix(in srgb,var(--lotus) 32%,transparent),transparent 70%)}
.spot:hover::before{opacity:1}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
`

/* ───────────── Building blocks ───────────── */
const ease = [0.22, 1, 0.36, 1] as const
const wrap = 'mx-auto px-5 py-14 sm:py-20'

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease }} className={className}>{children}</motion.div>
  )
}

function Spot({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`spot ${className}`}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
        e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
      }}>{children}</div>
  )
}

function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0), y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 16 }), sy = useSpring(y, { stiffness: 220, damping: 16 })
  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} className="inline-block"
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect(); if (!r) return
        x.set((e.clientX - r.left - r.width / 2) * 0.3); y.set((e.clientY - r.top - r.height / 2) * 0.3)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}>{children}</motion.div>
  )
}

function SectionTitle({ title, sub }: { title: string; sub: string }) {
  return (
    <Reveal className="mx-auto mb-10 max-w-xl text-center">
      <h2 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h2>
      <p className="mt-3 text-[var(--muted)]">{sub}</p>
    </Reveal>
  )
}

function CvButtons({ align = 'start' }: { align?: 'start' | 'center' }) {
  const b = 'ring-focus glass inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold'
  return (
    <div className={`flex flex-wrap gap-3 ${align === 'center' ? 'justify-center' : 'justify-center lg:justify-start'}`}>
      <Magnetic><a href={CV_FILE} target="_blank" rel="noreferrer" className={b}><Eye size={18} />View CV</a></Magnetic>
      <Magnetic><a href={CV_FILE} download="SuZarAung_CV.pdf" className={b}><Download size={18} />Download CV</a></Magnetic>
    </div>
  )
}

function Particles({ dark }: { dark: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current, ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0, h = 0, raf = 0
    const resize = () => { w = canvas.clientWidth; h = canvas.clientHeight; canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0) }
    resize()
    const count = Math.min(70, Math.floor((w * h) / 16000))
    const pts = Array.from({ length: count }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: Math.random() * 1.6 + 0.6 }))
    const rgb = dark ? '255,255,255' : '40,30,80'
    const tick = () => {
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]; p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(${rgb},.6)`; ctx.fill()
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y)
          if (d < 110) { ctx.strokeStyle = `rgba(${rgb},${0.15 * (1 - d / 110)})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke() }
        }
      }
      raf = requestAnimationFrame(tick)
    }
    tick(); window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [dark])
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />
}

function Orbs() {
  const reduce = useReducedMotion()
  const drift = (dx: number, dy: number, d: number) =>
    reduce ? undefined : { animate: { x: [0, dx, 0], y: [0, dy, 0] }, transition: { duration: d, repeat: Infinity, ease: 'easeInOut' as const } }
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" style={{ opacity: 'var(--orb)' }} aria-hidden>
      <motion.div {...drift(80, 60, 18)} className="absolute -left-32 -top-32 h-[34rem] w-[34rem] rounded-full bg-[var(--lotus)] blur-[130px]" />
      <motion.div {...drift(-70, 90, 22)} className="absolute -right-40 top-1/3 h-[32rem] w-[32rem] rounded-full bg-[var(--jade)] blur-[150px]" />
      <motion.div {...drift(60, -80, 26)} className="absolute -bottom-40 left-1/4 h-[30rem] w-[30rem] rounded-full bg-[var(--gold)] blur-[160px]" />
    </div>
  )
}

/* ───────────── Navbar ───────────── */
function Navbar({ dark, toggle }: { dark: boolean; toggle: () => void }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    NAV.forEach((n) => { const el = document.getElementById(n.id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])
  return (
    <motion.header initial={{ y: -90, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.1, duration: 0.8, ease }}
      className="fixed inset-x-0 top-4 z-50 mx-auto w-[calc(100%-2rem)] max-w-5xl">
      <nav className="glass flex items-center justify-between rounded-full px-4 py-2.5 sm:px-6" aria-label="Main">
        <a href="#top" className="ring-focus font-display text-lg font-semibold">Su Zar Aung</a>
        <ul className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <li key={n.id}>
              <a href={`#${n.id}`} className="ring-focus relative block rounded-full px-4 py-1.5 text-sm text-[var(--muted)] transition-colors hover:text-[var(--fg)]">
                {active === n.id && <motion.span layoutId="navpill" className="absolute inset-0 rounded-full bg-[var(--border)]" />}
                <span className={`relative ${active === n.id ? 'text-[var(--fg)]' : ''}`}>{n.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1">
          <a href={CV_FILE} download="SuZarAung_CV.pdf" className="ring-focus grad-bg hidden items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold text-[#101733] sm:inline-flex"><Download size={14} />CV</a>
          <button onClick={toggle} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} className="ring-focus grid h-9 w-9 place-items-center rounded-full transition hover:bg-[var(--border)]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={dark ? 'm' : 's'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </motion.span>
            </AnimatePresence>
          </button>
          <button onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open} className="ring-focus grid h-9 w-9 place-items-center rounded-full hover:bg-[var(--border)] md:hidden">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.ul initial={{ opacity: 0, y: -10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.97 }} className="glass mt-2 rounded-3xl p-2 md:hidden">
            {NAV.map((n) => (<li key={n.id}><a href={`#${n.id}`} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 text-center hover:bg-[var(--border)]">{n.label}</a></li>))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

/* ───────────── Hero ───────────── */
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }
const rise: Variants = { hidden: { opacity: 0, y: 36 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } }

function Hero({ ready, dark }: { ready: boolean; dark: boolean }) {
  const reduce = useReducedMotion()
  const [imgFailed, setImgFailed] = useState(false)
  const float = (d: number) => (reduce ? {} : { animate: { y: [0, -12, 0] }, transition: { duration: 5 + d, repeat: Infinity, ease: 'easeInOut' as const } })
  const frame = 'rounded-t-[999px] rounded-b-[2.5rem]'
  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden">
      <Particles dark={dark} />
      <motion.div variants={stagger} initial="hidden" animate={ready ? 'show' : 'hidden'}
        className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pb-16 pt-28 lg:grid-cols-[1.15fr_.85fr]">
        <div className="text-center lg:text-left">
          <motion.p variants={rise} className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-[var(--muted)]">
            <MapPin size={14} className="text-[var(--jade)]" /> Pobba Thiri, Nay Pyi Taw
          </motion.p>
          <h1 aria-label="Su Zar Aung" className="font-display mt-6 text-6xl font-semibold leading-[.95] tracking-tight sm:text-7xl xl:text-8xl">
            {'Su Zar Aung'.split(' ').map((word, wi) => (
              <span key={wi} aria-hidden className="mr-4 inline-block whitespace-nowrap last:mr-0">
                {word.split('').map((c, ci) => (<motion.span key={ci} variants={rise} className="inline-block">{c}</motion.span>))}
              </span>
            ))}
          </h1>
          <motion.p variants={rise} className="mt-6 text-xl font-medium sm:text-2xl">Entry-Level Software Developer</motion.p>
          <motion.p variants={rise} className="mx-auto mt-2 max-w-md text-[var(--muted)] lg:mx-0">Computer Science student awaiting graduation at the University of Computer Studies, Meiktila.</motion.p>
          <motion.p variants={rise} className="font-display mt-5 text-2xl italic text-[var(--gold)]">Building a better tomorrow through technology.</motion.p>
          <motion.div variants={rise} className="mt-8 flex flex-col items-center gap-3 lg:items-start">
            <Magnetic><a href="#projects" className="ring-focus grad-bg inline-block rounded-full px-7 py-3 font-semibold text-[#101733] shadow-lg shadow-[var(--lotus)]/30">View my projects</a></Magnetic>
            <CvButtons />
          </motion.div>
        </div>

        <motion.div variants={rise} className="relative mx-auto h-[400px] w-[290px] sm:h-[460px] sm:w-[340px]">
          <motion.div animate={reduce ? undefined : { opacity: [0.45, 0.85, 0.45] }} transition={{ duration: 5, repeat: Infinity }}
            className={`absolute -inset-2 ${frame} bg-[conic-gradient(from_200deg,var(--lotus),var(--gold),var(--jade),var(--lotus))] blur-xl`} />
          <div className={`glass relative h-full w-full overflow-hidden p-2 ${frame}`}>
            <div className={`h-full w-full overflow-hidden ${frame} bg-[var(--card)]`}>
              {imgFailed ? (
                <div className="grad-bg grid h-full w-full place-items-center"><span className="font-display text-7xl font-semibold text-[#101733]">SZA</span></div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={PROFILE_IMAGE} alt="Portrait of Su Zar Aung" onError={() => setImgFailed(true)} className="h-full w-full object-cover" />
              )}
            </div>
          </div>
          <motion.div {...float(0)} className="glass absolute -left-6 top-16 flex items-center gap-2 rounded-2xl px-3 py-2 text-sm"><Languages size={16} className="text-[var(--jade)]" /> Japanese N5</motion.div>
          <motion.div {...float(1.5)} className="glass absolute -right-4 bottom-20 flex items-center gap-2 rounded-2xl px-3 py-2 text-sm"><Briefcase size={16} className="text-[var(--gold)]" /> Intern at Naung Yoe</motion.div>
        </motion.div>
      </motion.div>
      <a href="#about" aria-label="Scroll to about" className="ring-focus absolute bottom-5 left-1/2 -translate-x-1/2 text-[var(--muted)]">
        <motion.span animate={reduce ? undefined : { y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }} className="block"><ArrowDown /></motion.span>
      </a>
    </section>
  )
}

/* ───────────── About: bento ───────────── */
function About() {
  return (
    <section id="about" className={`${wrap} max-w-6xl`}>
      <SectionTitle title="What I bring" sub="A developer at the start of her career, ready to contribute from day one." />
      <div className="grid gap-4 md:grid-cols-6">
        <Reveal className="md:col-span-4 md:row-span-2">
          <Spot className="glass flex h-full min-h-[18rem] flex-col justify-between rounded-[2rem] p-8">
            <p className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              I build full-stack products that move from idea to working feature, fast.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {['Myanmar', 'English', 'Japanese (N5)'].map((l) => (
                <span key={l} className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-1.5 text-sm"><Languages size={14} className="text-[var(--jade)]" />{l}</span>
              ))}
            </div>
          </Spot>
        </Reveal>
        {TRAITS.map((t, i) => (
          <Reveal key={t.title} delay={0.08 * (i + 1)} className={i === 0 ? 'md:col-span-2' : i === 1 ? 'md:col-span-2' : 'md:col-span-6'}>
            <motion.div whileHover={{ rotate: i === 1 ? 1.2 : -1.2, scale: 1.02 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }} className="h-full">
              <Spot className="glass flex h-full items-start gap-4 rounded-[2rem] p-6">
                <span className="grad-bg grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-[#101733]"><t.icon size={20} /></span>
                <div><h3 className="font-display text-lg font-semibold">{t.title}</h3><p className="mt-1 text-sm text-[var(--muted)]">{t.text}</p></div>
              </Spot>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ───────────── Skills: category panels ───────────── */
function Skills() {
  return (
    <section id="skills" className={`${wrap} max-w-6xl`}>
      <SectionTitle title="Skills" sub="Grouped by the layer of the stack where I use them." />
      <div className="grid gap-5 lg:grid-cols-3">
        {SKILLS.map((g, gi) => (
          <Reveal key={g.cat} delay={gi * 0.1}>
            <Spot className="glass h-full rounded-[2rem] p-6">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grad-bg grid h-11 w-11 place-items-center rounded-2xl text-[#101733]"><g.icon size={20} /></span>
                  <h3 className="font-display text-xl font-semibold">{g.cat}</h3>
                </div>
                <span className="font-display text-3xl font-semibold text-[var(--muted)]">{g.items.length}</span>
              </div>
              <motion.ul initial="hidden" whileInView="show" viewport={{ once: true }} variants={{ show: { transition: { staggerChildren: 0.05 } } }} className="flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <motion.li key={s} variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1 } }} whileHover={{ y: -3, scale: 1.06 }}
                    className="cursor-default rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-sm font-medium">{s}</motion.li>
                ))}
              </motion.ul>
            </Spot>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ───────────── Journey: scroll-drawn timeline ───────────── */
function Journey() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const grow = useSpring(scrollYProgress, { stiffness: 100, damping: 24 })
  return (
    <section id="journey" className={`${wrap} max-w-3xl`}>
      <SectionTitle title="Experience & education" sub="Where I have worked, studied and been recognised." />
      <div ref={ref} className="relative pl-12">
        <div className="absolute bottom-2 left-[19px] top-2 w-0.5 rounded bg-[var(--border)]" />
        <motion.div style={{ scaleY: grow }} className="absolute bottom-2 left-[19px] top-2 w-0.5 origin-top rounded bg-gradient-to-b from-[var(--lotus)] via-[var(--jade)] to-[var(--gold)]" />
        {TIMELINE.map((t) => (
          <Reveal key={t.title} className="relative mb-6 last:mb-0">
            <span className="absolute -left-12 top-5 grid h-10 w-10 place-items-center rounded-full border-2 bg-[var(--bg)]" style={{ borderColor: t.hue, color: t.hue }}><t.icon size={17} /></span>
            <Spot className="glass rounded-3xl p-6">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="rounded-full px-3 py-0.5 text-xs font-semibold text-[#101733]" style={{ background: t.hue }}>{t.kind}</span>
                <span className="text-sm text-[var(--muted)]">{t.when}</span>
              </div>
              <h3 className="font-display mt-3 text-xl font-semibold">{t.title}</h3>
              <p className="text-sm font-medium" style={{ color: t.hue }}>{t.org}</p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{t.text}</p>
            </Spot>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ───────────── Projects: Modern Grid Layout without Images ───────────── */
function Projects() {
  return (
    <section id="projects" className={`${wrap} max-w-6xl`}>
      <SectionTitle title="Featured projects" sub="Full-stack web, desktop application, and NLP software development." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.08}>
            <Spot className="glass flex h-full flex-col justify-between rounded-[2rem] p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
              <div>
                <div className="mb-5 flex items-center justify-between">
                  <span className="grad-bg grid h-12 w-12 place-items-center rounded-2xl text-[#101733]">
                    <p.icon size={22} />
                  </span>
                  <span className="font-display text-2xl font-semibold text-[var(--muted)]/40">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="font-display text-2xl font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{p.text}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-[var(--border)]">
                <ul className="flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <li key={t} className="rounded-full border border-[var(--border)] bg-[var(--card)] px-3 py-1 text-xs font-medium">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Spot>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ───────────── Contact ───────────── */
type Status = 'idle' | 'sending' | 'success' | 'error'

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Partial<typeof form>>({})
  const [status, setStatus] = useState<Status>('idle')
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const next: Partial<typeof form> = {}
    if (!form.name.trim()) next.name = 'Enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.'
    if (form.message.trim().length < 10) next.message = 'Write at least 10 characters.'
    setErrors(next)
    if (Object.keys(next).length) return
    setStatus('sending')
    try {
      if (CONTACT_ENDPOINT) {
        const res = await fetch(CONTACT_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(form) })
        if (!res.ok) throw new Error('send failed')
      } else if (CONTACT.email) {
        window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent('Portfolio message from ' + form.name)}&body=${encodeURIComponent(`${form.message}\n\n${form.name} (${form.email})`)}`
      } else throw new Error('no target')
      setStatus('success'); setForm({ name: '', email: '', message: '' })
    } catch { setStatus('error') }
  }
  const field = 'ring-focus w-full rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm placeholder:text-[var(--muted)]/70 focus:border-[var(--lotus)]'
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const btn = 'ring-focus glass flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold'
  return (
    <section id="contact" className={`${wrap} max-w-5xl`}>
      <SectionTitle title="Let’s work together" sub="Tell me about the role or project, and I will reply soon." />
      <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <div className="space-y-6">
          <Reveal>
            <div className="glass rounded-3xl p-6">
              <h3 className="font-display text-lg font-semibold">Details</h3>
              <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
                <li className="flex items-start gap-3"><MapPin size={18} className="mt-0.5 shrink-0 text-[var(--jade)]" />Pobba Thiri, Nay Pyi Taw</li>
                <li className="flex items-start gap-3"><Languages size={18} className="mt-0.5 shrink-0 text-[var(--jade)]" />Myanmar, English, Japanese (N5)</li>
                {CONTACT.email && <li className="flex items-start gap-3"><Mail size={18} className="mt-0.5 shrink-0 text-[var(--jade)]" /><a className="ring-focus underline underline-offset-4" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>}
              </ul>
              {(CONTACT.github || CONTACT.linkedin) && (
                <div className="mt-5 flex gap-2">
                  {CONTACT.github && <a className="ring-focus glass grid h-10 w-10 place-items-center rounded-full" href={CONTACT.github} aria-label="GitHub" target="_blank" rel="noreferrer"><Github size={18} /></a>}
                  {CONTACT.linkedin && <a className="ring-focus glass grid h-10 w-10 place-items-center rounded-full" href={CONTACT.linkedin} aria-label="LinkedIn" target="_blank" rel="noreferrer"><Linkedin size={18} /></a>}
                </div>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="glass rounded-3xl p-6">
              <h3 className="font-display text-lg font-semibold">My CV</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">Read it online or keep a copy as a PDF.</p>
              <div className="mt-4 space-y-2.5">
                <a href={CV_FILE} target="_blank" rel="noreferrer" className={btn}><Eye size={17} />View CV</a>
                <a href={CV_FILE} download="SuZarAung_CV.pdf" className={`${btn} grad-bg !border-transparent text-[#101733]`}><Download size={17} />Download CV</a>
              </div>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <div className="glass relative h-full min-h-[26rem] rounded-3xl p-7">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} role="status" className="flex min-h-[22rem] flex-col items-center justify-center text-center">
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 }}><CheckCircle2 size={64} className="text-[var(--jade)]" /></motion.span>
                  <h3 className="font-display mt-5 text-2xl font-semibold">{CONTACT_ENDPOINT ? 'Message sent' : 'Email app opened'}</h3>
                  <p className="mt-2 max-w-xs text-sm text-[var(--muted)]">{CONTACT_ENDPOINT ? 'Thank you for reaching out. I will get back to you soon.' : 'Press send in your email app to finish.'}</p>
                  <button onClick={() => setStatus('idle')} className="ring-focus glass mt-6 rounded-full px-6 py-2.5 text-sm font-medium">Send another message</button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  <h3 className="font-display text-lg font-semibold">Send a message</h3>
                  {([['name', 'Your name', 'text'], ['email', 'Your email address', 'email']] as const).map(([k, label, type]) => (
                    <div key={k}>
                      <label htmlFor={k} className="mb-1.5 block text-sm font-medium">{label}</label>
                      <input id={k} type={type} value={form[k]} onChange={set(k)} className={field} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `${k}-err` : undefined} />
                      {errors[k] && <p id={`${k}-err`} className="mt-1 text-xs text-[var(--lotus)]">{errors[k]}</p>}
                    </div>
                  ))}
                  <div>
                    <label htmlFor="message" className="mb-1.5 block text-sm font-medium">Message</label>
                    <textarea id="message" rows={5} value={form.message} onChange={set('message')} className={`${field} resize-none`} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-err' : undefined} />
                    {errors.message && <p id="message-err" className="mt-1 text-xs text-[var(--lotus)]">{errors.message}</p>}
                  </div>
                  {status === 'error' && (<p role="alert" className="flex items-center gap-2 text-sm text-[var(--lotus)]"><AlertCircle size={16} />{CONTACT_ENDPOINT || CONTACT.email ? 'Your message did not send. Try again.' : 'Sending is not set up yet. Add CONTACT_ENDPOINT or CONTACT.email.'}</p>)}
                  <button type="submit" disabled={status === 'sending'} className="ring-focus grad-bg flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-[#101733] transition disabled:opacity-60">
                    {status === 'sending' ? (<><motion.span animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }} className="h-4 w-4 rounded-full border-2 border-[#101733] border-t-transparent" />Sending</>) : (<><Send size={16} />Send message</>)}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-[var(--border)] px-5 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-display text-lg font-semibold">Su Zar Aung</p>
          <p className="text-sm text-[var(--muted)]">© {new Date().getFullYear()} Su Zar Aung. Built with Next.js, Tailwind CSS and Framer Motion.</p>
        </div>
        <div className="flex items-center gap-2">
          {CONTACT.github && <a className="ring-focus glass grid h-10 w-10 place-items-center rounded-full" href={CONTACT.github} aria-label="GitHub" target="_blank" rel="noreferrer"><Github size={18} /></a>}
          {CONTACT.linkedin && <a className="ring-focus glass grid h-10 w-10 place-items-center rounded-full" href={CONTACT.linkedin} aria-label="LinkedIn" target="_blank" rel="noreferrer"><Linkedin size={18} /></a>}
          <a href="#top" aria-label="Back to top" className="ring-focus glass grid h-10 w-10 place-items-center rounded-full"><ArrowUp size={18} /></a>
        </div>
      </div>
    </footer>
  )
}

/* ───────────── Intro: the stack builds itself ───────────── */
function Loader({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t) }, [onDone])
  const layers = [
    { icon: Code2, name: 'Frontend', tech: 'Next.js · Vue.js · TypeScript', c: 'var(--lotus)' },
    { icon: Server, name: 'Backend', tech: 'Node.js · Express · C# · .NET', c: 'var(--jade)' },
    { icon: Database, name: 'Database', tech: 'MS SQL Server · MySQL', c: 'var(--gold)' },
  ]
  return (
    <motion.div key="loader" onClick={onDone} exit={{ y: '-100%', borderBottomLeftRadius: '50% 12%', borderBottomRightRadius: '50% 12%' }} transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[100] grid cursor-pointer place-items-center overflow-hidden bg-[var(--bg)]">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-50">
        <motion.div animate={{ x: [0, 60, 0], y: [0, 40, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-[var(--lotus)] blur-[100px]" />
        <motion.div animate={{ x: [0, -60, 0], y: [0, -40, 0] }} transition={{ duration: 7, repeat: Infinity }} className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-[var(--jade)] blur-[100px]" />
      </div>
      <div className="relative w-full max-w-md px-6">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} className="font-display text-center text-4xl font-semibold sm:text-5xl">Su Zar Aung</motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-2 text-center text-[var(--muted)]">Full-stack developer</motion.p>
        <div className="relative mt-10 space-y-4">
          <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.6, duration: 1.7, ease: 'linear' }} className="grad-bg absolute bottom-6 left-[35px] top-6 w-0.5 origin-top" />
          {layers.map((l, i) => (
            <motion.div key={l.name} initial={{ opacity: 0, x: -30, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ delay: 0.6 + i * 0.55, duration: 0.6, ease }}
              className="glass relative flex items-center gap-4 rounded-2xl p-3.5">
              <span className="grid h-11 w-11 place-items-center rounded-xl text-[#101733]" style={{ background: l.c }}><l.icon size={20} /></span>
              <div><p className="font-semibold">{l.name}</p><p className="text-xs text-[var(--muted)]">{l.tech}</p></div>
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 + i * 0.55, type: 'spring', stiffness: 300, damping: 15 }} className="ml-auto"><CheckCircle2 size={22} style={{ color: l.c }} /></motion.span>
            </motion.div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-[var(--muted)]">Tap to skip</p>
      </div>
    </motion.div>
  )
}

/* ───────────── Page ───────────── */
export default function Page() {
  const [dark, setDark] = useState(false) // light mode by default
  const [ready, setReady] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })
  const done = useCallback(() => setReady(true), [])

  useEffect(() => {
    try { const saved = localStorage.getItem('theme'); if (saved) setDark(saved === 'dark') } catch { /* storage unavailable */ }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    try { localStorage.setItem('theme', dark ? 'dark' : 'light') } catch { /* ignore */ }
  }, [dark])

  useEffect(() => { document.body.style.overflow = ready ? '' : 'hidden' }, [ready])

  return (
    <div className={`${display.variable} ${body.variable} relative min-h-screen overflow-x-clip`} style={{ fontFamily: 'var(--font-body), system-ui, sans-serif' }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Orbs />
      <motion.div style={{ scaleX: progress }} className="grad-bg fixed inset-x-0 top-0 z-[60] h-0.5 origin-left" />
      <AnimatePresence>{!ready && <Loader onDone={done} />}</AnimatePresence>
      <Navbar dark={dark} toggle={() => setDark((d) => !d)} />
      <main><Hero ready={ready} dark={dark} /><About /><Skills /><Journey /><Projects /><Contact /></main>
      <Footer />
    </div>
  )
}