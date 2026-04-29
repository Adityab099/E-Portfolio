import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  FaBolt,
  FaCogs,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaMagic,
  FaMoon,
  FaStar,
  FaSun,
  FaTrophy,
} from 'react-icons/fa'
import { FiDownload, FiFileText, FiUploadCloud } from 'react-icons/fi'
import jsPDF from 'jspdf'
import './portfolio.css'

type ExperienceItem = {
  id: string
  title: string
  org: string
  date: string
  bullets: string[]
  tech: string[]
}

type Project = {
  id: string
  title: string
  description: string
  tech: string[]
  githubUrl?: string
  liveUrl?: string
  highlights: string[]
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function useTypewriter(text: string, speedMs = 18) {
  const reducedMotion = useReducedMotion()
  const [out, setOut] = useState('')

  useEffect(() => {
    if (reducedMotion) {
      setOut(text)
      return
    }
    setOut('')
    let i = 0
    const t = window.setInterval(() => {
      i += 1
      setOut(text.slice(0, i))
      if (i >= text.length) window.clearInterval(t)
    }, speedMs)
    return () => window.clearInterval(t)
  }, [reducedMotion, speedMs, text])

  return out
}

function TiltCard({
  children,
  className,
  style,
  onClick,
  role,
  tabIndex,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
  role?: string
  tabIndex?: number
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const reducedMotion = useReducedMotion()

  function onMove(e: React.MouseEvent) {
    if (reducedMotion) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const rx = clamp((0.5 - y) * 10, -8, 8)
    const ry = clamp((x - 0.5) * 10, -8, 8)
    el.style.setProperty('--rx', `${rx}deg`)
    el.style.setProperty('--ry', `${ry}deg`)
  }

  function onLeave() {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', `0deg`)
    el.style.setProperty('--ry', `0deg`)
  }

  return (
    <div
      ref={ref}
      className={className}
      style={style}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      role={role}
      tabIndex={tabIndex}
    >
      {children}
    </div>
  )
}

export default function App() {
  const portfolioEmail = 'adityakbhardwaj01@gmail.com'
  const linkedinUrl = 'https://www.linkedin.com/in/aditya-bhardwaj-b89381297/'
  const githubUrl = 'https://github.com/099Aditya'
  const reducedMotion = useReducedMotion()

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || saved === 'light') return saved
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  const [avatarOk, setAvatarOk] = useState(true)

  const tagline = 'Building scalable systems & ML-powered digital solutions'
  const typedTagline = useTypewriter(tagline, 16)

  const experienceItems: ExperienceItem[] = useMemo(
    () => [
      {
        id: 'peerprep',
        title: 'Software Engineering Intern',
        org: 'Peerprep',
        date: 'Sep 2025 – Nov 2025',
        bullets: [
          'Engineered a document detection and perspective correction pipeline using OpenCV to digitize academic marksheets across multiple education boards.',
          'Delivered 99.98% extraction accuracy and reduced per-record processing time from 10 minutes to ~30 seconds (30× speedup).',
        ],
        tech: ['Python', 'OpenCV', 'OCR', 'Git', 'GitHub'],
      },
    ],
    []
  )

  const projects: Project[] = useMemo(
    () => [
      {
        id: 'campushub',
        title: 'CampusHub – Student Services Platform',
        description:
          'Multi-service backend with JWT auth & RBAC, designed for scalable student operations (PG, mess, grocery).',
        tech: ['Spring Boot', 'JWT', 'RBAC', 'PostgreSQL', 'REST APIs'],
        githubUrl: 'https://github.com/099Aditya/CampusHub',
        highlights: [
          '58 REST APIs with authentication and role-based authorization.',
          '14-table normalized PostgreSQL schema (BCNF) for faster reads.',
          'Service-oriented backend architecture for future expansion.',
        ],
      },
      {
        id: 'doc-oc',
        title: 'DOC-OC – Document Extraction System',
        description:
          'YOLO + OCR pipeline for structured extraction with FastAPI backend and React UI.',
        tech: ['YOLO', 'OCR', 'FastAPI', 'React'],
        githubUrl: 'https://github.com/099Aditya/DOC-OC',
        highlights: [
          '99.98% extraction accuracy.',
          '30× speedup vs baseline processing pipeline.',
          'Real-time extraction results in the frontend.',
        ],
      },
      {
        id: 'cargo-laytime',
        title: 'Cargo Laytime – Maritime Automation',
        description:
          'GenAI-driven automation for maritime SOF extraction and laytime calculation workflows.',
        tech: ['GenAI', 'OCR', 'Automation Pipeline'],
        githubUrl: 'https://github.com/099Aditya/IME-MariTHON',
        highlights: [
          '50% reduction in manual processing time.',
          'Full automation pipeline for extraction + calculation.',
          'Hackathon winner with industry deployment.',
        ],
      },
    ],
    []
  )

  const skillsByCategory = useMemo(
    () => [
      {
        category: 'Programming',
        items: [
          { name: 'Java', level: 88 },
          { name: 'Python', level: 92 },
          { name: 'SQL', level: 82 },
          { name: 'C++', level: 78 },
        ],
      },
      {
        category: 'Web',
        items: [
          { name: 'HTML', level: 86 },
          { name: 'CSS', level: 82 },
          { name: 'JavaScript', level: 80 },
          { name: 'React', level: 84 },
        ],
      },
      {
        category: 'Backend & Tools',
        items: [
          { name: 'Spring Boot', level: 90 },
          { name: 'FastAPI / Flask', level: 85 },
          { name: 'Docker', level: 76 },
          { name: 'Postman', level: 82 },
          { name: 'Git / GitHub', level: 88 },
        ],
      },
      {
        category: 'ML / AI',
        items: [
          { name: 'PyTorch', level: 83 },
          { name: 'OpenCV', level: 90 },
          { name: 'YOLO', level: 86 },
        ],
      },
    ],
    []
  )

  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const activeProject = projects.find((p) => p.id === activeProjectId) ?? null

  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [contactErr, setContactErr] = useState<string | null>(null)
  const [contactLoading, setContactLoading] = useState(false)
  const [contactSent, setContactSent] = useState(false)

  // Academic Submission (client-side only): upload → preview → download.
  // Keep a default PDF visible/downloadable on first load and after reset.
  const DEFAULT_ESSAY_URL = '/1.pdf'
  const DEFAULT_ESSAY_NAME = '1.pdf'
  const [essayUrl, setEssayUrl] = useState<string | null>(DEFAULT_ESSAY_URL)
  const [essayDownloadName, setEssayDownloadName] = useState<string | null>(DEFAULT_ESSAY_NAME)
  const [essayPagesCount, setEssayPagesCount] = useState<number | null>(null)
  const [essayUpdatedAt, setEssayUpdatedAt] = useState<string | null>(null)
  const [essayLoading, setEssayLoading] = useState(false)
  const [essayErr, setEssayErr] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (essayUrl?.startsWith('blob:')) URL.revokeObjectURL(essayUrl)
    }
  }, [essayUrl])

  function readFileAsDataURL(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  async function generatePdfFromImages(files: File[]) {
    const pdf = new jsPDF({ unit: 'pt', format: 'a4' })
    const pageW = pdf.internal.pageSize.getWidth()
    const pageH = pdf.internal.pageSize.getHeight()

    const loaded = await Promise.all(
      files.map(async (file) => {
        const dataUrl = await readFileAsDataURL(file)
        return { file, dataUrl }
      })
    )

    for (let i = 0; i < loaded.length; i++) {
      const { file, dataUrl } = loaded[i]
      if (i > 0) pdf.addPage()

      const img = new Image()
      img.src = dataUrl
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('Failed to load image'))
      })

      const imgW = img.naturalWidth || img.width
      const imgH = img.naturalHeight || img.height
      const imgRatio = imgW / imgH
      const pageRatio = pageW / pageH

      let drawW: number
      let drawH: number
      if (imgRatio > pageRatio) {
        drawW = pageW
        drawH = pageW / imgRatio
      } else {
        drawH = pageH
        drawW = pageH * imgRatio
      }

      const x = (pageW - drawW) / 2
      const y = (pageH - drawH) / 2

      const fmt = file.type === 'image/png' ? 'PNG' : 'JPEG'
      pdf.addImage(dataUrl, fmt, x, y, drawW, drawH)
    }

    const blob = pdf.output('blob')
    return blob
  }

  async function blobToBase64(blob: Blob) {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(blob)
    })
    // data:<mime>;base64,<base64> -> extract the <base64>
    const parts = dataUrl.split(',')
    return parts.length === 2 ? parts[1] : dataUrl
  }

  async function uploadLatestEssayPdf(pdfBlob: Blob, fileName: string) {
    const endpoint =
      (import.meta.env.VITE_UPLOAD_LATEST_ENDPOINT as string | undefined) ||
      '/.netlify/functions/upload-latest'

    const base64 = await blobToBase64(pdfBlob)
    const contentType = pdfBlob.type || 'application/pdf'

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ file: base64, contentType, filename: fileName }),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      if (res.status === 404) {
        throw new Error(
          `Upload failed (404). The upload API endpoint was not found. Deploy this site to Netlify (functions must be available) and redeploy. ${text}`.trim()
        )
      }
      throw new Error(`Upload failed (${res.status}). ${text}`.trim())
    }

    const json = (await res.json()) as { success?: boolean; url?: string; message?: string }
    if (!json.url || json.success === false) {
      throw new Error(`Upload did not return a URL. ${json.message || ''}`.trim())
    }
    return json.url
  }

  async function onEssayUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    setEssayErr(null)
    setEssayLoading(true)

    try {
      // Revoke previous preview (object URL)
      if (essayUrl?.startsWith('blob:')) URL.revokeObjectURL(essayUrl)

      const hasPdf = files.some((f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'))
      const hasImages = files.some((f) => f.type.startsWith('image/'))

      if (hasPdf) {
        if (files.length !== 1 || hasImages) {
          setEssayErr('Please upload either a single PDF OR multiple image pages.');
          return
        }

        const file = files[0]
        const localUrl = URL.createObjectURL(file)
        setEssayUrl(localUrl)
        setEssayDownloadName(file.name || 'handwritten-essay.pdf')
        setEssayPagesCount(null)
        setEssayUpdatedAt(new Date().toLocaleString())

        // Optional remote upload: keep local preview/download if endpoint is unavailable.
        try {
          const uploadUrl = await uploadLatestEssayPdf(file, file.name || 'handwritten-essay.pdf')
          setEssayUrl(uploadUrl)
          setEssayDownloadName('Handwritten_Essay.pdf')
        } catch {
          // Intentionally ignore upload endpoint errors (e.g. 404 in local/dev).
        }
        return
      }

      if (!hasImages) {
        setEssayErr('Unsupported file type. Please upload PDF or images.')
        return
      }

      // Multiple images -> generate a single multi-page PDF for preview + download.
      const imageFiles = files.filter((f) => f.type.startsWith('image/'))
      if (!imageFiles.length) {
        setEssayErr('No images found to generate a PDF.')
        return
      }

      const blob = await generatePdfFromImages(imageFiles)
      const localUrl = URL.createObjectURL(blob)
      setEssayUrl(localUrl)
      setEssayDownloadName('Handwritten_Essay.pdf')
      setEssayPagesCount(imageFiles.length)
      setEssayUpdatedAt(new Date().toLocaleString())

      try {
        const uploadUrl = await uploadLatestEssayPdf(blob, 'Handwritten_Essay.pdf')
        setEssayUrl(uploadUrl)
      } catch {
        // Intentionally ignore upload endpoint errors (e.g. 404 in local/dev).
      }
    } catch (err) {
      setEssayErr(err instanceof Error ? err.message : 'Failed to generate preview.')
    } finally {
      setEssayLoading(false)
    }
  }

  function scrollToId(id: string) {
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
  }

  function toggleTheme() {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }

  function validateEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
  }

  async function onSubmitContact(e: React.FormEvent) {
    e.preventDefault()
    setContactErr(null)
    setContactSent(false)

    const emailOk = validateEmail(contactEmail)
    const messageOk = contactMessage.trim().length >= 10
    if (!emailOk) return setContactErr('Please enter a valid email address.')
    if (!messageOk) return setContactErr('Message should be at least 10 characters long.')

    setContactLoading(true)
    try {
      const subject = `Portfolio message from ${contactName.trim() || 'a visitor'}`
      const body = contactMessage.trim()
      const url = `mailto:${encodeURIComponent(portfolioEmail)}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`
      await new Promise((r) => setTimeout(r, reducedMotion ? 0 : 650))
      window.location.href = url
      setContactSent(true)
    } finally {
      setContactLoading(false)
    }
  }

  const cursorEnabled = !reducedMotion
  const [cursor, setCursor] = useState({ x: -100, y: -100 })
  useEffect(() => {
    if (!cursorEnabled) return
    const onMove = (e: PointerEvent) => setCursor({ x: e.clientX, y: e.clientY })
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [cursorEnabled])

  return (
    <div className="appRoot">
      {cursorEnabled && (
        <div
          className="cursor"
          aria-hidden="true"
          style={{ transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)` }}
        />
      )}

      <header className="navbar">
        <div className="navbarInner">
          <button className="brand" onClick={() => scrollToId('home')} type="button">
            <span className="brandMark" aria-hidden="true" />
            <span className="brandText">Aditya Bhardwaj</span>
          </button>

          <nav className="navLinks" aria-label="Primary navigation">
            {[
              ['home', 'Home'],
              ['about', 'About'],
              ['experience', 'Experience'],
              ['skills', 'Skills'],
              ['projects', 'Projects'],
              ['assessments', 'Assessments'],
              ['achievements', 'Achievements'],
              ['contact', 'Contact'],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={id === 'assessments' ? 'navLink navLink--assessments' : 'navLink'}
                onClick={() => scrollToId(id)}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="navRight">
            <button
              className="themeBtn"
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FaMoon /> : <FaSun />}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section id="home" className="heroSection">
          <div className="bgFX" aria-hidden="true">
            <div className="gridGlow" />
            <div className="waves" />
            <div className="orb orbA" />
            <div className="orb orbB" />
          </div>

          <div className="container heroInner">
            <motion.div
              className="heroLeft"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <div className="kicker">BTech CSE (AI/ML) | Backend + ML Systems</div>
              <h1 className="heroTitle">
                Aditya Kumar <span className="accent">Bhardwaj</span>
              </h1>
              <p className="heroTagline">
                <span className="typeText">{typedTagline}</span>
                {!reducedMotion && <span className="cursorBlink">|</span>}
              </p>

              <p className="heroSub">
                Final-year Computer Science (AI/ML) student with backend engineering experience building scalable REST APIs and ML-powered pipelines.
              </p>

              <div className="heroCtas">
                <button
                  className="btn btnPrimary"
                  onClick={() => scrollToId('projects')}
                  type="button"
                >
                  View Projects
                </button>
                <a className="btn btnGhost" href="/Resume.pdf" download>
                  <span className="btnIcon" aria-hidden="true">
                    <FiDownload />
                  </span>
                  Download Resume
                </a>
              </div>

              <div className="heroMeta">
                <a className="metaChip" href={githubUrl} target="_blank" rel="noreferrer">
                  <span className="metaIcon" aria-hidden="true">
                    <FaGithub />
                  </span>
                  GitHub
                </a>
                <a className="metaChip" href={linkedinUrl} target="_blank" rel="noreferrer">
                  <span className="metaIcon" aria-hidden="true">
                    <FaLinkedin />
                  </span>
                  LinkedIn
                </a>
                <a className="metaChip" href={`mailto:${portfolioEmail}`}>
                  <span className="metaIcon" aria-hidden="true">
                    <FaEnvelope />
                  </span>
                  Email
                </a>
              </div>
            </motion.div>

            <motion.div
              className="heroRight"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <div className="profileCard">
                <div className="avatar" aria-label="Profile photo">
                  {avatarOk ? (
                    <img
                      src="/1.png"
                      className="avatarImg"
                      alt="Aditya Kumar Bhardwaj"
                      onError={() => setAvatarOk(false)}
                    />
                  ) : (
                    <span className="avatarText">AKB</span>
                  )}
                </div>
                <div className="profileStats">
                  <div className="stat">
                    <div className="statValue">30×</div>
                    <div className="statLabel">Pipeline speedup</div>
                  </div>
                  <div className="stat">
                    <div className="statValue">99.98%</div>
                    <div className="statLabel">Extraction accuracy</div>
                  </div>
                </div>
                <div className="floatingRow" aria-hidden="true">
                  <div className="floatChip">OpenCV</div>
                  <div className="floatChip">YOLO</div>
                  <div className="floatChip">Spring Boot</div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="scrollHint" aria-hidden="true">
            <div className="scrollDot" />
            <span>Scroll</span>
          </div>
        </section>

        <section id="about" className="section">
          <div className="container">
            <SectionHeader
              eyebrow="About Me"
              title="Engineering clean systems with cinematic polish."
              subtitle="I build backend APIs and ML pipelines that are fast, accurate, and production-minded."
            />

            <div className="aboutGrid">
              <motion.div
                className="aboutLeftCard"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55 }}
              >
                <div className="aboutAvatarRow">
                  <div className="aboutAvatar">
                    <span className="aboutAvatarText">AKB</span>
                  </div>
                  <div className="aboutIntro">
                    <h3 className="aboutName">Aditya Kumar Bhardwaj</h3>
                    <p className="aboutRole">BTech Computer Science (AI/ML)</p>
                  </div>
                </div>
                <p className="aboutBio">
                  Focused on scalable REST backends, robust database design, and ML-powered document extraction systems.
                  I enjoy turning complex pipelines into fast, reliable products.
                </p>
                <div className="aboutStatsRow" aria-hidden="true">
                  <div className="aboutStatPill">
                    <div className="aboutStatValue">99.98%</div>
                    <div className="aboutStatLabel">Extraction Accuracy</div>
                  </div>
                  <div className="aboutStatPill">
                    <div className="aboutStatValue">30×</div>
                    <div className="aboutStatLabel">Pipeline Speedup</div>
                  </div>
                </div>
                <div className="aboutBadges">
                  <span className="tag">BA</span>
                  <span className="tag">ML</span>
                  <span className="tag">AR</span>
                  <span className="tag">SP</span>
                  <span className="tag">DSA</span>
                  <span className="tag">System Design</span>
                  <span className="tag">OOP</span>
                  <span className="tag">ML Ops Mindset</span>
                </div>
              </motion.div>

              <motion.div
                className="aboutRight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: 0.05 }}
              >
                <h3 className="subTitle">Education</h3>
                <div className="timelineLine" aria-hidden="true" />
                <div className="timelineCard">
                  <div className="timelineDot" aria-hidden="true" />
                  <div className="timelineContent">
                    <div className="timelineTop">
                      <div className="timelineTitle">Graphic Era Hill University, Dehradun</div>
                      <div className="timelineDate">2023 – Present</div>
                    </div>
                    <div className="timelineMeta">
                      B.Tech Computer Science — Artificial Intelligence and Machine Learning
                    </div>
                  <div className="timelineDetail timelineDetailPill">
                    <span className="timelineDetailLabel">CGPA</span>
                    <span className="timelineDetailValue">7.48</span>
                  </div>
                  </div>
                  <div className="timelineGlow" aria-hidden="true" />
                </div>

                <h3 className="subTitle" style={{ marginTop: 26 }}>
                  Skill highlights
                </h3>
                <div className="iconGrid">
                  {[
                    { code: 'BA', label: 'Scalable REST APIs' },
                    { code: 'ML', label: 'Document Extraction' },
                    { code: 'AR', label: 'Architecture' },
                    { code: 'SP', label: 'Performance Optimization' },
                    { code: 'DSA', label: 'Data Structures & Algorithms' },
                    { code: 'SD', label: 'System Design' },
                    { code: 'OOP', label: 'Object-Oriented Programming' },
                    { code: 'ML Ops', label: 'ML Ops Mindset' },
                  ].map((s) => (
                    <motion.div
                      key={s.code}
                      className="iconCard"
                      whileHover={{ y: -3 }}
                      transition={{ type: 'spring', stiffness: 260 }}
                    >
                      <div className="iconGlyph" aria-hidden="true">
                        {s.code}
                      </div>
                      <div className="iconCardTitle">{s.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="experience" className="section sectionAlt">
          <div className="container">
            <SectionHeader
              eyebrow="Internships"
              title="Internship experience that performs."
              subtitle="A focused timeline built from your resume: measurable outcomes and production-minded engineering."
            />

            <div className="experienceWrap">
              <div className="expRail" aria-hidden="true" />
              <div className="expGrid">
                {experienceItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    className="expCard"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.6, delay: idx * 0.04 }}
                    whileHover={{
                      y: -4,
                      boxShadow:
                        '0 0 0 1px var(--accent-2), 0 14px 50px rgba(124,58,237,0.25)',
                    }}
                  >
                    <div className="expCardTop">
                      <div className="expBadge">{item.date}</div>
                      <div className="expRole">{item.title}</div>
                      <div className="expOrg">{item.org}</div>
                    </div>
                    <ul className="expBullets">
                      {item.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                    <div className="expTech">
                      {item.tech.slice(0, 7).map((t) => (
                        <span key={t} className="chip">
                          {t}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="section">
          <div className="container">
            <SectionHeader
              eyebrow="Skills"
              title="Tools and technologies I use to ship."
              subtitle="Clean category grouping with compact meters and precise hover feedback."
            />
            <div className="skillsGrid">
              {skillsByCategory.map((cat) => (
                <div key={cat.category} className="skillBlock">
                  <div className="skillBlockTitle">{cat.category}</div>
                  <div className="skillList">
                    {cat.items.map((s, idx) => (
                      <motion.div
                        key={s.name}
                        className="skillCard"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.45, delay: idx * 0.03 }}
                        whileHover={{ y: -2 }}
                      >
                        <div className="skillTop">
                          <span className="skillName">{s.name}</span>
                          <span className="skillLevel">{s.level}%</span>
                        </div>
                        <div className="meter" aria-hidden="true">
                          <motion.div
                            className="meterFill"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${s.level}%` }}
                            viewport={{ once: true, amount: 0.35 }}
                            transition={{ duration: 0.9, ease: 'easeOut' }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="projects" className="section sectionAlt">
          <div className="container">
            <SectionHeader
              eyebrow="Projects"
              title="Showcase of scalable systems and ML pipelines."
              subtitle="3D tilt hover, glow borders, and a cinematic modal transition."
            />

            <div className="projectsGrid">
              {projects.map((p) => (
                <TiltCard
                  key={p.id}
                  className="projectCard"
                  role="button"
                  tabIndex={0}
                  onClick={() => setActiveProjectId(p.id)}
                  style={{ ['--rx' as any]: '0deg', ['--ry' as any]: '0deg' }}
                >
                  <div className="projectGlow" aria-hidden="true" />
                  <div className="projectCardInner">
                    <div className="projectTitle">{p.title}</div>
                    <div className="projectDesc">{p.description}</div>
                    <div className="projectTechRow">
                      {p.tech.slice(0, 4).map((t) => (
                        <span key={t} className="chip chipDim">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="projectActions">
                      <span className="projectActionHint">Click to details</span>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>

        <section id="assessments" className="section">
          <div className="container">
            <SectionHeader
              eyebrow="Academic Submission"
              title="Handwritten Essay Submission"
              subtitle="This section contains my handwritten essay submitted for academic assessment."
            />

            <motion.div
              className="essayCard"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -3 }}
            >
              <div className="essayGrid">
                <div className="essayUpload">
                  <div className="essayUploadHeader">
                    <div className="essayIcon" aria-hidden="true">
                      <FiFileText />
                    </div>
                    <div>
                      <div className="essayUploadTitle">Upload your handwritten essay</div>
                      <div className="essayUploadHint">
                        Upload either one <b>PDF</b> or <b>multiple image pages</b> (JPG/PNG). We’ll combine and preview as a PDF.
                      </div>
                    </div>
                  </div>

                  <label className="essayFileLabel" role="button" tabIndex={0}>
                    <span className="essayFileLabelIcon" aria-hidden="true">
                      <FiUploadCloud />
                    </span>
                    Choose File / Pages
                    <input
                      className="essayFileInput"
                      type="file"
                      accept="application/pdf,image/*"
                      multiple
                      onChange={onEssayUpload}
                    />
                  </label>

                  {essayUpdatedAt && <div className="essayUpdated">Last Updated: {essayUpdatedAt}</div>}
                  {essayPagesCount && <div className="essayUpdated">Pages: {essayPagesCount}</div>}
                  {essayErr && <div className="formError">{essayErr}</div>}

                  {!essayUrl && (
                    <div className="essayEmpty">
                      {essayLoading ? 'Generating preview…' : 'Upload to preview here and download as a combined PDF.'}
                    </div>
                  )}

                  {essayUrl && (
                    <div className="essayActions">
                      <a
                        className="btn btnGhost"
                        href={essayUrl}
                        download={essayDownloadName ?? 'handwritten-essay.pdf'}
                        aria-label="Download uploaded essay"
                      >
                        Download
                      </a>
                      <button
                        type="button"
                        className="btn btnGhost"
                        onClick={() => {
                          if (essayUrl?.startsWith('blob:')) URL.revokeObjectURL(essayUrl)
                          setEssayUrl(DEFAULT_ESSAY_URL)
                          setEssayDownloadName(DEFAULT_ESSAY_NAME)
                          setEssayPagesCount(null)
                          setEssayUpdatedAt(null)
                          setEssayErr(null)
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div className="essayPreview">
                  <div className="essayPreviewTitle">Preview</div>
                  {!essayUrl && <div className="essayPreviewEmpty">No file uploaded yet.</div>}
                  {essayUrl && (
                    <iframe
                      className="essayPreviewFrame"
                      src={essayUrl}
                      title="Handwritten essay preview"
                    />
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="achievements" className="section">
          <div className="container">
            <SectionHeader
              eyebrow="Achievements"
              title="Proof of impact in hackathons and engineering."
              subtitle="Compact hackathon results + measurable impact."
            />

            <div className="achGrid">
              {[
                {
                  id: 'marithon',
                  place: '1st Prize',
                  title: 'MariTHON National Hackathon',
                  meta: 'Won first place',
                  icon: 'trophy',
                },
                {
                  id: 'hackthewinter',
                  place: 'Finalist',
                  title: 'HackTheWinter National Hackathon',
                  meta: 'Reached finals',
                  icon: 'star',
                },
                {
                  id: 'dococ',
                  place: '99.98%',
                  title: 'DOC-OC Multi-board Extraction',
                  meta: 'Marksheets digitization accuracy',
                  icon: 'spark',
                },
                {
                  id: 'speedup',
                  place: '30× Speedup',
                  title: 'Document Processing Pipeline',
                  meta: '10 min → ~30 sec per record',
                  icon: 'bolt',
                },
                {
                  id: 'automation50',
                  place: '50% Less Manual',
                  title: 'Cargo Laytime Automation',
                  meta: 'End-to-end extraction workflow',
                  icon: 'gear',
                },
              ].map((a, idx) => (
                <motion.div
                  key={a.id}
                  className="achCard"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: idx * 0.03 }}
                  whileHover={{ y: -3 }}
                >
                  <div className="achTop">
                    <div className={`achIcon achIcon--${a.icon}`} aria-hidden="true">
                      {a.icon === 'trophy' && <FaTrophy />}
                      {a.icon === 'star' && <FaStar />}
                      {a.icon === 'bolt' && <FaBolt />}
                      {a.icon === 'gear' && <FaCogs />}
                      {a.icon === 'spark' && <FaMagic />}
                    </div>
                    <div className="achPlace">{a.place}</div>
                  </div>
                  <div className="achTitle">{a.title}</div>
                  <div className="achMeta">{a.meta}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="resume" className="section sectionAlt">
          <div className="container">
            <SectionHeader
              eyebrow="Resume"
              title="Download my resume (PDF)"
              subtitle="Clean, lightweight, and always up to date."
            />
            <div className="resumeRow">
              <a className="btn btnPrimary btnBig" href="/Resume.pdf" download>
                <span className="btnIcon" aria-hidden="true">
                  <FiDownload />
                </span>
                Download Resume
              </a>
            </div>
          </div>
        </section>

        <section id="contact" className="section">
          <div className="container">
            <SectionHeader
              eyebrow="Contact"
              title="Let’s build something fast and intelligent."
              subtitle="This portfolio opens your email client with a prefilled draft."
            />

            <div className="contactGrid contactGridSingle">
              <motion.form
                className="contactForm"
                onSubmit={onSubmitContact}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5, delay: 0.04 }}
              >
                <div className="formRow">
                  <Field
                    id="name"
                    label="Your name"
                    value={contactName}
                    onChange={setContactName}
                    placeholder="Your name "
                  />
                </div>
                <div className="formRow">
                  <Field
                    id="email"
                    label="Your email"
                    value={contactEmail}
                    onChange={setContactEmail}
                    placeholder="Your email"
                    inputMode="email"
                  />
                </div>
                <div className="formRow">
                  <TextArea
                    id="message"
                    label="Message"
                    value={contactMessage}
                    onChange={setContactMessage}
                    placeholder="Write your message here..."
                  />
                </div>

                {contactErr && <div className="formError">{contactErr}</div>}

                <button
                  className="btn btnPrimary btnSubmit"
                  type="submit"
                  disabled={contactLoading}
                >
                  <span className="btnRipple" aria-hidden="true" />
                  {contactLoading ? 'Opening email…' : contactSent ? 'Draft opened!' : 'Send Message'}
                </button>
                <div className="formFinePrint">
                  No backend needed. Your email app will receive the message draft.
                </div>
              </motion.form>
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="container footerInner">
            <div className="footerLeft">© {new Date().getFullYear()} Aditya Bhardwaj</div>
            <div className="footerRight">
              <button className="footerLink" type="button" onClick={() => scrollToId('projects')}>
                Projects
              </button>
              <button className="footerLink" type="button" onClick={() => scrollToId('assessments')}>
                Assessments
              </button>
              <button className="footerLink" type="button" onClick={() => scrollToId('contact')}>
                Contact
              </button>
              <a className="footerLink" href="/Resume.pdf" download>
                Resume
              </a>
            </div>
          </div>
        </footer>
      </main>

      <AnimatePresence>
        {activeProject && (
          <motion.div
            className="modalOverlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveProjectId(null)}
          >
            <motion.div
              className="modal"
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.98 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Project details"
            >
              <div className="modalHeader">
                <div>
                  <div className="modalEyebrow">Project</div>
                  <div className="modalTitle">{activeProject.title}</div>
                </div>
                <button className="modalClose" type="button" onClick={() => setActiveProjectId(null)}>
                  Close
                </button>
              </div>
              <div className="modalBody">
                <div className="modalLeft">
                  <p className="modalDesc">{activeProject.description}</p>
                  <div className="modalHighlights">
                    {activeProject.highlights.map((h) => (
                      <div key={h} className="modalHighlight">
                        <span className="modalBullet" aria-hidden="true" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="modalRight">
                  <div className="modalSectionTitle">Tech stack</div>
                  <div className="modalTech">
                    {activeProject.tech.map((t) => (
                      <span key={t} className="chip">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="modalLinks">
                    {activeProject.githubUrl && activeProject.githubUrl !== '#' && (
                      <a
                        className="btn btnGhost"
                        href={activeProject.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        GitHub
                      </a>
                    )}
                    {activeProject.liveUrl && activeProject.liveUrl !== '#' && (
                      <a
                        className="btn btnPrimary"
                        href={activeProject.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Live Demo
                      </a>
                    )}
                    {(activeProject.githubUrl === '#' || !activeProject.githubUrl) && (
                      <div className="modalNoLink">GitHub link can be added later.</div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string
  title: string
  subtitle: string
}) {
  return (
    <div className="sectionHeader">
      <div className="sectionEyebrow">{eyebrow}</div>
      <h2 className="sectionTitle">{title}</h2>
      <p className="sectionSubtitle">{subtitle}</p>
    </div>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  inputMode,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
}) {
  return (
    <div className="field">
      <input
        id={id}
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete="off"
      />
      <label className="label" htmlFor={id}>
        {label}
      </label>
    </div>
  )
}

function TextArea({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <div className="field">
      <textarea
        id={id}
        className="input textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
      />
      <label className="label" htmlFor={id}>
        {label}
      </label>
    </div>
  )
}
