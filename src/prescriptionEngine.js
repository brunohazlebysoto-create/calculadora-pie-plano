// Motor de Prescripción Paramétrico — Versión Final Unificada
// Basado en: Delphi Consensus (PMC4282733) · PTTD Staging · CART Decision Tree (PMC9566258) · Cochrane Pediatric (PMC9561439)

export const GRADES = {
  LEVE: "leve",
  MODERADO: "moderado",
  SEVERO: "severo",
};

export const AGE_GROUP = {
  MENOR_4: "menor_4",
  ESCOLAR_TEMPRANO: "escolar_temprano", // 4–7
  ESCOLAR_TARDIO: "escolar_tardio",     // 8–11
  JUVENIL_ADULTO: "juvenil_adulto",     // 12+
};

function getAgeGroup(age) {
  if (age < 2) return null;
  if (age < 4) return AGE_GROUP.MENOR_4;
  if (age < 8) return AGE_GROUP.ESCOLAR_TEMPRANO;
  if (age < 12) return AGE_GROUP.ESCOLAR_TARDIO;
  return AGE_GROUP.JUVENIL_ADULTO;
}

// Calcula la altura de la barra retrocapital según protocolo:
// - Edad < 8 → 0 mm siempre (bloqueado, interferencia con desarrollo del antepié)
// - Edad ≥ 8 y talla < 41 → 3 mm (EVA Shore 30)
// - Edad ≥ 8 y talla ≥ 41 → 4 mm leve/moderado, 5 mm severo (EVA densidad media)
// Retorna { mm: number, bloqueado: boolean, razon: string }
function calcBarraRetrocapital(barraRetrocapitalSolicitada, edad, talla, grado) {
  if (!barraRetrocapitalSolicitada) {
    return { mm: 0, bloqueado: false, razon: "" };
  }
  if (edad < 8) {
    return {
      mm: 0,
      bloqueado: true,
      razon: "Barra retrocapital no indicada en menores de 8 años: el antepié dinámico y elástico no debe ser bloqueado pasivamente. Se omite aunque fue solicitada.",
    };
  }
  if (talla >= 41) {
    const mm = grado === GRADES.SEVERO ? 5 : 4;
    return {
      mm,
      bloqueado: false,
      razon: `Barra retrocapital ${mm} mm (talla ≥ 41): EVA densidad media o Poron técnico, proximal a cabezas 2ª–4ª metatarsianas.`,
    };
  }
  return {
    mm: 3,
    bloqueado: false,
    razon: "Barra retrocapital 3 mm (talla < 41): EVA blando Shore 30, inmediatamente proximal a cabezas metatarsianas 2ª–4ª.",
  };
}

export function generatePrescription({ talla, edad, grado, sintomas, flexible, dismetriaActiva, dismetriaPie, dismetriaValor, barraRetrocapital }) {
  if (edad < 2) {
    return { error: "Edad mínima para prescripción: 2 años." };
  }

  // Menor de 4 años asintomático y sin dismetría → no indicar
  if (edad < 4 && !sintomas && !dismetriaActiva) {
    return {
      indicacion: false,
      mensaje: "No se indican plantillas en menores de 4 años asintomáticos (pie plano fisiológico en desarrollo).",
      recomendaciones: [
        "Estimular marcha descalza en superficies naturales (arena, pasto).",
        "Evitar calzado con suela rígida o soporte de arco prefabricado.",
        "Control anual para evaluar el desarrollo del arco plantar.",
      ],
    };
  }

  const rx = buildRx({ talla, edad, grado, sintomas, flexible, dismetriaActiva, dismetriaPie, dismetriaValor, barraRetrocapital });

  if (!rx.indicacion) {
    return {
      indicacion: false,
      mensaje: "No se indican plantillas en menores de 4 años asintomáticos (pie plano fisiológico en desarrollo).",
      recomendaciones: [
        "Estimular marcha descalza en superficies naturales (arena, pasto).",
        "Evitar calzado con suela rígida o soporte de arco prefabricado.",
        "Control anual para evaluar el desarrollo del arco plantar.",
      ],
    };
  }

  return rx;
}

