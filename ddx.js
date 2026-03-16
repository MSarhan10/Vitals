/**
 * ============================================================================
 * MIRIMATE CLINICAL DATABASE (ddx.js) - MASTER SCHEMA & DOCUMENTATION
 * ============================================================================
 * @version 2.0 - Expanded to 100 diseases across 8 systems
 *
 * This file powers both the "DDx Search" engine and the "Quiz Me" generator.
 * Every string must match exactly across the arrays for the logic to work.
 *
 * ----------------------------------------------------------------------------
 * 1. SYSTEMS ARRAY
 * ----------------------------------------------------------------------------
 * Maps the internal ID to the UI Display Name and Icon.
 * e.g., { id: "git", name: "Gastrointestinal", icon: "🍏" }
 *
 * ----------------------------------------------------------------------------
 * 2. SYMPTOMS OBJECT
 * ----------------------------------------------------------------------------
 * This is the master list of all available "Chips" the user can click in the UI.
 * - Categories (symptoms, signs, labs, radiology) group the UI chips.
 * - If a symptom/lab is used in a disease, IT MUST BE LISTED HERE FIRST.
 * - Chips are matched globally across all system categories, so a chip defined
 *   in cvs.labs (e.g., "Elevated ESR") is valid for use in any disease.
 *
 * ----------------------------------------------------------------------------
 * 3. RULES ENGINE (Mutual Exclusions)
 * ----------------------------------------------------------------------------
 * Prevents impossible clinical scenarios (e.g., male pregnancy, neonatal smoking).
 * - excludes: If Key chip is selected, the array items are removed/hidden.
 *             Disease names (e.g., "BPH") may also be listed to exclude them
 *             from DDx results entirely when a conflicting chip is active.
 * - implies:  If Key chip is selected, the array items are auto-selected.
 * - strictFilters: Severely punishes the DDx score if the user selects one
 *   of these but the disease doesn't explicitly support it.
 *
 * ----------------------------------------------------------------------------
 * 4. DISEASES ARRAY (The Core Logic)
 * ----------------------------------------------------------------------------
 * Each object represents a clinical diagnosis. How fields affect the app:
 *
 * @property {string}  name          - The display name of the disease.
 * @property {string}  system        - Must match an id from the Systems Array.
 * @property {string}  medscapeLink  - URL opened when the user clicks the reference button.
 *
 * --- BIAS & DEMOGRAPHICS ---
 * @property {array}   demographics  - Includes Age, Gender, Onset, Vitals, and Risk Factors.
 *    -> Quiz Engine: Randomly selects from these to build the patient.
 *    -> DDx Engine:  Awards +1 point for each matched chip.
 *
 * @property {string}  ageBias, genderBias, onsetBias - The "Classic" presentation.
 *    -> Quiz Engine (The 80/20 Rule): 80% chance the vignette uses this bias,
 *       and 20% chance it uses another valid demographic.
 *    -> DDx Engine: Awards a BONUS +2 points if the user selects this exact chip.
 *
 * --- CLINICAL FEATURES ---
 * @property {array}   keyFeatures      - The "Smoking Guns" or defining symptoms.
 *    -> Quiz Engine: Always picks 1 or 2 of these to include in the question.
 *    -> DDx Engine:  Highly weighted. Awards +2 points per match.
 *
 * @property {array}   possibleFeatures - Associated/secondary symptoms.
 *    -> Quiz Engine: Randomly picks 1 to 3 of these to add flavor to the case.
 *    -> DDx Engine:  Standard weight. Awards +1 point per match.
 *
 * --- INVESTIGATIONS & DIFFICULTY SCALING ---
 * @property {object}  labs & radiology - Split into "screening" and "confirmatory".
 *    -> DDx Engine: Treats both equally (+1 point per match).
 *    -> Quiz Engine (Difficulty Scaling):
 *       - Easy:   100% chance to include a "confirmatory" test.
 *       - Inter:   50% chance to include confirmatory tests.
 *       - Hard:     0% chance. Only vague "screening" tests are provided.
 *       - Hints: Unused confirmatory tests are sent to the "Hint" button pool.
 * ============================================================================
 */

