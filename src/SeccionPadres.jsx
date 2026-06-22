import { useState } from "react";
import SeccionPadresCavo from "./SeccionPadresCavo";
import SeccionPadresEquino from "./SeccionPadresEquino";

export default function SeccionPadres({ printMode = false }) {
  const [tipo, setTipo] = useState("plano");

  const BotonesSelector = () => (
    <div style={{ display:"flex", gap:"0.75rem", padding:"1rem 1.5rem 0", flexWrap:"wrap" }}>
      <button
        onClick={() => setTipo("plano")}
        style={{ padding:"0.45rem 1.2rem", borderRadius:"999px", border:"2px solid #3b82f6", background: tipo==="plano" ? "#3b82f6" : "transparent", color: tipo==="plano" ? "#fff" : "#3b82f6", fontWeight:600, cursor:"pointer" }}
      >Pie Plano</button>
      <button
        onClick={() => setTipo("cavo")}
        style={{ padding:"0.45rem 1.2rem", borderRadius:"999px", border:"2px solid #7c3aed", background: tipo==="cavo" ? "#7c3aed" : "transparent", color: tipo==="cavo" ? "#fff" : "#7c3aed", fontWeight:600, cursor:"pointer" }}
      >Pie Cavo</button>
      <button
        onClick={() => setTipo("equino")}
        style={{ padding:"0.45rem 1.2rem", borderRadius:"999px", border:"2px solid #d97706", background: tipo==="equino" ? "#d97706" : "transparent", color: tipo==="equino" ? "#fff" : "#d97706", fontWeight:600, cursor:"pointer" }}
      >Pie Equino</button>
      <button
        onClick={() => window.print()}
        style={{ padding:"0.45rem 1.2rem", borderRadius:"999px", border:"2px solid #059669", background:"#059669", color:"#fff", fontWeight:600, cursor:"pointer", marginLeft:"auto" }}
      >🖨 Imprimir guía {tipo === "cavo" ? "Pie Cavo" : tipo === "equino" ? "Pie Equino" : "Pie Plano"}</button>
    </div>
  );

  if (tipo === "cavo") {
    return (
      <>
        {!printMode && <BotonesSelector />}
        <SeccionPadresCavo />
      </>
    );
  }

  if (tipo === "equino") {
    return (
      <>
        {!printMode && <BotonesSelector />}
        <SeccionPadresEquino />
      </>
    );
  }

  return (
    <>
      {!printMode && <BotonesSelector />}
    <main className="padres-section">
      <h2>Para Padres: ¿Qué es el Pie Plano?</h2>
      <p className="padres-intro">
        Esta sección explica de forma visual qué ocurre en el pie plano, por qué en la mayoría de los niños
        mejora solo y cuándo sí es necesario actuar.
      </p>

      {/* DIAGRAMA 1: Arco normal vs pie plano */}
      <div className="padres-card">
        <h3>1. ¿Qué es el arco del pie y qué pasa cuando falta?</h3>
        <div className="diagrams-row">
          <div className="diagram-box">
            <svg viewBox="0 0 200 120" className="foot-svg">
              {/* NORMAL FOOT */}
              <text x="100" y="14" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#2b6cb0">Pie normal</text>
              {/* Planta del pie */}
              <path d="M30 100 Q40 50 70 40 Q100 32 140 40 Q165 48 170 100 Z" fill="#fde8d0" stroke="#c07040" strokeWidth="1.5"/>
              {/* Arco medial visible */}
              <path d="M50 100 Q80 60 130 100" fill="none" stroke="#2b6cb0" strokeWidth="2.5" strokeDasharray="4,2"/>
              {/* Huella */}
              <rect x="25" y="100" width="155" height="3" rx="1" fill="#c07040" opacity="0.3"/>
              <path d="M30 103 Q60 103 75 103 L75 103 Q95 103 95 103 L140 103 Q155 103 168 103" fill="none" stroke="#c07040" strokeWidth="2"/>
              {/* Espacio del arco en huella */}
              <path d="M75 103 Q100 96 125 103" fill="#f0f4f8" stroke="none"/>
              <text x="100" y="116" textAnchor="middle" fontSize="9" fill="#4a5568">Espacio libre bajo el arco</text>
              <text x="100" y="76" textAnchor="middle" fontSize="9" fill="#2b6cb0">Arco medial</text>
            </svg>
          </div>

          <div className="diagram-box">
            <svg viewBox="0 0 200 120" className="foot-svg">
              {/* FLAT FOOT */}
              <text x="100" y="14" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#c05621">Pie plano</text>
              <path d="M30 100 Q38 70 68 60 Q100 55 140 60 Q165 68 170 100 Z" fill="#fde8d0" stroke="#c07040" strokeWidth="1.5"/>
              {/* Arco colapsado */}
              <path d="M50 100 Q85 95 130 100" fill="none" stroke="#c05621" strokeWidth="2.5"/>
              <rect x="25" y="100" width="155" height="3" rx="1" fill="#c07040" opacity="0.3"/>
              {/* Huella completa */}
              <path d="M30 103 L168 103" fill="none" stroke="#c07040" strokeWidth="2"/>
              <text x="100" y="116" textAnchor="middle" fontSize="9" fill="#c05621">Toda la planta toca el suelo</text>
              <text x="100" y="86" textAnchor="middle" fontSize="9" fill="#c05621">Arco colapsado</text>
              {/* Arrow showing collapse */}
              <line x1="95" y1="68" x2="95" y2="95" stroke="#e53e3e" strokeWidth="1.5" markerEnd="url(#arr)"/>
              <defs>
                <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill="#e53e3e"/>
                </marker>
              </defs>
            </svg>
          </div>

          <div className="diagram-box">
            <svg viewBox="0 0 200 120" className="foot-svg">
              {/* REAR VIEW */}
              <text x="100" y="14" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#2d3748">Vista posterior</text>
              {/* Normal heel */}
              <g transform="translate(40, 20)">
                <text x="20" y="10" textAnchor="middle" fontSize="9" fill="#276749">Normal</text>
                <rect x="5" y="15" width="30" height="40" rx="15" fill="#fde8d0" stroke="#c07040" strokeWidth="1.5"/>
                <line x1="20" y1="55" x2="20" y2="70" stroke="#718096" strokeWidth="1.5" strokeDasharray="3,2"/>
                <line x1="20" y1="55" x2="20" y2="70" stroke="#276749" strokeWidth="1.5"/>
                <text x="20" y="80" textAnchor="middle" fontSize="8" fill="#276749">0-4° valgo</text>
              </g>
              {/* Valgus heel */}
              <g transform="translate(115, 20)">
                <text x="25" y="10" textAnchor="middle" fontSize="9" fill="#c05621">Pie plano</text>
                <rect x="5" y="15" width="30" height="40" rx="15" fill="#fde8d0" stroke="#c07040" strokeWidth="1.5" transform="rotate(12, 20, 35)"/>
                <line x1="20" y1="55" x2="20" y2="70" stroke="#718096" strokeWidth="1.5" strokeDasharray="3,2"/>
                <line x1="20" y1="55" x2="30" y2="70" stroke="#c05621" strokeWidth="2"/>
                <text x="25" y="80" textAnchor="middle" fontSize="8" fill="#c05621">Talón valgo</text>
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* DIAGRAMA 2: Fisiopatología */}
      <div className="padres-card">
        <h3>2. ¿Por qué ocurre? La cadena de movimiento</h3>
        <svg viewBox="0 0 640 140" className="chain-svg">
          {/* Boxes */}
          {[
            { x: 10, label: "Ligamentos\nlaxos", color: "#ebf8ff", border: "#4299e1" },
            { x: 145, label: "Tobillo cae\nhacia adentro", color: "#fff5f5", border: "#fc8181" },
            { x: 280, label: "Arco medial\nse aplana", color: "#fffaf0", border: "#f6ad55" },
            { x: 415, label: "Huella\ncompleta", color: "#fef3c7", border: "#f59e0b" },
            { x: 550, label: "Talón en\nvalgo", color: "#fff5f5", border: "#fc8181" },
          ].map((item, i) => (
            <g key={i}>
              <rect x={item.x} y="30" width="120" height="55" rx="8"
                fill={item.color} stroke={item.border} strokeWidth="1.5"/>
              {item.label.split("\n").map((line, li) => (
                <text key={li} x={item.x + 60} y={52 + li * 16}
                  textAnchor="middle" fontSize="11" fill="#2d3748">{line}</text>
              ))}
              {i < 4 && (
                <path d={`M${item.x + 122} 57 L${item.x + 142} 57`}
                  stroke="#718096" strokeWidth="2" markerEnd="url(#arr2)"/>
              )}
            </g>
          ))}
          <defs>
            <marker id="arr2" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 Z" fill="#718096"/>
            </marker>
          </defs>
          <text x="320" y="115" textAnchor="middle" fontSize="10" fill="#718096">
            En niños pequeños esto es NORMAL — los ligamentos se tensan solos con el crecimiento
          </text>
        </svg>
      </div>

      {/* DIAGRAMA 3: Curva de mejora */}
      <div className="padres-card">
        <h3>3. La tendencia natural: el arco aparece solo</h3>
        <div className="mejoria-wrap">
          <svg viewBox="0 0 480 200" className="chart-svg">
            {/* Grid */}
            {[0,1,2,3,4].map(i => (
              <line key={i} x1="60" y1={40 + i*30} x2="440" y2={40 + i*30}
                stroke="#e2e8f0" strokeWidth="1"/>
            ))}
            {/* Axes */}
            <line x1="60" y1="160" x2="440" y2="160" stroke="#4a5568" strokeWidth="2"/>
            <line x1="60" y1="40" x2="60" y2="160" stroke="#4a5568" strokeWidth="2"/>

            {/* Y labels */}
            <text x="55" y="44" textAnchor="end" fontSize="9" fill="#718096">100%</text>
            <text x="55" y="74" textAnchor="end" fontSize="9" fill="#718096">75%</text>
            <text x="55" y="104" textAnchor="end" fontSize="9" fill="#718096">50%</text>
            <text x="55" y="134" textAnchor="end" fontSize="9" fill="#718096">25%</text>
            <text x="55" y="164" textAnchor="end" fontSize="9" fill="#718096">0%</text>
            <text x="20" y="100" textAnchor="middle" fontSize="10" fill="#4a5568"
              transform="rotate(-90, 20, 100)">Niños con pie plano</text>

            {/* X ages */}
            {[2,3,4,5,6,7,8,10].map((age, i) => {
              const x = 60 + i * 54;
              return (
                <text key={age} x={x} y="175" textAnchor="middle" fontSize="9" fill="#4a5568">
                  {age}a
                </text>
              );
            })}
            <text x="250" y="193" textAnchor="middle" fontSize="10" fill="#4a5568">Edad</text>

            {/* Prevalence curve — data from Staheli & Pfeiffer studies */}
            <polyline
              points="60,44 114,50 168,65 222,90 276,110 330,128 384,140 438,148"
              fill="none" stroke="#e53e3e" strokeWidth="2.5" strokeDasharray="5,3"/>
            {/* Normal arch curve */}
            <polyline
              points="60,148 114,140 168,128 222,110 276,90 330,68 384,52 438,44"
              fill="none" stroke="#38a169" strokeWidth="2.5"/>

            {/* Area under improvement */}
            <path d="M60,148 L114,140 L168,128 L222,110 L276,90 L330,68 L384,52 L438,44 L438,160 L60,160 Z"
              fill="#c6f6d5" opacity="0.3"/>

            {/* Legend */}
            <line x1="70" y1="20" x2="100" y2="20" stroke="#e53e3e" strokeWidth="2" strokeDasharray="4,2"/>
            <text x="105" y="24" fontSize="9" fill="#4a5568">% con pie plano</text>
            <line x1="220" y1="20" x2="250" y2="20" stroke="#38a169" strokeWidth="2"/>
            <text x="255" y="24" fontSize="9" fill="#4a5568">% con arco normal</text>

            {/* Annotation */}
            <rect x="310" y="95" width="125" height="32" rx="5" fill="#fffbeb" stroke="#f6ad55" strokeWidth="1"/>
            <text x="372" y="109" textAnchor="middle" fontSize="9" fill="#744210">A los 10 años:</text>
            <text x="372" y="122" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#276749">~80% recupera arco</text>
          </svg>

          <div className="mejoria-lista">
            <div className="mejoria-item green">
              <span className="mi-icon">✓</span>
              <div>
                <strong>2 años:</strong> casi todos los niños tienen pie plano — es normal
              </div>
            </div>
            <div className="mejoria-item green">
              <span className="mi-icon">✓</span>
              <div>
                <strong>6 años:</strong> el 50% ya tiene arco formado
              </div>
            </div>
            <div className="mejoria-item green">
              <span className="mi-icon">✓</span>
              <div>
                <strong>10 años:</strong> ~80% de los niños tiene arco normal espontáneamente
              </div>
            </div>
            <div className="mejoria-item orange">
              <span className="mi-icon">!</span>
              <div>
                <strong>Solo el 20%</strong> persiste con pie plano estructural en la adultez
              </div>
            </div>
            <div className="mejoria-item blue">
              <span className="mi-icon">i</span>
              <div>
                Las plantillas <strong>no aceleran</strong> este proceso — alivian síntomas mientras el cuerpo madura
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DIAGRAMA 4: Cuándo preocuparse */}
      <div className="padres-card">
        <h3>4. ¿Cuándo sí debo preocuparme?</h3>
        <div className="semaforo-grid">
          <div className="semaforo-card verde">
            <div className="semaforo-dot verde-dot"></div>
            <h4>Sin urgencia</h4>
            <ul>
              <li>Pie plano en niños menores de 6 años</li>
              <li>Sin dolor al caminar o correr</li>
              <li>El niño juega normalmente</li>
              <li>El arco aparece al ponerse de puntillas</li>
            </ul>
          </div>
          <div className="semaforo-card amarillo">
            <div className="semaforo-dot amarillo-dot"></div>
            <h4>Consultar</h4>
            <ul>
              <li>Dolor en el talón o la planta del pie</li>
              <li>Cansancio excesivo al caminar</li>
              <li>Mayor de 6 años sin mejora visible</li>
              <li>Evita actividades físicas por molestia</li>
            </ul>
          </div>
          <div className="semaforo-card rojo">
            <div className="semaforo-dot rojo-dot"></div>
            <h4>Derivar pronto</h4>
            <ul>
              <li>Pie plano rígido (arco no aparece en puntillas)</li>
              <li>Dolor intenso o deformidad progresiva</li>
              <li>Un pie plano y el otro no</li>
              <li>Mayor de 10 años con pie plano severo</li>
            </ul>
          </div>
        </div>
      </div>

      {/* DIAGRAMA 5: Qué hace la plantilla */}
      <div className="padres-card">
        <h3>5. ¿Qué hace la plantilla exactamente?</h3>
        <svg viewBox="0 0 500 130" className="plantilla-svg">
          {/* Without insole */}
          <text x="110" y="15" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#c05621">Sin plantilla</text>
          <path d="M20 100 Q30 65 55 55 Q85 48 120 55 Q145 62 150 100 Z" fill="#fde8d0" stroke="#c07040" strokeWidth="1.5"/>
          <line x1="20" y1="100" x2="150" y2="100" stroke="#4a5568" strokeWidth="2"/>
          <path d="M40 100 Q80 96 130 100" fill="none" stroke="#c05621" strokeWidth="2"/>
          {/* Force arrow */}
          <line x1="85" y1="55" x2="85" y2="95" stroke="#e53e3e" strokeWidth="2" markerEnd="url(#farr)"/>
          <text x="85" y="45" textAnchor="middle" fontSize="9" fill="#c53030">Fuerza</text>
          <text x="85" y="38" textAnchor="middle" fontSize="9" fill="#c53030">concentrada</text>

          {/* Divider */}
          <line x1="180" y1="10" x2="180" y2="120" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="4,3"/>

          {/* With insole */}
          <text x="370" y="15" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#276749">Con plantilla</text>
          <path d="M200 100 Q210 65 235 55 Q265 48 300 55 Q325 62 330 100 Z" fill="#fde8d0" stroke="#c07040" strokeWidth="1.5"/>
          {/* Insole shape */}
          <path d="M200 100 Q215 85 265 80 Q295 80 330 100 Z" fill="#bee3f8" stroke="#2b6cb0" strokeWidth="1.5" opacity="0.85"/>
          <line x1="200" y1="100" x2="330" y2="100" stroke="#4a5568" strokeWidth="2"/>
          <path d="M220 100 Q265 87 310 100" fill="none" stroke="#276749" strokeWidth="2"/>
          {/* Distributed force arrows */}
          {[230, 255, 280, 305].map((x, i) => (
            <line key={i} x1={x} y1="62" x2={x} y2="78" stroke="#38a169" strokeWidth="1.5" markerEnd="url(#garr)"/>
          ))}
          <text x="265" y="52" textAnchor="middle" fontSize="9" fill="#276749">Fuerza distribuida</text>
          <text x="265" y="108" textAnchor="middle" fontSize="8" fill="#2b6cb0">Plantilla (EVA/polipropileno)</text>

          {/* Legend labels */}
          <rect x="350" y="65" width="10" height="10" fill="#bee3f8" stroke="#2b6cb0" strokeWidth="1"/>
          <text x="365" y="74" fontSize="9" fill="#2b6cb0">Plantilla</text>
          <rect x="350" y="82" width="10" height="10" fill="#fde8d0" stroke="#c07040" strokeWidth="1"/>
          <text x="365" y="91" fontSize="9" fill="#4a5568">Pie</text>

          <defs>
            <marker id="farr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#e53e3e"/>
            </marker>
            <marker id="garr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#38a169"/>
            </marker>
          </defs>
        </svg>
        <p className="plantilla-note">
          La plantilla no "crea" el arco — lo acompaña y distribuye la carga mientras los ligamentos maduran.
          En niños pequeños actúa principalmente como apoyo de comodidad.
        </p>
      </div>

      {/* INSTRUCTIVO DE USO, RECONSULTA Y CONTROLES */}
      <div className="padres-card">
        <h3>6. Instructivo de Adaptación Gradual y Uso</h3>
        <div className="mejoria-lista">
          <div className="mejoria-item blue">
            <span className="mi-icon">⏱️</span>
            <div>
              <strong>Período de adaptación gradual:</strong>
              <ul style={{ paddingLeft: "1.2rem", marginTop: "0.25rem" }}>
                <li><strong>Día 1:</strong> Usar durante 1 a 2 horas únicamente.</li>
                <li><strong>Día 2:</strong> Usar durante 2 a 3 horas.</li>
                <li><strong>Día 3:</strong> Usar de 4 a 5 horas.</li>
                <li><strong>Día 4 en adelante:</strong> Uso a tiempo completo si no hay molestias.</li>
              </ul>
            </div>
          </div>
          <div className="mejoria-item green">
            <span className="mi-icon">✓</span>
            <div>
              <strong>Calzado adecuado:</strong> El calzado debe ser firme en el talón (contrafuerte estable), ancho en la parte delantera para no aprisionar los dedos, y preferiblemente contar con plantilla extraíble para reemplazarla por la ortesis.
            </div>
          </div>
          <div className="mejoria-item orange">
            <span className="mi-icon">!</span>
            <div>
              <strong>Mantenimiento e higiene:</strong> Limpiar con un paño húmedo y jabón suave. No sumergir en agua ni secar al sol directo o con secadores, ya que las temperaturas altas deforman materiales termosensibles como la EVA o el Polipropileno.
            </div>
          </div>
        </div>
      </div>

      <div className="padres-card">
        <h3>7. Cronograma de Controles y Cuándo Reconsultar</h3>
        <div className="semaforo-grid">
          <div className="semaforo-card verde">
            <div className="semaforo-dot verde-dot"></div>
            <h4>Cronograma de Seguimiento</h4>
            <ul style={{ paddingLeft: "1.1rem" }}>
              <li><strong>Control Inicial (3 Meses):</strong> Evaluación obligatoria a los 3 meses del uso inicial para verificar la tolerancia, adaptación de los materiales a la pisada y evolución de la marcha.</li>
              <li><strong>Controles Anuales:</strong> Posteriormente, control cada 1 año para evaluar si el pie ha crecido (cambio de talla) y el progreso clínico del arco plantar.</li>
            </ul>
          </div>
          <div className="semaforo-card rojo">
            <div className="semaforo-dot rojo-dot"></div>
            <h4>Signos de Alarma (Reconsultar)</h4>
            <ul style={{ paddingLeft: "1.1rem" }}>
              <li>Enrojecimiento continuo de la piel, dolor localizado persistente o ampollas en la zona del arco medial o talón.</li>
              <li>Dolor que empeora o que no desaparece tras las primeras 2 semanas de uso gradual.</li>
              <li>Pérdida evidente de la altura o forma del arco de la plantilla (deformación del material).</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}
