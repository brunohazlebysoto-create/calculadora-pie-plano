// Evidence-based flat foot insole prescription engine
// Sources: Delphi Consensus (Australian Podiatrists), PTTD Staging,
// Decision Tree CART algorithm (2022), pediatric insole studies

export const GRADES = {
  LEVE: "leve",
  MODERADO: "moderado",
  SEVERO: "severo",
};

export const AGE_GROUP = {
  INFANTIL_TEMPRANO: "infantil_temprano", // 2-5
  INFANTIL: "infantil",                   // 6-9
  JUVENIL: "juvenil",                     // 10-17
  ADULTO: "adulto",                       // 18-59
  ADULTO_MAYOR: "adulto_mayor",           // 60+
};

function getAgeGroup(age) {
  if (age < 2) return null;
  if (age <= 5) return AGE_GROUP.INFANTIL_TEMPRANO;
  if (age <= 9) return AGE_GROUP.INFANTIL;
  if (age <= 17) return AGE_GROUP.JUVENIL;
  if (age <= 59) return AGE_GROUP.ADULTO;
  return AGE_GROUP.ADULTO_MAYOR;
}

function getShoeSizeCategory(talla) {
  // EU sizing
  if (talla <= 22) return "pediátrico_pequeño";
  if (talla <= 30) return "pediátrico";
  if (talla <= 36) return "juvenil";
  if (talla <= 42) return "adulto_medio";
  return "adulto_grande";
}

export function generatePrescription({ talla, edad, grado, sintomas, flexible }) {
  const ageGroup = getAgeGroup(edad);
  if (!ageGroup) {
    return { error: "Edad mínima para prescripción: 2 años." };
  }

  const sizeCategory = getShoeSizeCategory(talla);

  // Under 5: no indication regardless (purely physiological)
  if (edad < 5 && !sintomas && grado === GRADES.LEVE) {
    return {
      indicacion: false,
      mensaje:
        "Pie plano fisiológico en desarrollo. Menor de 5 años sin síntomas: no se indica plantilla. El arco plantar se forma entre los 3 y 6 años.",
      recomendaciones: [
        "Estimular marcha descalza en superficies naturales",
        "Evitar calzado con suela rígida",
        "Control anual o si aparecen síntomas",
      ],
    };
  }

  // 5-6 years, asymptomatic, mild: safe supportive insole (no correction, no harm)
  if (edad >= 5 && edad <= 6 && !sintomas && grado === GRADES.LEVE) {
    return {
      indicacion: true,
      tipo: "Plantilla de acompañamiento pediátrica (no correctiva)",
      arcoSoporte: "Relleno suave y bajo — acompañamiento, no corrección",
      taconeraAltura: "8-10 mm, copa superficial",
      cunaRearfoot: "0° — sin cuña (no interferir con desarrollo natural)",
      cunaForefoot: "0°",
      flandeMedal: "Mínimo",
      padMetatarsal: false,
      material: "EVA blando 10 mm densidad baja (Shore 30-35°)",
      longitud: "Longitud completa",
      notas: [
        "Plantilla de acompañamiento: proporciona comodidad y confort sin forzar corrección angular.",
        "Sin cuñas ni posteo para no interferir con el desarrollo espontáneo del arco.",
        "Diseño pensado para tranquilizar a los padres sin perjudicar al niño.",
        "Si aparecen síntomas o el pie no desarrolla arco después de los 7 años, reevaluar con protocolo correctivo.",
      ],
      controles: "Control anual",
      fundamentacion: [
        "Revisión Cochrane: no hay evidencia de beneficio de ortesis en pie plano asintomático pediátrico.",
        "Consenso: plantilla blanda sin corrección no perjudica el desarrollo del arco (PMC9561439).",
        "Límite clínico establecido en 5 años según criterio del prescriptor.",
      ],
    };
  }

  // Build prescription
  const rx = buildRx({ talla, edad, ageGroup, grado, sintomas, flexible, sizeCategory });
  return rx;
}

