// =============================================
// sheet.js — Smart Hx Knowledge Base
// =============================================

const HX_SYSTEMS = {
    GEN:  { name: "General Look",      icon: "🧍",  color: "#10b981" }, // GEN is reserved and rendered first
    GI:   { name: "Gastrointestinal",  icon: "🍏", color: "#f59e0b" },
    CVS:  { name: "Cardiovascular",    icon: "❤️",  color: "#ef4444" },
    RESP: { name: "Respiratory",       icon: "🫁",  color: "#3b82f6" },
    CNS:  { name: "Neurological",      icon: "🧠",  color: "#8b5cf6" },
    GU:   { name: "Genitourinary",     icon: "💧",  color: "#06b6d4" },
    OBS:  { name: "OBS/GYN",  icon: "🤰",  color: "#ec4899" },
    MSK:  { name: "Musculoskeletal",   icon: "🦴",  color: "#d97706" },
    NEPH: { name: "Nephrology",        icon: "🫘",  color: "#a855f7" },
    ENDO: { name: "Endocrine",         icon: "🦋",  color: "#f97316" }
};

// =============================================
// BASELINE PAST HISTORY SUGGESTIONS
// =============================================
const HX_BASELINE_PAST = {
    medical:  ['Hypertension', 'Diabetes Mellitus', 'Ischemic Heart Disease', 'CKD'],
    surgical: ['Appendectomy', 'Cholecystectomy'],
    drug:     [],
    family:   ['Diabetes Mellitus', 'Hypertension', 'Malignancy'],
    social:   ['Smoking', 'Alcohol', 'Illicit Drugs']
};

