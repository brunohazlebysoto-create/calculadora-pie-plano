// Motor de Prescripción Ortopédica V2.0
// Basado en: Delphi Consensus (PMC4282733) · PTTD Staging · CART Decision Tree (PMC9566258)
// Cochrane Pediatric (PMC9561439) · Kirby Skive Technique · Coleman Block Test

export const GRADES = {
  LEVE: "leve",
  MODERADO: "moderado",
  SEVERO: "severo",
};

// ── Valores por defecto del payload de salida ──
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

  // Dismetría
  rx.alzaTalon = dismetriaActiva ? { pie: dismetriaPie, valor: dismetriaValor } : null;
  if (dismetriaActiva) {
    rx.notas.push(`Dismetría: alza de talón ${dismetriaValor} mm en pie ${dismetriaPie}.`);
  }

  // ── Paso A.0: Filtro de Rigidez Estructural ──
  if (!flexible) {
    rx.tipo = "Plantilla Acomodativa Pura (Pie Plano Rígido)";
    rx.diagnostico_final = `Pie plano rígido ${grado} — Test de Jack negativo`;
    rx.arcoSoporte = "10mm";
    rx.skiveKirbyMm = 0;
    rx.cunaRearfoot = "0";
    rx.cunaRearfootTipo = "Ninguna";
    rx.barraRetrocapitalMm = 0;
    rx.material = "EVA Blando (Shore 30) de acomodación pasiva pura";
    rx.materialForro = "Poron 3.0mm de celda abierta";
    rx.alerta = "SOPORTE PLANTAR ACOMODATIVO. El paciente presenta Pie Plano Rígido. Derivar urgentemente a Traumatología para estudio imagenológico por sospecha de coalición tarsiana o astrágalo vertical.";
    rx.derivacion = true;
    rx.controles = "Control a los 6 meses";
    rx.notas.push(
      "Pie plano rígido: plantilla estrictamente acomodativa. Corrección activa contraindicada.",
      "Derivación prioritaria a Traumatología para descarte de coalición tarsal."
    );
    rx.fundamentacion.push("PTTD Stage III / Rigid flatfoot: accommodative orthosis only (Michigan Foot Doctors)", "Delphi Consensus (PMC4282733)");
    return rx;
  }

  // ── Paso A.1: Barra Retrocapital ──
  if (dolorMetatarsal && edad >= 8) {
    rx.barraRetrocapitalPosicion = "Instalar de forma oblicua, con su margen anterior exactamente a 5–10 mm proximal a las cabezas metatarsales 2, 3 y 4.";
    if (talla < 41) {
      rx.barraRetrocapitalMm = 3.0;
      rx.notas.push("Barra retrocapital 3.0mm (talla <41): PPT o EVA blanda proximal a cabezas 2ª–4ª metatarsianas.");
    } else {
      rx.barraRetrocapitalMm = 4.5;
      rx.notas.push("Barra retrocapital 4.5mm (talla ≥41): Myolite o PPT alta densidad para evitar colapso por carga.");
    }
  }

  // ── Paso A.2: Kirby Medial Heel Skive ──
  const esForzado = peso === "obesidad";
  if (grado === GRADES.LEVE) {
    rx.skiveKirbyMm = 2;
    rx.notas.push("Kirby Skive medial 2mm: efecto cinético inicial suave en el talón medial.");
  } else if (grado === GRADES.MODERADO) {
    rx.skiveKirbyMm = 4;
    rx.notas.push("Kirby Skive medial 4mm: incremento ~15% en presión del retropié medial.");
  } else if (grado === GRADES.SEVERO || esForzado) {
    rx.skiveKirbyMm = 6;
    rx.notas.push("Kirby Skive medial 6mm: incremento ~29% en presión del retropié medial — bloquea hiperpronación severa.");
  }

  // ── Paso A.3: Matriz de decisiones por edad/talla ──

  // Sub-ruta A.3.1: Menores de 6 años — Fase Fisiológica
  if (edad < 6) {
    if (!sintomas) {
      rx.indicacion = false;
      rx.alerta = "PIE PLANO FISIOLÓGICO ASINTOMÁTICO. No se prescribe órtesis. El arco plantar se desarrollará naturalmente. Recomendar marcha descalza sobre terrenos irregulares y calzado flexible sin soporte de arco.";
      return rx;
    }
    // Sintomático < 6 años
    rx.tipo = `Plantilla de confort pediátrico (< 6 años · ${grado})`;
    rx.diagnostico_final = `Pie plano ${grado} sintomático, edad < 6 años`;
    rx.arcoSoporte = "8mm";
    rx.cunaRearfoot = "1 mm";
    rx.cunaRearfootTipo = "INTERNA";
    rx.material = "EVA Monodensidad muy blando (Shore 25–30) para priorizar la propiocepción activa";
    rx.materialForro = "Microfibra suave perforada";
    rx.fundamentacion.push("Cochrane: órtesis blandas de confort en < 6 años sintomáticos (PMC9561439)");
    return rx;
  }

  // Sub-ruta A.3.2: Talla < 41 Y edad ≥ 6
  if (talla < 41 && !esForzado) {
    if (grado === GRADES.LEVE) {
      rx.tipo = `Plantilla correctora EVA Doble Densidad (Talla <41 · Leve)`;
      rx.diagnostico_final = `Pie plano leve, talla <41, edad ${edad} años`;
      rx.arcoSoporte = "12mm";
      rx.cunaRearfoot = "3 mm";
      rx.cunaRearfootTipo = "INTERNA";
      rx.material = "EVA Doble Densidad (Base firme Shore 45 / Superficie blanda Shore 25)";
      rx.materialForro = "Microfibra perforada";
    } else if (grado === GRADES.MODERADO) {
      rx.tipo = `Plantilla correctora semirígida (Talla <41 · Moderado)`;
      rx.diagnostico_final = `Pie plano moderado, talla <41, edad ${edad} años`;
      rx.arcoSoporte = "15mm";
      rx.cunaRearfoot = "4 mm";
      rx.cunaRearfootTipo = "INTERNA";
      rx.material = "EVA Doble Densidad (Base Shore 50) o Resina termoplástica flexible 1.5mm";
      rx.materialForro = "Poron 3.0mm";
    } else {
      rx.tipo = `Plantilla correctora rígida Copa UCBL (Talla <41 · Severo)`;
      rx.diagnostico_final = `Pie plano severo, talla <41, edad ${edad} años`;
      rx.arcoSoporte = "18mm";
      rx.cunaRearfoot = "6 mm";
      rx.cunaRearfootTipo = "INTERNA";
      rx.copaTalon = "Profunda UCBL";
      rx.flancoMedial = "Paredes medial y lateral altas (copa tipo UCBL)";
      rx.material = "Nylon PA11 impreso 3D (2.25mm calibrado) o Polipropileno Homopolímero Rígido";
      rx.materialForro = "Poron 4.0mm";
      rx.notas.push("Copa UCBL: contención tridimensional del calcáneo y astrágalo. Evaluar PTTD.");
    }
    rx.fundamentacion.push("CART Decision Tree: soporte por grado en talla pediátrica (PMC9566258)", "Delphi Consensus: cuña de retropié varo calibrada al grado (PMC4282733)");
    return rx;
  }

  // Sub-ruta A.3.3: Talla ≥ 41 O peso obesidad
  if (grado === GRADES.LEVE) {
    rx.tipo = `Plantilla correctora polipropileno (Talla ≥41 · Leve)`;
    rx.diagnostico_final = `Pie plano leve, talla ≥41${esForzado ? " / obesidad" : ""}`;
    rx.arcoSoporte = "15mm";
    rx.cunaRearfoot = "5 mm";
    rx.cunaRearfootTipo = "INTERNA";
    rx.material = "Polipropileno 3.0mm o Nylon PA11 impreso 3D con flexión reactiva";
    rx.materialForro = "Poron 3.0mm";
  } else if (grado === GRADES.MODERADO) {
    rx.tipo = `Plantilla correctora Nylon PA11 (Talla ≥41 · Moderado)`;
    rx.diagnostico_final = `Pie plano moderado, talla ≥41${esForzado ? " / obesidad" : ""}`;
    rx.arcoSoporte = "18mm";
    rx.cunaRearfoot = "6 mm";
    rx.cunaRearfootTipo = "INTERNA";
    rx.material = "Nylon PA11 calibrado 3.0mm o Polipropileno 4.0mm";
    rx.materialForro = "Poron 4.0mm";
  } else {
    rx.tipo = `Plantilla Copa UCBL rígida (Talla ≥41 · Severo)`;
    rx.diagnostico_final = `Pie plano severo, talla ≥41${esForzado ? " / obesidad" : ""}`;
    rx.arcoSoporte = "20mm";
    rx.cunaRearfoot = "8 mm";
    rx.cunaRearfootTipo = "INTERNA";
    rx.copaTalon = "Profunda UCBL";
    rx.flancoMedial = "Paredes medial y lateral altas (UCBL)";
    rx.material = "Polipropileno rígido 5.0mm o Composito de Fibra de Carbono de alto rebote";
    rx.materialForro = "Poron 4.0mm bicapa";
    rx.notas.push("Máxima corrección. Copa UCBL con paredes altas para control total del retropié valgo severo.");
  }
  rx.fundamentacion.push(
    "Escalamiento biomecánico: talla ≥41 requiere mayor flecha de arco y cuña para mantener la palanca correctora.",
    "Delphi Consensus (PMC4282733)"
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

  // Paso B.0: Filtro Neurológico
  if (edad < 4) {
    rx.indicacion = false;
    rx.alerta = "ALERTA SÍNDROME NEUROMUSCULAR. El pie cavo verdadero en menores de 4 años posee un 67% de correlación con neuropatías (ej. Charcot-Marie-Tooth) o disrafismos espinales. Derivación obligatoria y urgente a Neurología y Traumatología Infantil. Contraindicadas órtesis correctoras rígidas.";
    rx.derivacion = true;
    return rx;
  }

  const flexible = testColeman === "positivo";

  // Paso B.1: Cinemática del retropié (Coleman)
  if (flexible) {
    rx.cutOut = true;
    rx.cunaRearfootTipo = "EXTERNA";
    rx.notas.push(
      "Coleman +: Retropié flexible. Cut-out bajo 1er radio: corte ovalado en placa rígida rellenado con Poron blando 3mm para liberar descenso de 1ª cabeza metatarsiana y desactivar vector de varo.",
      "Cuña EXTERNA: valgizante lateral 5°–10° para expandir base de sustentación y disipar cargas de columna lateral."
    );
  } else {
    rx.cutOut = false;
    rx.cunaRearfootTipo = "INTERNA";
    rx.notas.push(
      "Coleman −: Retropié rígido estructurado. Sin cut-out (no existe movilidad articular en el complejo tarsal).",
      "Cuña INTERNA: acomodativa de contacto total para rellenar el vacío anatómico y disipar presiones."
    );
  }

  // Paso B.2: Barra Retrocapital (cavo)
  if (edad >= 8 && (grado === GRADES.MODERADO || grado === GRADES.SEVERO)) {
    rx.barraRetrocapitalPosicion = "Margen anterior oblicuo exactamente a 5mm proximal a cabezas metatarsales. Prohibida su colocación directa debajo de la articulación.";
    if (talla < 41) {
      rx.barraRetrocapitalMm = 3.0;
      rx.notas.push("Barra retrocapital 3.0mm (talla <41): Poron o PPT Shore 40.");
    } else {
      rx.barraRetrocapitalMm = 4.5;
      rx.notas.push("Barra retrocapital 4.5mm (talla ≥41): Poron o PPT firme Shore 40.");
    }
  }

  const gradoLabel = { leve: "Leve", moderado: "Moderado", severo: "Severo" }[grado];
  const colemanLabel = flexible ? "Flexible (Coleman +)" : "Rígido (Coleman −)";

  // Paso B.3: Matriz de decisiones

  // Sub-ruta B.3.1: Talla < 41 Y edad 4–11
  if (talla < 41 && edad <= 11) {
    if (grado === GRADES.LEVE) {
      rx.tipo = `Plantilla cavo pediátrica blanda (${gradoLabel} · ${colemanLabel})`;
      rx.diagnostico_final = `Pie cavo ${gradoLabel.toLowerCase()} pediátrico, talla <41`;
      rx.arcoSoporte = "15mm";
      rx.cunaRearfoot = flexible ? "2 mm Ext" : "0";
      rx.material = "EVA blando Monodensidad (Shore 30–35)";
      rx.materialForro = "Poron 3.0mm de celda abierta para amortiguación profunda";
    } else if (grado === GRADES.MODERADO) {
      rx.tipo = `Plantilla cavo pediátrica media (${gradoLabel} · ${colemanLabel})`;
      rx.diagnostico_final = `Pie cavo ${gradoLabel.toLowerCase()} pediátrico, talla <41`;
      rx.arcoSoporte = "18mm";
      rx.cunaRearfoot = flexible ? "3 mm Ext" : "0";
      rx.material = "EVA densidad media (Shore 40) para soporte elástico";
      rx.materialForro = "PPT / Poron 3.0mm";
    } else {
      rx.tipo = `Plantilla cavo pediátrica reforzada (${gradoLabel} · ${colemanLabel})`;
      rx.diagnostico_final = `Pie cavo ${gradoLabel.toLowerCase()} pediátrico, talla <41`;
      rx.arcoSoporte = "20mm";
      rx.cunaRearfoot = flexible ? "4 mm Ext" : "2 mm Int";
      rx.material = "EVA Doble Densidad con base dura y superficie viscoelástica";
      rx.materialForro = "Poron / PPT 4.0mm de espesor total";
    }
    rx.fundamentacion.push("Pie cavo pediátrico: soporte arco lateral + cuña según Coleman (PMC9566258)");
    return rx;
  }

  // Sub-ruta B.3.2: Talla ≥ 41 O edad ≥ 12
  if (grado === GRADES.LEVE) {
    rx.tipo = `Plantilla cavo adulto resina flexible (${gradoLabel} · ${colemanLabel})`;
    rx.diagnostico_final = `Pie cavo ${gradoLabel.toLowerCase()}, talla ≥41`;
    rx.arcoSoporte = "18mm";
    rx.cunaRearfoot = flexible ? "3 mm Ext" : "0";
    rx.material = "Resina Flexible termomoldeable (Flux) o Nylon PA11 de alta flexibilidad";
    rx.materialForro = "PPT / Poron 3.0mm";
  } else if (grado === GRADES.MODERADO) {
    rx.tipo = `Plantilla cavo adulto EVA alta densidad (${gradoLabel} · ${colemanLabel})`;
    rx.diagnostico_final = `Pie cavo ${gradoLabel.toLowerCase()}, talla ≥41`;
    rx.arcoSoporte = "22mm";
    rx.cunaRearfoot = flexible ? "4 mm Ext" : "2 mm Int";
    rx.material = "EVA Alta Densidad (Shore 45–50) o Resina con espesor controlado para flexión dinámica";
    rx.materialForro = "Poron técnico 4.0mm";
  } else {
    rx.tipo = `Plantilla cavo adulto Nylon PA11 3D (${gradoLabel} · ${colemanLabel})`;
    rx.diagnostico_final = `Pie cavo ${gradoLabel.toLowerCase()} adulto — escaneo 3D requerido`;
    rx.arcoSoporte = "26mm";
    rx.cunaRearfoot = flexible ? "5 mm Ext" : "3 mm Int";
    rx.material = "Base técnica mixta: Nylon PA11 impreso 3D (reproducción micrométrica de la bóveda) + cuñas de EVA alemana alta amortiguación";
    rx.materialForro = "PPT o Poron 6.0mm Bicapa anterior (absorción de picos de carga ≤315 N/cm²)";
    rx.notas.push("Severo: exige toma de molde o escaneo 3D estricto de contacto total.");
  }
  rx.fundamentacion.push("Pie cavo adulto: arco lateral + Coleman + Barra Retrocapital según grado (PMC9566258)");
  return rx;
}

// ══════════════════════════════════════════════════════════════════
// API PÚBLICA
// ══════════════════════════════════════════════════════════════════

export function generatePrescription({ tipoPie = "plano", talla, edad, grado, peso = "normal", sintomas, flexible, dolorMetatarsal, testColeman, barraRetrocapital, dismetriaActiva, dismetriaPie, dismetriaValor }) {
  if (!talla || !edad) return { error: "Talla y edad son requeridas." };
  if (edad < 1 || edad > 120) return { error: "Edad fuera de rango (1–120)." };
  if (talla < 15 || talla > 50) return { error: "Talla fuera de rango (15–50 EU)." };

  if (tipoPie === "cavo") {
    return calcCavo({ grado, edad, talla, testColeman });
  }

  // Pie Plano
  if (edad < 2) return { error: "Edad mínima para prescripción: 2 años." };

  // dolorMetatarsal: si no se provee explícitamente, usar barraRetrocapital (compatibilidad)
  const dm = dolorMetatarsal !== undefined ? dolorMetatarsal : !!barraRetrocapital;

  return calcPlano({
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
