'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './universe.module.css';

interface NodeData {
  id: string;
  name: string;
  system: string;
  sector: string;
  coordinates: { x: string; y: string; z: string };
  status: string;
  statusColor: string;
  tagline: string;
  desc: string;
  metrics: { label: string; value: string; progress: number }[];
  logs: string[];
}

const nodesData: NodeData[] = [
  {
    id: 'atlas',
    name: 'ATLAS',
    system: 'ATLAS.CORE // SW-SYS',
    sector: 'SECTOR_01',
    coordinates: { x: '117.84', y: '-245.12', z: '512.04' },
    status: '100% OPERATIONAL',
    statusColor: '#00F0FF',
    tagline: 'IA y software',
    desc: 'Ecosistema agéntico inteligente de desarrollo y ejecución de software autónomo. Diseñado para traducir el pensamiento conceptual en productos digitales reales.',
    metrics: [
      { label: 'Cores Activos', value: '128 / 128', progress: 100 },
      { label: 'Latencia', value: '4ms', progress: 96 },
    ],
    logs: [
      '[SYSTEM] Booting ATLAS.CORE...',
      '[ATLAS] Neural layer compiled.',
      '[TELEMETRY] Link established.',
    ],
  },
  {
    id: 'music',
    name: 'MUSIC',
    system: 'MUSIC.WAVE // AUD-SYS',
    sector: 'SECTOR_02',
    coordinates: { x: '-342.12', y: '112.50', z: '-89.44' },
    status: '94.2% FREQ_MOD',
    statusColor: '#0088FF',
    tagline: 'Canciones y composiciones',
    desc: 'Composiciones sónicas y paisajes sonoros de síntesis procedural diseñados para inducir estados cognitivos de hiperenfoque.',
    metrics: [
      { label: 'Canales Activos', value: '16 / 24', progress: 66 },
      { label: 'Bitrate', value: 'Lossless', progress: 100 },
    ],
    logs: [
      '[SYSTEM] Booting MUSIC.WAVE...',
      '[AUDIO] Osc set to 432Hz.',
      '[STATUS] Output stabilized.',
    ],
  },
  {
    id: 'books',
    name: 'BOOKS',
    system: 'BOOKS.TEXT // LIT-SYS',
    sector: 'SECTOR_03',
    coordinates: { x: '89.15', y: '512.90', z: '245.33' },
    status: 'SYS_STANDBY',
    statusColor: '#FFD700',
    tagline: 'Libros y escritos',
    desc: 'Escritos filosóficos, especulaciones sobre el futuro de la humanidad y compilaciones literarias del mañana. El registro impreso y digital de 117.',
    metrics: [
      { label: 'Volúmenes', value: '34 / 50', progress: 68 },
      { label: 'Indexación', value: 'Gold Status', progress: 95 },
    ],
    logs: [
      '[SYSTEM] Booting BOOKS.TEXT...',
      '[LIT] Database loaded.',
      '[STATUS] Library standing by.',
    ],
  },
  {
    id: 'studio',
    name: 'STUDIO',
    system: 'STUDIO.AV // VIS-SYS',
    sector: 'SECTOR_04',
    coordinates: { x: '-212.09', y: '-90.41', z: '188.12' },
    status: 'SYS_ACTIVE',
    statusColor: '#8A2BE2',
    tagline: 'Contenido audiovisual',
    desc: 'Producción audiovisual cinematográfica de alta fidelidad. Experiencias inmersivas que exploran la confluencia entre arte y tecnología.',
    metrics: [
      { label: 'Tasa de Fotogramas', value: '60 fps', progress: 100 },
      { label: 'Render', value: 'Ultra-HD', progress: 95 },
    ],
    logs: [
      '[SYSTEM] Booting STUDIO.AV...',
      '[AV] Realtime render ready.',
      '[STATUS] Cinematic output active.',
    ],
  },
  {
    id: 'labs',
    name: 'LABS',
    system: 'LABS.R&D // DEV-SYS',
    sector: 'SECTOR_05',
    coordinates: { x: '0.04', y: '-4.50', z: '12.01' },
    status: 'EXP_CORE',
    statusColor: '#FFFFFF',
    tagline: 'Experimentos y futuro',
    desc: 'Campo de pruebas para algoritmos emergentes, hardware biomecánico experimental e interfaces de conexión neuronal. El mañana, hoy.',
    metrics: [
      { label: 'Pruebas', value: '19 / 20', progress: 95 },
      { label: 'Progreso', value: '84.3%', progress: 84.3 },
    ],
    logs: [
      '[SYSTEM] Booting LABS.R&D...',
      '[R&D] Neural link loaded.',
      '[STATUS] Core stabilized.',
    ],
  },
];

import Starfield from './Starfield';

