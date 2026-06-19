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
    tipoPie: "plano",
    talla: "",
    edad: "",
    grado: GRADES.LEVE,
    sintomas: true,
    flexible: true,
    barraRetrocapital: false,
    testColeman: "positivo",
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
      tipoPie: form.tipoPie,
      talla,
      edad,
      grado: form.grado,
      sintomas: form.sintomas,
      flexible: form.flexible,
      barraRetrocapital: form.barraRetrocapital,
      testColeman: form.testColeman,
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
        <h1>Calculadora de Plantillas — Pie Plano y Cavo</h1>
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
              {/* ── Tipo de pie ── */}
              <fieldset style={{ marginBottom: "1rem" }}>
                <legend>Tipo de Pie *</legend>
                <div style={{ display: "flex", gap: "1rem", marginTop: "0.4rem" }}>
                  <label className="checkbox-label" style={{ fontWeight: form.tipoPie === "plano" ? "700" : "400" }}>
                    <input type="radio" name="tipoPie" value="plano" checked={form.tipoPie === "plano"} onChange={handleChange} />
                    Pie Plano (Valgus)
                  </label>
                  <label className="checkbox-label" style={{ fontWeight: form.tipoPie === "cavo" ? "700" : "400" }}>
                    <input type="radio" name="tipoPie" value="cavo" checked={form.tipoPie === "cavo"} onChange={handleChange} />
                    Pie Cavo (Varus)
                  </label>
                </div>
              </fieldset>

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
                Grado de Deformidad *
                <select name="grado" value={form.grado} onChange={handleChange}>
                  {form.tipoPie === "plano" ? (
                    <>
                      <option value={GRADES.LEVE}>Leve (I) — Huella con leve contacto medial</option>
                      <option value={GRADES.MODERADO}>Moderado (II) — Colapso del arco visible</option>
                      <option value={GRADES.SEVERO}>Severo (III) — Colapso total, talón valgo marcado</option>
                    </>
                  ) : (
                    <>
                      <option value={GRADES.LEVE}>Leve (I) — Arco elevado leve, apoyo plantar casi normal</option>
                      <option value={GRADES.MODERADO}>Moderado (II) — Arco muy elevado, callo bajo cabezas metatarsales</option>
                      <option value={GRADES.SEVERO}>Severo (III) — Garra digital, sobrecarga metatarsal severa</option>
                    </>
                  )}
                </select>
              </label>

              <fieldset>
                <legend>Características clínicas</legend>
                <label className="checkbox-label">
                  <input type="checkbox" name="sintomas" checked={form.sintomas} onChange={handleChange} />
                  Presenta síntomas (dolor, fatiga, limitación funcional)
                </label>

                {form.tipoPie === "plano" && (
                  <>
                    <label className="checkbox-label">
                      <input type="checkbox" name="flexible" checked={form.flexible} onChange={handleChange} />
                      Pie plano flexible — Test de Jack positivo (el arco aparece al ponerse en puntillas)
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" name="barraRetrocapital" checked={form.barraRetrocapital} onChange={handleChange} />
                      Incluir barra retrocapital (descarga metatarsal, solo ≥ 8 años)
                    </label>
                  </>
                )}

                {form.tipoPie === "cavo" && (
                  <label style={{ marginTop: "0.5rem", display: "block" }}>
                    Test de Coleman *
                    <select name="testColeman" value={form.testColeman} onChange={handleChange} style={{ marginTop: "0.25rem" }}>
                      <option value="positivo">Positivo — Retropié flexible (cuña externa)</option>
                      <option value="negativo">Negativo — Retropié rígido (cuña interna)</option>
                    </select>
                    <small style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Coleman +: el talón corrige al liberar el antepié; Coleman −: el talón no corrige (retropié rígido)</small>
                  </label>
                )}
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
                    <RxItem label={result.tipoPie === "cavo" ? "Soporte de Arco Lateral" : "Soporte de Arco Medial"} value={result.arcoSoporte} />
                    <RxItem label="Cuña Retropié" value={result.cunaRearfoot} />
                    {result.tipoPie !== "cavo" && <RxItem label="Cuña Antepié" value={result.cunaForefoot} />}
                    {result.tipoPie !== "cavo" && <RxItem label="Flanco Medial" value={result.flandeMedal} />}
                    <RxItem label="Barra Retrocapital" value={result.barraRetrocapitalMm > 0 ? `${result.barraRetrocapitalMm} mm` : "No"} />
                    {result.tipoPie === "cavo" && <RxItem label="Descarga 1er Radio" value={result.cutOut ? "Cut-out bajo 1er metatarsiano" : "No"} />}
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

                  <InsoleDiagram rx={result} form={form} />

                  <div className="rx-actions">
                    <button className="btn-save" onClick={handleGuardar}>
                      Guardar en Registro
                    </button>
                    <button className="btn-print" onClick={() => window.print()}>
                      🖨️ Imprimir Receta
                    </button>
                    {savedMsg && <span className="saved-msg">{savedMsg}</span>}
                  </div>

                  {/* HOJA 2: Educación para Padres */}
                  <div className="print-page-2">
                    <div className="print-header">
                      <h2>Educación para Padres — Pie Plano y Uso de Plantillas</h2>
                      <p>Paciente: <strong>{form.paciente || "Sin nombre"}</strong> · Fecha: {new Date().toLocaleDateString("es-CL")} · Próximo control: <strong>{result.fechaControl}</strong></p>
                      {form.especialista && (
                        <p style={{ marginTop: "0.25rem", fontWeight: "bold" }}>
                          {form.especialista}{form.especialidad ? ` · ${form.especialidad}` : ""}{form.especialistaRut ? ` · RUT: ${form.especialistaRut}` : ""}
                        </p>
                      )}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>

                      <div className="print-card">
                        <h3>¿Qué es el Pie Plano?</h3>
                        <svg viewBox="0 0 200 90" style={{ width:"100%", marginBottom:"0.5rem" }}>
                          {/* Pie normal */}
                          <ellipse cx="45" cy="70" rx="30" ry="12" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5"/>
                          <path d="M20 70 C22 55 30 42 38 35 C46 28 54 28 58 35 C62 42 66 55 70 70" fill="none" stroke="#3b82f6" strokeWidth="1.5"/>
                          <path d="M20 70 C22 60 35 52 45 52 C55 52 68 60 70 70" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1" opacity="0.6"/>
                          <text x="45" y="87" textAnchor="middle" fontSize="8" fill="#1d4ed8" fontWeight="bold">PIE NORMAL</text>
                          <text x="45" y="22" textAnchor="middle" fontSize="7" fill="#1e3a8a">Arco elevado</text>
                          {/* Pie plano */}
                          <ellipse cx="155" cy="70" rx="32" ry="12" fill="#fee2e2" stroke="#ef4444" strokeWidth="1.5"/>
                          <path d="M128 70 C130 60 138 50 148 44 C158 38 166 38 170 44 C174 50 178 60 180 70" fill="none" stroke="#ef4444" strokeWidth="1.5"/>
                          <path d="M128 70 C128 68 180 68 180 70" fill="#fca5a5" stroke="#ef4444" strokeWidth="1" opacity="0.6"/>
                          <text x="155" y="87" textAnchor="middle" fontSize="8" fill="#b91c1c" fontWeight="bold">PIE PLANO</text>
                          <text x="155" y="22" textAnchor="middle" fontSize="7" fill="#7f1d1d">Sin arco (colapsado)</text>
                        </svg>
                        <p>El pie plano ocurre cuando el arco longitudinal medial colapsa, permitiendo que toda la planta toque el suelo. En niños menores de 6 años es fisiológico y normal.</p>
                      </div>

                      <div className="print-card">
                        <h3>Evolución Natural del Arco</h3>
                        <svg viewBox="0 0 200 90" style={{ width:"100%", marginBottom:"0.5rem" }}>
                          <line x1="15" y1="75" x2="185" y2="75" stroke="#ccc" strokeWidth="1"/>
                          <line x1="15" y1="75" x2="15" y2="10" stroke="#ccc" strokeWidth="1"/>
                          {/* Curve: flat at birth, rising by age 6-10 */}
                          <path d="M15 72 C35 72 50 70 65 62 C80 54 95 40 115 30 C135 22 155 20 185 20"
                            fill="none" stroke="#10b981" strokeWidth="2.5"/>
                          <text x="10" y="8" fontSize="6.5" fill="#065f46">% con arco</text>
                          {/* X axis labels */}
                          <text x="15" y="83" textAnchor="middle" fontSize="6" fill="#444">0</text>
                          <text x="65" y="83" textAnchor="middle" fontSize="6" fill="#444">3</text>
                          <text x="115" y="83" textAnchor="middle" fontSize="6" fill="#444">6</text>
                          <text x="165" y="83" textAnchor="middle" fontSize="6" fill="#444">10</text>
                          <text x="100" y="92" textAnchor="middle" fontSize="7" fill="#444">Edad (años)</text>
                          {/* Annotation */}
                          <text x="140" y="17" fontSize="6.5" fill="#065f46">~80% mejoran</text>
                          <text x="140" y="25" fontSize="6.5" fill="#065f46">solos antes</text>
                          <text x="140" y="33" fontSize="6.5" fill="#065f46">de los 10 años</text>
                        </svg>
                        <p>La mayoría de los niños desarrollan el arco espontáneamente. Las plantillas <strong>apoyan este proceso</strong> sin reemplazarlo. Caminar descalzo en superficies irregulares (arena, pasto) también ayuda.</p>
                      </div>

                      <div className="print-card">
                        <h3>Plan de Adaptación a la Plantilla</h3>
                        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"0.82rem", marginTop:"0.25rem" }}>
                          <tbody>
                            {[["Día 1","1 – 2 horas"],["Día 2","2 – 3 horas"],["Día 3","4 – 5 horas"],["Día 4+","Uso completo"]].map(([d,h]) => (
                              <tr key={d} style={{ borderBottom:"1px solid #e5e7eb" }}>
                                <td style={{ padding:"0.3rem 0.5rem", fontWeight:"bold", color:"#1d4ed8" }}>{d}</td>
                                <td style={{ padding:"0.3rem 0.5rem" }}>{h}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <p style={{ marginTop:"0.5rem" }}><strong>Calzado:</strong> Contrafuerte firme, puntera ancha, plantilla extraíble.</p>
                        <p style={{ marginTop:"0.25rem" }}><strong>Higiene:</strong> Limpiar con paño húmedo. No mojar ni secar con calor.</p>
                      </div>

                      <div className="print-card">
                        <h3>Señales de Alarma — Consulte de Inmediato</h3>
                        <svg viewBox="0 0 200 70" style={{ width:"100%", marginBottom:"0.5rem" }}>
                          {/* Semáforo horizontal */}
                          {[["#22c55e","Verde","Sin dolor al usar"], ["#eab308","Amarillo","Dolor leve 1ª sem."], ["#ef4444","Rojo","Dolor persistente"]].map(([c, n, t], i) => (
                            <g key={n} transform={`translate(${i * 66 + 10}, 5)`}>
                              <circle cx="28" cy="20" r="18" fill={c} opacity="0.85"/>
                              <text x="28" y="46" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill={c}>{n}</text>
                              <text x="28" y="56" textAnchor="middle" fontSize="5.5" fill="#333">{t}</text>
                            </g>
                          ))}
                        </svg>
                        <ul style={{ paddingLeft:"1rem", margin:"0", fontSize:"0.82rem" }}>
                          <li>Enrojecimiento o ampollas en zona del arco</li>
                          <li>Dolor que no cede tras 2 semanas de uso gradual</li>
                          <li>Cambio en la forma de caminar</li>
                        </ul>
                      </div>

                    </div>

                    <div className="print-only signature-block" style={{ marginTop: "1.5rem" }}>
                      <div className="signature-line">____________________________________</div>
                      <div>{form.especialista || "[Nombre del Especialista]"}</div>
                      <div>{form.especialidad || "[Especialidad]"}</div>
                      {form.especialistaRut && <div>RUT: {form.especialistaRut}</div>}
                    </div>
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

function InsoleDiagram({ rx, form }) {
  if (!rx || !rx.indicacion) return null;

  const hasMetatarsalPad = rx.barraRetrocapitalMm > 0;
  const hasRearfootWedge = rx.cunaRearfoot && rx.cunaRearfoot !== "0°" && rx.cunaRearfoot !== "0 mm" && !rx.cunaRearfoot.includes("sin cuña") && rx.cunaRearfoot !== "0";
  const cunaRearfootText = hasRearfootWedge ? rx.cunaRearfoot : "";
  const hasForefootWedge = rx.cunaForefoot && rx.cunaForefoot !== "0°" && rx.cunaForefoot !== "0 mm" && rx.cunaForefoot !== "0";

  const archMm = parseInt(rx.arcoSoporte) || 0;
  const archText = rx.tipoPie === "cavo" ? `Arco Lat: ${rx.arcoSoporte}` : `Arco Med: ${rx.arcoSoporte}`;

  // Top view: arch zone opacity by height
  const archOpacity = archMm >= 18 ? 0.95 : archMm >= 15 ? 0.75 : archMm >= 12 ? 0.55 : 0.35;

  // Side view: 1px = 0.4mm scale; arch and wedge use same scale so 3:1 ratio is automatic
  const PX_MM = 2.5;
  const cunaMm = hasRearfootWedge ? (parseInt(rx.cunaRearfoot) || 0) : 0;
  const wedgeHpx = cunaMm * PX_MM;                  // e.g. 4mm → 10px
  const archRisePx = archMm * PX_MM;                // e.g. 12mm → 30px (3× wedge)

  // ── VISTA SUPERIOR (top-down, sin copa de talón) ──
  const renderInsoleTop = (isLeft) => {
    const side = isLeft ? "izquierdo" : "derecho";
    const isShorter = rx.alzaTalon && rx.alzaTalon.pie === side;
    return (
      <g transform={isLeft ? "translate(100,0) scale(-1,1)" : ""}>
        <rect width="100" height="220" fill="url(#gridPatternI)" opacity="0.35"/>

        {/* Contorno de la plantilla (huella 2D limpia) */}
        <path
          d="M50 210 C36 210 26 195 24 165 C22 135 28 100 24 70 C22 50 22 30 32 18 C42 6 58 6 68 18 C78 30 76 50 78 70 C80 100 78 135 76 165 C74 195 64 210 50 210 Z"
          fill="var(--bg-card)"
          stroke="var(--accent)"
          strokeWidth="2"
        />

        {/* Eje central */}
        <line x1="50" y1="12" x2="50" y2="208" stroke="var(--text-muted)" strokeWidth="0.4" strokeDasharray="4,3" opacity="0.2"/>

        {rx.tipoPie === "cavo" ? (
          <>
            {/* CAVO: arco LATERAL (lado derecho en orientación estándar) */}
            <path
              d="M74 158 C78 135 78 108 76 82 C76 70 75 60 74 50 C66 56 60 80 60 108 C60 132 64 152 74 158 Z"
              fill="rgba(99,102,241,0.5)"
              stroke="rgba(99,102,241,0.85)"
              strokeWidth="1.4"
              opacity={archOpacity}
            />
            {/* CAVO: cut-out bajo 1er radio (elipse medial antepié) */}
            {rx.cutOut && (
              <ellipse cx="33" cy="62" rx="8" ry="13"
                fill="rgba(234,179,8,0.35)" stroke="#ca8a04" strokeWidth="1.4" strokeDasharray="3,1.5"/>
            )}
            {/* CAVO: cuña externa (lateral talón) */}
            {hasRearfootWedge && cunaRearfootText.includes("Ext") && (
              <path
                d="M50 210 C62 210 74 196 76 168 C70 163 62 172 58 186 C55 196 50 210 50 210 Z"
                fill="rgba(239,68,68,0.55)"
                stroke="#dc2626"
                strokeWidth="1.5"
              />
            )}
            {/* CAVO: cuña interna (medial talón) */}
            {hasRearfootWedge && cunaRearfootText.includes("Int") && (
              <path
                d="M50 210 C38 210 26 196 24 168 C30 163 38 172 42 186 C45 196 50 210 50 210 Z"
                fill="rgba(239,68,68,0.55)"
                stroke="#dc2626"
                strokeWidth="1.5"
              />
            )}
            {/* CAVO: barra retrocapital */}
            {hasMetatarsalPad && (
              <path
                d="M27 83 C27 79 73 79 73 83 C73 87 27 87 27 83 Z"
                fill="rgba(245,158,11,0.8)"
                stroke="#d97706"
                strokeWidth="1.5"
              />
            )}
          </>
        ) : (
          <>
            {/* PLANO: arco MEDIAL (lado izquierdo en orientación estándar) */}
            <path
              d="M26 158 C22 135 22 108 24 82 C24 70 25 60 26 50 C34 56 40 80 40 108 C40 132 36 152 26 158 Z"
              fill="rgba(99,102,241,0.5)"
              stroke="rgba(99,102,241,0.85)"
              strokeWidth="1.4"
              opacity={archOpacity}
            />
            {/* PLANO: cuña retropié medial */}
            {hasRearfootWedge && (
              <path
                d="M50 210 C38 210 26 196 24 168 C30 163 38 172 42 186 C45 196 50 210 50 210 Z"
                fill="rgba(239,68,68,0.55)"
                stroke="#dc2626"
                strokeWidth="1.5"
              />
            )}
            {/* PLANO: barra retrocapital */}
            {hasMetatarsalPad && (
              <path
                d="M27 83 C27 79 73 79 73 83 C73 87 27 87 27 83 Z"
                fill="rgba(245,158,11,0.8)"
                stroke="#d97706"
                strokeWidth="1.5"
              />
            )}
            {/* PLANO: cuña antepié */}
            {hasForefootWedge && (
              <path
                d="M27 68 C24 50 24 30 32 18 C35 28 34 50 32 58 Z"
                fill="rgba(239,68,68,0.35)"
                stroke="#ef4444"
                strokeWidth="1"
              />
            )}
          </>
        )}

        {/* Alza de talón */}
        {isShorter && (
          <path
            d="M50 210 C36 210 26 192 28 170 C35 158 45 158 50 158 C55 158 65 158 72 170 C74 192 64 210 50 210 Z"
            fill="rgba(180,83,9,0.2)"
            stroke="#b45309"
            strokeWidth="1"
            strokeDasharray="3,1.5"
          />
        )}

        {/* Escala */}
        <g transform="translate(10,201)" opacity="0.45">
          <line x1="0" y1="0" x2="18" y2="0" stroke="var(--text-muted)" strokeWidth="0.75"/>
          <line x1="0" y1="-2" x2="0" y2="2" stroke="var(--text-muted)" strokeWidth="0.75"/>
          <line x1="18" y1="-2" x2="18" y2="2" stroke="var(--text-muted)" strokeWidth="0.75"/>
        </g>
      </g>
    );
  };

  // ── VISTA LATERAL MEDIAL ──
  // viewBox "0 0 270 115" — TALÓN a la derecha, PUNTA a la izquierda.
  // La plantilla tiene grosor uniforme; el arco sube desde la cara SUPERIOR
  // y la cuña es material extra triangular en la cara INFERIOR del talón.
  const renderInsoleSide = (side) => {
    const isShorter = rx.alzaTalon && rx.alzaTalon.pie === side;
    const liftVal   = isShorter ? rx.alzaTalon.valor : 0;
    const alzaH     = liftVal * PX_MM;

    // Geometría base (talón a la derecha)
    const pX    = 24;   // x punta
    const hX    = 234;  // x talón
    const wSX   = 172;  // x donde comienza la cuña (transición hacia el talón)
    const archL = 62;   // x inicio zona arco
    const archMX= 118;  // x pico del arco
    const archR = 172;  // x fin zona arco

    // y-coords: Y increases downward in SVG.
    // The insole body sits between iTopY (top flat surface) and iBotY (bottom flat surface).
    // The ARCH projects UPWARD from iTopY → archPY (lower y number = higher on screen).
    // The WEDGE also projects UPWARD from iTopY at the heel → wedgeTopY at hX.
    const iTopY    = 78;                     // y de la cara superior plana de la plantilla
    const shellH   = 9;                      // grosor del cuerpo
    const iBotY    = iTopY + shellH;         // y de la cara inferior (suelo de la plantilla)
    const archPY   = iTopY - archRisePx;     // pico del arco (hacia arriba)
    const wedgeTopY= iTopY - wedgeHpx;       // tope de la cuña en el talón (hacia arriba)
    const alzaTopY = wedgeTopY - alzaH;      // si hay alza, sube aún más

    // Cara superior: punta plana → arco bezier → plana → rampa de cuña al talón
    const topSurface = `M ${pX},${iTopY}
      L ${archL},${iTopY}
      C ${archL+22},${iTopY} ${archMX-14},${archPY} ${archMX},${archPY}
      C ${archMX+14},${archPY} ${archR-22},${iTopY} ${archR},${iTopY}
      L ${wSX},${iTopY}
      L ${hX},${wedgeTopY}`;

    // Cara inferior: plana de punta a talón
    const bodyD = `${topSurface} L ${hX},${iBotY} L ${pX},${iBotY} Z`;

    return (
      <>
        {/* Línea de suelo bajo la plantilla */}
        <line x1="8" y1={iBotY + 4} x2="258" y2={iBotY + 4}
              stroke="#ccc" strokeWidth="0.8" strokeDasharray="4,3" opacity="0.5"/>

        {/* Cuerpo de la plantilla */}
        <path d={bodyD} fill="var(--bg-card)" stroke="var(--accent)" strokeWidth="2"/>

        {/* Cuña retropié — triángulo rojo en cara SUPERIOR del talón (rampa hacia arriba) */}
        {wedgeHpx > 0 && (
          <path
            d={`M ${wSX},${iTopY} L ${hX},${iTopY} L ${hX},${wedgeTopY} Z`}
            fill="rgba(239,68,68,0.45)"
            stroke="#dc2626"
            strokeWidth="1.6"
          />
        )}

        {/* Alza de talón por dismetría (capa marrón encima de la cuña) */}
        {alzaH > 0 && (
          <path
            d={`M ${wSX},${wedgeTopY} L ${hX},${wedgeTopY} L ${hX},${alzaTopY} L ${wSX},${alzaTopY} Z`}
            fill="rgba(180,83,9,0.45)"
            stroke="#b45309"
            strokeWidth="1.2"
            strokeDasharray="4,2"
          />
        )}

        {/* Relleno arco medial */}
        <path
          d={`M ${archL+10},${iTopY} C ${archL+22},${iTopY} ${archMX-12},${archPY+1} ${archMX},${archPY+1} C ${archMX+12},${archPY+1} ${archR-22},${iTopY} ${archR-10},${iTopY} Z`}
          fill="rgba(99,102,241,0.35)"
          stroke="rgba(99,102,241,0.7)"
          strokeWidth="1.2"
        />

        {/* Cota del arco */}
        {archRisePx > 0 && (
          <>
            <line x1={archMX} y1={archPY} x2={archMX} y2={iTopY}
              stroke="rgba(99,102,241,0.9)" strokeWidth="0.8" strokeDasharray="2.5,2"/>
            <line x1={archMX-5} y1={archPY} x2={archMX+5} y2={archPY}
              stroke="rgba(99,102,241,1)" strokeWidth="1.5"/>
            <line x1={archMX-5} y1={iTopY} x2={archMX+5} y2={iTopY}
              stroke="rgba(99,102,241,1)" strokeWidth="1.5"/>
            <text x={archMX-8} y={(archPY+iTopY)/2+3} textAnchor="middle" fontSize="8"
              fill="rgba(99,102,241,1)" fontWeight="bold">{rx.arcoSoporte}</text>
          </>
        )}

        {/* Cota de la cuña — texto dentro del triángulo, cota en borde interior */}
        {wedgeHpx > 0 && (
          <>
            <line x1={hX-4} y1={wedgeTopY} x2={hX-4} y2={iTopY}
              stroke="#dc2626" strokeWidth="0.8" strokeDasharray="2,2"/>
            <line x1={hX-9} y1={wedgeTopY} x2={hX+1} y2={wedgeTopY}
              stroke="#dc2626" strokeWidth="1.5"/>
            <line x1={hX-9} y1={iTopY} x2={hX+1} y2={iTopY}
              stroke="#dc2626" strokeWidth="1.5"/>
            <text x={(wSX+hX)/2} y={(wedgeTopY+iTopY)/2+3}
              textAnchor="middle" fontSize="7" fill="#dc2626" fontWeight="bold">Cuña {cunaRearfootText}</text>
          </>
        )}

        {/* Etiqueta alza */}
        {alzaH > 0 && (
          <text x={hX} y={alzaTopY-4} textAnchor="middle" fontSize="7"
            fill="#b45309" fontWeight="bold">+{liftVal}mm alza</text>
        )}
      </>
    );
  };

  return (
    <div className="insole-diagrams">
      {/* Defs SVG globales */}
      <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
        <defs>
          <pattern id="gridPatternI" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="var(--border-color)" strokeWidth="0.4" opacity="0.35"/>
          </pattern>
        </defs>
      </svg>

      <h3>Diseño Técnico y Ajustes Mecánicos (Pies Izquierdo y Derecho)</h3>

      {/* Vista superior */}
      <div className="diagram-card" style={{ marginBottom: "1rem" }}>
        <h4>Vistas Superiores — Molde Técnico (Vista Plantar){rx.tipoPie === "cavo" ? " · Pie Cavo" : ""}</h4>
        <div className="diagrams-dual-row">
          <div className="diagram-side-box">
            <h5>Pie Izquierdo</h5>
            <svg viewBox="0 0 100 220" className="insole-svg">
              {renderInsoleTop(true)}
              <text x="50" y="218" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="var(--text-main)">TALÓN</text>
              <text x="50" y="9" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="var(--text-main)">PUNTA</text>
              <text x="50" y="117" textAnchor="middle" fontSize="5.5" fill="rgba(99,102,241,1)" fontWeight="bold">{archText}</text>
              {hasMetatarsalPad && <text x="50" y="88" fontSize="5.5" fill="#d97706" fontWeight="bold" textAnchor="middle">▬ B.R. {rx.barraRetrocapitalMm}mm</text>}
              {hasRearfootWedge && <text x="50" y="202" fontSize="5.5" fill="#dc2626" fontWeight="bold" textAnchor="middle">Cuña {cunaRearfootText}</text>}
              {rx.alzaTalon && rx.alzaTalon.pie === "izquierdo" && (
                <text x="50" y="180" textAnchor="middle" fontSize="6" fill="#b45309" fontWeight="bold">Alza +{rx.alzaTalon.valor}mm</text>
              )}
              <text x="11" y="200" fontSize="4" fill="var(--text-muted)" opacity="0.55">Scale 20mm</text>
            </svg>
          </div>
          <div className="diagram-side-box">
            <h5>Pie Derecho</h5>
            <svg viewBox="0 0 100 220" className="insole-svg">
              {renderInsoleTop(false)}
              <text x="50" y="218" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="var(--text-main)">TALÓN</text>
              <text x="50" y="9" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="var(--text-main)">PUNTA</text>
              <text x="50" y="117" textAnchor="middle" fontSize="5.5" fill="rgba(99,102,241,1)" fontWeight="bold">{archText}</text>
              {hasMetatarsalPad && <text x="50" y="88" fontSize="5.5" fill="#d97706" fontWeight="bold" textAnchor="middle">▬ B.R. {rx.barraRetrocapitalMm}mm</text>}
              {hasRearfootWedge && <text x="50" y="202" fontSize="5.5" fill="#dc2626" fontWeight="bold" textAnchor="middle">Cuña {cunaRearfootText}</text>}
              {rx.alzaTalon && rx.alzaTalon.pie === "derecho" && (
                <text x="50" y="180" textAnchor="middle" fontSize="6" fill="#b45309" fontWeight="bold">Alza +{rx.alzaTalon.valor}mm</text>
              )}
              <text x="89" y="200" textAnchor="end" fontSize="4" fill="var(--text-muted)" opacity="0.55">Scale 20mm</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Vista lateral */}
      <div className="diagram-card">
        <h4>{rx.tipoPie === "cavo" ? "Perfiles Laterales — Arco Lateral y Cuña" : "Perfiles Laterales Mediales — Cuña y Soporte de Arco"}</h4>
        <div className="diagrams-dual-row">
          <div className="diagram-side-box">
            <h5>Pie Izquierdo</h5>
            <svg viewBox="0 0 270 115" className="insole-svg-wide">
              {renderInsoleSide("izquierdo")}
              <text x="24" y="112" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="var(--text-main)">PUNTA</text>
              <text x="234" y="112" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="var(--text-main)">TALÓN</text>
            </svg>
          </div>
          <div className="diagram-side-box">
            <h5>Pie Derecho</h5>
            <svg viewBox="0 0 270 115" className="insole-svg-wide">
              {renderInsoleSide("derecho")}
              <text x="24" y="112" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="var(--text-main)">PUNTA</text>
              <text x="234" y="112" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="var(--text-main)">TALÓN</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Leyenda de colores */}
      <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap", marginTop:"0.75rem", fontSize:"0.78rem", color:"var(--text-muted)" }}>
        <span style={{ display:"flex", alignItems:"center", gap:"0.3rem" }}>
          <span style={{ display:"inline-block", width:14, height:10, background:"rgba(99,102,241,0.45)", border:"1px solid rgba(99,102,241,0.8)", borderRadius:2 }}></span>
          {rx.tipoPie === "cavo" ? "Soporte de arco lateral" : "Soporte de arco medial"} ({rx.arcoSoporte})
        </span>
        {hasRearfootWedge && (
          <span style={{ display:"flex", alignItems:"center", gap:"0.3rem" }}>
            <span style={{ display:"inline-block", width:14, height:10, background:"rgba(239,68,68,0.5)", border:"1px solid #dc2626", borderRadius:2 }}></span>
            {rx.tipoPie === "cavo" ? `Cuña retropié ${cunaRearfootText}` : `Cuña retropié varo (${cunaRearfootText})`}
          </span>
        )}
        {rx.tipoPie === "cavo" && rx.cutOut && (
          <span style={{ display:"flex", alignItems:"center", gap:"0.3rem" }}>
            <span style={{ display:"inline-block", width:14, height:10, background:"rgba(234,179,8,0.4)", border:"1px solid #ca8a04", borderRadius:2 }}></span>
            Cut-out bajo 1er radio
          </span>
        )}
        {hasMetatarsalPad && (
          <span style={{ display:"flex", alignItems:"center", gap:"0.3rem" }}>
            <span style={{ display:"inline-block", width:14, height:10, background:"rgba(245,158,11,0.75)", border:"1px solid #d97706", borderRadius:2 }}></span>
            Barra retrocapital ({rx.barraRetrocapitalMm} mm)
          </span>
        )}
        {rx.alzaTalon && (
          <span style={{ display:"flex", alignItems:"center", gap:"0.3rem" }}>
            <span style={{ display:"inline-block", width:14, height:10, background:"rgba(180,83,9,0.5)", border:"1px solid #b45309", borderRadius:2 }}></span>
            Alza de talón (+{rx.alzaTalon.valor}mm)
          </span>
        )}
      </div>

      {/* Firma hoja 2 (solo impresión) */}
      {form && (
        <div className="print-only signature-block" style={{ marginTop:"3rem" }}>
          <div className="signature-line">____________________________________</div>
          <div>{form.especialista || "[Nombre del Especialista]"}</div>
          <div>{form.especialidad || "[Especialidad]"}</div>
          {form.especialistaRut && <div>RUT: {form.especialistaRut}</div>}
          <div style={{ marginTop:"0.25rem" }}>Próximo Control Sugerido: <strong>{rx.fechaControl}</strong></div>
        </div>
      )}
    </div>
  );
}
