// =============================================
// sheet.js — Smart Hx Knowledge Base
// =============================================

const HX_SYSTEMS = {
    GEN:  { name: "General Look",      icon: "🧍",  color: "#10b981" },
    GI:   { name: "Gastrointestinal",  icon: "🍏",  color: "#f59e0b" },
    CVS:  { name: "Cardiovascular",    icon: "❤️",  color: "#ef4444" },
    RESP: { name: "Respiratory",       icon: "🫁",  color: "#3b82f6" },
    CNS:  { name: "Neurological",      icon: "🧠",  color: "#8b5cf6" },
    GU:   { name: "Genitourinary",     icon: "💧",  color: "#06b6d4" },
    OBS:  { name: "OBS/GYN",           icon: "🤰",  color: "#ec4899" },
    MSK:  { name: "Musculoskeletal",   icon: "🦴",  color: "#d97706" },
    NEPH: { name: "Nephrology",        icon: "🫘",  color: "#a855f7" },
    ENDO: { name: "Endocrine",         icon: "🦋",  color: "#f97316" },
    DERM: { name: "Dermatology",       icon: "🩹",  color: "#f43f5e" },
    ENT:  { name: "ENT",               icon: "👂",  color: "#14b8a6" },
    HEME: { name: "Hematology",        icon: "🩸",  color: "#dc2626" },
    PSYCH:{ name: "Psychiatry",        icon: "🧩",  color: "#6366f1" }
};

// =============================================
// BASELINE PAST HISTORY SUGGESTIONS
// =============================================
const HX_BASELINE_PAST = {
    medical:  ['Hypertension', 'Diabetes Mellitus', 'IHD', 'Heart Failure', 'CKD', 'Asthma', 'COPD', 'Atrial Fibrillation', 'DVT/PE', 'Epilepsy', 'Thyroid Disease', 'Liver Cirrhosis', 'Stroke/TIA', 'Rheumatic Heart Disease', 'Dyslipidemia'],
    surgical: ['Appendectomy', 'Cholecystectomy', 'Hernia Repair', 'Tonsillectomy', 'C-Section', 'Joint Replacement', 'Thyroidectomy', 'TURP', 'Pacemaker/ICD'],
    drug:     ['Aspirin', 'Metformin', 'Insulin', 'Amlodipine', 'Losartan', 'Atorvastatin', 'Omeprazole', 'Salbutamol Inhaler', 'Levothyroxine', 'Warfarin', 'Enoxaparin', 'Furosemide', 'ACE Inhibitors', 'Clopidogrel'],
    family:   ['Diabetes Mellitus', 'Hypertension', 'Malignancy', 'IHD', 'Stroke', 'Thyroid Disease', 'Asthma', 'CKD', 'PKD', 'Sickle Cell Disease'],
    social:   ['Smoking', 'Alcohol', 'Illicit Drugs', 'Pets/Animal Contact', 'Travel History', 'Occupational Exposure']
};

