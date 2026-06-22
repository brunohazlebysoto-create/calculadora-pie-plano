// Motor de Prescripción Ortopédica V2.3 — Escalado Biomecánico Proporcional
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
    alzaMedidaMm: 0,
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
// MÓDULO C — PIE EQUINO NO NEUROLÓGICO
// ══════════════════════════════════════════════════════════════════

function calcEquino({ edad, talla, testSilfverskiold, rangoDorsiflexion, dolorRetrocalcaneoSever, dolorMetatarsal }) {
  const rx = defaultRx();
  rx.tipoPie = "equino";
  rx.cunaForefoot = "N/A";

  const f = Math.min(1.0, talla / 41.0);
  let gradoEq = "leve";

  // C.0: Bloqueo óseo
  if (testSilfverskiold === "gastro_soleo" && rangoDorsiflexion < -5) {
    rx.arcoSoporte = round(10 * f) + "mm";
    rx.alzaMedidaMm = round(6 * f);
    rx.copaProfundidadMm = round(12 * f);
    rx.copaTalon = "Estándar";
    rx.alerta = "ALERTA CLÍNICA: Bloqueo óseo o contractura extrema del Aquiles. Ortesis únicamente de alivio pasivo. Derivación obligatoria a Traumatología para estudio radiográfico de tobillo y evaluar exostosis o pinzamiento articular anterior.";
    rx.derivacion = true;
    rx.tipo = "Plantilla Equino — alivio pasivo (bloqueo óseo)";
    rx.diagnostico_final = "Pie equino no neurológico — posible bloqueo óseo · DF: " + rangoDorsiflexion + "°";
    rx.material = "EVA Alta Densidad (Shore 50) + cuña de talón en material firmemente compresible";
    rx.materialForro = "Poron 3.0mm de celda abierta";
    return rx;
  }

  // C.1: Sever
  if (edad >= 8 && edad <= 14 && dolorRetrocalcaneoSever === true) {
    const alzaMm = round(6 * f);
    const arcoMm = round(12 * f);
    rx.alzaMedidaMm = alzaMm;
    rx.arcoSoporte = arcoMm + "mm";
    rx.copaProfundidadMm = round(14 * f);
    rx.copaTalon = "Profunda";
    rx.alerta = "PROTOCOLO SEVER: Alza de " + alzaMm + "mm y cazoleta profunda para mitigar la tracción mecánica sobre la apófisis calcánea. Prescribir reposo deportivo temporal y estiramientos pasivos del tríceps sural.";
    rx.tipo = "Plantilla Equino — Protocolo Sever · alza " + alzaMm + "mm / arco " + arcoMm + "mm";
    rx.diagnostico_final = "Enfermedad de Sever (apofisitis calcánea) · DF: " + rangoDorsiflexion + "°";
    rx.material = "EVA Doble Densidad (Shore 40) con alza integrada de poliuretano expandido";
    rx.materialForro = "Poron 3.0mm de celda abierta";
    rx.notas.push(
      "Alza de talón " + alzaMm + "mm: relaja el tríceps sural y neutraliza la hiperpronación compensatoria.",
      "Soporte de arco " + arcoMm + "mm: bloquea el colapso del mediopié en carga."
    );
    return rx;
  }

  // C.2: Alza según rango de dorsiflexión
  let alzaBase;
  if (rangoDorsiflexion >= 5 && rangoDorsiflexion <= 9) {
    alzaBase = 4; gradoEq = "leve";
  } else if (rangoDorsiflexion >= 0 && rangoDorsiflexion <= 4) {
    alzaBase = 6; gradoEq = "moderado";
  } else {
    alzaBase = 9; gradoEq = "severo";
  }
  const alzaMm = round(alzaBase * f);
  rx.alzaMedidaMm = alzaMm;

  // C.3: Arco anti-pronación compensatoria
  const arcoMm = round(12 * f);
  rx.arcoSoporte = arcoMm + "mm";
  rx.cunaRearfoot = "0";
  rx.cunaRearfootTipo = "Ninguna";

  // C.4: Copa profunda
  rx.copaProfundidadMm = round(14 * f);
  rx.copaTalon = "Profunda";

  // C.5: cutOut=false
  rx.cutOut = false;

  // Material según Silfverskiold
  if (testSilfverskiold === "gastrocnemio") {
    rx.material = "EVA Doble Densidad (Shore 40) con alza integrada de poliuretano expandido";
  } else if (testSilfverskiold === "gastro_soleo") {
    rx.material = "EVA Alta Densidad (Shore 50) + cuña de talón en material firmemente compresible";
  } else {
    rx.material = "EVA confort monodensidad (Shore 30-35)";
  }
  rx.materialForro = "Poron 3.0mm de celda abierta";

  // tipo y diagnostico_final
  const gradoLabel = { leve: "Leve", moderado: "Moderado", severo: "Severo" }[gradoEq] || gradoEq;
  rx.tipo = "Plantilla Equino " + gradoLabel + " — alza " + alzaMm + "mm / arco " + arcoMm + "mm";
  rx.diagnostico_final = "Pie equino no neurológico " + gradoEq + " · Silfverskiold: " + testSilfverskiold + " · DF: " + rangoDorsiflexion + "°";

  // notas
  rx.notas.push("Alza de talón " + alzaMm + "mm: relaja el tríceps sural y neutraliza la hiperpronación compensatoria.");
  rx.notas.push("Soporte de arco " + arcoMm + "mm: bloquea el colapso del mediopié en carga.");
  if (testSilfverskiold === "gastrocnemio") {
    rx.notas.push("Silfverskiold +: solo gastrocnemio afectado — estirar con rodilla extendida.");
  }
  if (testSilfverskiold === "gastro_soleo") {
    rx.notas.push("Silfverskiold −: complejo gastro-sóleo contracturado — estiramientos con rodilla flexionada esenciales.");
  }

  return rx;
}

// ══════════════════════════════════════════════════════════════════
// MÓDULO D — BARRA RETROCAPITAL (Global)
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
  barraRetrocapital, dismetriaActiva, dismetriaPie, dismetriaValor,
  testSilfverskiold, rangoDorsiflexion, dolorRetrocalcaneoSever
}) {
  if (!talla || !edad) return { error: "Talla y edad son requeridas." };
  if (edad < 1 || edad > 120) return { error: "Edad fuera de rango (1–120)." };
  if (talla < 15 || talla > 50) return { error: "Talla fuera de rango (15–50 EU)." };

  const dm = dolorMetatarsal !== undefined ? dolorMetatarsal : !!barraRetrocapital;

  let rx;
  if (tipoPie === "cavo") {
    rx = calcCavo({ grado, edad, talla, testColeman });
  } else if (tipoPie === "equino") {
    rx = calcEquino({
      edad, talla,
      testSilfverskiold: testSilfverskiold || "gastrocnemio",
      rangoDorsiflexion: rangoDorsiflexion !== undefined ? rangoDorsiflexion : 5,
      dolorRetrocalcaneoSever: !!dolorRetrocalcaneoSever,
      dolorMetatarsal: dm,
    });
    if (rx.indicacion) {
      aplicarBarra(rx, { edad, talla, grado: "moderado", tipoPie: "equino", dolorMetatarsal: dm || (rx.alzaMedidaMm > 0 && rangoDorsiflexion < 5) });
    }
    return rx;
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