function buildRx({ talla, edad, ageGroup, grado, sintomas, flexible, sizeCategory }) {
  const rx = {
    indicacion: true,
    tipo: "",
    arcoSoporte: "",
    taconeraAltura: "",
    cunaRearfoot: "",
    cunaForefoot: "",
    flandeMedal: "",
    padMetatarsal: false,
    material: "",
    longitud: "",
    notas: [],
    controles: "",
    fundamentacion: [],
  };

  // Rigid non-flexible flat foot → accommodative only, refer
  if (!flexible && (grado === GRADES.SEVERO)) {
    rx.tipo = "Plantilla acomodativa (pie plano rígido)";
    rx.arcoSoporte = "Relleno mínimo — solo para confort, no corrección";
    rx.taconeraAltura = "20-25 mm, copa ancha";
    rx.cunaRearfoot = "0° (no corregir deformidad fija)";
    rx.cunaForefoot = "0°";
    rx.flandeMedal = "Medial y lateral altos para contención";
    rx.material = "EVA blando + cubierta de neoprene";
    rx.longitud = "Longitud completa";
    rx.notas.push(
      "Pie plano rígido: la plantilla es acomodativa. Se recomienda derivación a traumatología/podología para evaluación quirúrgica."
    );
    rx.controles = "Control cada 6 meses";
    rx.fundamentacion.push("PTTD Stage III: ortesis acomodativa + derivación quirúrgica (Michigan Foot Doctors, 2024)");
    return rx;
  }

  // ────────── PEDIATRIC PRESCRIPTIONS ──────────
  if (ageGroup === AGE_GROUP.INFANTIL_TEMPRANO || ageGroup === AGE_GROUP.INFANTIL) {
    rx.longitud = "Longitud completa";
    rx.material = "EVA 10 mm doble densidad (base firme + cubierta suave)";
    rx.padMetatarsal = false;

    if (grado === GRADES.LEVE) {
      rx.tipo = "Plantilla prefabricada pediátrica (stock)";
      rx.arcoSoporte = "Relleno estándar del arco medial";
      rx.taconeraAltura = "10-12 mm profundidad";
      rx.cunaRearfoot = "4° varo (cuña intrínseca)";
      rx.cunaForefoot = "0°";
      rx.flandeMedal = "Estándar";
      rx.notas.push(
        "Estudios de seguimiento a 2 años muestran que plantillas prefabricadas tienen resultados equivalentes a medida en niños con pie plano flexible leve (PMC9561439)."
      );
      rx.controles = "Control a los 6 meses";
      rx.fundamentacion.push("Insoles for symptomatic pediatric flatfoot, 2-year follow-up (PMC9561439)");
    } else if (grado === GRADES.MODERADO) {
      rx.tipo = "Plantilla semirígida pediátrica a medida";
      rx.arcoSoporte = "Relleno estándar-máximo del arco medial";
      rx.taconeraAltura = "12-15 mm profundidad";
      rx.cunaRearfoot = "4° varo";
      rx.cunaForefoot = "2-4° según valoración";
      rx.flandeMedal = "Medial elevado";
      rx.notas.push("Considerar estudio de huella plantar (índice de Staheli o Chippaux-Smirak) para cuantificar severidad.");
      rx.controles = "Control a los 3-6 meses";
      rx.fundamentacion.push("Delphi Consensus Australian Podiatrists (PMC4282733)");
    } else {
      rx.tipo = "Ortesis tipo UCBL pediátrica";
      rx.arcoSoporte = "Relleno máximo";
      rx.taconeraAltura = "20-25 mm, copa profunda";
      rx.cunaRearfoot = "4-6° varo";
      rx.cunaForefoot = "4-6°";
      rx.flandeMedal = "Flancos medial y lateral altos";
      rx.notas.push(
        "Pie plano severo pediátrico: evaluar descenso navicular ≥10 mm (Navicular Drop Test). Derivar a podología pediátrica."
      );
      rx.controles = "Control cada 3 meses";
      rx.fundamentacion.push(
        "UCBL orthotic design for severe pediatric flatfoot (FootFoot Care, 2024)",
        "Delphi Consensus (PMC3668898)"
      );
    }
    return rx;
  }

  // ────────── JUVENILE / ADULT PRESCRIPTIONS ──────────
  rx.longitud = "Longitud completa o ¾ según calzado";

  if (ageGroup === AGE_GROUP.JUVENIL) {
    rx.material = "Polipropileno + cubierta EVA o TPU semirígido";
  } else if (ageGroup === AGE_GROUP.ADULTO_MAYOR) {
    rx.material = "EVA 10 mm alta densidad + cubierta gel o neoprene suave";
    rx.notas.push("En adulto mayor priorizar amortiguación; reducir corrección angular para evitar inestabilidad.");
  } else {
    rx.material = "Polipropileno o EVA firme (3-4 mm) + cubierta suave";
  }

  if (grado === GRADES.LEVE) {
    rx.tipo = "Plantilla semirígida con soporte de arco medial";
    rx.arcoSoporte = "Relleno estándar";
    rx.taconeraAltura = "12-15 mm profundidad";
    rx.cunaRearfoot = "4° varo";
    rx.cunaForefoot = "0°";
    rx.flandeMedal = "Estándar";
    rx.fundamentacion.push(
      "Stage I PTTD / mild pes planus: semi-rigid orthotic, 70-85% success at 1 year (HMP Global, 2024)",
      "Delphi Consensus (PMC4282733)"
    );
    rx.controles = "Control a los 6 meses";
  } else if (grado === GRADES.MODERADO) {
    rx.tipo = "Plantilla semirígida a medida con cuña medial";
    rx.arcoSoporte = "Relleno estándar-máximo";
    rx.taconeraAltura = "15-20 mm profundidad";
    rx.cunaRearfoot = "4-6° varo";
    rx.cunaForefoot = "2-4° si hay varo de antepié";
    rx.flandeMedal = "Flanco medial elevado";
    rx.notas.push(
      "Evaluar Navicular Drop Test: si ≥10 mm, usar cuña 6°. Evaluar talón valgo: si >8°, reforzar cuña trasera."
    );
    rx.fundamentacion.push(
      "Stage IIa PTTD: semi-rigid/UCBL with medial skive, 4-6° rearfoot post (ProLab Orthotics)",
      "CART algorithm decision tree (PMC9566258)"
    );
    rx.controles = "Control a los 3-4 meses";
  } else {
    rx.tipo = "Ortesis UCBL o plantilla rígida con control de retropié";
    rx.arcoSoporte = "Relleno máximo";
    rx.taconeraAltura = "25-35 mm, copa UCBL profunda";
    rx.cunaRearfoot = "4-6° varo";
    rx.cunaForefoot = "4-6° varo antepié";
    rx.flandeMedal = "Flancos medial y lateral altos (control total)";
    rx.notas.push(
      "Stage IIb: evaluar abducción del antepié (cobertura talonavicular >50% = Stage IIb).",
      "Si falla UCBL, considerar ortesis Arizona brace.",
      "Derivar a traumatología si hay progresión."
    );
    rx.fundamentacion.push(
      "Stage IIb PTTD: UCBL + forefoot post 4-6° (ProLab Orthotics)",
      "Comprehensive guide to UCBL orthotics (FootFoot Care)"
    );
    rx.controles = "Control cada 3 meses";
  }

  // Pad metatarsal for adults with forefoot symptoms
  if (ageGroup === AGE_GROUP.ADULTO || ageGroup === AGE_GROUP.ADULTO_MAYOR) {
    if (grado === GRADES.MODERADO || grado === GRADES.SEVERO) {
      rx.padMetatarsal = true;
      rx.notas.push(
        "Pad metatarsal: colocar 1-2 cm proximal a las cabezas metatarsianas (no bajo la bola del pie). Grosor: ~9.5 mm sin comprimir."
      );
    }
  }

  // Size-specific adjustments
  if (sizeCategory === "adulto_grande") {
    rx.notas.push("Talla grande: verificar ancho de plantilla; preferir ancho W o XW para cobertura de flancos.");
  }

  return rx;
}