// =============================================
// EXCLUSION RULES
// =============================================
const HX_EXCLUSIONS = {
    // ── Social History ───────────────────────────────────────────────────────
    'Smoking':                               { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Alcohol':                               { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Illicit Drugs':                         { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Occupational exposure (dust/chemicals)':{ excludeAgeGroups: ['Neonate', 'Pediatric'] },

    // ── Medical History ──────────────────────────────────────────────────────
    'Hypertension':                          { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Diabetes Mellitus':                     { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'CKD':                                   { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Liver Cirrhosis':                       { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Portal Hypertension':                   { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Dyslipidemia':                          { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Ischemic Heart Disease':                { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Heart Failure':                         { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'DVT':                                   { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'COPD':                                  { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Asthma':                                { excludeAgeGroups: ['Neonate'] },
    'Dementia':                              { excludeAgeGroups: ['Neonate', 'Pediatric', 'Adolescent', 'Adult'] },
    'Gallstones':                            { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Epilepsy':                              { },
    'Migraine':                              { excludeAgeGroups: ['Neonate'] },
    'Aneurysm / SAH':                        { excludeAgeGroups: ['Neonate'] },
    'Inflammatory Bowel Disease':            { excludeAgeGroups: ['Neonate'] },
    'Peptic Ulcer Disease':                  { excludeAgeGroups: ['Neonate'] },
    'GERD':                                  { },
    'Recurrent UTIs':                        { },
    'Nephrolithiasis':                       { excludeAgeGroups: ['Neonate'] },
    'Tuberculosis':                          { },
    'Polycystic Kidney Disease':             { },
    'Glomerulonephritis':                    { },

    // ── Surgical History ─────────────────────────────────────────────────────
    'CABG':                                  { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'PCI/Stents':                            { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'TIPS':                                  { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Neurosurgery':                          { },
    'Previous abdominal surgery':            { },
    'Recent immobilization/surgery':         { excludeAgeGroups: ['Neonate'] },
    'Appendectomy':                          { },
    'Cholecystectomy':                       { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Central line / Port-a-cath':            { },
    'Urinary catheterization':               { },
    'Recent intubation':                     { },
    'Renal Transplant':                      { excludeAgeGroups: ['Neonate'] },
    'AV Fistula Creation':                   { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Hemodialysis':                          { excludeAgeGroups: ['Neonate'] },

    // ── Drug History ─────────────────────────────────────────────────────────
    'Nitrates':                              { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Beta Blockers':                         { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Statins':                               { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Warfarin/DOACs':                        { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'NSAIDs':                                { excludeAgeGroups: ['Neonate'] },
    'Aspirin':                               { excludeAgeGroups: ['Neonate'] },
    'Steroids':                              { },
    'Immunosuppressants':                    { },
    'Recent Antibiotics':                    { },
    'Insulin/OHAs':                          { excludeAgeGroups: ['Neonate'] },
    'Sedatives/Hypnotics':                   { excludeAgeGroups: ['Neonate'] },
    'Opioids':                               { excludeAgeGroups: ['Neonate'] },
    'Anticholinergics':                      { excludeAgeGroups: ['Neonate'] },
    'Oral Contraceptives':                   { excludeAgeGroups: ['Neonate', 'Pediatric'], excludeSex: ['Male'] },

    // ── Family History ───────────────────────────────────────────────────────
    'Premature CAD':                         { excludeAgeGroups: ['Neonate'] },
    'Sudden cardiac death':                  { },
    'Bleeding disorders':                    { },
    'Malignancy':                            { },

    // ── Sex-specific items ───────────────────────────────────────────────────
    'Prostate Disease':                      { excludeSex: ['Female'], excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'BPH':                                   { excludeSex: ['Female'], excludeAgeGroups: ['Neonate', 'Pediatric', 'Adolescent', 'Adult'] },
    'Previous C-Section':                    { excludeSex: ['Male'], excludeAgeGroups: ['Neonate', 'Pediatric', 'Adolescent'] },
    'Ovarian Disease':                       { excludeSex: ['Male'] },
    'Uterine Disease':                       { excludeSex: ['Male'] },
    'Endometriosis':                         { excludeSex: ['Male'], excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Pelvic Inflammatory Disease (PID)':     { excludeSex: ['Male'], excludeAgeGroups: ['Neonate', 'Pediatric'] }
};

// =============================================
// EXAM EXCLUSION RULES
// =============================================
const EXAM_SYSTEM_RULES = {
    OBS: { requireSex: 'Female' }
};

// =============================================
// TEMPLATES
// =============================================
const HX_TEMPLATES = {
    pain_chest: [
        { id: "site",        label: "Exact Location",      type: "chips", options: ["Retrosternal", "Left Sided", "Right Sided", "Diffuse"] },
        { id: "radiation",   label: "Radiation",           type: "chips", options: ["Left Arm", "Both Arms", "Jaw/Neck", "Back", "None"] },
        { id: "character",   label: "Character",           type: "chips", options: ["Crushing/Pressure", "Tearing", "Stabbing/Sharp", "Burning", "Aching"] },
        { id: "severity",    label: "Severity (1–10)",     type: "number", min: 1, max: 10 },
        { id: "aggravating", label: "Aggravating Factors", type: "text" },
        { id: "relieving",   label: "Relieving Factors",   type: "text" }
    ],
    pain_abd: [
        { id: "site",        label: "Quadrant / Site",     type: "chips", options: ["Epigastric", "RUQ", "RLQ", "LUQ", "LLQ", "Suprapubic", "Diffuse"] },
        { id: "radiation",   label: "Radiation",           type: "chips", options: ["Back", "Right Shoulder", "Left Shoulder", "Groin", "None"] },
        { id: "character",   label: "Character",           type: "chips", options: ["Colicky/Cramping", "Dull Aching", "Sharp/Stabbing", "Burning"] },
        { id: "severity",    label: "Severity (1–10)",     type: "number", min: 1, max: 10 },
        { id: "aggravating", label: "Aggravating",         type: "text" },
        { id: "relieving",   label: "Relieving",           type: "text" }
    ],
    pain_headache: [
        { id: "site",        label: "Location",            type: "chips", options: ["Frontal", "Occipital", "Temporal", "Unilateral (Half)", "Holocranial"] },
        { id: "radiation",   label: "Radiation",           type: "chips", options: ["Neck", "Face", "Eye", "None"] },
        { id: "character",   label: "Character",           type: "chips", options: ["Throbbing/Pulsating", "Tight Band/Pressure", "Stabbing", "Dull"] },
        { id: "severity",    label: "Severity (1–10)",     type: "number", min: 1, max: 10 },
        { id: "aggravating", label: "Aggravating Factors", type: "text" },
        { id: "relieving",   label: "Relieving Factors",   type: "text" }
    ],
    pain_back: [
        { id: "site",        label: "Location",            type: "chips", options: ["Cervical", "Thoracic", "Lumbar", "Sacral"] },
        { id: "radiation",   label: "Radiation",           type: "chips", options: ["Down one leg (Sciatica)", "Down both legs", "Arms", "None"] },
        { id: "character",   label: "Character",           type: "chips", options: ["Dull aching", "Sharp/Shooting", "Spasm-like"] },
        { id: "severity",    label: "Severity (1–10)",     type: "number", min: 1, max: 10 },
        { id: "aggravating", label: "Aggravating",         type: "text" },
        { id: "relieving",   label: "Relieving",           type: "text" }
    ],
    bleeding: [
        { id: "amount",    label: "Estimated Amount",type: "chips", options: ["Scant/Streaks", "Moderate (Cup)", "Massive/Profuse"] },
        { id: "color",     label: "Color",           type: "chips", options: ["Bright Red", "Dark Red", "Coffee-ground", "Melena (Black/Tarry)"] },
        { id: "frequency", label: "Frequency",       type: "text" },
        { id: "content",   label: "Contains Clots?", type: "toggle" }
    ],
    fever: [
        { id: "chills",       label: "Chills / Rigors",  type: "toggle" },
        { id: "night_sweats", label: "Night Sweats",     type: "toggle" },
        { id: "pattern",      label: "Pattern",          type: "chips", options: ["Continuous", "Intermittent", "Remittent", "Relapsing"] },
        { id: "max_temp",     label: "Max Temp (°C)",    type: "number", min: 37, max: 42 }
    ],
    neuro_ams: [
        { id: "gcs",            label: "GCS (3-15)",            type: "number", min: 3, max: 15 },
        { id: "loc",            label: "Loss of Consciousness?",type: "toggle" },
        { id: "trauma",         label: "Recent Head Trauma?",   type: "toggle" },
        { id: "seizures",       label: "Witnessed Seizures?",   type: "toggle" },
        { id: "focal_weakness", label: "Focal Weakness/Asymmetry?", type: "toggle" }
    ],
    palpitations: [
        { id: "onset",        label: "Onset",               type: "chips", options: ["Sudden", "Gradual"] },
        { id: "rhythm",       label: "Sensation",           type: "chips", options: ["Fast & Regular", "Fast & Irregular", "Skipped beats"] },
        { id: "duration",     label: "Duration of attacks", type: "text" },
        { id: "syncope",      label: "Associated Syncope?", type: "toggle" }
    ],
    syncope: [
        { id: "posture",      label: "Posture before event",type: "chips", options: ["Standing", "Sitting", "Lying down", "Changing posture"] },
        { id: "prodrome",     label: "Warning signs?",      type: "chips", options: ["None (Drop attack)", "Nausea/Sweating", "Visual changes", "Palpitations"] },
        { id: "recovery",     label: "Recovery time",       type: "text" },
        { id: "injury",       label: "Injury during fall?", type: "toggle" }
    ],
    dizziness: [
        { id: "type",         label: "Type of Sensation",   type: "chips", options: ["Room spinning (Vertigo)", "Lightheaded/Presyncope", "Unsteady/Imbalance"] },
        { id: "timing",       label: "Duration of attacks", type: "chips", options: ["Seconds", "Minutes to Hours", "Continuous (Days)"] },
        { id: "triggers",     label: "Triggered by head movement?", type: "toggle" }
    ],
    urinary: [
        { id: "frequency",  label: "Frequency",        type: "toggle" },
        { id: "urgency",    label: "Urgency",          type: "toggle" },
        { id: "dysuria",    label: "Dysuria (Burning)",type: "toggle" },
        { id: "hematuria",  label: "Hematuria (Blood)",type: "toggle" },
        { id: "flank_pain", label: "Flank Pain",       type: "toggle" }
    ],
    gi_bowel: [
        { id: "frequency",   label: "Frequency per day", type: "number", min: 1, max: 30 },
        { id: "consistency", label: "Consistency",       type: "chips", options: ["Watery", "Loose", "Oily/Greasy", "Hard"] },
        { id: "blood_mucus", label: "Blood or Mucus?",   type: "toggle" },
        { id: "tenesmus",    label: "Tenesmus (Feeling of incomplete emptying)?", type: "toggle" }
    ],
    gi_vomiting: [
        { id: "frequency",   label: "Episodes per day",  type: "number", min: 1, max: 50 },
        { id: "content",     label: "Content",           type: "chips", options: ["Food particles", "Bilious (Green/Yellow)", "Clear/Gastric juice"] },
        { id: "projectile",  label: "Projectile?",       type: "toggle" },
        { id: "nausea",      label: "Preceded by Nausea?", type: "toggle" }
    ],
    edema: [
        { id: "site",        label: "Location",            type: "chips", options: ["Lower Limbs", "Periorbital", "Sacral", "Generalized (Anasarca)"] },
        { id: "timing",      label: "Worse at a specific time?", type: "chips", options: ["Morning", "Evening", "Constant"] },
        { id: "progression", label: "Progression",         type: "text" },
        { id: "pain",        label: "Is it painful?",      type: "toggle" }
    ],
    urine_output: [
        { id: "amount",      label: "Estimated Amount",    type: "chips", options: ["None (Anuria)", "Very little (Oliguria)", "Normal", "Excessive (Polyuria)"] },
        { id: "duration",    label: "Duration of change",  type: "text" },
        { id: "thirst",      label: "Increased thirst?",   type: "toggle" },
        { id: "fluid_intake",label: "Recent fluid intake", type: "text" }
    ],
    urine_appearance: [
        { id: "color",       label: "Color",               type: "chips", options: ["Clear", "Dark/Tea-colored", "Red/Pink", "Cloudy"] },
        { id: "frothy",      label: "Frothy / Foamy?",     type: "toggle" },
        { id: "smell",       label: "Foul smelling?",      type: "toggle" },
        { id: "clots",       label: "Contains clots?",     type: "toggle" }
    ],
    generic: []
};

// =============================================
// SYMPTOMS (Ranked by Ward/ER frequency)
// =============================================
const HX_SYMPTOMS = [
    {
        id: "hx_fever",
        name: "Fever",
        systems: ["GEN"],
        searchTerms: ["high temp", "hot", "pyrexia", "حرارة", "سخونة"],
        globalRank: 1,
        template: "fever",
        customAttributes: [
            { id: "localizing",   label: "Any localizing pain? (e.g. chest, abd, urine)", type: "text" },
            { id: "sick_contact", label: "Sick contacts?",       type: "toggle" },
            { id: "travel",       label: "Recent travel?",       type: "text" }
        ],
        correlations: {
            medical:  ["Diabetes Mellitus", "Heart Failure", "CKD"],
            surgical: ["Recent immobilization/surgery", "Central line / Port-a-cath"],
            drug:     ["Immunosuppressants", "Steroids", "Recent Antibiotics"],
            family:   ["Tuberculosis"],
            social:   ["Smoking", "Illicit Drugs"]
        },
        examPriority: ["gen_vitals", "gen_signs_stigmata", "resp_auscultation", "cns_meningeal"],
        labHints:   ["WBC", "CRP", "ESR", "Procalcitonin", "Lactate", "Hemoglobin (Hb)", "Platelets", "Blood Culture", "Urine Culture"],
        radioHints: ["Chest X-Ray", "Urinalysis", "Blood Culture", "Urine Culture"]
    },
    {
        id: "hx_sob",
        name: "Dyspnea",
        systems: ["RESP", "CVS"],
        searchTerms: ["sob", "dyspnea", "breathless", "shortness of breath", "ضيق تنفس", "نهجان"],
        globalRank: 2,
        template: "generic",
        customAttributes: [
            { id: "orthopnea", label: "Orthopnea (worse lying flat)?", type: "toggle" },
            { id: "pnd",       label: "Wakes up gasping (PND)?",       type: "toggle" },
            { id: "wheezing",  label: "Associated Wheezing?",          type: "toggle" }
        ],
        correlations: {
            medical:  ["Asthma", "COPD", "Heart Failure", "Ischemic Heart Disease", "DVT", "CKD"],
            surgical: ["Recent intubation", "CABG", "Recent immobilization/surgery"],
            drug:     ["Beta Blockers", "Oral Contraceptives"],
            family:   ["Asthma", "Sudden cardiac death"],
            social:   ["Smoking", "Occupational exposure (dust/chemicals)"]
        },
        examPriority: ["gen_vitals", "resp_inspection", "resp_auscultation", "cvs_auscultation", "gen_signs_stigmata"],
        labHints:   ["WBC", "Troponin I", "D-Dimer", "pH", "pCO2", "pO2", "HCO3", "Hemoglobin (Hb)", "BNP"],
        radioHints: ["Chest X-Ray", "ECG", "CT Pulmonary Angiography (CTPA)", "Echocardiogram"]
    },
    {
        id: "hx_chest_pain",
        name: "Chest Pain",
        systems: ["CVS", "RESP"],
        searchTerms: ["cp", "chest", "pain", "angina", "ألم بالصدر"],
        globalRank: 3,
        template: "pain_chest",
        customAttributes: [
            { id: "exertional",    label: "Worse with exertion?",              type: "toggle" },
            { id: "respirophasic", label: "Worse with breathing (Pleuritic)?", type: "toggle" },
            { id: "diaphoresis",   label: "Associated sweating/diaphoresis?",  type: "toggle" },
            { id: "palpitations",  label: "Associated palpitations?",          type: "toggle" }
        ],
        correlations: {
            medical:  ["Hypertension", "Diabetes Mellitus", "Dyslipidemia", "Ischemic Heart Disease", "Asthma", "DVT", "GERD"],
            surgical: ["CABG", "PCI/Stents", "Recent immobilization/surgery"],
            drug:     ["Nitrates", "Beta Blockers", "Aspirin", "Statins", "Oral Contraceptives"],
            family:   ["Premature CAD", "Sudden cardiac death"],
            social:   ["Smoking", "Illicit Drugs"]
        },
        examPriority: ["gen_vitals", "cvs_auscultation", "resp_auscultation", "cvs_pulses"],
        labHints:   ["Troponin I", "D-Dimer", "Hemoglobin (Hb)", "Creatinine"],
        radioHints: ["Chest X-Ray", "ECG", "CT Pulmonary Angiography (CTPA)", "Echocardiogram"]
    },
    {
        id: "hx_abd_pain",
        name: "Abdominal Pain",
        systems: ["GI", "GU", "OBS"],
        searchTerms: ["stomach ache", "belly", "colic", "ألم بالبطن", "مغص"],
        globalRank: 4,
        template: "pain_abd",
        customAttributes: [
            { id: "nausea_vomiting", label: "Associated Nausea/Vomiting?", type: "toggle" },
            { id: "relation_meals",  label: "Relation to meals",           type: "chips", options: ["Worse after eating", "Better after eating", "Unrelated"] },
            { id: "bowel_habit",     label: "Change in bowel habits?",     type: "toggle" },
            { id: "jaundice",        label: "Associated Jaundice?",        type: "toggle" }
        ],
        correlations: {
            medical:  ["Peptic Ulcer Disease", "Gallstones", "Diabetes Mellitus", "Pelvic Inflammatory Disease (PID)", "Endometriosis", "Inflammatory Bowel Disease"],
            surgical: ["Appendectomy", "Cholecystectomy", "Previous abdominal surgery", "Previous C-Section"],
            drug:     ["NSAIDs", "Aspirin", "Steroids", "Recent Antibiotics"],
            family:   ["Inflammatory Bowel Disease", "Malignancy"],
            social:   ["Alcohol"]
        },
        examPriority: ["gen_vitals", "gi_inspection", "gi_palpation", "gi_percussion", "gu_renal_angle"],
        labHints:   ["WBC", "CRP", "Amylase", "Lipase", "ALT (SGPT)", "Total Bilirubin", "Lactate", "Hemoglobin (Hb)", "Alkaline Phosphatase (ALP)", "Direct Bilirubin"],
        radioHints: ["Abdominal US", "CT Abdomen & Pelvis", "KUB X-Ray", "Urinalysis", "Pelvic US"]
    },
    {
        id: "hx_ams",
        name: "Altered Mental Status",
        systems: ["CNS", "GEN"],
        searchTerms: ["confusion", "coma", "delirium", "drowsy", "غيبوبة", "تخليط"],
        globalRank: 5,
        template: "neuro_ams",
        customAttributes: [
            { id: "baseline",    label: "Baseline cognition",   type: "text" },
            { id: "onset_speed", label: "Sudden vs Gradual?",   type: "chips", options: ["Sudden (minutes/hours)", "Gradual (days)", "Insidious (months)"] },
            { id: "intoxication",label: "Suspected poisoning?", type: "toggle" }
        ],
        correlations: {
            medical:  ["Diabetes Mellitus", "Dementia", "Liver Cirrhosis", "CKD", "Hypertension", "Epilepsy"],
            surgical: ["Neurosurgery"],
            drug:     ["Sedatives/Hypnotics", "Opioids", "Anticholinergics", "Insulin/OHAs"],
            family:   ["Dementia"],
            social:   ["Alcohol", "Illicit Drugs"]
        },
        examPriority: ["gen_vitals", "cns_consciousness", "cns_pupils", "gen_signs_stigmata", "cns_limbs"],
        labHints:   ["Sodium (Na)", "Calcium", "Urea", "Creatinine", "Total Bilirubin", "Ammonia", "WBC", "pH", "pCO2", "Base Excess (BE)"],
        radioHints: ["CT Brain", "Urinalysis", "ECG", "Toxicology Screen"]
    },
    {
        id: "hx_gi_nausea_vomit",
        name: "Nausea & Vomiting",
        systems: ["GI", "GEN"],
        searchTerms: ["vomiting", "nausea", "throw up", "puke", "قيء", "غثيان"],
        globalRank: 6,
        template: "gi_vomiting",
        customAttributes: [
            { id: "abd_pain",     label: "Associated Abdominal Pain?", type: "toggle" },
            { id: "headache",     label: "Associated Headache?",       type: "toggle" },
            { id: "last_meal",    label: "Suspicious food eaten?",     type: "toggle" }
        ],
        correlations: {
            medical:  ["Diabetes Mellitus", "Peptic Ulcer Disease", "Gallstones", "Migraine", "CKD"],
            surgical: ["Previous abdominal surgery"],
            drug:     ["Opioids", "NSAIDs", "Recent Antibiotics"],
            family:   [],
            social:   ["Alcohol"]
        },
        examPriority: ["gen_vitals", "gen_hydration", "gi_palpation", "cns_pupils", "cns_meningeal"],
        labHints:   ["Sodium (Na)", "Potassium (K)", "Creatinine", "Urea", "Amylase", "Lipase", "pH"],
        radioHints: ["Abdominal US", "CT Brain", "KUB X-Ray"]
    },
    {
        id: "hx_gi_diarrhea",
        name: "Diarrhea",
        systems: ["GI"],
        searchTerms: ["loose stool", "frequent stool", "diarrhea", "إسهال"],
        globalRank: 7,
        template: "gi_bowel",
        customAttributes: [
            { id: "vomiting",     label: "Associated Vomiting?",   type: "toggle" },
            { id: "fever",        label: "Associated Fever?",      type: "toggle" },
            { id: "sick_contact", label: "Sick Contacts?",         type: "toggle" },
            { id: "travel",       label: "Recent Travel?",         type: "toggle" }
        ],
        correlations: {
            medical:  ["Inflammatory Bowel Disease", "Diabetes Mellitus"],
            surgical: ["Cholecystectomy", "Previous abdominal surgery"],
            drug:     ["Recent Antibiotics", "Immunosuppressants"],
            family:   ["Inflammatory Bowel Disease"],
            social:   []
        },
        examPriority: ["gen_vitals", "gen_hydration", "gi_palpation", "gi_auscultation"],
        labHints:   ["WBC", "CRP", "Sodium (Na)", "Potassium (K)", "Creatinine", "Urea", "pH"],
        radioHints: ["Stool Analysis", "Abdominal US", "CT Abdomen & Pelvis"]
    },
    {
        id: "hx_headache",
        name: "Headache",
        systems: ["CNS"],
        searchTerms: ["ha", "head", "migraine", "صداع"],
        globalRank: 8,
        template: "pain_headache",
        customAttributes: [
            { id: "photophobia", label: "Photophobia / Phonophobia?", type: "toggle" },
            { id: "aura",        label: "Aura present?",              type: "toggle" },
            { id: "worse_am",    label: "Worse in morning?",          type: "toggle" },
            { id: "red_flags",   label: "Fever / Weight loss?",       type: "toggle" }
        ],
        correlations: {
            medical:  ["Hypertension", "Migraine", "Dyslipidemia"],
            surgical: ["Neurosurgery"],
            drug:     ["NSAIDs", "Oral Contraceptives", "Nitrates"],
            family:   ["Migraine", "Aneurysm / SAH"],
            social:   ["Smoking", "Alcohol"]
        },
        examPriority: ["gen_vitals", "cns_consciousness", "cns_pupils", "cns_cranial_nerves", "cns_meningeal", "cns_limbs"],
        labHints:   ["WBC", "ESR", "CRP", "Platelets"],
        radioHints: ["CT Brain", "MRI Brain", "Lumbar Puncture (CSF Analysis)"]
    },
    {
        id: "hx_cough",
        name: "Cough",
        systems: ["RESP"],
        searchTerms: ["coughing", "sputum", "phlegm", "سعال"],
        globalRank: 9,
        template: "generic",
        customAttributes: [
            { id: "type",         label: "Type",                    type: "chips", options: ["Dry", "Productive"] },
            { id: "sputum_color", label: "Sputum Color",            type: "text" },
            { id: "hemoptysis",   label: "Blood in sputum?",        type: "toggle" },
            { id: "timing",       label: "Timing (e.g. nocturnal)", type: "text" },
            { id: "fever",        label: "Associated Fever?",       type: "toggle" }
        ],
        correlations: {
            medical:  ["Asthma", "COPD", "Heart Failure", "GERD", "Tuberculosis"],
            surgical: ["Recent intubation"],
            drug:     ["Immunosuppressants"],
            family:   ["Asthma", "Tuberculosis"],
            social:   ["Smoking", "Occupational exposure (dust/chemicals)"]
        },
        examPriority: ["gen_vitals", "resp_inspection", "resp_auscultation", "resp_percussion"],
        labHints:   ["WBC", "CRP", "ESR"],
        radioHints: ["Chest X-Ray", "CT Chest", "Sputum Culture"]
    },
    {
        id: "hx_dysuria",
        name: "Dysuria",
        systems: ["GU"],
        searchTerms: ["burning urine", "frequency", "uti", "urinary symptoms", "حرقان بالبول"],
        globalRank: 10,
        template: "urinary",
        customAttributes: [
            { id: "discharge", label: "Urethral/Vaginal Discharge?", type: "toggle" },
            { id: "fever",     label: "Associated Fever?",           type: "toggle" },
            { id: "stone_hx",  label: "Passed stones previously?",   type: "toggle" }
        ],
        correlations: {
            medical:  ["Diabetes Mellitus", "Recurrent UTIs", "BPH", "Prostate Disease", "Nephrolithiasis", "Pelvic Inflammatory Disease (PID)"],
            surgical: ["Previous abdominal surgery", "Urinary catheterization"],
            drug:     ["Immunosuppressants", "Recent Antibiotics"],
            family:   ["Nephrolithiasis"],
            social:   []
        },
        examPriority: ["gen_vitals", "gu_renal_angle", "gu_bladder", "gu_external"],
        labHints:   ["WBC", "Creatinine", "BUN", "CRP"],
        radioHints: ["Urinalysis", "Urine Culture", "Abdominal US", "Pelvic US", "KUB X-Ray"]
    },
    {
        id: "hx_dizziness",
        name: "Dizziness",
        systems: ["CNS", "CVS"],
        searchTerms: ["dizzy", "spinning", "lightheaded", "faint", "vertigo", "دوخة", "دوار"],
        globalRank: 11,
        template: "dizziness",
        customAttributes: [
            { id: "hearing_loss", label: "Associated Hearing Loss or Tinnitus?", type: "toggle" },
            { id: "nausea",       label: "Associated Nausea/Vomiting?",          type: "toggle" },
            { id: "palpitations", label: "Associated Palpitations?",             type: "toggle" },
            { id: "postural",     label: "Occurs when standing up quickly?",     type: "toggle" }
        ],
        correlations: {
            medical:  ["Hypertension", "Diabetes Mellitus", "Heart Failure", "Migraine", "Epilepsy"],
            surgical: [],
            drug:     ["Beta Blockers", "Nitrates", "Sedatives/Hypnotics"],
            family:   [],
            social:   ["Alcohol"]
        },
        examPriority: ["gen_vitals", "cns_cranial_nerves", "cns_cerebellar", "cvs_auscultation", "cvs_pulses"],
        labHints:   ["Hemoglobin (Hb)", "Sodium (Na)", "Potassium (K)", "Creatinine"],
        radioHints: ["ECG", "CT Brain", "MRI Brain"]
    },
    {
        id: "hx_back_pain",
        name: "Back Pain",
        systems: ["MSK", "GU", "CNS"],
        searchTerms: ["backache", "lumbago", "sciatica", "ألم بالظهر"],
        globalRank: 12,
        template: "pain_back",
        customAttributes: [
            { id: "weakness",     label: "Leg weakness or numbness?",       type: "toggle" },
            { id: "incontinence", label: "Bowel/Bladder incontinence?",     type: "toggle" },
            { id: "fever",        label: "Associated Fever?",               type: "toggle" },
            { id: "trauma",       label: "History of Trauma/Fall?",         type: "toggle" }
        ],
        correlations: {
            medical:  ["Nephrolithiasis", "Malignancy"],
            surgical: ["Neurosurgery", "Recent immobilization/surgery"],
            drug:     ["Steroids"],
            family:   ["Malignancy"],
            social:   ["Occupational exposure (dust/chemicals)", "Smoking"] // Occupational lifting
        },
        examPriority: ["gen_vitals", "msk_spine", "cns_limbs", "gu_renal_angle", "msk_rom"],
        labHints:   ["WBC", "CRP", "ESR", "Calcium"],
        radioHints: ["X-Ray Spine", "MRI Spine", "Abdominal US", "Urinalysis"]
    },
    {
        id: "hx_hematemesis",
        name: "Hematemesis",
        systems: ["GI"],
        searchTerms: ["vomiting blood", "melena", "blood vomit", "gi bleed", "قيء دم", "براز أسود"],
        globalRank: 13,
        template: "bleeding",
        customAttributes: [
            { id: "relation_to_food", label: "Relation to food",         type: "text" },
            { id: "nausea_before",    label: "Nausea before vomiting?",  type: "toggle" },
            { id: "dizziness",        label: "Associated Dizziness/Fainting?", type: "toggle" }
        ],
        correlations: {
            medical:  ["Peptic Ulcer Disease", "Liver Cirrhosis", "Portal Hypertension", "GERD"],
            surgical: ["Previous abdominal surgery", "TIPS"],
            drug:     ["NSAIDs", "Aspirin", "Warfarin/DOACs", "Steroids"],
            family:   ["Bleeding disorders"],
            social:   ["Alcohol", "Smoking"]
        },
        examPriority: ["gen_vitals", "gen_signs_stigmata", "gen_hydration", "gi_palpation", "gi_dre"],
        labHints:   ["Hemoglobin (Hb)", "Platelets", "PT", "PTT", "ALT (SGPT)", "AST (SGOT)", "Total Bilirubin", "BUN", "Creatinine", "Lactate"],
        radioHints: ["Upper Endoscopy", "Abdominal US"]
    },
    {
        id: "hx_edema",
        name: "Edema",
        systems: ["NEPH", "CVS", "GI"],
        searchTerms: ["swelling", "edema", "puffy", "تورم", "وذمة"],
        globalRank: 14,
        template: "edema",
        customAttributes: [
            { id: "sob",          label: "Associated Shortness of Breath?", type: "toggle" },
            { id: "urine_change", label: "Change in urine output/color?",   type: "toggle" },
            { id: "orthopnea",    label: "Orthopnea?",                      type: "toggle" }
        ],
        correlations: {
            medical:  ["Heart Failure", "CKD", "Liver Cirrhosis", "DVT", "Hypertension"],
            surgical: [],
            drug:     ["NSAIDs", "Steroids"],
            family:   [],
            social:   []
        },
        examPriority: ["gen_vitals", "gen_signs_stigmata", "cvs_inspection", "resp_auscultation", "neph_fluid_status"],
        labHints:   ["Creatinine", "BUN", "Sodium (Na)", "Potassium (K)", "Total Protein", "Albumin", "Urine Protein", "BNP"],
        radioHints: ["Echocardiogram", "Abdominal US", "Renal Doppler US"]
    },
    {
        id: "hx_oliguria",
        name: "Oliguria",
        systems: ["NEPH", "GU"],
        searchTerms: ["low urine", "anuria", "oliguria", "decreased urine output", "قلة البول", "انقطاع البول"],
        globalRank: 15,
        template: "urine_output",
        customAttributes: [
            { id: "vomiting_diarrhea", label: "Recent vomiting or diarrhea?", type: "toggle" },
            { id: "flank_pain",        label: "Associated flank pain?",       type: "toggle" },
            { id: "medications",       label: "Recent new medications?",      type: "toggle" }
        ],
        correlations: {
            medical:  ["CKD", "Heart Failure", "BPH", "Prostate Disease", "Nephrolithiasis"],
            surgical: ["Urinary catheterization", "Recent immobilization/surgery"],
            drug:     ["NSAIDs", "Recent Antibiotics"],
            family:   [],
            social:   []
        },
        examPriority: ["gen_vitals", "gen_hydration", "gu_bladder", "gu_renal_angle", "neph_fluid_status"],
        labHints:   ["Creatinine", "BUN", "Potassium (K)", "Sodium (Na)", "pH", "HCO3"],
        radioHints: ["Abdominal US", "Pelvic US", "Urinalysis"]
    },
    {
        id: "hx_hematuria",
        name: "Hematuria",
        systems: ["NEPH", "GU"],
        searchTerms: ["blood in urine", "red urine", "hematuria", "دم في البول"],
        globalRank: 16,
        template: "urine_appearance",
        customAttributes: [
            { id: "painful",      label: "Is it painful?",              type: "toggle" },
            { id: "timing",       label: "Initial, terminal, or total?",type: "chips", options: ["Initial", "Terminal", "Total"] },
            { id: "trauma",       label: "Recent trauma?",              type: "toggle" },
            { id: "fever",        label: "Associated fever?",           type: "toggle" }
        ],
        correlations: {
            medical:  ["Nephrolithiasis", "BPH", "Prostate Disease", "Glomerulonephritis", "Malignancy", "Recurrent UTIs"],
            surgical: ["Urinary catheterization"],
            drug:     ["Warfarin/DOACs", "NSAIDs"],
            family:   ["Polycystic Kidney Disease", "Malignancy"],
            social:   ["Smoking"]
        },
        examPriority: ["gen_vitals", "gu_renal_angle", "gu_bladder", "gu_external"],
        labHints:   ["Creatinine", "BUN", "Hemoglobin (Hb)", "Platelets", "PT", "PTT"],
        radioHints: ["Urinalysis", "Urine Culture", "CT KUB", "Abdominal US"]
    },
    {
        id: "hx_flank_pain",
        name: "Flank Pain",
        systems: ["NEPH", "GU", "MSK"],
        searchTerms: ["flank", "loin", "renal colic", "ألم في الجنب", "مغص كلوي"],
        globalRank: 17,
        template: "pain_abd",
        customAttributes: [
            { id: "radiation_groin", label: "Radiates to groin/testicle/labia?", type: "toggle" },
            { id: "hematuria",       label: "Associated hematuria?",             type: "toggle" },
            { id: "fever",           label: "Associated fever?",                 type: "toggle" },
            { id: "dysuria",         label: "Associated dysuria?",               type: "toggle" }
        ],
        correlations: {
            medical:  ["Nephrolithiasis", "Recurrent UTIs", "Polycystic Kidney Disease"],
            surgical: [],
            drug:     [],
            family:   ["Nephrolithiasis"],
            social:   []
        },
        examPriority: ["gen_vitals", "gu_renal_angle", "gi_palpation", "msk_spine"],
        labHints:   ["WBC", "Creatinine", "BUN", "CRP", "Calcium"],
        radioHints: ["CT KUB", "Urinalysis", "Abdominal US", "KUB X-Ray"]
    },
    {
        id: "hx_frothy_urine",
        name: "Frothy Urine",
        systems: ["NEPH"],
        searchTerms: ["frothy", "foamy", "bubbles in urine", "proteinuria", "بول رغوي"],
        globalRank: 18,
        template: "urine_appearance",
        customAttributes: [
            { id: "edema",        label: "Associated swelling/edema?", type: "toggle" },
            { id: "diabetes_hx",  label: "History of poor sugar control?", type: "toggle" },
            { id: "htn_hx",       label: "History of high blood pressure?", type: "toggle" }
        ],
        correlations: {
            medical:  ["Diabetes Mellitus", "Hypertension", "CKD", "Glomerulonephritis"],
            surgical: [],
            drug:     ["NSAIDs"],
            family:   ["Diabetes Mellitus", "Hypertension"],
            social:   []
        },
        examPriority: ["gen_vitals", "gen_signs_stigmata", "cvs_inspection", "resp_auscultation", "neph_fluid_status"],
        labHints:   ["Creatinine", "BUN", "Total Protein", "Albumin", "Urine Protein", "HbA1c", "Lipid Profile"],
        radioHints: ["Urinalysis", "Abdominal US"]
    },
    {
        id: "hx_polyuria",
        name: "Polyuria",
        systems: ["NEPH", "GU", "GEN"],
        searchTerms: ["frequent urination", "nocturia", "polyuria", "كثرة التبول", "تبول ليلي"],
        globalRank: 19,
        template: "urine_output",
        customAttributes: [
            { id: "polydipsia",   label: "Excessive thirst (Polydipsia)?", type: "toggle" },
            { id: "weight_loss",  label: "Unintentional weight loss?",     type: "toggle" },
            { id: "stream",       label: "Poor stream / hesitancy?",       type: "toggle" }
        ],
        correlations: {
            medical:  ["Diabetes Mellitus", "BPH", "Prostate Disease", "CKD", "Heart Failure"],
            surgical: [],
            drug:     [],
            family:   ["Diabetes Mellitus"],
            social:   ["Alcohol"]
        },
        examPriority: ["gen_vitals", "gen_hydration", "gu_bladder", "gi_dre"],
        labHints:   ["Sodium (Na)", "Potassium (K)", "Creatinine", "BUN", "HbA1c", "Calcium"],
        radioHints: ["Urinalysis", "Abdominal US", "Pelvic US"]
    },
    {
        id: "hx_palpitations",
        name: "Palpitations",
        systems: ["CVS", "ENDO"],
        searchTerms: ["heart racing", "fluttering", "fast heartbeat", "رفرفة", "ضربات قلب سريعة"],
        globalRank: 2,
        template: "palpitations",
        customAttributes: [
            { id: "chest_pain", label: "Associated Chest Pain?", type: "toggle" },
            { id: "sob",        label: "Associated Shortness of Breath?", type: "toggle" },
            { id: "caffeine",   label: "High caffeine/stimulant intake?", type: "toggle" }
        ],
        correlations: {
            medical:  ["Ischemic Heart Disease", "Heart Failure", "Hypertension"],
            surgical: [],
            drug:     ["Beta Blockers", "Asthma inhalers (SABA)"],
            family:   ["Sudden cardiac death"],
            social:   ["Smoking", "Illicit Drugs", "Alcohol"]
        },
        examPriority: ["gen_vitals", "cvs_pulses", "cvs_auscultation", "endo_thyroid"],
        labHints:   ["Potassium (K)", "Magnesium", "TSH", "Troponin I", "Hemoglobin (Hb)"],
        radioHints: ["ECG", "Echocardiogram"]
    },
    {
        id: "hx_syncope",
        name: "Syncope",
        systems: ["CVS", "CNS"],
        searchTerms: ["fainting", "passed out", "blackout", "loss of consciousness", "إغماء", "فقدان الوعي"],
        globalRank: 3,
        template: "syncope",
        customAttributes: [
            { id: "tongue_bite", label: "Tongue biting or incontinence?", type: "toggle" },
            { id: "exertional",  label: "Happened during exertion?",      type: "toggle" },
            { id: "hx_cardiac",  label: "Known heart condition?",         type: "toggle" }
        ],
        correlations: {
            medical:  ["Heart Failure", "Ischemic Heart Disease", "Epilepsy", "Diabetes Mellitus"],
            surgical: [],
            drug:     ["Beta Blockers", "Nitrates", "Insulin/OHAs"],
            family:   ["Sudden cardiac death"],
            social:   []
        },
        examPriority: ["gen_vitals", "cvs_auscultation", "cns_consciousness", "cvs_pulses"],
        labHints:   ["Hemoglobin (Hb)", "Sodium (Na)", "Potassium (K)", "Troponin I"],
        radioHints: ["ECG", "Echocardiogram", "CT Brain", "Carotid Doppler US"]
    },
    {
        id: "hx_jaundice",
        name: "Jaundice",
        systems: ["GI", "GEN"],
        searchTerms: ["yellow skin", "yellow eyes", "icterus", "صفراء", "يرقان"],
        globalRank: 4,
        template: "generic",
        customAttributes: [
            { id: "pain",        label: "Associated abdominal pain?",     type: "toggle" },
            { id: "urine_stool", label: "Dark urine / Pale stool?",       type: "toggle" },
            { id: "pruritus",    label: "Itching (Pruritus)?",            type: "toggle" },
            { id: "fever",       label: "Associated Fever?",              type: "toggle" }
        ],
        correlations: {
            medical:  ["Gallstones", "Liver Cirrhosis", "Portal Hypertension", "Malignancy"],
            surgical: ["Cholecystectomy"],
            drug:     ["Warfarin/DOACs", "Recent Antibiotics"],
            family:   [],
            social:   ["Alcohol", "Illicit Drugs"]
        },
        examPriority: ["gen_vitals", "gen_signs_stigmata", "gi_palpation", "gi_insp"],
        labHints:   ["Total Bilirubin", "Direct Bilirubin", "ALT (SGPT)", "AST (SGOT)", "Alkaline Phosphatase (ALP)", "PT", "INR"],
        radioHints: ["Abdominal US", "CT Abdomen & Pelvis"]
    },
    {
        id: "hx_constipation",
        name: "Constipation",
        systems: ["GI", "ENDO"],
        searchTerms: ["no stool", "obstipation", "hard stool", "إمساك"],
        globalRank: 2,
        template: "generic",
        customAttributes: [
            { id: "last_bm",      label: "Days since last bowel movement", type: "number", min: 1, max: 30 },
            { id: "flatus",       label: "Passing gas (flatus)?",          type: "toggle" },
            { id: "distension",   label: "Abdominal distension?",          type: "toggle" },
            { id: "weight_loss",  label: "Unintentional weight loss?",     type: "toggle" }
        ],
        correlations: {
            medical:  ["Diabetes Mellitus", "Malignancy"],
            surgical: ["Previous abdominal surgery"],
            drug:     ["Opioids", "Anticholinergics", "Iron supplements"],
            family:   ["Malignancy"],
            social:   []
        },
        examPriority: ["gen_vitals", "gi_insp", "gi_palpation", "gi_perc_ausc", "gi_dre"],
        labHints:   ["Potassium (K)", "Calcium", "TSH", "Hemoglobin (Hb)"],
        radioHints: ["KUB X-Ray", "CT Abdomen & Pelvis"]
    }
];

// =============================================
// EXAMS (Template Based)
// =============================================
const HX_EXAMS = [
    // ── General Look ──────────────────────────────────
    { id: "gen_appearance", system: "GEN", section: "Appearance", desc: "Consciousness, distress, habitus", rank: 1, template: [
        { id: "loc", label: "Consciousness", type: "chips", options: ["Alert", "Confused", "Lethargic", "Comatose"] },
        { id: "distress", label: "Distress", type: "toggle" },
        { id: "habitus", label: "Habitus", type: "chips", options: ["Average", "Cachectic", "Obese"] }
    ]},
    { id: "gen_signs", system: "GEN", section: "Stigmata", desc: "Pallor, jaundice, cyanosis, etc.", rank: 2, template: [
        { id: "pallor", label: "Pallor", type: "toggle" },
        { id: "jaundice", label: "Jaundice", type: "toggle" },
        { id: "cyanosis", label: "Cyanosis", type: "chips", options: ["None", "Central", "Peripheral"] },
        { id: "clubbing", label: "Clubbing", type: "toggle" },
        { id: "lymph", label: "Lymphadenopathy", type: "toggle" }
    ]},
    { id: "gen_hydration", system: "GEN", section: "Hydration", desc: "Volume status", rank: 3, template: [
        { id: "mucosa", label: "Mucosa", type: "chips", options: ["Moist", "Dry"] },
        { id: "turgor", label: "Skin Turgor", type: "chips", options: ["Normal", "Decreased", "Tenting"] },
        { id: "cap_refill", label: "Cap Refill", type: "chips", options: ["< 2s", "> 2s"] }
    ]},
    // ── Respiratory ───────────────────────────────────
    { id: "resp_insp", system: "RESP", section: "Inspection", desc: "Chest shape, effort", rank: 1, template: [
        { id: "effort", label: "Effort", type: "chips", options: ["Normal", "Use of accessory muscles", "Retractions"] },
        { id: "shape", label: "Shape", type: "chips", options: ["Normal", "Barrel", "Pectus Excavatum", "Pectus Carinatum"] },
        { id: "symmetry", label: "Symmetry", type: "chips", options: ["Symmetrical", "Asymmetrical expansion"] }
    ]},
    { id: "resp_palp_perc", system: "RESP", section: "Palpation & Percussion", desc: "Trachea, percussion note", rank: 2, template: [
        { id: "trachea", label: "Trachea", type: "chips", options: ["Central", "Deviated Left", "Deviated Right"] },
        { id: "percussion", label: "Percussion", type: "chips", options: ["Resonant", "Dull", "Stony Dull", "Hyper-resonant"] }
    ]},
    { id: "resp_ausc", system: "RESP", section: "Auscultation", desc: "Air entry, added sounds", rank: 3, template: [
        { id: "air_entry", label: "Air Entry", type: "chips", options: ["Equal bilaterally", "Decreased Left", "Decreased Right", "Globally decreased"] },
        { id: "breath_sounds", label: "Breath Sounds", type: "chips", options: ["Vesicular", "Bronchial"] },
        { id: "added", label: "Added Sounds", type: "chips", options: ["None", "Wheezes", "Crepitations/Crackles", "Pleural Rub"] }
    ]},
    // ── CVS ───────────────────────────────────────────
    { id: "cvs_insp", system: "CVS", section: "Inspection & Palpation", desc: "JVP, heaves, thrills", rank: 1, template: [
        { id: "jvp", label: "JVP", type: "chips", options: ["Normal", "Elevated", "Not visible"] },
        { id: "apex", label: "Apex Beat", type: "chips", options: ["Normal", "Displaced", "Heaving"] },
        { id: "thrills", label: "Thrills/Heaves", type: "toggle" },
        { id: "edema", label: "LL Edema", type: "chips", options: ["None", "Trace", "Pitting", "Non-pitting"] }
    ]},
    { id: "cvs_ausc", system: "CVS", section: "Auscultation", desc: "Heart sounds, murmurs", rank: 2, template: [
        { id: "s1s2", label: "S1 & S2", type: "chips", options: ["Normal", "Muffled", "Split"] },
        { id: "murmur", label: "Murmurs", type: "chips", options: ["None", "Systolic", "Diastolic", "Continuous"] },
        { id: "added", label: "Added Sounds", type: "chips", options: ["None", "S3 Gallop", "S4 Gallop", "Friction Rub"] }
    ]},
    { id: "cvs_pulses", system: "CVS", section: "Pulses", desc: "Peripheral pulses", rank: 3, template: [
        { id: "rhythm", label: "Rhythm", type: "chips", options: ["Regular", "Irregularly Irregular", "Regularly Irregular"] },
        { id: "character", label: "Character/Volume", type: "chips", options: ["Normal", "Weak/Thready", "Bounding", "Collapsing"] },
        { id: "equality", label: "Equality", type: "chips", options: ["Equal", "Radio-radial delay", "Radio-femoral delay"] }
    ]},
    // ── GI ────────────────────────────────────────────
    { id: "gi_insp", system: "GI", section: "Inspection", desc: "Contour, scars", rank: 1, template: [
        { id: "contour", label: "Contour", type: "chips", options: ["Flat", "Scaphoid", "Distended"] },
        { id: "scars", label: "Scars/Striae", type: "toggle" },
        { id: "other", label: "Other Findings", type: "chips", options: ["None", "Caput Medusae", "Visible Pulsation", "Hernia"] }
    ]},
    { id: "gi_palp", system: "GI", section: "Palpation", desc: "Tenderness, masses, organs", rank: 2, template: [
        { id: "softness", label: "Softness", type: "chips", options: ["Soft/Lax", "Guarding", "Rigidity"] },
        { id: "tenderness", label: "Tenderness", type: "chips", options: ["None", "Epigastric", "RUQ", "RLQ", "LUQ", "LLQ", "Suprapubic", "Generalized"] },
        { id: "rebound", label: "Rebound Tenderness", type: "toggle" },
        { id: "organomegaly", label: "Organomegaly", type: "chips", options: ["None", "Hepatomegaly", "Splenomegaly", "Both"] },
        { id: "mass", label: "Palpable Mass", type: "toggle" }
    ]},
    { id: "gi_perc_ausc", system: "GI", section: "Percussion & Auscultation", desc: "Bowel sounds, ascites", rank: 3, template: [
        { id: "bowel_sounds", label: "Bowel Sounds", type: "chips", options: ["Normal", "Hyperactive", "Sluggish", "Absent"] },
        { id: "ascites", label: "Ascites Signs", type: "chips", options: ["None", "Shifting Dullness", "Fluid Thrill"] },
        { id: "bruits", label: "Bruits", type: "toggle" }
    ]},
    { id: "gi_dre", system: "GI", section: "Digital Rectal Exam", desc: "Tone, masses, blood", rank: 4, template: [
        { id: "tone", label: "Sphincter Tone", type: "chips", options: ["Normal", "Decreased", "Increased"] },
        { id: "stool", label: "Stool Color", type: "chips", options: ["Brown", "Melena", "Fresh Blood", "Pale/Clay"] },
        { id: "prostate", label: "Prostate", type: "chips", options: ["Normal", "Enlarged", "Nodular/Hard", "Tender"] },
        { id: "mass", label: "Rectal Mass", type: "toggle" }
    ]},
    // ── CNS ───────────────────────────────────────────
    { id: "cns_cranial", system: "CNS", section: "Cranial Nerves", desc: "Pupils, facial symmetry", rank: 1, template: [
        { id: "pupils", label: "Pupils", type: "chips", options: ["PEARL", "Anisocoria", "Sluggish", "Fixed/Dilated", "Pinpoint"] },
        { id: "face", label: "Facial Symmetry", type: "chips", options: ["Symmetrical", "UMN Lesion", "LMN Lesion"] },
        { id: "eyes", label: "Eye Movements", type: "chips", options: ["Intact", "Ophthalmoplegia", "Nystagmus"] }
    ]},
    { id: "cns_motor", system: "CNS", section: "Motor System", desc: "Tone, power, reflexes", rank: 2, template: [
        { id: "tone", label: "Tone", type: "chips", options: ["Normal", "Hypertonia", "Hypotonia", "Spasticity", "Rigidity"] },
        { id: "power", label: "Power", type: "chips", options: ["Normal (5/5)", "Mild Weakness (4/5)", "Severe Weakness (<3/5)", "Hemiparesis", "Paraparesis"] },
        { id: "reflexes", label: "Reflexes", type: "chips", options: ["Normal", "Hyperreflexia", "Hyporeflexia", "Areflexia"] },
        { id: "plantar", label: "Plantar Reflex", type: "chips", options: ["Flexor (Normal)", "Extensor (Babinski)", "Equivocal"] }
    ]},
    { id: "cns_sens_coord", system: "CNS", section: "Sensory & Coordination", desc: "Sensation, cerebellar signs", rank: 3, template: [
        { id: "sensation", label: "Sensation", type: "chips", options: ["Intact", "Glove & Stocking Loss", "Sensory Level", "Hemisensory Loss"] },
        { id: "coordination", label: "Coordination", type: "chips", options: ["Intact", "Dysmetria", "Dysdiadochokinesia", "Ataxic Gait"] },
        { id: "meningeal", label: "Meningeal Signs", type: "chips", options: ["None", "Neck Stiffness", "Kernig's", "Brudzinski's"] }
    ]},
    // ── GU & Nephrology ───────────────────────────────
    { id: "gu_exam", system: "GU", section: "Genitourinary", desc: "CVA, bladder, genitalia", rank: 1, template: [
        { id: "cva", label: "CVA Tenderness", type: "chips", options: ["None", "Right", "Left", "Bilateral"] },
        { id: "bladder", label: "Palpable Bladder", type: "toggle" },
        { id: "genitalia", label: "External Genitalia", type: "chips", options: ["Normal", "Ulcers", "Discharge", "Rash"] }
    ]},
    { id: "neph_exam", system: "NEPH", section: "Nephrology", desc: "Kidneys, fluid status", rank: 1, template: [
        { id: "kidneys", label: "Kidneys", type: "chips", options: ["Not Palpable", "Palpable Right", "Palpable Left", "Bilateral Ballotable"] },
        { id: "fluid", label: "Fluid Status", type: "chips", options: ["Euvolemic", "Overloaded", "Depleted"] },
        { id: "fistula", label: "AV Fistula", type: "chips", options: ["N/A", "Functioning (Thrill/Bruit)", "Failed/Thrombosed"] }
    ]},
    // ── MSK ───────────────────────────────────────────
    { id: "msk_exam", system: "MSK", section: "Joints & Spine", desc: "Swelling, ROM, spine", rank: 1, template: [
        { id: "inspection", label: "Inspection", type: "chips", options: ["Normal", "Swelling", "Erythema", "Deformity"] },
        { id: "palpation", label: "Palpation", type: "chips", options: ["Non-tender", "Warmth", "Tenderness", "Effusion"] },
        { id: "rom", label: "Range of Motion", type: "chips", options: ["Full", "Restricted Active", "Restricted Passive", "Painful"] },
        { id: "spine", label: "Spine", type: "chips", options: ["Normal", "Tenderness", "Step-off", "Positive SLR"] }
    ]},
    // ── OBS / GYN ─────────────────────────────────────
    { id: "obs_exam", system: "OBS", section: "Obstetrics / Gynecology", desc: "Fundus, FHR, PV", rank: 1, template: [
        { id: "fundus", label: "Fundal Height", type: "chips", options: ["Consistent with dates", "Large for dates", "Small for dates"] },
        { id: "lie", label: "Lie/Presentation", type: "chips", options: ["Longitudinal/Cephalic", "Breech", "Transverse"] },
        { id: "fhr", label: "Fetal Heart Rate", type: "chips", options: ["Normal (110-160)", "Tachycardia", "Bradycardia", "Absent"] },
        { id: "pv", label: "Pelvic Exam", type: "chips", options: ["Normal", "Bleeding", "Discharge", "Cervical Motion Tenderness"] }
    ]},
    // ── Endocrine ─────────────────────────────────────
    { id: "endo_thyroid", system: "ENDO", section: "Thyroid Exam", desc: "Inspection, palpation, eye signs", rank: 1, template: [
        { id: "size", label: "Thyroid Size", type: "chips", options: ["Normal", "Goiter (Diffuse)", "Nodular"] },
        { id: "bruit", label: "Thyroid Bruit", type: "toggle" },
        { id: "eye_signs", label: "Eye Signs (Exophthalmos/Lid Lag)", type: "toggle" },
        { id: "tremor", label: "Fine Tremor", type: "toggle" }
    ]},
    { id: "endo_diabetic", system: "ENDO", section: "Diabetic Foot & Signs", desc: "Ulcers, neuropathy", rank: 2, template: [
        { id: "ulcers", label: "Foot Ulcers", type: "toggle" },
        { id: "pulses", label: "Pedal Pulses", type: "chips", options: ["Intact", "Diminished", "Absent"] },
        { id: "neuropathy", label: "Sensory Loss (Monofilament)", type: "toggle" },
        { id: "acanthosis", label: "Acanthosis Nigricans", type: "toggle" }
    ]}
];

// =============================================
// RADIOLOGY & OBSERVATIONAL STUDIES
// =============================================
const HX_RADIOLOGY = [
    { id: "rad_cxr",          name: "Chest X-Ray",                     modalities: ["X-Ray"],     regions: ["Chest"],         systems: ["RESP", "CVS"] },
    { id: "rad_kub",          name: "KUB X-Ray",                       modalities: ["X-Ray"],     regions: ["Abdomen"],       systems: ["GI", "GU", "NEPH"] },
    { id: "rad_xray_spine",   name: "X-Ray Spine",                     modalities: ["X-Ray"],     regions: ["Spine"],         systems: ["MSK", "CNS"] },
    { id: "rad_us_abd",       name: "Abdominal US",                    modalities: ["US"],        regions: ["Abdomen"],       systems: ["GI", "GU", "NEPH"] },
    { id: "rad_us_pelvis",    name: "Pelvic US",                       modalities: ["US"],        regions: ["Pelvis"],        systems: ["GU", "OBS", "NEPH"] },
    { id: "rad_doppler_ll",   name: "Doppler US Lower Limbs",          modalities: ["US"],        regions: ["Extremities"],   systems: ["CVS"] },
    { id: "rad_renal_doppler",name: "Renal Doppler US",                modalities: ["US"],        regions: ["Abdomen"],       systems: ["NEPH", "CVS"] },
    { id: "rad_echo",         name: "Echocardiogram",                  modalities: ["US"],        regions: ["Chest"],         systems: ["CVS"] },
    { id: "rad_ct_brain",     name: "CT Brain",                        modalities: ["CT"],        regions: ["Brain"],         systems: ["CNS"] },
    { id: "rad_ct_chest",     name: "CT Chest",                        modalities: ["CT"],        regions: ["Chest"],         systems: ["RESP"] },
    { id: "rad_ctpa",         name: "CT Pulmonary Angiography (CTPA)", modalities: ["CT"],        regions: ["Chest"],         systems: ["RESP", "CVS"] },
    { id: "rad_ct_abd",       name: "CT Abdomen & Pelvis",             modalities: ["CT"],        regions: ["Abdomen"],       systems: ["GI", "GU", "NEPH"] },
    { id: "rad_ct_kub",       name: "CT KUB",                          modalities: ["CT"],        regions: ["Abdomen", "Pelvis"], systems: ["NEPH", "GU"] },
    { id: "rad_mri_brain",    name: "MRI Brain",                       modalities: ["MRI"],       regions: ["Brain"],         systems: ["CNS"] },
    { id: "rad_mri_spine",    name: "MRI Spine",                       modalities: ["MRI"],       regions: ["Spine"],         systems: ["CNS", "MSK"] },
    { id: "rad_ecg",          name: "ECG",                             modalities: ["ECG"],       regions: ["Chest"],         systems: ["CVS"] },
    { id: "rad_endoscopy",    name: "Upper Endoscopy",                 modalities: ["Endoscopy"], regions: ["Abdomen"],       systems: ["GI"] },
    { id: "rad_colonoscopy",  name: "Colonoscopy",                     modalities: ["Endoscopy"], regions: ["Abdomen"],       systems: ["GI"] },
    { id: "rad_urinalysis",   name: "Urinalysis",                      modalities: ["Other"],     regions: ["Genitourinary"], systems: ["GU", "GEN", "NEPH"] },
    { id: "rad_urine_cult",   name: "Urine Culture",                   modalities: ["Other"],     regions: ["Genitourinary"], systems: ["GU", "GEN", "NEPH"] },
    { id: "rad_blood_cult",   name: "Blood Culture",                   modalities: ["Other"],     regions: ["Systemic"],      systems: ["GEN", "CVS"] },
    { id: "rad_sputum_cult",  name: "Sputum Culture",                  modalities: ["Other"],     regions: ["Respiratory"],   systems: ["RESP", "GEN"] },
    { id: "rad_stool_analysis",name:"Stool Analysis",                  modalities: ["Other"],     regions: ["Gastrointestinal"],systems:["GI"] },
    { id: "rad_tox_screen",   name: "Toxicology Screen",               modalities: ["Other"],     regions: ["Systemic"],      systems: ["GEN", "CNS"] },
    { id: "rad_lp",           name: "Lumbar Puncture (CSF Analysis)",  modalities: ["Other"],     regions: ["Spine", "Brain"],systems: ["CNS"] },
    { id: "rad_doppler_carotid", name: "Carotid Doppler US",           modalities: ["US"],        regions: ["Neck"],          systems: ["CVS", "CNS"] }
];

// =============================================
// LABS (Numeric Only)
// =============================================
const HX_LABS = [
    { name: "Hemoglobin (Hb)", min: 12.0, max: 16.0, unit: "g/dL" },
    { name: "WBC",             min: 4.0,  max: 11.0,  unit: "x10^9/L" },
    { name: "Platelets",       min: 150,  max: 400,   unit: "x10^9/L" },
    { name: "MCV",             min: 80,   max: 100,   unit: "fL" },
    { name: "Sodium (Na)",     min: 135,  max: 145,   unit: "mEq/L" },
    { name: "Potassium (K)",   min: 3.5,  max: 5.1,   unit: "mEq/L" },
    { name: "Calcium",         min: 8.5,  max: 10.5,  unit: "mg/dL" },
    { name: "Magnesium",       min: 1.7,  max: 2.2,   unit: "mg/dL" },
    { name: "Creatinine",      min: 0.6,  max: 1.2,   unit: "mg/dL" },
    { name: "BUN",             min: 7,    max: 20,    unit: "mg/dL" },
    { name: "Urea",            min: 10,   max: 50,    unit: "mg/dL" },
    { name: "ALT (SGPT)",      min: 7,    max: 56,    unit: "U/L" },
    { name: "AST (SGOT)",      min: 10,   max: 40,    unit: "U/L" },
    { name: "Total Bilirubin", min: 0.1,  max: 1.2,   unit: "mg/dL" },
    { name: "Ammonia",         min: 15,   max: 45,    unit: "µg/dL" },
    { name: "Amylase",         min: 30,   max: 110,   unit: "U/L" },
    { name: "Lipase",          min: 0,    max: 160,   unit: "U/L" },
    { name: "CRP",             min: 0,    max: 10,    unit: "mg/L" },
    { name: "ESR",             min: 0,    max: 20,    unit: "mm/hr" },
    { name: "Procalcitonin",   min: 0,    max: 0.15,  unit: "ng/mL" },
    { name: "Troponin I",      min: 0,    max: 0.04,  unit: "ng/mL" },
    { name: "D-Dimer",         min: 0,    max: 0.50,  unit: "mg/L" },
    { name: "PT",              min: 11,   max: 13.5,  unit: "sec" },
    { name: "PTT",             min: 25,   max: 35,    unit: "sec" },
    { name: "INR",             min: 0.8,  max: 1.1,   unit: "" },
    { name: "HbA1c",           min: 0,    max: 5.7,   unit: "%" },
    { name: "TSH",             min: 0.4,  max: 4.0,   unit: "mIU/L" },
    { name: "pH",              min: 7.35, max: 7.45,  unit: "" },
    { name: "pCO2",            min: 35,   max: 45,    unit: "mmHg" },
    { name: "pO2",             min: 80,   max: 100,   unit: "mmHg" },
    { name: "HCO3",            min: 22,   max: 26,    unit: "mEq/L" },
    { name: "Lactate",         min: 0.5,  max: 1.0,   unit: "mmol/L" },
    { name: "Total Protein",   min: 6.0,  max: 8.3,   unit: "g/dL" },
    { name: "Albumin",         min: 3.5,  max: 5.0,   unit: "g/dL" },
    { name: "Urine Protein",   min: 0,    max: 14,    unit: "mg/dL" },
    { name: "eGFR",            min: 90,   max: 120,   unit: "mL/min" },
    { name: "Phosphorus",      min: 2.5,  max: 4.5,   unit: "mg/dL" },
    { name: "PTH",             min: 15,   max: 65,    unit: "pg/mL" },
    { name: "Alkaline Phosphatase (ALP)", min: 44, max: 147, unit: "U/L" },
    { name: "Direct Bilirubin",           min: 0.0, max: 0.3, unit: "mg/dL" },
    { name: "BNP",                        min: 0,   max: 100, unit: "pg/mL" },
    { name: "Base Excess (BE)",           min: -2,  max: 2,   unit: "mEq/L" },
    { name: "Total Cholesterol",          min: 0,   max: 200, unit: "mg/dL" },
    { name: "LDL",                        min: 0,   max: 100, unit: "mg/dL" },
    { name: "HDL",                        min: 40,  max: 60,  unit: "mg/dL" },
    { name: "Triglycerides",              min: 0,   max: 150, unit: "mg/dL" }
];