export default function Universe() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isOverdrive, setIsOverdrive] = useState(false);
  const [timeStr, setTimeStr] = useState<string>('00:00:00');
  const [displayedLogs, setDisplayedLogs] = useState<string[]>([]);

  const activeNode = nodesData.find((n) => n.id === activeId);

  // Update clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      setTimeStr(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Terminal Logs Typing Effect
  useEffect(() => {
    if (!activeNode) return;
    
    setDisplayedLogs([]);
    let logIndex = 0;
    let timeoutId: NodeJS.Timeout;
    let isCancelled = false;
    
    const printNextLog = () => {
      if (isCancelled) return;
      if (logIndex < activeNode.logs.length) {
        setDisplayedLogs((prev) => [...prev, activeNode.logs[logIndex]]);
        logIndex++;
        const delay = Math.random() * 200 + 100; 
        timeoutId = setTimeout(printNextLog, delay);
      }
    };
    
    timeoutId = setTimeout(printNextLog, 150);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [activeNode]);

  const handleNodeClick = (id: string) => {
    setActiveId(prev => prev === id ? null : id);
  };

  const handleExplore = () => {
    setIsOverdrive(true);
    setTimeout(() => {
      setIsOverdrive(false);
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    }, 1500);
  };

  return (
    <section className={`section ${styles.universeSection}`}>
      <Starfield />
      
      {/* ── HUD Header ── */}
      <div className={styles.hudHeader}>
        <div className={styles.hudLeft}>
          <span className={styles.hudTitle}>UNIVERSO 117</span>
          <span className={styles.hudSubtitle}>Un ecosistema de ideas en constante evolución.</span>
        </div>
        <div className={styles.hudRight}>
          <span className={styles.pulseDot} style={{ backgroundColor: activeNode ? activeNode.statusColor : '#fff' }} />
          <span className={styles.hudSpec}>STATUS: {activeNode ? 'NODE ACTIVE' : 'ORBITING'}</span>
          <span className={styles.hudSpec}>|</span>
          <span className={styles.hudSpec}>TIME: {timeStr}</span>
        </div>
      </div>

      {/* ── Orbital System ── */}
      <div className={`${styles.systemContainer} ${activeId ? styles.systemShifted : ''} ${isOverdrive ? styles.systemOverdrive : ''}`}>
        
        {/* Orbital Rings */}
        <div className={`${styles.orbitRing} ${styles.ring1}`} />
        <div className={`${styles.orbitRing} ${styles.ring2}`} />
        <div className={`${styles.orbitRing} ${styles.ring3}`} />

        {/* Center Text */}
        <h2 className={styles.centerEntity}>117</h2>

        {/* Planet Nodes */}
        {nodesData.map((node) => {
          const isActive = activeId === node.id;
          return (
            <div 
              key={node.id}
              className={`${styles.planetNode} ${styles[`node-${node.id}`]} ${isActive ? styles.planetActive : ''}`}
              style={{ '--node-color': node.statusColor } as React.CSSProperties}
              onClick={() => handleNodeClick(node.id)}
            >
              <div className={styles.planetImageWrapper}>
                <img src={`/assets/universe/planet_${node.id}.png`} alt={node.name} className={styles.planetImage} />
              </div>
              <div className={styles.planetLabel}>
                <h4>{node.name}</h4>
                <span>{node.tagline}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Side Information Panel ── */}
      <AnimatePresence>
        {activeNode && (
          <motion.div 
            className={styles.sidePanel}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{ '--node-color': activeNode.statusColor } as React.CSSProperties}
          >
            <div className={styles.panelHeader}>
              <div>
                <span className={styles.panelSystem}>{activeNode.system}</span>
                <h3 className={styles.panelTitle} style={{ color: activeNode.statusColor }}>{activeNode.name}</h3>
                <span className={styles.badgeLabel} style={{ color: activeNode.statusColor, borderColor: activeNode.statusColor }}>
                  {activeNode.status}
                </span>
              </div>
              <button className={styles.closeBtn} onClick={() => setActiveId(null)}>×</button>
            </div>

            <p className={styles.descriptionText}>{activeNode.desc}</p>

            <div className={styles.metricsWrapper}>
              <span className={styles.sectionSpecsLabel}>MÉTRICAS DEL SISTEMA</span>
              {activeNode.metrics.map((metric, i) => (
                <div key={i} className={styles.metricRow}>
                  <div className={styles.metricLabelRow}>
                    <span className={styles.metricLabel}>{metric.label}</span>
                    <span className={styles.metricValue}>{metric.value}</span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <motion.div
                      className={styles.progressBarFill}
                      style={{ backgroundColor: activeNode.statusColor }}
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.progress}%` }}
                      transition={{ duration: 0.8, delay: 0.1 * i }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.terminalWrapper}>
              <div className={styles.terminalHeader}>
                <span>CONSOLE DECK LOGS</span>
                <span className={styles.blinkCursor} />
              </div>
              <div>
                {displayedLogs.map((log, index) => (
                  <div key={index} className={styles.logLine}>
                    <span className={styles.logTime}>[{timeStr}]</span> {log}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Explore Button ── */}
      <button className={styles.exploreBtn} onClick={handleExplore}>
        EXPLORAR UNIVERSO
      </button>

      {/* ── Overdrive Action Overlay ── */}
      <AnimatePresence>
        {isOverdrive && (
          <motion.div 
            className={styles.overdriveOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={styles.overdriveLines} />
            <span className={styles.overdriveText}>HYPER-SCAN SEQUENCE INITIATED</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
