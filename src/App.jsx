import React, { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'livepersona-moments-v1';

const moods = [
  { id: 'calm', label: 'En calma', icon: 'sun', tint: 'sage' },
  { id: 'bright', label: 'Con energía', icon: 'spark', tint: 'gold' },
  { id: 'mixed', label: 'Con muchas cosas', icon: 'cloud', tint: 'lilac' },
  { id: 'low', label: 'Un poco abajo', icon: 'rain', tint: 'blue' },
  { id: 'unsure', label: 'No lo sé aún', icon: 'question', tint: 'rose' },
];

const themes = [
  { id: 'relationships', label: 'Mis relaciones', icon: 'heart' },
  { id: 'self', label: 'Yo conmigo', icon: 'person' },
  { id: 'decisions', label: 'Una decisión', icon: 'compass' },
  { id: 'everyday', label: 'Mi día a día', icon: 'leaf' },
];

const seeds = [
  '¿Qué parte de hoy te gustaría recordar con más cariño?',
  '¿Qué te está pidiendo atención, aunque todavía no tengas una respuesta?',
  '¿Hubo un momento en el que actuaste de una manera que te hizo sentir orgulloso?',
  'Si pudieras hacerle una pregunta amable a tu yo de hoy, ¿cuál sería?',
  '¿Qué conversación sigues teniendo en tu cabeza? ¿Qué necesitas de ella?',
  '¿Qué cosa pequeña te dio un poco de aire hoy?',
  '¿Qué estás intentando sostener tú solo que podrías compartir?',
];

const toolkit = [
  { id: 'pause', title: 'Volver al presente', subtitle: 'Una pausa guiada de 60 segundos', icon: 'breathe', color: 'lavender', description: 'No tienes que resolver nada ahora. Solo sigue el ritmo si te resulta cómodo.' },
  { id: 'decision', title: 'Desenredar una decisión', subtitle: 'Separar hechos, miedos y un paso posible', icon: 'compass', color: 'peach', description: 'Una decisión puede sentirse enorme cuando mezclamos lo que sabemos con lo que tememos.' },
  { id: 'kindness', title: 'Hablarte con más amabilidad', subtitle: 'Cambiar el tono, sin negar lo que pasó', icon: 'heart', color: 'sage', description: 'No se trata de justificarlo todo. Se trata de tratarte como tratarías a alguien que quieres.' },
];

function Icon({ name, size = 20, strokeWidth = 1.8 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  const paths = {
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
    spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z" /><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" /></>,
    cloud: <path d="M7.5 18a4.5 4.5 0 1 1 .9-8.9A5.5 5.5 0 0 1 19 10.5a3.8 3.8 0 0 1-.5 7.5H7.5Z" />,
    rain: <><path d="M7.5 14a4.5 4.5 0 1 1 .9-8.9A5.5 5.5 0 0 1 19 6.5a3.8 3.8 0 0 1-.5 7.5H7.5Z" /><path d="m8 17-1 2m6-2-1 2m6-2-1 2" /></>,
    question: <><circle cx="12" cy="12" r="9" /><path d="M9.6 9a2.5 2.5 0 1 1 4.2 1.8c-1.3 1.2-1.8 1.4-1.8 3" /><path d="M12 17h.01" /></>,
    heart: <path d="M20.8 8.7c0 5.3-8.8 10.2-8.8 10.2S3.2 14 3.2 8.7A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.6Z" />,
    person: <><circle cx="12" cy="8" r="3.2" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></>,
    compass: <><circle cx="12" cy="12" r="9" /><path d="m15.8 8.2-2.4 5.2-5.2 2.4 2.4-5.2 5.2-2.4Z" /></>,
    leaf: <><path d="M20.5 3.5C11 3.5 5 6.2 5 12a5 5 0 0 0 5 5c5.8 0 8.5-6 8.5-13.5Z" /><path d="M3.5 21c2-5.5 6-9 12-12" /></>,
    breathe: <><path d="M3 12h3l2-5 4 10 2-5h7" /><path d="M4 5.5a9 9 0 0 1 15.5 2M20 18.5a9 9 0 0 1-15.5-2" /></>,
    arrow: <><path d="M5 12h14m-6-6 6 6-6 6" /></>,
    back: <><path d="M19 12H5m6 6-6-6 6-6" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5v-12Z" /><path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20M8 7h7" /></>,
    download: <><path d="M12 3v12m-5-5 5 5 5-5" /><path d="M5 17v3h14v-3" /></>,
    trash: <><path d="M4 7h16M10 11v6m4-6v6M5.5 7l1 14h11l1-14M9 7V4h6v3" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    moon: <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z" />,
  };
  return <svg {...common}>{paths[name] || paths.spark}</svg>;
}

function getDayLabel() {
  return new Intl.DateTimeFormat('es-PE', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
}

function loadMoments() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function Logo() {
  return <a href="#hoy" className="logo-link" aria-label="LivePersona, ir al inicio"><img src="/livepersona-logo.svg" alt="LivePersona" /></a>;
}

function AppearanceControls({ theme, setTheme, largeText, setLargeText, compact = false }) {
  return <div className={`appearance-controls${compact ? ' compact' : ''}`} aria-label="Opciones de visualización">
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-pressed={theme === 'dark'} aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}><Icon name={theme === 'dark' ? 'sun' : 'moon'} size={17} /><span>{compact ? (theme === 'dark' ? 'Claro' : 'Oscuro') : (theme === 'dark' ? 'Modo oscuro' : 'Modo claro')}</span></button>
    <button onClick={() => setLargeText((current) => !current)} aria-pressed={largeText} aria-label={largeText ? 'Desactivar texto grande' : 'Aumentar tamaño del texto'}><span className="text-size-icon">A+</span><span>{compact ? 'Texto' : (largeText ? 'Texto grande' : 'Texto normal')}</span></button>
  </div>;
}

function Sidebar({ page, setPage, moments, theme, setTheme, largeText, setLargeText }) {
  const items = [
    { id: 'today', label: 'Escribir una nota', icon: 'sun' },
    { id: 'journey', label: 'Mis notas guardadas', icon: 'book', badge: moments.length || null },
    { id: 'tools', label: 'Ejercicios breves', icon: 'breathe' },
  ];
  return <aside className="sidebar"><Logo /><div className="sidebar-label">TU ESPACIO</div><nav aria-label="Navegación principal">{items.map((item) => <button key={item.id} className={`nav-item${page === item.id ? ' active' : ''}`} aria-current={page === item.id ? 'page' : undefined} onClick={() => setPage(item.id)}><Icon name={item.icon} size={19} /><span>{item.label}</span>{item.badge ? <b>{item.badge}</b> : null}</button>)}</nav><div className="sidebar-bottom"><AppearanceControls theme={theme} setTheme={setTheme} largeText={largeText} setLargeText={setLargeText} /><div className="local-card"><span className="local-icon"><Icon name="sun" size={17} /></span><p><strong>Tu espacio, tus reglas</strong><br />Tus notas se guardan solo aquí.</p></div><div className="sidebar-version">LIVEPERSONA <span>·</span> BETA</div></div></aside>;
}

function MobileHeader({ page, setPage, moments, theme, setTheme, largeText, setLargeText }) {
  const items = [{ id: 'today', icon: 'sun', label: 'Escribir' }, { id: 'journey', icon: 'book', label: 'Mis notas', badge: moments.length }, { id: 'tools', icon: 'breathe', label: 'Ejercicios' }];
  return <><header className="mobile-header"><Logo /><AppearanceControls compact theme={theme} setTheme={setTheme} largeText={largeText} setLargeText={setLargeText} /></header><nav className="mobile-nav" aria-label="Navegación principal">{items.map((item) => <button key={item.id} className={page === item.id ? 'active' : ''} aria-current={page === item.id ? 'page' : undefined} onClick={() => setPage(item.id)}><Icon name={item.icon} size={19} /><span>{item.label}</span></button>)}</nav></>;
}

function MoodButton({ mood, selected, onClick }) {
  return <button className={`mood-choice mood-${mood.tint}${selected ? ' selected' : ''}`} onClick={onClick} aria-pressed={selected}><span className="mood-icon"><Icon name={mood.icon} size={21} /></span><span>{mood.label}</span>{selected && <span className="mood-selected"><Icon name="check" size={13} /></span>}</button>;
}

function EntryComposer({ onSave }) {
  const [mood, setMood] = useState('');
  const [theme, setTheme] = useState('');
  const [text, setText] = useState('');
  const [prompt, setPrompt] = useState('');
  const [saved, setSaved] = useState(false);
  const dailyPrompt = seeds[Math.floor(Date.now() / 86400000) % seeds.length];
  const usePrompt = (value) => { setPrompt(value); setText((current) => current || ''); document.getElementById('moment-note')?.focus(); };
  const save = () => {
    if (!mood && !text.trim()) return;
    onSave({ id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`, date: new Date().toISOString(), mood, theme, prompt, text: text.trim() });
    setMood(''); setTheme(''); setText(''); setPrompt(''); setSaved(true);
    window.setTimeout(() => setSaved(false), 3200);
  };
  return <section className="compose-card" aria-labelledby="compose-title">
    <div className="compose-heading"><div><div className="section-eyebrow">TU DIARIO PERSONAL</div><h2 id="compose-title">Escribe sobre un momento de hoy</h2><p>Elige cómo te sientes y anota lo que quieras recordar o entender.</p></div><span className="compose-stamp"><Icon name="book" size={23} /></span></div>
    <div className="mood-section"><div className="field-label" id="mood-label"><span className="step-number">1</span> ¿Cómo te sientes ahora? <span>opcional</span></div><div className="mood-row" role="group" aria-labelledby="mood-label">{moods.map((item) => <MoodButton key={item.id} mood={item} selected={mood === item.id} onClick={() => setMood((current) => current === item.id ? '' : item.id)} />)}</div></div>
    <div className="theme-section"><div className="field-label" id="theme-label"><span className="step-number">2</span> ¿De qué quieres escribir? <span>opcional</span></div><div className="theme-row" role="group" aria-labelledby="theme-label">{themes.map((item) => <button key={item.id} className={`theme-chip${theme === item.id ? ' selected' : ''}`} onClick={() => setTheme((current) => current === item.id ? '' : item.id)} aria-pressed={theme === item.id}><Icon name={item.icon} size={16} />{item.label}</button>)}</div></div>
    <div className="note-section"><div className="field-label"><span className="step-number">3</span> Escribe tu nota <span>privada</span></div>
      {prompt ? <div className="chosen-prompt"><Icon name="spark" size={16} /><span>{prompt}</span><button onClick={() => setPrompt('')} aria-label="Quitar pregunta"><Icon name="close" size={16} /></button></div> : <button className="daily-prompt" onClick={() => usePrompt(dailyPrompt)}><span className="prompt-spark">✳</span><span><b>¿No sabes cómo empezar? Toca para ver una pregunta</b><small>{dailyPrompt}</small></span><Icon name="arrow" size={18} /></button>}
      <textarea id="moment-note" aria-label="Escribe tu nota personal" value={text} onChange={(event) => setText(event.target.value)} placeholder={prompt ? 'Escribe aquí tu respuesta…' : '¿Qué pasó? ¿Qué te gustaría entender o recordar?'} rows="4" maxLength={1800} />
      <div className="composer-footer"><span>{text.length}/1800 · Tu nota queda en este dispositivo</span><button className="save-button" disabled={!mood && !text.trim()} onClick={save}><Icon name="plus" size={17} /> Guardar nota</button></div>
      {saved && <p className="save-confirmation" role="status"><Icon name="check" size={16} /> Tu momento quedó guardado en tu recorrido.</p>}
    </div>
  </section>;
}

function EmptyJourney() {
  return <div className="empty-journey"><div className="empty-orb"><Icon name="book" size={27} /></div><h3>Tu recorrido empieza contigo</h3><p>Cuando guardes un momento, podrás volver a él y reconocer qué cosas han estado presentes en tu vida.</p></div>;
}

function formatMomentDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-PE', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(date);
}

function localDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function MomentCard({ moment }) {
  const mood = moods.find((item) => item.id === moment.mood);
  const theme = themes.find((item) => item.id === moment.theme);
  return <article className="moment-card"><div className="moment-meta"><span className={`moment-mood tint-${mood?.tint || 'lilac'}`}><Icon name={mood?.icon || 'spark'} size={15} />{mood?.label || 'Mi momento'}</span><time>{formatMomentDate(moment.date)}</time>{theme && <span className="moment-theme"><Icon name={theme.icon} size={14} />{theme.label}</span>}</div>{moment.prompt && <p className="moment-prompt">{moment.prompt}</p>}{moment.text ? <p className="moment-text">{moment.text}</p> : <p className="moment-text muted-moment">Hoy guardé un registro de cómo me siento.</p>}</article>;
}

function WeekPulse({ moments }) {
  const week = useMemo(() => {
    const today = new Date();
    const day = today.getDay();
    const mondayOffset = day === 0 ? 6 : day - 1;
    const monday = new Date(today);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(today.getDate() - mondayOffset);
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      const key = localDateKey(date);
      const dayMoments = moments.filter((moment) => localDateKey(new Date(moment.date)) === key);
      return { key, label: new Intl.DateTimeFormat('es-PE', { weekday: 'narrow' }).format(date), count: dayMoments.length, mood: dayMoments[dayMoments.length - 1]?.mood || null, day: date.getDate(), today: date.toDateString() === today.toDateString() };
    });
  }, [moments]);
  return <div className="week-pulse" aria-label="Momentos guardados esta semana">{week.map((day) => {
    const mood = moods.find((item) => item.id === day.mood);
    return <div className={`pulse-day${day.today ? ' is-today' : ''}${day.count ? ' has-moment' : ''}`} key={day.key} title={day.count ? `${day.count} momento${day.count === 1 ? '' : 's'} guardado${day.count === 1 ? '' : 's'}` : 'Sin registros'}><span className="pulse-label">{day.label}</span><span className={`pulse-dot${day.mood ? ` tint-${mood.tint}` : ''}`}>{day.mood && <Icon name={mood.icon} size={15} />}</span><span className="pulse-date">{day.day}</span></div>;
  })}</div>;
}

function TodayPage({ moments, onSave, goToJourney }) {
  const firstName = 'Hola';
  const todayMoments = moments.filter((moment) => new Date(moment.date).toDateString() === new Date().toDateString());
  const latest = moments[0];
  return <div className="page-content today-page">
    <div className="page-intro"><div><span className="date-kicker">{getDayLabel()} · TU ESPACIO PRIVADO</span><h1>{firstName}, ¿qué te gustaría anotar hoy?</h1><p>1. Elige cómo te sientes. 2. Escribe una nota. 3. Guárdala para volver cuando quieras. También puedes dejar campos vacíos.</p></div><div className="intro-decoration" aria-hidden="true"><span>l</span><i /><b /></div></div>
    <div className="dashboard-grid"><div className="main-column"><EntryComposer onSave={onSave} />{todayMoments.length > 0 && <section className="today-saved"><div className="section-title"><span className="section-eyebrow">HOY, PARA TI</span><button className="inline-link" onClick={goToJourney}>Ver recorrido <Icon name="arrow" size={15} /></button></div><div className="today-moment-list">{todayMoments.map((moment) => <MomentCard key={moment.id} moment={moment} />)}</div></section>}</div>
      <aside className="side-column"><section className="pulse-card"><div className="side-card-heading"><div><span className="section-eyebrow">TUS NOTAS ESTA SEMANA</span><h2>Días en que escribiste</h2></div><span className="side-icon lavender-icon"><Icon name="sun" size={19} /></span></div><p>Cada punto marca un día en que guardaste una nota. No necesitas escribir todos los días.</p><WeekPulse moments={moments} /><button className="side-card-link" onClick={goToJourney}>Ver mis notas <Icon name="arrow" size={16} /></button></section>
      <section className="kindness-card"><div className="kindness-top"><Icon name="heart" size={18} /><span>UN RECORDATORIO AMABLE</span></div><p>No necesitas entenderlo todo hoy. A veces, notar lo que sientes ya es un comienzo.</p><span className="kindness-scribble" aria-hidden="true">✳</span></section>
      {latest && <button className="resume-card" onClick={goToJourney}><span className="resume-icon"><Icon name="clock" size={18} /></span><span><b>Abrir mi última nota</b><small>Guardada · {formatMomentDate(latest.date)}</small></span><Icon name="arrow" size={17} /></button>}</aside></div>
    <p className="privacy-footnote"><Icon name="moon" size={15} /> Sin cuenta. Sin rachas. Sin presión. Tus momentos se quedan guardados en este navegador.</p>
  </div>;
}

function JourneyPage({ moments, onExport }) {
  const sorted = [...moments].sort((a, b) => new Date(b.date) - new Date(a.date));
  const themeCounts = themes.map((theme) => ({ ...theme, count: moments.filter((moment) => moment.theme === theme.id).length })).filter((theme) => theme.count).sort((a, b) => b.count - a.count);
  const moodCounts = moods.map((mood) => ({ ...mood, count: moments.filter((moment) => moment.mood === mood.id).length })).filter((mood) => mood.count).sort((a, b) => b.count - a.count);
  return <div className="page-content journey-page"><div className="page-intro journey-intro"><div><span className="date-kicker">TUS NOTAS · SOLO EN ESTE DISPOSITIVO</span><h1>Lo que has escrito para ti.</h1><p>Aquí aparecen tus notas guardadas, de la más reciente a la más antigua. Los recuentos solo resumen lo que elegiste marcar.</p></div><div className="intro-decoration journey-decoration" aria-hidden="true"><Icon name="book" size={39} /></div></div>
    {moments.length === 0 ? <EmptyJourney /> : <><div className="journey-overview"><div className="overview-total"><span className="section-eyebrow">MOMENTOS QUE ELEGISTE GUARDAR</span><strong>{moments.length}</strong><span>{moments.length === 1 ? 'un momento, muchas formas de mirarlo' : 'momentos que te diste para ti'}</span></div><div className="overview-pattern"><span className="section-eyebrow">TEMAS QUE HAN APARECIDO</span>{themeCounts.length ? <div className="pattern-chips">{themeCounts.map((theme) => <span key={theme.id}><Icon name={theme.icon} size={15} />{theme.label}<b>{theme.count}</b></span>)}</div> : <p>Cuando elijas un tema al escribir, aparecerá aquí.</p>}</div><div className="overview-pattern mood-pattern"><span className="section-eyebrow">CLIMAS QUE HAS NOMBRADO</span>{moodCounts.length ? <div className="pattern-chips">{moodCounts.map((mood) => <span key={mood.id}><Icon name={mood.icon} size={15} />{mood.label}<b>{mood.count}</b></span>)}</div> : null}</div></div><div className="timeline-heading"><div><span className="section-eyebrow">TU HISTORIA, A TU RITMO</span><h2>Momentos guardados</h2></div><button className="export-button" onClick={onExport}><Icon name="download" size={16} /> Imprimir o guardar como PDF</button></div><div className="timeline">{sorted.map((moment) => <MomentCard key={moment.id} moment={moment} />)}</div></>}
  </div>;
}

function BreathingTool({ active, setActive }) {
  const [seconds, setSeconds] = useState(60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const elapsed = 60 - seconds;
  const phasePosition = elapsed % 10;
  const phase = phasePosition < 4 ? 'inhale' : 'exhale';
  const phaseLength = phase === 'inhale' ? 4 : 6;
  const phaseSeconds = phase === 'inhale' ? 4 - phasePosition : 10 - phasePosition;
  const ringLength = 616;
  const ringProgress = done ? ringLength : ringLength * (1 - (phaseLength - phaseSeconds) / phaseLength);
  useEffect(() => {
    if (!running) return undefined;
    const timer = window.setInterval(() => setSeconds((current) => {
      if (current <= 1) { window.clearInterval(timer); setRunning(false); setDone(true); return 0; }
      return current - 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [running]);
  if (!active) return <button className="tool-card" onClick={() => setActive('pause')}><span className="tool-card-icon lavender-icon"><Icon name="breathe" size={22} /></span><span className="tool-card-body"><b>{toolkit[0].title}</b><small>{toolkit[0].subtitle}</small></span><span className="tool-card-arrow"><Icon name="arrow" size={18} /></span></button>;
  return <div className="active-tool breath-tool"><button className="tool-back" onClick={() => { setActive(''); setRunning(false); }}><Icon name="back" size={16} /> Volver a ejercicios</button>
    <div className="breath-stage">
      <svg className="breath-ring" viewBox="0 0 224 224" aria-hidden="true"><circle className="breath-ring-track" cx="112" cy="112" r="98" /><circle className="breath-ring-progress" cx="112" cy="112" r="98" strokeDasharray={ringLength} strokeDashoffset={ringLength - ringProgress} /></svg>
      <div key={done ? 'done' : phase} className={`breath-orb${running ? ` breathing ${phase}` : ''}${done ? ' complete' : ''}`}>
        <span className="breath-phase" aria-live="polite">{done ? 'Pausa completa' : running ? (phase === 'inhale' ? 'Inhala' : 'Exhala') : seconds < 60 ? 'En pausa' : 'A tu ritmo'}</span>
        <strong>{done ? '✦' : `${String(phaseSeconds).padStart(2, '0')}`}</strong><span className="breath-unit">{done ? 'bien hecho' : 'segundos'}</span>
      </div>
    </div>
    <div className="breath-remaining"><Icon name="clock" size={15} /><span>{done ? 'Terminaste tu minuto' : `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')} restantes`}</span></div>
    <h3>{done ? 'Hiciste espacio para ti.' : 'Inhala 4. Exhala 6. Sin aguantar.'}</h3>
    <p>{done ? 'Quédate un momento más si quieres, o vuelve a lo que estabas haciendo.' : 'Sigue el círculo y respira a un ritmo cómodo. Si esta cuenta no te acomoda, vuelve a tu respiración natural o detente.'}</p>
    <div className="tool-actions"><button className={`button-primary${running ? ' button-secondary' : ''}`} aria-label={running ? 'Pausar la respiración guiada' : done ? 'Repetir la pausa de respiración' : 'Empezar la pausa de respiración'} onClick={() => { if (done) { setSeconds(60); setDone(false); } setRunning((value) => !value); }}>{running ? <><Icon name="close" size={17} /> Pausar</> : <>{done ? 'Repetir pausa' : seconds < 60 ? 'Continuar' : 'Empezar pausa'} <Icon name="arrow" size={17} /></>}</button><button className="text-button" onClick={() => { setActive(''); setRunning(false); }}>Salir</button></div>
  </div>;
}

function DecisionTool({ active, setActive }) {
  const [notes, setNotes] = useState({ facts: '', worries: '', next: '' });
  if (!active) return <button className="tool-card" onClick={() => setActive('decision')}><span className="tool-card-icon peach-icon"><Icon name="compass" size={22} /></span><span className="tool-card-body"><b>{toolkit[1].title}</b><small>{toolkit[1].subtitle}</small></span><Icon name="arrow" size={18} /></button>;
  return <div className="active-tool decision-active"><button className="tool-back" onClick={() => setActive('')}><Icon name="back" size={16} /> Volver a herramientas</button><span className="section-eyebrow">ACLARAR SIN APURARTE</span><h3>Separa lo que sabes de lo que temes.</h3><p>{toolkit[1].description}</p><div className="decision-prompts"><label>¿Qué sabes con certeza?<textarea value={notes.facts} onChange={(event) => setNotes({ ...notes, facts: event.target.value })} placeholder="Solo los hechos, sin interpretarlos…" /></label><label>¿Qué te preocupa que pueda pasar?<textarea value={notes.worries} onChange={(event) => setNotes({ ...notes, worries: event.target.value })} placeholder="Dale un lugar a esa preocupación…" /></label><label>¿Qué paso pequeño y reversible podrías dar?<textarea value={notes.next} onChange={(event) => setNotes({ ...notes, next: event.target.value })} placeholder="No tiene que resolverlo todo…" /></label></div><p className="tool-private"><Icon name="moon" size={15} /> Estas notas viven solo mientras esta pantalla esté abierta.</p></div>;
}

function KindnessTool({ active, setActive }) {
  const [harsh, setHarsh] = useState('');
  const [gentle, setGentle] = useState('');
  if (!active) return <button className="tool-card" onClick={() => setActive('kindness')}><span className="tool-card-icon sage-icon"><Icon name="heart" size={22} /></span><span className="tool-card-body"><b>{toolkit[2].title}</b><small>{toolkit[2].subtitle}</small></span><Icon name="arrow" size={18} /></button>;
  return <div className="active-tool decision-active"><button className="tool-back" onClick={() => setActive('')}><Icon name="back" size={16} /> Volver a herramientas</button><span className="section-eyebrow">CAMBIAR LA VOZ, NO LOS HECHOS</span><h3>¿Qué te estás diciendo ahora?</h3><p>No hace falta que te convenzas de nada. Solo busca una frase un poco menos dura y un poco más justa.</p><div className="decision-prompts"><label>La frase que te está pesando<textarea value={harsh} onChange={(event) => setHarsh(event.target.value)} placeholder="Escríbela tal como aparece en tu cabeza…" /></label><label>¿Qué le dirías a alguien que quieres si estuviera en tu lugar?<textarea value={gentle} onChange={(event) => setGentle(event.target.value)} placeholder="No tienes que resolverlo, solo responder con cuidado…" /></label></div><div className="gentle-example"><Icon name="spark" size={16} /><span>Una idea: «Puedo equivocarme y aun así merecer paciencia».</span></div></div>;
}

function ToolsPage() {
  const [active, setActive] = useState('');
  return <div className="page-content tools-page"><div className="page-intro tools-intro"><div><span className="date-kicker">PEQUEÑAS HERRAMIENTAS, SIN PRISA</span><h1>No todo necesita una respuesta ahora.</h1><p>Elige una pausa que te acompañe en este momento. Puedes salir cuando quieras.</p></div><div className="intro-decoration tools-decoration" aria-hidden="true"><Icon name="breathe" size={39} /></div></div><div className="tools-layout"><div className="tools-list"><div className="section-eyebrow">ELIGE LO QUE TE VENDRÍA BIEN</div><BreathingTool active={active === 'pause'} setActive={setActive} /><DecisionTool active={active === 'decision'} setActive={setActive} /><KindnessTool active={active === 'kindness'} setActive={setActive} /></div><aside className="tool-aside"><div className="aside-flower">✳</div><span>NO HAY FORMA CORRECTA</span><p>Una herramienta es solo una invitación. Si no te sirve hoy, puedes dejarla pasar.</p></aside></div></div>;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

function App() {
  const [moments, setMoments] = useState(loadMoments);
  const [page, setPage] = useState('today');
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem('livepersona-theme') || 'light'; } catch { return 'light'; } });
  const [largeText, setLargeText] = useState(() => { try { return localStorage.getItem('livepersona-large-text') === 'true'; } catch { return false; } });
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(moments)); } catch { /* The app remains usable if local storage is unavailable. */ }
  }, [moments]);
  useEffect(() => {
    document.documentElement.dataset.textSize = largeText ? 'large' : 'normal';
    try { localStorage.setItem('livepersona-large-text', String(largeText)); } catch { /* The preference remains active for this session. */ }
  }, [largeText]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('livepersona-theme', theme); } catch { /* The preference remains active for this session. */ }
  }, [theme]);
  const saveMoment = (moment) => setMoments((current) => [moment, ...current]);
  const exportMoments = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) { window.alert('El navegador bloqueó la ventana de impresión. Permite ventanas emergentes para guardar tu recorrido como PDF.'); return; }
    const rows = [...moments].sort((a, b) => new Date(b.date) - new Date(a.date)).map((moment) => {
      const mood = moods.find((item) => item.id === moment.mood)?.label || '';
      const theme = themes.find((item) => item.id === moment.theme)?.label || '';
      return `<article class="entry"><div class="meta"><strong>${escapeHtml(formatMomentDate(moment.date))}</strong>${mood ? `<span>${escapeHtml(mood)}</span>` : ''}${theme ? `<span>${escapeHtml(theme)}</span>` : ''}</div>${moment.prompt ? `<p class="prompt">${escapeHtml(moment.prompt)}</p>` : ''}<p class="note">${escapeHtml(moment.text || 'Hoy guardé un registro de cómo me siento.')}</p></article>`;
    });
    printWindow.document.open();
    printWindow.document.write(`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Mi recorrido — LivePersona</title><style>*{box-sizing:border-box}body{max-width:780px;margin:0 auto;padding:44px 28px;color:#28283b;font:16px/1.65 Arial,sans-serif}header{padding-bottom:22px;border-bottom:2px solid #7056d8}.brand{color:#6650c2;font-size:14px;font-weight:700;letter-spacing:.03em}h1{margin:14px 0 4px;font-size:32px;letter-spacing:-.04em}header p{margin:0;color:#666} .entry{padding:21px 0;border-bottom:1px solid #dedce5;break-inside:avoid}.meta{display:flex;flex-wrap:wrap;align-items:center;gap:8px;color:#777;font-size:13px}.meta strong{color:#38364a}.meta span{padding:2px 9px;border-radius:20px;background:#f0edfa;color:#5c49a5}.prompt{margin:13px 0 4px;color:#777;font-size:14px;font-style:italic}.note{margin:5px 0 0;white-space:pre-wrap;overflow-wrap:anywhere}.privacy{margin-top:26px;color:#777;font-size:12px}.print-hint{margin-top:20px;padding:12px 14px;border-radius:8px;background:#f3f0fc;color:#5c49a5;font-size:13px}.print-button{margin:0 0 22px;padding:11px 16px;border:0;border-radius:8px;background:#7056d8;color:white;font-size:14px;font-weight:700;cursor:pointer}@media print{body{padding:0}.print-button,.print-hint{display:none}.entry{break-inside:avoid}}</style></head><body><button class="print-button" onclick="window.print()">Imprimir o guardar como PDF</button><header><div class="brand">LivePersona</div><h1>Mi recorrido</h1><p>Notas que elegiste guardar para ti.</p></header>${rows.join('')}<p class="privacy">Este archivo contiene tus notas personales. Guárdalo en un lugar privado.</p><p class="print-hint">En la ventana de impresión, elige «Guardar como PDF» como destino.</p></body></html>`);
    printWindow.document.close();
    window.setTimeout(() => { printWindow.focus(); printWindow.print(); }, 350);
  };
  return <div className="app-shell" data-theme={theme}><a href="#main-content" className="skip-link">Saltar al contenido principal</a><Sidebar page={page} setPage={setPage} moments={moments} theme={theme} setTheme={setTheme} largeText={largeText} setLargeText={setLargeText} /><div className="main-shell"><MobileHeader page={page} setPage={setPage} moments={moments} theme={theme} setTheme={setTheme} largeText={largeText} setLargeText={setLargeText} /><main id="main-content" tabIndex="-1">{page === 'today' ? <TodayPage moments={moments} onSave={saveMoment} goToJourney={() => setPage('journey')} /> : page === 'journey' ? <JourneyPage moments={moments} onExport={exportMoments} /> : <ToolsPage />}</main><footer className="app-footer"><span>LivePersona <i>© 2026</i></span><span>Un lugar para estar de tu lado.</span><span className="footer-private"><Icon name="moon" size={14} /> Tus datos viven en tu dispositivo</span></footer></div></div>;
}

export default App;