const DDX_DATA = {

    // ============================================================================
    // 1. SYSTEMS
    // ============================================================================
    systems: [
        { id: "demo",  name: "Demographics",      icon: "🧑‍⚕️" },
        { id: "git",   name: "Gastrointestinal",   icon: "🍏"   },
        { id: "resp",  name: "Respiratory",        icon: "🫁"   },
        { id: "cvs",   name: "Cardiovascular",     icon: "❤️"   },
        { id: "renal", name: "Renal / Urological", icon: "🫘"   },
        { id: "neuro", name: "Neurological",       icon: "🧠"   },
        { id: "endo",  name: "Endocrine",          icon: "⚛️"   },
        { id: "msk",   name: "Musculoskeletal",    icon: "🦴"   }
    ],

    // ============================================================================
    // 2. SYMPTOMS OBJECT
    // ============================================================================
    symptoms: {
        demo: {
            age: [
                "Neonate (<1m)", "Pediatric (1m-18y)", "Young Adult (18-35y)",
                "Middle-aged (36-55y)", "Elderly (>55y)"
            ],
            gender: ["Male", "Female"],
            onset:  ["Acute", "Subacute", "Chronic", "Episodic"],
            vitals: [
                "Tachycardia", "Bradycardia", "Hypertension (Vital)", "Hypotension",
                "Tachypnea", "Bradypnea", "Fever", "Hypothermia", "Hypoxia"
            ],
            riskFactors: [
                "Smoking", "Hypertension (Hx)", "Diabetes", "Obesity", "Hyperlipidemia",
                "Recent Travel", "Immunosuppression", "Pregnancy", "IV Drug Use", "Trauma",
                "Alcohol use", "Prior Surgery", "Immobilization", "Malignancy",
                "Atrial Fibrillation", "Recent Viral Illness", "Dehydration",
                "Family History of CAD", "Family History of Gallstones",
                "Family History of Kidney Stones", "Family History of Autoimmune Disease",
                "Family History of Asthma", "Family History of Appendicitis",
                "Family History of Aneurysms", "Family History of Cancer",
                "Family History of IBD", "Corticosteroid use"
            ]
        },
        git: {
            symptoms: [
                "Abdominal pain", "Nausea", "Vomiting", "Diarrhea", "Constipation",
                "Heartburn", "Dysphagia", "Anorexia", "Bloating", "Hematemesis",
                "Melena", "Hematochezia", "Weight loss", "Steatorrhea",
                "Tenesmus", "Currant jelly stool"
            ],
            signs: [
                "Jaundice", "Right upper quadrant tenderness", "Rebound tenderness",
                "McBurney's point tenderness", "Hepatomegaly", "Murphy's sign", "Guarding",
                "Abdominal distension", "Absent bowel sounds", "Left lower quadrant tenderness",
                "Ascites", "Spider angiomata", "Caput medusae", "Palmar erythema",
                "Pain out of proportion"
            ],
            labs: [
                "Leukocytosis", "Elevated AST/ALT", "Elevated lipase", "Elevated bilirubin",
                "Anemia", "Elevated amylase", "Elevated ALP", "Elevated GGT",
                "Metabolic alkalosis", "Elevated lactate", "Positive stool occult blood",
                "Positive tTG-IgA", "Positive hepatitis serology", "Elevated INR",
                "Elevated ESR", "Positive ASCA", "Positive p-ANCA", "Low albumin",
                "Positive blood culture", "Elevated CRP"
            ],
            radiology: [
                "Free air under diaphragm", "Thickened appendix on US", "Dilated bowel loops",
                "Gallstones on US", "Pancreatic inflammation on CT", "Air-fluid levels on X-ray",
                "GB wall thickening on US", "Pericholecystic fluid on US", "Transition point on CT",
                "Colonic outpouchings on CT", "Bowel wall thickening on CT",
                "Apple-core lesion on Barium Enema", "Target sign on US",
                "Portal hypertension on US", "Pneumobilia on CT"
            ]
        },
        resp: {
            symptoms: [
                "Cough", "Shortness of breath", "Chest pain", "Hemoptysis",
                "Pleuritic chest pain", "Wheezing", "Sputum production", "Orthopnea",
                "Night sweats", "Drooling", "Hoarseness", "Barking cough"
            ],
            signs: [
                "Crackles", "Cyanosis", "Decreased breath sounds", "Accessory muscle use",
                "Tracheal deviation", "Dullness to percussion", "Hyperresonance to percussion",
                "Barrel chest", "Clubbing", "Inspiratory stridor", "Tripod positioning",
                "Pleural friction rub"
            ],
            labs: [
                "Positive sputum culture", "Hypoxemia (low PaO2)", "Elevated D-dimer",
                "Respiratory alkalosis", "Respiratory acidosis", "Positive blood culture",
                "Elevated procalcitonin", "Positive AFB smear", "Elevated ACE level"
            ],
            radiology: [
                "Lobar infiltrate", "Pleural effusion", "Pneumothorax on CXR",
                "Ground-glass opacities", "CT angiography filling defect", "Hyperinflation on CXR",
                "Mediastinal shift on CXR", "Air bronchograms", "Hampton hump on CXR",
                "Westermark sign on CXR", "Apical cavitary lesion", "Lung mass on CT",
                "Bilateral hilar lymphadenopathy on CXR", "Thumb sign on X-ray",
                "Steeple sign on X-ray", "Tram-track opacities on CT"
            ]
        },
        cvs: {
            symptoms: [
                "Palpitations", "Syncope", "Paroxysmal nocturnal dyspnea", "Leg swelling",
                "Diaphoresis", "Fatigue", "Dizziness", "Claudication", "Tearing chest pain"
            ],
            signs: [
                "Jugular venous distension", "S3 gallop", "S4 gallop", "Peripheral edema",
                "New murmur", "Pericardial friction rub", "Elevated JVP", "Muffled heart sounds",
                "Pulsus paradoxus", "Absent distal pulses", "Asymmetric blood pressure",
                "Unilateral leg swelling", "Janeway lesions", "Osler nodes",
                "Irregular pulse", "Slow-rising pulse"
            ],
            labs: [
                "Elevated troponin", "Elevated BNP", "Elevated CRP", "Elevated ESR",
                "ECG ST elevation", "ECG ST depression", "Elevated LDH", "Elevated CK-MB",
                "Metabolic acidosis", "Positive blood culture (Cardiac)",
                "ECG atrial fibrillation", "ECG wide complex tachycardia",
                "ECG saddle-shaped ST elevation", "Ankle-Brachial Index < 0.9"
            ],
            radiology: [
                "Cardiomegaly on CXR", "Pulmonary edema on CXR", "Pericardial effusion on echo",
                "Wall motion abnormality on echo", "Valvular abnormality on echo",
                "Aortic dilation on CT", "Intimal flap on CT", "Reduced ejection fraction on echo",
                "Non-compressible vein on US", "Mediastinal widening on CXR",
                "Hypertensive retinopathy on fundoscopy"
            ]
        },
        renal: {
            symptoms: [
                "Flank pain", "Dysuria", "Hematuria", "Urinary frequency", "Urinary urgency",
                "Oliguria", "Polyuria", "Suprapubic pain", "Hesitancy", "Testicular pain"
            ],
            signs: [
                "Costovertebral angle tenderness", "Suprapubic tenderness", "Enlarged prostate",
                "Absent cremasteric reflex", "High-riding testicle", "Flank mass",
                "Hard irregular prostate"
            ],
            labs: [
                "Elevated creatinine", "Elevated BUN", "Pyuria", "Hematuria on urinalysis",
                "Proteinuria", "Positive urine culture", "Urine WBC casts",
                "Muddy brown casts on urinalysis", "RBC casts on urinalysis",
                "Hypoalbuminemia", "Lipiduria", "Elevated PSA"
            ],
            radiology: [
                "Hydronephrosis on US", "Renal calculus on CT", "Perinephric stranding on CT",
                "Bladder wall thickening on US", "Ureteral dilation on CT",
                "Decreased testicular blood flow on US", "Multiple renal cysts on US",
                "Renal mass on CT", "Small kidneys on US", "Bladder mass on CT",
                "Bone metastases on bone scan"
            ]
        },
        neuro: {
            symptoms: [
                "Headache", "Altered mental status", "Seizures", "Focal weakness",
                "Vision changes", "Neck stiffness", "Photophobia", "Unilateral throbbing headache",
                "Band-like headache", "Severe orbital pain", "Ipsilateral eye pain"
            ],
            signs: [
                "Nuchal rigidity", "Kernig's sign", "Brudzinski's sign",
                "Focal neurological deficit", "Papilledema", "Hemiparesis", "Aphasia",
                "GCS < 15", "Cranial nerve palsy", "Resting tremor", "Cogwheel rigidity",
                "Bradykinesia", "Ascending paralysis", "Absent deep tendon reflexes",
                "Unilateral facial palsy", "Ipsilateral lacrimation"
            ],
            labs: [
                "Positive CSF culture", "Elevated CSF protein", "Decreased CSF glucose",
                "Elevated CSF WBC", "Xanthochromia in CSF", "Elevated CSF opening pressure",
                "Oligoclonal bands in CSF", "EEG abnormality"
            ],
            radiology: [
                "CT hyperdense lesion", "MRI diffusion restriction", "Cerebral edema on CT",
                "Midline shift on CT", "Subarachnoid hemorrhage on CT",
                "CT angiography vessel occlusion", "Meningeal enhancement on MRI",
                "CT angiography aneurysm", "Loss of gray-white differentiation on CT",
                "Crescent-shaped hemorrhage on CT", "Lens-shaped hemorrhage on CT",
                "Periventricular white matter plaques on MRI"
            ]
        },
        endo: {
            symptoms: [
                "Polydipsia", "Heat intolerance", "Cold intolerance", "Tremor",
                "Weight gain", "Striae", "Hyperpigmentation", "Tetany"
            ],
            signs: [
                "Kussmaul breathing", "Exophthalmos", "Goiter", "Warm moist skin", "Lid lag",
                "Dry skin", "Moon facies", "Buffalo hump", "Delayed relaxation of DTRs",
                "Positive Chvostek's sign", "Positive Trousseau's sign", "Acanthosis nigricans"
            ],
            labs: [
                "Hyperglycemia", "Elevated HbA1c", "Elevated anion gap", "Ketonuria",
                "Ketonemia", "Decreased TSH", "Elevated free T4", "Elevated TSH",
                "Decreased free T4", "Hyperkalemia", "Hyponatremia", "Low morning cortisol",
                "High midnight cortisol", "Elevated metanephrines",
                "Hypercalcemia", "Hypocalcemia", "Low serum osmolality", "Hypernatremia"
            ],
            radiology: [
                "Thyroid nodule on US", "Diffusely increased thyroid uptake scan",
                "Adrenal mass on CT", "Pituitary adenoma on MRI"
            ]
        },
        msk: {
            symptoms: [
                "Joint pain", "Joint swelling", "Limited range of motion", "Morning stiffness",
                "Back pain", "Muscle weakness", "Redness over joint", "Numbness in hands",
                "Severe toe pain", "Widespread pain", "Bone pain"
            ],
            signs: [
                "Joint effusion", "Warmth over joint", "Erythema over joint",
                "Restricted range of motion", "Tenderness on palpation", "Crepitus",
                "Soft tissue swelling", "Positive Tinel's sign", "Positive Phalen's sign",
                "Tophi", "Pain out of proportion", "Tender points on exam",
                "Tense compartment", "Localized bone tenderness", "Malar rash"
            ],
            labs: [
                "Elevated uric acid", "Positive synovial fluid culture",
                "Synovial fluid WBC > 50,000", "Positive rheumatoid factor", "Positive anti-CCP",
                "Negatively birefringent crystals", "Positive HLA-B27",
                "Positively birefringent crystals", "Positive ANA", "Positive anti-dsDNA"
            ],
            radiology: [
                "Joint space narrowing on X-ray", "Erosions on X-ray", "MRI bone marrow edema",
                "Periosteal reaction on X-ray", "Bamboo spine on X-ray", "Osteophytes on X-ray",
                "Punched-out erosions on X-ray", "Sacroiliitis on MRI",
                "Chondrocalcinosis on X-ray", "Femoral head flattening on X-ray",
                "Soft tissue swelling on X-ray", "Joint effusion on US"
            ]
        }
    },

    // ============================================================================
    // 3. RULES ENGINE
    // ============================================================================
    rules: {
        excludes: {
            "Male":               ["Female", "Pregnancy"],
            "Female":             ["Male", "Benign Prostatic Hyperplasia", "Testicular Torsion", "Prostate Cancer"],
            "Pregnancy":          ["Male"],
            "Neonate (<1m)":      ["Smoking", "Alcohol use", "Pregnancy", "Hypertension (Hx)", "Diabetes", "Obesity", "Hyperlipidemia", "Elderly (>55y)"],
            "Pediatric (1m-18y)": ["Smoking", "Alcohol use", "Pregnancy", "Elderly (>55y)", "Hyperlipidemia"],
            "Smoking":            ["Neonate (<1m)", "Pediatric (1m-18y)"],
            "Alcohol use":        ["Neonate (<1m)", "Pediatric (1m-18y)"]
        },
        implies: {
            "Pregnancy": ["Female"]
        },
        strictFilters: ["Male", "Female", "Pregnancy"]
    },

    // ============================================================================
    // 4. DISEASES — 100 total
    //    GIT (18) | RESP (14) | CVS (14) | RENAL (13) | NEURO (15) | ENDO (13) | MSK (13)
    // ============================================================================
    diseases: [

        // =====================================================================
        // GASTROINTESTINAL (18)
        // =====================================================================
        {
            name: "Acute Appendicitis", system: "git",
            medscapeLink: "https://emedicine.medscape.com/article/773895-overview",
            demographics: ["Pediatric (1m-18y)", "Young Adult (18-35y)", "Male", "Female", "Acute", "Fever", "Tachycardia", "Family History of Appendicitis"],
            ageBias: "Young Adult (18-35y)", onsetBias: "Acute",
            keyFeatures:      ["Abdominal pain", "McBurney's point tenderness", "Rebound tenderness"],
            possibleFeatures: ["Nausea", "Vomiting", "Anorexia", "Guarding", "Diarrhea"],
            labs:      { screening: ["Leukocytosis", "Elevated CRP"],  confirmatory: [] },
            radiology: { screening: [],                                confirmatory: ["Thickened appendix on US"] }
        },
        {
            name: "GERD", system: "git",
            medscapeLink: "https://emedicine.medscape.com/article/176595-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Chronic", "Episodic", "Obesity", "Smoking", "Pregnancy", "Alcohol use"],
            ageBias: "Middle-aged (36-55y)", onsetBias: "Chronic",
            keyFeatures:      ["Heartburn", "Dysphagia"],
            possibleFeatures: ["Cough", "Nausea", "Chest pain", "Bloating"],
            labs:      { screening: [], confirmatory: [] },
            radiology: { screening: [], confirmatory: [] }
        },
        {
            name: "Acute Cholecystitis", system: "git",
            medscapeLink: "https://emedicine.medscape.com/article/171886-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Female", "Male", "Acute", "Fever", "Tachycardia", "Obesity", "Pregnancy", "Family History of Gallstones"],
            ageBias: "Middle-aged (36-55y)", genderBias: "Female", onsetBias: "Acute",
            keyFeatures:      ["Right upper quadrant tenderness", "Murphy's sign", "Abdominal pain"],
            possibleFeatures: ["Nausea", "Vomiting", "Jaundice", "Anorexia", "Guarding"],
            labs:      { screening: ["Leukocytosis", "Elevated AST/ALT", "Elevated ALP", "Elevated bilirubin"], confirmatory: [] },
            radiology: { screening: [],                                                                          confirmatory: ["Gallstones on US", "GB wall thickening on US", "Pericholecystic fluid on US"] }
        },
        {
            name: "Acute Pancreatitis", system: "git",
            medscapeLink: "https://emedicine.medscape.com/article/181364-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Acute", "Tachycardia", "Fever", "Alcohol use", "Obesity", "Family History of Gallstones"],
            ageBias: "Middle-aged (36-55y)", onsetBias: "Acute",
            keyFeatures:      ["Abdominal pain", "Nausea", "Vomiting"],
            possibleFeatures: ["Guarding", "Abdominal distension", "Jaundice", "Diarrhea"],
            labs:      { screening: ["Leukocytosis", "Elevated AST/ALT", "Elevated bilirubin"], confirmatory: ["Elevated lipase", "Elevated amylase"] },
            radiology: { screening: [],                                                         confirmatory: ["Pancreatic inflammation on CT"] }
        },
        {
            name: "Small Bowel Obstruction", system: "git",
            medscapeLink: "https://emedicine.medscape.com/article/774140-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Acute", "Tachycardia", "Prior Surgery"],
            ageBias: "Elderly (>55y)", onsetBias: "Acute",
            keyFeatures:      ["Abdominal pain", "Vomiting", "Abdominal distension", "Constipation"],
            possibleFeatures: ["Nausea", "Anorexia", "Absent bowel sounds", "Fever"],
            labs:      { screening: ["Leukocytosis", "Elevated lactate", "Metabolic alkalosis"], confirmatory: [] },
            radiology: { screening: ["Dilated bowel loops", "Air-fluid levels on X-ray"],       confirmatory: ["Transition point on CT"] }
        },
        {
            name: "Peptic Ulcer Disease", system: "git",
            medscapeLink: "https://emedicine.medscape.com/article/181753-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Chronic", "Episodic", "Smoking", "Alcohol use"],
            ageBias: "Middle-aged (36-55y)", onsetBias: "Episodic",
            keyFeatures:      ["Abdominal pain", "Heartburn", "Melena"],
            possibleFeatures: ["Nausea", "Hematemesis", "Weight loss", "Anorexia"],
            labs:      { screening: ["Anemia"],  confirmatory: ["Positive stool occult blood"] },
            radiology: { screening: [],          confirmatory: [] }
        },
        {
            name: "Diverticulitis", system: "git",
            medscapeLink: "https://emedicine.medscape.com/article/173388-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Acute", "Fever", "Obesity", "Smoking"],
            ageBias: "Elderly (>55y)", onsetBias: "Acute",
            keyFeatures:      ["Abdominal pain", "Left lower quadrant tenderness", "Fever"],
            possibleFeatures: ["Constipation", "Diarrhea", "Nausea", "Vomiting", "Guarding", "Rebound tenderness"],
            labs:      { screening: ["Leukocytosis", "Elevated CRP"], confirmatory: [] },
            radiology: { screening: [],                               confirmatory: ["Bowel wall thickening on CT", "Colonic outpouchings on CT"] }
        },
        {
            name: "Colorectal Cancer", system: "git",
            medscapeLink: "https://emedicine.medscape.com/article/277496-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Chronic", "Smoking", "Obesity", "Family History of Cancer"],
            ageBias: "Elderly (>55y)", onsetBias: "Chronic",
            keyFeatures:      ["Weight loss", "Hematochezia", "Melena"],
            possibleFeatures: ["Constipation", "Diarrhea", "Abdominal pain", "Fatigue", "Anemia"],
            labs:      { screening: ["Anemia", "Positive stool occult blood"], confirmatory: [] },
            radiology: { screening: [],                                        confirmatory: ["Apple-core lesion on Barium Enema", "Bowel wall thickening on CT"] }
        },
        {
            name: "Acute Viral Hepatitis", system: "git",
            medscapeLink: "https://emedicine.medscape.com/article/175655-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Male", "Female", "Subacute", "Fever", "Recent Travel", "IV Drug Use", "Alcohol use"],
            ageBias: "Young Adult (18-35y)", onsetBias: "Subacute",
            keyFeatures:      ["Jaundice", "Right upper quadrant tenderness", "Hepatomegaly", "Anorexia"],
            possibleFeatures: ["Nausea", "Vomiting", "Abdominal pain", "Fatigue", "Weight loss"],
            labs:      { screening: ["Elevated AST/ALT", "Elevated bilirubin", "Elevated ALP"], confirmatory: ["Positive hepatitis serology", "Elevated INR"] },
            radiology: { screening: [],                                                         confirmatory: [] }
        },
        {
            name: "Crohn's Disease", system: "git",
            medscapeLink: "https://emedicine.medscape.com/article/172940-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Male", "Female", "Chronic", "Episodic", "Smoking", "Family History of IBD"],
            ageBias: "Young Adult (18-35y)", onsetBias: "Chronic",
            keyFeatures:      ["Abdominal pain", "Diarrhea", "Weight loss"],
            possibleFeatures: ["Hematochezia", "Steatorrhea", "Anorexia", "Fever", "Anemia"],
            labs:      { screening: ["Elevated CRP", "Elevated ESR", "Anemia"], confirmatory: ["Positive ASCA"] },
            radiology: { screening: ["Bowel wall thickening on CT"],            confirmatory: [] }
        },
        {
            name: "Ulcerative Colitis", system: "git",
            medscapeLink: "https://emedicine.medscape.com/article/183084-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Male", "Female", "Chronic", "Episodic", "Family History of IBD"],
            ageBias: "Young Adult (18-35y)", onsetBias: "Chronic",
            keyFeatures:      ["Hematochezia", "Tenesmus", "Diarrhea", "Left lower quadrant tenderness"],
            possibleFeatures: ["Abdominal pain", "Weight loss", "Fever", "Anorexia"],
            labs:      { screening: ["Elevated CRP", "Elevated ESR", "Anemia"], confirmatory: ["Positive p-ANCA"] },
            radiology: { screening: ["Bowel wall thickening on CT"],            confirmatory: [] }
        },
        {
            name: "Celiac Disease", system: "git",
            medscapeLink: "https://emedicine.medscape.com/article/171805-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Female", "Male", "Chronic", "Family History of Autoimmune Disease"],
            ageBias: "Young Adult (18-35y)", genderBias: "Female", onsetBias: "Chronic",
            keyFeatures:      ["Steatorrhea", "Diarrhea", "Weight loss", "Anemia"],
            possibleFeatures: ["Abdominal pain", "Bloating", "Anorexia", "Fatigue"],
            labs:      { screening: ["Anemia"],  confirmatory: ["Positive tTG-IgA"] },
            radiology: { screening: [],          confirmatory: [] }
        },
        {
            name: "Mesenteric Ischemia", system: "git",
            medscapeLink: "https://emedicine.medscape.com/article/189140-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Acute", "Tachycardia", "Hypotension", "Atrial Fibrillation", "Malignancy"],
            ageBias: "Elderly (>55y)", onsetBias: "Acute",
            keyFeatures:      ["Abdominal pain", "Pain out of proportion", "Absent bowel sounds"],
            possibleFeatures: ["Nausea", "Vomiting", "Hematochezia", "Diarrhea", "Fever"],
            labs:      { screening: ["Leukocytosis", "Elevated lactate"],  confirmatory: [] },
            radiology: { screening: ["Dilated bowel loops"],               confirmatory: ["Bowel wall thickening on CT", "Pneumobilia on CT"] }
        },
        {
            name: "Esophageal Varices", system: "git",
            medscapeLink: "https://emedicine.medscape.com/article/174958-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Acute", "Alcohol use", "Malignancy"],
            ageBias: "Middle-aged (36-55y)", genderBias: "Male", onsetBias: "Acute",
            keyFeatures:      ["Hematemesis", "Melena", "Jaundice"],
            possibleFeatures: ["Ascites", "Hepatomegaly", "Spider angiomata", "Caput medusae"],
            labs:      { screening: ["Elevated AST/ALT", "Elevated bilirubin", "Anemia", "Low albumin", "Elevated INR"], confirmatory: [] },
            radiology: { screening: ["Portal hypertension on US"],                                                       confirmatory: [] }
        },
        {
            name: "Acute Gastroenteritis", system: "git",
            medscapeLink: "https://emedicine.medscape.com/article/176515-overview",
            demographics: ["Pediatric (1m-18y)", "Young Adult (18-35y)", "Male", "Female", "Acute", "Fever", "Recent Travel", "Dehydration"],
            ageBias: "Young Adult (18-35y)", onsetBias: "Acute",
            keyFeatures:      ["Diarrhea", "Vomiting", "Abdominal pain"],
            possibleFeatures: ["Nausea", "Fever", "Anorexia"],
            labs:      { screening: ["Leukocytosis"], confirmatory: [] },
            radiology: { screening: [],               confirmatory: [] }
        },
        {
            name: "Liver Cirrhosis", system: "git",
            medscapeLink: "https://emedicine.medscape.com/article/185856-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Chronic", "Alcohol use", "Family History of Cancer"],
            ageBias: "Middle-aged (36-55y)", genderBias: "Male", onsetBias: "Chronic",
            keyFeatures:      ["Jaundice", "Ascites", "Spider angiomata", "Hepatomegaly"],
            possibleFeatures: ["Caput medusae", "Palmar erythema", "Weight loss", "Fatigue", "Hematemesis"],
            labs:      { screening: ["Elevated AST/ALT", "Elevated bilirubin", "Elevated GGT", "Anemia", "Elevated INR"], confirmatory: ["Low albumin"] },
            radiology: { screening: ["Portal hypertension on US"],                                                        confirmatory: [] }
        },
        {
            name: "Ascending Cholangitis", system: "git",
            medscapeLink: "https://emedicine.medscape.com/article/183324-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Acute", "Fever", "Tachycardia", "Hypotension", "Prior Surgery", "Family History of Gallstones"],
            ageBias: "Elderly (>55y)", onsetBias: "Acute",
            keyFeatures:      ["Right upper quadrant tenderness", "Fever", "Jaundice", "Altered mental status"],
            possibleFeatures: ["Nausea", "Vomiting", "Abdominal pain", "Guarding"],
            labs:      { screening: ["Leukocytosis", "Elevated AST/ALT", "Elevated bilirubin", "Elevated ALP"], confirmatory: ["Positive blood culture"] },
            radiology: { screening: ["Gallstones on US", "GB wall thickening on US"],                           confirmatory: ["Pneumobilia on CT"] }
        },
        {
            name: "Intussusception", system: "git",
            medscapeLink: "https://emedicine.medscape.com/article/930237-overview",
            demographics: ["Pediatric (1m-18y)", "Male", "Acute", "Recent Viral Illness"],
            ageBias: "Pediatric (1m-18y)", genderBias: "Male", onsetBias: "Acute",
            keyFeatures:      ["Abdominal pain", "Currant jelly stool", "Vomiting"],
            possibleFeatures: ["Abdominal distension", "Guarding", "Fever", "Anorexia"],
            labs:      { screening: ["Leukocytosis"], confirmatory: [] },
            radiology: { screening: [],               confirmatory: ["Target sign on US"] }
        },

        // =====================================================================
        // RESPIRATORY (14)
        // =====================================================================
        {
            name: "Pneumonia", system: "resp",
            medscapeLink: "https://emedicine.medscape.com/article/300157-overview",
            demographics: ["Pediatric (1m-18y)", "Young Adult (18-35y)", "Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Acute", "Fever", "Tachypnea", "Tachycardia", "Hypoxia", "Immunosuppression", "Smoking"],
            ageBias: "Elderly (>55y)", onsetBias: "Acute",
            keyFeatures:      ["Cough", "Crackles", "Shortness of breath"],
            possibleFeatures: ["Pleuritic chest pain", "Hemoptysis", "Sputum production", "Dullness to percussion", "Fever"],
            labs:      { screening: ["Leukocytosis", "Hypoxemia (low PaO2)", "Elevated procalcitonin"], confirmatory: ["Positive sputum culture"] },
            radiology: { screening: ["Pleural effusion"],                                               confirmatory: ["Lobar infiltrate", "Air bronchograms"] }
        },
        {
            name: "Pulmonary Embolism", system: "resp",
            medscapeLink: "https://emedicine.medscape.com/article/300901-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Acute", "Tachycardia", "Tachypnea", "Hypoxia", "Immobilization", "Prior Surgery", "Smoking", "Pregnancy", "Malignancy"],
            ageBias: "Elderly (>55y)", onsetBias: "Acute",
            keyFeatures:      ["Pleuritic chest pain", "Shortness of breath"],
            possibleFeatures: ["Hemoptysis", "Syncope", "Hypotension", "Cyanosis", "Leg swelling"],
            labs:      { screening: ["Hypoxemia (low PaO2)", "Respiratory alkalosis", "Elevated troponin"], confirmatory: ["Elevated D-dimer"] },
            radiology: { screening: ["Hampton hump on CXR", "Westermark sign on CXR"],                     confirmatory: ["CT angiography filling defect"] }
        },
        {
            name: "Pneumothorax", system: "resp",
            medscapeLink: "https://emedicine.medscape.com/article/424547-overview",
            demographics: ["Young Adult (18-35y)", "Elderly (>55y)", "Male", "Female", "Acute", "Tachycardia", "Tachypnea", "Hypoxia", "Smoking", "Trauma"],
            ageBias: "Young Adult (18-35y)", genderBias: "Male", onsetBias: "Acute",
            keyFeatures:      ["Chest pain", "Shortness of breath", "Decreased breath sounds", "Hyperresonance to percussion"],
            possibleFeatures: ["Cyanosis", "Tracheal deviation", "Hypotension"],
            labs:      { screening: ["Hypoxemia (low PaO2)"],    confirmatory: [] },
            radiology: { screening: ["Mediastinal shift on CXR"], confirmatory: ["Pneumothorax on CXR"] }
        },
        {
            name: "Acute Asthma Exacerbation", system: "resp",
            medscapeLink: "https://emedicine.medscape.com/article/296301-overview",
            demographics: ["Pediatric (1m-18y)", "Young Adult (18-35y)", "Male", "Female", "Acute", "Episodic", "Tachypnea", "Tachycardia", "Hypoxia", "Family History of Asthma"],
            ageBias: "Pediatric (1m-18y)", onsetBias: "Acute",
            keyFeatures:      ["Wheezing", "Shortness of breath", "Accessory muscle use"],
            possibleFeatures: ["Cough", "Chest pain", "Cyanosis"],
            labs:      { screening: ["Hypoxemia (low PaO2)", "Respiratory alkalosis"], confirmatory: [] },
            radiology: { screening: ["Hyperinflation on CXR"],                         confirmatory: [] }
        },
        {
            name: "COPD Exacerbation", system: "resp",
            medscapeLink: "https://emedicine.medscape.com/article/297664-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Acute", "Tachypnea", "Tachycardia", "Hypoxia", "Smoking"],
            ageBias: "Elderly (>55y)", onsetBias: "Acute",
            keyFeatures:      ["Shortness of breath", "Wheezing", "Sputum production", "Barrel chest"],
            possibleFeatures: ["Cough", "Accessory muscle use", "Cyanosis", "Fatigue", "Clubbing"],
            labs:      { screening: ["Hypoxemia (low PaO2)", "Respiratory acidosis"], confirmatory: [] },
            radiology: { screening: ["Hyperinflation on CXR"],                        confirmatory: [] }
        },
        {
            name: "Tuberculosis", system: "resp",
            medscapeLink: "https://emedicine.medscape.com/article/230802-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Chronic", "Fever", "Recent Travel", "Immunosuppression"],
            ageBias: "Middle-aged (36-55y)", onsetBias: "Chronic",
            keyFeatures:      ["Cough", "Hemoptysis", "Night sweats", "Weight loss"],
            possibleFeatures: ["Chest pain", "Fatigue", "Shortness of breath", "Fever"],
            labs:      { screening: ["Elevated ESR"],                               confirmatory: ["Positive AFB smear", "Positive sputum culture"] },
            radiology: { screening: ["Apical cavitary lesion", "Pleural effusion"], confirmatory: [] }
        },
        {
            name: "Lung Cancer", system: "resp",
            medscapeLink: "https://emedicine.medscape.com/article/279960-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Chronic", "Smoking", "Malignancy"],
            ageBias: "Elderly (>55y)", genderBias: "Male", onsetBias: "Chronic",
            keyFeatures:      ["Cough", "Hemoptysis", "Weight loss", "Hoarseness"],
            possibleFeatures: ["Shortness of breath", "Chest pain", "Night sweats", "Fatigue"],
            labs:      { screening: ["Hypoxemia (low PaO2)"], confirmatory: [] },
            radiology: { screening: ["Lung mass on CT"],      confirmatory: [] }
        },
        {
            name: "Pleuritis", system: "resp",
            medscapeLink: "https://emedicine.medscape.com/article/300049-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Male", "Female", "Acute", "Recent Viral Illness", "Family History of Autoimmune Disease"],
            ageBias: "Young Adult (18-35y)", onsetBias: "Acute",
            keyFeatures:      ["Pleuritic chest pain", "Pleural friction rub", "Shortness of breath"],
            possibleFeatures: ["Cough", "Fever", "Fatigue"],
            labs:      { screening: ["Elevated CRP", "Elevated ESR"], confirmatory: [] },
            radiology: { screening: ["Pleural effusion"],              confirmatory: [] }
        },
        {
            name: "Acute Bronchitis", system: "resp",
            medscapeLink: "https://emedicine.medscape.com/article/297108-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Male", "Female", "Acute", "Smoking", "Recent Viral Illness"],
            ageBias: "Young Adult (18-35y)", onsetBias: "Acute",
            keyFeatures:      ["Cough", "Sputum production"],
            possibleFeatures: ["Wheezing", "Fever", "Shortness of breath", "Chest pain"],
            labs:      { screening: [], confirmatory: [] },
            radiology: { screening: [], confirmatory: [] }
        },
        {
            name: "Bronchiectasis", system: "resp",
            medscapeLink: "https://emedicine.medscape.com/article/296961-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Chronic", "Smoking", "Immunosuppression"],
            ageBias: "Middle-aged (36-55y)", onsetBias: "Chronic",
            keyFeatures:      ["Cough", "Sputum production", "Hemoptysis", "Clubbing"],
            possibleFeatures: ["Crackles", "Fever", "Shortness of breath", "Night sweats"],
            labs:      { screening: ["Positive sputum culture"],    confirmatory: [] },
            radiology: { screening: ["Tram-track opacities on CT"], confirmatory: [] }
        },
        {
            name: "Sarcoidosis", system: "resp",
            medscapeLink: "https://emedicine.medscape.com/article/301914-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Female", "Male", "Subacute", "Chronic"],
            ageBias: "Young Adult (18-35y)", genderBias: "Female", onsetBias: "Subacute",
            keyFeatures:      ["Shortness of breath", "Cough", "Fatigue"],
            possibleFeatures: ["Night sweats", "Weight loss", "Fever", "Vision changes"],
            labs:      { screening: ["Elevated ESR", "Hypercalcemia"], confirmatory: ["Elevated ACE level"] },
            radiology: { screening: ["Bilateral hilar lymphadenopathy on CXR"], confirmatory: ["Ground-glass opacities"] }
        },
        {
            name: "Epiglottitis", system: "resp",
            medscapeLink: "https://emedicine.medscape.com/article/763612-overview",
            demographics: ["Pediatric (1m-18y)", "Young Adult (18-35y)", "Male", "Female", "Acute", "Fever", "Tachycardia", "Immunosuppression"],
            ageBias: "Pediatric (1m-18y)", onsetBias: "Acute",
            keyFeatures:      ["Drooling", "Inspiratory stridor", "Tripod positioning", "Fever"],
            possibleFeatures: ["Dysphagia", "Hoarseness", "Shortness of breath", "Cough"],
            labs:      { screening: ["Leukocytosis"], confirmatory: [] },
            radiology: { screening: [],               confirmatory: ["Thumb sign on X-ray"] }
        },
        {
            name: "Croup", system: "resp",
            medscapeLink: "https://emedicine.medscape.com/article/803321-overview",
            demographics: ["Pediatric (1m-18y)", "Male", "Female", "Acute", "Fever", "Recent Viral Illness"],
            ageBias: "Pediatric (1m-18y)", onsetBias: "Acute",
            keyFeatures:      ["Barking cough", "Inspiratory stridor"],
            possibleFeatures: ["Fever", "Tachypnea", "Shortness of breath", "Cyanosis"],
            labs:      { screening: [], confirmatory: [] },
            radiology: { screening: [], confirmatory: ["Steeple sign on X-ray"] }
        },
        {
            name: "Aspiration Pneumonia", system: "resp",
            medscapeLink: "https://emedicine.medscape.com/article/296998-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Subacute", "Fever", "Tachypnea", "Hypoxia", "Alcohol use", "Immunosuppression"],
            ageBias: "Elderly (>55y)", onsetBias: "Subacute",
            keyFeatures:      ["Cough", "Crackles", "Shortness of breath", "Sputum production"],
            possibleFeatures: ["Fever", "Dullness to percussion", "Cyanosis", "Hemoptysis"],
            labs:      { screening: ["Leukocytosis", "Elevated procalcitonin"], confirmatory: ["Positive sputum culture"] },
            radiology: { screening: ["Lobar infiltrate"],                       confirmatory: ["Air bronchograms"] }
        },

        // =====================================================================
        // CARDIOVASCULAR (14)
        // =====================================================================
        {
            name: "Acute Myocardial Infarction", system: "cvs",
            medscapeLink: "https://emedicine.medscape.com/article/155919-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Acute", "Tachycardia", "Bradycardia", "Hypertension (Vital)", "Hypotension", "Smoking", "Hypertension (Hx)", "Diabetes", "Obesity", "Family History of CAD", "Hyperlipidemia"],
            ageBias: "Elderly (>55y)", genderBias: "Male", onsetBias: "Acute",
            keyFeatures:      ["Chest pain", "Diaphoresis", "Shortness of breath"],
            possibleFeatures: ["Nausea", "Palpitations", "Syncope", "S4 gallop", "Fatigue"],
            labs:      { screening: ["Elevated BNP"],  confirmatory: ["Elevated troponin", "ECG ST elevation", "ECG ST depression", "Elevated CK-MB"] },
            radiology: { screening: [],                confirmatory: ["Wall motion abnormality on echo"] }
        },
        {
            name: "Congestive Heart Failure", system: "cvs",
            medscapeLink: "https://emedicine.medscape.com/article/163062-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Subacute", "Chronic", "Tachycardia", "Tachypnea", "Hypoxia", "Hypertension (Hx)", "Diabetes", "Obesity", "Family History of CAD"],
            ageBias: "Elderly (>55y)", onsetBias: "Chronic",
            keyFeatures:      ["Shortness of breath", "Orthopnea", "Peripheral edema", "Jugular venous distension", "S3 gallop"],
            possibleFeatures: ["Paroxysmal nocturnal dyspnea", "Cough", "Fatigue", "Leg swelling", "Crackles"],
            labs:      { screening: ["Elevated creatinine", "Hyponatremia"],               confirmatory: ["Elevated BNP"] },
            radiology: { screening: ["Cardiomegaly on CXR", "Pleural effusion"],           confirmatory: ["Pulmonary edema on CXR", "Reduced ejection fraction on echo"] }
        },
        {
            name: "Aortic Dissection", system: "cvs",
            medscapeLink: "https://emedicine.medscape.com/article/2062452-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Acute", "Hypertension (Vital)", "Tachycardia", "Hypertension (Hx)", "Smoking", "Family History of Aneurysms"],
            ageBias: "Elderly (>55y)", genderBias: "Male", onsetBias: "Acute",
            keyFeatures:      ["Tearing chest pain", "Asymmetric blood pressure", "Absent distal pulses"],
            possibleFeatures: ["Syncope", "Shortness of breath", "New murmur", "Focal neurological deficit"],
            labs:      { screening: ["Elevated D-dimer", "Elevated creatinine"], confirmatory: [] },
            radiology: { screening: ["Mediastinal widening on CXR"],             confirmatory: ["Intimal flap on CT", "Aortic dilation on CT"] }
        },
        {
            name: "Cardiac Tamponade", system: "cvs",
            medscapeLink: "https://emedicine.medscape.com/article/152083-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Acute", "Tachycardia", "Hypotension", "Trauma", "Malignancy"],
            ageBias: "Middle-aged (36-55y)", onsetBias: "Acute",
            keyFeatures:      ["Hypotension", "Jugular venous distension", "Muffled heart sounds", "Pulsus paradoxus"],
            possibleFeatures: ["Shortness of breath", "Chest pain", "Dizziness", "Tachypnea"],
            labs:      { screening: ["Elevated troponin", "Metabolic acidosis"], confirmatory: [] },
            radiology: { screening: ["Cardiomegaly on CXR"],                     confirmatory: ["Pericardial effusion on echo"] }
        },
        {
            name: "Infective Endocarditis", system: "cvs",
            medscapeLink: "https://emedicine.medscape.com/article/216650-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Subacute", "Fever", "IV Drug Use", "Prior Surgery", "Immunosuppression"],
            ageBias: "Middle-aged (36-55y)", onsetBias: "Subacute",
            keyFeatures:      ["Fever", "New murmur", "Janeway lesions", "Osler nodes"],
            possibleFeatures: ["Fatigue", "Weight loss", "Night sweats", "Hematuria"],
            labs:      { screening: ["Leukocytosis", "Elevated ESR", "Elevated CRP"], confirmatory: ["Positive blood culture (Cardiac)"] },
            radiology: { screening: [],                                               confirmatory: ["Valvular abnormality on echo"] }
        },
        {
            name: "Deep Vein Thrombosis", system: "cvs",
            medscapeLink: "https://emedicine.medscape.com/article/1911303-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Acute", "Pregnancy", "Immobilization", "Prior Surgery", "Malignancy", "Smoking"],
            ageBias: "Elderly (>55y)", onsetBias: "Acute",
            keyFeatures:      ["Unilateral leg swelling", "Leg swelling"],
            possibleFeatures: ["Warmth over joint", "Erythema over joint", "Tenderness on palpation", "Fatigue"],
            labs:      { screening: ["Elevated D-dimer"], confirmatory: [] },
            radiology: { screening: [],                   confirmatory: ["Non-compressible vein on US"] }
        },
        {
            name: "Pericarditis", system: "cvs",
            medscapeLink: "https://emedicine.medscape.com/article/156951-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Male", "Female", "Acute", "Fever", "Recent Viral Illness", "Immunosuppression", "Malignancy"],
            ageBias: "Young Adult (18-35y)", genderBias: "Male", onsetBias: "Acute",
            keyFeatures:      ["Pleuritic chest pain", "Pericardial friction rub", "Fever"],
            possibleFeatures: ["Shortness of breath", "Fatigue", "Palpitations"],
            labs:      { screening: ["Elevated CRP", "Elevated ESR", "Elevated troponin"], confirmatory: ["ECG saddle-shaped ST elevation"] },
            radiology: { screening: [],                                                    confirmatory: ["Pericardial effusion on echo"] }
        },
        {
            name: "Atrial Fibrillation", system: "cvs",
            medscapeLink: "https://emedicine.medscape.com/article/151066-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Acute", "Episodic", "Tachycardia", "Hypertension (Hx)", "Alcohol use", "Hyperlipidemia"],
            ageBias: "Elderly (>55y)", genderBias: "Male", onsetBias: "Episodic",
            keyFeatures:      ["Palpitations", "Irregular pulse"],
            possibleFeatures: ["Syncope", "Shortness of breath", "Dizziness", "Fatigue", "Chest pain"],
            labs:      { screening: ["Elevated troponin"],   confirmatory: ["ECG atrial fibrillation"] },
            radiology: { screening: [],                      confirmatory: [] }
        },
        {
            name: "Hypertensive Emergency", system: "cvs",
            medscapeLink: "https://emedicine.medscape.com/article/1952052-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Acute", "Hypertension (Vital)", "Hypertension (Hx)", "Diabetes", "Smoking"],
            ageBias: "Elderly (>55y)", genderBias: "Male", onsetBias: "Acute",
            keyFeatures:      ["Headache", "Altered mental status"],
            possibleFeatures: ["Vision changes", "Shortness of breath", "Chest pain", "Nausea", "Papilledema"],
            labs:      { screening: ["Elevated creatinine", "Elevated troponin"],    confirmatory: [] },
            radiology: { screening: ["Hypertensive retinopathy on fundoscopy"],      confirmatory: [] }
        },
        {
            name: "Stable Angina", system: "cvs",
            medscapeLink: "https://emedicine.medscape.com/article/150215-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Chronic", "Episodic", "Hypertension (Hx)", "Diabetes", "Smoking", "Hyperlipidemia", "Family History of CAD"],
            ageBias: "Elderly (>55y)", genderBias: "Male", onsetBias: "Episodic",
            keyFeatures:      ["Chest pain", "Diaphoresis"],
            possibleFeatures: ["Shortness of breath", "Fatigue", "Palpitations", "Claudication"],
            labs:      { screening: ["ECG ST depression"], confirmatory: [] },
            radiology: { screening: [],                    confirmatory: ["Wall motion abnormality on echo"] }
        },
        {
            name: "Myocarditis", system: "cvs",
            medscapeLink: "https://emedicine.medscape.com/article/156330-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Male", "Female", "Subacute", "Tachycardia", "Fever", "Recent Viral Illness"],
            ageBias: "Young Adult (18-35y)", genderBias: "Male", onsetBias: "Subacute",
            keyFeatures:      ["Chest pain", "Fatigue", "Shortness of breath"],
            possibleFeatures: ["Palpitations", "Fever", "S3 gallop", "Peripheral edema"],
            labs:      { screening: ["Elevated troponin", "Elevated CRP", "Elevated ESR"], confirmatory: [] },
            radiology: { screening: [],                                                    confirmatory: ["Reduced ejection fraction on echo"] }
        },
        {
            name: "Aortic Stenosis", system: "cvs",
            medscapeLink: "https://emedicine.medscape.com/article/150638-overview",
            demographics: ["Elderly (>55y)", "Middle-aged (36-55y)", "Male", "Female", "Chronic", "Hypertension (Hx)", "Diabetes"],
            ageBias: "Elderly (>55y)", onsetBias: "Chronic",
            keyFeatures:      ["Syncope", "Shortness of breath", "New murmur", "Slow-rising pulse"],
            possibleFeatures: ["Chest pain", "Fatigue", "Dizziness"],
            labs:      { screening: ["Elevated BNP"], confirmatory: [] },
            radiology: { screening: [],               confirmatory: ["Valvular abnormality on echo"] }
        },
        {
            name: "Peripheral Artery Disease", system: "cvs",
            medscapeLink: "https://emedicine.medscape.com/article/761556-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Chronic", "Smoking", "Hypertension (Hx)", "Diabetes", "Hyperlipidemia", "Family History of CAD"],
            ageBias: "Elderly (>55y)", genderBias: "Male", onsetBias: "Chronic",
            keyFeatures:      ["Claudication", "Absent distal pulses"],
            possibleFeatures: ["Leg swelling", "Fatigue"],
            labs:      { screening: ["Ankle-Brachial Index < 0.9"], confirmatory: [] },
            radiology: { screening: [],                             confirmatory: [] }
        },
        {
            name: "Ventricular Tachycardia", system: "cvs",
            medscapeLink: "https://emedicine.medscape.com/article/159625-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Acute", "Tachycardia", "Hypertension (Hx)", "Diabetes", "Family History of CAD"],
            ageBias: "Elderly (>55y)", genderBias: "Male", onsetBias: "Acute",
            keyFeatures:      ["Palpitations", "Syncope"],
            possibleFeatures: ["Chest pain", "Shortness of breath", "Dizziness"],
            labs:      { screening: ["Elevated troponin"],            confirmatory: ["ECG wide complex tachycardia"] },
            radiology: { screening: [],                               confirmatory: [] }
        },

        // =====================================================================
        // RENAL / UROLOGICAL (13)
        // =====================================================================
        {
            name: "Acute Pyelonephritis", system: "renal",
            medscapeLink: "https://emedicine.medscape.com/article/245559-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Elderly (>55y)", "Female", "Male", "Acute", "Fever", "Tachycardia", "Pregnancy", "Diabetes"],
            ageBias: "Young Adult (18-35y)", genderBias: "Female", onsetBias: "Acute",
            keyFeatures:      ["Flank pain", "Fever", "Costovertebral angle tenderness", "Dysuria"],
            possibleFeatures: ["Nausea", "Vomiting", "Urinary frequency", "Urinary urgency", "Hematuria"],
            labs:      { screening: ["Leukocytosis", "Pyuria"],           confirmatory: ["Positive urine culture", "Urine WBC casts"] },
            radiology: { screening: [],                                   confirmatory: ["Perinephric stranding on CT"] }
        },
        {
            name: "Nephrolithiasis", system: "renal",
            medscapeLink: "https://emedicine.medscape.com/article/437096-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Male", "Female", "Acute", "Episodic", "Tachycardia", "Dehydration", "Family History of Kidney Stones"],
            ageBias: "Middle-aged (36-55y)", genderBias: "Male", onsetBias: "Acute",
            keyFeatures:      ["Flank pain", "Hematuria"],
            possibleFeatures: ["Nausea", "Vomiting", "Dysuria", "Urinary urgency"],
            labs:      { screening: ["Hematuria on urinalysis"],                         confirmatory: [] },
            radiology: { screening: ["Hydronephrosis on US", "Ureteral dilation on CT"], confirmatory: ["Renal calculus on CT"] }
        },
        {
            name: "Cystitis (UTI)", system: "renal",
            medscapeLink: "https://emedicine.medscape.com/article/233101-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Elderly (>55y)", "Female", "Male", "Acute", "Pregnancy", "Diabetes"],
            ageBias: "Young Adult (18-35y)", genderBias: "Female", onsetBias: "Acute",
            keyFeatures:      ["Dysuria", "Urinary frequency", "Urinary urgency", "Suprapubic pain"],
            possibleFeatures: ["Hematuria", "Suprapubic tenderness"],
            labs:      { screening: ["Pyuria", "Hematuria on urinalysis"],           confirmatory: ["Positive urine culture"] },
            radiology: { screening: [],                                              confirmatory: ["Bladder wall thickening on US"] }
        },
        {
            name: "Benign Prostatic Hyperplasia", system: "renal",
            medscapeLink: "https://emedicine.medscape.com/article/437359-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Chronic", "Obesity"],
            ageBias: "Elderly (>55y)", genderBias: "Male", onsetBias: "Chronic",
            keyFeatures:      ["Urinary frequency", "Hesitancy", "Enlarged prostate"],
            possibleFeatures: ["Urinary urgency", "Oliguria", "Suprapubic pain"],
            labs:      { screening: ["Elevated creatinine", "Hematuria on urinalysis"],         confirmatory: [] },
            radiology: { screening: ["Bladder wall thickening on US", "Hydronephrosis on US"], confirmatory: [] }
        },
        {
            name: "Testicular Torsion", system: "renal",
            medscapeLink: "https://emedicine.medscape.com/article/2036003-overview",
            demographics: ["Pediatric (1m-18y)", "Young Adult (18-35y)", "Male", "Acute", "Trauma"],
            ageBias: "Pediatric (1m-18y)", genderBias: "Male", onsetBias: "Acute",
            keyFeatures:      ["Testicular pain", "Absent cremasteric reflex", "High-riding testicle"],
            possibleFeatures: ["Nausea", "Vomiting", "Abdominal pain"],
            labs:      { screening: [], confirmatory: [] },
            radiology: { screening: [], confirmatory: ["Decreased testicular blood flow on US"] }
        },
        {
            name: "Acute Kidney Injury", system: "renal",
            medscapeLink: "https://emedicine.medscape.com/article/243492-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Acute", "Dehydration", "Trauma", "Immunosuppression", "Malignancy", "Diabetes"],
            ageBias: "Elderly (>55y)", onsetBias: "Acute",
            keyFeatures:      ["Oliguria"],
            possibleFeatures: ["Altered mental status", "Nausea", "Vomiting", "Fatigue", "Peripheral edema"],
            labs:      { screening: ["Elevated creatinine", "Elevated BUN", "Hyperkalemia"], confirmatory: ["Muddy brown casts on urinalysis"] },
            radiology: { screening: [],                                                      confirmatory: [] }
        },
        {
            name: "Chronic Kidney Disease", system: "renal",
            medscapeLink: "https://emedicine.medscape.com/article/238798-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Chronic", "Hypertension (Hx)", "Diabetes", "Obesity"],
            ageBias: "Elderly (>55y)", onsetBias: "Chronic",
            keyFeatures:      ["Fatigue", "Oliguria"],
            possibleFeatures: ["Nausea", "Vomiting", "Leg swelling", "Weight loss", "Dizziness"],
            labs:      { screening: ["Elevated creatinine", "Elevated BUN", "Proteinuria"], confirmatory: ["Hypoalbuminemia"] },
            radiology: { screening: ["Small kidneys on US"],                                confirmatory: [] }
        },
        {
            name: "Nephrotic Syndrome", system: "renal",
            medscapeLink: "https://emedicine.medscape.com/article/244631-overview",
            demographics: ["Pediatric (1m-18y)", "Young Adult (18-35y)", "Male", "Female", "Subacute", "Diabetes", "Immunosuppression"],
            ageBias: "Young Adult (18-35y)", onsetBias: "Subacute",
            keyFeatures:      ["Peripheral edema", "Proteinuria", "Leg swelling"],
            possibleFeatures: ["Fatigue", "Oliguria", "Weight gain"],
            labs:      { screening: ["Proteinuria", "Hypoalbuminemia"], confirmatory: ["Lipiduria"] },
            radiology: { screening: [],                                 confirmatory: [] }
        },
        {
            name: "Acute Glomerulonephritis", system: "renal",
            medscapeLink: "https://emedicine.medscape.com/article/239494-overview",
            demographics: ["Pediatric (1m-18y)", "Young Adult (18-35y)", "Male", "Female", "Acute", "Recent Viral Illness", "Hypertension (Vital)"],
            ageBias: "Young Adult (18-35y)", onsetBias: "Acute",
            keyFeatures:      ["Hematuria", "Proteinuria", "Oliguria"],
            possibleFeatures: ["Peripheral edema", "Fatigue", "Hypertension (Vital)"],
            labs:      { screening: ["Hematuria on urinalysis", "Proteinuria", "Elevated creatinine"], confirmatory: ["RBC casts on urinalysis"] },
            radiology: { screening: [],                                                               confirmatory: [] }
        },
        {
            name: "Renal Cell Carcinoma", system: "renal",
            medscapeLink: "https://emedicine.medscape.com/article/281335-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Chronic", "Smoking", "Obesity", "Hypertension (Hx)"],
            ageBias: "Elderly (>55y)", genderBias: "Male", onsetBias: "Chronic",
            keyFeatures:      ["Flank pain", "Hematuria", "Flank mass"],
            possibleFeatures: ["Weight loss", "Fatigue", "Night sweats", "Fever"],
            labs:      { screening: ["Hematuria on urinalysis", "Anemia"], confirmatory: [] },
            radiology: { screening: ["Renal mass on CT"],                  confirmatory: [] }
        },
        {
            name: "Polycystic Kidney Disease", system: "renal",
            medscapeLink: "https://emedicine.medscape.com/article/244907-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Male", "Female", "Chronic", "Hypertension (Hx)", "Family History of Aneurysms"],
            ageBias: "Young Adult (18-35y)", onsetBias: "Chronic",
            keyFeatures:      ["Flank pain", "Hematuria"],
            possibleFeatures: ["Urinary frequency", "Costovertebral angle tenderness", "Headache"],
            labs:      { screening: ["Hematuria on urinalysis", "Elevated creatinine"], confirmatory: [] },
            radiology: { screening: ["Multiple renal cysts on US"],                     confirmatory: [] }
        },
        {
            name: "Bladder Cancer", system: "renal",
            medscapeLink: "https://emedicine.medscape.com/article/231930-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Chronic", "Smoking"],
            ageBias: "Elderly (>55y)", genderBias: "Male", onsetBias: "Chronic",
            keyFeatures:      ["Hematuria", "Dysuria", "Urinary frequency"],
            possibleFeatures: ["Suprapubic pain", "Weight loss", "Oliguria"],
            labs:      { screening: ["Hematuria on urinalysis"], confirmatory: [] },
            radiology: { screening: ["Bladder mass on CT"],      confirmatory: [] }
        },
        {
            name: "Prostate Cancer", system: "renal",
            medscapeLink: "https://emedicine.medscape.com/article/378253-overview",
            demographics: ["Elderly (>55y)", "Male", "Chronic", "Family History of Cancer"],
            ageBias: "Elderly (>55y)", genderBias: "Male", onsetBias: "Chronic",
            keyFeatures:      ["Hesitancy", "Urinary frequency", "Hard irregular prostate"],
            possibleFeatures: ["Dysuria", "Hematuria", "Back pain", "Weight loss"],
            labs:      { screening: ["Elevated PSA"],                  confirmatory: [] },
            radiology: { screening: ["Bladder wall thickening on US"], confirmatory: ["Bone metastases on bone scan"] }
        },

        // =====================================================================
        // NEUROLOGICAL (15)
        // =====================================================================
        {
            name: "Acute Ischemic Stroke", system: "neuro",
            medscapeLink: "https://emedicine.medscape.com/article/1916852-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Acute", "Hypertension (Vital)", "Hypertension (Hx)", "Diabetes", "Smoking", "Atrial Fibrillation", "Hyperlipidemia"],
            ageBias: "Elderly (>55y)", onsetBias: "Acute",
            keyFeatures:      ["Focal weakness", "Focal neurological deficit", "Aphasia", "Hemiparesis"],
            possibleFeatures: ["Altered mental status", "Vision changes", "Headache", "Dizziness", "GCS < 15"],
            labs:      { screening: ["Hyperglycemia"],                                             confirmatory: [] },
            radiology: { screening: ["Loss of gray-white differentiation on CT"],                  confirmatory: ["MRI diffusion restriction", "CT angiography vessel occlusion"] }
        },
        {
            name: "Bacterial Meningitis", system: "neuro",
            medscapeLink: "https://emedicine.medscape.com/article/961497-overview",
            demographics: ["Neonate (<1m)", "Pediatric (1m-18y)", "Young Adult (18-35y)", "Elderly (>55y)", "Male", "Female", "Acute", "Fever", "Tachycardia", "Immunosuppression"],
            ageBias: "Pediatric (1m-18y)", onsetBias: "Acute",
            keyFeatures:      ["Headache", "Fever", "Nuchal rigidity", "Altered mental status"],
            possibleFeatures: ["Photophobia", "Seizures", "Kernig's sign", "Brudzinski's sign", "Vomiting"],
            labs:      { screening: ["Leukocytosis", "Positive blood culture"],                         confirmatory: ["Elevated CSF WBC", "Positive CSF culture", "Decreased CSF glucose", "Elevated CSF opening pressure"] },
            radiology: { screening: ["Cerebral edema on CT"],                                           confirmatory: ["Meningeal enhancement on MRI"] }
        },
        {
            name: "Subarachnoid Hemorrhage", system: "neuro",
            medscapeLink: "https://emedicine.medscape.com/article/1164341-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Acute", "Hypertension (Vital)", "Hypertension (Hx)", "Smoking", "Family History of Aneurysms"],
            ageBias: "Middle-aged (36-55y)", onsetBias: "Acute",
            keyFeatures:      ["Headache", "Nuchal rigidity", "Altered mental status"],
            possibleFeatures: ["Vomiting", "Photophobia", "Seizures", "Focal neurological deficit", "GCS < 15"],
            labs:      { screening: ["Elevated CSF opening pressure"], confirmatory: ["Xanthochromia in CSF"] },
            radiology: { screening: [],                                confirmatory: ["Subarachnoid hemorrhage on CT", "CT angiography aneurysm"] }
        },
        {
            name: "Migraine", system: "neuro",
            medscapeLink: "https://emedicine.medscape.com/article/1142556-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Female", "Male", "Episodic"],
            ageBias: "Young Adult (18-35y)", genderBias: "Female", onsetBias: "Episodic",
            keyFeatures:      ["Unilateral throbbing headache", "Photophobia", "Nausea"],
            possibleFeatures: ["Vision changes", "Vomiting", "Dizziness"],
            labs:      { screening: [], confirmatory: [] },
            radiology: { screening: [], confirmatory: [] }
        },
        {
            name: "Multiple Sclerosis", system: "neuro",
            medscapeLink: "https://emedicine.medscape.com/article/1146199-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Female", "Male", "Episodic", "Subacute", "Family History of Autoimmune Disease"],
            ageBias: "Young Adult (18-35y)", genderBias: "Female", onsetBias: "Episodic",
            keyFeatures:      ["Vision changes", "Focal weakness", "Fatigue", "Numbness in hands"],
            possibleFeatures: ["Dizziness", "Altered mental status", "Muscle weakness"],
            labs:      { screening: ["Elevated CSF protein"],           confirmatory: ["Oligoclonal bands in CSF"] },
            radiology: { screening: [],                                 confirmatory: ["Periventricular white matter plaques on MRI"] }
        },
        {
            name: "Parkinson's Disease", system: "neuro",
            medscapeLink: "https://emedicine.medscape.com/article/1831191-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Chronic"],
            ageBias: "Elderly (>55y)", genderBias: "Male", onsetBias: "Chronic",
            keyFeatures:      ["Resting tremor", "Cogwheel rigidity", "Bradykinesia"],
            possibleFeatures: ["Fatigue", "Altered mental status", "Constipation"],
            labs:      { screening: [], confirmatory: [] },
            radiology: { screening: [], confirmatory: [] }
        },
        {
            name: "Epidural Hematoma", system: "neuro",
            medscapeLink: "https://emedicine.medscape.com/article/824029-overview",
            demographics: ["Pediatric (1m-18y)", "Young Adult (18-35y)", "Male", "Female", "Acute", "Trauma"],
            ageBias: "Young Adult (18-35y)", genderBias: "Male", onsetBias: "Acute",
            keyFeatures:      ["Headache", "Altered mental status", "GCS < 15"],
            possibleFeatures: ["Vomiting", "Focal weakness", "Seizures", "Focal neurological deficit"],
            labs:      { screening: [], confirmatory: [] },
            radiology: { screening: ["Midline shift on CT"], confirmatory: ["Lens-shaped hemorrhage on CT"] }
        },
        {
            name: "Guillain-Barré Syndrome", system: "neuro",
            medscapeLink: "https://emedicine.medscape.com/article/315632-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Male", "Female", "Subacute", "Recent Viral Illness"],
            ageBias: "Young Adult (18-35y)", genderBias: "Male", onsetBias: "Subacute",
            keyFeatures:      ["Ascending paralysis", "Absent deep tendon reflexes", "Focal weakness"],
            possibleFeatures: ["Fatigue", "Cranial nerve palsy", "Neck stiffness", "Shortness of breath"],
            labs:      { screening: ["Elevated CSF protein"], confirmatory: [] },
            radiology: { screening: [],                       confirmatory: [] }
        },
        {
            name: "Bell's Palsy", system: "neuro",
            medscapeLink: "https://emedicine.medscape.com/article/1146903-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Male", "Female", "Acute", "Recent Viral Illness", "Pregnancy"],
            ageBias: "Young Adult (18-35y)", onsetBias: "Acute",
            keyFeatures:      ["Unilateral facial palsy", "Cranial nerve palsy"],
            possibleFeatures: ["Headache", "Neck stiffness", "Ipsilateral lacrimation", "Vision changes"],
            labs:      { screening: [], confirmatory: [] },
            radiology: { screening: [], confirmatory: [] }
        },
        {
            name: "Epilepsy (New-onset Seizure)", system: "neuro",
            medscapeLink: "https://emedicine.medscape.com/article/1184846-overview",
            demographics: ["Pediatric (1m-18y)", "Young Adult (18-35y)", "Middle-aged (36-55y)", "Male", "Female", "Acute", "Episodic", "Alcohol use", "Immunosuppression"],
            ageBias: "Young Adult (18-35y)", onsetBias: "Acute",
            keyFeatures:      ["Seizures", "Altered mental status", "GCS < 15"],
            possibleFeatures: ["Headache", "Focal neurological deficit", "Fatigue"],
            labs:      { screening: [],  confirmatory: ["EEG abnormality"] },
            radiology: { screening: [],  confirmatory: [] }
        },
        {
            name: "Subdural Hematoma", system: "neuro",
            medscapeLink: "https://emedicine.medscape.com/article/1137207-overview",
            demographics: ["Elderly (>55y)", "Middle-aged (36-55y)", "Male", "Female", "Subacute", "Trauma", "Alcohol use", "Malignancy"],
            ageBias: "Elderly (>55y)", genderBias: "Male", onsetBias: "Subacute",
            keyFeatures:      ["Headache", "Altered mental status", "GCS < 15"],
            possibleFeatures: ["Focal weakness", "Focal neurological deficit", "Seizures", "Vomiting"],
            labs:      { screening: [], confirmatory: [] },
            radiology: { screening: ["Midline shift on CT"], confirmatory: ["Crescent-shaped hemorrhage on CT"] }
        },
        {
            name: "Intracerebral Hemorrhage", system: "neuro",
            medscapeLink: "https://emedicine.medscape.com/article/1163977-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Acute", "Hypertension (Vital)", "Hypertension (Hx)", "Smoking", "Alcohol use"],
            ageBias: "Elderly (>55y)", genderBias: "Male", onsetBias: "Acute",
            keyFeatures:      ["Headache", "Focal neurological deficit", "GCS < 15", "Altered mental status"],
            possibleFeatures: ["Vomiting", "Seizures", "Hemiparesis", "Aphasia"],
            labs:      { screening: [],                      confirmatory: [] },
            radiology: { screening: ["CT hyperdense lesion"], confirmatory: ["Midline shift on CT"] }
        },
        {
            name: "Tension Headache", system: "neuro",
            medscapeLink: "https://emedicine.medscape.com/article/1142908-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Female", "Male", "Episodic", "Chronic"],
            ageBias: "Young Adult (18-35y)", genderBias: "Female", onsetBias: "Episodic",
            keyFeatures:      ["Band-like headache", "Headache"],
            possibleFeatures: ["Neck stiffness", "Fatigue"],
            labs:      { screening: [], confirmatory: [] },
            radiology: { screening: [], confirmatory: [] }
        },
        {
            name: "Cluster Headache", system: "neuro",
            medscapeLink: "https://emedicine.medscape.com/article/1142459-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Male", "Episodic", "Smoking", "Alcohol use"],
            ageBias: "Young Adult (18-35y)", genderBias: "Male", onsetBias: "Episodic",
            keyFeatures:      ["Severe orbital pain", "Ipsilateral lacrimation", "Ipsilateral eye pain"],
            possibleFeatures: ["Headache", "Photophobia", "Vomiting"],
            labs:      { screening: [], confirmatory: [] },
            radiology: { screening: [], confirmatory: [] }
        },
        {
            name: "Transient Ischemic Attack (TIA)", system: "neuro",
            medscapeLink: "https://emedicine.medscape.com/article/1145913-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Episodic", "Hypertension (Hx)", "Diabetes", "Smoking", "Atrial Fibrillation", "Hyperlipidemia"],
            ageBias: "Elderly (>55y)", genderBias: "Male", onsetBias: "Episodic",
            keyFeatures:      ["Focal weakness", "Focal neurological deficit", "Aphasia"],
            possibleFeatures: ["Vision changes", "Dizziness", "Headache", "Hemiparesis"],
            labs:      { screening: ["Hyperglycemia"],                                             confirmatory: [] },
            radiology: { screening: ["Loss of gray-white differentiation on CT"],                  confirmatory: ["MRI diffusion restriction", "CT angiography vessel occlusion"] }
        },

        // =====================================================================
        // ENDOCRINE (13)
        // =====================================================================
        {
            name: "Diabetic Ketoacidosis (DKA)", system: "endo",
            medscapeLink: "https://emedicine.medscape.com/article/118361-overview",
            demographics: ["Pediatric (1m-18y)", "Young Adult (18-35y)", "Middle-aged (36-55y)", "Male", "Female", "Acute", "Tachycardia", "Tachypnea", "Hypotension", "Diabetes"],
            ageBias: "Young Adult (18-35y)", onsetBias: "Acute",
            keyFeatures:      ["Polyuria", "Polydipsia", "Kussmaul breathing", "Elevated anion gap"],
            possibleFeatures: ["Nausea", "Vomiting", "Abdominal pain", "Altered mental status", "Fatigue"],
            labs:      { screening: ["Hyperglycemia", "Hyponatremia", "Hyperkalemia"], confirmatory: ["Ketonuria", "Ketonemia"] },
            radiology: { screening: [],                                                confirmatory: [] }
        },
        {
            name: "Hyperthyroidism", system: "endo",
            medscapeLink: "https://emedicine.medscape.com/article/120619-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Female", "Male", "Subacute", "Chronic", "Tachycardia", "Hypertension (Vital)", "Family History of Autoimmune Disease"],
            ageBias: "Middle-aged (36-55y)", genderBias: "Female", onsetBias: "Chronic",
            keyFeatures:      ["Heat intolerance", "Tremor", "Weight loss", "Goiter", "Exophthalmos"],
            possibleFeatures: ["Palpitations", "Fatigue", "Warm moist skin", "Lid lag", "Diarrhea"],
            labs:      { screening: [],                                       confirmatory: ["Decreased TSH", "Elevated free T4"] },
            radiology: { screening: [],                                       confirmatory: ["Diffusely increased thyroid uptake scan"] }
        },
        {
            name: "Hypothyroidism", system: "endo",
            medscapeLink: "https://emedicine.medscape.com/article/122393-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Female", "Male", "Chronic", "Bradycardia", "Family History of Autoimmune Disease"],
            ageBias: "Middle-aged (36-55y)", genderBias: "Female", onsetBias: "Chronic",
            keyFeatures:      ["Weight gain", "Cold intolerance", "Fatigue", "Dry skin", "Delayed relaxation of DTRs"],
            possibleFeatures: ["Constipation", "Bradycardia", "Goiter", "Muscle weakness"],
            labs:      { screening: ["Anemia"],                               confirmatory: ["Elevated TSH", "Decreased free T4"] },
            radiology: { screening: [],                                       confirmatory: [] }
        },
        {
            name: "Addison's Disease", system: "endo",
            medscapeLink: "https://emedicine.medscape.com/article/116467-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Female", "Male", "Chronic", "Hypotension", "Family History of Autoimmune Disease"],
            ageBias: "Middle-aged (36-55y)", genderBias: "Female", onsetBias: "Chronic",
            keyFeatures:      ["Fatigue", "Weight loss", "Hyperpigmentation", "Hypotension"],
            possibleFeatures: ["Nausea", "Vomiting", "Abdominal pain", "Dizziness"],
            labs:      { screening: ["Hyponatremia", "Hyperkalemia"], confirmatory: ["Low morning cortisol"] },
            radiology: { screening: [],                               confirmatory: [] }
        },
        {
            name: "Cushing's Syndrome", system: "endo",
            medscapeLink: "https://emedicine.medscape.com/article/117365-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Female", "Male", "Chronic", "Hypertension (Vital)", "Obesity"],
            ageBias: "Middle-aged (36-55y)", genderBias: "Female", onsetBias: "Chronic",
            keyFeatures:      ["Weight gain", "Moon facies", "Buffalo hump", "Striae"],
            possibleFeatures: ["Fatigue", "Muscle weakness", "Hypertension (Vital)"],
            labs:      { screening: ["Hyperglycemia"],         confirmatory: ["High midnight cortisol"] },
            radiology: { screening: [],                        confirmatory: ["Adrenal mass on CT"] }
        },
        {
            name: "Type 2 Diabetes Mellitus", system: "endo",
            medscapeLink: "https://emedicine.medscape.com/article/117853-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Chronic", "Obesity", "Hypertension (Hx)", "Hyperlipidemia"],
            ageBias: "Middle-aged (36-55y)", onsetBias: "Chronic",
            keyFeatures:      ["Polydipsia", "Fatigue", "Acanthosis nigricans"],
            possibleFeatures: ["Weight gain", "Polyuria", "Vision changes", "Numbness in hands"],
            labs:      { screening: ["Hyperglycemia"],          confirmatory: ["Elevated HbA1c"] },
            radiology: { screening: [],                         confirmatory: [] }
        },
        {
            name: "Thyroid Storm", system: "endo",
            medscapeLink: "https://emedicine.medscape.com/article/121865-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Female", "Male", "Acute", "Fever", "Tachycardia", "Family History of Autoimmune Disease"],
            ageBias: "Middle-aged (36-55y)", genderBias: "Female", onsetBias: "Acute",
            keyFeatures:      ["Heat intolerance", "Tremor", "Altered mental status", "Exophthalmos"],
            possibleFeatures: ["Vomiting", "Diarrhea", "Warm moist skin", "Palpitations"],
            labs:      { screening: [],                                       confirmatory: ["Decreased TSH", "Elevated free T4"] },
            radiology: { screening: [],                                       confirmatory: ["Diffusely increased thyroid uptake scan"] }
        },
        {
            name: "Primary Hyperparathyroidism", system: "endo",
            medscapeLink: "https://emedicine.medscape.com/article/127350-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Female", "Male", "Chronic"],
            ageBias: "Middle-aged (36-55y)", genderBias: "Female", onsetBias: "Chronic",
            keyFeatures:      ["Fatigue", "Constipation", "Polydipsia"],
            possibleFeatures: ["Bone pain", "Nausea", "Altered mental status", "Abdominal pain"],
            labs:      { screening: ["Hypercalcemia"], confirmatory: [] },
            radiology: { screening: [],                confirmatory: [] }
        },
        {
            name: "Hypoparathyroidism", system: "endo",
            medscapeLink: "https://emedicine.medscape.com/article/127351-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Female", "Male", "Chronic", "Prior Surgery"],
            ageBias: "Middle-aged (36-55y)", genderBias: "Female", onsetBias: "Chronic",
            keyFeatures:      ["Tetany", "Positive Chvostek's sign", "Positive Trousseau's sign"],
            possibleFeatures: ["Seizures", "Numbness in hands", "Muscle weakness", "Fatigue"],
            labs:      { screening: ["Hypocalcemia"], confirmatory: [] },
            radiology: { screening: [],               confirmatory: [] }
        },
        {
            name: "Pheochromocytoma", system: "endo",
            medscapeLink: "https://emedicine.medscape.com/article/124059-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Male", "Female", "Episodic", "Hypertension (Vital)", "Tachycardia"],
            ageBias: "Middle-aged (36-55y)", onsetBias: "Episodic",
            keyFeatures:      ["Diaphoresis", "Tremor", "Headache"],
            possibleFeatures: ["Palpitations", "Fatigue", "Weight loss", "Heat intolerance"],
            labs:      { screening: [],                            confirmatory: ["Elevated metanephrines"] },
            radiology: { screening: [],                            confirmatory: ["Adrenal mass on CT"] }
        },
        {
            name: "SIADH", system: "endo",
            medscapeLink: "https://emedicine.medscape.com/article/246694-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Subacute", "Malignancy", "Immunosuppression"],
            ageBias: "Elderly (>55y)", onsetBias: "Subacute",
            keyFeatures:      ["Altered mental status", "Headache", "Nausea"],
            possibleFeatures: ["Seizures", "Fatigue", "Vomiting"],
            labs:      { screening: ["Hyponatremia", "Low serum osmolality"], confirmatory: [] },
            radiology: { screening: [],                                       confirmatory: [] }
        },
        {
            name: "Diabetes Insipidus", system: "endo",
            medscapeLink: "https://emedicine.medscape.com/article/117648-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Male", "Female", "Chronic", "Trauma", "Malignancy"],
            ageBias: "Young Adult (18-35y)", onsetBias: "Chronic",
            keyFeatures:      ["Polydipsia", "Polyuria"],
            possibleFeatures: ["Fatigue", "Dizziness", "Altered mental status"],
            labs:      { screening: ["Hypernatremia"], confirmatory: [] },
            radiology: { screening: [],                confirmatory: ["Pituitary adenoma on MRI"] }
        },
        {
            name: "Hyperosmolar Hyperglycemic State (HHS)", system: "endo",
            medscapeLink: "https://emedicine.medscape.com/article/119132-overview",
            demographics: ["Elderly (>55y)", "Middle-aged (36-55y)", "Male", "Female", "Acute", "Tachycardia", "Hypotension", "Diabetes", "Dehydration"],
            ageBias: "Elderly (>55y)", onsetBias: "Acute",
            keyFeatures:      ["Altered mental status", "Polydipsia", "Polyuria"],
            possibleFeatures: ["Fatigue", "Nausea", "Vomiting", "Seizures"],
            labs:      { screening: ["Hyperglycemia", "Hypernatremia"], confirmatory: ["Elevated HbA1c"] },
            radiology: { screening: [],                                 confirmatory: [] }
        },

        // =====================================================================
        // MUSCULOSKELETAL (13)
        // =====================================================================
        {
            name: "Septic Arthritis", system: "msk",
            medscapeLink: "https://emedicine.medscape.com/article/236299-overview",
            demographics: ["Pediatric (1m-18y)", "Young Adult (18-35y)", "Elderly (>55y)", "Male", "Female", "Acute", "Fever", "Tachycardia", "Immunosuppression", "Prior Surgery"],
            ageBias: "Elderly (>55y)", onsetBias: "Acute",
            keyFeatures:      ["Joint pain", "Joint swelling", "Warmth over joint", "Fever", "Restricted range of motion"],
            possibleFeatures: ["Erythema over joint", "Fatigue", "Joint effusion", "Tenderness on palpation"],
            labs:      { screening: ["Elevated CRP", "Leukocytosis"],                           confirmatory: ["Synovial fluid WBC > 50,000", "Positive synovial fluid culture"] },
            radiology: { screening: ["Soft tissue swelling on X-ray"],                          confirmatory: ["Joint effusion on US"] }
        },
        {
            name: "Osteoarthritis", system: "msk",
            medscapeLink: "https://emedicine.medscape.com/article/330487-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Female", "Male", "Chronic", "Obesity", "Prior Surgery", "Trauma"],
            ageBias: "Elderly (>55y)", genderBias: "Female", onsetBias: "Chronic",
            keyFeatures:      ["Joint pain", "Crepitus", "Limited range of motion"],
            possibleFeatures: ["Morning stiffness", "Joint swelling", "Restricted range of motion"],
            labs:      { screening: [], confirmatory: [] },
            radiology: { screening: ["Osteophytes on X-ray"], confirmatory: ["Joint space narrowing on X-ray"] }
        },
        {
            name: "Rheumatoid Arthritis", system: "msk",
            medscapeLink: "https://emedicine.medscape.com/article/331715-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Female", "Male", "Chronic", "Smoking", "Family History of Autoimmune Disease"],
            ageBias: "Middle-aged (36-55y)", genderBias: "Female", onsetBias: "Chronic",
            keyFeatures:      ["Joint pain", "Joint swelling", "Morning stiffness"],
            possibleFeatures: ["Fatigue", "Warmth over joint", "Restricted range of motion"],
            labs:      { screening: ["Elevated ESR", "Elevated CRP"],                           confirmatory: ["Positive rheumatoid factor", "Positive anti-CCP"] },
            radiology: { screening: ["Soft tissue swelling on X-ray"],                          confirmatory: ["Erosions on X-ray", "Joint space narrowing on X-ray"] }
        },
        {
            name: "Gout", system: "msk",
            medscapeLink: "https://emedicine.medscape.com/article/329958-overview",
            demographics: ["Middle-aged (36-55y)", "Elderly (>55y)", "Male", "Female", "Acute", "Episodic", "Obesity", "Alcohol use", "Hypertension (Hx)"],
            ageBias: "Middle-aged (36-55y)", genderBias: "Male", onsetBias: "Acute",
            keyFeatures:      ["Severe toe pain", "Joint swelling", "Erythema over joint", "Tophi"],
            possibleFeatures: ["Joint pain", "Warmth over joint", "Fever"],
            labs:      { screening: ["Elevated uric acid"],                                     confirmatory: ["Negatively birefringent crystals"] },
            radiology: { screening: ["Soft tissue swelling on X-ray"],                          confirmatory: ["Punched-out erosions on X-ray"] }
        },
        {
            name: "Pseudogout (CPPD)", system: "msk",
            medscapeLink: "https://emedicine.medscape.com/article/330936-overview",
            demographics: ["Elderly (>55y)", "Middle-aged (36-55y)", "Male", "Female", "Acute", "Episodic", "Trauma"],
            ageBias: "Elderly (>55y)", onsetBias: "Acute",
            keyFeatures:      ["Joint pain", "Joint swelling", "Warmth over joint"],
            possibleFeatures: ["Erythema over joint", "Fever", "Limited range of motion"],
            labs:      { screening: [],                               confirmatory: ["Positively birefringent crystals"] },
            radiology: { screening: ["Chondrocalcinosis on X-ray"],   confirmatory: [] }
        },
        {
            name: "Ankylosing Spondylitis", system: "msk",
            medscapeLink: "https://emedicine.medscape.com/article/332945-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Male", "Chronic", "Family History of Autoimmune Disease"],
            ageBias: "Young Adult (18-35y)", genderBias: "Male", onsetBias: "Chronic",
            keyFeatures:      ["Back pain", "Morning stiffness", "Limited range of motion"],
            possibleFeatures: ["Joint pain", "Fatigue", "Night sweats"],
            labs:      { screening: ["Elevated ESR", "Elevated CRP"], confirmatory: ["Positive HLA-B27"] },
            radiology: { screening: ["Sacroiliitis on MRI"],           confirmatory: ["Bamboo spine on X-ray"] }
        },
        {
            name: "Systemic Lupus Erythematosus (SLE)", system: "msk",
            medscapeLink: "https://emedicine.medscape.com/article/332244-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Female", "Subacute", "Chronic", "Episodic", "Family History of Autoimmune Disease"],
            ageBias: "Young Adult (18-35y)", genderBias: "Female", onsetBias: "Episodic",
            keyFeatures:      ["Joint pain", "Malar rash", "Fatigue"],
            possibleFeatures: ["Fever", "Weight loss", "Hematuria", "Photophobia", "Pleuritic chest pain"],
            labs:      { screening: ["Elevated ESR", "Anemia"],                                 confirmatory: ["Positive ANA", "Positive anti-dsDNA"] },
            radiology: { screening: [],                                                         confirmatory: [] }
        },
        {
            name: "Carpal Tunnel Syndrome", system: "msk",
            medscapeLink: "https://emedicine.medscape.com/article/327330-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Female", "Male", "Chronic", "Pregnancy", "Obesity", "Diabetes"],
            ageBias: "Middle-aged (36-55y)", genderBias: "Female", onsetBias: "Chronic",
            keyFeatures:      ["Numbness in hands", "Positive Tinel's sign", "Positive Phalen's sign"],
            possibleFeatures: ["Joint pain", "Muscle weakness", "Limited range of motion"],
            labs:      { screening: [], confirmatory: [] },
            radiology: { screening: [], confirmatory: [] }
        },
        {
            name: "Osteomyelitis", system: "msk",
            medscapeLink: "https://emedicine.medscape.com/article/1348767-overview",
            demographics: ["Pediatric (1m-18y)", "Elderly (>55y)", "Male", "Female", "Subacute", "Fever", "Tachycardia", "Diabetes", "IV Drug Use", "Prior Surgery", "Immunosuppression"],
            ageBias: "Pediatric (1m-18y)", onsetBias: "Subacute",
            keyFeatures:      ["Bone pain", "Localized bone tenderness", "Fever"],
            possibleFeatures: ["Joint swelling", "Soft tissue swelling", "Restricted range of motion", "Fatigue"],
            labs:      { screening: ["Leukocytosis", "Elevated ESR", "Elevated CRP"],           confirmatory: ["Positive blood culture"] },
            radiology: { screening: ["Periosteal reaction on X-ray"],                           confirmatory: ["MRI bone marrow edema"] }
        },
        {
            name: "Fibromyalgia", system: "msk",
            medscapeLink: "https://emedicine.medscape.com/article/329838-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Female", "Chronic"],
            ageBias: "Middle-aged (36-55y)", genderBias: "Female", onsetBias: "Chronic",
            keyFeatures:      ["Widespread pain", "Tender points on exam", "Fatigue"],
            possibleFeatures: ["Morning stiffness", "Muscle weakness", "Back pain", "Headache"],
            labs:      { screening: [], confirmatory: [] },
            radiology: { screening: [], confirmatory: [] }
        },
        {
            name: "Compartment Syndrome", system: "msk",
            medscapeLink: "https://emedicine.medscape.com/article/307668-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Male", "Female", "Acute", "Trauma", "Prior Surgery"],
            ageBias: "Young Adult (18-35y)", genderBias: "Male", onsetBias: "Acute",
            keyFeatures:      ["Pain out of proportion", "Tense compartment"],
            possibleFeatures: ["Joint swelling", "Restricted range of motion", "Numbness in hands", "Muscle weakness"],
            labs:      { screening: ["Elevated CRP", "Elevated lactate"], confirmatory: [] },
            radiology: { screening: [],                                   confirmatory: [] }
        },
        {
            name: "Avascular Necrosis (Hip)", system: "msk",
            medscapeLink: "https://emedicine.medscape.com/article/333364-overview",
            demographics: ["Young Adult (18-35y)", "Middle-aged (36-55y)", "Male", "Female", "Subacute", "Chronic", "Alcohol use", "Corticosteroid use", "Trauma"],
            ageBias: "Middle-aged (36-55y)", genderBias: "Male", onsetBias: "Subacute",
            keyFeatures:      ["Joint pain", "Limited range of motion", "Bone pain"],
            possibleFeatures: ["Morning stiffness", "Restricted range of motion", "Crepitus"],
            labs:      { screening: [], confirmatory: [] },
            radiology: { screening: ["Joint space narrowing on X-ray"],                         confirmatory: ["Femoral head flattening on X-ray", "MRI bone marrow edema"] }
        },
        {
            name: "Legg-Calvé-Perthes Disease", system: "msk",
            medscapeLink: "https://emedicine.medscape.com/article/1248079-overview",
            demographics: ["Pediatric (1m-18y)", "Male", "Subacute"],
            ageBias: "Pediatric (1m-18y)", genderBias: "Male", onsetBias: "Subacute",
            keyFeatures:      ["Joint pain", "Limited range of motion", "Bone pain"],
            possibleFeatures: ["Morning stiffness", "Crepitus", "Muscle weakness"],
            labs:      { screening: [], confirmatory: [] },
            radiology: { screening: [],                                                         confirmatory: ["Femoral head flattening on X-ray", "MRI bone marrow edema"] }
        }
    ]
};
