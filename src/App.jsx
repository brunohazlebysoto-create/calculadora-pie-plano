import { useState, useEffect } from "react";
import { generatePrescription, GRADES } from "./prescriptionEngine";
import "./App.css";

const REGISTRY_KEY = "plantillas_registry";

function loadRegistry() {
  try {
    return JSON.parse(localStorage.getItem(REGISTRY_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRegistry(entries) {
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(entries));
}

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export default function App() {
  const [tab, setTab] = useState("nueva");
  const [form, setForm] = useState({
    paciente: "",
    talla: "",
    edad: "",
    grado: GRADES.LEVE,
    sintomas: true,
    flexible: true,
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [registry, setRegistry] = useState(loadRegistry);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    saveRegistry(registry);
  }, [registry]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    setResult(null);
    setError("");
    setSavedMsg("");
  }

  function handleCalcular(e) {
    e.preventDefault();
    const talla = parseInt(form.talla);
    const edad = parseInt(form.edad);
    if (!talla || talla < 10 || talla > 52) {
      setError("Ingresa una talla válida (10-52 EU).");
      return;
    }
    if (!edad || edad < 1 || edad > 110) {
      setError("Ingresa una edad válida.");
      return;
    }
    const rx = generatePrescription({
      talla,
      edad,
      grado: form.grado,
      sintomas: form.sintomas,
      flexible: form.flexible,
    });
    setResult(rx);
    setError("");
  }

  function handleGuardar() {
    if (!result || !result.indicacion) return;
    const entry = {
      id: newId(),
      fecha: new Date().toLocaleDateString("es-CL"),
      paciente: form.paciente || "Sin nombre",
      talla: form.talla,
      edad: form.edad,
      grado: form.grado,
      sintomas: form.sintomas,
      flexible: form.flexible,
      prescripcion: result,
    };
    setRegistry((r) => [entry, ...r]);
    setSavedMsg("Guardado en el registro.");
  }

  function handleEliminar(id) {
    if (!confirm("Eliminar este registro?")) return;
    setRegistry((r) => r.filter((e) => e.id !== id));
  }

  const gradeLabel = { leve: "Leve (I)", moderado: "Moderado (II)", severo: "Severo (III)" };

  return (
    <div className="app">
      <header>
        <h1>Calculadora de Plantillas — Pie Plano</h1>
        <p className="subtitle">Prescripción basada en evidencia clínica</p>
        <nav>
          <button className={tab === "nueva" ? "active" : ""} onClick={() => setTab("nueva")}>
            Nueva Prescripción
          </button>
          <button className={tab === "registro" ? "active" : ""} onClick={() => setTab("registro")}>
            Registro ({registry.length})
          </button>
          <button className={tab === "guia" ? "active" : ""} onClick={() => setTab("guia")}>
            Guía Clínica
          </button>
        </nav>
      </header>

      {tab === "nueva" && (
        <main className="main-grid">
          <section className="form-section">
            <h2>Datos del Paciente</h2>
            <form onSubmit={handleCalcular}>
              <label>
                Paciente (opcional)
                <input
                  name="paciente"
                  value={form.paciente}
                  onChange={handleChange}
                  placeholder="Nombre o código"
                />
              </label>

              <label>
                Talla (EU) *
                <input
                  name="talla"
                  type="number"
                  value={form.talla}
                  onChange={handleChange}
                  min="10"
                  max="52"
                  placeholder="Ej: 36"
                  required
                />
              </label>

              <label>
                Edad (años) *
                <input
                  name="edad"
                  type="number"
                  value={form.edad}
                  onChange={handleChange}
                  min="1"
                  max="110"
                  placeholder="Ej: 8"
                  required
                />
              </label>

              <label>
                Grado de Pie Plano *
                <select name="grado" value={form.grado} onChange={handleChange}>
                  <option value={GRADES.LEVE}>Leve (I) — Huella con leve contacto medial</option>
                  <option value={GRADES.MODERADO}>Moderado (II) — Colapso del arco visible</option>
                  <option value={GRADES.SEVERO}>Severo (III) — Colapso total, talón valgo marcado</option>
                </select>
              </label>

              <fieldset>
                <legend>Características clínicas</legend>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="sintomas"
                    checked={form.sintomas}
                    onChange={handleChange}
                  />
                  Presenta síntomas (dolor, fatiga, limitación funcional)
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="flexible"
                    checked={form.flexible}
                    onChange={handleChange}
                  />
                  Pie plano flexible (el arco aparece al ponerse en puntillas)
                </label>
              </fieldset>

              {error && <p className="error">{error}</p>}

              <button type="submit" className="btn-primary">
                Generar Prescripción
              </button>
            </form>
          </section>

          {result && (
            <section className="result-section">
              {!result.indicacion ? (
                <div className="no-indicacion">
                  <h2>Sin indicación de plantilla</h2>
                  <p className="mensaje">{result.mensaje}</p>
                  <ul>
                    {result.recomendaciones && result.recomendaciones.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <>
                  <div className="rx-header">
                    <h2>Prescripción de Plantilla</h2>
                    <div className="rx-meta">
                      {form.paciente && <span>{form.paciente}</span>}
                      <span>Talla {form.talla} EU</span>
                      <span>{form.edad} años</span>
                      <span className={"badge badge-" + form.grado}>{gradeLabel[form.grado]}</span>
                    </div>
                  </div>

                  <div className="rx-grid">
                    <RxItem label="Tipo de Ortesis" value={result.tipo} highlight={true} />
                    <RxItem label="Soporte de Arco" value={result.arcoSoporte} />
                    <RxItem label="Copa de Talón" value={result.taconeraAltura} />
                    <RxItem label="Cuña Retropié" value={result.cunaRearfoot} />
                    <RxItem label="Cuña Antepié" value={result.cunaForefoot} />
                    <RxItem label="Flanco Medial" value={result.flandeMedal} />
                    <RxItem label="Pad Metatarsal" value={result.padMetatarsal ? "Sí — ver notas" : "No"} />
                    <RxItem label="Material" value={result.material} />
                    <RxItem label="Longitud" value={result.longitud} />
                    <RxItem label="Controles" value={result.controles} />
                  </div>

                  {result.notas && result.notas.length > 0 && (
                    <div className="notas">
                      <h3>Notas Clínicas</h3>
                      <ul>
                        {result.notas.map((n, i) => (
                          <li key={i}>{n}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.fundamentacion && result.fundamentacion.length > 0 && (
                    <details className="fundamentacion">
                      <summary>Fundamentación Bibliográfica</summary>
                      <ul>
                        {result.fundamentacion.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </details>
                  )}

                  <div className="rx-actions">
                    <button className="btn-save" onClick={handleGuardar}>
                      Guardar en Registro
                    </button>
                    {savedMsg && <span className="saved-msg">{savedMsg}</span>}
                  </div>
                </>
              )}
            </section>
          )}
        </main>
      )}

      {tab === "registro" && (
        <main className="registro-section">
          <h2>Registro de Prescripciones</h2>
          {registry.length === 0 ? (
            <p className="empty">No hay prescripciones guardadas.</p>
          ) : (
            <div className="registro-list">
              {registry.map((entry) => (
                <div key={entry.id} className="registro-card">
                  <div className="reg-header">
                    <span className="reg-paciente">{entry.paciente}</span>
                    <span className="reg-fecha">{entry.fecha}</span>
                    <span className={"badge badge-" + entry.grado}>{gradeLabel[entry.grado]}</span>
                    <button className="btn-delete" onClick={() => handleEliminar(entry.id)}>
                      ✕
                    </button>
                  </div>
                  <div className="reg-details">
                    <span>Talla {entry.talla} EU</span>
                    <span>{entry.edad} años</span>
                    <span>{entry.flexible ? "Flexible" : "Rígido"}</span>
                    <span>{entry.sintomas ? "Sintomático" : "Asintomático"}</span>
                  </div>
                  <div className="reg-tipo">{entry.prescripcion.tipo || entry.prescripcion.mensaje}</div>
                  <details className="reg-full">
                    <summary>Ver prescripción completa</summary>
                    <div className="rx-grid compact">
                      {entry.prescripcion.indicacion && (
                        <>
                          <RxItem label="Copa de Talón" value={entry.prescripcion.taconeraAltura} />
                          <RxItem label="Cuña Retropié" value={entry.prescripcion.cunaRearfoot} />
                          <RxItem label="Cuña Antepié" value={entry.prescripcion.cunaForefoot} />
                          <RxItem label="Soporte Arco" value={entry.prescripcion.arcoSoporte} />
                          <RxItem label="Material" value={entry.prescripcion.material} />
                          <RxItem label="Controles" value={entry.prescripcion.controles} />
                        </>
                      )}
                      {entry.prescripcion.notas && entry.prescripcion.notas.map((n, i) => (
                        <p key={i} className="nota-small">{n}</p>
                      ))}
                    </div>
                  </details>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {tab === "guia" && <GuiaClinica />}

      <footer>
        <p>
          Basado en: Delphi Consensus (PMC4282733) · PTTD Staging (ProLab Orthotics) · Decision Tree (PMC9566258) · Pediatric Study (PMC9561439)
          <br />
          Herramienta de apoyo clínico — no reemplaza la evaluación profesional.
        </p>
      </footer>
    </div>
  );
}

function RxItem({ label, value, highlight }) {
  return (
    <div className={"rx-item" + (highlight ? " rx-highlight" : "")}>
      <span className="rx-label">{label}</span>
      <span className="rx-value">{value}</span>
    </div>
  );
}

function GuiaClinica() {
  return (
    <main className="guia-section">
      <h2>Guía de Clasificación y Evaluación</h2>

      <details open>
        <summary>Grados de Pie Plano</summary>
        <table>
          <thead>
            <tr>
              <th>Grado</th>
              <th>Descripción clínica</th>
              <th>Índice Staheli</th>
              <th>CSI</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Leve (I)</td>
              <td>Leve contacto medial, arco visible en carga</td>
              <td>0.82 – 1.15</td>
              <td>42 – 48%</td>
            </tr>
            <tr>
              <td>Moderado (II)</td>
              <td>Colapso del arco medial visible en bipedestación</td>
              <td>1.15 – 1.40</td>
              <td>48 – 62%</td>
            </tr>
            <tr>
              <td>Severo (III)</td>
              <td>Colapso total, talón valgo marcado, abducción antepié</td>
              <td>&gt; 1.40</td>
              <td>&gt; 62%</td>
            </tr>
          </tbody>
        </table>
      </details>

      <details>
        <summary>Tests Clínicos Clave</summary>
        <div className="guia-tests">
          <div className="test-card">
            <h4>Navicular Drop Test</h4>
            <p>Medir altura del tubérculo navicular en sedestación (neutra) vs. bipedestación. Descenso ≥ 10 mm = pronación excesiva → cuña mayor.</p>
          </div>
          <div className="test-card">
            <h4>Jack's Test (puntillas)</h4>
            <p>Arco aparece en puntillas = flexible. Sin arco = rígido → plantilla acomodativa + derivación.</p>
          </div>
          <div className="test-card">
            <h4>Single-Leg Heel Rise</h4>
            <p>Menos de 5 repeticiones = debilidad del tibial posterior (sospecha PTTD) → ortesis más rígida.</p>
          </div>
          <div className="test-card">
            <h4>Talón Valgo</h4>
            <p>Más de 8° de valgo en bipedestación = indicación de cuña retropié máxima (6°).</p>
          </div>
        </div>
      </details>

      <details>
        <summary>Edad y Desarrollo del Arco</summary>
        <table>
          <thead>
            <tr><th>Edad</th><th>Estado normal</th><th>Conducta</th></tr>
          </thead>
          <tbody>
            <tr><td>Menor de 2 años</td><td>Pie plano fisiológico universal</td><td>No intervenir</td></tr>
            <tr><td>2 – 6 años</td><td>Arco en desarrollo</td><td>Solo si sintomático</td></tr>
            <tr><td>6 – 10 años</td><td>Arco madurando</td><td>Plantilla si síntomas persistentes</td></tr>
            <tr><td>Mayor de 10 años</td><td>Arco formado</td><td>Protocolo adulto</td></tr>
          </tbody>
        </table>
      </details>

      <details>
        <summary>Elementos de la Plantilla</summary>
        <table>
          <thead>
            <tr><th>Elemento</th><th>Función</th><th>Valores habituales</th></tr>
          </thead>
          <tbody>
            <tr><td>Copa de talón</td><td>Estabiliza retropié, concentra almohadilla grasa</td><td>10-35 mm profundidad</td></tr>
            <tr><td>Cuña retropié</td><td>Reduce pronación subtalar</td><td>4° estándar, máx. 6°</td></tr>
            <tr><td>Cuña antepié</td><td>Corrige varo/valgo de antepié</td><td>0-6° según medición</td></tr>
            <tr><td>Soporte arco medial</td><td>Sostiene arco longitudinal medial</td><td>Mínimo / estándar / máximo</td></tr>
            <tr><td>Flanco medial</td><td>Control total del pie en la copa</td><td>Alto en UCBL</td></tr>
            <tr><td>Pad metatarsal</td><td>Distribuye carga metatarsiana</td><td>1-2 cm proximal a cabezas MTT</td></tr>
          </tbody>
        </table>
      </details>
    </main>
  );
}
