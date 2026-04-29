import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

/* ═══════════════════════════════════════════════
   BRANDON THACKWELL — CYBERSECURITY PORTFOLIO
   Built with obsessive attention to craft.
   ═══════════════════════════════════════════════ */

// ★ PASTE YOUR GOOGLE DRIVE RESUME LINK HERE ★
// Make sure the file sharing is set to "Anyone with the link can view"
const RESUME_URL = "https://docs.google.com/document/d/1xNaleHzdWYaDJVfQvdHR80WI4LOj0fFdmmov7OEVT0Q/preview?tab=t.0";

const PROJECTS = [
  {
    id: 1,
    title: "Home Pentest Lab",
    category: "Red Team / Lab",
    year: "2025",
    description: "Built and maintained a virtualized penetration testing environment using Kali Linux and intentionally vulnerable target VMs. Practiced reconnaissance, vulnerability scanning, exploitation, and post-exploitation techniques in an isolated sandbox.",
    tech: ["Kali Linux", "Metasploit", "Nmap", "Wireshark"],
    color: "#E8FC73",
    image: "/images/kali-hero.png",
    url: "https://github.com/bramdonthackwell12-blip/home-pentest-lab",
  },
  {
    id: 2,
    title: "x86 Assembly Coursework",
    category: "Systems Programming",
    year: "2025",
    description: "19 hand-written x86-32 MASM assembly programs spanning 9 topic modules — from basic arithmetic and control flow through Windows API file I/O, FPU floating-point math, and a capstone register-dump utility. Built with the Irvine32 library at MSJC. Final grade: A.",
    tech: ["x86 ASM", "MASM", "Irvine32", "Windows API", "FPU"],
    color: "#73D8FC",
    image: "/images/assembly-hero.png",
    url: "https://github.com/bramdonthackwell12-blip/x86-assembly-coursework",
  },
  {
    id: 3,
    title: "C++ & Data Structures",
    category: "OOP / Algorithms",
    year: "2025",
    description: "40+ programs across two sequential courses at MSJC — C++ Level 2 (OOP) and Data Structures & Algorithms. Built an evolving Byte class through operator overloading, inheritance, polymorphism, and templates, then applied those skills to implement sorting algorithms, linked lists, stacks, queues, AVL trees, and hash tables from scratch. Capstone: a Periodic Table lookup engine powered by an AVL tree. Final grade: A.",
    tech: ["C++17", "OOP", "Templates", "AVL Trees", "Hash Tables", "STL"],
    color: "#FC73A8",
    image: "/images/cpp-hero.png",
    url: "https://github.com/bramdonthackwell12-blip/cpp-data-structures-coursework",
  },
  {
    id: 4,
    title: "Ethical Hacking & Security+",
    category: "Cybersecurity",
    year: "2020",
    description: "Two security courses at Coastline College — Ethical Hacking (PenTest+ aligned) and Security+. Built Python security tools including a network log parser that flags suspicious IPs by failed-login ratio, and a virus sample file classifier. Completed 26 hands-on labs covering Nmap scanning, Metasploit exploitation, Hashcat password cracking, web app attacks, and PKI. Final grade: A.",
    tech: ["Python", "Kali Linux", "Nmap", "Metasploit", "Hashcat", "Wireshark"],
    color: "#B473FC",
    image: "/images/ethical-hacking-hero.png",
    url: "https://github.com/bramdonthackwell12-blip/ethical-hacking-security-coursework",
  },
];

const SKILLS = [
  { name: "C / C++ Programming", level: 92 },
  { name: "Ethical Hacking", level: 85 },
  { name: "Network Security", level: 88 },
  { name: "x86 Assembly", level: 85 },
  { name: "Linux / Kali", level: 85 },
  { name: "Python", level: 78 },
];

const EDUCATION = [
  {
    institution: "CSUSM (Planned Transfer)",
    degree: "BS in Software Engineering",
    detail: "Target transfer to California State University, San Marcos",
    period: "Target 2027",
    status: "planned",
  },
  {
    institution: "Mt. San Jacinto College",
    degree: "AS-T Computer Science",
    detail: "Data Structures (A), Computer Organization & Assembly (A), C++ Advanced (A), C++ Intro (A)",
    period: "Expected 2027",
    gpa: "Recent: 4.0",
    status: "current",
  },
  {
    institution: "Coastline College",
    degree: "AS — Computer Networking: Security",
    detail: "Ethical Hacking (A), PenTest+ (A), Advanced Security Practices (A), Server+ (A), Network+, A+ Essentials, Python Programming",
    period: "Dec 2020",
    gpa: "GPA 3.6 · Honor's List",
    status: "complete",
  },
  {
    institution: "Coastline College",
    degree: "AA — Math & Science",
    detail: "Liberal Arts focus on mathematics and natural sciences",
    period: "Dec 2020",
    gpa: "GPA 3.6",
    status: "complete",
  },
  {
    institution: "Santa Rosa Academy",
    degree: "High School Diploma",
    detail: "Biomedical Engineering emphasis. Highest scorer on California's Biomedical Engineering exit exam.",
    period: "May 2016",
    status: "complete",
  },
];

