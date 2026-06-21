// Motor de Prescripción Ortopédica V2.2 — Escalado Biomecánico Proporcional
// factor_escala = min(1.0, talla/41) aplicado a TODAS las dimensiones
// Cuña retropié = ROUND(arco/3) — Regla del 1/3 arco-cuña
// Referencia: Delphi Consensus (PMC4282733) · Cochrane (PMC9561439) · Kirby Skive · Coleman Block Test

const round = (n) => Math.round(n);

export const GRADES = {
  LEVE: "leve",
  MODERADO: "moderado",
  SEVERO: "severo",
};

function defaultRx() {
  return {
    tipoPie: null,
    indicacion: true,
    tipo: "",
    diagnostico_final: "",
    arcoSoporte: "0mm",
    skiveKirbyMm: 0,
    cunaRearfoot: "0",
    cunaRearfootTipo: "Ninguna",
    cunaForefoot: "0",
    flancoMedial: "Estándar",
    barraRetrocapitalMm: 0,
    barraRetrocapitalPosicion: "",
    cutOut: false,
    copaTalon: "Estándar",
    copaProfundidadMm: 0,
    material: "",
    materialForro: "EVA Confort",
    alerta: null,
    derivacion: false,
    longitud: "Longitud completa",
    controles: "Control a los 3 meses",
    notas: [],
    fundamentacion: [],
    alzaTalon: null,
  };
}

// ══════════════════════════════════════════════════════════════════
// MÓDULO A — PIE PLANO (Pes Planovalgus)
// ══════════════════════════════════════════════════════════════════

function calcPlano({ grado, edad, talla, peso, sintomas, flexible, dolorMetatarsal, dismetriaActiva, dismetriaPie, dismetriaValor }) {
  const rx = defaultRx();
  rx.tipoPie = "plano";

  const f = Math.min(1.0, talla / 41.0);

  // Dismetría
  rx.alzaTalon = dismetriaActiva ? { pie: dismetriaPie, valor: dismetriaValor } : null;
  if (dismetriaActiva) {
    rx.notas.push(`Dismetría: alza de talón ${dismetriaValor} mm en pie ${dismetriaPie}.`);
  }

  // ── Paso A.0: Test de Jack — Descarte por Rigidez ──
  if (!flexible) {
    const arco = round(10 * f);
    const copa = round(10 * f);
    rx.tipo = "Plantilla Acomodativa Pura (Pie Plano Rígido)";
    rx.diagnostico_final = `Pie plano rígido ${grado} — Test de Jack negativo`;
    rx.arcoSoporte = `${arco}mm`;
    rx.skiveKirbyMm = 0;
    rx.cunaRearfoot = "0";
    rx.cunaRearfootTipo = "Ninguna";
    rx.barraRetrocapitalMm = 0;
    rx.copaTalon = "Estándar";
    rx.copaProfundidadMm = copa;
    rx.material = "EVA Blando (Shore 30) de acomodación pasiva pura";
    rx.materialForro = "Poron 3.0mm de celda abierta";
    rx.alerta = "SOPORTE PLANTAR ACOMODATIVO. Paciente presenta Pie Plano Rígido. Derivar urgentemente a Ortopedia Infantil para descartar coalición tarsiana o astrágalo vertical.";
    rx.derivacion = true;
    rx.controles = "Control a los 6 meses";
    rx.notas.push(
      "Pie plano rígido: plantilla estrictamente acomodativa. Corrección activa contraindicada.",
      "Derivación prioritaria a Traumatología para descarte de coalición tarsal."
    );
    rx.fundamentacion.push("PTTD Stage III / Rigid flatfoot: accommodative orthosis only", "Delphi Consensus (PMC4282733)");
    return rx;
  }

  // ── Paso A.1: Filtro Pediátrico Fisiológico ──
  if (edad < 6 && !sintomas) {
    rx.indicacion = false;
    rx.alerta = "PIE PLANO FISIOLÓGICO ASINTOMÁTICO. No requiere tratamiento ortésico. Se recomienda marcha activa descalzo para el desarrollo normal de la musculatura intrínseca.";
    return rx;
  }

  // ── Paso A.2: Dosificación del Arco y Copa del Talón ──
  let arcoBase, copaBase, copaTipo;
  if (grado === GRADES.LEVE) {
    arcoBase = 15; copaBase = 10; copaTipo = "Estándar";
  } else if (grado === GRADES.MODERADO) {
    arcoBase = 18; copaBase = 10; copaTipo = "Estándar";
  } else {
    arcoBase = 18; copaBase = 15; copaTipo = "Profunda UCBL";
  }

  const arcoMm = round(arcoBase * f);
  const copaMm = round(copaBase * f);
  rx.arcoSoporte = `${arcoMm}mm`;
  rx.copaTalon = copaTipo;
  rx.copaProfundidadMm = copaMm;
  if (grado === GRADES.SEVERO) {
    rx.flancoMedial = "Paredes medial y lateral altas (copa tipo UCBL)";
  }

  // ── Paso A.3: Regla del 1/3 Arco-Cuña ──
  const cunaMm = round(arcoMm / 3.0);
  rx.cunaRearfoot = `${cunaMm} mm`;
  rx.cunaRearfootTipo = "INTERNA";

  // ── Paso A.4: Kirby Medial Heel Skive (escalado) ──
  const esForzado = peso === "obesidad";
  if (grado === GRADES.LEVE) {
    rx.skiveKirbyMm = round(2 * f);
    rx.notas.push(`Kirby Skive medial ${rx.skiveKirbyMm}mm: efecto cinético inicial suave en el talón medial.`);
  } else if (grado === GRADES.MODERADO) {
    rx.skiveKirbyMm = round(4 * f);
    rx.notas.push(`Kirby Skive medial ${rx.skiveKirbyMm}mm: incremento ~15% en presión del retropié medial.`);
  } else if (grado === GRADES.SEVERO || esForzado) {
    rx.skiveKirbyMm = round(6 * f);
    rx.notas.push(`Kirby Skive medial ${rx.skiveKirbyMm}mm: incremento ~29% en presión del retropié medial — bloquea hiperpronación severa.`);
  }

  // ── Paso A.5: Anti-pié ──
  rx.cutOut = false;

  // ── Tipo y diagnóstico ──
  const gradoLabel = { leve: "Leve", moderado: "Moderado", severo: "Severo" }[grado];
  rx.tipo = `Plantilla correctora ${gradoLabel} — arco ${arcoMm}mm / cuña ${cunaMm}mm`;
  rx.diagnostico_final = `Pie plano ${grado}, talla ${talla}, edad ${edad} años`;

  // ── Material según grado ──
  if (grado === GRADES.LEVE) {
    rx.material = "EVA Doble Densidad (Base firme Shore 45 / Superficie blanda Shore 25)";
    rx.materialForro = "Microfibra perforada";
  } else if (grado === GRADES.MODERADO) {
    rx.material = "EVA Doble Densidad (Base Shore 50) o Resina termoplástica flexible 1.5mm";
    rx.materialForro = "Poron 3.0mm";
  } else {
    rx.material = talla >= 38
      ? "Polipropileno rígido 5.0mm o Composito de Fibra de Carbono de alto rebote"
      : "Nylon PA11 impreso 3D (2.25mm calibrado) o Polipropileno Homopolímero Rígido";
    rx.materialForro = "Poron 4.0mm";
    rx.notas.push("Copa UCBL: contención tridimensional del calcáneo y astrágalo. Evaluar PTTD.");
  }

  rx.fundamentacion.push(
    `Factor escala: min(1.0, ${talla}/41) = ${f.toFixed(4)} → arco ${arcoMm}mm, cuña ${cunaMm}mm (regla 1/3)`,
    "Delphi Consensus (PMC4282733)", "CART Decision Tree (PMC9566258)"
  );
  return rx;
}

