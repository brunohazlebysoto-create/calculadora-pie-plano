import { useState, useEffect } from "react";
import { generatePrescription, GRADES } from "./prescriptionEngine";
import SeccionPadres from "./SeccionPadres";
import SeccionPadresCavo from "./SeccionPadresCavo";
import SeccionPadresEquino from "./SeccionPadresEquino";
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
    tipoPie: "plano",
    paciente: "",
    talla: "",
    edad: "",
    grado: GRADES.LEVE,
    peso: "normal",
    sintomas: true,
    flexible: true,
    dolorMetatarsal: false,
    testColeman: "positivo",
    dismetriaActiva: false,
    dismetriaPie: "izquierdo",
    dismetriaValor: "5",
    especialista: localStorage.getItem("especialista_nombre") || "Dr. Bruno Hazleby Soto",
    especialidad: localStorage.getItem("especialista_especialidad") || "Traumatología y Ortopedia Infantil",
    especialistaRut: localStorage.getItem("especialista_rut") || "17.618.006-4",
    observaciones: "",
    testSilfverskiold: "gastrocnemio",
    rangoDorsiflexion: 5,
    dolorRetrocalcaneoSever: false,
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
      if (name === "especialista") localStorage.setItem("especialista_nombre", value);
      if (name === "especialidad") localStorage.setItem("especialista_especialidad", value);
      if (name === "especialistaRut") localStorage.setItem("especialista_rut", value);
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
    if (!talla || talla < 10 || talla > 52) { setError("Ingresa una talla válida (10-52 EU)."); return; }
    if (!edad || edad < 1 || edad > 110) { setError("Ingresa una edad válida."); return; }
    const rx = generatePrescription({
      tipoPie: form.tipoPie,
      talla, edad,
      grado: form.grado,
      peso: form.peso,
      sintomas: form.sintomas,
      flexible: form.flexible,
      dolorMetatarsal: form.dolorMetatarsal,
      testColeman: form.testColeman,
      dismetriaActiva: form.dismetriaActiva,
      dismetriaPie: form.dismetriaPie,
      dismetriaValor: parseInt(form.dismetriaValor) || 0,
      testSilfverskiold: form.testSilfverskiold,
      rangoDorsiflexion: parseInt(form.rangoDorsiflexion) || 5,
      dolorRetrocalcaneoSever: form.dolorRetrocalcaneoSever,
    });
    if (rx.error) { setError(rx.error); setResult(null); return; }
    if (rx.tipoPie === "cavo" && !rx.indicacion && rx.alerta) { setResult(rx); setError(""); return; }
    const hoy = new Date();
    let meses = 3;
    if (rx.controles) {
      const ctrl = rx.controles.toLowerCase();
      if (ctrl.includes("anual")) meses = 12;
      else if (ctrl.includes("6 meses")) meses = 6;
    }
    const controlDate = new Date(hoy.getFullYear(), hoy.getMonth() + meses, hoy.getDate());
    rx.fechaControl = controlDate.toLocaleDateString("es-CL", { year: "numeric", month: "long", day: "numeric" });
    setResult(rx);
    setError("");
  }

  function handleGuardar() {
    if (!result || !result.indicacion) return;
    const entry = {
      id: newId(),
      fecha: new Date().toLocaleDateString("es-CL"),
      paciente: form.paciente || "Sin nombre",
      tipoPie: form.tipoPie,
      talla: form.talla, edad: form.edad, grado: form.grado,
      sintomas: form.sintomas, flexible: form.flexible,
      testColeman: form.testColeman,
      barraRetrocapital: form.barraRetrocapital,
      dismetriaActiva: form.dismetriaActiva,
      dismetriaPie: form.dismetriaPie, dismetriaValor: form.dismetriaValor,
      especialista: form.especialista, especialidad: form.especialidad,
      especialistaRut: form.especialistaRut, observaciones: form.observaciones,
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
  const isCavo = form.tipoPie === "cavo";
  const isEquino = form.tipoPie === "equino";

  return (
    <div className="app">
      <header>
        <h1>Calculadora de Plantillas — Pie Plano y Pie Cavo</h1>
        <p className="subtitle">Prescripción basada en evidencia clínica</p>
        <nav>
          <button className={tab === "nueva" ? "active" : ""} onClick={() => setTab("nueva")}>Nueva Prescripción</button>
          <button className={tab === "registro" ? "active" : ""} onClick={() => setTab("registro")}>Registro ({registry.length})</button>
          <button className={tab === "guia" ? "active" : ""} onClick={() => setTab("guia")}>Guía Clínica</button>
          <button className={tab === "padres" ? "active" : ""} onClick={() => setTab("padres")}>Para Padres</button>
        </nav>
      </header>

      {tab === "nueva" && (
        <main className="main-grid">
          <section className="form-section">
            <h2>Datos del Paciente</h2>
            <form onSubmit={handleCalcular}>

              <fieldset style={{ marginBottom: "1rem" }}>
                <legend style={{ fontWeight: "bold" }}>Tipo de Pie *</legend>
                <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.5rem" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer", fontWeight: form.tipoPie === "plano" ? "bold" : "normal" }}>
                    <input type="radio" name="tipoPie" value="plano" checked={form.tipoPie === "plano"} onChange={handleChange} />
                    Pie Plano
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer", fontWeight: form.tipoPie === "cavo" ? "bold" : "normal" }}>
                    <input type="radio" name="tipoPie" value="cavo" checked={form.tipoPie === "cavo"} onChange={handleChange} />
                    Pie Cavo
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer", fontWeight: form.tipoPie === "equino" ? "bold" : "normal" }}>
                    <input type="radio" name="tipoPie" value="equino" checked={form.tipoPie === "equino"} onChange={handleChange} />
                    Pie Equino No Neurológico
                  </label>
                </div>
              </fieldset>

              <label>
                Paciente (opcional)
                <input name="paciente" value={form.paciente} onChange={handleChange} placeholder="Nombre o código" />
              </label>

              <label>
                Talla (EU) *
                <input name="talla" type="number" value={form.talla} onChange={handleChange} min="10" max="52" placeholder="Ej: 36" required />
              </label>

              <label>
                Edad (años) *
                <input name="edad" type="number" value={form.edad} onChange={handleChange} min="1" max="110" placeholder="Ej: 8" required />
              </label>

              {!isEquino && <label>
                {isCavo ? "Grado de Pie Cavo *" : "Grado de Pie Plano *"}
                <select name="grado" value={form.grado} onChange={handleChange}>
                  {isCavo ? (
                    <>
                      <option value={GRADES.LEVE}>Leve — Aumento leve del arco longitudinal</option>
                      <option value={GRADES.MODERADO}>Moderado — Arco elevado con signos clínicos</option>
                      <option value={GRADES.SEVERO}>Severo — Garra de dedos, callosidades, dolor</option>
                    </>
                  ) : (
                    <>
                      <option value={GRADES.LEVE}>Leve (I) — Huella con leve contacto medial</option>
                      <option value={GRADES.MODERADO}>Moderado (II) — Colapso del arco visible</option>
                      <option value={GRADES.SEVERO}>Severo (III) — Colapso total, talón valgo marcado</option>
                    </>
                  )}
                </select>
              </label>}

              <label>
                Peso del Paciente
                <select name="peso" value={form.peso} onChange={handleChange}>
                  <option value="normal">Normal / Sobrepeso leve</option>
                  <option value="obesidad">Obesidad (IMC ≥30)</option>
                </select>
              </label>

              <fieldset>
                <legend>Características clínicas</legend>
                <label className="checkbox-label">
                  <input type="checkbox" name="sintomas" checked={form.sintomas} onChange={handleChange} />
                  Presenta síntomas (dolor, fatiga, limitación funcional)
                </label>

                {!isCavo && !isEquino && (
                  <>
                    <label className="checkbox-label">
                      <input type="checkbox" name="flexible" checked={form.flexible} onChange={handleChange} />
                      Test de Jack positivo — Pie flexible (el arco aparece al ponerse en puntillas)
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" name="dolorMetatarsal" checked={form.dolorMetatarsal} onChange={handleChange} />
                      Dolor metatarsal / metatarsalgia central o queratosis plantar anterior
                    </label>
                  </>
                )}

                {isCavo && (
                  <label style={{ marginTop: "0.5rem" }}>
                    Test de Coleman (Bloque) *
                    <select name="testColeman" value={form.testColeman} onChange={handleChange} style={{ marginTop: "0.25rem" }}>
                      <option value="positivo">Positivo — Retropié flexible: el talón corrige al liberar el antepié → Cuña Externa + Cut-out</option>
                      <option value="negativo">Negativo — Retropié rígido estructurado: el talón no corrige → Cuña Interna acomodativa</option>
                    </select>
                  </label>
                )}

                {isEquino && (
                  <>
                    <label style={{ marginTop: "0.5rem" }}>
                      Test de Silfverskiold *
                      <select name="testSilfverskiold" value={form.testSilfverskiold} onChange={handleChange} style={{ marginTop: "0.25rem" }}>
                        <option value="gastrocnemio">Gastrocnemio aislado (mejora al flexionar rodilla)</option>
                        <option value="gastro_soleo">Gastro-sóleo complejo (persiste con rodilla flexionada)</option>
                        <option value="negativo">Negativo / Normal</option>
                      </select>
                    </label>
                    <label style={{ marginTop: "0.5rem" }}>
                      Rango de Dorsiflexión (grados) *
                      <input type="number" name="rangoDorsiflexion" value={form.rangoDorsiflexion} onChange={handleChange} min="-20" max="30" style={{ marginTop: "0.25rem" }}/>
                      <small style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{"<0° Severo · 0-4° Moderado · 5-9° Leve · ≥10° Normal"}</small>
                    </label>
                    <label className="checkbox-label" style={{ marginTop: "0.5rem" }}>
                      <input type="checkbox" name="dolorRetrocalcaneoSever" checked={form.dolorRetrocalcaneoSever} onChange={e => setForm(f => ({...f, dolorRetrocalcaneoSever: e.target.checked}))} />
                      {" "}Dolor retocalcáneo (Sever / Apofisitis calcánea) — edad 8-14 años
                    </label>
                  </>
                )}
              </fieldset>

              <fieldset>
                <legend>Dismetria (Longitud de piernas)</legend>
                <label className="checkbox-label">
                  <input type="checkbox" name="dismetriaActiva" checked={form.dismetriaActiva} onChange={handleChange} />
                  Presenta discrepancia de longitud de piernas
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
                      <input name="dismetriaValor" type="number" min="2" max="30" value={form.dismetriaValor} onChange={handleChange} required />
                    </label>
                  </div>
                )}
              </fieldset>

              <fieldset>
                <legend>Datos del Especialista</legend>
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <label style={{ flex: 2, marginBottom: 0 }}>
                    Nombre del Especialista
                    <input name="especialista" value={form.especialista} onChange={handleChange} placeholder="Ej: Dr. Juan Pérez" />
                  </label>
                  <label style={{ flex: 2, marginBottom: 0 }}>
                    Especialidad
                    <input name="especialidad" value={form.especialidad} onChange={handleChange} placeholder="Ej: Ortopedia Infantil" />
                  </label>
                  <label style={{ flex: 1, marginBottom: 0 }}>
                    RUT
                    <input name="especialistaRut" value={form.especialistaRut} onChange={handleChange} placeholder="Ej: 17.618.006-4" />
                  </label>
                </div>
              </fieldset>

              <fieldset>
                <legend>Observaciones Clínicas</legend>
                <label style={{ marginBottom: 0 }}>
                  Indicaciones adicionales (se imprimirán en la receta)
                  <textarea
                    name="observaciones" value={form.observaciones} onChange={handleChange}
                    placeholder="Ej: Usar con calzado deportivo firme, realizar elongaciones diarias, etc."
                    rows="3"
                    style={{ width: "100%", marginTop: "0.25rem", fontFamily: "inherit", padding: "0.5rem", borderRadius: "4px", border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text-main)", resize: "vertical" }}
                  />
                </label>
              </fieldset>

              {error && <p className="error">{error}</p>}
              <button type="submit" className="btn-primary">Generar Prescripción</button>
            </form>
          </section>

          {result && (
            <section className="result-section">
              {result.tipoPie === "cavo" && !result.indicacion && result.alerta && (
                <div className="no-indicacion" style={{ borderLeft: "5px solid #dc2626", background: "rgba(239,68,68,0.08)" }}>
                  <h2 style={{ color: "#dc2626" }}>Alerta Neurologica</h2>
                  <p className="mensaje" style={{ fontWeight: "bold", color: "#b91c1c" }}>{result.alerta}</p>
                  <p>No se elabora plantilla. Derivar a Neurologia Infantil.</p>
                </div>
              )}

              {!result.indicacion && result.mensaje && !result.alerta && (
                <div className="no-indicacion">
                  <h2>Sin indicación de plantilla</h2>
                  <p className="mensaje">{result.mensaje}</p>
                  <ul>
                    {result.recomendaciones && result.recomendaciones.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}

              {result.indicacion && (
                <>
                  <div className="rx-header">
                    <h2>Prescripción de Plantilla</h2>
                    <div className="rx-meta">
                      {form.paciente && <span>{form.paciente}</span>}
                      <span>Talla {form.talla} EU</span>
                      <span>{form.edad} años</span>
                      <span className={"badge badge-" + form.grado}>{gradeLabel[form.grado]}</span>
                      <span className="badge" style={{ background: isEquino ? "#d97706" : isCavo ? "#7c3aed" : "#2563eb", color: "#fff", padding: "0.2rem 0.6rem", borderRadius: "4px", fontSize: "0.78rem" }}>
                        {isEquino ? "Pie Equino" : isCavo ? "Pie Cavo" : "Pie Plano"}
                      </span>
                    </div>
                  </div>

                  <div className="rx-grid">
                    <RxItem label="Tipo de Ortesis" value={result.tipo} highlight={true} />
                    <RxItem label={isCavo ? "Arco Lateral (mm)" : "Arco Medial (mm)"} value={result.arcoSoporte} />
                    {result.alzaMedidaMm > 0 && <RxItem label="Alza de Talón" value={`${result.alzaMedidaMm} mm`} />}

                    <RxItem label="Cuña Retropié" value={result.cunaRearfoot !== "0" ? `${result.cunaRearfoot} (${result.cunaRearfootTipo})` : "No"} />
                    {!isCavo && <RxItem label="Flanco Medial" value={result.flancoMedial} />}
                    <RxItem label="Barra Retrocapital" value={result.barraRetrocapitalMm > 0 ? `${result.barraRetrocapitalMm} mm` : "No"} />
                    {isCavo && <RxItem label="Cut-Out 1er Radio" value={result.cutOut ? "Sí — bajo 1er metatarsiano (Poron 3mm)" : "No"} />}
                    <RxItem label="Copa de Talón" value={result.copaProfundidadMm > 0 ? `${result.copaTalon} (${result.copaProfundidadMm}mm)` : result.copaTalon} />
                    <RxItem label="Material Base" value={result.material} className="print-hide" />
                    <RxItem label="Forro Superior" value={result.materialForro} className="print-hide" />
                    <RxItem label="Longitud" value={result.longitud} className="print-hide" />
                    <RxItem label="Controles" value={result.controles} className="print-hide" />
                  </div>

                  {form.observaciones && (
                    <div className="print-observaciones" style={{ marginTop: "1rem", borderLeft: "4px solid var(--accent)", paddingLeft: "1rem" }}>
                      <strong>Indicaciones del Especialista:</strong>
                      <p style={{ whiteSpace: "pre-wrap", fontSize: "0.95rem", margin: "0.25rem 0 0 0" }}>{form.observaciones}</p>
                    </div>
                  )}

                  {result.notas && result.notas.length > 0 && (
                    <div className="notas">
                      <h3>Notas Clínicas</h3>
                      <ul>{result.notas.map((n, i) => <li key={i}>{n}</li>)}</ul>
                    </div>
                  )}

                  {result.notes && result.notes.length > 0 && (
                    <div className="notas">
                      <h3>Notas Clínicas</h3>
                      <ul>{result.notes.map((n, i) => <li key={i}>{n}</li>)}</ul>
                    </div>
                  )}

                  {result.fundamentacion && result.fundamentacion.length > 0 && (
                    <details className="fundamentacion">
                      <summary>Fundamentación Bibliográfica</summary>
                      <ul>{result.fundamentacion.map((f, i) => <li key={i}>{f}</li>)}</ul>
                    </details>
                  )}

                  <InsoleDiagram rx={result} form={form} />

                  <div className="rx-actions">
                    <button className="btn-save" onClick={handleGuardar}>Guardar en Registro</button>
                    <button className="btn-print" onClick={() => window.print()}>Imprimir Receta</button>
                    {savedMsg && <span className="saved-msg">{savedMsg}</span>}
                  </div>

                  <div className="print-page-2">
                    <div className="print-header">
                      <h2>Educación para Padres — {isEquino ? "Pie Equino" : isCavo ? "Pie Cavo" : "Pie Plano"} y Uso de Plantillas</h2>
                      <p>Paciente: <strong>{form.paciente || "Sin nombre"}</strong> · Fecha: {new Date().toLocaleDateString("es-CL")} · Próximo control: <strong>{result.fechaControl}</strong></p>
                      {form.especialista && (
                        <p style={{ marginTop: "0.25rem", fontWeight: "bold" }}>
                          {form.especialista}{form.especialidad ? " · " + form.especialidad : ""}{form.especialistaRut ? " · RUT: " + form.especialistaRut : ""}
                        </p>
                      )}
                    </div>

                    <div className="print-guia-wrapper">
                      {isEquino ? <SeccionPadresEquino /> : isCavo ? <SeccionPadresCavo /> : <SeccionPadres printMode />}
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
                    <span style={{ fontSize: "0.75rem", color: entry.tipoPie === "cavo" ? "#7c3aed" : "#2563eb" }}>
                      {entry.tipoPie === "cavo" ? "Pie Cavo" : "Pie Plano"}
                    </span>
                    <button className="btn-delete" onClick={() => handleEliminar(entry.id)}>X</button>
                  </div>
                  <div className="reg-details">
                    <span>Talla {entry.talla} EU</span>
                    <span>{entry.edad} años</span>
                    {entry.tipoPie !== "cavo" && <span>{entry.flexible ? "Flexible" : "Rígido"}</span>}
                    {entry.tipoPie === "cavo" && <span>Coleman {entry.testColeman === "positivo" ? "+" : "-"}</span>}
                    <span>{entry.sintomas ? "Sintomático" : "Asintomático"}</span>
                  </div>
                  <div className="reg-tipo">{entry.prescripcion.tipo || entry.prescripcion.mensaje}</div>
                  <details className="reg-full">
                    <summary>Ver prescripción completa</summary>
                    <div className="rx-grid compact">
                      {entry.prescripcion.indicacion && (
                        <>
                          <RxItem label="Cuña Retropié" value={entry.prescripcion.cunaRearfoot} />
                          <RxItem label="Soporte Arco" value={entry.prescripcion.arcoSoporte} />
                          <RxItem label="Material" value={entry.prescripcion.material} />
                          <RxItem label="Controles" value={entry.prescripcion.controles} />
                          {entry.prescripcion.tipoPie === "cavo" && (
                            <RxItem label="Cut-Out" value={entry.prescripcion.cutOut ? "Sí" : "No"} />
                          )}
                          {entry.prescripcion.tipoPie !== "cavo" && (
                            <RxItem label="Cuña Antepié" value={entry.prescripcion.cunaForefoot} />
                          )}
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
          <thead><tr><th>Grado</th><th>Descripción clínica</th><th>Índice Staheli</th><th>CSI</th></tr></thead>
          <tbody>
            <tr><td>Leve (I)</td><td>Leve contacto medial, arco visible en carga</td><td>0.82 – 1.15</td><td>42 – 48%</td></tr>
            <tr><td>Moderado (II)</td><td>Colapso del arco medial visible en bipedestación</td><td>1.15 – 1.40</td><td>48 – 62%</td></tr>
            <tr><td>Severo (III)</td><td>Colapso total, talón valgo marcado, abducción antepié</td><td>&gt; 1.40</td><td>&gt; 62%</td></tr>
          </tbody>
        </table>
      </details>

      <details>
        <summary>Grados de Pie Cavo</summary>
        <table>
          <thead><tr><th>Grado</th><th>Descripción clínica</th><th>Test de Coleman</th></tr></thead>
          <tbody>
            <tr><td>Leve</td><td>Aumento leve del arco, sin síntomas o mínimos</td><td>Suele ser positivo (flexible)</td></tr>
            <tr><td>Moderado</td><td>Arco elevado, callosidades, posible garra incipiente</td><td>Variable</td></tr>
            <tr><td>Severo</td><td>Garra de dedos establecida, dolor, inestabilidad lateral</td><td>Suele ser negativo (rígido)</td></tr>
          </tbody>
        </table>
      </details>

      <details>
        <summary>Tests Clínicos Clave</summary>
        <div className="guia-tests">
          <div className="test-card">
            <h4>Navicular Drop Test</h4>
            <p>Medir altura del tubérculo navicular en sedestación (neutra) vs. bipedestación. Descenso ≥ 10 mm = pronación excesiva.</p>
          </div>
          <div className="test-card">
            <h4>Test de Jack (puntillas)</h4>
            <p>Arco aparece en puntillas = flexible. Sin arco = rígido → plantilla acomodativa + derivación.</p>
          </div>
          <div className="test-card">
            <h4>Test de Coleman (Pie Cavo)</h4>
            <p>Positivo: el talón varo se corrige al apoyar solo 4° y 5° metatarsiano → pie flexible (cuña externa). Negativo: talón fijo → pie rígido (cuña interna).</p>
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
          <thead><tr><th>Edad</th><th>Estado normal</th><th>Conducta</th></tr></thead>
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
          <thead><tr><th>Elemento</th><th>Función</th><th>Valores habituales</th></tr></thead>
          <tbody>
            <tr><td>Cuña retropié</td><td>Reduce pronación subtalar</td><td>4° estándar (máx. 6°)</td></tr>
            <tr><td>Cuña antepié</td><td>Corrige varo/valgo de antepié</td><td>0–6° según valoración</td></tr>
            <tr><td>Soporte arco medial</td><td>Sostiene arco longitudinal medial (pie plano)</td><td>10–18 mm</td></tr>
            <tr><td>Soporte arco lateral</td><td>Soporte del arco en pie cavo</td><td>15–26 mm según grado/edad</td></tr>
            <tr><td>Flanco medial</td><td>Control total del pie en la copa</td><td>Alto en UCBL</td></tr>
            <tr><td>Barra retrocapital</td><td>Descarga metatarsal amplia</td><td>3–5 mm retrocapital</td></tr>
            <tr><td>Cut-out 1er radio</td><td>Descarga bajo 1er metatarsiano (pie cavo)</td><td>Indicado en moderado/severo</td></tr>
          </tbody>
        </table>
      </details>
    </main>
  );
}

function InsoleDiagram({ rx, form }) {
  if (!rx || !rx.indicacion) return null;

  const isCavo = rx.tipoPie === "cavo";
  const isEquino = rx.tipoPie === "equino";
  const alzaMm = rx.alzaMedidaMm || 0;
  const hasMetatarsalPad = rx.barraRetrocapitalMm > 0;
  const hasRearfootWedge = rx.cunaRearfoot && rx.cunaRearfoot !== "0°" && rx.cunaRearfoot !== "0 mm" && !rx.cunaRearfoot.includes("sin cuña") && rx.cunaRearfoot !== "0";
  const cunaRearfootText = hasRearfootWedge ? rx.cunaRearfoot : "";
  const hasForefootWedge = !isCavo && rx.cunaForefoot && rx.cunaForefoot !== "0°" && rx.cunaForefoot !== "0 mm" && rx.cunaForefoot !== "0" && rx.cunaForefoot !== "N/A";
  const cavoWedgeExt = isCavo && rx.cunaRearfoot && rx.cunaRearfoot.includes("Ext");
  const hasCutOut = isCavo && rx.cutOut;
  const archMm = parseInt(rx.arcoSoporte) || 0;
  const archText = isCavo ? "Arco lateral: " + rx.arcoSoporte : "Arco: " + rx.arcoSoporte;
  const archOpacity = archMm >= 22 ? 0.95 : archMm >= 18 ? 0.75 : archMm >= 15 ? 0.55 : 0.35;
  const PX_MM = 2.5;
  const alzaHpx = alzaMm * PX_MM;
  const cunaMm = hasRearfootWedge ? (parseInt(rx.cunaRearfoot) || 0) : 0;
  const wedgeHpx = cunaMm * PX_MM;
  const archRisePx = archMm * PX_MM;

  const renderInsoleTop = (isLeft) => {
    const side = isLeft ? "izquierdo" : "derecho";
    const isShorter = rx.alzaTalon && rx.alzaTalon.pie === side;

    // For right foot (not mirrored): medial=left(x~24-26), lateral=right(x~74-78)
    // For cavo lateral arch: use right side (lateral for right foot)
    const archZone = isCavo ? (
      <path
        d="M74 158 C78 135 78 108 76 82 C76 70 75 60 74 50 C66 56 60 80 60 108 C60 132 64 152 74 158 Z"
        fill="rgba(124,58,237,0.5)" stroke="rgba(124,58,237,0.85)" strokeWidth="1.4" opacity={archOpacity}
      />
    ) : (
      <path
        d="M26 158 C22 135 22 108 24 82 C24 70 25 60 26 50 C34 56 40 80 40 108 C40 132 36 152 26 158 Z"
        fill="rgba(99,102,241,0.5)" stroke="rgba(99,102,241,0.85)" strokeWidth="1.4" opacity={archOpacity}
      />
    );

    const equinoHeelZone = isEquino ? (
      <path
        d="M26 210 C26 185 34 175 50 172 C66 175 74 185 74 210 C74 210 50 210 50 210 Z"
        fill="rgba(217,119,6,0.45)" stroke="#d97706" strokeWidth="1.4"
      />
    ) : null;

    // Rearfoot wedge
    let wedgeZone = null;
    if (hasRearfootWedge) {
      if (isCavo && cavoWedgeExt) {
        // External: lateral side of heel (right side for right foot)
        wedgeZone = (
          <path
            d="M50 210 C62 210 74 196 76 168 C70 163 62 172 58 186 C55 196 50 210 50 210 Z"
            fill="rgba(124,58,237,0.55)" stroke="#7c3aed" strokeWidth="1.5"
          />
        );
      } else if (isCavo) {
        // Internal: medial side (same as plano but purple)
        wedgeZone = (
          <path
            d="M50 210 C38 210 26 196 24 168 C30 163 38 172 42 186 C45 196 50 210 50 210 Z"
            fill="rgba(124,58,237,0.55)" stroke="#7c3aed" strokeWidth="1.5"
          />
        );
      } else {
        wedgeZone = (
          <path
            d="M50 210 C38 210 26 196 24 168 C30 163 38 172 42 186 C45 196 50 210 50 210 Z"
            fill="rgba(239,68,68,0.55)" stroke="#dc2626" strokeWidth="1.5"
          />
        );
      }
    }

    return (
      <g transform={isLeft ? "translate(100,0) scale(-1,1)" : ""}>
        <rect width="100" height="220" fill="url(#gridPatternI)" opacity="0.35"/>
        <path
          d="M50 210 C36 210 26 195 24 165 C22 135 28 100 24 70 C22 50 22 30 32 18 C42 6 58 6 68 18 C78 30 76 50 78 70 C80 100 78 135 76 165 C74 195 64 210 50 210 Z"
          fill="var(--bg-card)" stroke={isCavo ? "#7c3aed" : "var(--accent)"} strokeWidth="2"
        />
        <line x1="50" y1="12" x2="50" y2="208" stroke="var(--text-muted)" strokeWidth="0.4" strokeDasharray="4,3" opacity="0.2"/>
        {archZone}
        {equinoHeelZone}
        {wedgeZone}
        {hasMetatarsalPad && (
          <path d="M27 83 C27 79 73 79 73 83 C73 87 27 87 27 83 Z" fill="rgba(245,158,11,0.8)" stroke="#d97706" strokeWidth="1.5"/>
        )}
        {hasCutOut && (
          <ellipse cx="30" cy="35" rx="9" ry="14" fill="rgba(245,158,11,0.3)" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3,2"/>
        )}
        {hasForefootWedge && (
          <path d="M27 68 C24 50 24 30 32 18 C35 28 34 50 32 58 Z" fill="rgba(239,68,68,0.35)" stroke="#ef4444" strokeWidth="1"/>
        )}
        {isShorter && (
          <path
            d="M50 210 C36 210 26 192 28 170 C35 158 45 158 50 158 C55 158 65 158 72 170 C74 192 64 210 50 210 Z"
            fill="rgba(180,83,9,0.2)" stroke="#b45309" strokeWidth="1" strokeDasharray="3,1.5"
          />
        )}
        <g transform="translate(10,201)" opacity="0.45">
          <line x1="0" y1="0" x2="18" y2="0" stroke="var(--text-muted)" strokeWidth="0.75"/>
          <line x1="0" y1="-2" x2="0" y2="2" stroke="var(--text-muted)" strokeWidth="0.75"/>
          <line x1="18" y1="-2" x2="18" y2="2" stroke="var(--text-muted)" strokeWidth="0.75"/>
        </g>
      </g>
    );
  };

  const renderInsoleSide = (side) => {
    const isShorter = rx.alzaTalon && rx.alzaTalon.pie === side;
    const liftVal = isShorter ? rx.alzaTalon.valor : 0;
    const alzaH = liftVal * PX_MM;
    const pX = 24, hX = 234, wSX = 172, archL = 62, archMX = 118, archR = 172;
    const iTopY = 78, shellH = 9;
    const iBotY = iTopY + shellH;
    const archPY = iTopY - archRisePx;
    const wedgeTopY = iTopY - wedgeHpx;
    const alzaTopY = wedgeTopY - alzaH;

    const topSurface = "M " + pX + "," + iTopY + " L " + archL + "," + iTopY +
      " C " + (archL+22) + "," + iTopY + " " + (archMX-14) + "," + archPY + " " + archMX + "," + archPY +
      " C " + (archMX+14) + "," + archPY + " " + (archR-22) + "," + iTopY + " " + archR + "," + iTopY +
      " L " + wSX + "," + iTopY + " L " + hX + "," + wedgeTopY;
    const bodyD = topSurface + " L " + hX + "," + iBotY + " L " + pX + "," + iBotY + " Z";

    const archColor = isCavo ? "rgba(124,58,237,0.35)" : "rgba(99,102,241,0.35)";
    const archStroke = isCavo ? "rgba(124,58,237,0.7)" : "rgba(99,102,241,0.7)";
    const archTextColor = isCavo ? "rgba(124,58,237,1)" : "rgba(99,102,241,1)";
    const wedgeFill = isCavo ? "rgba(124,58,237,0.45)" : "rgba(239,68,68,0.45)";
    const wedgeStroke = isCavo ? "#7c3aed" : "#dc2626";
    const wedgeTextColor = isCavo ? "#7c3aed" : "#dc2626";

    return (
      <>
        <line x1="8" y1={iBotY + 4} x2="258" y2={iBotY + 4} stroke="#ccc" strokeWidth="0.8" strokeDasharray="4,3" opacity="0.5"/>
        <path d={bodyD} fill="var(--bg-card)" stroke={isCavo ? "#7c3aed" : "var(--accent)"} strokeWidth="2"/>
        {wedgeHpx > 0 && (
          <path d={"M " + wSX + "," + iTopY + " L " + hX + "," + iTopY + " L " + hX + "," + wedgeTopY + " Z"} fill={wedgeFill} stroke={wedgeStroke} strokeWidth="1.6"/>
        )}
        {alzaH > 0 && (
          <path d={"M " + wSX + "," + wedgeTopY + " L " + hX + "," + wedgeTopY + " L " + hX + "," + alzaTopY + " L " + wSX + "," + alzaTopY + " Z"} fill="rgba(180,83,9,0.45)" stroke="#b45309" strokeWidth="1.2" strokeDasharray="4,2"/>
        )}
        <path
          d={"M " + (archL+10) + "," + iTopY + " C " + (archL+22) + "," + iTopY + " " + (archMX-12) + "," + (archPY+1) + " " + archMX + "," + (archPY+1) + " C " + (archMX+12) + "," + (archPY+1) + " " + (archR-22) + "," + iTopY + " " + (archR-10) + "," + iTopY + " Z"}
          fill={archColor} stroke={archStroke} strokeWidth="1.2"
        />
        {archRisePx > 0 && (
          <>
            <line x1={archMX} y1={archPY} x2={archMX} y2={iTopY} stroke={archStroke} strokeWidth="0.8" strokeDasharray="2.5,2"/>
            <line x1={archMX-5} y1={archPY} x2={archMX+5} y2={archPY} stroke={archTextColor} strokeWidth="1.5"/>
            <line x1={archMX-5} y1={iTopY} x2={archMX+5} y2={iTopY} stroke={archTextColor} strokeWidth="1.5"/>
            <text x={archMX-8} y={(archPY+iTopY)/2+3} textAnchor="middle" fontSize="8" fill={archTextColor} fontWeight="bold">{rx.arcoSoporte}</text>
            {isCavo && <text x={archMX} y={archPY - 5} textAnchor="middle" fontSize="6.5" fill={archTextColor} fontWeight="bold">Arco lateral</text>}
          </>
        )}
        {wedgeHpx > 0 && (
          <>
            <line x1={hX-4} y1={wedgeTopY} x2={hX-4} y2={iTopY} stroke={wedgeStroke} strokeWidth="0.8" strokeDasharray="2,2"/>
            <line x1={hX-9} y1={wedgeTopY} x2={hX+1} y2={wedgeTopY} stroke={wedgeStroke} strokeWidth="1.5"/>
            <line x1={hX-9} y1={iTopY} x2={hX+1} y2={iTopY} stroke={wedgeStroke} strokeWidth="1.5"/>
            <text x={(wSX+hX)/2} y={(wedgeTopY+iTopY)/2+3} textAnchor="middle" fontSize="7" fill={wedgeTextColor} fontWeight="bold">Cuña {cunaRearfootText}</text>
          </>
        )}
        {alzaH > 0 && (
          <text x={hX} y={alzaTopY-4} textAnchor="middle" fontSize="7" fill="#b45309" fontWeight="bold">+{liftVal}mm alza</text>
        )}
        {isEquino && alzaHpx > 0 && (
          <>
            <path
              d={"M " + wSX + "," + iBotY + " L " + hX + "," + iBotY + " L " + hX + "," + (iBotY + alzaHpx) + " L " + wSX + "," + iBotY + " Z"}
              fill="rgba(217,119,6,0.55)" stroke="#d97706" strokeWidth="1.5"
            />
            <line x1={hX-4} y1={iBotY} x2={hX-4} y2={iBotY + alzaHpx} stroke="#d97706" strokeWidth="0.8" strokeDasharray="2,2"/>
            <line x1={hX-9} y1={iBotY} x2={hX+1} y2={iBotY} stroke="#d97706" strokeWidth="1.5"/>
            <line x1={hX-9} y1={iBotY + alzaHpx} x2={hX+1} y2={iBotY + alzaHpx} stroke="#d97706" strokeWidth="1.5"/>
            <text x={(wSX+hX)/2} y={iBotY + alzaHpx/2 + 3} textAnchor="middle" fontSize="7" fill="#b45309" fontWeight="bold">Alza {alzaMm}mm</text>
          </>
        )}
      </>
    );
  };

  return (
    <div className="insole-diagrams">
      <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
        <defs>
          <pattern id="gridPatternI" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="var(--border-color)" strokeWidth="0.4" opacity="0.35"/>
          </pattern>
        </defs>
      </svg>

      <h3>Diseño Técnico y Ajustes Mecánicos (Pies Izquierdo y Derecho)</h3>
      {isCavo && (
        <p style={{ fontSize: "0.85rem", color: "#7c3aed", marginBottom: "0.5rem" }}>
          Pie Cavo: soporte de arco LATERAL (zona violeta). Cuña de retropié: {cavoWedgeExt ? "EXTERNA (lateral)" : "INTERNA (medial)"}.
          {hasCutOut && " Cut-out bajo 1er radio (naranja punteado)."}
        </p>
      )}
      {isEquino && (
        <p style={{ fontSize: "0.85rem", color: "#d97706", marginBottom: "0.5rem" }}>
          Pie Equino: alza posterior del talón (zona naranja) relaja el tríceps sural. Soporte medial anti-pronación compensatoria.
        </p>
      )}

      <div className="diagram-card" style={{ marginBottom: "1rem" }}>
        <h4>Vistas Superiores — Molde Técnico (Vista Plantar)</h4>
        <div className="diagrams-dual-row">
          <div className="diagram-side-box">
            <h5>Pie Izquierdo</h5>
            <svg viewBox="0 0 100 220" className="insole-svg">
              {renderInsoleTop(true)}
              <text x="50" y="218" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="var(--text-main)">TALÓN</text>
              <text x="50" y="9" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="var(--text-main)">PUNTA</text>
              <text x="50" y="117" textAnchor="middle" fontSize="5.5" fill={isCavo ? "rgba(124,58,237,1)" : "rgba(99,102,241,1)"} fontWeight="bold">{archText}</text>
              {hasMetatarsalPad && <text x="50" y="88" fontSize="5.5" fill="#d97706" fontWeight="bold" textAnchor="middle">B.R. {rx.barraRetrocapitalMm}mm</text>}
              {hasRearfootWedge && <text x="50" y="202" fontSize="5.5" fill={isCavo ? "#7c3aed" : "#dc2626"} fontWeight="bold" textAnchor="middle">Cuña {cunaRearfootText}</text>}
              {hasCutOut && <text x="70" y="29" fontSize="5" fill="#d97706" fontWeight="bold" textAnchor="middle">Cut-out</text>}
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
              <text x="50" y="117" textAnchor="middle" fontSize="5.5" fill={isCavo ? "rgba(124,58,237,1)" : "rgba(99,102,241,1)"} fontWeight="bold">{archText}</text>
              {hasMetatarsalPad && <text x="50" y="88" fontSize="5.5" fill="#d97706" fontWeight="bold" textAnchor="middle">B.R. {rx.barraRetrocapitalMm}mm</text>}
              {hasRearfootWedge && <text x="50" y="202" fontSize="5.5" fill={isCavo ? "#7c3aed" : "#dc2626"} fontWeight="bold" textAnchor="middle">Cuña {cunaRearfootText}</text>}
              {hasCutOut && <text x="30" y="29" fontSize="5" fill="#d97706" fontWeight="bold" textAnchor="middle">Cut-out</text>}
              {rx.alzaTalon && rx.alzaTalon.pie === "derecho" && (
                <text x="50" y="180" textAnchor="middle" fontSize="6" fill="#b45309" fontWeight="bold">Alza +{rx.alzaTalon.valor}mm</text>
              )}
              <text x="89" y="200" textAnchor="end" fontSize="4" fill="var(--text-muted)" opacity="0.55">Scale 20mm</text>
            </svg>
          </div>
        </div>
      </div>

      <div className="diagram-card">
        <h4>Perfiles Laterales — Cuña y Soporte de Arco</h4>
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

      <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap", marginTop:"0.75rem", fontSize:"0.78rem", color:"var(--text-muted)" }}>
        <span style={{ display:"flex", alignItems:"center", gap:"0.3rem" }}>
          <span style={{ display:"inline-block", width:14, height:10, background: isCavo ? "rgba(124,58,237,0.45)" : "rgba(99,102,241,0.45)", border: isCavo ? "1px solid rgba(124,58,237,0.8)" : "1px solid rgba(99,102,241,0.8)", borderRadius:2 }}></span>
          {isCavo ? "Soporte arco lateral (" + rx.arcoSoporte + ")" : "Soporte arco medial (" + rx.arcoSoporte + ")"}
        </span>
        {hasRearfootWedge && (
          <span style={{ display:"flex", alignItems:"center", gap:"0.3rem" }}>
            <span style={{ display:"inline-block", width:14, height:10, background: isCavo ? "rgba(124,58,237,0.5)" : "rgba(239,68,68,0.5)", border: isCavo ? "1px solid #7c3aed" : "1px solid #dc2626", borderRadius:2 }}></span>
            {"Cuña retropié " + (isCavo ? (cavoWedgeExt ? "externa" : "interna") : "varo") + " (" + cunaRearfootText + ")"}
          </span>
        )}
        {hasMetatarsalPad && (
          <span style={{ display:"flex", alignItems:"center", gap:"0.3rem" }}>
            <span style={{ display:"inline-block", width:14, height:10, background:"rgba(245,158,11,0.75)", border:"1px solid #d97706", borderRadius:2 }}></span>
            {"Barra retrocapital (" + rx.barraRetrocapitalMm + " mm)"}
          </span>
        )}
        {hasCutOut && (
          <span style={{ display:"flex", alignItems:"center", gap:"0.3rem" }}>
            <span style={{ display:"inline-block", width:14, height:10, background:"rgba(245,158,11,0.3)", border:"1px dashed #d97706", borderRadius:2 }}></span>
            Cut-out bajo 1er radio
          </span>
        )}
        {rx.alzaTalon && (
          <span style={{ display:"flex", alignItems:"center", gap:"0.3rem" }}>
            <span style={{ display:"inline-block", width:14, height:10, background:"rgba(180,83,9,0.5)", border:"1px solid #b45309", borderRadius:2 }}></span>
            {"Alza de talón (+" + rx.alzaTalon.valor + "mm)"}
          </span>
        )}
        {isEquino && alzaMm > 0 && (
          <span style={{ display:"flex", alignItems:"center", gap:"0.3rem" }}>
            <span style={{ display:"inline-block", width:14, height:10, background:"rgba(217,119,6,0.5)", border:"1px solid #d97706", borderRadius:2 }}></span>
            {`Alza de talón (${alzaMm}mm)`}
          </span>
        )}
      </div>

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