const CERTIFICATIONS = [
  {
    name: "CompTIA Security+",
    code: "SY0-701",
    status: "In Progress",
    target: "Target: June 2026",
    current: true,
  },
  {
    name: "CompTIA Network+",
    code: "Planned",
    status: "On Roadmap",
    target: "After Security+",
    current: false,
  },
  {
    name: "CompTIA PenTest+",
    code: "Planned",
    status: "On Roadmap",
    target: "Coursework completed",
    current: false,
  },
];

/* ═══════════════════════════════════════════════
   THREE.JS 3D HERO — ATTACK SURFACE VISUALIZATION
   ═══════════════════════════════════════════════ */
function ThreeHero() {
  const mountRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const frameRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Central morphing icosahedron — "the attack surface"
    const icoGeom = new THREE.IcosahedronGeometry(1.6, 3);
    const icoMat = new THREE.MeshBasicMaterial({ color: 0xE8FC73, wireframe: true, transparent: true, opacity: 0.12 });
    const ico = new THREE.Mesh(icoGeom, icoMat);
    scene.add(ico);

    // Inner glow sphere
    const innerGeom = new THREE.IcosahedronGeometry(1.2, 2);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0xE8FC73, transparent: true, opacity: 0.03 });
    const innerSphere = new THREE.Mesh(innerGeom, innerMat);
    scene.add(innerSphere);

    // Orbital ring 1
    const torusGeom = new THREE.TorusGeometry(2.6, 0.008, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({ color: 0x73D8FC, transparent: true, opacity: 0.2 });
    const torus = new THREE.Mesh(torusGeom, torusMat);
    torus.rotation.x = Math.PI * 0.5;
    scene.add(torus);

    // Orbital ring 2
    const torus2Geom = new THREE.TorusGeometry(3.0, 0.005, 16, 120);
    const torus2Mat = new THREE.MeshBasicMaterial({ color: 0xE8FC73, transparent: true, opacity: 0.08 });
    const torus2 = new THREE.Mesh(torus2Geom, torus2Mat);
    torus2.rotation.x = Math.PI * 0.35;
    torus2.rotation.y = Math.PI * 0.25;
    scene.add(torus2);

    // Particle field — "network nodes"
    const particleCount = 600;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];
    for (let i = 0; i < particleCount; i++) {
      const radius = 1.5 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      velocities.push({ x: (Math.random() - 0.5) * 0.002, y: (Math.random() - 0.5) * 0.002, z: (Math.random() - 0.5) * 0.002 });
    }
    particleGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.02, transparent: true, opacity: 0.35, sizeAttenuation: true, blending: THREE.AdditiveBlending });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // Accent particles
    const accentCount = 100;
    const accentGeom = new THREE.BufferGeometry();
    const accentPos = new Float32Array(accentCount * 3);
    for (let i = 0; i < accentCount; i++) {
      const radius = 2 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      accentPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      accentPos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      accentPos[i * 3 + 2] = radius * Math.cos(phi);
    }
    accentGeom.setAttribute("position", new THREE.BufferAttribute(accentPos, 3));
    const accentMat = new THREE.PointsMaterial({ color: 0xE8FC73, size: 0.035, transparent: true, opacity: 0.5, sizeAttenuation: true, blending: THREE.AdditiveBlending });
    const accentParticles = new THREE.Points(accentGeom, accentMat);
    scene.add(accentParticles);

    const originalPositions = icoGeom.attributes.position.array.slice();

    const onMouseMove = (e) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    const clock = new THREE.Clock();
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      const posArr = icoGeom.attributes.position.array;
      for (let i = 0; i < posArr.length; i += 3) {
        const ox = originalPositions[i], oy = originalPositions[i + 1], oz = originalPositions[i + 2];
        const noise = Math.sin(ox * 2 + t * 0.8) * Math.cos(oy * 2 + t * 0.6) * Math.sin(oz * 2 + t * 0.7) * 0.15;
        const mouseInf = (mx * ox + my * oy) * 0.08;
        const s = 1 + noise + mouseInf;
        posArr[i] = ox * s; posArr[i + 1] = oy * s; posArr[i + 2] = oz * s;
      }
      icoGeom.attributes.position.needsUpdate = true;

      ico.rotation.y = t * 0.08 + mx * 0.4;
      ico.rotation.x = t * 0.05 + my * 0.3;
      innerSphere.rotation.y = t * 0.12 + mx * 0.2;
      innerSphere.rotation.x = t * 0.08 + my * 0.2;
      torus.rotation.z = t * 0.15;
      torus.rotation.x = Math.PI * 0.5 + my * 0.2;
      torus2.rotation.z = -t * 0.1;
      torus2.rotation.y = Math.PI * 0.25 + mx * 0.15;

      const pPos = particleGeom.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        pPos[i * 3] += velocities[i].x + mx * 0.0003;
        pPos[i * 3 + 1] += velocities[i].y + my * 0.0003;
        pPos[i * 3 + 2] += velocities[i].z;
        const d = Math.sqrt(pPos[i * 3] ** 2 + pPos[i * 3 + 1] ** 2 + pPos[i * 3 + 2] ** 2);
        if (d > 6) { const sc = 1.5 / d; pPos[i * 3] *= sc; pPos[i * 3 + 1] *= sc; pPos[i * 3 + 2] *= sc; }
      }
      particleGeom.attributes.position.needsUpdate = true;
      accentParticles.rotation.y = t * 0.03;
      accentParticles.rotation.x = t * 0.02;

      innerMat.opacity = 0.03 + Math.sin(t * 1.5) * 0.015;
      icoMat.opacity = 0.12 + Math.sin(t * 2) * 0.03;

      camera.position.x = mx * 0.3;
      camera.position.y = my * 0.2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = container.clientWidth, h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
      [icoGeom, icoMat, innerGeom, innerMat, torusGeom, torusMat, torus2Geom, torus2Mat, particleGeom, particleMat, accentGeom, accentMat].forEach(o => o.dispose());
    };
  }, []);

  return (
    <div ref={mountRef} style={{
      position: "absolute", top: 0, right: 0, width: "55%", height: "100%", opacity: 0.85,
      pointerEvents: "none",
      maskImage: "radial-gradient(ellipse 80% 70% at 60% 50%, black 30%, transparent 80%)",
      WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 60% 50%, black 30%, transparent 80%)",
    }} />
  );
}