// ══════════════════════════════════════════════════════════════════
// MÓDULO B — PIE CAVO (Pes Cavovarus)
// ══════════════════════════════════════════════════════════════════

function calcCavo({ grado, edad, talla, testColeman }) {
  const rx = defaultRx();
  rx.tipoPie = "cavo";
  rx.cunaForefoot = "N/A";
  rx.flancoMedial = "N/A";

  const f = Math.min(1.0, talla / 41.0);

  // Paso B.0: Filtro Neurológico
  if (edad < 4) {
    rx.indicacion = false;
    rx.alerta = "ALERTA NEUROLÓGICA. Pie cavo en menores de 4 años se asocia en un 67% a patologías neuromusculares (ej. Charcot-Marie-Tooth o disrafismo espinal). Derivar de inmediato a Neurología Infantil.";
    rx.derivacion = true;
    return rx;
  }

  const flexible = testColeman === "positivo";

  // Paso B.1: Cinemática del retropié (Coleman)
  if (flexible) {
    rx.cutOut = true;
    rx.cunaRearfootTipo = "EXTERNA";
    const cunaMm = round(5 * f);
    rx.cunaRearfoot = `${cunaMm} mm Ext`;
    rx.notas.push(
      `Coleman +: Retropié flexible. Cut-out bajo 1er radio — libera descenso de 1ª cabeza metatarsiana y desactiva vector de varo.`,
      `Cuña EXTERNA ${cunaMm}mm: valgizante lateral para expandir base de sustentación.`
    );
  } else {
    rx.cutOut = false;
    rx.cunaRearfootTipo = "INTERNA";
    const cunaMm = round(3 * f);
    rx.cunaRearfoot = `${cunaMm} mm Int`;
    rx.notas.push(
      "Coleman −: Retropié rígido estructurado. Sin cut-out.",
      `Cuña INTERNA ${cunaMm}mm: acomodativa de contacto total para disipar presiones.`
    );
  }

  // Paso B.2: Dosificación del Arco y Copa
  rx.skiveKirbyMm = 0;
  let arcoBase, copaBase, copaTipo;
  if (grado === GRADES.LEVE) {
    arcoBase = 18; copaBase = 10; copaTipo = "Estándar";
  } else if (grado === GRADES.MODERADO) {
    arcoBase = 22; copaBase = 10; copaTipo = "Estándar";
  } else {
    arcoBase = 26; copaBase = 14; copaTipo = "Profunda";
  }

  const arcoMm = round(arcoBase * f);
  const copaMm = round(copaBase * f);
  rx.arcoSoporte = `${arcoMm}mm`;
  rx.copaTalon = copaTipo;
  rx.copaProfundidadMm = copaMm;

  // Tipo y diagnóstico
  const gradoLabel = { leve: "Leve", moderado: "Moderado", severo: "Severo" }[grado];
  const colemanLabel = flexible ? "Flexible (Coleman +)" : "Rígido (Coleman −)";
  rx.tipo = `Plantilla cavo ${gradoLabel} ${colemanLabel} — arco ${arcoMm}mm`;
  rx.diagnostico_final = `Pie cavo ${grado}, talla ${talla}, ${colemanLabel}`;

  // Material
  if (grado === GRADES.LEVE) {
    rx.material = "EVA blando Monodensidad (Shore 30–35)";
    rx.materialForro = "Poron 3.0mm de celda abierta para amortiguación profunda";
  } else if (grado === GRADES.MODERADO) {
    rx.material = "EVA densidad media (Shore 40) o Resina termoplástica flexible";
    rx.materialForro = "PPT / Poron 3.0mm";
  } else {
    rx.material = "Nylon PA11 impreso 3D + cuñas EVA de alta amortiguación";
    rx.materialForro = "PPT o Poron 6.0mm Bicapa anterior";
    rx.notas.push("Severo: exige toma de molde o escaneo 3D estricto de contacto total.");
  }

  rx.fundamentacion.push(
    `Factor escala: min(1.0, ${talla}/41) = ${f.toFixed(4)} → arco ${arcoMm}mm`,
    "Coleman Block Test (PMC9566258)", "Pie cavo: soporte arco lateral según grado"
  );
  return rx;
}