// =============================================
// EXCLUSION RULES
// =============================================
const HX_EXCLUSIONS = {
    // ── Social History ───────────────────────────────────────────────────────
    'Smoking':                               { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Alcohol':                               { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Illicit Drugs':                         { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Occupational Exposure':                 { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Travel History':                        { },
    'Pets/Animal Contact':                   { },

    // ── Medical History ──────────────────────────────────────────────────────
    'Hypertension':                          { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Diabetes Mellitus':                     { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'IHD':                                   { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Heart Failure':                         { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'CKD':                                   { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Liver Cirrhosis':                       { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Portal Hypertension':                   { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Dyslipidemia':                          { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'DVT/PE':                                { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'COPD':                                  { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Asthma':                                { excludeAgeGroups: ['Neonate'] },
    'Dementia':                              { excludeAgeGroups: ['Neonate', 'Pediatric', 'Adolescent', 'Adult'] },
    'Gallstones':                            { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Epilepsy':                              { },
    'Migraine':                              { excludeAgeGroups: ['Neonate'] },
    'SAH':                                   { excludeAgeGroups: ['Neonate'] },
    'Inflammatory Bowel Disease':            { excludeAgeGroups: ['Neonate'] },
    'Peptic Ulcer Disease':                  { excludeAgeGroups: ['Neonate'] },
    'GERD':                                  { },
    'Recurrent UTIs':                        { },
    'Nephrolithiasis':                       { excludeAgeGroups: ['Neonate'] },
    'Tuberculosis':                          { },
    'Polycystic Kidney Disease':             { },
    'Glomerulonephritis':                    { },
    'Atrial Fibrillation':                   { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Stroke/TIA':                            { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Rheumatic Heart Disease':               { },
    'Thyroid Disease':                       { },
    'Sickle Cell Disease':                   { },
    'Anemia':                                { },
    'Meningitis':                            { },
    'Pancreatitis':                          { excludeAgeGroups: ['Neonate'] },
    'STIs':                                  { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Bladder Ca':                            { excludeAgeGroups: ['Neonate', 'Pediatric', 'Adolescent'] },
    'BPPV':                                  { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Vestibular Neuritis':                   { excludeAgeGroups: ['Neonate'] },
    'Aortic Stenosis':                       { },
    'HOCM':                                  { },
    'SVT':                                   { },
    'Arrhythmias':                           { },
    'Nephrotic Syndrome':                    { },
    'Lupus Nephritis':                       { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Viral Hepatitis':                       { },
    'Cholangitis':                           { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Hemolytic Anemia':                      { },
    'Pancreatic Ca':                         { excludeAgeGroups: ['Neonate', 'Pediatric', 'Adolescent', 'Adult'] },
    'IgA Nephropathy':                       { },
    'Mallory-Weiss Tear':                    { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Esophageal Varices':                    { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Intestinal Obstruction':                { },
    'Sepsis':                                { },
    'Hypovolemia':                           { },
    'Pericarditis':                          { },
    'Aortic Dissection':                     { excludeAgeGroups: ['Neonate', 'Pediatric', 'Adolescent'] },
    'Parkinson\'s Disease':                  { excludeAgeGroups: ['Neonate', 'Pediatric', 'Adolescent', 'Adult'] },
    'Thyrotoxicosis':                        { },
    'Hypothyroidism':                        { },
    'Diabetes Insipidus':                    { },
    'Hypercalcemia':                         { },
    'Cellulitis':                            { },
    'Diverticular Disease':                  { excludeAgeGroups: ['Neonate', 'Pediatric', 'Adolescent'] },
    'Hemorrhoids':                           { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Colorectal Cancer':                     { excludeAgeGroups: ['Neonate', 'Pediatric', 'Adolescent'] },
    'Intracranial Mass':                     { },
    'Lung Cancer':                           { excludeAgeGroups: ['Neonate', 'Pediatric', 'Adolescent'] },
    'Bronchiectasis':                        { },
    'AAA':                                   { excludeAgeGroups: ['Neonate', 'Pediatric', 'Adolescent', 'Adult'] },
    'Spinal Infection':                      { },
    'Gout':                                  { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Rheumatoid Arthritis':                  { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Osteoarthritis':                        { excludeAgeGroups: ['Neonate', 'Pediatric', 'Adolescent'] },
    'Ankylosing Spondylitis':                { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Psoriatic Arthritis':                   { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Reactive Arthritis':                    { excludeAgeGroups: ['Neonate'] },
    'Septic Arthritis':                      { },
    'SLE':                                   { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Polycystic Ovarian Syndrome (PCOS)':    { excludeSex: ['Male'], excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Esophageal Cancer':                     { excludeAgeGroups: ['Neonate', 'Pediatric', 'Adolescent'] },
    'Achalasia':                             { excludeAgeGroups: ['Neonate'] },
    'Pyelonephritis':                        { },
    'Epididymo-orchitis':                    { excludeSex: ['Female'], excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Infectious Mononucleosis':              { },
    'Peritonsillar Abscess':                 { excludeAgeGroups: ['Neonate'] },

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
    'Hernia Repair':                         { },
    'Tonsillectomy':                         { },
    'TURP':                                  { excludeSex: ['Female'], excludeAgeGroups: ['Neonate', 'Pediatric', 'Adolescent', 'Adult'] },
    'Thyroidectomy':                         { excludeAgeGroups: ['Neonate'] },
    'Joint Replacement':                     { excludeAgeGroups: ['Neonate', 'Pediatric', 'Adolescent'] },
    'Peritoneal Dialysis':                   { excludeAgeGroups: ['Neonate'] },
    'Pacemaker/ICD':                         { excludeAgeGroups: ['Neonate', 'Pediatric'] },

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
    'ACE Inhibitors':                        { excludeAgeGroups: ['Neonate'] },
    'ARBs':                                  { excludeAgeGroups: ['Neonate'] },
    'Diuretics':                             { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'CCBs':                                  { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Antiepileptics':                        { },
    'PPIs':                                  { excludeAgeGroups: ['Neonate'] },
    'Metformin':                             { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Levothyroxine':                         { },
    'Iron Supplements':                      { },
    'Clopidogrel':                           { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Amlodipine':                            { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Digoxin':                               { excludeAgeGroups: ['Neonate'] },
    'Lithium':                               { excludeAgeGroups: ['Neonate', 'Pediatric'] },
    'Furosemide':                            { excludeAgeGroups: ['Neonate'] },
    'Enoxaparin':                            { excludeAgeGroups: ['Neonate'] },
    'Salbutamol Inhaler':                    { },
    'Chemotherapy':                          { },
    'Amiodarone':                            { excludeAgeGroups: ['Neonate', 'Pediatric'] },

    // ── Family History ───────────────────────────────────────────────────────
    'Premature CAD':                         { excludeAgeGroups: ['Neonate'] },
    'Sudden cardiac death':                  { },
    'Bleeding disorders':                    { },
    'Malignancy':                            { },
    'PKD':                                   { },

    // ── Sex-specific items ───────────────────────────────────────────────────
    'Prostate Disease':                      { excludeSex: ['Female'], excludeAgeGroups: ['Neonate', 'Pediatric', 'Adolescent'] },
    'BPH':                                   { excludeSex: ['Female'], excludeAgeGroups: ['Neonate', 'Pediatric', 'Adolescent', 'Adult'] },
    'Previous C-Section':                    { excludeSex: ['Male'], excludeAgeGroups: ['Neonate', 'Pediatric', 'Adolescent', 'Elderly'] },
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
        { id: "site",        label: "Exact Location",      type: "chips",  options: ["Retrosternal", "Left Sided", "Right Sided", "Diffuse"] },
        { id: "radiation",   label: "Radiation",           type: "chips",  options: ["Left Arm", "Both Arms", "Jaw/Neck", "Back", "None"] },
        { id: "character",   label: "Character",           type: "chips",  options: ["Crushing/Pressure", "Tearing", "Stabbing/Sharp", "Burning", "Aching"] },
        { id: "severity",    label: "Severity (1–10)",     type: "number", min: 1, max: 10 },
        { id: "aggravating", label: "Aggravating Factors", type: "chips",  options: ["Exertion", "Deep Breathing", "Lying Flat", "Swallowing", "Palpation", "Emotional Stress"] },
        { id: "relieving",   label: "Relieving Factors",   type: "chips",  options: ["Rest", "GTN", "Leaning Forward", "Sitting Up", "Antacids", "Analgesics", "Nothing"] }
    ],
    pain_abd: [
        { id: "site",        label: "Quadrant / Site",     type: "chips",  options: ["Epigastric", "RUQ", "RLQ", "LUQ", "LLQ", "Suprapubic", "Periumbilical", "Diffuse"] },
        { id: "radiation",   label: "Radiation",           type: "chips",  options: ["Back", "Right Shoulder", "Left Shoulder", "Groin", "None"] },
        { id: "character",   label: "Character",           type: "chips",  options: ["Colicky/Cramping", "Dull Aching", "Sharp/Stabbing", "Burning"] },
        { id: "severity",    label: "Severity (1–10)",     type: "number", min: 1, max: 10 },
        { id: "aggravating", label: "Aggravating",         type: "chips",  options: ["Eating", "Fasting", "Movement", "Coughing", "Deep Breathing"] },
        { id: "relieving",   label: "Relieving",           type: "chips",  options: ["Fasting/NPO", "Antacids", "Vomiting", "Defecation", "Leaning Forward", "Analgesics", "Nothing"] }
    ],
    pain_headache: [
        { id: "site",        label: "Location",            type: "chips",  options: ["Frontal", "Occipital", "Temporal", "Vertex", "Unilateral (Half)", "Holocranial"] },
        { id: "radiation",   label: "Radiation",           type: "chips",  options: ["Neck", "Face", "Eye", "None"] },
        { id: "character",   label: "Character",           type: "chips",  options: ["Throbbing/Pulsating", "Tight Band/Pressure", "Stabbing", "Dull"] },
        { id: "severity",    label: "Severity (1–10)",     type: "number", min: 1, max: 10 },
        { id: "aggravating", label: "Aggravating Factors", type: "chips",  options: ["Coughing/Straining", "Bending Over", "Light", "Noise", "Activity"] },
        { id: "relieving",   label: "Relieving Factors",   type: "chips",  options: ["Rest/Sleep", "Dark Room", "Analgesics", "Vomiting", "Nothing"] }
    ],
    pain_back: [
        { id: "site",        label: "Location",            type: "chips",  options: ["Cervical", "Thoracic", "Lumbar", "Sacral"] },
        { id: "radiation",   label: "Radiation",           type: "chips",  options: ["Down one leg (Sciatica)", "Down both legs", "Arms", "Groin", "None"] },
        { id: "character",   label: "Character",           type: "chips",  options: ["Dull Aching", "Sharp/Shooting", "Spasm-like", "Tearing (Knife-like)"] },
        { id: "severity",    label: "Severity (1–10)",     type: "number", min: 1, max: 10 },
        { id: "aggravating", label: "Aggravating",         type: "chips",  options: ["Bending", "Lifting", "Sitting", "Standing", "Coughing/Sneezing", "Walking"] },
        { id: "relieving",   label: "Relieving",           type: "chips",  options: ["Rest", "Lying Down", "NSAIDs", "Heat", "Position Change", "Nothing"] }
    ],
    bleeding: [
        { id: "amount",     label: "Amount",       type: "chips", options: ["Scant/Streaks", "Moderate (Cup)", "Massive/Profuse"] },
        { id: "color",      label: "Color",        type: "chips", options: ["Bright Red", "Dark Red", "Coffee-ground", "Melena (Black/Tarry)"] },
        { id: "frequency",  label: "Frequency",    type: "chips", options: ["Once", "Occasional", "Frequent", "Continuous"] },
        { id: "clots",      label: "Clots",        type: "chips", options: ["None", "Small Clots", "Large Clots"] },
        { id: "recurrence", label: "First Time?",  type: "toggle" }
    ],
    fever: [
        { id: "chills",       label: "Chills / Rigors",            type: "toggle" },
        { id: "night_sweats", label: "Night Sweats",               type: "toggle" },
        { id: "pattern",      label: "Pattern",                    type: "chips", options: ["Continuous", "Intermittent", "Remittent", "Relapsing/Periodic"] },
        { id: "max_temp",     label: "Max Temp (°C)",              type: "number", min: 37, max: 42 },
        { id: "response",     label: "Responds to Antipyretics?",  type: "toggle" },
        { id: "documented",   label: "Documented?",                type: "toggle" }
    ],
    neuro_ams: [
        { id: "gcs",            label: "GCS (3–15)",                   type: "number", min: 3, max: 15 },
        { id: "orientation",    label: "Orientation",                  type: "chips",  options: ["Oriented x3", "Disoriented to time", "Disoriented to place", "Disoriented to person", "Fully disoriented"] },
        { id: "loc",            label: "Loss of Consciousness?",       type: "toggle" },
        { id: "trauma",         label: "Head Trauma?",                 type: "toggle" },
        { id: "seizures",       label: "Seizures?",                    type: "toggle" },
        { id: "focal_weakness", label: "Focal Neurological Deficit?",  type: "toggle" }
    ],
    palpitations: [
        { id: "onset",       label: "Onset",       type: "chips", options: ["Sudden", "Gradual"] },
        { id: "rhythm",      label: "Sensation",   type: "chips", options: ["Fast & Regular", "Fast & Irregular", "Skipped beats"] },
        { id: "frequency",   label: "How Often?",  type: "chips", options: ["First Episode", "Daily", "Weekly", "Monthly"] },
        { id: "termination", label: "Termination", type: "chips", options: ["Spontaneous", "Vagal Maneuvers", "Medication", "Ongoing"] },
        { id: "syncope",     label: "Syncope?",    type: "toggle" }
    ],
    syncope: [
        { id: "posture",       label: "Posture before event",   type: "chips", options: ["Standing", "Sitting", "Lying down", "Changing posture"] },
        { id: "prodrome",      label: "Warning signs",          type: "chips", options: ["None (Drop attack)", "Nausea/Sweating", "Visual changes", "Palpitations"] },
        { id: "recovery",      label: "Recovery time",          type: "chips", options: ["< 1 min", "1–5 min", "> 5 min", "Prolonged (postictal)"] },
        { id: "injury",        label: "Injury during fall?",    type: "toggle" },
        { id: "witnessed",     label: "Witnessed?",             type: "toggle" },
        { id: "post_confusion",label: "Post-Event Confusion?",  type: "toggle" }
    ],
    dizziness: [
        { id: "type",     label: "Type of Sensation",      type: "chips", options: ["Vertigo (Room spinning)", "Presyncope (Lightheaded)", "Imbalance/Unsteadiness", "Mixed"] },
        { id: "triggers", label: "Head Movement Trigger?", type: "toggle" },
        { id: "hearing",  label: "Hearing Change",         type: "chips", options: ["None", "Tinnitus", "Hearing Loss", "Both"] }
    ],
    urinary: [
        { id: "frequency",    label: "Frequency",      type: "toggle" },
        { id: "urgency",      label: "Urgency",        type: "toggle" },
        { id: "dysuria",      label: "Dysuria",        type: "toggle" },
        { id: "hematuria",    label: "Hematuria",      type: "toggle" },
        { id: "flank_pain",   label: "Flank Pain",     type: "toggle" },
        { id: "nocturia",     label: "Nocturia",       type: "toggle" },
        { id: "incontinence", label: "Incontinence",   type: "toggle" },
        { id: "stream",       label: "Stream",         type: "chips", options: ["Normal", "Weak", "Intermittent", "Dribbling"] }
    ],
    gi_bowel: [
        { id: "frequency",   label: "Frequency per day",  type: "number", min: 1, max: 30 },
        { id: "consistency", label: "Consistency",        type: "chips",  options: ["Watery", "Loose", "Oily/Greasy", "Hard/Pellet-like"] },
        { id: "blood_mucus", label: "Blood or Mucus?",    type: "toggle" },
        { id: "tenesmus",    label: "Tenesmus?",          type: "toggle" },
        { id: "nocturnal",   label: "Nocturnal?",         type: "toggle" }
    ],
    gi_vomiting: [
        { id: "frequency",  label: "Episodes per day",    type: "number", min: 1, max: 50 },
        { id: "content",    label: "Content",             type: "chips",  options: ["Food particles", "Bilious (Green/Yellow)", "Clear/Gastric juice", "Blood/Coffee-ground"] },
        { id: "timing",     label: "Timing",              type: "chips",  options: ["Right After Eating", "30–60 min After", "Hours After", "Morning/Fasting", "Unrelated"] },
        { id: "projectile", label: "Projectile?",         type: "toggle" },
        { id: "nausea",     label: "Nausea First?",       type: "toggle" }
    ],
    edema: [
        { id: "site",        label: "Location",    type: "chips", options: ["Lower Limbs", "Periorbital", "Sacral", "Generalized (Anasarca)"] },
        { id: "laterality",  label: "Laterality",  type: "chips", options: ["Unilateral", "Bilateral", "Generalized"] },
        { id: "timing",      label: "Worse at",    type: "chips", options: ["Morning", "Evening", "Constant"] },
        { id: "progression", label: "Progression", type: "chips", options: ["Worsening", "Stable", "Improving", "Fluctuating"] },
        { id: "pitting",     label: "Pitting",     type: "chips", options: ["Pitting", "Non-Pitting"] },
        { id: "pain",        label: "Painful?",    type: "toggle" }
    ],
    urine_output: [
        { id: "amount",       label: "Amount",        type: "chips", options: ["None (Anuria)", "Very little (Oliguria)", "Normal", "Excessive (Polyuria)"] },
        { id: "thirst",       label: "Thirst?",       type: "toggle" },
        { id: "fluid_intake", label: "Fluid Intake",  type: "chips", options: ["Poor", "Normal", "Increased", "IV Running"] }
    ],
    urine_appearance: [
        { id: "color",  label: "Color",        type: "chips", options: ["Clear", "Dark/Tea-colored", "Red/Pink", "Cloudy/Turbid"] },
        { id: "frothy", label: "Frothy?",      type: "toggle" },
        { id: "smell",  label: "Foul Smell?",  type: "toggle" },
        { id: "clots",  label: "Clots?",       type: "toggle" }
    ],
    pain_joint: [
        { id: "site",      label: "Joint(s) Affected",  type: "text" },
        { id: "pattern",   label: "Pattern",            type: "chips",  options: ["Monoarticular (1)", "Oligoarticular (2–4)", "Polyarticular (5+)"] },
        { id: "symmetry",  label: "Symmetry",           type: "chips",  options: ["Symmetrical", "Asymmetrical"] },
        { id: "stiffness", label: "Morning Stiffness?", type: "toggle" },
        { id: "swelling",  label: "Swelling?",          type: "toggle" },
        { id: "severity",  label: "Severity (1–10)",    type: "number", min: 1, max: 10 }
    ],
    seizure: [
        { id: "type",        label: "Type",            type: "chips", options: ["Tonic-Clonic (Generalized)", "Focal (Partial)", "Absence", "Myoclonic"] },
        { id: "aura",        label: "Aura?",           type: "toggle" },
        { id: "tongue_bite", label: "Tongue Bite?",    type: "toggle" },
        { id: "incontinence",label: "Incontinence?",   type: "toggle" },
        { id: "post_ictal",  label: "Post-Ictal State",type: "chips", options: ["None", "Brief confusion (< 5 min)", "Prolonged confusion (> 30 min)", "Todd's Paresis"] }
    ],
    bleeding_pv: [
        { id: "relation",  label: "Relation to Cycle",        type: "chips",  options: ["Menstrual", "Intermenstrual", "Postcoital", "Postmenopausal"] },
        { id: "amount",    label: "Amount",                   type: "chips",  options: ["Light (< 1 pad/hr)", "Moderate (1–2 pads/hr)", "Heavy (> 2 pads/hr)", "Soaking/Clots"] },
        { id: "gestation", label: "Gestational Age (weeks)",  type: "number", min: 4, max: 42 },
        { id: "products",  label: "Products Passed?",         type: "toggle" }
    ],
    dysphagia: [
        { id: "type",          label: "Type",                  type: "chips", options: ["Solids only", "Liquids only", "Both solids & liquids"] },
        { id: "progressive",   label: "Progressive?",          type: "toggle" },
        { id: "odynophagia",   label: "Odynophagia (Pain)?",   type: "toggle" },
        { id: "regurgitation", label: "Regurgitation?",        type: "toggle" },
        { id: "weight_loss",   label: "Weight Loss?",          type: "toggle" }
    ],
    rash: [
        { id: "distribution", label: "Distribution", type: "chips", options: ["Localized", "Dermatomal", "Sun-exposed", "Flexural", "Extensor surfaces", "Generalized"] },
        { id: "morphology",   label: "Morphology",   type: "chips", options: ["Macule/Patch", "Papule/Plaque", "Vesicle/Bulla", "Pustule", "Urticaria"] },
        { id: "itching",      label: "Itching?",     type: "toggle" },
        { id: "spreading",    label: "Spreading?",   type: "toggle" },
        { id: "fever",        label: "Fever?",       type: "toggle" }
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
            { id: "localizing",   label: "Localizing Source?",  type: "toggle" },
            { id: "sick_contact", label: "Sick Contacts?",      type: "toggle" },
            { id: "travel",       label: "Recent Travel?",      type: "toggle" }
        ],
        correlations: {
            medical:  ["Diabetes Mellitus", "Heart Failure", "CKD", "Malignancy", "Tuberculosis", "Liver Cirrhosis", "SLE"],
            surgical: ["Recent immobilization/surgery", "Central line / Port-a-cath"],
            drug:     ["Immunosuppressants", "Steroids", "Recent Antibiotics"],
            family:   ["Tuberculosis"],
            social:   ["Smoking", "Illicit Drugs", "Travel History", "Pets/Animal Contact"]
        },
        examPriority: ["gen_signs", "resp_ausc", "gi_palp", "cns_sens_coord"],
        labHints:   ["WBC", "CRP", "ESR", "Procalcitonin", "Lactate", "Hemoglobin (Hb)", "Platelets", "Blood Culture", "Urine Culture", "Urinalysis", "Malaria Film", "Blood Film"],
        radioHints: ["Chest X-Ray", "Abdominal US", "CT Abdomen & Pelvis"]
    },
    {
        id: "hx_sob",
        name: "Dyspnea",
        systems: ["RESP", "CVS"],
        searchTerms: ["sob", "dyspnea", "breathless", "shortness of breath", "ضيق تنفس", "نهجان"],
        globalRank: 1,
        template: "generic",
        customAttributes: [
            { id: "orthopnea",          label: "Orthopnea?",            type: "toggle" },
            { id: "pnd",                label: "PND?",                  type: "toggle" },
            { id: "wheezing",           label: "Associated Wheezing?",  type: "toggle" },
            { id: "exercise_tolerance", label: "Exercise Tolerance",    type: "chips", options: ["At Rest", "Minimal Exertion", "Moderate Exertion", "Heavy Exertion Only"] }
        ],
        correlations: {
            medical:  ["Asthma", "COPD", "Heart Failure", "IHD", "DVT/PE", "CKD", "Anemia", "Pericarditis"],
            surgical: ["Recent intubation", "CABG", "Recent immobilization/surgery"],
            drug:     ["Beta Blockers", "Oral Contraceptives", "Amiodarone"],
            family:   ["Asthma", "Sudden cardiac death"],
            social:   ["Smoking", "Occupational Exposure"]
        },
        examPriority: ["resp_insp", "resp_ausc", "cvs_ausc", "gen_signs"],
        labHints:   ["WBC", "Troponin I", "D-Dimer", "pH", "pCO2", "pO2", "HCO3", "Hemoglobin (Hb)", "BNP", "Lactate", "ECG"],
        radioHints: ["Chest X-Ray", "CT Pulmonary Angiography (CTPA)", "Echocardiogram", "V/Q Scan"]
    },
    {
        id: "hx_chest_pain",
        name: "Chest Pain",
        systems: ["CVS", "RESP"],
        searchTerms: ["cp", "chest", "pain", "angina", "ألم بالصدر"],
        globalRank: 1,
        template: "pain_chest",
        customAttributes: [
            { id: "exertional",    label: "Worse with Exertion?",  type: "toggle" },
            { id: "respirophasic", label: "Pleuritic?",            type: "toggle" },
            { id: "diaphoresis",   label: "Diaphoresis?",          type: "toggle" },
            { id: "palpitations",  label: "Palpitations?",         type: "toggle" }
        ],
        correlations: {
            medical:  ["Hypertension", "Diabetes Mellitus", "Dyslipidemia", "IHD", "DVT/PE", "GERD", "Pericarditis", "Aortic Dissection"],
            surgical: ["CABG", "PCI/Stents", "Recent immobilization/surgery"],
            drug:     ["Nitrates", "Beta Blockers", "Aspirin", "Statins", "Oral Contraceptives", "Warfarin/DOACs"],
            family:   ["Premature CAD", "Sudden cardiac death"],
            social:   ["Smoking", "Illicit Drugs"]
        },
        examPriority: ["cvs_ausc", "resp_ausc", "cvs_pulses"],
        labHints:   ["Troponin I", "D-Dimer", "Hemoglobin (Hb)", "Creatinine", "CRP", "ECG"],
        radioHints: ["Chest X-Ray", "CT Pulmonary Angiography (CTPA)", "Echocardiogram", "CT Angiography"]
    },
    {
        id: "hx_abd_pain",
        name: "Abdominal Pain",
        systems: ["GI", "GU", "OBS"],
        searchTerms: ["stomach ache", "belly", "colic", "ألم بالبطن", "مغص"],
        globalRank: 1,
        template: "pain_abd",
        customAttributes: [
            { id: "nausea_vomiting", label: "Nausea/Vomiting?",       type: "toggle" },
            { id: "relation_meals",  label: "Relation to meals",       type: "chips", options: ["Worse after eating", "Better after eating", "Unrelated"] },
            { id: "bowel_habit",     label: "Bowel Habit Change?",     type: "toggle" },
            { id: "jaundice",        label: "Associated Jaundice?",    type: "toggle" }
        ],
        correlations: {
            medical:  ["Peptic Ulcer Disease", "Gallstones", "Diabetes Mellitus", "Pelvic Inflammatory Disease (PID)", "Endometriosis", "Inflammatory Bowel Disease", "Pancreatitis", "Diverticular Disease", "Intestinal Obstruction", "Aortic Dissection"],
            surgical: ["Appendectomy", "Cholecystectomy", "Previous abdominal surgery", "Previous C-Section", "Hernia Repair"],
            drug:     ["NSAIDs", "Aspirin", "Steroids", "Recent Antibiotics"],
            family:   ["Inflammatory Bowel Disease", "Malignancy"],
            social:   ["Alcohol"]
        },
        examPriority: ["gi_insp", "gi_palp", "gi_perc_ausc", "gu_exam"],
        labHints:   ["WBC", "CRP", "Amylase", "Lipase", "ALT (SGPT)", "Total Bilirubin", "Lactate", "Hemoglobin (Hb)", "Alkaline Phosphatase (ALP)", "Direct Bilirubin", "β-hCG (serum)", "Urinalysis"],
        radioHints: ["Abdominal US", "CT Abdomen & Pelvis", "KUB X-Ray", "Pelvic US", "Erect Chest X-Ray"]
    },
    {
        id: "hx_ams",
        name: "Altered Mental Status",
        systems: ["CNS", "GEN"],
        searchTerms: ["confusion", "coma", "delirium", "drowsy", "غيبوبة", "تخليط"],
        globalRank: 2,
        template: "neuro_ams",
        customAttributes: [
            { id: "baseline",    label: "Baseline Cognition",             type: "chips", options: ["Normal baseline", "Mild cognitive decline", "Moderate dementia", "Severe dementia"] },
            { id: "onset_speed", label: "Sudden vs Gradual",              type: "chips", options: ["Sudden (minutes–hours)", "Gradual (days)", "Insidious (months)"] },
            { id: "intoxication",label: "Possible Poisoning/Overdose?",   type: "toggle" }
        ],
        correlations: {
            medical:  ["Diabetes Mellitus", "Dementia", "Liver Cirrhosis", "CKD", "Hypertension", "Epilepsy", "Stroke/TIA", "Meningitis", "Sepsis"],
            surgical: ["Neurosurgery"],
            drug:     ["Sedatives/Hypnotics", "Opioids", "Anticholinergics", "Insulin/OHAs"],
            family:   ["Dementia"],
            social:   ["Alcohol", "Illicit Drugs"]
        },
        examPriority: ["gen_appearance", "cns_cranial", "gen_signs", "cns_motor"],
        labHints:   ["Sodium (Na)", "Calcium", "Urea", "Creatinine", "Total Bilirubin", "Ammonia", "WBC", "pH", "pCO2", "Base Excess (BE)", "TSH", "Glucose (Random)", "Urinalysis", "Toxicology Screen", "ECG"],
        radioHints: ["CT Brain", "MRI Brain"]
    },
    {
        id: "hx_gi_nausea_vomit",
        name: "Nausea & Vomiting",
        systems: ["GI", "GEN"],
        searchTerms: ["vomiting", "nausea", "throw up", "puke", "قيء", "غثيان"],
        globalRank: 1,
        template: "gi_vomiting",
        customAttributes: [
            { id: "abd_pain",    label: "Abdominal Pain?",   type: "toggle" },
            { id: "headache",    label: "Headache?",         type: "toggle" },
            { id: "last_meal",   label: "Suspicious Food?",  type: "toggle" },
            { id: "dehydration", label: "Dehydration Signs?",type: "toggle" }
        ],
        correlations: {
            medical:  ["Diabetes Mellitus", "Peptic Ulcer Disease", "Gallstones", "Migraine", "CKD", "Intestinal Obstruction", "Pancreatitis"],
            surgical: ["Previous abdominal surgery"],
            drug:     ["Opioids", "NSAIDs", "Recent Antibiotics", "Chemotherapy"],
            family:   [],
            social:   ["Alcohol"]
        },
        examPriority: ["gen_hydration", "gi_palp", "cns_cranial"],
        labHints:   ["Sodium (Na)", "Potassium (K)", "Creatinine", "Urea", "Amylase", "Lipase", "pH", "ALT (SGPT)", "Total Bilirubin"],
        radioHints: ["Abdominal US", "CT Brain", "KUB X-Ray"]
    },
    {
        id: "hx_gi_diarrhea",
        name: "Diarrhea",
        systems: ["GI"],
        searchTerms: ["loose stool", "frequent stool", "diarrhea", "إسهال"],
        globalRank: 1,
        template: "gi_bowel",
        customAttributes: [
            { id: "vomiting",     label: "Nausea/Vomiting?",  type: "toggle" },
            { id: "fever",        label: "Fever?",            type: "toggle" },
            { id: "sick_contact", label: "Sick Contacts?",    type: "toggle" },
            { id: "travel",       label: "Recent Travel?",    type: "toggle" },
            { id: "bloody",       label: "Bloody?",           type: "toggle" }
        ],
        correlations: {
            medical:  ["Inflammatory Bowel Disease", "Diabetes Mellitus", "Thyrotoxicosis"],
            surgical: ["Cholecystectomy", "Previous abdominal surgery"],
            drug:     ["Recent Antibiotics", "Immunosuppressants", "Metformin"],
            family:   ["Inflammatory Bowel Disease"],
            social:   ["Travel History", "Pets/Animal Contact"]
        },
        examPriority: ["gen_hydration", "gi_palp", "gi_perc_ausc"],
        labHints:   ["WBC", "CRP", "Sodium (Na)", "Potassium (K)", "Creatinine", "Urea", "pH", "Stool Analysis", "Stool Culture"],
        radioHints: ["Abdominal US", "CT Abdomen & Pelvis"]
    },
    {
        id: "hx_headache",
        name: "Headache",
        systems: ["CNS"],
        searchTerms: ["ha", "head", "migraine", "صداع"],
        globalRank: 1,
        template: "pain_headache",
        customAttributes: [
            { id: "photophobia",    label: "Photo/Phonophobia?",  type: "toggle" },
            { id: "aura",           label: "Aura present?",       type: "toggle" },
            { id: "worse_am",       label: "Worse in Morning?",   type: "toggle" },
            { id: "red_flags",      label: "Fever/Weight Loss?",  type: "toggle" },
            { id: "thunderclap",    label: "Thunderclap Onset?",  type: "toggle" },
            { id: "neck_stiffness", label: "Neck Stiffness?",     type: "toggle" }
        ],
        correlations: {
            medical:  ["Hypertension", "Migraine", "Dyslipidemia", "SAH", "Meningitis", "Intracranial Mass"],
            surgical: ["Neurosurgery"],
            drug:     ["NSAIDs", "Oral Contraceptives", "Nitrates"],
            family:   ["Migraine", "SAH"],
            social:   ["Smoking", "Alcohol"]
        },
        examPriority: ["gen_appearance", "cns_cranial", "cns_sens_coord", "cns_motor"],
        labHints:   ["WBC", "ESR", "CRP", "Platelets", "PT"],
        radioHints: ["CT Brain", "MRI Brain", "Lumbar Puncture (CSF Analysis)"]
    },
    {
        id: "hx_cough",
        name: "Cough",
        systems: ["RESP"],
        searchTerms: ["coughing", "sputum", "phlegm", "سعال"],
        globalRank: 1,
        template: "generic",
        customAttributes: [
            { id: "type",         label: "Type",         type: "chips", options: ["Dry", "Productive"] },
            { id: "sputum_color", label: "Sputum Color", type: "chips", options: ["White/Clear", "Yellow", "Green", "Rusty", "Pink/Frothy", "Blood-Streaked"] },
            { id: "hemoptysis",   label: "Hemoptysis?",  type: "toggle" },
            { id: "timing",       label: "Timing",       type: "chips", options: ["Nocturnal", "Morning", "After Eating", "After Exercise", "Constant"] },
            { id: "fever",        label: "Fever?",       type: "toggle" }
        ],
        correlations: {
            medical:  ["Asthma", "COPD", "Heart Failure", "GERD", "Tuberculosis", "Bronchiectasis", "Lung Cancer"],
            surgical: ["Recent intubation"],
            drug:     ["Immunosuppressants", "ACE Inhibitors"],
            family:   ["Asthma", "Tuberculosis"],
            social:   ["Smoking", "Occupational Exposure"]
        },
        examPriority: ["resp_insp", "resp_ausc", "resp_palp_perc"],
        labHints:   ["WBC", "CRP", "ESR", "Sputum Culture", "AFB Smear/Culture", "Procalcitonin"],
        radioHints: ["Chest X-Ray", "CT Chest"]
    },
    {
        id: "hx_dysuria",
        name: "Dysuria",
        systems: ["GU"],
        searchTerms: ["burning urine", "frequency", "uti", "urinary symptoms", "حرقان بالبول"],
        globalRank: 2,
        template: "urinary",
        customAttributes: [
            { id: "discharge", label: "Discharge?",     type: "toggle" },
            { id: "fever",     label: "Fever?",         type: "toggle" },
            { id: "stone_hx",  label: "Prior Stones?",  type: "toggle" }
        ],
        correlations: {
            medical:  ["Diabetes Mellitus", "Recurrent UTIs", "BPH", "Prostate Disease", "Nephrolithiasis", "Pelvic Inflammatory Disease (PID)", "STIs"],
            surgical: ["Previous abdominal surgery", "Urinary catheterization"],
            drug:     ["Immunosuppressants", "Recent Antibiotics"],
            family:   ["Nephrolithiasis"],
            social:   []
        },
        examPriority: ["gu_exam"],
        labHints:   ["WBC", "Creatinine", "BUN", "CRP", "Urinalysis", "Urine Culture"],
        radioHints: ["Abdominal US", "Pelvic US", "KUB X-Ray", "CT KUB"]
    },
    {
        id: "hx_dizziness",
        name: "Dizziness",
        systems: ["CNS", "CVS"],
        searchTerms: ["dizzy", "spinning", "lightheaded", "faint", "vertigo", "دوخة", "دوار"],
        globalRank: 2,
        template: "dizziness",
        customAttributes: [
            { id: "hearing_loss", label: "Hearing Loss/Tinnitus?",  type: "toggle" },
            { id: "nausea",       label: "Nausea/Vomiting?",        type: "toggle" },
            { id: "palpitations", label: "Palpitations?",           type: "toggle" },
            { id: "postural",     label: "Worse on Standing?",      type: "toggle" }
        ],
        correlations: {
            medical:  ["Hypertension", "Diabetes Mellitus", "Heart Failure", "Migraine", "Epilepsy", "Anemia", "BPPV", "Vestibular Neuritis"],
            surgical: [],
            drug:     ["Beta Blockers", "Nitrates", "Sedatives/Hypnotics", "Diuretics"],
            family:   [],
            social:   ["Alcohol"]
        },
        examPriority: ["cns_cranial", "cns_sens_coord", "cvs_ausc", "cvs_pulses"],
        labHints:   ["Hemoglobin (Hb)", "Sodium (Na)", "Potassium (K)", "Creatinine", "TSH", "ECG", "Glucose (Random)"],
        radioHints: ["CT Brain", "MRI Brain"]
    },
    {
        id: "hx_back_pain",
        name: "Back Pain",
        systems: ["MSK", "GU", "CNS"],
        searchTerms: ["backache", "lumbago", "sciatica", "ألم بالظهر"],
        globalRank: 2,
        template: "pain_back",
        customAttributes: [
            { id: "weakness",          label: "Leg Weakness/Numbness?",      type: "toggle" },
            { id: "incontinence",      label: "Bladder/Bowel Incontinence?", type: "toggle" },
            { id: "fever",             label: "Fever?",                      type: "toggle" },
            { id: "trauma",            label: "Trauma/Fall?",                type: "toggle" },
            { id: "saddle_anesthesia", label: "Saddle Numbness?",            type: "toggle" }
        ],
        correlations: {
            medical:  ["Nephrolithiasis", "Malignancy", "Spinal Infection", "AAA", "Osteoarthritis", "Ankylosing Spondylitis"],
            surgical: ["Neurosurgery", "Recent immobilization/surgery"],
            drug:     ["Steroids"],
            family:   ["Malignancy", "Ankylosing Spondylitis"],
            social:   ["Occupational Exposure", "Smoking"]
        },
        examPriority: ["msk_exam", "cns_motor", "gu_exam"],
        labHints:   ["WBC", "CRP", "ESR", "Calcium", "Urinalysis"],
        radioHints: ["X-Ray Spine", "MRI Spine", "Abdominal US", "CT KUB"]
    },
    {
        id: "hx_hematemesis",
        name: "Hematemesis",
        systems: ["GI"],
        searchTerms: ["vomiting blood", "melena", "blood vomit", "gi bleed", "قيء دم", "براز أسود"],
        globalRank: 3,
        template: "bleeding",
        customAttributes: [
            { id: "relation_to_food", label: "Relation to Food",     type: "chips", options: ["Before Eating", "During/After Eating", "Unrelated"] },
            { id: "nausea_before",    label: "Nausea First?",        type: "toggle" },
            { id: "dizziness",        label: "Dizziness/Fainting?",  type: "toggle" }
        ],
        correlations: {
            medical:  ["Peptic Ulcer Disease", "Liver Cirrhosis", "Portal Hypertension", "GERD", "Mallory-Weiss Tear", "Esophageal Varices"],
            surgical: ["Previous abdominal surgery", "TIPS"],
            drug:     ["NSAIDs", "Aspirin", "Warfarin/DOACs", "Steroids"],
            family:   ["Bleeding disorders"],
            social:   ["Alcohol", "Smoking"]
        },
        examPriority: ["gen_signs", "gen_hydration", "gi_palp", "gi_dre"],
        labHints:   ["Hemoglobin (Hb)", "Platelets", "PT", "PTT", "ALT (SGPT)", "AST (SGOT)", "Total Bilirubin", "BUN", "Creatinine", "Lactate", "Albumin", "Blood Group & Crossmatch"],
        radioHints: ["Upper Endoscopy (OGD)", "Abdominal US"]
    },
    
    {
        id: "hx_oliguria",
        name: "Oliguria",
        systems: ["NEPH", "GU"],
        searchTerms: ["low urine", "anuria", "oliguria", "decreased urine output", "قلة البول", "انقطاع البول"],
        globalRank: 3,
        template: "urine_output",
        customAttributes: [
            { id: "vomiting_diarrhea", label: "Vomiting/Diarrhea?",   type: "toggle" },
            { id: "flank_pain",        label: "Flank Pain?",          type: "toggle" },
            { id: "medications",       label: "New Medications?",     type: "toggle" }
        ],
        correlations: {
            medical:  ["CKD", "Heart Failure", "BPH", "Prostate Disease", "Nephrolithiasis", "Sepsis", "Hypovolemia", "Glomerulonephritis"],
            surgical: ["Urinary catheterization", "Recent immobilization/surgery"],
            drug:     ["NSAIDs", "Recent Antibiotics"],
            family:   [],
            social:   []
        },
        examPriority: ["gen_hydration", "gu_exam", "neph_exam"],
        labHints:   ["Creatinine", "BUN", "Potassium (K)", "Sodium (Na)", "pH", "HCO3", "Urine Sodium", "Urine Osmolality", "Lactate", "Urinalysis"],
        radioHints: ["Abdominal US", "Pelvic US", "Bladder Scan (Bedside US)"]
    },
    {
        id: "hx_hematuria",
        name: "Hematuria",
        systems: ["NEPH", "GU"],
        searchTerms: ["blood in urine", "red urine", "hematuria", "دم في البول"],
        globalRank: 3,
        template: "urine_appearance",
        customAttributes: [
            { id: "painful", label: "Painful?",          type: "toggle" },
            { id: "timing",  label: "Timing in Stream",  type: "chips", options: ["Initial", "Terminal", "Total"] },
            { id: "trauma",  label: "Trauma?",           type: "toggle" },
            { id: "fever",   label: "Fever?",            type: "toggle" }
        ],
        correlations: {
            medical:  ["Nephrolithiasis", "BPH", "Prostate Disease", "Glomerulonephritis", "Malignancy", "Recurrent UTIs", "Bladder Ca", "IgA Nephropathy"],
            surgical: ["Urinary catheterization"],
            drug:     ["Warfarin/DOACs", "NSAIDs"],
            family:   ["Polycystic Kidney Disease", "Malignancy"],
            social:   ["Smoking"]
        },
        examPriority: ["gu_exam"],
        labHints:   ["Creatinine", "BUN", "Hemoglobin (Hb)", "Platelets", "PT", "PTT", "C3", "C4", "ASO Titer", "Urine Cytology", "Urinalysis", "Urine Culture"],
        radioHints: ["CT KUB", "Abdominal US", "Pelvic US"]
    },
    {
        id: "hx_flank_pain",
        name: "Flank Pain",
        systems: ["NEPH", "GU", "MSK"],
        searchTerms: ["flank", "loin", "renal colic", "ألم في الجنب", "مغص كلوي"],
        globalRank: 3,
        template: "pain_abd",
        customAttributes: [
            { id: "radiation_groin", label: "Radiation to Groin?",  type: "toggle" },
            { id: "hematuria",       label: "Hematuria?",           type: "toggle" },
            { id: "fever",           label: "Fever?",               type: "toggle" },
            { id: "dysuria",         label: "Dysuria?",             type: "toggle" },
            { id: "nausea_vomiting", label: "Nausea/Vomiting?",     type: "toggle" }
        ],
        correlations: {
            medical:  ["Nephrolithiasis", "Recurrent UTIs", "Polycystic Kidney Disease", "Pyelonephritis"],
            surgical: [],
            drug:     [],
            family:   ["Nephrolithiasis"],
            social:   []
        },
        examPriority: ["gu_exam", "gi_palp", "msk_exam"],
        labHints:   ["WBC", "Creatinine", "BUN", "CRP", "Calcium", "Uric Acid", "Urinalysis"],
        radioHints: ["CT KUB", "Abdominal US", "KUB X-Ray"]
    },
    {
        id: "hx_frothy_urine",
        name: "Frothy Urine",
        systems: ["NEPH"],
        searchTerms: ["frothy", "foamy", "bubbles in urine", "proteinuria", "بول رغوي"],
        globalRank: 4,
        template: "urine_appearance",
        customAttributes: [
            { id: "edema",       label: "Edema?",                  type: "toggle" },
            { id: "diabetes_hx", label: "Poor Glycemic Control?",  type: "toggle" },
            { id: "htn_hx",      label: "Known Hypertension?",     type: "toggle" }
        ],
        correlations: {
            medical:  ["Diabetes Mellitus", "Hypertension", "CKD", "Glomerulonephritis", "Nephrotic Syndrome", "Lupus Nephritis"],
            surgical: [],
            drug:     ["NSAIDs"],
            family:   ["Diabetes Mellitus", "Hypertension"],
            social:   []
        },
        examPriority: ["gen_signs", "cvs_insp", "resp_ausc", "neph_exam"],
        labHints:   ["Creatinine", "BUN", "Total Protein", "Albumin", "Urine Protein", "HbA1c", "Total Cholesterol", "Urine Protein/Cr Ratio", "C3", "C4", "Urinalysis"],
        radioHints: ["Abdominal US", "Renal Doppler US"]
    },
    {
        id: "hx_polyuria",
        name: "Polyuria",
        systems: ["NEPH", "GU", "GEN"],
        searchTerms: ["frequent urination", "nocturia", "polyuria", "كثرة التبول", "تبول ليلي"],
        globalRank: 3,
        template: "urine_output",
        customAttributes: [
            { id: "polydipsia",  label: "Polydipsia?",           type: "toggle" },
            { id: "weight_loss", label: "Weight Loss?",          type: "toggle" },
            { id: "stream",      label: "Poor Stream/Hesitancy?",type: "toggle" }
        ],
        correlations: {
            medical:  ["Diabetes Mellitus", "BPH", "Prostate Disease", "CKD", "Heart Failure", "Diabetes Insipidus", "Hypercalcemia"],
            surgical: [],
            drug:     ["Diuretics", "Lithium"],
            family:   ["Diabetes Mellitus"],
            social:   ["Alcohol"]
        },
        examPriority: ["gen_hydration", "gu_exam", "gi_dre"],
        labHints:   ["Sodium (Na)", "Potassium (K)", "Creatinine", "BUN", "HbA1c", "Calcium", "Urine Osmolality", "Serum Osmolality", "Urine Specific Gravity", "Urinalysis"],
        radioHints: ["Abdominal US", "Pelvic US"]
    },
    {
        id: "hx_palpitations",
        name: "Palpitations",
        systems: ["CVS", "ENDO"],
        searchTerms: ["heart racing", "fluttering", "fast heartbeat", "رفرفة", "ضربات قلب سريعة"],
        globalRank: 2,
        template: "palpitations",
        customAttributes: [
            { id: "chest_pain", label: "Chest Pain?",          type: "toggle" },
            { id: "sob",        label: "SOB?",                 type: "toggle" },
            { id: "caffeine",   label: "Caffeine/Stimulants?", type: "toggle" }
        ],
        correlations: {
            medical:  ["IHD", "Heart Failure", "Hypertension", "Atrial Fibrillation", "SVT", "Anemia", "Thyrotoxicosis"],
            surgical: [],
            drug:     ["Beta Blockers", "Salbutamol Inhaler", "Digoxin"],
            family:   ["Sudden cardiac death"],
            social:   ["Smoking", "Illicit Drugs", "Alcohol"]
        },
        examPriority: ["cvs_pulses", "cvs_ausc", "endo_thyroid"],
        labHints:   ["Potassium (K)", "Magnesium", "TSH", "Free T4 (fT4)", "Troponin I", "Hemoglobin (Hb)", "Calcium", "ECG", "Holter Monitor"],
        radioHints: ["Echocardiogram"]
    },
    {
        id: "hx_syncope",
        name: "Syncope",
        systems: ["CVS", "CNS"],
        searchTerms: ["fainting", "passed out", "blackout", "loss of consciousness", "إغماء", "فقدان الوعي"],
        globalRank: 3,
        template: "syncope",
        customAttributes: [
            { id: "tongue_bite", label: "Tongue Bite/Incontinence?", type: "toggle" },
            { id: "exertional",  label: "Exertional?",               type: "toggle" },
            { id: "hx_cardiac",  label: "Known Cardiac History?",    type: "toggle" }
        ],
        correlations: {
            medical:  ["Heart Failure", "IHD", "Epilepsy", "Diabetes Mellitus", "Aortic Stenosis", "HOCM", "DVT/PE", "Arrhythmias"],
            surgical: [],
            drug:     ["Beta Blockers", "Nitrates", "Insulin/OHAs", "Diuretics"],
            family:   ["Sudden cardiac death"],
            social:   []
        },
        examPriority: ["cvs_ausc", "gen_appearance", "cvs_pulses"],
        labHints:   ["Hemoglobin (Hb)", "Sodium (Na)", "Potassium (K)", "Troponin I", "Glucose (Random)", "ECG", "Holter Monitor"],
        radioHints: ["Echocardiogram", "CT Brain", "Carotid Doppler US"]
    },
    {
        id: "hx_jaundice",
        name: "Jaundice",
        systems: ["GI", "GEN"],
        searchTerms: ["yellow skin", "yellow eyes", "icterus", "صفراء", "يرقان"],
        globalRank: 3,
        template: "generic",
        customAttributes: [
            { id: "pain",        label: "Abdominal Pain?",        type: "toggle" },
            { id: "urine_stool", label: "Dark Urine/Pale Stool?", type: "toggle" },
            { id: "pruritus",    label: "Pruritus?",              type: "toggle" },
            { id: "fever",       label: "Fever?",                 type: "toggle" }
        ],
        correlations: {
            medical:  ["Gallstones", "Liver Cirrhosis", "Portal Hypertension", "Malignancy", "Hemolytic Anemia", "Pancreatic Ca", "Cholangitis", "Viral Hepatitis"],
            surgical: ["Cholecystectomy", "TIPS"],
            drug:     ["Warfarin/DOACs", "Recent Antibiotics", "Statins"],
            family:   [],
            social:   ["Alcohol", "Illicit Drugs", "Travel History"]
        },
        examPriority: ["gen_signs", "gi_palp", "gi_insp"],
        labHints:   ["Total Bilirubin", "Direct Bilirubin", "ALT (SGPT)", "AST (SGOT)", "Alkaline Phosphatase (ALP)", "GGT", "PT", "INR", "Reticulocyte Count", "LDH", "Haptoglobin", "HBsAg", "Anti-HCV", "Albumin"],
        radioHints: ["Abdominal US", "CT Abdomen & Pelvis", "MRCP"]
    },
    {
        id: "hx_constipation",
        name: "Constipation",
        systems: ["GI", "ENDO"],
        searchTerms: ["no stool", "obstipation", "hard stool", "إمساك"],
        globalRank: 1,
        template: "generic",
        customAttributes: [
            { id: "last_bm",     label: "Days Since Last BM",  type: "number", min: 1, max: 30 },
            { id: "flatus",      label: "Flatus Passed?",      type: "toggle" },
            { id: "distension",  label: "Distension?",         type: "toggle" },
            { id: "weight_loss", label: "Weight Loss?",        type: "toggle" }
        ],
        correlations: {
            medical:  ["Diabetes Mellitus", "Malignancy", "Hypothyroidism", "Hypercalcemia", "Parkinson's Disease", "Diverticular Disease"],
            surgical: ["Previous abdominal surgery"],
            drug:     ["Opioids", "Anticholinergics", "Iron Supplements", "CCBs"],
            family:   ["Malignancy", "Colorectal Cancer"],
            social:   []
        },
        examPriority: ["gi_insp", "gi_palp", "gi_perc_ausc", "gi_dre"],
        labHints:   ["Potassium (K)", "Calcium", "TSH", "Hemoglobin (Hb)"],
        radioHints: ["KUB X-Ray", "CT Abdomen & Pelvis"]
    },
    {
        id: "hx_hemoptysis",
        name: "Hemoptysis",
        systems: ["RESP"],
        searchTerms: ["coughing blood", "blood in sputum", "hemoptysis", "نفث الدم"],
        globalRank: 3,
        template: "bleeding",
        customAttributes: [
            { id: "weight_loss",  label: "Weight Loss?",    type: "toggle" },
            { id: "night_sweats", label: "Night Sweats?",   type: "toggle" },
            { id: "fever",        label: "Fever?",          type: "toggle" },
            { id: "chest_pain",   label: "Chest Pain?",     type: "toggle" }
        ],
        correlations: {
            medical:  ["Tuberculosis", "DVT/PE", "Bronchiectasis", "Lung Cancer", "Mitral Stenosis"],
            surgical: [],
            drug:     ["Warfarin/DOACs"],
            family:   ["Malignancy"],
            social:   ["Smoking", "Travel History"]
        },
        examPriority: ["gen_signs", "resp_insp", "resp_ausc", "cvs_ausc"],
        labHints:   ["Hemoglobin (Hb)", "Platelets", "PT", "PTT", "WBC", "CRP", "Sputum Culture", "AFB Smear/Culture", "D-Dimer"],
        radioHints: ["Chest X-Ray", "CT Chest", "CT Pulmonary Angiography (CTPA)"]
    },
    {
        id: "hx_rectal_bleeding",
        name: "Rectal Bleeding",
        systems: ["GI"],
        searchTerms: ["blood in stool", "hematochezia", "rectal bleeding", "نزيف شرجي"],
        globalRank: 2,
        template: "bleeding",
        customAttributes: [
            { id: "bowel_change", label: "Change in Bowel Habit?",  type: "toggle" },
            { id: "pain",         label: "Associated Pain?",        type: "toggle" },
            { id: "weight_loss",  label: "Weight Loss?",            type: "toggle" },
            { id: "prolapse",     label: "Prolapse?",               type: "toggle" }
        ],
        correlations: {
            medical:  ["Hemorrhoids", "Inflammatory Bowel Disease", "Colorectal Cancer", "Diverticular Disease"],
            surgical: ["Previous abdominal surgery"],
            drug:     ["NSAIDs", "Aspirin", "Warfarin/DOACs"],
            family:   ["Malignancy", "Inflammatory Bowel Disease", "Colorectal Cancer"],
            social:   []
        },
        examPriority: ["gen_signs", "gi_palp", "gi_dre"],
        labHints:   ["Hemoglobin (Hb)", "Platelets", "PT", "PTT", "BUN", "Creatinine"],
        radioHints: ["Colonoscopy", "CT Abdomen & Pelvis"]
    },
    {
    id: "hx_ll_swelling",
    name: "LL Swelling",
    systems: ["CVS", "NEPH", "GI"],
    searchTerms: [
        "leg swelling", 
        "calf swelling", 
        "unilateral edema", 
        "تورم الساق", 
        "swelling", 
        "edema", 
        "puffy", 
        "تورم", 
        "وذمة"
    ],
    globalRank: 2,
    template: "edema",
    customAttributes: [
        { id: "fever",         label: "Fever?",                              type: "toggle" },
        { id: "chest_pain",    label: "Chest Pain/SOB?",                     type: "toggle" },
{ id: "orthopnea",     label: "Orthopnea?",                          type: "toggle" }, 
        { id: "recent_travel", label: "Recent Travel/Prolonged Immobility?", type: "toggle" },
        
        { id: "urine_change",  label: "Urine Change?",                       type: "toggle" },
        
    ],
    correlations: {
        medical: [
            "DVT/PE", 
            "Cellulitis", 
            "Malignancy", 
            "Heart Failure", 
            "CKD", 
            "Liver Cirrhosis", 
            "Hypertension", 
            "Nephrotic Syndrome", 
            "Hypothyroidism"
        ],
        surgical: [
            "Recent immobilization/surgery", 
            "Joint Replacement"
        ],
        drug: [
            "Oral Contraceptives", 
            "NSAIDs", 
            "Steroids", 
            "CCBs"
        ],
        family: [],
        social: ["Travel History"]
    },
    examPriority: [
        "cvs_insp", 
        "gen_signs", 
        "resp_ausc", 
        "neph_exam"
    ],
    labHints: [
        "D-Dimer", 
        "WBC", 
        "CRP", 
        "Creatinine", 
        "BUN", 
        "Sodium (Na)", 
        "Potassium (K)", 
        "Total Protein", 
        "Albumin", 
        "Urine Protein", 
        "BNP", 
        "Total Cholesterol", 
        "Urine Protein/Cr Ratio"
    ],
    radioHints: [
        "Doppler US Lower Limbs", 
        "CT Pulmonary Angiography (CTPA)", 
        "Echocardiogram", 
        "Abdominal US", 
        "Renal Doppler US", 
        "Chest X-Ray"
    ]
}, 
    {
        id: "hx_weight_loss",
        name: "Weight Loss",
        systems: ["GEN", "ENDO", "GI"],
        searchTerms: ["losing weight", "weight loss", "فقدان الوزن"],
        globalRank: 2,
        template: "generic",
        customAttributes: [
            { id: "appetite",    label: "Appetite",       type: "chips", options: ["Normal", "Increased", "Decreased"] },
            { id: "fever",       label: "Fever?",         type: "toggle" },
            { id: "night_sweats",label: "Night Sweats?",  type: "toggle" }
        ],
        correlations: {
            medical:  ["Malignancy", "Diabetes Mellitus", "Thyroid Disease", "Tuberculosis", "Inflammatory Bowel Disease", "Liver Cirrhosis"],
            surgical: [],
            drug:     ["Chemotherapy"],
            family:   ["Malignancy"],
            social:   ["Smoking", "Illicit Drugs"]
        },
        examPriority: ["gen_appearance", "gen_signs", "endo_thyroid", "gi_palp"],
        labHints:   ["Hemoglobin (Hb)", "WBC", "CRP", "ESR", "TSH", "Free T4 (fT4)", "HbA1c", "Calcium", "Albumin"],
        radioHints: ["Chest X-Ray", "Abdominal US", "CT Abdomen & Pelvis"]
    },
    {
        id: "hx_fatigue",
        name: "Fatigue",
        systems: ["GEN", "ENDO"],
        searchTerms: ["tired", "lethargy", "fatigue", "إرهاق", "تعب"],
        globalRank: 1,
        template: "generic",
        customAttributes: [
            { id: "sleep", label: "Sleep Quality",        type: "chips", options: ["Good", "Poor", "Excessive"] },
            { id: "mood",  label: "Low Mood/Depression?", type: "toggle" }
        ],
        correlations: {
            medical:  ["Anemia", "Thyroid Disease", "Diabetes Mellitus", "CKD", "Heart Failure", "Liver Cirrhosis", "SLE"],
            surgical: [],
            drug:     ["Beta Blockers", "Sedatives/Hypnotics", "Chemotherapy"],
            family:   [],
            social:   ["Alcohol"]
        },
        examPriority: ["gen_appearance", "gen_signs", "endo_thyroid", "cvs_ausc"],
        labHints:   ["Hemoglobin (Hb)", "TSH", "Free T4 (fT4)", "HbA1c", "Creatinine", "Sodium (Na)", "Potassium (K)", "Ferritin", "Serum Iron"],
        radioHints: ["Chest X-Ray", "Echocardiogram"]
    },
    {
        id: "hx_seizures",
        name: "Seizures",
        systems: ["CNS"],
        searchTerms: ["fit", "convulsion", "seizure", "تشنجات", "صرع"],
        globalRank: 3,
        template: "seizure",
        customAttributes: [],
        correlations: {
            medical:  ["Epilepsy", "Stroke/TIA", "Meningitis", "Intracranial Mass"],
            surgical: ["Neurosurgery"],
            drug:     ["Antiepileptics"],
            family:   ["Epilepsy"],
            social:   ["Alcohol", "Illicit Drugs"]
        },
        examPriority: ["gen_appearance", "cns_cranial", "cns_motor", "cns_sens_coord"],
        labHints:   ["Sodium (Na)", "Calcium", "Magnesium", "Glucose (Random)", "Antiepileptic Drug Levels", "Toxicology Screen", "ECG"],
        radioHints: ["CT Brain", "MRI Brain"]
    },
    {
        id: "hx_dysphagia",
        name: "Dysphagia",
        systems: ["GI"],
        searchTerms: ["difficulty swallowing", "dysphagia", "صعوبة بلع"],
        globalRank: 3,
        template: "dysphagia",
        customAttributes: [],
        correlations: {
            medical:  ["Stroke/TIA", "GERD", "Esophageal Cancer", "Achalasia"],
            surgical: [],
            drug:     [],
            family:   ["Malignancy"],
            social:   ["Smoking", "Alcohol"]
        },
        examPriority: ["cns_cranial", "gen_appearance", "gi_insp"],
        labHints:   ["Hemoglobin (Hb)", "Albumin", "WBC"],
        radioHints: ["Upper Endoscopy (OGD)", "Barium Swallow", "CT Chest"]
    },
    {
        id: "hx_joint_pain",
        name: "Joint Pain",
        systems: ["MSK"],
        searchTerms: ["arthritis", "arthralgia", "joint pain", "ألم مفاصل"],
        globalRank: 2,
        template: "pain_joint",
        customAttributes: [],
        correlations: {
            medical:  ["Gout", "Rheumatoid Arthritis", "Osteoarthritis", "Reactive Arthritis", "Psoriatic Arthritis", "Ankylosing Spondylitis", "SLE", "Septic Arthritis"],
            surgical: ["Joint Replacement"],
            drug:     ["Steroids", "Diuretics"],
            family:   ["Rheumatoid Arthritis", "Gout", "Ankylosing Spondylitis"],
            social:   ["Alcohol"]
        },
        examPriority: ["msk_exam", "gen_signs"],
        labHints:   ["WBC", "CRP", "ESR", "Uric Acid", "Rheumatoid Factor (RF)", "Anti-CCP", "ANA", "Calcium"],
        radioHints: ["X-Ray Extremities", "MRI Joint"]
    },
    {
        id: "hx_vaginal_bleeding",
        name: "Vaginal Bleeding",
        systems: ["OBS"],
        searchTerms: ["pv bleeding", "vaginal bleeding", "نزيف مهبلي"],
        globalRank: 3,
        template: "bleeding_pv",
        customAttributes: [],
        correlations: {
            medical:  ["Pelvic Inflammatory Disease (PID)", "Endometriosis", "Uterine Disease", "Ovarian Disease", "Polycystic Ovarian Syndrome (PCOS)"],
            surgical: ["Previous C-Section"],
            drug:     ["Oral Contraceptives", "Warfarin/DOACs"],
            family:   [],
            social:   []
        },
        examPriority: ["obs_exam", "gen_signs"],
        labHints:   ["β-hCG (serum)", "Hemoglobin (Hb)", "Platelets", "PT", "PTT", "Blood Group & Crossmatch"],
        radioHints: ["Pelvic US"]
    },
    {
        id: "hx_abd_distension",
        name: "Abdominal Distension",
        systems: ["GI", "NEPH"],
        searchTerms: ["bloating", "swollen belly", "distension", "انتفاخ البطن"],
        globalRank: 2,
        template: "generic",
        customAttributes: [
            { id: "pain",     label: "Abdominal Pain?",   type: "toggle" },
            { id: "vomiting", label: "Nausea/Vomiting?",  type: "toggle" },
            { id: "flatus",   label: "Flatus Passed?",    type: "toggle" }
        ],
        correlations: {
            medical:  ["Liver Cirrhosis", "Heart Failure", "Intestinal Obstruction", "Malignancy"],
            surgical: ["Previous abdominal surgery"],
            drug:     [],
            family:   [],
            social:   ["Alcohol"]
        },
        examPriority: ["gi_insp", "gi_palp", "gi_perc_ausc"],
        labHints:   ["Total Bilirubin", "Albumin", "ALT (SGPT)", "AST (SGOT)", "PT", "Sodium (Na)", "Potassium (K)"],
        radioHints: ["Abdominal US", "CT Abdomen & Pelvis", "Erect Chest X-Ray"]
    },
    {
        id: "hx_epistaxis",
        name: "Epistaxis",
        systems: ["ENT"],
        searchTerms: ["nosebleed", "epistaxis", "نزيف الأنف"],
        globalRank: 3,
        template: "bleeding",
        customAttributes: [],
        correlations: {
            medical:  ["Hypertension", "Liver Cirrhosis"],
            surgical: [],
            drug:     ["Warfarin/DOACs", "Aspirin", "NSAIDs"],
            family:   ["Bleeding disorders"],
            social:   []
        },
        examPriority: ["gen_signs", "cvs_pulses"],
        labHints:   ["Hemoglobin (Hb)", "Platelets", "PT", "PTT", "INR"],
        radioHints: []
    },
    {
        id: "hx_sore_throat",
        name: "Sore Throat",
        systems: ["ENT"],
        searchTerms: ["pharyngitis", "sore throat", "احتقان الحلق"],
        globalRank: 1,
        template: "generic",
        customAttributes: [
            { id: "fever",    label: "Fever?",                        type: "toggle" },
            { id: "dysphagia",label: "Difficulty Swallowing?",        type: "toggle" },
            { id: "voice",    label: "Voice Change?",                 type: "toggle" },
            { id: "trismus",  label: "Difficulty Opening Mouth?",     type: "toggle" }
        ],
        correlations: {
            medical:  ["Rheumatic Heart Disease", "Infectious Mononucleosis", "Peritonsillar Abscess"],
            surgical: ["Tonsillectomy"],
            drug:     ["Recent Antibiotics", "Immunosuppressants"],
            family:   [],
            social:   ["Smoking"]
        },
        examPriority: ["gen_signs", "resp_insp"],
        labHints:   ["WBC", "CRP", "Monospot Test"],
        radioHints: []
    },
    {
        id: "hx_scrotal_pain",
        name: "Scrotal Pain",
        systems: ["GU"],
        searchTerms: ["testicular pain", "scrotal pain", "ألم الخصية"],
        globalRank: 4,
        template: "pain_abd",
        customAttributes: [
            { id: "swelling", label: "Swelling?", type: "toggle" },
            { id: "trauma",   label: "Trauma?",   type: "toggle" },
            { id: "fever",    label: "Fever?",    type: "toggle" }
        ],
        correlations: {
            medical:  ["STIs", "Epididymo-orchitis"],
            surgical: ["Hernia Repair"],
            drug:     [],
            family:   [],
            social:   []
        },
        examPriority: ["gu_exam", "gi_palp"],
        labHints:   ["WBC", "CRP", "Urinalysis", "Urine Culture"],
        radioHints: ["Scrotal US"]
    }
];

// =============================================
// EXAMS (Template Based)
// =============================================
const HX_EXAMS = [
    // ── General Look ──────────────────────────────────
    { id: "gen_appearance", system: "GEN", section: "Appearance", desc: "Consciousness, distress, habitus", rank: 1, template: [
        { id: "loc",      label: "Consciousness", type: "chips", options: ["Alert", "Confused", "Lethargic", "Comatose"] },
        { id: "distress", label: "Distress",      type: "toggle" },
        { id: "habitus",  label: "Habitus",       type: "chips", options: ["Average", "Cachectic", "Obese"] }
    ]},
    { id: "gen_signs", system: "GEN", section: "Stigmata", desc: "Pallor, jaundice, cyanosis, etc.", rank: 2, template: [
        { id: "pallor",   label: "Pallor",            type: "toggle" },
        { id: "jaundice", label: "Jaundice",          type: "toggle" },
        { id: "cyanosis", label: "Cyanosis",          type: "chips", options: ["None", "Central", "Peripheral"] },
        { id: "clubbing", label: "Clubbing",          type: "toggle" },
        { id: "lymph",    label: "Lymphadenopathy",   type: "toggle" },
        { id: "edema",    label: "Peripheral Edema",  type: "toggle" }
    ]},
    { id: "gen_hydration", system: "GEN", section: "Hydration", desc: "Volume status", rank: 3, template: [
        { id: "mucosa",     label: "Mucosa",      type: "chips", options: ["Moist", "Dry"] },
        { id: "turgor",     label: "Skin Turgor", type: "chips", options: ["Normal", "Decreased", "Tenting"] },
        { id: "cap_refill", label: "Cap Refill",  type: "chips", options: ["< 2s", "> 2s"] }
    ]},
    // ── Respiratory ───────────────────────────────────
    { id: "resp_insp", system: "RESP", section: "Inspection", desc: "Chest shape, effort", rank: 1, template: [
        { id: "effort",   label: "Effort",    type: "chips", options: ["Normal", "Use of accessory muscles", "Retractions"] },
        { id: "shape",    label: "Shape",     type: "chips", options: ["Normal", "Barrel", "Pectus Excavatum", "Pectus Carinatum"] },
        { id: "symmetry", label: "Symmetry",  type: "chips", options: ["Symmetrical", "Asymmetrical expansion"] }
    ]},
    { id: "resp_palp_perc", system: "RESP", section: "Palpation & Percussion", desc: "Trachea, percussion note", rank: 2, template: [
        { id: "trachea",    label: "Trachea",    type: "chips", options: ["Central", "Deviated Left", "Deviated Right"] },
        { id: "percussion", label: "Percussion", type: "chips", options: ["Resonant", "Dull", "Stony Dull", "Hyper-resonant"] }
    ]},
    { id: "resp_ausc", system: "RESP", section: "Auscultation", desc: "Air entry, added sounds", rank: 3, template: [
        { id: "air_entry",     label: "Air Entry",     type: "chips", options: ["Equal bilaterally", "Decreased Left", "Decreased Right", "Globally decreased"] },
        { id: "breath_sounds", label: "Breath Sounds", type: "chips", options: ["Vesicular", "Bronchial"] },
        { id: "added",         label: "Added Sounds",  type: "chips", options: ["None", "Wheezes", "Crepitations/Crackles", "Pleural Rub"] }
    ]},
    // ── CVS ───────────────────────────────────────────
    { id: "cvs_insp", system: "CVS", section: "Inspection & Palpation", desc: "JVP, heaves, thrills", rank: 1, template: [
        { id: "jvp",     label: "JVP",            type: "chips", options: ["Normal", "Elevated", "Not visible"] },
        { id: "apex",    label: "Apex Beat",      type: "chips", options: ["Normal", "Displaced", "Heaving"] },
        { id: "thrills", label: "Thrills/Heaves", type: "toggle" },
        { id: "edema",   label: "LL Edema",       type: "chips", options: ["None", "Trace", "Pitting", "Non-pitting"] }
    ]},
    { id: "cvs_ausc", system: "CVS", section: "Auscultation", desc: "Heart sounds, murmurs", rank: 2, template: [
        { id: "s1s2",   label: "S1 & S2",     type: "chips", options: ["Normal", "Muffled", "Split"] },
        { id: "murmur", label: "Murmurs",     type: "chips", options: ["None", "Systolic", "Diastolic", "Continuous"] },
        { id: "added",  label: "Added Sounds",type: "chips", options: ["None", "S3 Gallop", "S4 Gallop", "Friction Rub"] }
    ]},
    { id: "cvs_pulses", system: "CVS", section: "Pulses", desc: "Peripheral pulses", rank: 3, template: [
        { id: "rhythm",    label: "Rhythm",           type: "chips", options: ["Regular", "Irregularly Irregular", "Regularly Irregular"] },
        { id: "character", label: "Character/Volume", type: "chips", options: ["Normal", "Weak/Thready", "Bounding", "Collapsing"] },
        { id: "equality",  label: "Equality",         type: "chips", options: ["Equal", "Radio-radial delay", "Radio-femoral delay"] }
    ]},
    // ── GI ────────────────────────────────────────────
    { id: "gi_insp", system: "GI", section: "Inspection", desc: "Contour, scars", rank: 1, template: [
        { id: "contour", label: "Contour",        type: "chips", options: ["Flat", "Scaphoid", "Distended"] },
        { id: "scars",   label: "Scars/Striae",   type: "toggle" },
        { id: "other",   label: "Other Findings", type: "chips", options: ["None", "Caput Medusae", "Visible Pulsation", "Hernia"] }
    ]},
    { id: "gi_palp", system: "GI", section: "Palpation", desc: "Tenderness, masses, organs", rank: 2, template: [
        { id: "softness",     label: "Softness",           type: "chips", options: ["Soft/Lax", "Guarding", "Rigidity"] },
        { id: "tenderness",   label: "Tenderness",         type: "chips", options: ["None", "Epigastric", "RUQ", "RLQ", "LUQ", "LLQ", "Suprapubic", "Generalized"] },
        { id: "rebound",      label: "Rebound Tenderness", type: "toggle" },
        { id: "organomegaly", label: "Organomegaly",       type: "chips", options: ["None", "Hepatomegaly", "Splenomegaly", "Both"] },
        { id: "mass",         label: "Palpable Mass",      type: "toggle" }
    ]},
    { id: "gi_perc_ausc", system: "GI", section: "Percussion & Auscultation", desc: "Bowel sounds, ascites", rank: 3, template: [
        { id: "bowel_sounds", label: "Bowel Sounds",  type: "chips", options: ["Normal", "Hyperactive", "Sluggish", "Absent"] },
        { id: "ascites",      label: "Ascites Signs", type: "chips", options: ["None", "Shifting Dullness", "Fluid Thrill"] },
        { id: "bruits",       label: "Bruits",        type: "toggle" }
    ]},
    { id: "gi_dre", system: "GI", section: "Digital Rectal Exam", desc: "Tone, masses, blood", rank: 4, template: [
        { id: "tone",     label: "Sphincter Tone", type: "chips", options: ["Normal", "Decreased", "Increased"] },
        { id: "stool",    label: "Stool Color",    type: "chips", options: ["Brown", "Melena", "Fresh Blood", "Pale/Clay"] },
        { id: "prostate", label: "Prostate",       type: "chips", options: ["Normal", "Enlarged", "Nodular/Hard", "Tender"] },
        { id: "mass",     label: "Rectal Mass",    type: "toggle" }
    ]},
    // ── CNS ───────────────────────────────────────────
    { id: "cns_cranial", system: "CNS", section: "Cranial Nerves", desc: "Pupils, facial symmetry", rank: 1, template: [
        { id: "pupils", label: "Pupils",           type: "chips", options: ["PEARL", "Anisocoria", "Sluggish", "Fixed/Dilated", "Pinpoint"] },
        { id: "face",   label: "Facial Symmetry",  type: "chips", options: ["Symmetrical", "UMN Lesion", "LMN Lesion"] },
        { id: "eyes",   label: "Eye Movements",    type: "chips", options: ["Intact", "Ophthalmoplegia", "Nystagmus"] }
    ]},
    { id: "cns_motor", system: "CNS", section: "Motor System", desc: "Tone, power, reflexes", rank: 2, template: [
        { id: "tone",     label: "Tone",           type: "chips", options: ["Normal", "Hypertonia", "Hypotonia", "Spasticity", "Rigidity"] },
        { id: "power",    label: "Power",          type: "chips", options: ["Normal (5/5)", "Mild Weakness (4/5)", "Severe Weakness (<3/5)", "Hemiparesis", "Paraparesis"] },
        { id: "reflexes", label: "Reflexes",       type: "chips", options: ["Normal", "Hyperreflexia", "Hyporeflexia", "Areflexia"] },
        { id: "plantar",  label: "Plantar Reflex", type: "chips", options: ["Flexor (Normal)", "Extensor (Babinski)", "Equivocal"] }
    ]},
    { id: "cns_sens_coord", system: "CNS", section: "Sensory & Coordination", desc: "Sensation, cerebellar signs", rank: 3, template: [
        { id: "sensation",    label: "Sensation",       type: "chips", options: ["Intact", "Glove & Stocking Loss", "Sensory Level", "Hemisensory Loss"] },
        { id: "coordination", label: "Coordination",    type: "chips", options: ["Intact", "Dysmetria", "Dysdiadochokinesia", "Ataxic Gait"] },
        { id: "meningeal",    label: "Meningeal Signs", type: "chips", options: ["None", "Neck Stiffness", "Kernig's", "Brudzinski's"] }
    ]},
    // ── GU & Nephrology ───────────────────────────────
    { id: "gu_exam", system: "GU", section: "Genitourinary", desc: "CVA, bladder, genitalia", rank: 1, template: [
        { id: "cva",       label: "CVA Tenderness",    type: "chips", options: ["None", "Right", "Left", "Bilateral"] },
        { id: "bladder",   label: "Palpable Bladder",  type: "toggle" },
        { id: "genitalia", label: "External Genitalia",type: "chips", options: ["Normal", "Ulcers", "Discharge", "Rash"] }
    ]},
    { id: "neph_exam", system: "NEPH", section: "Nephrology", desc: "Kidneys, fluid status", rank: 1, template: [
        { id: "kidneys", label: "Kidneys",      type: "chips", options: ["Not Palpable", "Palpable Right", "Palpable Left", "Bilateral Ballotable"] },
        { id: "fluid",   label: "Fluid Status", type: "chips", options: ["Euvolemic", "Overloaded", "Depleted"] },
        { id: "fistula", label: "AV Fistula",   type: "chips", options: ["N/A", "Functioning (Thrill/Bruit)", "Failed/Thrombosed"] }
    ]},
    // ── MSK ───────────────────────────────────────────
    { id: "msk_exam", system: "MSK", section: "Joints & Spine", desc: "Swelling, ROM, spine", rank: 1, template: [
        { id: "inspection", label: "Inspection",       type: "chips", options: ["Normal", "Swelling", "Erythema", "Deformity"] },
        { id: "palpation",  label: "Palpation",        type: "chips", options: ["Non-tender", "Warmth", "Tenderness", "Effusion"] },
        { id: "rom",        label: "Range of Motion",  type: "chips", options: ["Full", "Restricted Active", "Restricted Passive", "Painful"] },
        { id: "spine",      label: "Spine",            type: "chips", options: ["Normal", "Tenderness", "Step-off", "Positive SLR"] }
    ]},
    // ── OBS / GYN ─────────────────────────────────────
    { id: "obs_exam", system: "OBS", section: "Obstetrics / Gynecology", desc: "Fundus, FHR, PV", rank: 1, template: [
        { id: "fundus", label: "Fundal Height",    type: "chips", options: ["Consistent with dates", "Large for dates", "Small for dates"] },
        { id: "lie",    label: "Lie/Presentation", type: "chips", options: ["Longitudinal/Cephalic", "Breech", "Transverse"] },
        { id: "fhr",    label: "Fetal Heart Rate", type: "chips", options: ["Normal (110–160)", "Tachycardia (>160)", "Bradycardia (<110)", "Absent"] },
        { id: "pv",     label: "Pelvic Exam",      type: "chips", options: ["Normal", "Bleeding", "Discharge", "Cervical Motion Tenderness"] }
    ]},
    // ── Endocrine ─────────────────────────────────────
    { id: "endo_thyroid", system: "ENDO", section: "Thyroid Exam", desc: "Inspection, palpation, eye signs", rank: 1, template: [
        { id: "size",      label: "Thyroid Size",                     type: "chips", options: ["Normal", "Goiter (Diffuse)", "Nodular"] },
        { id: "bruit",     label: "Thyroid Bruit",                    type: "toggle" },
        { id: "eye_signs", label: "Eye Signs (Exophthalmos/Lid Lag)", type: "toggle" },
        { id: "tremor",    label: "Fine Tremor",                      type: "toggle" }
    ]},
    { id: "endo_diabetic", system: "ENDO", section: "Diabetic Foot & Signs", desc: "Ulcers, neuropathy", rank: 2, template: [
        { id: "ulcers",     label: "Foot Ulcers",                 type: "toggle" },
        { id: "pulses",     label: "Pedal Pulses",                type: "chips", options: ["Intact", "Diminished", "Absent"] },
        { id: "neuropathy", label: "Sensory Loss (Monofilament)", type: "toggle" },
        { id: "acanthosis", label: "Acanthosis Nigricans",        type: "toggle" }
    ]}
];

// =============================================
// RADIOLOGY (Imaging studies only)
// =============================================
const HX_RADIOLOGY = [
    // ── Plain X-Ray ───────────────────────────────────────────────────────────
    { id: "rad_cxr",            name: "Chest X-Ray",                     modalities: ["X-Ray"],     regions: ["Chest"],               systems: ["RESP", "CVS"] },
    { id: "rad_cxr_erect",      name: "Erect Chest X-Ray",               modalities: ["X-Ray"],     regions: ["Chest", "Abdomen"],    systems: ["GI", "RESP"] },
    { id: "rad_kub",            name: "KUB X-Ray",                       modalities: ["X-Ray"],     regions: ["Abdomen"],             systems: ["GI", "GU", "NEPH"] },
    { id: "rad_xray_spine",     name: "X-Ray Spine",                     modalities: ["X-Ray"],     regions: ["Spine"],               systems: ["MSK", "CNS"] },
    { id: "rad_xray_ext",       name: "X-Ray Extremities",               modalities: ["X-Ray"],     regions: ["Extremities"],         systems: ["MSK"] },
    { id: "rad_barium_swallow", name: "Barium Swallow",                  modalities: ["X-Ray"],     regions: ["Neck", "Chest"],       systems: ["GI"] },
    // ── Ultrasound ────────────────────────────────────────────────────────────
    { id: "rad_us_abd",         name: "Abdominal US",                    modalities: ["US"],        regions: ["Abdomen"],             systems: ["GI", "GU", "NEPH"] },
    { id: "rad_us_pelvis",      name: "Pelvic US",                       modalities: ["US"],        regions: ["Pelvis"],              systems: ["GU", "OBS", "NEPH"] },
    { id: "rad_us_thyroid",     name: "Thyroid US",                      modalities: ["US"],        regions: ["Neck"],                systems: ["ENDO"] },
    { id: "rad_us_scrotal",     name: "Scrotal US",                      modalities: ["US"],        regions: ["Pelvis"],              systems: ["GU"] },
    { id: "rad_doppler_ll",     name: "Doppler US Lower Limbs",          modalities: ["US"],        regions: ["Extremities"],         systems: ["CVS"] },
    { id: "rad_renal_doppler",  name: "Renal Doppler US",                modalities: ["US"],        regions: ["Abdomen"],             systems: ["NEPH", "CVS"] },
    { id: "rad_echo",           name: "Echocardiogram",                  modalities: ["US"],        regions: ["Chest"],               systems: ["CVS"] },
    { id: "rad_doppler_carotid",name: "Carotid Doppler US",              modalities: ["US"],        regions: ["Neck"],                systems: ["CVS", "CNS"] },
    { id: "rad_bladder_scan",   name: "Bladder Scan (Bedside US)",       modalities: ["US"],        regions: ["Pelvis"],              systems: ["GU", "NEPH"] },
    // ── CT ────────────────────────────────────────────────────────────────────
    { id: "rad_ct_brain",       name: "CT Brain",                        modalities: ["CT"],        regions: ["Brain"],               systems: ["CNS"] },
    { id: "rad_ct_chest",       name: "CT Chest",                        modalities: ["CT"],        regions: ["Chest"],               systems: ["RESP"] },
    { id: "rad_ctpa",           name: "CT Pulmonary Angiography (CTPA)", modalities: ["CT"],        regions: ["Chest"],               systems: ["RESP", "CVS"] },
    { id: "rad_ct_abd",         name: "CT Abdomen & Pelvis",             modalities: ["CT"],        regions: ["Abdomen"],             systems: ["GI", "GU", "NEPH"] },
    { id: "rad_ct_kub",         name: "CT KUB",                          modalities: ["CT"],        regions: ["Abdomen", "Pelvis"],   systems: ["NEPH", "GU"] },
    { id: "rad_ct_angio",       name: "CT Angiography",                  modalities: ["CT"],        regions: ["Chest", "Abdomen"],   systems: ["CVS"] },
    // ── MRI ───────────────────────────────────────────────────────────────────
    { id: "rad_mri_brain",      name: "MRI Brain",                       modalities: ["MRI"],       regions: ["Brain"],               systems: ["CNS"] },
    { id: "rad_mri_spine",      name: "MRI Spine",                       modalities: ["MRI"],       regions: ["Spine"],               systems: ["CNS", "MSK"] },
    { id: "rad_mrcp",           name: "MRCP",                            modalities: ["MRI"],       regions: ["Abdomen"],             systems: ["GI"] },
    { id: "rad_mri_joint",      name: "MRI Joint",                       modalities: ["MRI"],       regions: ["Extremities"],         systems: ["MSK"] },
    // ── Nuclear Medicine ─────────────────────────────────────────────────────
    { id: "rad_vq_scan",        name: "V/Q Scan",                        modalities: ["Nuclear"],   regions: ["Chest"],               systems: ["RESP", "CVS"] },
    { id: "rad_dexa",           name: "DEXA Scan (Bone Density)",        modalities: ["Nuclear"],   regions: ["Spine", "Extremities"],systems: ["MSK", "ENDO"] },
    // ── Endoscopy ─────────────────────────────────────────────────────────────
    { id: "rad_endoscopy",      name: "Upper Endoscopy (OGD)",           modalities: ["Endoscopy"], regions: ["Abdomen"],             systems: ["GI"] },
    { id: "rad_colonoscopy",    name: "Colonoscopy",                     modalities: ["Endoscopy"], regions: ["Abdomen"],             systems: ["GI"] }
];

// =============================================
// LABS (Numeric + Qualitative)
// =============================================
const HX_LABS = [
    // ── CBC ───────────────────────────────────────────────────────────────────
    { name: "Hemoglobin (Hb)",              min: 12.0, max: 16.0,  unit: "g/dL" },
    { name: "WBC",                          min: 4.0,  max: 11.0,  unit: "x10⁹/L" },
    { name: "Platelets",                    min: 150,  max: 400,   unit: "x10⁹/L" },
    { name: "MCV",                          min: 80,   max: 100,   unit: "fL" },
    { name: "MCH",                          min: 27,   max: 33,    unit: "pg" },
    { name: "Reticulocyte Count",           min: 0.5,  max: 2.5,   unit: "%" },
    // ── Electrolytes ─────────────────────────────────────────────────────────
    { name: "Sodium (Na)",                  min: 135,  max: 145,   unit: "mEq/L" },
    { name: "Potassium (K)",                min: 3.5,  max: 5.1,   unit: "mEq/L" },
    { name: "Calcium",                      min: 8.5,  max: 10.5,  unit: "mg/dL" },
    { name: "Magnesium",                    min: 1.7,  max: 2.2,   unit: "mg/dL" },
    { name: "Phosphorus",                   min: 2.5,  max: 4.5,   unit: "mg/dL" },
    { name: "Chloride (Cl)",                min: 98,   max: 106,   unit: "mEq/L" },
    // ── Renal ─────────────────────────────────────────────────────────────────
    { name: "Creatinine",                   min: 0.6,  max: 1.2,   unit: "mg/dL" },
    { name: "BUN",                          min: 7,    max: 20,    unit: "mg/dL" },
    { name: "Urea",                         min: 10,   max: 50,    unit: "mg/dL" },
    { name: "eGFR",                         min: 90,   max: 120,   unit: "mL/min/1.73m²" },
    { name: "Uric Acid",                    min: 3.5,  max: 7.2,   unit: "mg/dL" },
    { name: "Urine Sodium",                 min: 40,   max: 220,   unit: "mEq/L" },
    { name: "Urine Osmolality",             min: 300,  max: 900,   unit: "mOsm/kg" },
    { name: "Serum Osmolality",             min: 275,  max: 295,   unit: "mOsm/kg" },
    { name: "Urine Specific Gravity",       min: 1.005,max: 1.030, unit: "" },
    { name: "Urine Protein",                min: 0,    max: 14,    unit: "mg/dL" },
    { name: "Urine Protein/Cr Ratio",       min: 0,    max: 30,    unit: "mg/g" },
    // ── Liver ─────────────────────────────────────────────────────────────────
    { name: "ALT (SGPT)",                   min: 7,    max: 56,    unit: "U/L" },
    { name: "AST (SGOT)",                   min: 10,   max: 40,    unit: "U/L" },
    { name: "Alkaline Phosphatase (ALP)",   min: 44,   max: 147,   unit: "U/L" },
    { name: "GGT",                          min: 9,    max: 48,    unit: "U/L" },
    { name: "Total Bilirubin",              min: 0.1,  max: 1.2,   unit: "mg/dL" },
    { name: "Direct Bilirubin",             min: 0.0,  max: 0.3,   unit: "mg/dL" },
    { name: "Total Protein",                min: 6.0,  max: 8.3,   unit: "g/dL" },
    { name: "Albumin",                      min: 3.5,  max: 5.0,   unit: "g/dL" },
    { name: "Ammonia",                      min: 15,   max: 45,    unit: "µg/dL" },
    { name: "LDH",                          min: 140,  max: 280,   unit: "U/L" },
    { name: "Haptoglobin",                  min: 30,   max: 200,   unit: "mg/dL" },
    // ── Pancreas ──────────────────────────────────────────────────────────────
    { name: "Amylase",                      min: 30,   max: 110,   unit: "U/L" },
    { name: "Lipase",                       min: 0,    max: 160,   unit: "U/L" },
    // ── Inflammatory / Infectious ─────────────────────────────────────────────
    { name: "CRP",                          min: 0,    max: 10,    unit: "mg/L" },
    { name: "ESR",                          min: 0,    max: 20,    unit: "mm/hr" },
    { name: "Procalcitonin",                min: 0,    max: 0.15,  unit: "ng/mL" },
    // ── Cardiac ───────────────────────────────────────────────────────────────
    { name: "Troponin I",                   min: 0,    max: 0.04,  unit: "ng/mL" },
    { name: "BNP",                          min: 0,    max: 100,   unit: "pg/mL" },
    // ── Coagulation ───────────────────────────────────────────────────────────
    { name: "PT",                           min: 11,   max: 13.5,  unit: "sec" },
    { name: "PTT",                          min: 25,   max: 35,    unit: "sec" },
    { name: "INR",                          min: 0.8,  max: 1.1,   unit: "" },
    { name: "D-Dimer",                      min: 0,    max: 0.50,  unit: "mg/L" },
    { name: "Fibrinogen",                   min: 200,  max: 400,   unit: "mg/dL" },
    // ── ABG / Acid-Base ───────────────────────────────────────────────────────
    { name: "pH",                           min: 7.35, max: 7.45,  unit: "" },
    { name: "pCO2",                         min: 35,   max: 45,    unit: "mmHg" },
    { name: "pO2",                          min: 80,   max: 100,   unit: "mmHg" },
    { name: "HCO3",                         min: 22,   max: 26,    unit: "mEq/L" },
    { name: "Base Excess (BE)",             min: -2,   max: 2,     unit: "mEq/L" },
    { name: "Lactate",                      min: 0.5,  max: 1.0,   unit: "mmol/L" },
    { name: "O2 Saturation (SpO2)",         min: 95,   max: 100,   unit: "%" },
    // ── Endocrine ─────────────────────────────────────────────────────────────
    { name: "TSH",                          min: 0.4,  max: 4.0,   unit: "mIU/L" },
    { name: "Free T4 (fT4)",               min: 0.8,  max: 1.8,   unit: "ng/dL" },
    { name: "Free T3 (fT3)",               min: 2.3,  max: 4.2,   unit: "pg/mL" },
    { name: "HbA1c",                        min: 0,    max: 5.7,   unit: "%" },
    { name: "Glucose (Random)",             min: 70,   max: 140,   unit: "mg/dL" },
    { name: "Fasting Glucose",              min: 70,   max: 100,   unit: "mg/dL" },
    { name: "C-Peptide",                    min: 0.5,  max: 2.0,   unit: "ng/mL" },
    { name: "Cortisol (AM)",                min: 6,    max: 23,    unit: "µg/dL" },
    { name: "PTH",                          min: 15,   max: 65,    unit: "pg/mL" },
    // ── Lipids ────────────────────────────────────────────────────────────────
    { name: "Total Cholesterol",            min: 0,    max: 200,   unit: "mg/dL" },
    { name: "LDL",                          min: 0,    max: 100,   unit: "mg/dL" },
    { name: "HDL",                          min: 40,   max: 60,    unit: "mg/dL" },
    { name: "Triglycerides",               min: 0,    max: 150,   unit: "mg/dL" },
    // ── Immunology / Rheumatology ─────────────────────────────────────────────
    { name: "Rheumatoid Factor (RF)",       min: 0,    max: 14,    unit: "IU/mL" },
    { name: "Anti-CCP",                     min: 0,    max: 17,    unit: "U/mL" },
    { name: "ANA",                          min: 0,    max: 1,     unit: "titer (1:40)" },
    { name: "C3",                           min: 90,   max: 180,   unit: "mg/dL" },
    { name: "C4",                           min: 16,   max: 47,    unit: "mg/dL" },
    { name: "ASO Titer",                    min: 0,    max: 200,   unit: "IU/mL" },
    // ── Iron Studies ──────────────────────────────────────────────────────────
    { name: "Ferritin",                     min: 12,   max: 300,   unit: "ng/mL" },
    { name: "Serum Iron",                   min: 60,   max: 170,   unit: "µg/dL" },
    { name: "TIBC",                         min: 250,  max: 370,   unit: "µg/dL" },
    // ── OBS / GYN ─────────────────────────────────────────────────────────────
    { name: "β-hCG (serum)",               min: 0,    max: 5,     unit: "mIU/mL" },
    // ── Microbiology & Qualitative ────────────────────────────────────────────
    { name: "Blood Culture",                min: 0,    max: 0,     unit: "qualitative" },
    { name: "Urine Culture",                min: 0,    max: 0,     unit: "qualitative" },
    { name: "Sputum Culture",               min: 0,    max: 0,     unit: "qualitative" },
    { name: "Stool Analysis",               min: 0,    max: 0,     unit: "qualitative" },
    { name: "Stool Culture",                min: 0,    max: 0,     unit: "qualitative" },
    { name: "AFB Smear/Culture",            min: 0,    max: 0,     unit: "qualitative" },
    { name: "Urinalysis",                   min: 0,    max: 0,     unit: "qualitative" },
    { name: "Toxicology Screen",            min: 0,    max: 0,     unit: "qualitative" },
    { name: "Monospot Test",                min: 0,    max: 0,     unit: "qualitative" },
    // ── Serology ──────────────────────────────────────────────────────────────
    { name: "HBsAg",                        min: 0,    max: 0,     unit: "qualitative" },
    { name: "Anti-HCV",                     min: 0,    max: 0,     unit: "qualitative" },
    { name: "HIV Ag/Ab",                    min: 0,    max: 0,     unit: "qualitative" },
    // ── Procedural / Functional ───────────────────────────────────────────────
    { name: "Lumbar Puncture (CSF Analysis)", min: 0, max: 0,     unit: "qualitative" },
    { name: "Blood Group & Crossmatch",     min: 0,    max: 0,     unit: "qualitative" },
    { name: "Antiepileptic Drug Levels",    min: 0,    max: 0,     unit: "qualitative" },
    { name: "ECG",                          min: 0,    max: 0,     unit: "qualitative" },
    { name: "Holter Monitor",               min: 0,    max: 0,     unit: "qualitative" },
    { name: "Urine Cytology",               min: 0,    max: 0,     unit: "qualitative" },
    { name: "Blood Film",                   min: 0,    max: 0,     unit: "qualitative" },
    { name: "Malaria Film",                 min: 0,    max: 0,     unit: "qualitative" }
];
