export default function SeccionPadresEquino() {
  return (
    <main className="padres-section">
      <h2>Para Padres: ¿Qué es el Pie Equino y la Enfermedad de Sever?</h2>
      <p className="padres-intro">
        Esta guía explica de forma visual qué ocurre en el pie equino no neurológico (acortamiento del tendón de
        Aquiles), cómo afecta la marcha de su hijo/a, qué es la enfermedad de Sever en deportistas de 8 a 14 años,
        y qué hace exactamente la plantilla con alza de talón prescrita.
      </p>

      {/* SECCIÓN 1: Normal vs Equino */}
      <div className="padres-card">
        <h3>1. ¿Qué es el pie equino y cómo camina el niño?</h3>
        <div className="diagrams-row">
          <div className="diagram-box">
            <svg viewBox="0 0 200 130" className="foot-svg">
              <text x="100" y="14" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#276749">Marcha normal</text>
              {/* Side profile of normal foot */}
              <path d="M30 95 Q50 70 100 65 Q140 62 170 80 Q180 90 175 100 L30 100 Z" fill="#fde8d0" stroke="#c07040" strokeWidth="1.5"/>
              {/* Floor */}
              <line x1="20" y1="100" x2="185" y2="100" stroke="#4a5568" strokeWidth="2"/>
              {/* Heel contact */}
              <circle cx="38" cy="100" r="5" fill="#276749" opacity="0.6"/>
              <text x="38" y="115" textAnchor="middle" fontSize="8" fill="#276749">Talón</text>
              {/* Ankle at ~90 degrees */}
              <path d="M70 80 L70 100" stroke="#2b6cb0" strokeWidth="2" strokeDasharray="3,2"/>
              <text x="90" y="72" fontSize="8" fill="#2b6cb0">90°</text>
              <path d="M70 88 Q78 88 78 80" fill="none" stroke="#2b6cb0" strokeWidth="1.2"/>
              <text x="100" y="120" textAnchor="middle" fontSize="8" fill="#276749">Tobillo flexiona bien (≥10°)</text>
            </svg>
          </div>
          <div className="diagram-box">
            <svg viewBox="0 0 200 130" className="foot-svg">
              <text x="100" y="14" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#d97706">Pie equino — puntillas</text>
              {/* Foot in equinus position */}
              <path d="M80 60 Q110 55 145 65 Q165 72 170 90 Q172 100 165 105 L80 105 Q65 90 70 70 Z" fill="#fde8d0" stroke="#c07040" strokeWidth="1.5"/>
              {/* Floor */}
              <line x1="20" y1="105" x2="185" y2="105" stroke="#4a5568" strokeWidth="2"/>
              {/* Only forefoot touches */}
              <path d="M135 105 Q150 105 165 105" stroke="#d97706" strokeWidth="3" opacity="0.7"/>
              {/* Tight achilles */}
              <path d="M110 58 Q100 40 105 20" fill="none" stroke="#dc2626" strokeWidth="2.5"/>
              <text x="80" y="22" fontSize="8" fill="#dc2626" fontWeight="bold">Aquiles</text>
              <text x="80" y="32" fontSize="8" fill="#dc2626">contracturado</text>
              <text x="100" y="122" textAnchor="middle" fontSize="8" fill="#d97706">Solo antepié toca el suelo</text>
            </svg>
          </div>
          <div className="diagram-box">
            <svg viewBox="0 0 200 130" className="foot-svg">
              <text x="100" y="14" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#7c3aed">Compensación del cuerpo</text>
              {/* Leg with hyperpronation */}
              <path d="M85 20 L90 75" stroke="#4a5568" strokeWidth="3"/>
              {/* Foot with collapsed arch */}
              <path d="M30 100 Q55 80 90 75 Q125 78 155 95 Q165 100 160 105 L30 105 Z" fill="#fde8d0" stroke="#c07040" strokeWidth="1.5"/>
              <line x1="20" y1="105" x2="175" y2="105" stroke="#4a5568" strokeWidth="2"/>
              {/* Collapsed arch */}
              <path d="M40 105 Q90 98 145 105" fill="none" stroke="#7c3aed" strokeWidth="2"/>
              <text x="90" y="95" textAnchor="middle" fontSize="7" fill="#7c3aed">Arco colapsado</text>
              {/* Valgus arrow */}
              <path d="M90 75 L100 105" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3,2"/>
              <text x="115" y="90" fontSize="7" fill="#dc2626">Pronación</text>
              <text x="100" y="120" textAnchor="middle" fontSize="8" fill="#7c3aed">Pie busca apoyar todo el talón</text>
            </svg>
          </div>
        </div>
        <p style={{ marginTop: "0.75rem", fontSize: "0.9rem" }}>
          <strong>¿Qué pasa?</strong> Cuando el tendón de Aquiles está acortado, el tobillo no puede doblarse lo
          suficiente hacia arriba (dorsiflexión menor de 10°). Para poder caminar sin caerse hacia delante, el cuerpo
          "busca" más movilidad aplastando el arco del pie hacia adentro (hiperpronación compensatoria). Esto genera
          dolor en el pie, rodilla y espalda baja a largo plazo.
        </p>
        <div className="mejoria-lista" style={{ marginTop: "0.5rem" }}>
          <div className="mejoria-item blue">
            <span className="mi-icon">i</span>
            <div>
              <strong>Antes de los 2 años:</strong> caminar en puntillas es completamente normal mientras el niño aprende.
              No requiere ningún tratamiento.
            </div>
          </div>
          <div className="mejoria-item orange">
            <span className="mi-icon">!</span>
            <div>
              <strong>Después de los 2-3 años:</strong> si el niño sigue caminando en puntillas de forma persistente,
              debe evaluarse el rango de movimiento del tobillo y descartar causas neurológicas.
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: Cadena de compensaciones */}
      <div className="padres-card">
        <h3>2. La cadena de compensaciones biomecánicas</h3>
        <svg viewBox="0 0 700 140" className="chain-svg">
          {[
            { x: 5, label: "Aquiles\ncontracturado", color: "#fff7ed", border: "#d97706" },
            { x: 140, label: "Tobillo\nno flexiona", color: "#fff7ed", border: "#f59e0b" },
            { x: 275, label: "Arco medial\nse aplana", color: "#f5f3ff", border: "#7c3aed" },
            { x: 410, label: "Rodilla\nhiperextiende", color: "#fff5f5", border: "#fc8181" },
            { x: 545, label: "Dolor\npie / rodilla", color: "#fff5f5", border: "#dc2626" },
          ].map((item, i) => (
            <g key={i}>
              <rect x={item.x} y="35" width="125" height="55" rx="8" fill={item.color} stroke={item.border} strokeWidth="1.5"/>
              {item.label.split("\n").map((line, li) => (
                <text key={li} x={item.x + 62} y={57 + li * 16} textAnchor="middle" fontSize="11" fill="#2d3748">{line}</text>
              ))}
              {i < 4 && (
                <path d={`M${item.x + 127} 62 L${item.x + 138} 62`} stroke="#718096" strokeWidth="2" markerEnd="url(#arr3)"/>
              )}
            </g>
          ))}
          <defs>
            <marker id="arr3" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 Z" fill="#718096"/>
            </marker>
          </defs>
          <text x="350" y="120" textAnchor="middle" fontSize="10" fill="#718096">
            La plantilla con alza rompe esta cadena al devolver movilidad al tobillo
          </text>
        </svg>
      </div>

      {/* SECCIÓN 3: Test de Silfverskiold */}
      <div className="padres-card">
        <h3>3. ¿Qué es el Test de Silfverskiold?</h3>
        <p style={{ fontSize: "0.9rem", marginBottom: "0.75rem" }}>
          Este test distingue <strong>qué músculo está acortado</strong>: el gastrocnemio (superficial) o el conjunto
          gastro-sóleo (profundo). La diferencia cambia el tipo de estiramiento que debe realizar su hijo/a.
        </p>
        <div className="diagrams-row">
          <div className="diagram-box">
            <svg viewBox="0 0 200 150" className="foot-svg">
              <text x="100" y="14" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#059669">Positivo — Solo Gastrocnemio</text>
              {/* Leg straight - limited */}
              <text x="55" y="35" fontSize="9" fill="#dc2626">Rodilla extendida → limitado</text>
              <path d="M50 45 L50 110" stroke="#dc2626" strokeWidth="3"/>
              <path d="M20 110 Q50 110 75 120" fill="none" stroke="#c07040" strokeWidth="2.5"/>
              <text x="100" y="125" fontSize="8" fill="#dc2626">DF &lt;10°</text>
              {/* Leg bent - free */}
              <text x="130" y="35" fontSize="9" fill="#059669">Rodilla flexionada → libre</text>
              <path d="M155 45 L145 90 L120 110" stroke="#059669" strokeWidth="3"/>
              <path d="M95 110 Q120 108 140 115" fill="none" stroke="#c07040" strokeWidth="2.5"/>
              <text x="150" y="125" fontSize="8" fill="#059669">DF ≥10°</text>
            </svg>
          </div>
          <div className="diagram-box">
            <svg viewBox="0 0 200 150" className="foot-svg">
              <text x="100" y="14" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#d97706">Negativo — Gastro-Sóleo</text>
              <text x="55" y="35" fontSize="9" fill="#dc2626">Rodilla extendida → limitado</text>
              <path d="M50 45 L50 110" stroke="#dc2626" strokeWidth="3"/>
              <path d="M20 110 Q50 110 75 120" fill="none" stroke="#c07040" strokeWidth="2.5"/>
              <text x="100" y="125" fontSize="8" fill="#dc2626">DF &lt;10°</text>
              <text x="130" y="35" fontSize="9" fill="#dc2626">Rodilla flexionada → IGUAL</text>
              <path d="M155 45 L145 90 L120 110" stroke="#dc2626" strokeWidth="3"/>
              <path d="M95 110 Q120 108 140 120" fill="none" stroke="#c07040" strokeWidth="2.5"/>
              <text x="150" y="125" fontSize="8" fill="#dc2626">DF &lt;10°</text>
            </svg>
          </div>
        </div>
        <div className="semaforo-grid" style={{ marginTop: "0.75rem" }}>
          <div className="semaforo-card verde">
            <div className="semaforo-dot verde-dot"></div>
            <h4>Gastrocnemio aislado (Silfverskiold +)</h4>
            <ul>
              <li>Mejora al doblar la rodilla</li>
              <li>Estiramiento con rodilla extendida</li>
              <li>Mejor pronóstico con plantilla</li>
              <li>Responde bien a fisioterapia</li>
            </ul>
          </div>
          <div className="semaforo-card amarillo">
            <div className="semaforo-dot amarillo-dot"></div>
            <h4>Gastro-sóleo complejo (Silfverskiold −)</h4>
            <ul>
              <li>Persiste al doblar la rodilla</li>
              <li>Estiramiento con rodilla en ligera flexión</li>
              <li>Requiere alza mayor y material más firme</li>
              <li>Puede necesitar fisioterapia intensiva</li>
            </ul>
          </div>
        </div>
      </div>

      {/* SECCIÓN 4: Enfermedad de Sever */}
      <div className="padres-card">
        <h3>4. ¿Qué es la Enfermedad de Sever? (Apofisitis calcánea)</h3>
        <p style={{ fontSize: "0.9rem", marginBottom: "0.75rem" }}>
          La enfermedad de Sever <strong>no es una enfermedad grave</strong>. Es una irritación de la placa de
          crecimiento del talón (apófisis calcánea) muy frecuente en niños deportistas de <strong>8 a 14 años</strong>.
          Desaparece sola alrededor de los 15 años cuando el hueso madura.
        </p>
        <div className="diagrams-row">
          <div className="diagram-box">
            <svg viewBox="0 0 200 140" className="foot-svg">
              <text x="100" y="14" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#d97706">Apófisis calcánea</text>
              {/* Heel bone */}
              <ellipse cx="100" cy="90" rx="60" ry="40" fill="#fde8d0" stroke="#c07040" strokeWidth="1.5"/>
              {/* Growth plate */}
              <ellipse cx="100" cy="72" rx="30" ry="8" fill="#fca5a5" stroke="#dc2626" strokeWidth="2" strokeDasharray="3,2"/>
              <text x="100" y="75" textAnchor="middle" fontSize="7" fill="#dc2626">Placa de crecimiento</text>
              {/* Achilles pull */}
              <path d="M100 50 L100 30" stroke="#dc2626" strokeWidth="3" markerEnd="url(#pullArr)"/>
              <text x="100" y="25" textAnchor="middle" fontSize="8" fill="#dc2626">Aquiles tira hacia arriba</text>
              {/* Plantar pull */}
              <path d="M60 95 L35 105" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#pullArr2)"/>
              <text x="20" y="120" fontSize="7" fill="#f59e0b">Fascia plantar</text>
              <text x="100" y="135" textAnchor="middle" fontSize="8" fill="#718096">La apófisis queda atrapada entre dos fuerzas</text>
              <defs>
                <marker id="pullArr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill="#dc2626"/>
                </marker>
                <marker id="pullArr2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill="#f59e0b"/>
                </marker>
              </defs>
            </svg>
          </div>
          <div className="diagram-box">
            <div className="mejoria-lista">
              <div className="mejoria-item green">
                <span className="mi-icon">✓</span>
                <div><strong>¿Es grave?</strong> No. Es una condición benigna de crecimiento.</div>
              </div>
              <div className="mejoria-item green">
                <span className="mi-icon">✓</span>
                <div><strong>¿Cura sola?</strong> Sí, al completar el crecimiento (~15 años).</div>
              </div>
              <div className="mejoria-item orange">
                <span className="mi-icon">!</span>
                <div><strong>Deportes:</strong> Reducir intensidad temporalmente. No suspender completamente.</div>
              </div>
              <div className="mejoria-item blue">
                <span className="mi-icon">i</span>
                <div><strong>La plantilla</strong> reduce la tracción sobre la apófisis con el alza de talón.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 5: Qué hace la plantilla */}
      <div className="padres-card">
        <h3>5. ¿Qué hace la plantilla con alza de talón?</h3>
        <svg viewBox="0 0 500 130" className="plantilla-svg">
          {/* Without insole */}
          <text x="100" y="15" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#d97706">Sin alza — Aquiles tenso</text>
          <path d="M20 95 Q35 70 60 62 Q90 58 130 68 Q148 76 150 95 L20 95 Z" fill="#fde8d0" stroke="#c07040" strokeWidth="1.5"/>
          <line x1="15" y1="95" x2="155" y2="95" stroke="#4a5568" strokeWidth="2"/>
          <path d="M70 60 L70 30" stroke="#dc2626" strokeWidth="2.5"/>
          <text x="70" y="22" textAnchor="middle" fontSize="8" fill="#dc2626">Aquiles tenso</text>

          <line x1="185" y1="10" x2="185" y2="120" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="4,3"/>

          {/* With insole */}
          <text x="360" y="15" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#276749">Con alza — Aquiles relajado</text>
          <path d="M210 85 Q225 60 250 52 Q280 48 320 58 Q338 66 340 85 L210 85 Z" fill="#fde8d0" stroke="#c07040" strokeWidth="1.5"/>
          {/* Heel lift */}
          <path d="M295 85 Q320 85 340 85 L340 95 L295 90 Z" fill="rgba(217,119,6,0.55)" stroke="#d97706" strokeWidth="1.5"/>
          <line x1="205" y1="95" x2="345" y2="95" stroke="#4a5568" strokeWidth="2"/>
          {/* Arch support */}
          <path d="M210 85 Q240 78 275 78 Q300 78 295 85 Z" fill="rgba(99,102,241,0.4)" stroke="rgba(99,102,241,0.8)" strokeWidth="1.5"/>
          <path d="M258 52 L258 28" stroke="#276749" strokeWidth="2.5"/>
          <text x="258" y="20" textAnchor="middle" fontSize="8" fill="#276749">Aquiles relajado</text>
          <text x="318" y="110" textAnchor="middle" fontSize="8" fill="#d97706">Alza (naranja)</text>
          <text x="248" y="110" textAnchor="middle" fontSize="8" fill="#6366f1">Soporte arco (azul)</text>
          <defs>
            <marker id="arr4" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#276749"/>
            </marker>
          </defs>
        </svg>
        <p className="plantilla-note">
          El alza de talón eleva el punto de apoyo del calcáneo, acortando funcionalmente el recorrido del Aquiles.
          Esto reduce la tensión sobre el tendón y sobre la apófisis calcánea (Sever). El soporte de arco medial
          bloquea la hiperpronación compensatoria.
        </p>
      </div>

      {/* SECCIÓN 6: Estiramientos */}
      <div className="padres-card">
        <h3>6. Protocolo de Estiramientos Diarios</h3>
        <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
          Los estiramientos son <strong>tan importantes como la plantilla</strong>. Realizar 2 veces al día: mañana
          antes de levantarse y noche antes de dormir.
        </p>
        <div className="diagrams-row">
          <div className="diagram-box">
            <svg viewBox="0 0 200 160" className="foot-svg">
              <text x="100" y="14" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#059669">Estiramiento gastrocnemio</text>
              <text x="100" y="26" textAnchor="middle" fontSize="8" fill="#718096">(rodilla extendida)</text>
              {/* Person against wall */}
              <rect x="160" y="30" width="8" height="110" fill="#e2e8f0" stroke="#718096" strokeWidth="1"/>
              {/* Body */}
              <circle cx="100" cy="45" r="12" fill="#fde8d0" stroke="#c07040" strokeWidth="1.5"/>
              <path d="M100 57 L100 95" stroke="#4a5568" strokeWidth="3"/>
              {/* Front leg */}
              <path d="M100 95 L125 130 L130 140" stroke="#4a5568" strokeWidth="2.5"/>
              {/* Back leg (stretched) */}
              <path d="M100 95 L75 130 L70 150" stroke="#059669" strokeWidth="2.5"/>
              {/* Foot flat */}
              <path d="M55 150 L85 150" stroke="#d97706" strokeWidth="2.5"/>
              {/* Arrows to wall */}
              <path d="M100 75 L155 75" stroke="#dc2626" strokeWidth="1.5" markerEnd="url(#wa1)" strokeDasharray="4,3"/>
              <defs>
                <marker id="wa1" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill="#dc2626"/>
                </marker>
              </defs>
              <text x="100" y="155" textAnchor="middle" fontSize="8" fill="#059669">30 seg × 3 repeticiones</text>
            </svg>
          </div>
          <div className="diagram-box">
            <svg viewBox="0 0 200 160" className="foot-svg">
              <text x="100" y="14" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#d97706">Estiramiento sóleo</text>
              <text x="100" y="26" textAnchor="middle" fontSize="8" fill="#718096">(rodilla flexionada)</text>
              {/* Person squatting against wall */}
              <rect x="160" y="30" width="8" height="110" fill="#e2e8f0" stroke="#718096" strokeWidth="1"/>
              <circle cx="100" cy="55" r="12" fill="#fde8d0" stroke="#c07040" strokeWidth="1.5"/>
              <path d="M100 67 L100 95" stroke="#4a5568" strokeWidth="3"/>
              {/* Bent front leg */}
              <path d="M100 95 L120 120 L118 140" stroke="#4a5568" strokeWidth="2.5"/>
              {/* Bent back leg (soleus stretch) */}
              <path d="M100 95 L78 120 L80 140" stroke="#d97706" strokeWidth="2.5"/>
              <path d="M65 140 L92 140" stroke="#d97706" strokeWidth="2.5"/>
              {/* Knee bent indicator */}
              <path d="M78 120 Q68 125 70 135" fill="none" stroke="#dc2626" strokeWidth="1.5"/>
              <text x="55" y="135" fontSize="7" fill="#dc2626">Rodilla</text>
              <text x="55" y="143" fontSize="7" fill="#dc2626">doblada</text>
              <text x="100" y="155" textAnchor="middle" fontSize="8" fill="#d97706">30 seg × 3 repeticiones</text>
            </svg>
          </div>
          <div className="diagram-box">
            <svg viewBox="0 0 200 160" className="foot-svg">
              <text x="100" y="14" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#7c3aed">Hielo post-deporte</text>
              <text x="100" y="26" textAnchor="middle" fontSize="8" fill="#718096">(solo si hay dolor)</text>
              {/* Heel with ice */}
              <ellipse cx="100" cy="100" rx="55" ry="40" fill="#fde8d0" stroke="#c07040" strokeWidth="1.5"/>
              {/* Ice pack */}
              <ellipse cx="100" cy="118" rx="35" ry="18" fill="rgba(147,197,253,0.7)" stroke="#3b82f6" strokeWidth="1.5"/>
              <text x="100" y="120" textAnchor="middle" fontSize="8" fill="#1d4ed8">Hielo</text>
              <text x="100" y="130" textAnchor="middle" fontSize="7" fill="#1d4ed8">envuelto en toalla</text>
              <text x="100" y="150" textAnchor="middle" fontSize="8" fill="#7c3aed">15 minutos máximo</text>
              <text x="100" y="160" textAnchor="middle" fontSize="7.5" fill="#718096">Nunca hielo directo en piel</text>
            </svg>
          </div>
        </div>
        <div className="mejoria-lista" style={{ marginTop: "0.5rem" }}>
          <div className="mejoria-item green">
            <span className="mi-icon">✓</span>
            <div><strong>Gastrocnemio (Silfverskiold +):</strong> Pararse frente a la pared, manos apoyadas, pierna trasera extendida con talón en el suelo. 30 segundos × 3 repeticiones por pierna. 2 veces al día.</div>
          </div>
          <div className="mejoria-item orange">
            <span className="mi-icon">!</span>
            <div><strong>Sóleo (Silfverskiold −):</strong> Misma posición pero doblar levemente la rodilla trasera. 30 segundos × 3 repeticiones por pierna. 2 veces al día.</div>
          </div>
          <div className="mejoria-item blue">
            <span className="mi-icon">i</span>
            <div><strong>Hielo post-deporte (Sever):</strong> 15 minutos envuelto en una toalla delgada. Nunca hielo directo sobre la piel. Solo si hay dolor después de actividad deportiva.</div>
          </div>
        </div>
      </div>

      {/* SECCIÓN 7: Semáforo de alarma */}
      <div className="padres-card">
        <h3>7. Semáforo de Alarma</h3>
        <div className="semaforo-grid">
          <div className="semaforo-card verde">
            <div className="semaforo-dot verde-dot"></div>
            <h4>Sin urgencia</h4>
            <ul>
              <li>Dolor de talón bilateral en niño deportista 8-14 años</li>
              <li>Dolor mejora con reposo</li>
              <li>Camina normalmente el resto del día</li>
              <li>Estiramientos reducen molestia</li>
            </ul>
          </div>
          <div className="semaforo-card amarillo">
            <div className="semaforo-dot amarillo-dot"></div>
            <h4>Consultar pronto</h4>
            <ul>
              <li>Solo un pie con equino (asimétrico)</li>
              <li>El niño evita caminar por dolor</li>
              <li>Dolor metatarsal central persistente</li>
              <li>No mejora tras 4-6 semanas de plantilla</li>
            </ul>
          </div>
          <div className="semaforo-card rojo">
            <div className="semaforo-dot rojo-dot"></div>
            <h4>Derivar urgente</h4>
            <ul>
              <li>Debilidad muscular o asimetría motora</li>
              <li>Dolor nocturno que despierta al niño</li>
              <li>Pie equino antes de los 2 años o después de los 14 sin mejora</li>
              <li>Signos neurológicos: espasticidad, hiperreflexia</li>
            </ul>
          </div>
        </div>
      </div>

      {/* SECCIÓN 8: Instructivo de adaptación */}
      <div className="padres-card">
        <h3>8. Adaptación y Cuidados de la Plantilla</h3>
        <div className="mejoria-lista">
          <div className="mejoria-item blue">
            <span className="mi-icon">⏱️</span>
            <div>
              <strong>Período de adaptación gradual:</strong>
              <ul style={{ paddingLeft: "1.2rem", marginTop: "0.25rem" }}>
                <li><strong>Día 1-2:</strong> 1 a 2 horas de uso.</li>
                <li><strong>Día 3-4:</strong> 3 a 4 horas.</li>
                <li><strong>Día 5 en adelante:</strong> Uso completo si no hay molestias en el talón o el arco.</li>
              </ul>
            </div>
          </div>
          <div className="mejoria-item green">
            <span className="mi-icon">✓</span>
            <div>
              <strong>Calzado adecuado:</strong> Contrafuerte rígido en el talón, suela con amortiguación media.
              Evitar chanclas o zapatos sin sujeción al calcáneo con la plantilla equino.
            </div>
          </div>
          <div className="mejoria-item orange">
            <span className="mi-icon">!</span>
            <div>
              <strong>Mantenimiento:</strong> Limpiar con paño húmedo. No exponer a calor excesivo (sol directo,
              secadora) porque el EVA se deforma. Revisar el alza de poliuretano cada 6 meses.
            </div>
          </div>
          <div className="mejoria-item blue">
            <span className="mi-icon">i</span>
            <div>
              <strong>Control a los 3 meses:</strong> Verificar adaptación del material, evolución del rango de
              dorsiflexión y grado de hiperpronación compensatoria.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