/* ═══════════════════════════════════════════════
   UTILITY COMPONENTS
   ═══════════════════════════════════════════════ */

function CustomCursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    const move = (e) => {
      if (dot.current) dot.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      if (ring.current) ring.current.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
    };
    const scan = () => {
      document.querySelectorAll("a, button, .hoverable").forEach((el) => {
        el.addEventListener("mouseenter", () => setHovered(true));
        el.addEventListener("mouseleave", () => setHovered(false));
      });
    };
    window.addEventListener("mousemove", move);
    scan();
    const obs = new MutationObserver(scan);
    obs.observe(document.body, { childList: true, subtree: true });
    return () => { window.removeEventListener("mousemove", move); obs.disconnect(); };
  }, []);
  return (
    <>
      <div ref={dot} className="custom-cursor-dot" style={{ position: "fixed", top: 0, left: 0, width: 8, height: 8, background: "#E8FC73", borderRadius: "50%", pointerEvents: "none", zIndex: 9999, mixBlendMode: "difference" }} />
      <div ref={ring} className="custom-cursor-ring" style={{
        position: "fixed", top: 0, left: 0, width: hovered ? 60 : 40, height: hovered ? 60 : 40,
        border: `1.5px solid ${hovered ? "#E8FC73" : "rgba(232,252,115,0.5)"}`,
        borderRadius: "50%", pointerEvents: "none", zIndex: 9998,
        transition: "width 0.3s, height 0.3s, border-color 0.3s, transform 0.15s ease-out",
      }} />
    </>
  );
}

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function MagneticButton({ children, style, ...props }) {
  const ref = useRef(null);
  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.transform = `translate(${(e.clientX - rect.left - rect.width / 2) * 0.3}px, ${(e.clientY - rect.top - rect.height / 2) * 0.3}px)`;
  };
  return (
    <button ref={ref} onMouseMove={handleMove} onMouseLeave={() => { ref.current.style.transform = "translate(0,0)"; }}
      className="hoverable" style={{ transition: "transform 0.3s cubic-bezier(0.33,1,0.68,1)", ...style }} {...props}>{children}</button>
  );
}

function Counter({ end, suffix = "", prefix = "", duration = 2000, decimals = 0 }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView(0.5);
  useEffect(() => {
    if (!inView) return;
    let v = 0; const step = end / (duration / 16);
    const timer = setInterval(() => {
      v += step;
      if (v >= end) { setCount(end); clearInterval(timer); }
      else setCount(decimals > 0 ? parseFloat(v.toFixed(decimals)) : Math.floor(v));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration, decimals]);
  return <span ref={ref}>{prefix}{decimals > 0 ? count.toFixed(decimals) : count}{suffix}</span>;
}

function SkillBar({ name, level, delay }) {
  const [ref, inView] = useInView(0.3);
  return (
    <div ref={ref} style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 13, color: "#aaa", letterSpacing: 1, textTransform: "uppercase" }}>{name}</span>
        <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 13, color: "#E8FC73" }}>{level}%</span>
      </div>
      <div style={{ height: 2, background: "rgba(255,255,255,0.08)", borderRadius: 1, overflow: "hidden" }}>
        <div style={{ height: "100%", background: "linear-gradient(90deg,#E8FC73,#73D8FC)", borderRadius: 1, width: inView ? `${level}%` : "0%", transition: `width 1.2s cubic-bezier(0.33,1,0.68,1) ${delay}s` }} />
      </div>
    </div>
  );
}

