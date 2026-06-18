import { useState, useEffect } from "react";
import { generatePrescription, GRADES } from "./prescriptionEngine";
import SeccionPadres from "./SeccionPadres";
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
  try {
    localStorage.setItem(REGISTRY_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error("Error saving registry to localStorage", e);
  }
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
    barraRetrocapital: false,
    dismetriaActiva: false,
    dismetriaPie: "izquierdo",
    dismetriaValor: "5",
    especialista: localStorage.getItem("especialista_nombre") || "Dr. Bruno Hazleby Soto",
    especialidad: localStorage.getItem("especialista_especialidad") || "Traumatología y Ortopedia Infantil",
    especialistaRut: localStorage.getItem("especialista_rut") || "17.618.006-4",
    observaciones: "",
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
    setForm((f) => {
      const updated = { ...f, [name]: type === "checkbox" ? checked : value };
      if (name === "especialista") {
        localStorage.setItem("especialista_nombre", value);
      }
      if (name === "especialidad") {
        localStorage.setItem("especialista_especialidad", value);
      }
      if (name === "especialistaRut") {
        localStorage.setItem("especialista_rut", value);
      }
      return updated;
    });
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
      barraRetrocapital: form.barraRetrocapital,
      dismetriaActiva: form.dismetriaActiva,
      dismetriaPie: form.dismetriaPie,
      dismetriaValor: parseInt(form.dismetriaValor) || 0,
    });
    if (rx.error) {
      setError(rx.error);
      setResult(null);
      return;
    }
    const hoy = new Date();
    let meses = 3;
    if (rx.controles) {
      const ctrl = rx.controles.toLowerCase();
      if (ctrl.includes("anual")) {
        meses = 12;
      } else if (ctrl.includes("6 meses")) {
        meses = 6;
      } else if (ctrl.includes("3 meses")) {
        meses = 3;
      }
    }
    const controlDate = new Date(hoy.getFullYear(), hoy.getMonth() + meses, hoy.getDate());
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    rx.fechaControl = controlDate.toLocaleDateString("es-CL", options);
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
      barraRetrocapital: form.barraRetrocapital,
      dismetriaActiva: form.dismetriaActiva,
      dismetriaPie: form.dismetriaPie,
      dismetriaValor: form.dismetriaValor,
      especialista: form.especialista,
      especialidad: form.especialidad,
      especialistaRut: form.especialistaRut,
      observaciones: form.observaciones,
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
          <button className={tab === "padres" ? "active" : ""} onClick={() => setTab("padres")}>
            Para Padres
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
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="barraRetrocapital"
                    checked={form.barraRetrocapital}
                    onChange={handleChange}
                  />
                  Incluir barra retrocapital (descarga metatarsal)
                </label>
              </fieldset>

              <fieldset>
                <legend>Dismetria (Longitud de piernas)</legend>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="dismetriaActiva"
                    checked={form.dismetriaActiva}
                    onChange={handleChange}
                  />
                  ¿Presenta discrepancia de longitud de piernas?
                </label>
                {form.dismetriaActiva && (
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                    <label style={{ flex: 1, marginBottom: 0 }}>
                      Pie más corto
                      <select name="dismetriaPie" value={form.dismetriaPie} onChange={handleChange}>
                        <option value="izquierdo">Izquierdo</option>
                        <option value="derecho">Derecho</option>
                      </select>
                    </label>
                    <label style={{ flex: 1, marginBottom: 0 }}>
                      Acortamiento (mm)
                      <input
                        name="dismetriaValor"
                        type="number"
                        min="2"
                        max="30"
                        value={form.dismetriaValor}
                        onChange={handleChange}
                        required
                      />
                    </label>
                  </div>
                )}
              </fieldset>

              <fieldset>
                <legend>Datos del Especialista</legend>
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <label style={{ flex: 2, marginBottom: 0 }}>
                    Nombre del Especialista
                    <input
                      name="especialista"
                      value={form.especialista}
                      onChange={handleChange}
                      placeholder="Ej: Dr. Juan Pérez"
                    />
                  </label>
                  <label style={{ flex: 2, marginBottom: 0 }}>
                    Especialidad
                    <input
                      name="especialidad"
                      value={form.especialidad}
                      onChange={handleChange}
                      placeholder="Ej: Ortopedia Infantil"
                    />
                  </label>
                  <label style={{ flex: 1, marginBottom: 0 }}>
                    RUT
                    <input
                      name="especialistaRut"
                      value={form.especialistaRut}
                      onChange={handleChange}
                      placeholder="Ej: 17.618.006-4"
                    />
                  </label>
                </div>
              </fieldset>

              <fieldset>
                <legend>Observaciones Clínicas</legend>
                <label style={{ marginBottom: 0 }}>
                  Indicaciones adicionales (se imprimirán en la receta)
                  <textarea
                    name="observaciones"
                    value={form.observaciones}
                    onChange={handleChange}
                    placeholder="Ej: Usar con calzado deportivo firme, realizar elongaciones diarias, etc."
                    rows="3"
                    style={{ width: "100%", marginTop: "0.25rem", fontFamily: "inherit", padding: "0.5rem", borderRadius: "4px", border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text-main)", resize: "vertical" }}
                  />
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
                    <RxItem label="Cuña Retropié" value={result.cunaRearfoot} />
                    <RxItem label="Cuña Antepié" value={result.cunaForefoot} />
                    <RxItem label="Flanco Medial" value={result.flandeMedal} />
                    <RxItem label="Barra Retrocapital" value={result.padMetatarsal ? "4 mm" : "No"} />
                    <RxItem label="Material" value={result.material} className="print-hide" />
                    <RxItem label="Longitud" value={result.longitud} className="print-hide" />
                    <RxItem label="Controles" value={result.controles} className="print-hide" />
                  </div>

                  {form.observaciones && (
                    <div className="print-observaciones" style={{ marginTop: "1rem", borderLeft: "4px solid var(--accent)", paddingLeft: "1rem" }}>
                      <strong>Indicaciones del Especialista:</strong>
                      <p style={{ whiteSpace: "pre-wrap", fontSize: "0.95rem", margin: "0.25rem 0 0 0" }}>{form.observaciones}</p>
                    </div>
                  )}

                  {result.notes && result.notes.length > 0 && (
                    <div className="notas">
                      <h3>Notas Clínicas</h3>
                      <ul>
                        {result.notes.map((n, i) => (
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

                  <InsoleDiagram rx={result} />

                  <div className="print-only signature-block">
                    <div className="signature-line">____________________________________</div>
                    <div>{form.especialista || "[Nombre del Especialista]"}</div>
                    <div>{form.especialidad || "[Especialidad]"}</div>
                    {form.especialistaRut && <div>RUT: {form.especialistaRut}</div>}
                    <div style={{ marginTop: "0.25rem" }}>Próximo Control Sugerido: <strong>{result.fechaControl}</strong></div>
                  </div>
                  <div className="rx-actions">
                    <button className="btn-save" onClick={handleGuardar}>
                      Guardar en Registro
                    </button>
                    <button className="btn-print" onClick={() => window.print()}>
                      🖨️ Imprimir Receta
                    </button>
                    {savedMsg && <span className="saved-msg">{savedMsg}</span>}
                  </div>

                  {/* PÁGINA 2 PARA IMPRESIÓN (Guía para Padres) */}
                  <div className="print-page-2">
                    <div className="print-header">
                      <h2>Guía de Uso y Seguimiento Clínico para Padres</h2>
                      <p>Paciente: {form.paciente || "Sin nombre"} · Fecha: {new Date().toLocaleDateString("es-CL")}</p>
                      {form.especialista && (
                        <p style={{ marginTop: "0.25rem", fontWeight: "bold" }}>
                          Especialista: {form.especialista} {form.especialidad ? `· ${form.especialidad}` : ""} {form.especialistaRut ? `· RUT: ${form.especialistaRut}` : ""}
                        </p>
                      )}
                    </div>

                    <div className="print-card">
                      <h3>5. Instructivo de Adaptación Gradual y Uso</h3>
                      <p>Para asegurar una adaptación adecuada y evitar molestias, siga este esquema:</p>
                      <ul style={{ paddingLeft: "1.2rem", margin: "0.5rem 0" }}>
                        <li><strong>Día 1:</strong> Usar durante 1 a 2 horas únicamente.</li>
                        <li><strong>Día 2:</strong> Usar durante 2 a 3 horas.</li>
                        <li><strong>Día 3:</strong> Usar de 4 a 5 horas.</li>
                        <li><strong>Día 4 en adelante:</strong> Uso a tiempo completo si no hay molestias.</li>
                      </ul>
                      <p style={{ marginTop: "0.5rem" }}>
                        <strong>Calzado adecuado:</strong> El zapato debe ser firme en el talón (contrafuerte estable), ancho en la parte delantera para no aprisionar los dedos, y de preferencia contar con plantilla extraíble.
                      </p>
                      <p style={{ marginTop: "0.5rem" }}>
                        <strong>Mantenimiento e higiene:</strong> Limpiar con un paño húmedo y jabón suave. No sumergir en agua ni secar al sol directo o con calor artificial (radiadores o secadores), ya que deforma los materiales ortésicos (EVA/Polipropileno).
                      </p>
                    </div>

                    <div className="print-card" style={{ marginTop: "1.5rem" }}>
                      <h3>6. Cronograma de Controles y Cuándo Reconsultar</h3>
                      <p><strong>Calendario de Revisiones:</strong></p>
                      <ul style={{ paddingLeft: "1.2rem", margin: "0.5rem 0" }}>
                        <li><strong>Control Inicial (3 Meses):</strong> Programar para la fecha estimada: <strong>{result.fechaControl}</strong>. Este control evalúa la tolerancia del niño, adaptación del material y la marcha.</li>
                        <li><strong>Controles Anuales Posteriores:</strong> Cada 1 año para evaluar crecimiento, cambio de talla y evolución clínica del arco.</li>
                      </ul>
                      <p style={{ marginTop: "0.5rem" }}>
                        <strong>Signos de alarma (Reconsulta inmediata):</strong>
                      </p>
                      <ul style={{ paddingLeft: "1.2rem", margin: "0.5rem 0" }}>
                        <li>Presencia de enrojecimiento continuo de la piel, dolor localizado persistente o ampollas en la zona del arco medial.</li>
                        <li>Dolor que no desaparece tras las primeras 2 semanas de uso gradual.</li>
                      </ul>
                    </div>
                    <div className="print-only signature-block" style={{ marginTop: "2rem" }}>
                      <div className="signature-line">____________________________________</div>
                      <div>{form.especialista || "[Nombre del Especialista]"}</div>
                      <div>{form.especialidad || "[Especialidad]"}</div>
                      {form.especialistaRut && <div>RUT: {form.especialistaRut}</div>}
                    </div>
                  </div>
                </>
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
      {tab === "padres" && <SeccionPadres />}

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

function RxItem({ label, value, highlight, className }) {
  return (
    <div className={"rx-item" + (highlight ? " rx-highlight" : "") + (className ? " " + className : "")}>
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
            <tr><td>Cuña retropié</td><td>Reduce pronación subtalar (prescrita en grados °)</td><td>4° estándar (máx. 6°). <br /><small style={{color: "var(--text-muted)", fontSize: "0.75rem"}}>*Grosor físico de taller: aprox. 1/3 de la altura del arco.*</small></td></tr>
            <tr><td>Cuña antepié</td><td>Corrige varo/valgo de antepié (prescrita en grados °)</td><td>0-6° según valoración</td></tr>
            <tr><td>Soporte arco medial</td><td>Sostiene arco longitudinal medial</td><td>Mínimo / estándar / máximo</td></tr>
            <tr><td>Flanco medial</td><td>Control total del pie en la copa</td><td>Alto en UCBL</td></tr>
            <tr><td>Barra retrocapital</td><td>Descarga metatarsal amplia</td><td>3-5 mm retrocapital</td></tr>
          </tbody>
        </table>
      </details>
    </main>
  );
}

function InsoleDiagram({ rx }) {
  if (!rx || !rx.indicacion) return null;

  const hasMetatarsalPad = !!rx.padMetatarsal;
  const hasRearfootWedge = rx.cunaRearfoot && rx.cunaRearfoot !== "0°" && rx.cunaRearfoot !== "0 mm" && !rx.cunaRearfoot.includes("sin cuña") && rx.cunaRearfoot !== "0";
  const cunaRearfootText = hasRearfootWedge ? rx.cunaRearfoot : "";
  const hasForefootWedge = rx.cunaForefoot && rx.cunaForefoot !== "0°" && rx.cunaForefoot !== "0 mm" && rx.cunaForefoot !== "0";
  const cunaForefootText = hasForefootWedge ? rx.cunaForefoot : "";

  let archPeakY = 53;
  let archText = `Arco: ${rx.arcoSoporte}`;
  const archTextLower = rx.arcoSoporte.toLowerCase();
  if (archTextLower.includes("18 mm") || archTextLower.includes("máximo")) {
    archPeakY = 25;
  } else if (archTextLower.includes("15 mm") || archTextLower.includes("medio") || archTextLower.includes("estándar")) {
    archPeakY = 38;
  } else if (archTextLower.includes("12 mm") || archTextLower.includes("8 mm") || archTextLower.includes("suave") || archTextLower.includes("mínimo")) {
    archPeakY = 46;
  }

  const renderInsoleTop = (isLeft) => {
    const side = isLeft ? "izquierdo" : "derecho";
    const isShorter = rx.alzaTalon && rx.alzaTalon.pie === side;
    return (
      <g transform={isLeft ? "translate(100, 0) scale(-1, 1)" : ""}>
        {/* Plantilla Base */}
        <path 
          d="M50 210 C36 210 26 195 24 165 C22 135 28 100 24 70 C22 50 22 30 32 18 C42 6 58 6 68 18 C78 30 76 50 78 70 C80 100 78 135 76 165 C74 195 64 210 50 210 Z" 
          fill="var(--bg-card)" 
          stroke="var(--accent)" 
          strokeWidth="2" 
        />
        
        {/* Contorno interno técnico */}
        <path 
          d="M50 202 C38 202 30 185 28 152 C24 122 31 93 29 68 C27 49 27 31 35 21 C43 11 57 11 65 21 C73 31 73 49 71 68 C69 93 76 122 72 152 C70 185 62 202 50 202 Z" 
          fill="none" 
          stroke="var(--border-color)" 
          strokeWidth="0.75" 
          opacity="0.5" 
        />

        {/* Ejes Técnicos y Líneas de Referencia */}
        <line x1="50" y1="10" x2="50" y2="210" stroke="var(--text-muted)" strokeWidth="0.5" strokeDasharray="5,2,2,2" opacity="0.3" />
        <line x1="10" y1="78" x2="90" y2="78" stroke="var(--text-muted)" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.3" />
        <line x1="10" y1="125" x2="90" y2="125" stroke="var(--text-muted)" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.3" />
        <line x1="10" y1="180" x2="90" y2="180" stroke="var(--text-muted)" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.3" />

        {/* Elevación del Arco Medial */}
        <path 
          d="M25 150 C20 120 30 90 28 65 C38 75 42 100 40 125 C38 140 32 148 25 150 Z" 
          fill="url(#archGradTop)" 
          stroke="var(--accent)" 
          strokeWidth="1" 
          opacity={archPeakY === 25 ? 0.95 : archPeakY === 38 ? 0.65 : 0.35}
        />

        {/* Cuña Retropié Varo */}
        {hasRearfootWedge && (
          <path 
            d="M50 210 C36 210 26 195 24 165 C31 160 40 175 44 190 C46 198 50 210 50 210 Z" 
            fill="rgba(239, 68, 68, 0.4)" 
            stroke="#ef4444" 
            strokeWidth="1" 
          />
        )}

        {/* Cuña Antepié Varo */}
        {hasForefootWedge && (
          <path 
            d="M28 70 C25 50 25 30 32 18 C35 28 35 48 32 58 Z" 
            fill="rgba(239, 68, 68, 0.3)" 
            stroke="#ef4444" 
            strokeWidth="1" 
          />
        )}

        {/* Barra Retrocapital */}
        {hasMetatarsalPad && (
          <path 
            d="M 28 82 C 28 78, 72 78, 72 82 C 72 85, 28 85, 28 82 Z" 
            fill="rgba(245, 158, 11, 0.75)" 
            stroke="#d97706" 
            strokeWidth="1" 
          />
        )}
        
        {/* Alza de talón (Dismetria) */}
        {isShorter && (
          <path 
            d="M50 210 C36 210 28 190 32 170 C35 155 45 155 50 155 C55 155 65 155 68 170 C72 190 64 210 50 210 Z" 
            fill="rgba(180, 83, 9, 0.15)" 
            stroke="#b45309" 
            strokeWidth="1" 
            strokeDasharray="2,1"
          />
        )}

        {/* Barra de Escala */}
        <g transform="translate(8, 202)" opacity="0.4">
          <line x1="0" y1="0" x2="20" y2="0" stroke="var(--text-secondary)" strokeWidth="0.75" />
          <line x1="0" y1="-2" x2="0" y2="2" stroke="var(--text-secondary)" strokeWidth="0.75" />
          <line x1="20" y1="-2" x2="20" y2="2" stroke="var(--text-secondary)" strokeWidth="0.75" />
        </g>
      </g>
    );
  };

  const renderInsoleSide = (isLeft) => {
    const side = isLeft ? "izquierdo" : "derecho";
    const isShorter = rx.alzaTalon && rx.alzaTalon.pie === side;
    const liftVal = isShorter ? rx.alzaTalon.valor : 0;
    const liftHeightPx = Math.min(liftVal * 0.75, 18);

    return (
      <g transform={isLeft ? "translate(200, 0) scale(-1, 1)" : ""}>
        {/* Base longitudinal de la plantilla */}
        <path 
          d="M 15 70 C 50 70 70 70 100 70 C 130 70 160 70 180 70 C 188 70 190 57 190 47 C 190 37 185 37 182 47 C 178 57 165 60 150 60 C 120 60 100 60 15 65 Z" 
          fill="var(--bg-item-rx)" 
          stroke="var(--border-color)" 
          strokeWidth="2" 
        />
        
        {/* Curvatura del Arco Medial */}
        <path 
          d={`M 60 70 C 80 ${archPeakY + 5} 110 ${archPeakY + 5} 140 70 Z`} 
          fill="url(#archGradSide)" 
          stroke="var(--accent)" 
          strokeWidth="2" 
        />

        {/* Ejes Técnicos Laterales */}
        <line x1="15" y1="70" x2="185" y2="70" stroke="var(--text-muted)" strokeWidth="0.5" strokeDasharray="4,4" opacity="0.3" />
        <line x1="100" y1="20" x2="100" y2="85" stroke="var(--text-muted)" strokeWidth="0.5" strokeDasharray="4,4" opacity="0.2" />

        {/* Alza de talón por Dismetría */}
        {isShorter && liftHeightPx > 0 && (
          <path 
            d={`M 115 70 C 135 70 160 70 180 70 C 188 70 188 ${70 + liftHeightPx} C 180 ${70 + liftHeightPx} 135 ${70 + liftHeightPx} 115 70 Z`} 
            fill="rgba(180, 83, 9, 0.85)" 
            stroke="#78350f" 
            strokeWidth="1.5" 
          />
        )}

        {/* Escala lateral */}
        <g transform="translate(165, 25)" opacity="0.4">
          <line x1="0" y1="0" x2="20" y2="0" stroke="var(--text-secondary)" strokeWidth="0.75" />
          <line x1="0" y1="-2" x2="0" y2="2" stroke="var(--text-secondary)" strokeWidth="0.75" />
          <line x1="20" y1="-2" x2="20" y2="2" stroke="var(--text-secondary)" strokeWidth="0.75" />
        </g>
      </g>
    );
  };

  return (
    <div className="insole-diagrams">
      {/* SVG oculto con las definiciones globales de degradados y patrones */}
      <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
        <defs>
          <pattern id="gridPattern" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="var(--border-color)" strokeWidth="0.5" opacity="0.3" />
          </pattern>
          <linearGradient id="archGradTop" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="archGradSide" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.05" />
          </linearGradient>
        </defs>
      </svg>

      <h3>Diseño Técnico y Ajustes Mecánicos (Pies Izquierdo y Derecho)</h3>
      
      <div className="diagram-card" style={{ marginBottom: "1rem" }}>
        <h4>Vistas Superiores (Moldes Técnicos)</h4>
        <div className="diagrams-dual-row">
          <div className="diagram-side-box">
            <h5>Pie Izquierdo</h5>
            <svg viewBox="0 0 100 220" className="insole-svg">
              <rect width="100" height="220" fill="url(#gridPattern)" />
              {renderInsoleTop(true)}
              <text x="50" y="215" textAnchor="middle" fontSize="6" fontWeight="bold">TALÓN</text>
              <text x="50" y="12" textAnchor="middle" fontSize="6" fontWeight="bold">PUNTA</text>
              <text x="73" y="110" textAnchor="middle" fontSize="5" fill="var(--accent)" transform="rotate(90, 73, 110)">{archText}</text>
              {hasMetatarsalPad && <text x="50" y="90" fontSize="5" fill="#d97706" fontWeight="bold" textAnchor="middle">Barra R.</text>}
              {hasRearfootWedge && <text x="86" y="195" fontSize="5" fill="#ef4444" fontWeight="bold" textAnchor="start">← Cuña V. ({cunaRearfootText})</text>}
              {hasForefootWedge && <text x="88" y="35" fontSize="5" fill="#ef4444" fontWeight="bold" textAnchor="start">← Cuña A. ({cunaForefootText})</text>}
              {rx.alzaTalon && rx.alzaTalon.pie === "izquierdo" && (
                <text x="50" y="180" textAnchor="middle" fontSize="6" fill="#b45309" fontWeight="bold">Alza +{rx.alzaTalon.valor} mm</text>
              )}
              <text x="10" y="197" fontSize="4" fill="var(--text-muted)" opacity="0.6">Scale 20mm</text>
            </svg>
          </div>
          <div className="diagram-side-box">
            <h5>Pie Derecho</h5>
            <svg viewBox="0 0 100 220" className="insole-svg">
              <rect width="100" height="220" fill="url(#gridPattern)" />
              {renderInsoleTop(false)}
              <text x="50" y="215" textAnchor="middle" fontSize="6" fontWeight="bold">TALÓN</text>
              <text x="50" y="12" textAnchor="middle" fontSize="6" fontWeight="bold">PUNTA</text>
              <text x="27" y="110" textAnchor="middle" fontSize="5" fill="var(--accent)" transform="rotate(-90, 27, 110)">{archText}</text>
              {hasMetatarsalPad && <text x="50" y="90" fontSize="5" fill="#d97706" fontWeight="bold" textAnchor="middle">Barra R.</text>}
              {hasRearfootWedge && <text x="14" y="195" fontSize="5" fill="#ef4444" fontWeight="bold" textAnchor="end">Cuña V. ({cunaRearfootText}) →</text>}
              {hasForefootWedge && <text x="12" y="35" fontSize="5" fill="#ef4444" fontWeight="bold" textAnchor="end">Cuña A. ({cunaForefootText}) →</text>}
              {rx.alzaTalon && rx.alzaTalon.pie === "derecho" && (
                <text x="50" y="180" textAnchor="middle" fontSize="6" fill="#b45309" fontWeight="bold">Alza +{rx.alzaTalon.valor} mm</text>
              )}
              <text x="90" y="197" textAnchor="end" fontSize="4" fill="var(--text-muted)" opacity="0.6">Scale 20mm</text>
            </svg>
          </div>
        </div>
      </div>

      <div className="diagram-card">
        <h4>Vistas Laterales (Perfiles Mediales)</h4>
        <div className="diagrams-dual-row">
          <div className="diagram-side-box">
            <h5>Pie Izquierdo</h5>
            <svg viewBox="0 0 200 100" className="insole-svg-wide">
              {renderInsoleSide(true)}
              <text x="185" y="82" fontSize="7" fontWeight="bold">PUNTA</text>
              <text x="15" y="82" textAnchor="start" fontSize="7" fontWeight="bold">TALÓN</text>
              <text x="100" y={archPeakY} textAnchor="middle" fontSize="6" fill="var(--accent)" fontWeight="bold">{archText}</text>
              {rx.alzaTalon && rx.alzaTalon.pie === "izquierdo" && (
                <text x="45" y="93" textAnchor="start" fontSize="6.5" fill="#b45309" fontWeight="bold">Alza de talón +{rx.alzaTalon.valor} mm</text>
              )}
              <text x="175" y="20" textAnchor="end" fontSize="5.5" fill="var(--text-muted)" opacity="0.6">Scale 20mm</text>
            </svg>
          </div>
          <div className="diagram-side-box">
            <h5>Pie Derecho</h5>
            <svg viewBox="0 0 200 100" className="insole-svg-wide">
              {renderInsoleSide(false)}
              <text x="15" y="82" fontSize="7" fontWeight="bold">PUNTA</text>
              <text x="185" y="82" textAnchor="end" fontSize="7" fontWeight="bold">TALÓN</text>
              <text x="100" y={archPeakY} textAnchor="middle" fontSize="6" fill="var(--accent)" fontWeight="bold">{archText}</text>
              {rx.alzaTalon && rx.alzaTalon.pie === "derecho" && (
                <text x="155" y="93" textAnchor="end" fontSize="6.5" fill="#b45309" fontWeight="bold">Alza de talón +{rx.alzaTalon.valor} mm</text>
              )}
              <text x="25" y="20" textAnchor="start" fontSize="5.5" fill="var(--text-muted)" opacity="0.6">Scale 20mm</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
