// Evidence-based flat foot insole prescription engine
// Adapted to clinical rules: Professor Notes & Delphi/Cochrane Evidence

export const GRADES = {
  LEVE: "leve",
  MODERADO: "moderado",
  SEVERO: "severo",
};

export const AGE_GROUP = {
  MENOR_4: "menor_4",
  ESCOLAR_TEMPRANO: "escolar_temprano", // 4-7
  ESCOLAR_TARDIO: "escolar_tardio",     // 8-11
  JUVENIL_ADULTO: "juvenil_adulto",     // 12+
};

function getAgeGroup(age) {
  if (age < 2) return null;
  if (age < 4) return AGE_GROUP.MENOR_4;
  if (age < 8) return AGE_GROUP.ESCOLAR_TEMPRANO;
  if (age < 12) return AGE_GROUP.ESCOLAR_TARDIO;
  return AGE_GROUP.JUVENIL_ADULTO;
}

// Grado label para notas
function gradoLabel(grado) {
  if (grado === GRADES.LEVE) return "Leve";
  if (grado === GRADES.MODERADO) return "Moderado";
  return "Severo";
}

export function generatePrescription({ talla, edad, grado, sintomas, flexible, dismetriaActiva, dismetriaPie, dismetriaValor, barraRetrocapital }) {
  if (edad < 2) {
    return { error: "Edad mínima para prescripción: 2 años." };
  }

  // Under 4 years: no prescription if asymptomatic and no dismetria
  if (edad < 4 && !sintomas && !dismetriaActiva) {
    return {
      indicacion: false,
      mensaje:
        "No se indican plantillas en menores de 4 años (pie plano fisiológico en desarrollo).",
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
      mensaje:
        "No se indican plantillas en menores de 4 años (pie plano fisiológico en desarrollo).",
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
  const rx = {
    indicacion: true,
    tipo: "",
    arcoSoporte: "",
    cunaRearfoot: "",
    cunaForefoot: "0 mm",
    flandeMedal: "",
    padMetatarsal: !!barraRetrocapital,
    material: "",
    longitud: "Longitud completa",
    notas: [],
    controles: "Control a los 3 meses",
    fundamentacion: [],
    alzaTalon: dismetriaActiva ? { pie: dismetriaPie, valor: dismetriaValor } : null,
  };

  if (dismetriaActiva) {
    rx.notas.push(`Dismetría de extremidades: Compensar con alza de talón de ${dismetriaValor} mm en la plantilla del pie ${dismetriaPie === "izquierdo" ? "Izquierdo" : "Derecho"}.`);
  }

  // Pie plano RÍGIDO → solo acomodativa, sin corrección, derivar
  if (!flexible) {
    rx.tipo = "Plantilla acomodativa (pie plano rígido)";
    rx.arcoSoporte = "10 mm";
    rx.cunaRearfoot = "0 mm";
    rx.cunaForefoot = "0 mm";
    rx.flandeMedal = "Medial y lateral altos para contención y estabilización";
    rx.material = "EVA blando con cubierta de neopreno";
    rx.notas.push(
      "Alerta: El pie plano rígido (no flexible) es una condición estructural fija.",
      "La plantilla debe ser puramente acomodativa para evitar lesiones en tejidos blandos por presión.",
      "Se requiere derivación prioritaria a traumatología o podología clínica para descartar coalición tarsal, astrágalo vertical u otras patologías rígidas."
    );
    rx.controles = "Control a los 6 meses";
    rx.fundamentacion.push(
      "PTTD Stage III / Rigid flatfoot protocol: accommodative orthosis only (Michigan Foot Doctors)",
      "Delphi Consensus: corrective posting is contraindicated in rigid foot deformities (PMC4282733)"
    );
    return rx;
  }

  // Barra retrocapital
  if (barraRetrocapital) {
    rx.notas.push("Barra retrocapital de 4 mm indicada para descargar las cabezas metatarsianas.");
  }

  // ── REGLA 1: Talla ≥ 41 (predomina sobre edad, se modula por grado) ──
  if (talla >= 41) {
    if (grado === GRADES.LEVE) {
      rx.tipo = "Plantilla correctora semirígida (Talla ≥ 41 · Grado Leve)";
      rx.arcoSoporte = "15 mm";
      rx.cunaRearfoot = "5 mm";
      rx.flandeMedal = "Medial estándar";
      rx.material = "Polipropileno con cubierta suave";
      rx.notas.push(
        "Talla ≥ 41 con grado leve: arco de 15 mm y cuña de 5 mm. Corrección moderada para evitar sobrecorrección.",
        "Relación cuña:arco 1:3 respetada."
      );
    } else if (grado === GRADES.MODERADO) {
      rx.tipo = "Plantilla correctora firme (Talla ≥ 41 · Grado Moderado)";
      rx.arcoSoporte = "18 mm";
      rx.cunaRearfoot = "6 mm";
      rx.flandeMedal = "Medial y lateral elevados";
      rx.material = "Polipropileno con cubierta suave";
      rx.notas.push(
        "Talla ≥ 41 con grado moderado: arco de 18 mm y cuña de 6 mm para compensar la mayor longitud del pie.",
        "Relación cuña:arco 1:3 respetada."
      );
    } else {
      rx.tipo = "Plantilla UCBL / Copa alta (Talla ≥ 41 · Grado Severo)";
      rx.arcoSoporte = "18 mm";
      rx.cunaRearfoot = "6 mm";
      rx.flandeMedal = "Flancos medial y lateral altos (copa tipo UCBL)";
      rx.material = "Polipropileno rígido o resina reforzada";
      rx.notas.push(
        "Talla ≥ 41 con grado severo: máxima corrección. Copa tipo UCBL con flancos altos para control total del retropié.",
        "Considerar derivación para evaluación PTTD (disfunción del tibial posterior)."
      );
    }
    rx.fundamentacion.push(
      "Escalamiento biomecánico: a mayor longitud de pie (talla ≥ 41), mayor flecha de arco y cuña para mantener la palanca correctora.",
      "Consenso Delphi: posteo retropié varo y soporte longitudinal controlan el colapso en adultos (PMC4282733)."
    );
    return rx;
  }

  // ── REGLA 2: Grupos etarios (talla < 41), MODULADOS por grado ──
  const ageGroup = getAgeGroup(edad);

  // Menor de 4 años (solo si sintomático o dismetría)
  if (ageGroup === AGE_GROUP.MENOR_4) {
    if (sintomas || dismetriaActiva) {
      if (grado === GRADES.LEVE) {
        rx.tipo = "Plantilla de confort mínimo (< 4 años · Grado Leve)";
        rx.arcoSoporte = "6 mm";
        rx.cunaRearfoot = "1 mm";
        rx.flandeMedal = "Mínimo";
        rx.material = "EVA blando 6 mm (Shore 25, baja densidad)";
        rx.notas.push(
          "Menor de 4 años con grado leve: plantilla de confort suave. Soporte mínimo para no interferir con el desarrollo fisiológico.",
          "Cuña de 1 mm simbólica; el objetivo es comodidad, no corrección."
        );
      } else if (grado === GRADES.MODERADO) {
        rx.tipo = "Plantilla de confort leve (< 4 años · Grado Moderado)";
        rx.arcoSoporte = "8 mm";
        rx.cunaRearfoot = "2 mm";
        rx.flandeMedal = "Mínimo";
        rx.material = "EVA blando 10 mm (Shore 30, baja densidad)";
        rx.notas.push(
          "Menor de 4 años con grado moderado: soporte de confort leve.",
          "Cuña de retropié mínima (2 mm) y arco bajo (8 mm) para no interferir con el desarrollo fisiológico."
        );
      } else {
        rx.tipo = "Plantilla de confort moderado (< 4 años · Grado Severo)";
        rx.arcoSoporte = "10 mm";
        rx.cunaRearfoot = "3 mm";
        rx.flandeMedal = "Bajo con contención lateral";
        rx.material = "EVA doble densidad 10 mm (base Shore 35, cubierta Shore 20)";
        rx.notas.push(
          "Menor de 4 años con grado severo: soporte aumentado pero aún blando.",
          "Cuña de 3 mm para reducir el valgo del calcáneo sin forzar el desarrollo óseo."
        );
      }
      rx.fundamentacion.push(
        "Revisión Cochrane: desaconseja plantillas rígidas correctivas en menores de 4 años.",
        "Ortesis blandas de confort indicadas ante sintomatología para reducir fatiga muscular (PMC9561439)."
      );
    } else {
      rx.indicacion = false;
    }
    return rx;
  }

  // Escolar temprano 4-7 años
  if (ageGroup === AGE_GROUP.ESCOLAR_TEMPRANO) {
    if (grado === GRADES.LEVE) {
      rx.tipo = "Plantilla correctora pediátrica suave (4-8 años · Grado Leve)";
      rx.arcoSoporte = "10 mm";
      rx.cunaRearfoot = "3 mm";
      rx.flandeMedal = "Bajo";
      rx.material = "EVA doble densidad 10 mm (base Shore 35, cubierta Shore 20)";
      rx.notas.push(
        "4-8 años grado leve: soporte de arco reducido (10 mm) y cuña suave (3 mm) para estimular sin sobrecorregir.",
        "Relación cuña:arco 1:3 respetada."
      );
    } else if (grado === GRADES.MODERADO) {
      rx.tipo = "Plantilla correctora pediátrica estándar (4-8 años · Grado Moderado)";
      rx.arcoSoporte = "12 mm";
      rx.cunaRearfoot = "4 mm";
      rx.flandeMedal = "Estándar";
      rx.material = "EVA doble densidad 10 mm (base firme + cubierta suave)";
      rx.notas.push(
        "4-8 años grado moderado: arco medial de 12 mm y cuña de 4 mm.",
        "Relación cuña:arco 1:3 para estabilizar el retropié y facilitar el desarrollo del arco."
      );
    } else {
      rx.tipo = "Plantilla correctora pediátrica reforzada (4-8 años · Grado Severo)";
      rx.arcoSoporte = "14 mm";
      rx.cunaRearfoot = "5 mm";
      rx.flandeMedal = "Medial elevado con contención lateral";
      rx.material = "EVA doble densidad 12 mm con base semirígida";
      rx.notas.push(
        "4-8 años grado severo: soporte máximo para esta edad (14 mm / 5 mm). No exceder para respetar la plasticidad del pie en crecimiento.",
        "Control frecuente para ajustar la prescripción al crecimiento del pie."
      );
      rx.controles = "Control a los 3 meses (severo)";
    }
    rx.fundamentacion.push(
      "Desarrollo dinámico del arco: en el rango 4-8 años, la cuña reduce el valgo del talón y facilita el desarrollo del arco longitudinal medial.",
      "Estudios clínicos pediátricos: las plantillas activas mejoran la alineación de la marcha en niños con pie plano sintomático (PMC9561439)."
    );
    return rx;
  }

  // Escolar tardío 8-11 años
  if (ageGroup === AGE_GROUP.ESCOLAR_TARDIO) {
    if (grado === GRADES.LEVE) {
      rx.tipo = "Plantilla correctora pediátrica leve (8-12 años · Grado Leve)";
      rx.arcoSoporte = "12 mm";
      rx.cunaRearfoot = "4 mm";
      rx.flandeMedal = "Estándar";
      rx.material = "EVA doble densidad o resina semirígida";
      rx.notas.push(
        "8-12 años grado leve: arco de 12 mm y cuña de 4 mm. Corrección moderada acorde al grado.",
        "Relación cuña:arco 1:3 respetada."
      );
    } else if (grado === GRADES.MODERADO) {
      rx.tipo = "Plantilla correctora pediátrica estándar (8-12 años · Grado Moderado)";
      rx.arcoSoporte = "15 mm";
      rx.cunaRearfoot = "5 mm";
      rx.flandeMedal = "Medial elevado";
      rx.material = "EVA doble densidad 10 mm o resina semirígida";
      rx.notas.push(
        "8-12 años grado moderado: arco de 15 mm y cuña de 5 mm.",
        "Relación cuña:arco 1:3 respetada."
      );
    } else {
      rx.tipo = "Plantilla correctora rígida (8-12 años · Grado Severo)";
      rx.arcoSoporte = "18 mm";
      rx.cunaRearfoot = "6 mm";
      rx.flandeMedal = "Flancos medial y lateral altos (copa tipo UCBL)";
      rx.material = "Resina semirígida o polipropileno delgado";
      rx.notas.push(
        "8-12 años grado severo: máxima corrección para el grupo escolar. Copa tipo UCBL con flancos altos.",
        "Relación cuña:arco 1:3. Control trimestral por crecimiento activo."
      );
      rx.controles = "Control a los 3 meses (severo)";
    }
    rx.fundamentacion.push(
      "Osificación tarsal: en el rango 8-12 años el pie es menos plástico. La cuña y soporte deben calibrarse al grado de colapso para evitar sobrecorrección.",
      "Consenso Delphi: cuña de retropié varo modula el control de pronación según gravedad (PMC4282733)."
    );
    return rx;
  }

  // ── REGLA 3: Juvenil/Adulto ≥ 12 años (talla < 41) ──
  if (grado === GRADES.LEVE) {
    rx.tipo = "Plantilla correctora semirígida (≥ 12 años · Grado Leve)";
    rx.arcoSoporte = "12 mm";
    rx.cunaRearfoot = "4 mm";
    rx.flandeMedal = "Estándar";
    rx.material = "Polipropileno con cubierta suave";
    rx.notas.push(
      "Mayor de 12 años con pie plano leve y talla < 41: arco de 12 mm y cuña de 4 mm.",
      "Relación cuña:arco 1:3."
    );
    rx.fundamentacion.push(
      "Control de pronación leve: soporte de 12 mm y cuña de 4 mm proveen estabilización básica sin sobrecorregir.",
      "CART algorithm decision tree: mild flatfoot corrective orthosis (PMC9566258)"
    );
  } else if (grado === GRADES.MODERADO) {
    rx.tipo = "Plantilla correctora semirígida a medida (≥ 12 años · Grado Moderado)";
    rx.arcoSoporte = "15 mm";
    rx.cunaRearfoot = "5 mm";
    rx.flandeMedal = "Medial elevado";
    rx.material = "Polipropileno con cubierta suave";
    rx.notas.push(
      "Mayor de 12 años con pie plano moderado y talla < 41: arco de 15 mm y cuña de 5 mm.",
      "Relación cuña:arco 1:3."
    );
    rx.fundamentacion.push(
      "Control intermedio: la cuña de 5 mm reduce el valgo del calcáneo y la tensión sobre el tendón del tibial posterior.",
      "Stage I/II PTTD orthotic design guidelines (ProLab Orthotics, 2024)"
    );
  } else {
    rx.tipo = "Plantilla correctora rígida a medida (≥ 12 años · Grado Severo)";
    rx.arcoSoporte = "18 mm";
    rx.cunaRearfoot = "6 mm";
    rx.flandeMedal = "Flancos medial y lateral altos (control total)";
    rx.material = "Polipropileno rígido o resina reforzada";
    rx.notas.push(
      "Mayor de 12 años con pie plano severo y talla < 41: arco de 18 mm y cuña de 6 mm.",
      "Copa tipo UCBL con flancos altos para contención y control de retropié valgo severo."
    );
    rx.fundamentacion.push(
      "Control rígido de deformidades severas: cuña de 6 mm y arco de 18 mm es el estándar para pie plano severo flexible (copa UCBL).",
      "UCBL design criteria: deep heel cup and high medial/lateral flanges (FootFoot Care, 2024)"
    );
  }

  return rx;
}