function ProjectCard({ project, index }) {
  const [ref, inView] = useInView(0.2);
  const [hovered, setHovered] = useState(false);
  const Wrapper = project.url ? "a" : "div";
  const wrapperProps = project.url ? { href: project.url, target: "_blank", rel: "noopener noreferrer", style: { textDecoration: "none", display: "block" } } : {};
  return (
    <Wrapper {...wrapperProps}>
      <div ref={ref} className="hoverable project-card-grid" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "60px 0",
          opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(60px)",
          transition: `all 0.9s cubic-bezier(0.33,1,0.68,1) ${index * 0.15}s`, cursor: project.url ? "pointer" : "default",
        }}>
        <div style={{ paddingRight: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: project.color, letterSpacing: 2, textTransform: "uppercase" }}>{project.category}</span>
            <span style={{ width: 40, height: 1, background: "rgba(255,255,255,0.15)" }} />
            <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: "#555" }}>{project.year}</span>
          </div>
          <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 56, fontWeight: 400, color: hovered ? project.color : "#fff", margin: "0 0 20px", lineHeight: 1.05, transition: "color 0.4s" }}>{project.title}</h3>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "#888", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 440 }}>{project.description}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {project.tech.map(t => <span key={t} style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: "#666", border: "1px solid rgba(255,255,255,0.08)", padding: "6px 14px", borderRadius: 100, letterSpacing: 0.5 }}>{t}</span>)}
          </div>
        </div>
        <div style={{ position: "relative", overflow: "hidden", borderRadius: 12, aspectRatio: "16/10", background: "#111" }}>
          <img src={project.image} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover", transform: hovered ? "scale(1.05)" : "scale(1)", transition: "transform 0.8s cubic-bezier(0.33,1,0.68,1)", filter: "brightness(0.55) saturate(1.2) hue-rotate(-10deg)" }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${project.color}20, transparent)` }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: hovered ? 1 : 0, transition: "opacity 0.4s" }}>
            <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 13, color: "#fff", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)", padding: "12px 28px", borderRadius: 100, letterSpacing: 2, textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.15)" }}>{project.url ? "View on GitHub →" : "View Case Study →"}</span>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

function Marquee() {
  const items = ["PENETRATION TESTING", "NETWORK SECURITY", "ETHICAL HACKING", "KALI LINUX", "METASPLOIT", "WIRESHARK", "NMAP", "C++", "PYTHON", "X86 ASSEMBLY", "VULNERABILITY ASSESSMENT", "INCIDENT RESPONSE"];
  return (
    <div style={{ overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "20px 0" }}>
      <div style={{ display: "flex", gap: 60, whiteSpace: "nowrap", animation: "marquee 45s linear infinite", width: "max-content" }}>
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} style={{ fontFamily: "'Instrument Serif', serif", fontSize: 18, color: "rgba(255,255,255,0.12)", letterSpacing: 4, textTransform: "uppercase" }}>
            {item} <span style={{ color: "#E8FC73", opacity: 0.4, margin: "0 10px" }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Education Timeline Item ─── */
function EducationItem({ item, index, isLast }) {
  const [ref, inView] = useInView(0.2);
  const statusColors = {
    planned: "#73D8FC",
    current: "#E8FC73",
    complete: "#666",
  };
  const color = statusColors[item.status];

  return (
    <div ref={ref} className="edu-item" style={{
      display: "grid", gridTemplateColumns: "180px 24px 1fr", gap: 40,
      paddingBottom: isLast ? 0 : 60, position: "relative",
      opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)",
      transition: `all 0.8s cubic-bezier(0.33,1,0.68,1) ${index * 0.12}s`,
    }}>
      {/* Date column */}
      <div className="edu-date" style={{ textAlign: "right", paddingTop: 4 }}>
        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: "#666", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>{item.period}</div>
        {item.gpa && <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: color }}>{item.gpa}</div>}
      </div>

      {/* Timeline dot + line */}
      <div className="edu-line" style={{ position: "relative", display: "flex", justifyContent: "center" }}>
        <div style={{
          width: 14, height: 14, borderRadius: "50%",
          background: item.status === "complete" ? "transparent" : color,
          border: `2px solid ${color}`,
          marginTop: 6, zIndex: 2, position: "relative",
          boxShadow: item.status === "current" ? `0 0 20px ${color}80` : "none",
        }} />
        {!isLast && (
          <div style={{
            position: "absolute", top: 20, bottom: -60, left: "50%", width: 1,
            background: "linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
            transform: "translateX(-50%)",
          }} />
        )}
      </div>

      {/* Content */}
      <div>
        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: color, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{item.institution}</div>
        <h4 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: "#fff", fontWeight: 400, margin: "0 0 12px", lineHeight: 1.2 }}>{item.degree}</h4>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "#777", lineHeight: 1.7, margin: 0, maxWidth: 520 }}>{item.detail}</p>
      </div>
    </div>
  );
}

