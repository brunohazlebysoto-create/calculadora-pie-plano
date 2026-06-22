export default function SeccionPadresCavo() {
  return (
    <main className="padres-section">
      <h2>Para Padres: ¿Qué es el Pie Cavo?</h2>
      <p className="padres-intro">
        Esta sección explica de forma visual qué es el pie cavo, por qué aparece, cuándo requiere tratamiento
        y cómo funciona la plantilla ortopédica para esta condición.
      </p>

      {/* DIAGRAMA 1: Arco normal vs pie cavo */}
      <div className="padres-card">
        <h3>1. ¿Qué es el arco del pie y qué pasa cuando es excesivo?</h3>
        <div className="diagrams-row">
          <div className="diagram-box">
            <svg viewBox="0 0 200 120" className="foot-svg">
              <text x="100" y="14" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#2b6cb0">Pie normal</text>
              <path d="M30 100 Q40 50 70 40 Q100 32 140 40 Q165 48 170 100 Z" fill="#fde8d0" stroke="#c07040" strokeWidth="1.5"/>
              <path d="M50 100 Q80 60 130 100" fill="none" stroke="#2b6cb0" strokeWidth="2.5" strokeDasharray="4,2"/>
              <rect x="25" y="100" width="155" height="3" rx="1" fill="#c07040" opacity="0.3"/>
              <path d="M30 103 Q60 103 75 103 L75 103 Q95 103 95 103 L140 103 Q155 103 168 103" fill="none" stroke="#c07040" strokeWidth="2"/>
              <path d="M75 103 Q100 96 125 103" fill="#f0f4f8" stroke="none"/>
              <text x="100" y="116" textAnchor="middle" fontSize="9" fill="#4a5568">Espacio libre bajo el arco</text>
              <text x="100" y="72" textAnchor="middle" fontSize="9" fill="#2b6cb0">Arco medial</text>
            </svg>
          </div>

          <div className="diagram-box">
            <svg viewBox="0 0 200 120" className="foot-svg">
              <text x="100" y="14" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#5b21b6">Pie cavo</text>
              <path d="M30 100 Q35 45 65 30 Q100 18 140 30 Q165 40 170 100 Z" fill="#fde8d0" stroke="#c07040" strokeWidth="1.5"/>
              {/* Arco exageradamente alto */}
              <path d="M48 100 Q80 38 135 100" fill="none" stroke="#7c3aed" strokeWidth="2.5"/>
              <rect x="25" y="100" width="155" height="3" rx="1" fill="#c07040" opacity="0.3"/>
              {/* Huella: solo talón y antepié */}
              <path d="M30 103 L55 103" fill="none" stroke="#c07040" strokeWidth="2.5"/>
              <path d="M140 103 L168 103" fill="none" stroke="#c07040" strokeWidth="2.5"/>
              <text x="100" y="116" textAnchor="middle" fontSize="9" fill="#5b21b6">Talón y antepié separados</text>
              <text x="100" y="28" textAnchor="middle" fontSize="9" fill="#7c3aed">Arco excesivo</text>
              <defs>
                <marker id="arrowUp" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <path d="M3,0 L6,6 L0,6 Z" fill="#7c3aed"/>
                </marker>
              </defs>
              <line x1="100" y1="98" x2="100" y2="45" stroke="#7c3aed" strokeWidth="1.5" markerEnd="url(#arrowUp)"/>
            </svg>
          </div>

          <div className="diagram-box">
            <svg viewBox="0 0 200 120" className="foot-svg">
              <text x="100" y="14" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#2d3748">Vista posterior</text>
              {/* Talón normal */}
              <g transform="translate(20, 20)">
                <text x="25" y="10" textAnchor="middle" fontSize="9" fill="#276749">Normal</text>
                <rect x="5" y="15" width="35" height="42" rx="17" fill="#fde8d0" stroke="#c07040" strokeWidth="1.5"/>
                <line x1="22" y1="57" x2="22" y2="72" stroke="#276749" strokeWidth="1.5"/>
                <text x="22" y="82" textAnchor="middle" fontSize="8" fill="#276749">Alineado</text>
              </g>
              {/* Talón varo (pie cavo) */}
              <g transform="translate(110, 20)">
                <text x="25" y="10" textAnchor="middle" fontSize="9" fill="#5b21b6">Pie cavo</text>
                <rect x="5" y="15" width="35" height="42" rx="17" fill="#fde8d0" stroke="#c07040" strokeWidth="1.5" transform="rotate(-10, 22, 36)"/>
                <line x1="22" y1="57" x2="22" y2="72" stroke="#718096" strokeWidth="1.5" strokeDasharray="3,2"/>
                <line x1="22" y1="57" x2="14" y2="72" stroke="#7c3aed" strokeWidth="2"/>
                <text x="20" y="82" textAnchor="middle" fontSize="8" fill="#5b21b6">Talón varo</text>
              </g>
            </svg>
          </div>
        </div>
        <p style={{ marginTop: "0.5rem", fontSize: "0.88rem" }}>
          En el pie cavo el arco longitudinal es <strong>excesivamente alto</strong>. Solo el talón y el antepié tocan
          el suelo, lo que concentra toda la carga en esas dos zonas y puede provocar dolor, callosidades y dedos en garra.
        </p>
      </div>

      {/* DIAGRAMA 2: Mecanismo biomecánico */}
      <div className="padres-card">
        <h3>2. ¿Por qué causa molestias? La cadena de carga</h3>
        <svg viewBox="0 0 660 140" className="chain-svg">
          {[
            { x: 10,  label: "Arco muy\nelevado",       color: "#f3e8ff", border: "#7c3aed" },
            { x: 145, label: "Solo talón y\nantepié apoyan", color: "#ede9fe", border: "#8b5cf6" },
            { x: 280, label: "Presión excesiva\nen esas zonas", color: "#fff5f5", border: "#fc8181" },
            { x: 415, label: "Dolor, callosidades\ny dedos en garra", color: "#fff5f5", border: "#f87171" },
            { x: 550, label: "Inestabilidad\nen tobillo", color: "#fef3c7", border: "#f59e0b" },
          ].map((item, i) => (
            <g key={i}>
              <rect x={item.x} y="30" width="125" height="58" rx="8" fill={item.color} stroke={item.border} strokeWidth="1.5"/>
              {item.label.split("\n").map((line, li) => (
                <text key={li} x={item.x + 62} y={54 + li * 17} textAnchor="middle" fontSize="11" fill="#2d3748">{line}</text>
              ))}
              {i < 4 && (
                <path d={`M${item.x + 127} 59 L${item.x + 143} 59`} stroke="#718096" strokeWidth="2" markerEnd="url(#arr3)"/>
              )}
            </g>
          ))}
          <defs>
            <marker id="arr3" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 Z" fill="#718096"/>
            </marker>
          </defs>
          <text x="330" y="118" textAnchor="middle" fontSize="10" fill="#718096">
            El tratamiento ortopédico busca redistribuir estas cargas y amortiguar el impacto
          </text>
        </svg>
      </div>

      {/* DIAGRAMA 3: Causas y tipos */}
      <div className="padres-card">
        <h3>3. ¿Por qué ocurre el pie cavo?</h3>
        <div className="semaforo-grid">
          <div className="semaforo-card verde">
            <div className="semaforo-dot verde-dot"></div>
            <h4>Idiopático (más frecuente)</h4>
            <ul>
              <li>Sin causa identificable</li>
              <li>Puede ser hereditario</li>
              <li>Aparece gradualmente en la infancia</li>
              <li>Generalmente bilateral (ambos pies)</li>
            </ul>
          </div>
          <div className="semaforo-card amarillo">
            <div className="semaforo-dot amarillo-dot"></div>
            <h4>Neurológico (importante descartar)</h4>
            <ul>
              <li>Enfermedad de Charcot-Marie-Tooth</li>
              <li>Espina bífida u otros disrafismos</li>
              <li>Parálisis cerebral o secuelas neuro</li>
              <li><strong>Requiere evaluación médica especializada</strong></li>
            </ul>
          </div>
          <div className="semaforo-card rojo">
            <div className="semaforo-dot rojo-dot"></div>
            <h4>Señales de alerta neurológica</h4>
            <ul>
              <li>Pie cavo en menor de 4 años</li>
              <li>Un solo pie afectado (unilateral)</li>
              <li>Progresa rápidamente</li>
              <li>Debilidad muscular o tropiezos frecuentes</li>
            </ul>
          </div>
        </div>
      </div>

      {/* DIAGRAMA 4: Qué hace la plantilla en pie cavo */}
      <div className="padres-card">
        <h3>4. ¿Qué hace la plantilla en el pie cavo?</h3>
        <svg viewBox="0 0 520 140" className="plantilla-svg">
          {/* Sin plantilla */}
          <text x="105" y="15" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#c05621">Sin plantilla</text>
          <path d="M20 100 Q22 50 45 30 Q80 15 120 30 Q148 42 150 100 Z" fill="#fde8d0" stroke="#c07040" strokeWidth="1.5"/>
          <line x1="20" y1="100" x2="150" y2="100" stroke="#4a5568" strokeWidth="2"/>
          {/* Solo 2 puntos de contacto */}
          <circle cx="32" cy="100" r="5" fill="#e53e3e" opacity="0.8"/>
          <circle cx="140" cy="100" r="5" fill="#e53e3e" opacity="0.8"/>
          <line x1="32" y1="94" x2="32" y2="60" stroke="#e53e3e" strokeWidth="2" strokeDasharray="3,2"/>
          <line x1="140" y1="94" x2="140" y2="60" stroke="#e53e3e" strokeWidth="2" strokeDasharray="3,2"/>
          <text x="32" y="56" textAnchor="middle" fontSize="8" fill="#c53030">Carga</text>
          <text x="140" y="56" textAnchor="middle" fontSize="8" fill="#c53030">Carga</text>
          <text x="85" y="80" textAnchor="middle" fontSize="8" fill="#718096">Sin contacto</text>
          <text x="85" y="90" textAnchor="middle" fontSize="8" fill="#718096">en el arco</text>

          <line x1="182" y1="10" x2="182" y2="128" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="4,3"/>

          {/* Con plantilla */}
          <text x="365" y="15" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#276749">Con plantilla</text>
          <path d="M200 100 Q202 50 225 30 Q260 15 300 30 Q328 42 330 100 Z" fill="#fde8d0" stroke="#c07040" strokeWidth="1.5"/>
          {/* Plantilla rellena el arco */}
          <path d="M200 100 Q212 72 265 65 Q298 68 330 100 Z" fill="#ddd6fe" stroke="#7c3aed" strokeWidth="1.5" opacity="0.9"/>
          <line x1="200" y1="100" x2="330" y2="100" stroke="#4a5568" strokeWidth="2"/>
          {/* Distribución uniforme */}
          {[215, 240, 265, 290, 315].map((x, i) => (
            <line key={i} x1={x} y1="78" x2={x} y2="98" stroke="#7c3aed" strokeWidth="1.5" markerEnd="url(#parr)"/>
          ))}
          <text x="265" y="62" textAnchor="middle" fontSize="9" fill="#5b21b6">Carga distribuida uniformemente</text>
          <text x="265" y="112" textAnchor="middle" fontSize="8" fill="#7c3aed">Plantilla rellena el vacío del arco</text>

          <rect x="348" y="60" width="12" height="12" fill="#ddd6fe" stroke="#7c3aed" strokeWidth="1"/>
          <text x="364" y="71" fontSize="9" fill="#5b21b6">Plantilla</text>
          <rect x="348" y="78" width="12" height="12" fill="#fde8d0" stroke="#c07040" strokeWidth="1"/>
          <text x="364" y="89" fontSize="9" fill="#4a5568">Pie</text>

          <defs>
            <marker id="parr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#7c3aed"/>
            </marker>
          </defs>
        </svg>
        <p className="plantilla-note">
          La plantilla del pie cavo <strong>rellena el arco</strong> para distribuir la presión en toda la planta,
          amortigua el impacto en el talón y antepié, y puede incluir una cuña para corregir la inclinación del talón.
        </p>
      </div>

      {/* DIAGRAMA 5: Test de Coleman */}
      <div className="padres-card">
        <h3>5. El Test de Coleman: ¿por qué importa?</h3>
        <div className="diagrams-row">
          <div className="diagram-box" style={{ flex: 1 }}>
            <svg viewBox="0 0 200 110" className="foot-svg">
              <text x="100" y="13" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#059669">Coleman Positivo (Flexible)</text>
              {/* Bloque bajo el pie */}
              <rect x="20" y="88" width="80" height="12" rx="3" fill="#d1fae5" stroke="#059669" strokeWidth="1.5"/>
              <text x="60" y="98" textAnchor="middle" fontSize="7" fill="#065f46">Bloque</text>
              {/* Pie con talón corregido */}
              <path d="M25 88 Q30 60 55 48 Q80 38 105 48 Q125 60 130 88 Z" fill="#fde8d0" stroke="#c07040" strokeWidth="1.5"/>
              <line x1="100" y1="88" x2="100" y2="55" stroke="#059669" strokeWidth="2"/>
              <text x="100" y="48" textAnchor="middle" fontSize="8" fill="#059669">Talón se</text>
              <text x="100" y="57" textAnchor="middle" fontSize="8" fill="#059669">alinea</text>
              <text x="75" y="105" textAnchor="middle" fontSize="8" fill="#059669">Retropié flexible → Cut-out</text>
            </svg>
          </div>
          <div className="diagram-box" style={{ flex: 1 }}>
            <svg viewBox="0 0 200 110" className="foot-svg">
              <text x="100" y="13" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#7c3aed">Coleman Negativo (Rígido)</text>
              {/* Bloque bajo el pie */}
              <rect x="20" y="88" width="80" height="12" rx="3" fill="#ede9fe" stroke="#7c3aed" strokeWidth="1.5"/>
              <text x="60" y="98" textAnchor="middle" fontSize="7" fill="#4c1d95">Bloque</text>
              {/* Pie con talón sin corregir */}
              <path d="M25 88 Q30 60 55 48 Q80 38 105 48 Q125 60 130 88 Z" fill="#fde8d0" stroke="#c07040" strokeWidth="1.5" transform="rotate(-8, 75, 68)"/>
              <line x1="100" y1="88" x2="100" y2="55" stroke="#718096" strokeWidth="1.5" strokeDasharray="3,2"/>
              <line x1="100" y1="88" x2="92" y2="55" stroke="#7c3aed" strokeWidth="2"/>
              <text x="105" y="48" textAnchor="middle" fontSize="8" fill="#7c3aed">Talón no</text>
              <text x="105" y="57" textAnchor="middle" fontSize="8" fill="#7c3aed">se corrige</text>
              <text x="75" y="105" textAnchor="middle" fontSize="8" fill="#7c3aed">Retropié rígido → Cuña interna</text>
            </svg>
          </div>
        </div>
        <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
          El especialista realiza este test colocando un bloque bajo el antepié. Si el talón se endereza
          (positivo), el pie es <strong>flexible</strong> y se puede hacer una corrección con un recorte especial.
          Si no se mueve (negativo), el pie es <strong>rígido</strong> y se usa una cuña acomodativa.
        </p>
      </div>

      {/* DIAGRAMA 6: Signos de alarma y cuándo consultar */}
      <div className="padres-card">
        <h3>6. ¿Cuándo debo preocuparme?</h3>
        <div className="semaforo-grid">
          <div className="semaforo-card verde">
            <div className="semaforo-dot verde-dot"></div>
            <h4>Seguimiento habitual</h4>
            <ul>
              <li>Pie cavo leve sin dolor al caminar</li>
              <li>Callosidades leves bajo el antepié</li>
              <li>Afecta ambos pies por igual</li>
              <li>Sin tropiezos ni caídas frecuentes</li>
            </ul>
          </div>
          <div className="semaforo-card amarillo">
            <div className="semaforo-dot amarillo-dot"></div>
            <h4>Consultar pronto</h4>
            <ul>
              <li>Dolor en talón o cabezas metatarsales</li>
              <li>Dedos en garra que se acentúan</li>
              <li>Esguinces de tobillo frecuentes</li>
              <li>Cambio progresivo de la forma del pie</li>
            </ul>
          </div>
          <div className="semaforo-card rojo">
            <div className="semaforo-dot rojo-dot"></div>
            <h4>Derivación urgente</h4>
            <ul>
              <li>Pie cavo en menor de 4 años</li>
              <li>Solo un pie afectado</li>
              <li>Debilidad muscular o caída del pie</li>
              <li>Dolor nocturno intenso o deformidad rápida</li>
            </ul>
          </div>
        </div>
      </div>

      {/* INSTRUCTIVO DE USO */}
      <div className="padres-card">
        <h3>7. Instructivo de Adaptación y Uso de la Plantilla</h3>
        <div className="mejoria-lista">
          <div className="mejoria-item blue">
            <span className="mi-icon">⏱️</span>
            <div>
              <strong>Adaptación gradual:</strong>
              <ul style={{ paddingLeft: "1.2rem", marginTop: "0.25rem" }}>
                <li><strong>Día 1:</strong> 1 a 2 horas de uso.</li>
                <li><strong>Día 2:</strong> 2 a 3 horas.</li>
                <li><strong>Día 3:</strong> 4 a 5 horas.</li>
                <li><strong>Día 4 en adelante:</strong> Uso completo si no hay molestias.</li>
              </ul>
            </div>
          </div>
          <div className="mejoria-item green">
            <span className="mi-icon">✓</span>
            <div>
              <strong>Calzado adecuado:</strong> Contrafuerte rígido en el talón, puntera ancha para no comprimir los dedos,
              y plantilla extraíble para reemplazarla por la ortesis. Evitar calzado muy plano o sin soporte lateral.
            </div>
          </div>
          <div className="mejoria-item orange">
            <span className="mi-icon">!</span>
            <div>
              <strong>Higiene y mantenimiento:</strong> Limpiar con paño húmedo y jabón suave. No sumergir en agua
              ni secar al sol o con calor directo para evitar deformaciones del material.
            </div>
          </div>
        </div>
      </div>

      <div className="padres-card">
        <h3>8. Cronograma de Controles y Signos de Alarma con la Plantilla</h3>
        <div className="semaforo-grid">
          <div className="semaforo-card verde">
            <div className="semaforo-dot verde-dot"></div>
            <h4>Cronograma de Seguimiento</h4>
            <ul style={{ paddingLeft: "1.1rem" }}>
              <li><strong>Control a los 3 meses:</strong> Verificar tolerancia, presión de contacto y adaptación del material a la bóveda plantar.</li>
              <li><strong>Controles anuales:</strong> Evaluar el progreso clínico y si el pie ha crecido (cambio de talla y refabricación).</li>
            </ul>
          </div>
          <div className="semaforo-card rojo">
            <div className="semaforo-dot rojo-dot"></div>
            <h4>Signos de Alarma (Reconsultar)</h4>
            <ul style={{ paddingLeft: "1.1rem" }}>
              <li>Enrojecimiento, dolor o ampollas bajo el talón o las cabezas metatarsales.</li>
              <li>Dolor que no mejora luego de 2 semanas de uso gradual.</li>
              <li>Deformación visible del material de la plantilla o pérdida de su forma.</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