function buildRx({ talla, edad, grado, sintomas, flexible, dismetriaActiva, dismetriaPie, dismetriaValor, barraRetrocapital }) {
  const barra = calcBarraRetrocapital(barraRetrocapital, edad, talla, grado);

  const rx = {
    indicacion: true,
    tipo: "",
    arcoSoporte: "",
    cunaRearfoot: "",
    cunaForefoot: "0 mm",
    flandeMedal: "",
    barraRetrocapitalMm: barra.mm,  // 0 = sin barra
    material: "",
    longitud: "Longitud completa",
    notas: [],
    controles: "Control a los 3 meses",
    fundamentacion: [],
    alzaTalon: dismetriaActiva ? { pie: dismetriaPie, valor: dismetriaValor } : null,
  };

  // Dismetría
  if (dismetriaActiva) {
    rx.notas.push(`Dismetría de extremidades: alza de talón de ${dismetriaValor} mm en la plantilla del pie ${dismetriaPie === "izquierdo" ? "izquierdo" : "derecho"}.`);
  }

  // Aviso si la barra fue solicitada pero bloqueada
  if (barra.bloqueado) {
    rx.notas.push(`⚠️ ${barra.razon}`);
  } else if (barra.mm > 0) {
    rx.notas.push(barra.razon);
  }

  // ── FILTRO 0: Pie plano RÍGIDO ──
  // Test de Jack (-): sin arco en puntillas → solo acomodativa, derivar
  if (!flexible) {
    rx.tipo = "Plantilla acomodativa (pie plano rígido)";
    rx.arcoSoporte = "10 mm";
    rx.cunaRearfoot = "0 mm";
    rx.cunaForefoot = "0 mm";
    rx.flandeMedal = "Contención medial y lateral alta";
    rx.material = "EVA blando con cubierta de neopreno";
    rx.barraRetrocapitalMm = 0; // contraindicada en pie rígido salvo evaluación individual
    rx.notas.push(
      "Pie plano rígido: plantilla estrictamente acomodativa. Corrección activa contraindicada (riesgo de cizallamiento en tarso bloqueado).",
      "Derivación prioritaria a Traumatología para estudio de coalición tarsal o astrágalo vertical congénito."
    );
    rx.controles = "Control a los 6 meses";
    rx.fundamentacion.push(
      "PTTD Stage III / Rigid flatfoot: accommodative orthosis only (Michigan Foot Doctors)",
      "Delphi Consensus: corrective posting contraindicado en pie rígido (PMC4282733)"
    );
    return rx;
  }

  // ── REGLA 1: Talla ≥ 41 (predomina sobre la edad) ──
  if (talla >= 41) {
    if (grado === GRADES.LEVE) {
      rx.tipo = "Plantilla correctora semirígida (Talla ≥ 41 · Grado Leve)";
      rx.arcoSoporte = "15 mm";
      rx.cunaRearfoot = "5 mm";
      rx.flandeMedal = "Medial estándar";
      rx.material = "Polipropileno + cubierta suave amortiguadora";
      rx.notas.push("Talla ≥ 41 grado leve: arco 15 mm / cuña 5 mm. Relación 1:3 respetada.");
    } else if (grado === GRADES.MODERADO) {
      rx.tipo = "Plantilla correctora firme (Talla ≥ 41 · Grado Moderado)";
      rx.arcoSoporte = "18 mm";
      rx.cunaRearfoot = "6 mm";
      rx.flandeMedal = "Medial y lateral elevados";
      rx.material = "Polipropileno + cubierta suave amortiguadora";
      rx.notas.push("Talla ≥ 41 grado moderado: arco 18 mm / cuña 6 mm. Relación 1:3 respetada.");
    } else {
      rx.tipo = "Plantilla Copa UCBL (Talla ≥ 41 · Grado Severo)";
      rx.arcoSoporte = "18 mm";
      rx.cunaRearfoot = "6 mm";
      rx.flandeMedal = "Paredes medial y lateral altas (copa tipo UCBL)";
      rx.material = "Polipropileno rígido + Copa UCBL";
      rx.notas.push(
        "Talla ≥ 41 grado severo: máxima corrección. Copa UCBL con paredes altas para control total del retropié.",
        "Considerar evaluación de PTTD (disfunción del tibial posterior)."
      );
    }
    rx.fundamentacion.push(
      "Escalamiento biomecánico: talla ≥ 41 requiere mayor flecha de arco y cuña para mantener la palanca correctora.",
      "Delphi Consensus: posteo retropié varo y soporte longitudinal en adultos (PMC4282733)."
    );
    return rx;
  }

  // ── REGLA 2: Talla < 41, estratificado por grupo etario y grado ──
  const ageGroup = getAgeGroup(edad);

  // Grupo A: Menores de 4 años (solo si sintomático o dismetría)
  if (ageGroup === AGE_GROUP.MENOR_4) {
    if (sintomas || dismetriaActiva) {
      if (grado === GRADES.LEVE) {
        rx.tipo = "Plantilla de confort mínimo (< 4 años · Grado Leve)";
        rx.arcoSoporte = "6 mm";
        rx.cunaRearfoot = "1 mm";
        rx.flandeMedal = "Mínimo";
        rx.material = "EVA blando Shore 25";
        rx.notas.push("< 4 años grado leve: confort suave. Objetivo: comodidad, no corrección activa.");
      } else if (grado === GRADES.MODERADO) {
        rx.tipo = "Plantilla de confort leve (< 4 años · Grado Moderado)";
        rx.arcoSoporte = "8 mm";
        rx.cunaRearfoot = "2 mm";
        rx.flandeMedal = "Mínimo";
        rx.material = "EVA blando Shore 30";
        rx.notas.push("< 4 años grado moderado: arco 8 mm / cuña 2 mm. No interferir con el desarrollo fisiológico.");
      } else {
        rx.tipo = "Plantilla de confort moderado (< 4 años · Grado Severo)";
        rx.arcoSoporte = "10 mm";
        rx.cunaRearfoot = "3 mm";
        rx.flandeMedal = "Bajo con contención lateral";
        rx.material = "EVA doble densidad";
        rx.notas.push("< 4 años grado severo: soporte aumentado pero blando. Cuña 3 mm para reducir el valgo del calcáneo sin forzar el desarrollo óseo.");
      }
      rx.fundamentacion.push(
        "Cochrane: desaconseja plantillas rígidas correctivas en < 4 años.",
        "Ortesis blandas de confort indicadas ante sintomatología evidente (PMC9561439)."
      );
    } else {
      rx.indicacion = false;
    }
    return rx;
  }

  // Grupo B: 4–7 años (ventana de desarrollo activo — barra bloqueada)
  if (ageGroup === AGE_GROUP.ESCOLAR_TEMPRANO) {
    if (grado === GRADES.LEVE) {
      rx.tipo = "Plantilla correctora pediátrica suave (4–8 años · Grado Leve)";
      rx.arcoSoporte = "10 mm";
      rx.cunaRearfoot = "3 mm";
      rx.flandeMedal = "Bajo";
      rx.material = "EVA doble densidad";
      rx.notas.push("4–8 años grado leve: arco 10 mm / cuña 3 mm. Relación 1:3. Estimulación sin sobrecorrección.");
    } else if (grado === GRADES.MODERADO) {
      rx.tipo = "Plantilla correctora pediátrica estándar (4–8 años · Grado Moderado)";
      rx.arcoSoporte = "12 mm";
      rx.cunaRearfoot = "4 mm";
      rx.flandeMedal = "Estándar";
      rx.material = "EVA doble densidad";
      rx.notas.push("4–8 años grado moderado: arco 12 mm / cuña 4 mm. Relación 1:3. Favorece el desarrollo del arco longitudinal medial.");
    } else {
      rx.tipo = "Plantilla correctora pediátrica reforzada (4–8 años · Grado Severo)";
      rx.arcoSoporte = "14 mm";
      rx.cunaRearfoot = "5 mm";
      rx.flandeMedal = "Medial elevado con contención lateral";
      rx.material = "EVA doble densidad + base semirígida de refuerzo";
      rx.notas.push(
        "4–8 años grado severo: arco 14 mm / cuña 5 mm (máximo para esta edad). Respetar la plasticidad del pie en crecimiento.",
        "Control cada 3 meses por crecimiento activo."
      );
      rx.controles = "Control a los 3 meses";
    }
    rx.fundamentacion.push(
      "4–8 años: cuña reduce valgo del talón y facilita el desarrollo del arco longitudinal medial.",
      "Plantillas activas mejoran la alineación de la marcha en niños con pie plano sintomático (PMC9561439)."
    );
    return rx;
  }

  // Grupo C: 8–11 años (transición y maduración ósea — barra disponible según criterio)
  if (ageGroup === AGE_GROUP.ESCOLAR_TARDIO) {
    if (grado === GRADES.LEVE) {
      rx.tipo = "Plantilla correctora pediátrica (8–12 años · Grado Leve)";
      rx.arcoSoporte = "12 mm";
      rx.cunaRearfoot = "4 mm";
      rx.flandeMedal = "Estándar";
      rx.material = "EVA doble densidad o resina semirígida";
      rx.notas.push("8–12 años grado leve: arco 12 mm / cuña 4 mm. Relación 1:3.");
    } else if (grado === GRADES.MODERADO) {
      rx.tipo = "Plantilla correctora pediátrica (8–12 años · Grado Moderado)";
      rx.arcoSoporte = "15 mm";
      rx.cunaRearfoot = "5 mm";
      rx.flandeMedal = "Medial elevado";
      rx.material = "EVA doble densidad o resina semirígida";
      rx.notas.push("8–12 años grado moderado: arco 15 mm / cuña 5 mm. Relación 1:3.");
    } else {
      rx.tipo = "Plantilla correctora rígida (8–12 años · Grado Severo)";
      rx.arcoSoporte = "18 mm";
      rx.cunaRearfoot = "6 mm";
      rx.flandeMedal = "Paredes medial y lateral altas (copa tipo UCBL)";
      rx.material = "Resina semirígida + Copa UCBL";
      rx.notas.push(
        "8–12 años grado severo: arco 18 mm / cuña 6 mm. Copa UCBL con paredes altas.",
        "Control trimestral por crecimiento activo."
      );
      rx.controles = "Control a los 3 meses";
    }
    rx.fundamentacion.push(
      "8–12 años: el pie es menos plástico. Dosificar cuña y arco según grado para evitar sobrecorrección.",
      "Delphi Consensus: cuña de retropié varo calibrada al grado de colapso (PMC4282733)."
    );
    return rx;
  }

  // Grupo D: 12 años o más (talla < 41)
  if (grado === GRADES.LEVE) {
    rx.tipo = "Plantilla correctora semirígida (≥ 12 años · Grado Leve)";
    rx.arcoSoporte = "12 mm";
    rx.cunaRearfoot = "4 mm";
    rx.flandeMedal = "Estándar";
    rx.material = "Polipropileno + cubierta suave amortiguadora";
    rx.notas.push("≥ 12 años grado leve: arco 12 mm / cuña 4 mm. Relación 1:3.");
    rx.fundamentacion.push(
      "Control de pronación leve: 12 mm + cuña 4 mm sin sobrecorregir.",
      "CART algorithm: mild flatfoot corrective orthosis (PMC9566258)"
    );
  } else if (grado === GRADES.MODERADO) {
    rx.tipo = "Plantilla correctora semirígida a medida (≥ 12 años · Grado Moderado)";
    rx.arcoSoporte = "15 mm";
    rx.cunaRearfoot = "5 mm";
    rx.flandeMedal = "Medial elevado";
    rx.material = "Polipropileno + cubierta suave amortiguadora";
    rx.notas.push("≥ 12 años grado moderado: arco 15 mm / cuña 5 mm. Relación 1:3.");
    rx.fundamentacion.push(
      "Cuña 5 mm reduce valgo del calcáneo y tensión sobre el tibial posterior.",
      "PTTD Stage I/II orthotic design guidelines (ProLab Orthotics, 2024)"
    );
  } else {
    rx.tipo = "Plantilla correctora rígida a medida (≥ 12 años · Grado Severo)";
    rx.arcoSoporte = "18 mm";
    rx.cunaRearfoot = "6 mm";
    rx.flandeMedal = "Paredes medial y lateral altas (control total)";
    rx.material = "Polipropileno rígido + Copa UCBL";
    rx.notas.push(
      "≥ 12 años grado severo: arco 18 mm / cuña 6 mm. Copa UCBL con paredes altas para control del retropié valgo severo."
    );
    rx.fundamentacion.push(
      "Copa UCBL: estándar para pie plano severo flexible.",
      "UCBL design criteria: deep heel cup and high medial/lateral flanges (FootFoot Care, 2024)"
    );
  }

  return rx;
}