/* ─── Certification Card ─── */
function CertCard({ cert, index }) {
  const [ref, inView] = useInView(0.3);
  return (
    <div ref={ref} className="hoverable" style={{
      padding: "36px 32px", borderRadius: 16,
      background: cert.current ? "linear-gradient(135deg, rgba(232,252,115,0.06), rgba(232,252,115,0.01))" : "rgba(255,255,255,0.02)",
      border: `1px solid ${cert.current ? "rgba(232,252,115,0.25)" : "rgba(255,255,255,0.06)"}`,
      position: "relative", overflow: "hidden",
      opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)",
      transition: `all 0.8s cubic-bezier(0.33,1,0.68,1) ${index * 0.15}s`,
    }}>
      {cert.current && (
        <div style={{ position: "absolute", top: 20, right: 20, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#E8FC73", animation: "pulse 2s ease-in-out infinite" }} />
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, color: "#E8FC73", letterSpacing: 1.5, textTransform: "uppercase" }}>Active</span>
        </div>
      )}
      <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, color: cert.current ? "#E8FC73" : "#555", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>{cert.code}</div>
      <h4 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: "#fff", fontWeight: 400, margin: "0 0 20px", lineHeight: 1.1 }}>{cert.name}</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: cert.current ? "#E8FC73" : "#666", letterSpacing: 1, textTransform: "uppercase" }}>{cert.status}</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#666" }}>{cert.target}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PORTFOLIO
   ═══════════════════════════════════════════════ */