// ══════════════════════════════════════════════════════════════════
// MÓDULO C — BARRA RETROCAPITAL (Global)
// ══════════════════════════════════════════════════════════════════

function aplicarBarra(rx, { edad, talla, grado, tipoPie, dolorMetatarsal }) {
  const f = Math.min(1.0, talla / 41.0);

  if (edad < 8) {
    rx.barraRetrocapitalMm = 0;
    rx.barraRetrocapitalPosicion = "";
    return;
  }

  const activar =
    dolorMetatarsal ||
    (tipoPie === "cavo" && (grado === GRADES.MODERADO || grado === GRADES.SEVERO));

  if (activar) {
    rx.barraRetrocapitalMm = round(4.5 * f * 10) / 10; // 1 decimal
    rx.barraRetrocapitalPosicion = "Instalar de forma oblicua, con su margen anterior exactamente a 5–10 mm proximal a las cabezas metatarsales 2, 3 y 4.";
    rx.notas.push(`Barra retrocapital ${rx.barraRetrocapitalMm}mm: oblicua proximal a cabezas 2ª–4ª metatarsianas.`);
  } else {
    rx.barraRetrocapitalMm = 0;
    rx.barraRetrocapitalPosicion = "";
  }
}

// ══════════════════════════════════════════════════════════════════
// API PÚBLICA
// ══════════════════════════════════════════════════════════════════

export function generatePrescription({
  tipoPie = "plano", talla, edad, grado, peso = "normal",
  sintomas, flexible, dolorMetatarsal, testColeman,
  barraRetrocapital, dismetriaActiva, dismetriaPie, dismetriaValor
}) {
  if (!talla || !edad) return { error: "Talla y edad son requeridas." };
  if (edad < 1 || edad > 120) return { error: "Edad fuera de rango (1–120)." };
  if (talla < 15 || talla > 50) return { error: "Talla fuera de rango (15–50 EU)." };

  const dm = dolorMetatarsal !== undefined ? dolorMetatarsal : !!barraRetrocapital;

  let rx;
  if (tipoPie === "cavo") {
    rx = calcCavo({ grado, edad, talla, testColeman });
  } else {
    if (edad < 2) return { error: "Edad mínima para prescripción: 2 años." };
    rx = calcPlano({
      grado, edad, talla,
      peso: peso || "normal",
      sintomas: !!sintomas,
      flexible: flexible !== false,
      dolorMetatarsal: dm,
      dismetriaActiva: !!dismetriaActiva,
      dismetriaPie: dismetriaPie || "izquierdo",
      dismetriaValor: dismetriaValor || 0,
    });
  }

  if (rx.indicacion) {
    aplicarBarra(rx, { edad, talla, grado, tipoPie, dolorMetatarsal: dm });
  }

  return rx;
}
