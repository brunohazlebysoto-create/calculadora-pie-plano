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

export function generatePrescription({ talla, edad, grado, sintomas, flexible, dismetriaActiva, dismetriaPie, dismetriaValor, barraRetrocapital }) {
  if (edad < 2) {
    return { error: "Edad mínima para prescripción: 2 años." };
  }

  // Under 4 years: no prescription if asymptomatic
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
    rx.notes = rx.notas; // alias just in case
    rx.notas.push(`Dismetría de extremidades: Compensar con alza de talón de ${dismetriaValor} mm en la plantilla del pie ${dismetriaPie === "izquierdo" ? "Izquierdo" : "Derecho"}.`);
  }

  // Rigid non-flexible flat foot -> accommodative only, refer
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

  // Barra retrocapital: 4 mm if selected
  if (barraRetrocapital) {
    rx.notas.push("Barra retrocapital de 4 mm indicada para descargar las cabezas metatarsianas.");
  }

  // Rule 1: Talla >= 41 (independent of age)
  if (talla >= 41) {
    rx.tipo = "Plantilla correctora de soporte firme (talla >= 41)";
    rx.arcoSoporte = "18 mm";
    rx.cunaRearfoot = "6 mm";
    rx.flandeMedal = "Medial y lateral elevados";
    rx.material = "Polipropileno con cubierta suave";
    rx.notas.push(
      "Paciente con pie sobre talla 41: se prescribe arco medial de 18 mm y cuña de retropié de 6 mm para compensar la mayor longitud del pie.",
      "Se mantiene la relación biomecánica 1:3 entre cuña y arco medial."
    );
    rx.fundamentacion.push(
      "Escalamiento biomecánico: a mayor longitud del pie (talla >= 41), se requiere mayor flecha de arco (18 mm) y cuña (6 mm) para mantener la misma palanca correctora y dosificación angular.",
      "Consenso Delphi: el posteo retropié varo y soporte longitudinal controlan el colapso del arco en adultos (PMC4282733)."
    );
    return rx;
  }

  // Rule 2: Age groups (for talla < 41)
  const ageGroup = getAgeGroup(edad);

  if (ageGroup === AGE_GROUP.MENOR_4) {
    if (sintomas || dismetriaActiva) {
      rx.tipo = "Plantilla de confort leve (menor de 4 años)";
      rx.arcoSoporte = "8 mm";
      rx.cunaRearfoot = "2 mm";
      rx.flandeMedal = "Mínimo";
      rx.material = "EVA blando 10 mm (baja densidad, Shore 30)";
      rx.notas.push(
        "Menor de 4 años sintomático o padres muy insistentes: se prescribe soporte de confort leve.",
        "Se utiliza una cuña de retropié mínima (2 mm) y soporte de arco bajo (8 mm) para no interferir con el desarrollo fisiológico natural del pie."
      );
      rx.fundamentacion.push(
        "Revisión Cochrane: desaconseja el uso de plantillas rígidas correctivas en menores de 4 años.",
        "El uso de ortesis blandas de confort leve está indicado ante sintomatología evidente para reducir la fatiga muscular y tranquilizar a la familia (PMC9561439)."
      );
    } else {
      rx.indicacion = false;
    }
    return rx;
  }

  if (ageGroup === AGE_GROUP.ESCOLAR_TEMPRANO) {
    rx.tipo = "Plantilla correctora pediátrica (4 a 8 años)";
    rx.arcoSoporte = "12 mm";
    rx.cunaRearfoot = "4 mm";
    rx.flandeMedal = "Estándar";
    rx.material = "EVA 10 mm doble densidad (base firme + cubierta suave)";
    rx.notas.push(
      "Notas del Profesor (4-8 años): arco medial de 12 mm y cuña medial de talón (retropié) de 4 mm.",
      "Relación cuña:arco respetada en proporción 1:3 para estabilizar el retropié."
    );
    rx.fundamentacion.push(
      "Desarrollo dinámico del arco: en el rango de 4 a 8 años, la cuña de 4 mm reduce el valgo del talón y facilita el desarrollo del arco longitudinal medial.",
      "Estudios clínicos pediátricos demuestran que las plantillas activas mejoran la alineación de la marcha en niños con pie plano sintomático (PMC9561439)."
    );
    return rx;
  }

  if (ageGroup === AGE_GROUP.ESCOLAR_TARDIO) {
    rx.tipo = "Plantilla correctora pediátrica (8 a 12 años)";
    rx.arcoSoporte = "15 mm";
    rx.cunaRearfoot = "5 mm";
    rx.flandeMedal = "Medial elevado";
    rx.material = "EVA 10 mm doble densidad o resina semirígida";
    rx.notas.push(
      "Notas del Profesor (8-12 años): arco medial de 15 mm y cuña medial de talón (retropié) de 5 mm.",
      "Relación cuña:arco respetada en proporción 1:3."
    );
    rx.fundamentacion.push(
      "Osificación tarsal: en el rango de 8 a 12 años el pie es menos plástico. La cuña de 5 mm y soporte de 15 mm proveen la fuerza de reacción del suelo necesaria para el control del retropié.",
      "Consenso Delphi: el uso de cuña de retropié varo de 5 mm es efectivo para controlar la pronación y el talón valgo en escolares tardíos (PMC4282733)."
    );
    return rx;
  }

  // Rule 3: Age >= 12 and Talla < 41 (Juvenil/Adulto)
  if (grado === GRADES.LEVE) {
    rx.tipo = "Plantilla correctora semirígida (Grado Leve)";
    rx.arcoSoporte = "12 mm";
    rx.cunaRearfoot = "4 mm";
    rx.flandeMedal = "Estándar";
    rx.material = "Polipropileno con cubierta suave";
    rx.notas.push(
      "Paciente mayor de 12 años con pie plano leve y talla < 41: se prescribe arco medial de 12 mm y cuña de retropié de 4 mm.",
      "Relación cuña:arco respetada en proporción 1:3."
    );
    rx.fundamentacion.push(
      "Control de pronación leve: soporte de 12 mm y cuña de 4 mm proveen estabilización básica sin sobrecorregir.",
      "CART algorithm decision tree: mild flatfoot corrective orthosis (PMC9566258)"
    );
  } else if (grado === GRADES.MODERADO) {
    rx.tipo = "Plantilla correctora semirígida a medida (Grado Moderado)";
    rx.arcoSoporte = "15 mm";
    rx.cunaRearfoot = "5 mm";
    rx.flandeMedal = "Medial elevado";
    rx.material = "Polipropileno con cubierta suave";
    rx.notas.push(
      "Paciente mayor de 12 años con pie plano moderado y talla < 41: se prescribe arco medial de 15 mm y cuña de retropié de 5 mm.",
      "Relación cuña:arco respetada en proporción 1:3."
    );
    rx.fundamentacion.push(
      "Control intermedio: la cuña de 5 mm reduce el valgo del calcáneo y la tensión sobre el tendón del tibial posterior.",
      "Stage I/II PTTD orthotic design guidelines (ProLab Orthotics, 2024)"
    );
  } else {
    rx.tipo = "Plantilla correctora rígida a medida (Grado Severo)";
    rx.arcoSoporte = "18 mm";
    rx.cunaRearfoot = "6 mm";
    rx.flandeMedal = "Flancos medial y lateral altos (control total)";
    rx.material = "Polipropileno rígido o resina reforzada";
    rx.notas.push(
      "Paciente mayor de 12 años con pie plano severo y talla < 41: se prescribe arco medial of 18 mm y cuña de retropié de 6 mm.",
      "Se requiere flanco medial y lateral elevados para contención y control de retropié valgo severo."
    );
    rx.fundamentacion.push(
      "Control rígido de deformidades severas: el uso de cuñas de 6 mm y soporte de arco de 18 mm es el estándar de oro para pie plano severo flexible (copa tipo UCBL).",
      "UCBL design criteria: deep heel cup and high medial/lateral flanges (FootFoot Care, 2024)"
    );
  }

  return rx;
}