export default function Portfolio() {
  const [loaded, setLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [aboutRef, aboutInView] = useInView(0.2);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const navItems = ["Work", "Education", "About", "Contact"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@300;400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; cursor: none !important; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
        ::selection { background: #E8FC73; color: #0a0a0a; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 2px; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes scrollDown { 0% { transform: translateY(-100%); } 50% { transform: translateY(100%); } 100% { transform: translateY(200%); } }
        @keyframes grain { 0%,100%{transform:translate(0,0)} 10%{transform:translate(-5%,-10%)} 30%{transform:translate(7%,-25%)} 50%{transform:translate(-15%,10%)} 70%{transform:translate(0%,15%)} 90%{transform:translate(-10%,10%)} }
        @keyframes heroGlow { 0%,100% { opacity: 0.04; } 50% { opacity: 0.08; } }

        /* ── Touch devices: disable custom cursor ── */
        @media (hover: none) and (pointer: coarse) {
          * { cursor: auto !important; }
          .custom-cursor-dot, .custom-cursor-ring { display: none !important; }
        }

        /* ── Tablet breakpoint ── */
        @media (max-width: 900px) {
          .hero-title { font-size: 52px !important; }
          .three-hero { display: none !important; }
          .project-card-grid { grid-template-columns: 1fr !important; }
          .project-card-grid > div:first-child { padding-right: 0 !important; order: 2 !important; }
          .project-card-grid > div:last-child { order: 1 !important; margin-bottom: 28px !important; }
          .stat-grid { grid-template-columns: 1fr 1fr !important; }
          .about-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .skill-grid { grid-template-columns: 1fr !important; }
          .cert-grid { grid-template-columns: 1fr 1fr !important; }
          .hero-cta-row { flex-direction: column !important; align-items: flex-start !important; }
          .nav-items a { display: none !important; }
          .nav-items { gap: 16px !important; }
          .edu-item { grid-template-columns: 1fr !important; gap: 8px !important; }
          .edu-item .edu-date { text-align: left !important; }
          .edu-item .edu-line { display: none !important; }
          .resp-nav { padding: 16px 20px !important; }
          .resp-section { padding-left: 20px !important; padding-right: 20px !important; }
          .resp-hero { padding: 0 20px !important; }
          .resp-contact h2 { font-size: 42px !important; }
          .resp-contact { padding: 80px 20px !important; }
          .resp-footer { padding: 32px 20px !important; }
          .resp-section-heading { font-size: 36px !important; }
          .scroll-indicator { display: none !important; }
        }

        /* ── Phone breakpoint ── */
        @media (max-width: 600px) {
          .hero-title { font-size: 36px !important; max-width: 100% !important; }
          .resp-hero > div:nth-child(3) { padding-top: 100px !important; }
          .stat-grid { grid-template-columns: 1fr 1fr !important; }
          .stat-grid > div { padding: 28px 16px !important; }
          .cert-grid { grid-template-columns: 1fr !important; }
          .project-card-grid { padding: 36px 0 !important; }
          .project-card-grid h3 { font-size: 32px !important; }
          .project-card-grid p { font-size: 14px !important; }
          .resp-contact h2 { font-size: 32px !important; }
          .resp-section-heading { font-size: 30px !important; }
          .social-links { flex-wrap: wrap !important; gap: 16px !important; }
        }
      `}</style>

      <CustomCursor />



      <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", position: "relative" }}>

        {/* ═══ NAVBAR ═══ */}
        <nav className="resp-nav" style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "24px 48px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: scrollY > 100 ? "rgba(10,10,10,0.85)" : "transparent",
          backdropFilter: scrollY > 100 ? "blur(20px)" : "none",
          borderBottom: scrollY > 100 ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
          transition: "all 0.5s cubic-bezier(0.33,1,0.68,1)",
        }}>
          <a href="#" className="hoverable" style={{ fontFamily: "'Instrument Serif', serif", fontSize: 24, color: "#fff", textDecoration: "none", fontStyle: "italic" }}>bt.</a>
          <div className="nav-items" style={{ display: "flex", gap: 40, alignItems: "center" }}>
            {navItems.map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                onClick={(e) => { e.preventDefault(); scrollTo(item.toLowerCase()); }}
                className="hoverable" style={{
                  fontFamily: "'Geist Mono', monospace", fontSize: 12, color: "#888", textDecoration: "none",
                  letterSpacing: 2, textTransform: "uppercase", transition: "color 0.3s",
                }} onMouseEnter={e => e.target.style.color = "#E8FC73"} onMouseLeave={e => e.target.style.color = "#888"}>{item}</a>
            ))}
            <MagneticButton onClick={() => window.open(RESUME_URL, "_blank", "noopener,noreferrer")} style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: "#0a0a0a", background: "#E8FC73", border: "none", padding: "10px 24px", borderRadius: 100, letterSpacing: 2, textTransform: "uppercase", fontWeight: 500 }}>Résumé</MagneticButton>
          </div>
        </nav>

        {/* ═══ HERO + 3D ═══ */}
        <section id="home" className="resp-hero" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 48px", position: "relative", overflow: "hidden" }}>

          <div className="three-hero" style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <ThreeHero />
          </div>

          <div style={{
            position: "absolute", top: "30%", right: "15%", width: 500, height: 500, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(232,252,115,0.05), transparent 60%)",
            filter: "blur(80px)", animation: "heroGlow 6s ease-in-out infinite", zIndex: 0,
          }} />

          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 40, opacity: loaded ? 1 : 0, animation: loaded ? "fadeUp 0.8s ease-out 0.2s both" : "none" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#E8FC73", animation: "pulse 2s ease-in-out infinite" }} />
              <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: "#E8FC73", letterSpacing: 2, textTransform: "uppercase" }}>Open to opportunities</span>
            </div>

            <h1 className="hero-title" style={{
              fontFamily: "'Instrument Serif', serif", fontSize: 112, fontWeight: 400, lineHeight: 0.98, maxWidth: 800,
              opacity: loaded ? 1 : 0, animation: loaded ? "fadeUp 1s ease-out 0.4s both" : "none",
            }}>
              <span style={{ color: "#fff" }}>I break </span>
              <span style={{ color: "#888" }}>systems</span>
              <br />
              <span style={{ color: "#fff" }}>to make them </span>
              <span style={{ color: "#E8FC73", fontStyle: "italic" }}>stronger.</span>
            </h1>

            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 18, color: "#666", maxWidth: 520, lineHeight: 1.7, marginTop: 44,
              opacity: loaded ? 1 : 0, animation: loaded ? "fadeUp 1s ease-out 0.6s both" : "none",
            }}>
              Cybersecurity professional specializing in ethical hacking, penetration testing,
              and network defense. Two associate degrees, currently pursuing CompTIA Security+
              and transferring to CSUSM for a BS in Software Engineering.
            </p>

            <div className="hero-cta-row" style={{
              display: "flex", gap: 20, marginTop: 48, alignItems: "center",
              opacity: loaded ? 1 : 0, animation: loaded ? "fadeUp 1s ease-out 0.8s both" : "none",
            }}>
              <MagneticButton onClick={() => scrollTo("work")} style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: "#0a0a0a", background: "#E8FC73", border: "none", padding: "16px 36px", borderRadius: 100, letterSpacing: 2, textTransform: "uppercase", fontWeight: 500 }}>View Projects</MagneticButton>
              <MagneticButton onClick={() => scrollTo("contact")} style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: "#888", background: "transparent", border: "1px solid rgba(255,255,255,0.12)", padding: "16px 36px", borderRadius: 100, letterSpacing: 2, textTransform: "uppercase" }}>Get in Touch</MagneticButton>
            </div>
          </div>

          <div className="scroll-indicator" style={{ position: "absolute", bottom: 48, left: 48, display: "flex", alignItems: "center", gap: 16, opacity: loaded ? 1 : 0, animation: loaded ? "fadeIn 1s ease-out 1.2s both" : "none", zIndex: 2 }}>
            <div style={{ width: 1, height: 60, background: "rgba(255,255,255,0.1)", position: "relative", overflow: "hidden" }}>
              <div style={{ width: "100%", height: "50%", background: "#E8FC73", animation: "scrollDown 2s ease-in-out infinite" }} />
            </div>
            <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: "#444", letterSpacing: 2, textTransform: "uppercase", writingMode: "vertical-lr" }}>Scroll</span>
          </div>
        </section>

        <Marquee />

        {/* ═══ STATS ═══ */}
        <section className="resp-section" style={{ padding: "100px 48px" }}>
          <div className="stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: "rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
            {[
              { number: 2, suffix: "", label: "Associate Degrees", decimals: 0 },
              { number: 3.6, suffix: "", label: "Coastline GPA", decimals: 1 },
              { number: 14, suffix: "+", label: "Security & CS Courses", decimals: 0 },
              { number: 4.0, suffix: "", label: "Most Recent Semester", decimals: 1 },
            ].map((stat, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.02)", padding: "48px 36px", textAlign: "center" }}>
                <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 52, color: "#fff", fontWeight: 400, marginBottom: 8 }}>
                  <Counter end={stat.number} suffix={stat.suffix} decimals={stat.decimals} />
                </div>
                <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: "#555", letterSpacing: 2, textTransform: "uppercase" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ WORK / PROJECTS ═══ */}
        <section id="work" className="resp-section" style={{ padding: "60px 48px 120px" }}>
          <div style={{ marginBottom: 80 }}>
            <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: "#E8FC73", letterSpacing: 3, textTransform: "uppercase" }}>Hands-On Work</span>
            <h2 className="resp-section-heading" style={{ fontFamily: "'Instrument Serif', serif", fontSize: 56, fontWeight: 400, color: "#fff", marginTop: 16, lineHeight: 1.05 }}>
              Projects &amp; lab<br /><span style={{ fontStyle: "italic", color: "#888" }}>experience.</span>
            </h2>
          </div>
          <div>{PROJECTS.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}</div>
        </section>

        {/* ═══ EDUCATION TIMELINE ═══ */}
        <section id="education" className="resp-section" style={{ padding: "120px 48px", borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ marginBottom: 80 }}>
              <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: "#E8FC73", letterSpacing: 3, textTransform: "uppercase" }}>Academic Journey</span>
              <h2 className="resp-section-heading" style={{ fontFamily: "'Instrument Serif', serif", fontSize: 56, fontWeight: 400, color: "#fff", marginTop: 16, lineHeight: 1.05 }}>
                A decade of<br /><span style={{ fontStyle: "italic", color: "#888" }}>learning the craft.</span>
              </h2>
            </div>

            <div>
              {EDUCATION.map((item, i) => (
                <EducationItem key={i} item={item} index={i} isLast={i === EDUCATION.length - 1} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CERTIFICATIONS ═══ */}
        <section id="certifications" className="resp-section" style={{ padding: "120px 48px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ marginBottom: 60 }}>
            <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: "#E8FC73", letterSpacing: 3, textTransform: "uppercase" }}>Certifications</span>
            <h2 className="resp-section-heading" style={{ fontFamily: "'Instrument Serif', serif", fontSize: 56, fontWeight: 400, color: "#fff", marginTop: 16, lineHeight: 1.05 }}>
              Certification<br /><span style={{ fontStyle: "italic", color: "#888" }}>roadmap.</span>
            </h2>
          </div>
          <div className="cert-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {CERTIFICATIONS.map((cert, i) => <CertCard key={cert.name} cert={cert} index={i} />)}
          </div>
        </section>

        {/* ═══ ABOUT + SKILLS ═══ */}
        <section ref={aboutRef} id="about" className="resp-section" style={{ padding: "120px 48px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 80 }}>
            <div>
              <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: "#E8FC73", letterSpacing: 3, textTransform: "uppercase" }}>About</span>
              <h2 style={{
                fontFamily: "'Instrument Serif', serif", fontSize: 48, fontWeight: 400, color: "#fff", marginTop: 16, marginBottom: 32,
                opacity: aboutInView ? 1 : 0, transform: aboutInView ? "translateY(0)" : "translateY(30px)",
                transition: "all 0.8s cubic-bezier(0.33,1,0.68,1)",
              }}>Offense informs<br /><span style={{ color: "#888", fontStyle: "italic" }}>defense.</span></h2>
              <div style={{ width: "100%", aspectRatio: "3/4", borderRadius: 16, background: "#111", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden", position: "relative" }}>
                <img src="/images/headshot.jpg" alt="Brandon Thackwell" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", filter: "brightness(0.85) saturate(0.9)" }} />
                <div style={{ position: "absolute", bottom: 24, left: 24, right: 24, zIndex: 2 }}>
                  <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 10, color: "#aaa", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Based in</div>
                  <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 24, color: "#fff" }}>Menifee, California</div>
                </div>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60%", background: "linear-gradient(transparent, rgba(10,10,10,0.95))", zIndex: 1 }} />
              </div>
            </div>
            <div style={{ paddingTop: 60 }}>
              {[
                {
                  text: "I'm Brandon Thackwell, a cybersecurity professional based in Menifee, California. My academic focus has been on offensive and defensive security: ethical hacking, penetration testing, network defense, and systems-level programming in C/C++ and x86 assembly.",
                  size: 20, color: "#ccc", delay: "0.2s"
                },
                {
                  text: "I hold an AS in Computer Networking with a Security emphasis and an AA in Math & Science from Coastline College — both earned with a 3.6 GPA. I'm currently completing an Associate for Transfer in Computer Science at Mt. San Jacinto College with plans to transfer to CSUSM for a BS in Software Engineering.",
                  size: 17, color: "#888", delay: "0.3s"
                },
                {
                  text: "Outside of coursework, I maintain a virtualized home pentest lab, work full-time at BJ's Brewhouse (where I was promoted twice in two years based on reliability and accuracy), and previously co-founded ExclusiveCereal — an online retail business featured in VICE in 2019.",
                  size: 17, color: "#888", delay: "0.4s"
                },
                {
                  text: "I'm pursuing my CompTIA Security+ certification with a target completion of June 2026, and actively seeking entry-level roles in security operations, IT security analysis, or IT support with a security focus in the Inland Empire area.",
                  size: 17, color: "#888", delay: "0.5s"
                },
              ].map((p, i) => (
                <p key={i} style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: p.size, color: p.color, lineHeight: 1.8,
                  marginBottom: i < 3 ? 28 : 60,
                  opacity: aboutInView ? 1 : 0, transform: aboutInView ? "translateY(0)" : "translateY(30px)",
                  transition: `all 0.8s cubic-bezier(0.33,1,0.68,1) ${p.delay}`,
                }}>{p.text}</p>
              ))}

              <div id="skills">
                <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: "#555", letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 32 }}>Core Competencies</span>
                <div className="skill-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 40px" }}>
                  <div>{SKILLS.slice(0, 3).map((s, i) => <SkillBar key={s.name} name={s.name} level={s.level} delay={i * 0.15} />)}</div>
                  <div>{SKILLS.slice(3).map((s, i) => <SkillBar key={s.name} name={s.name} level={s.level} delay={(i + 3) * 0.15} />)}</div>
                </div>

                {/* Tools & Technologies */}
                <div style={{ marginTop: 48 }}>
                  <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: "#555", letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 20 }}>Tools &amp; Technologies</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {["Kali Linux", "Wireshark", "Metasploit", "Nmap", "Burp Suite", "Windows Server", "Active Directory", "TCP/IP", "DNS", "DHCP", "Firewalls", "VPNs", "Git", "VS Code"].map(t => (
                      <span key={t} style={{
                        fontFamily: "'Geist Mono', monospace", fontSize: 11, color: "#888",
                        border: "1px solid rgba(255,255,255,0.08)", padding: "8px 16px",
                        borderRadius: 100, letterSpacing: 0.5,
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ CONTACT ═══ */}
        <section id="contact" className="resp-contact" style={{ padding: "140px 48px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,252,115,0.04), transparent 70%)", filter: "blur(80px)" }} />
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: "#E8FC73", letterSpacing: 3, textTransform: "uppercase" }}>Get in Touch</span>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 72, fontWeight: 400, color: "#fff", margin: "24px auto 32px", maxWidth: 720, lineHeight: 1.05 }}>
            Let's secure<br /><span style={{ fontStyle: "italic", color: "#888" }}>what matters.</span>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, color: "#555", maxWidth: 520, margin: "0 auto 48px", lineHeight: 1.7 }}>
            Seeking entry-level cybersecurity roles in the Inland Empire area.
            I'd love to hear about opportunities where I can contribute and keep learning.
          </p>
          <a href="mailto:b.thackwell@icloud.com?subject=Opportunity%20%E2%80%94%20Found%20You%20Through%20Your%20Portfolio&body=Hi%20Brandon%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20would%20love%20to%20connect%20about%20a%20potential%20opportunity.%0A%0ABest%20regards" className="hoverable" style={{ display: "inline-block", fontFamily: "'Geist Mono', monospace", fontSize: 13, color: "#0a0a0a", background: "#E8FC73", textDecoration: "none", padding: "18px 48px", borderRadius: 100, letterSpacing: 2, textTransform: "uppercase", fontWeight: 500, position: "relative", zIndex: 10 }}>b.thackwell@icloud.com</a>
          <div style={{ marginTop: 24, fontFamily: "'Geist Mono', monospace", fontSize: 12, color: "#555", letterSpacing: 1 }}>
            (951) 220-3738 &nbsp;·&nbsp; Menifee, CA
          </div>
          <div className="social-links" style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 48, position: "relative", zIndex: 10 }}>
            {[
              { name: "GitHub", url: "https://github.com/bramdonthackwell12-blip" },
              { name: "LinkedIn", url: "https://www.linkedin.com/in/brandon-thackwell-113773324/" },
              { name: "TryHackMe", url: "https://tryhackme.com/p/bramdon.thackwell12" },
              { name: "HackTheBox", url: "https://profile.hackthebox.com/profile/019dd768-32f8-73b6-bc9b-2f7877283b6f" },
            ].map(s => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="hoverable" style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: "#444", textDecoration: "none", letterSpacing: 1, transition: "color 0.3s", position: "relative", zIndex: 10 }}
                onMouseEnter={e => e.target.style.color = "#E8FC73"} onMouseLeave={e => e.target.style.color = "#444"}>{s.name}</a>
            ))}
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="resp-footer" style={{ padding: 48, borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: "#333", letterSpacing: 1 }}>© 2026 Brandon Thackwell — Built with care</span>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 11, color: "#333", letterSpacing: 1 }}>Menifee, CA</span>
        </footer>
      </div>
    </>
  );
}
