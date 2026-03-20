// ============================================================================
// DDX.JS  —  Differential Diagnosis Data  (v3 Standardized)
// ============================================================================
//
// NORMALIZATION RULES:
//   Age    → one or more of the 7 standard groups (t: "age")
//   Onset  → one or more of the 5 standard types  (t: "onset")
//   Sex    → Male AND Female on every disease by default;
//             omit only when biologically impossible
//
// PREVALENCE:
//   prevalence: 0.0–1.0  (relative frequency in general/ED practice)
//   Scoring multiplier = Math.pow(prevalence, 0.2)
//
// FEATURE TYPE HIERARCHY:
//   pathognomonic-sp  > specific-sp > nonspecific-sp
//   confirmatory-lab  > screening-lab
//   confirmatory-rad  > nonspecific-rad
//   risk-factor, age, onset, sex — lower fixed weights
//
// DICTIONARY STANDARDIZATION:
//   Radiology is prefixed: "CXR: ", "CT: ", "US: ", "MRI: ", "ECG: ", "Echo: ", "Angiography: "
//   Labs are prefixed when applicable: "urinalysis: ", "CSF: "
//   Symptoms are short, deduplicated strings (e.g. "chest pain", "nausea", "leukocytosis")
// ============================================================================

const DDX_DATA = {

    ageGroups: [
        "< 1 month",
        "1 month - 2 years",
        "2 - 12 years",
        "12 - 18 years",
        "18 - 40 years",
        "40 - 60 years",
        "> 60 years"
    ],

    onsetTypes: [
        "acute onset",
        "subacute onset",
        "insidious onset",
        "chronic onset",
        "episodic onset"
    ],

    rules: {
        excludes: {
            "Male":   ["Female"],
            "Female": ["Male"]
        },
        implies: {
            "pregnancy": ["Female"]
        }
    },


    // ═════════════════════════════════════════════════════════════════════
    // DISEASES
    // ═════════════════════════════════════════════════════════════════════
    diseases: [

        // ── CARDIOVASCULAR ───────────────────────────────────────────────

        {
            name: "STEMI",
            prevalence: 0.60,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "Hx of hypertension",                           t: "risk-factor"      },
                { f: "Hx of diabetes mellitus",                      t: "risk-factor"      },
                { f: "Hx of smoking",                                t: "risk-factor"      },
                { f: "Hx of dyslipidemia",                           t: "risk-factor"      },
                { f: "fHx of CAD",                                   t: "risk-factor"      },
                { f: "chest pain",                                   t: "nonspecific-sp"   },
                { f: "diaphoresis",                                  t: "nonspecific-sp"   },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "vomiting",                                     t: "nonspecific-sp"   },
                { f: "syncope",                                      t: "nonspecific-sp"   },
                { f: "dyspnea",                                      t: "nonspecific-sp"   },
                { f: "crushing chest pain",                          t: "pathognomonic-sp" },
                { f: "chest pain radiation to arm/jaw",              t: "pathognomonic-sp" },
                { f: "cardiogenic shock",                            t: "pathognomonic-sp" },
                { f: "elevated troponin",                            t: "screening-lab"    },
                { f: "elevated CK-MB",                               t: "screening-lab"    },
                { f: "ECG: ST elevation",                            t: "confirmatory-lab" },
                { f: "ECG: new LBBB",                                t: "confirmatory-lab" },
                { f: "CXR: pulmonary edema",                         t: "nonspecific-rad"  },
                { f: "Angiography: culprit occlusion",               t: "confirmatory-rad" }
            ]
        },

        {
            name: "NSTEMI / Unstable Angina",
            prevalence: 0.70,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "subacute onset",                               t: "onset"            },
                { f: "Hx of hypertension",                           t: "risk-factor"      },
                { f: "Hx of diabetes mellitus",                      t: "risk-factor"      },
                { f: "Hx of smoking",                                t: "risk-factor"      },
                { f: "Hx of dyslipidemia",                           t: "risk-factor"      },
                { f: "fHx of CAD",                                   t: "risk-factor"      },
                { f: "Hx of prior CAD/PCI/CABG",                     t: "risk-factor"      },
                { f: "chest pain",                                   t: "nonspecific-sp"   },
                { f: "diaphoresis",                                  t: "nonspecific-sp"   },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "dyspnea",                                      t: "nonspecific-sp"   },
                { f: "chest pain at rest",                           t: "pathognomonic-sp" },
                { f: "chest pain radiation to arm/jaw",              t: "pathognomonic-sp" },
                { f: "ECG: ST depression",                           t: "pathognomonic-sp" },
                { f: "ECG: T-wave inversion",                        t: "pathognomonic-sp" },
                { f: "elevated troponin",                            t: "screening-lab"    },
                { f: "Angiography: stenosis >70%",                   t: "confirmatory-rad" }
            ]
        },

        {
            name: "Acute Heart Failure",
            prevalence: 0.50,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "subacute onset",                               t: "onset"            },
                { f: "Hx of heart failure",                          t: "risk-factor"      },
                { f: "Hx of hypertension",                           t: "risk-factor"      },
                { f: "Hx of ischemic heart disease",                 t: "risk-factor"      },
                { f: "Hx of atrial fibrillation",                    t: "risk-factor"      },
                { f: "dyspnea",                                      t: "nonspecific-sp"   },
                { f: "fatigue",                                      t: "nonspecific-sp"   },
                { f: "tachycardia",                                  t: "nonspecific-sp"   },
                { f: "ankle edema",                                  t: "nonspecific-sp"   },
                { f: "orthopnea",                                    t: "pathognomonic-sp" },
                { f: "paroxysmal nocturnal dyspnea",                 t: "pathognomonic-sp" },
                { f: "bilateral basal crackles",                     t: "pathognomonic-sp" },
                { f: "JVD",                                          t: "pathognomonic-sp" },
                { f: "S3 gallop",                                    t: "pathognomonic-sp" },
                { f: "elevated BNP",                                 t: "screening-lab"    },
                { f: "hyponatremia",                                 t: "screening-lab"    },
                { f: "CXR: cardiomegaly",                            t: "confirmatory-rad" },
                { f: "CXR: pulmonary edema",                         t: "confirmatory-rad" },
                { f: "Echo: EF <40%",                                t: "confirmatory-rad" }
            ]
        },

        {
            name: "Pulmonary Embolism",
            prevalence: 0.45,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "Hx of immobilization",                         t: "risk-factor"      },
                { f: "Hx of recent surgery",                         t: "risk-factor"      },
                { f: "Hx of malignancy",                             t: "risk-factor"      },
                { f: "Hx of oral contraceptive use",                 t: "risk-factor"      },
                { f: "pregnancy",                                    t: "risk-factor"      },
                { f: "Hx of prior DVT/PE",                           t: "risk-factor"      },
                { f: "Hx of thrombophilia",                          t: "risk-factor"      },
                { f: "chest pain",                                   t: "nonspecific-sp"   },
                { f: "dyspnea",                                      t: "nonspecific-sp"   },
                { f: "tachycardia",                                  t: "nonspecific-sp"   },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "unilateral leg swelling",                      t: "nonspecific-sp"   },
                { f: "sudden dyspnea",                               t: "pathognomonic-sp" },
                { f: "pleuritic chest pain",                         t: "pathognomonic-sp" },
                { f: "hypoxemia",                                    t: "pathognomonic-sp" },
                { f: "hemoptysis",                                   t: "pathognomonic-sp" },
                { f: "elevated D-dimer",                             t: "screening-lab"    },
                { f: "ECG: S1Q3T3",                                  t: "screening-lab"    },
                { f: "ECG: sinus tachycardia",                       t: "screening-lab"    },
                { f: "CT: filling defect in pulmonary artery",       t: "confirmatory-rad" }
            ]
        },

        {
            name: "Aortic Dissection",
            prevalence: 0.10,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "Hx of hypertension",                           t: "risk-factor"      },
                { f: "Hx of Marfan syndrome",                        t: "risk-factor"      },
                { f: "Hx of bicuspid aortic valve",                  t: "risk-factor"      },
                { f: "Hx of cocaine use",                            t: "risk-factor"      },
                { f: "chest pain",                                   t: "nonspecific-sp"   },
                { f: "back pain",                                    t: "nonspecific-sp"   },
                { f: "diaphoresis",                                  t: "nonspecific-sp"   },
                { f: "syncope",                                      t: "nonspecific-sp"   },
                { f: "tearing chest pain",                           t: "pathognomonic-sp" },
                { f: "tearing back pain",                            t: "pathognomonic-sp" },
                { f: "BP differential between arms",                 t: "pathognomonic-sp" },
                { f: "pulse deficit",                                t: "pathognomonic-sp" },
                { f: "aortic regurgitation murmur",                  t: "pathognomonic-sp" },
                { f: "CXR: widened mediastinum",                     t: "nonspecific-rad"  },
                { f: "CT: intimal flap",                             t: "confirmatory-rad" },
                { f: "CT: false lumen",                              t: "confirmatory-rad" },
                { f: "Echo: aortic dissection flap",                 t: "confirmatory-rad" }
            ]
        },

        {
            name: "Deep Vein Thrombosis",
            prevalence: 0.45,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "subacute onset",                               t: "onset"            },
                { f: "Hx of immobilization",                         t: "risk-factor"      },
                { f: "Hx of recent surgery",                         t: "risk-factor"      },
                { f: "Hx of malignancy",                             t: "risk-factor"      },
                { f: "Hx of oral contraceptive use",                 t: "risk-factor"      },
                { f: "Hx of prior DVT/PE",                           t: "risk-factor"      },
                { f: "Hx of thrombophilia",                          t: "risk-factor"      },
                { f: "unilateral calf pain",                         t: "pathognomonic-sp" },
                { f: "unilateral leg swelling",                      t: "pathognomonic-sp" },
                { f: "Homan's sign",                                 t: "pathognomonic-sp" },
                { f: "elevated D-dimer",                             t: "screening-lab"    },
                { f: "US: non-compressible vein",                    t: "confirmatory-rad" }
            ]
        },

        {
            name: "Hypertensive Emergency",
            prevalence: 0.60,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "Hx of hypertension",                           t: "risk-factor"      },
                { f: "Hx of medication non-adherence",               t: "risk-factor"      },
                { f: "Hx of cocaine use",                            t: "risk-factor"      },
                { f: "headache",                                     t: "nonspecific-sp"   },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "vomiting",                                     t: "nonspecific-sp"   },
                { f: "altered level of consciousness",               t: "nonspecific-sp"   },
                { f: "severe hypertension",                          t: "pathognomonic-sp" },
                { f: "end-organ damage",                             t: "pathognomonic-sp" },
                { f: "papilledema",                                  t: "pathognomonic-sp" },
                { f: "elevated creatinine",                          t: "screening-lab"    },
                { f: "urinalysis: proteinuria",                      t: "screening-lab"    },
                { f: "CXR: pulmonary edema",                         t: "nonspecific-rad"  },
                { f: "CT: cerebral edema",                           t: "nonspecific-rad"  },
                { f: "Echo: LV hypertrophy",                         t: "confirmatory-rad" }
            ]
        },

        {
            name: "Pericarditis",
            prevalence: 0.30,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "subacute onset",                               t: "onset"            },
                { f: "recent viral infection",                       t: "risk-factor"      },
                { f: "Hx of autoimmune disease",                     t: "risk-factor"      },
                { f: "Hx of renal failure",                          t: "risk-factor"      },
                { f: "chest pain",                                   t: "nonspecific-sp"   },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "malaise",                                      t: "nonspecific-sp"   },
                { f: "dyspnea",                                      t: "nonspecific-sp"   },
                { f: "low-grade fever",                              t: "pathognomonic-sp" },
                { f: "pleuritic chest pain",                         t: "pathognomonic-sp" },
                { f: "chest pain relieved by leaning forward",       t: "pathognomonic-sp" },
                { f: "pericardial friction rub",                     t: "pathognomonic-sp" },
                { f: "elevated CRP",                                 t: "screening-lab"    },
                { f: "elevated ESR",                                 t: "screening-lab"    },
                { f: "elevated troponin",                            t: "screening-lab"    },
                { f: "ECG: saddle-shaped ST elevation",              t: "confirmatory-lab" },
                { f: "ECG: PR depression",                           t: "confirmatory-lab" },
                { f: "CXR: enlarged cardiac silhouette",             t: "nonspecific-rad"  },
                { f: "Echo: pericardial effusion",                   t: "confirmatory-rad" }
            ]
        },

        {
            name: "Atrial Fibrillation",
            prevalence: 0.55,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "episodic onset",                               t: "onset"            },
                { f: "Hx of hypertension",                           t: "risk-factor"      },
                { f: "Hx of ischemic heart disease",                 t: "risk-factor"      },
                { f: "Hx of hyperthyroidism",                        t: "risk-factor"      },
                { f: "Hx of alcohol use disorder",                   t: "risk-factor"      },
                { f: "Hx of heart failure",                          t: "risk-factor"      },
                { f: "Hx of valvular heart disease",                 t: "risk-factor"      },
                { f: "fatigue",                                      t: "nonspecific-sp"   },
                { f: "dyspnea",                                      t: "nonspecific-sp"   },
                { f: "syncope",                                      t: "nonspecific-sp"   },
                { f: "palpitations",                                 t: "pathognomonic-sp" },
                { f: "irregularly irregular pulse",                  t: "pathognomonic-sp" },
                { f: "ECG: absent P waves",                          t: "confirmatory-lab" },
                { f: "ECG: irregularly irregular rhythm",            t: "confirmatory-lab" },
                { f: "low TSH",                                      t: "screening-lab"    },
                { f: "Echo: LA enlargement",                         t: "nonspecific-rad"  }
            ]
        },


        // ── GASTROINTESTINAL ─────────────────────────────────────────────

        {
            name: "Bacterial Gastroenteritis",
            prevalence: 0.75,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "1 month - 2 years",                            t: "age"              },
                { f: "2 - 12 years",                                 t: "age"              },
                { f: "12 - 18 years",                                t: "age"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "recent contaminated food/water intake",        t: "risk-factor"      },
                { f: "recent travel to endemic area",                t: "risk-factor"      },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "vomiting",                                     t: "nonspecific-sp"   },
                { f: "abdominal pain",                               t: "nonspecific-sp"   },
                { f: "diarrhea",                                     t: "nonspecific-sp"   },
                { f: "abdominal cramps",                             t: "nonspecific-sp"   },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "high fever",                                   t: "pathognomonic-sp" },
                { f: "bloody diarrhea",                              t: "pathognomonic-sp" },
                { f: "mucus in stool",                               t: "pathognomonic-sp" },
                { f: "leukocytosis",                                 t: "screening-lab"    },
                { f: "stool WBCs",                                   t: "screening-lab"    },
                { f: "positive stool culture",                       t: "confirmatory-lab" }
            ]
        },

        {
            name: "Viral Gastroenteritis",
            prevalence: 0.90,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "1 month - 2 years",                            t: "age"              },
                { f: "2 - 12 years",                                 t: "age"              },
                { f: "12 - 18 years",                                t: "age"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "recent sick contact",                          t: "risk-factor"      },
                { f: "recent community outbreak",                    t: "risk-factor"      },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "vomiting",                                     t: "nonspecific-sp"   },
                { f: "abdominal pain",                               t: "nonspecific-sp"   },
                { f: "diarrhea",                                     t: "nonspecific-sp"   },
                { f: "abdominal cramps",                             t: "nonspecific-sp"   },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "low-grade fever",                              t: "pathognomonic-sp" },
                { f: "watery diarrhea",                              t: "pathognomonic-sp" },
                { f: "positive stool viral PCR",                     t: "confirmatory-lab" }
            ]
        },

        {
            name: "Acute Appendicitis",
            prevalence: 0.50,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "2 - 12 years",                                 t: "age"              },
                { f: "12 - 18 years",                                t: "age"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "vomiting",                                     t: "nonspecific-sp"   },
                { f: "abdominal pain",                               t: "nonspecific-sp"   },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "anorexia",                                     t: "nonspecific-sp"   },
                { f: "RLQ pain",                                     t: "nonspecific-sp"   },
                { f: "RLQ tenderness",                               t: "nonspecific-sp"   },
                { f: "periumbilical pain",                           t: "pathognomonic-sp" },
                { f: "McBurney's point tenderness",                  t: "pathognomonic-sp" },
                { f: "Rovsing's sign",                               t: "pathognomonic-sp" },
                { f: "Psoas sign",                                   t: "pathognomonic-sp" },
                { f: "rebound tenderness",                           t: "pathognomonic-sp" },
                { f: "leukocytosis",                                 t: "screening-lab"    },
                { f: "elevated CRP",                                 t: "screening-lab"    },
                { f: "US: non-compressible appendix",                t: "confirmatory-rad" },
                { f: "CT: inflamed appendix",                        t: "confirmatory-rad" },
                { f: "CT: periappendiceal fat stranding",            t: "confirmatory-rad" }
            ]
        },

        {
            name: "Acute Pancreatitis",
            prevalence: 0.50,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "Hx of gallstones",                             t: "risk-factor"      },
                { f: "Hx of alcohol use disorder",                   t: "risk-factor"      },
                { f: "Hx of hypertriglyceridemia",                   t: "risk-factor"      },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "vomiting",                                     t: "nonspecific-sp"   },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "abdominal pain",                               t: "nonspecific-sp"   },
                { f: "epigastric pain",                              t: "nonspecific-sp"   },
                { f: "radiation to back",                            t: "pathognomonic-sp" },
                { f: "Grey Turner's sign",                           t: "pathognomonic-sp" },
                { f: "Cullen's sign",                                t: "pathognomonic-sp" },
                { f: "leukocytosis",                                 t: "screening-lab"    },
                { f: "elevated glucose",                             t: "screening-lab"    },
                { f: "elevated lipase",                              t: "confirmatory-lab" },
                { f: "elevated amylase",                             t: "confirmatory-lab" },
                { f: "CXR: sentinel loop sign",                      t: "nonspecific-rad"  },
                { f: "CT: pancreatic edema",                         t: "confirmatory-rad" },
                { f: "CT: pancreatic necrosis",                      t: "confirmatory-rad" }
            ]
        },

        {
            name: "Peptic Ulcer Disease",
            prevalence: 0.55,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "subacute onset",                               t: "onset"            },
                { f: "insidious onset",                              t: "onset"            },
                { f: "chronic onset",                                t: "onset"            },
                { f: "Hx of H. pylori infection",                    t: "risk-factor"      },
                { f: "Hx of NSAID use",                              t: "risk-factor"      },
                { f: "Hx of alcohol use disorder",                   t: "risk-factor"      },
                { f: "Hx of smoking",                                t: "risk-factor"      },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "vomiting",                                     t: "nonspecific-sp"   },
                { f: "abdominal pain",                               t: "nonspecific-sp"   },
                { f: "epigastric pain",                              t: "nonspecific-sp"   },
                { f: "anorexia",                                     t: "nonspecific-sp"   },
                { f: "anemia",                                       t: "nonspecific-sp"   },
                { f: "epigastric pain relieved by food",             t: "pathognomonic-sp" },
                { f: "epigastric pain worsened by food",             t: "pathognomonic-sp" },
                { f: "nocturnal epigastric pain",                    t: "pathognomonic-sp" },
                { f: "melena",                                       t: "pathognomonic-sp" },
                { f: "microcytic anemia",                            t: "screening-lab"    },
                { f: "positive H. pylori test",                      t: "confirmatory-lab" },
                { f: "OGD: gastric or duodenal ulcer",               t: "confirmatory-rad" }
            ]
        },

        {
            name: "Upper GI Bleed",
            prevalence: 0.45,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "Hx of NSAID use",                              t: "risk-factor"      },
                { f: "Hx of anticoagulant use",                      t: "risk-factor"      },
                { f: "Hx of alcohol use disorder",                   t: "risk-factor"      },
                { f: "Hx of peptic ulcer disease",                   t: "risk-factor"      },
                { f: "Hx of liver cirrhosis",                        t: "risk-factor"      },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "abdominal pain",                               t: "nonspecific-sp"   },
                { f: "anemia",                                       t: "nonspecific-sp"   },
                { f: "tachycardia",                                  t: "nonspecific-sp"   },
                { f: "hypotension",                                  t: "nonspecific-sp"   },
                { f: "hematemesis",                                  t: "pathognomonic-sp" },
                { f: "coffee-ground emesis",                         t: "pathognomonic-sp" },
                { f: "melena",                                       t: "pathognomonic-sp" },
                { f: "syncope",                                      t: "pathognomonic-sp" },
                { f: "microcytic anemia",                            t: "screening-lab"    },
                { f: "elevated BUN",                                 t: "screening-lab"    },
                { f: "coagulopathy",                                 t: "screening-lab"    },
                { f: "OGD: bleeding source identified",              t: "confirmatory-rad" }
            ]
        },

        {
            name: "Small Bowel Obstruction",
            prevalence: 0.25,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "Hx of surgery",                                t: "risk-factor"      },
                { f: "Hx of hernia",                                 t: "risk-factor"      },
                { f: "Hx of malignancy",                             t: "risk-factor"      },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "vomiting",                                     t: "nonspecific-sp"   },
                { f: "abdominal pain",                               t: "nonspecific-sp"   },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "colicky abdominal pain",                       t: "pathognomonic-sp" },
                { f: "abdominal distension",                         t: "pathognomonic-sp" },
                { f: "obstipation",                                  t: "pathognomonic-sp" },
                { f: "high-pitched bowel sounds",                    t: "pathognomonic-sp" },
                { f: "leukocytosis",                                 t: "screening-lab"    },
                { f: "elevated lactate",                             t: "screening-lab"    },
                { f: "CXR: dilated bowel loops",                     t: "nonspecific-rad"  },
                { f: "CXR: air-fluid levels",                        t: "nonspecific-rad"  },
                { f: "CT: transition point",                         t: "confirmatory-rad" },
                { f: "CT: dilated bowel loops",                      t: "confirmatory-rad" }
            ]
        },

        {
            name: "Acute Cholecystitis",
            prevalence: 0.50,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "Hx of gallstones",                             t: "risk-factor"      },
                { f: "obesity",                                      t: "risk-factor"      },
                { f: "pregnancy",                                    t: "risk-factor"      },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "vomiting",                                     t: "nonspecific-sp"   },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "abdominal pain",                               t: "nonspecific-sp"   },
                { f: "RUQ pain",                                     t: "nonspecific-sp"   },
                { f: "RUQ pain after fatty meal",                    t: "pathognomonic-sp" },
                { f: "Murphy's sign",                                t: "pathognomonic-sp" },
                { f: "RUQ tenderness",                               t: "pathognomonic-sp" },
                { f: "abdominal guarding",                           t: "pathognomonic-sp" },
                { f: "leukocytosis",                                 t: "screening-lab"    },
                { f: "elevated ALP",                                 t: "screening-lab"    },
                { f: "elevated GGT",                                 t: "screening-lab"    },
                { f: "US: gallstones",                               t: "confirmatory-rad" },
                { f: "US: gallbladder wall thickening",              t: "confirmatory-rad" },
                { f: "US: pericholecystic fluid",                    t: "confirmatory-rad" },
                { f: "HIDA: gallbladder non-visualization",          t: "confirmatory-rad" }
            ]
        },

        {
            name: "Acute Cholangitis",
            prevalence: 0.25,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "Hx of gallstones",                             t: "risk-factor"      },
                { f: "Hx of biliary stricture",                      t: "risk-factor"      },
                { f: "Hx of malignancy",                             t: "risk-factor"      },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "vomiting",                                     t: "nonspecific-sp"   },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "abdominal pain",                               t: "nonspecific-sp"   },
                { f: "RUQ pain",                                     t: "nonspecific-sp"   },
                { f: "jaundice",                                     t: "nonspecific-sp"   },
                { f: "high fever",                                   t: "pathognomonic-sp" },
                { f: "Charcot's triad",                              t: "pathognomonic-sp" },
                { f: "Reynolds pentad",                              t: "pathognomonic-sp" },
                { f: "leukocytosis",                                 t: "screening-lab"    },
                { f: "elevated bilirubin",                           t: "screening-lab"    },
                { f: "elevated ALP",                                 t: "screening-lab"    },
                { f: "elevated GGT",                                 t: "screening-lab"    },
                { f: "positive blood culture",                       t: "confirmatory-lab" },
                { f: "US: dilated CBD",                              t: "nonspecific-rad"  },
                { f: "CT: dilated CBD",                              t: "nonspecific-rad"  },
                { f: "MRCP: CBD obstruction",                        t: "confirmatory-rad" },
                { f: "ERCP: biliary obstruction",                    t: "confirmatory-rad" }
            ]
        },

        {
            name: "Acute Diverticulitis",
            prevalence: 0.40,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "subacute onset",                               t: "onset"            },
                { f: "obesity",                                      t: "risk-factor"      },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "vomiting",                                     t: "nonspecific-sp"   },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "abdominal pain",                               t: "nonspecific-sp"   },
                { f: "LLQ pain",                                     t: "pathognomonic-sp" },
                { f: "LLQ tenderness",                               t: "pathognomonic-sp" },
                { f: "change in bowel habits",                       t: "pathognomonic-sp" },
                { f: "palpable abdominal mass",                      t: "pathognomonic-sp" },
                { f: "leukocytosis",                                 t: "screening-lab"    },
                { f: "elevated CRP",                                 t: "screening-lab"    },
                { f: "CT: diverticular inflammation",                t: "confirmatory-rad" },
                { f: "CT: pericolic fat stranding",                  t: "confirmatory-rad" }
            ]
        },

        {
            name: "Crohn's Disease",
            prevalence: 0.30,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "12 - 18 years",                                t: "age"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "subacute onset",                               t: "onset"            },
                { f: "insidious onset",                              t: "onset"            },
                { f: "chronic onset",                                t: "onset"            },
                { f: "episodic onset",                               t: "onset"            },
                { f: "fHx of IBD",                                   t: "risk-factor"      },
                { f: "Hx of smoking",                                t: "risk-factor"      },
                { f: "fatigue",                                      t: "nonspecific-sp"   },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "abdominal pain",                               t: "nonspecific-sp"   },
                { f: "diarrhea",                                     t: "nonspecific-sp"   },
                { f: "anorexia",                                     t: "nonspecific-sp"   },
                { f: "anemia",                                       t: "nonspecific-sp"   },
                { f: "RLQ pain",                                     t: "nonspecific-sp"   },
                { f: "weight loss",                                  t: "nonspecific-sp"   },
                { f: "non-bloody diarrhea",                          t: "pathognomonic-sp" },
                { f: "perianal fistula",                             t: "pathognomonic-sp" },
                { f: "oral ulcers",                                  t: "pathognomonic-sp" },
                { f: "elevated CRP",                                 t: "screening-lab"    },
                { f: "elevated ESR",                                 t: "screening-lab"    },
                { f: "microcytic anemia",                            t: "screening-lab"    },
                { f: "elevated fecal calprotectin",                  t: "screening-lab"    },
                { f: "colonoscopy: skip lesions",                    t: "confirmatory-lab" },
                { f: "colonoscopy: rectal sparing",                  t: "confirmatory-lab" },
                { f: "biopsy: transmural granulomatous inflammation", t: "confirmatory-lab" },
                { f: "MRI: bowel wall thickening",                   t: "confirmatory-rad" }
            ]
        },

        {
            name: "Ulcerative Colitis",
            prevalence: 0.35,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "12 - 18 years",                                t: "age"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "subacute onset",                               t: "onset"            },
                { f: "insidious onset",                              t: "onset"            },
                { f: "chronic onset",                                t: "onset"            },
                { f: "episodic onset",                               t: "onset"            },
                { f: "fHx of IBD",                                   t: "risk-factor"      },
                { f: "fatigue",                                      t: "nonspecific-sp"   },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "abdominal pain",                               t: "nonspecific-sp"   },
                { f: "diarrhea",                                     t: "nonspecific-sp"   },
                { f: "anorexia",                                     t: "nonspecific-sp"   },
                { f: "anemia",                                       t: "nonspecific-sp"   },
                { f: "weight loss",                                  t: "nonspecific-sp"   },
                { f: "bloody diarrhea",                              t: "pathognomonic-sp" },
                { f: "mucus in stool",                               t: "pathognomonic-sp" },
                { f: "tenesmus",                                     t: "pathognomonic-sp" },
                { f: "nocturnal diarrhea",                           t: "pathognomonic-sp" },
                { f: "elevated CRP",                                 t: "screening-lab"    },
                { f: "elevated ESR",                                 t: "screening-lab"    },
                { f: "microcytic anemia",                            t: "screening-lab"    },
                { f: "elevated fecal calprotectin",                  t: "screening-lab"    },
                { f: "colonoscopy: continuous colitis",              t: "confirmatory-lab" },
                { f: "biopsy: mucosal crypt abscesses",              t: "confirmatory-lab" }
            ]
        },

        {
            name: "Colon Cancer",
            prevalence: 0.25,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "insidious onset",                              t: "onset"            },
                { f: "chronic onset",                                t: "onset"            },
                { f: "fHx of CAD",                                   t: "risk-factor"      }, // Correction: fHx of colon cancer is better
                { f: "fHx of colon cancer",                          t: "risk-factor"      },
                { f: "Hx of IBD",                                    t: "risk-factor"      },
                { f: "Hx of smoking",                                t: "risk-factor"      },
                { f: "fatigue",                                      t: "nonspecific-sp"   },
                { f: "abdominal pain",                               t: "nonspecific-sp"   },
                { f: "diarrhea",                                     t: "nonspecific-sp"   },
                { f: "anemia",                                       t: "nonspecific-sp"   },
                { f: "weight loss",                                  t: "nonspecific-sp"   },
                { f: "rectal bleeding",                              t: "pathognomonic-sp" },
                { f: "change in bowel habits",                       t: "pathognomonic-sp" },
                { f: "pencil-thin stools",                           t: "pathognomonic-sp" },
                { f: "palpable abdominal mass",                      t: "pathognomonic-sp" },
                { f: "microcytic anemia",                            t: "screening-lab"    },
                { f: "elevated CEA",                                 t: "screening-lab"    },
                { f: "colonoscopy: adenocarcinoma",                  t: "confirmatory-lab" },
                { f: "CT: apple-core sign",                          t: "confirmatory-rad" }
            ]
        },

        {
            name: "Acute Viral Hepatitis",
            prevalence: 0.40,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "12 - 18 years",                                t: "age"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "subacute onset",                               t: "onset"            },
                { f: "recent contaminated food/water intake",        t: "risk-factor"      },
                { f: "Hx of IV drug use",                            t: "risk-factor"      },
                { f: "recent unprotected sexual contact",            t: "risk-factor"      },
                { f: "recent travel to endemic area",                t: "risk-factor"      },
                { f: "fatigue",                                      t: "nonspecific-sp"   },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "vomiting",                                     t: "nonspecific-sp"   },
                { f: "abdominal pain",                               t: "nonspecific-sp"   },
                { f: "RUQ pain",                                     t: "nonspecific-sp"   },
                { f: "anorexia",                                     t: "nonspecific-sp"   },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "low-grade fever",                              t: "pathognomonic-sp" },
                { f: "jaundice",                                     t: "pathognomonic-sp" },
                { f: "dark urine",                                   t: "pathognomonic-sp" },
                { f: "pale stools",                                  t: "pathognomonic-sp" },
                { f: "RUQ tenderness",                               t: "pathognomonic-sp" },
                { f: "hepatomegaly",                                 t: "pathognomonic-sp" },
                { f: "elevated ALT",                                 t: "screening-lab"    },
                { f: "elevated AST",                                 t: "screening-lab"    },
                { f: "elevated bilirubin",                           t: "screening-lab"    },
                { f: "positive viral hepatitis serology",            t: "confirmatory-lab" },
                { f: "US: hepatomegaly",                             t: "nonspecific-rad"  }
            ]
        },

        {
            name: "Perforated Peptic Ulcer",
            prevalence: 0.20,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "Hx of peptic ulcer disease",                   t: "risk-factor"      },
                { f: "Hx of NSAID use",                              t: "risk-factor"      },
                { f: "Hx of H. pylori infection",                    t: "risk-factor"      },
                { f: "Hx of smoking",                                t: "risk-factor"      },
                { f: "Hx of alcohol use disorder",                   t: "risk-factor"      },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "vomiting",                                     t: "nonspecific-sp"   },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "abdominal pain",                               t: "nonspecific-sp"   },
                { f: "epigastric pain",                              t: "nonspecific-sp"   },
                { f: "sudden severe epigastric pain",                t: "pathognomonic-sp" },
                { f: "board-like abdomen",                           t: "pathognomonic-sp" },
                { f: "generalized peritonitis",                      t: "pathognomonic-sp" },
                { f: "absent bowel sounds",                          t: "pathognomonic-sp" },
                { f: "leukocytosis",                                 t: "screening-lab"    },
                { f: "elevated lactate",                             t: "screening-lab"    },
                { f: "CXR: free air under diaphragm",                t: "confirmatory-rad" },
                { f: "CT: pneumoperitoneum",                         t: "confirmatory-rad" }
            ]
        },

        {
            name: "Acute Mesenteric Ischemia",
            prevalence: 0.10,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "Hx of atrial fibrillation",                    t: "risk-factor"      },
                { f: "Hx of CAD",                                    t: "risk-factor"      },
                { f: "Hx of thrombophilia",                          t: "risk-factor"      },
                { f: "Hx of heart failure",                          t: "risk-factor"      },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "vomiting",                                     t: "nonspecific-sp"   },
                { f: "abdominal pain",                               t: "nonspecific-sp"   },
                { f: "diarrhea",                                     t: "nonspecific-sp"   },
                { f: "periumbilical pain",                           t: "nonspecific-sp"   },
                { f: "pain out of proportion to exam",               t: "pathognomonic-sp" },
                { f: "bloody diarrhea",                              t: "pathognomonic-sp" },
                { f: "leukocytosis",                                 t: "screening-lab"    },
                { f: "elevated lactate",                             t: "screening-lab"    },
                { f: "metabolic acidosis",                           t: "screening-lab"    },
                { f: "CT: mesenteric vessel occlusion",              t: "confirmatory-rad" }
            ]
        },

        {
            name: "Liver Cirrhosis",
            prevalence: 0.40,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "insidious onset",                              t: "onset"            },
                { f: "chronic onset",                                t: "onset"            },
                { f: "Hx of alcohol use disorder",                   t: "risk-factor"      },
                { f: "Hx of chronic viral hepatitis",                t: "risk-factor"      },
                { f: "fatigue",                                      t: "nonspecific-sp"   },
                { f: "abdominal pain",                               t: "nonspecific-sp"   },
                { f: "anemia",                                       t: "nonspecific-sp"   },
                { f: "anorexia",                                     t: "nonspecific-sp"   },
                { f: "weight loss",                                  t: "nonspecific-sp"   },
                { f: "ankle edema",                                  t: "nonspecific-sp"   },
                { f: "jaundice",                                     t: "pathognomonic-sp" },
                { f: "ascites",                                      t: "pathognomonic-sp" },
                { f: "splenomegaly",                                 t: "pathognomonic-sp" },
                { f: "caput medusae",                                t: "pathognomonic-sp" },
                { f: "spider nevi",                                  t: "pathognomonic-sp" },
                { f: "palmar erythema",                              t: "pathognomonic-sp" },
                { f: "gynecomastia",                                 t: "pathognomonic-sp" },
                { f: "leukopenia",                                   t: "screening-lab"    },
                { f: "thrombocytopenia",                             t: "screening-lab"    },
                { f: "elevated ALT",                                 t: "screening-lab"    },
                { f: "elevated AST",                                 t: "screening-lab"    },
                { f: "elevated bilirubin",                           t: "screening-lab"    },
                { f: "coagulopathy",                                 t: "screening-lab"    },
                { f: "low albumin",                                  t: "screening-lab"    },
                { f: "US: coarse nodular liver",                     t: "nonspecific-rad"  },
                { f: "US: splenomegaly",                             t: "nonspecific-rad"  },
                { f: "biopsy: cirrhosis",                            t: "confirmatory-lab" }
            ]
        },

        {
            name: "Spontaneous Bacterial Peritonitis",
            prevalence: 0.20,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "Hx of liver cirrhosis",                        t: "risk-factor"      },
                { f: "Hx of previous SBP",                           t: "risk-factor"      },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "vomiting",                                     t: "nonspecific-sp"   },
                { f: "abdominal pain",                               t: "nonspecific-sp"   },
                { f: "altered level of consciousness",               t: "nonspecific-sp"   },
                { f: "diffuse abdominal tenderness",                 t: "pathognomonic-sp" },
                { f: "worsening ascites",                            t: "pathognomonic-sp" },
                { f: "leukocytosis",                                 t: "screening-lab"    },
                { f: "elevated CRP",                                 t: "screening-lab"    },
                { f: "ascitic fluid PMN >250",                       t: "confirmatory-lab" },
                { f: "positive ascitic fluid culture",               t: "confirmatory-lab" },
                { f: "US: ascites",                                  t: "nonspecific-rad"  }
            ]
        },

        {
            name: "Hepatic Encephalopathy",
            prevalence: 0.30,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "subacute onset",                               t: "onset"            },
                { f: "episodic onset",                               t: "onset"            },
                { f: "Hx of liver cirrhosis",                        t: "risk-factor"      },
                { f: "fatigue",                                      t: "nonspecific-sp"   },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "altered level of consciousness",               t: "nonspecific-sp"   },
                { f: "asterixis",                                    t: "pathognomonic-sp" },
                { f: "fetor hepaticus",                              t: "pathognomonic-sp" },
                { f: "elevated serum ammonia",                       t: "screening-lab"    },
                { f: "coagulopathy",                                 t: "screening-lab"    },
                { f: "hyponatremia",                                 t: "screening-lab"    },
                { f: "CT: cerebral edema",                           t: "nonspecific-rad"  }
            ]
        },


        // ── RESPIRATORY ──────────────────────────────────────────────────

        {
            name: "Pneumonia",
            prevalence: 0.75,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "< 1 month",                                    t: "age"              },
                { f: "1 month - 2 years",                            t: "age"              },
                { f: "2 - 12 years",                                 t: "age"              },
                { f: "12 - 18 years",                                t: "age"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "subacute onset",                               t: "onset"            },
                { f: "Hx of smoking",                                t: "risk-factor"      },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "cough",                                        t: "nonspecific-sp"   },
                { f: "dyspnea",                                      t: "nonspecific-sp"   },
                { f: "chest pain",                                   t: "nonspecific-sp"   },
                { f: "chills",                                       t: "nonspecific-sp"   },
                { f: "rigors",                                       t: "nonspecific-sp"   },
                { f: "malaise",                                      t: "nonspecific-sp"   },
                { f: "pleuritic chest pain",                         t: "nonspecific-sp"   },
                { f: "high fever",                                   t: "pathognomonic-sp" },
                { f: "productive cough",                             t: "pathognomonic-sp" },
                { f: "purulent sputum",                              t: "pathognomonic-sp" },
                { f: "lobar dullness to percussion",                 t: "pathognomonic-sp" },
                { f: "bronchial breathing",                          t: "pathognomonic-sp" },
                { f: "hypoxemia",                                    t: "pathognomonic-sp" },
                { f: "leukocytosis",                                 t: "screening-lab"    },
                { f: "elevated CRP",                                 t: "screening-lab"    },
                { f: "elevated procalcitonin",                       t: "screening-lab"    },
                { f: "positive sputum culture",                      t: "confirmatory-lab" },
                { f: "positive Legionella/Pneumococcal urine antigen", t: "confirmatory-lab" },
                { f: "CXR: increased lung markings",                 t: "nonspecific-rad"  },
                { f: "CXR: lobar consolidation",                     t: "confirmatory-rad" }
            ]
        },

        {
            name: "Pulmonary Tuberculosis",
            prevalence: 0.40,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "12 - 18 years",                                t: "age"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "subacute onset",                               t: "onset"            },
                { f: "insidious onset",                              t: "onset"            },
                { f: "chronic onset",                                t: "onset"            },
                { f: "recent sick contact",                          t: "risk-factor"      },
                { f: "residence in endemic area",                    t: "risk-factor"      },
                { f: "Hx of HIV",                                    t: "risk-factor"      },
                { f: "fatigue",                                      t: "nonspecific-sp"   },
                { f: "anorexia",                                     t: "nonspecific-sp"   },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "cough",                                        t: "nonspecific-sp"   },
                { f: "dyspnea",                                      t: "nonspecific-sp"   },
                { f: "anemia",                                       t: "nonspecific-sp"   },
                { f: "weight loss",                                  t: "nonspecific-sp"   },
                { f: "chronic cough",                                t: "pathognomonic-sp" },
                { f: "hemoptysis",                                   t: "pathognomonic-sp" },
                { f: "night sweats",                                 t: "pathognomonic-sp" },
                { f: "positive sputum AFB",                          t: "screening-lab"    },
                { f: "positive Mantoux",                             t: "screening-lab"    },
                { f: "positive IGRA",                                t: "screening-lab"    },
                { f: "positive sputum TB culture",                   t: "confirmatory-lab" },
                { f: "CXR: upper lobe infiltrate",                   t: "nonspecific-rad"  },
                { f: "CXR: cavitation",                              t: "confirmatory-rad" },
                { f: "CT: tree-in-bud pattern",                      t: "confirmatory-rad" }
            ]
        },

        {
            name: "COPD Exacerbation",
            prevalence: 0.50,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "subacute onset",                               t: "onset"            },
                { f: "Hx of smoking",                                t: "risk-factor"      },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "cough",                                        t: "nonspecific-sp"   },
                { f: "dyspnea",                                      t: "nonspecific-sp"   },
                { f: "chest tightness",                              t: "nonspecific-sp"   },
                { f: "malaise",                                      t: "nonspecific-sp"   },
                { f: "ankle edema",                                  t: "nonspecific-sp"   },
                { f: "increased sputum purulence",                   t: "pathognomonic-sp" },
                { f: "barrel chest",                                 t: "pathognomonic-sp" },
                { f: "pursed-lip breathing",                         t: "pathognomonic-sp" },
                { f: "diffuse expiratory wheeze",                    t: "pathognomonic-sp" },
                { f: "leukocytosis",                                 t: "screening-lab"    },
                { f: "hypercapnia",                                  t: "screening-lab"    },
                { f: "hypoxemia",                                    t: "screening-lab"    },
                { f: "spirometry: FEV1/FVC <0.7",                    t: "confirmatory-lab" },
                { f: "CXR: hyperinflation",                          t: "nonspecific-rad"  },
                { f: "CT: emphysema",                                t: "confirmatory-rad" }
            ]
        },

        {
            name: "Asthma Exacerbation",
            prevalence: 0.65,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "2 - 12 years",                                 t: "age"              },
                { f: "12 - 18 years",                                t: "age"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "episodic onset",                               t: "onset"            },
                { f: "Hx of asthma",                                 t: "risk-factor"      },
                { f: "dyspnea",                                      t: "nonspecific-sp"   },
                { f: "cough",                                        t: "nonspecific-sp"   },
                { f: "chest tightness",                              t: "nonspecific-sp"   },
                { f: "episodic expiratory wheeze",                   t: "pathognomonic-sp" },
                { f: "improvement with bronchodilators",             t: "pathognomonic-sp" },
                { f: "nocturnal symptoms",                           t: "pathognomonic-sp" },
                { f: "hypoxemia",                                    t: "screening-lab"    },
                { f: "spirometry: reversible obstruction",           t: "confirmatory-lab" },
                { f: "CXR: hyperinflation",                          t: "nonspecific-rad"  }
            ]
        },

        {
            name: "Pneumothorax",
            prevalence: 0.30,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "12 - 18 years",                                t: "age"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "Hx of smoking",                                t: "risk-factor"      },
                { f: "Hx of Marfan syndrome",                        t: "risk-factor"      },
                { f: "chest pain",                                   t: "nonspecific-sp"   },
                { f: "dyspnea",                                      t: "nonspecific-sp"   },
                { f: "tachycardia",                                  t: "nonspecific-sp"   },
                { f: "sudden pleuritic chest pain",                  t: "pathognomonic-sp" },
                { f: "sudden dyspnea",                               t: "pathognomonic-sp" },
                { f: "absent breath sounds",                         t: "pathognomonic-sp" },
                { f: "tracheal deviation",                           t: "pathognomonic-sp" },
                { f: "hypoxemia",                                    t: "screening-lab"    },
                { f: "CXR: pleural line",                            t: "confirmatory-rad" },
                { f: "CXR: absent lung markings",                    t: "confirmatory-rad" }
            ]
        },

        {
            name: "Lung Cancer",
            prevalence: 0.30,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "insidious onset",                              t: "onset"            },
                { f: "chronic onset",                                t: "onset"            },
                { f: "Hx of smoking",                                t: "risk-factor"      },
                { f: "fatigue",                                      t: "nonspecific-sp"   },
                { f: "cough",                                        t: "nonspecific-sp"   },
                { f: "dyspnea",                                      t: "nonspecific-sp"   },
                { f: "chest pain",                                   t: "nonspecific-sp"   },
                { f: "anemia",                                       t: "nonspecific-sp"   },
                { f: "weight loss",                                  t: "nonspecific-sp"   },
                { f: "anorexia",                                     t: "nonspecific-sp"   },
                { f: "chronic cough",                                t: "pathognomonic-sp" },
                { f: "hemoptysis",                                   t: "pathognomonic-sp" },
                { f: "hoarseness",                                   t: "pathognomonic-sp" },
                { f: "Horner syndrome",                              t: "pathognomonic-sp" },
                { f: "SVC obstruction",                              t: "pathognomonic-sp" },
                { f: "CXR: lung mass",                               t: "nonspecific-rad"  },
                { f: "CXR: hilar enlargement",                       t: "nonspecific-rad"  },
                { f: "CT: pulmonary mass",                           t: "nonspecific-rad"  },
                { f: "biopsy: malignant cells",                      t: "confirmatory-lab" }
            ]
        },

        {
            name: "Pleural Effusion",
            prevalence: 0.35,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "subacute onset",                               t: "onset"            },
                { f: "insidious onset",                              t: "onset"            },
                { f: "Hx of heart failure",                          t: "risk-factor"      },
                { f: "Hx of malignancy",                             t: "risk-factor"      },
                { f: "Hx of liver cirrhosis",                        t: "risk-factor"      },
                { f: "dyspnea",                                      t: "nonspecific-sp"   },
                { f: "cough",                                        t: "nonspecific-sp"   },
                { f: "chest pain",                                   t: "nonspecific-sp"   },
                { f: "pleuritic chest pain",                         t: "nonspecific-sp"   },
                { f: "dullness to percussion at base",               t: "pathognomonic-sp" },
                { f: "absent breath sounds at base",                 t: "pathognomonic-sp" },
                { f: "CXR: blunting of costophrenic angle",          t: "nonspecific-rad"  },
                { f: "US: anechoic pleural collection",              t: "nonspecific-rad"  },
                { f: "pleural fluid: exudate",                       t: "confirmatory-lab" }
            ]
        },


        // ── RENAL / UROLOGICAL ───────────────────────────────────────────

        {
            name: "Urinary Tract Infection",
            prevalence: 0.85,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "1 month - 2 years",                            t: "age"              },
                { f: "2 - 12 years",                                 t: "age"              },
                { f: "12 - 18 years",                                t: "age"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "Hx of diabetes mellitus",                      t: "risk-factor"      },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "abdominal pain",                               t: "nonspecific-sp"   },
                { f: "dysuria",                                      t: "pathognomonic-sp" },
                { f: "urinary frequency",                            t: "pathognomonic-sp" },
                { f: "urinary urgency",                              t: "pathognomonic-sp" },
                { f: "suprapubic tenderness",                        t: "pathognomonic-sp" },
                { f: "cloudy urine",                                 t: "pathognomonic-sp" },
                { f: "malodorous urine",                             t: "pathognomonic-sp" },
                { f: "urinalysis: nitrites",                         t: "screening-lab"    },
                { f: "urinalysis: leukocyte esterase",               t: "screening-lab"    },
                { f: "urinalysis: pyuria",                           t: "screening-lab"    },
                { f: "urinalysis: bacteriuria",                      t: "screening-lab"    },
                { f: "positive urine culture",                       t: "confirmatory-lab" }
            ]
        },

        {
            name: "Acute Pyelonephritis",
            prevalence: 0.55,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "12 - 18 years",                                t: "age"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "Hx of diabetes mellitus",                      t: "risk-factor"      },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "vomiting",                                     t: "nonspecific-sp"   },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "back pain",                                    t: "nonspecific-sp"   },
                { f: "flank pain",                                   t: "nonspecific-sp"   },
                { f: "dysuria",                                      t: "nonspecific-sp"   },
                { f: "high fever",                                   t: "pathognomonic-sp" },
                { f: "CVA tenderness",                               t: "pathognomonic-sp" },
                { f: "leukocytosis",                                 t: "screening-lab"    },
                { f: "urinalysis: pyuria",                           t: "screening-lab"    },
                { f: "urinalysis: WBC casts",                        t: "screening-lab"    },
                { f: "positive urine culture",                       t: "confirmatory-lab" },
                { f: "positive blood culture",                       t: "confirmatory-lab" },
                { f: "CT: wedge-shaped renal hypoenhancement",       t: "confirmatory-rad" }
            ]
        },

        {
            name: "Acute Kidney Injury",
            prevalence: 0.55,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "1 month - 2 years",                            t: "age"              },
                { f: "2 - 12 years",                                 t: "age"              },
                { f: "12 - 18 years",                                t: "age"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "subacute onset",                               t: "onset"            },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "fatigue",                                      t: "nonspecific-sp"   },
                { f: "ankle edema",                                  t: "nonspecific-sp"   },
                { f: "oliguria",                                     t: "pathognomonic-sp" },
                { f: "anuria",                                       t: "pathognomonic-sp" },
                { f: "fluid overload",                               t: "pathognomonic-sp" },
                { f: "elevated creatinine",                          t: "confirmatory-lab" },
                { f: "hyperkalemia",                                 t: "screening-lab"    },
                { f: "metabolic acidosis",                           t: "screening-lab"    },
                { f: "urinalysis: granular casts",                   t: "screening-lab"    },
                { f: "US: hydronephrosis",                           t: "nonspecific-rad"  }
            ]
        },

        {
            name: "Nephrolithiasis",
            prevalence: 0.50,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "episodic onset",                               t: "onset"            },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "vomiting",                                     t: "nonspecific-sp"   },
                { f: "flank pain",                                   t: "nonspecific-sp"   },
                { f: "back pain",                                    t: "nonspecific-sp"   },
                { f: "colicky flank pain",                           t: "pathognomonic-sp" },
                { f: "radiation to groin",                           t: "pathognomonic-sp" },
                { f: "hematuria",                                    t: "pathognomonic-sp" },
                { f: "urinalysis: RBCs",                             t: "screening-lab"    },
                { f: "elevated creatinine",                          t: "screening-lab"    },
                { f: "CT: urinary stone",                            t: "confirmatory-rad" },
                { f: "US: hydronephrosis",                           t: "nonspecific-rad"  }
            ]
        },

        {
            name: "Acute Urinary Retention",
            prevalence: 0.40,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "Hx of surgery",                                t: "risk-factor"      },
                { f: "suprapubic pain",                              t: "pathognomonic-sp" },
                { f: "inability to void",                            t: "pathognomonic-sp" },
                { f: "palpable bladder",                             t: "pathognomonic-sp" },
                { f: "elevated creatinine",                          t: "screening-lab"    },
                { f: "US: large post-void residual",                 t: "confirmatory-rad" }
            ]
        },

        {
            name: "Testicular Cancer",
            prevalence: 0.15,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "insidious onset",                              t: "onset"            },
                { f: "dull scrotal ache",                            t: "nonspecific-sp"   },
                { f: "scrotal heaviness",                            t: "nonspecific-sp"   },
                { f: "painless testicular lump",                     t: "pathognomonic-sp" },
                { f: "solid testicular mass",                        t: "pathognomonic-sp" },
                { f: "elevated AFP",                                 t: "screening-lab"    },
                { f: "elevated beta-hCG",                            t: "screening-lab"    },
                { f: "elevated LDH",                                 t: "screening-lab"    },
                { f: "orchiectomy histopathology",                   t: "confirmatory-lab" },
                { f: "CT: lymphadenopathy",                          t: "confirmatory-rad" }
            ]
        },

        {
            name: "Prostate Cancer",
            prevalence: 0.30,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "insidious onset",                              t: "onset"            },
                { f: "chronic onset",                                t: "onset"            },
                { f: "fatigue",                                      t: "nonspecific-sp"   },
                { f: "back pain",                                    t: "nonspecific-sp"   },
                { f: "anemia",                                       t: "nonspecific-sp"   },
                { f: "weight loss",                                  t: "nonspecific-sp"   },
                { f: "lower urinary tract symptoms (LUTS)",          t: "pathognomonic-sp" },
                { f: "hard irregular prostate",                      t: "pathognomonic-sp" },
                { f: "bone pain",                                    t: "pathognomonic-sp" },
                { f: "elevated PSA",                                 t: "screening-lab"    },
                { f: "elevated ALP",                                 t: "screening-lab"    },
                { f: "prostate biopsy: adenocarcinoma",              t: "confirmatory-lab" },
                { f: "bone scan: metastases",                        t: "confirmatory-rad" }
            ]
        },

        {
            name: "Ovarian Cancer",
            prevalence: 0.15,
            features: [
                { f: "Female",                                       t: "sex"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "insidious onset",                              t: "onset"            },
                { f: "fatigue",                                      t: "nonspecific-sp"   },
                { f: "abdominal pain",                               t: "nonspecific-sp"   },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "anemia",                                       t: "nonspecific-sp"   },
                { f: "weight loss",                                  t: "nonspecific-sp"   },
                { f: "persistent bloating",                          t: "pathognomonic-sp" },
                { f: "pelvic mass",                                  t: "pathognomonic-sp" },
                { f: "ascites",                                      t: "pathognomonic-sp" },
                { f: "pleural effusion",                             t: "pathognomonic-sp" },
                { f: "elevated CA-125",                              t: "screening-lab"    },
                { f: "elevated HE4",                                 t: "screening-lab"    },
                { f: "US: complex adnexal mass",                     t: "nonspecific-rad"  },
                { f: "CT: ovarian mass",                             t: "confirmatory-rad" },
                { f: "CT: peritoneal deposits",                      t: "confirmatory-rad" }
            ]
        },


        // ── NEUROLOGICAL ─────────────────────────────────────────────────

        {
            name: "Ischemic Stroke / TIA",
            prevalence: 0.45,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "Hx of hypertension",                           t: "risk-factor"      },
                { f: "Hx of atrial fibrillation",                    t: "risk-factor"      },
                { f: "Hx of diabetes mellitus",                      t: "risk-factor"      },
                { f: "Hx of smoking",                                t: "risk-factor"      },
                { f: "Hx of dyslipidemia",                           t: "risk-factor"      },
                { f: "headache",                                     t: "nonspecific-sp"   },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "sudden focal neurological deficit",            t: "pathognomonic-sp" },
                { f: "facial droop",                                 t: "pathognomonic-sp" },
                { f: "arm weakness",                                 t: "pathognomonic-sp" },
                { f: "slurred speech",                               t: "pathognomonic-sp" },
                { f: "visual loss",                                  t: "pathognomonic-sp" },
                { f: "diplopia",                                     t: "pathognomonic-sp" },
                { f: "ataxia",                                       t: "pathognomonic-sp" },
                { f: "elevated glucose",                             t: "screening-lab"    },
                { f: "CT: normal or hypodense area",                 t: "nonspecific-rad"  },
                { f: "MRI: restricted diffusion",                    t: "confirmatory-rad" },
                { f: "Angiography: vessel occlusion",                t: "confirmatory-rad" }
            ]
        },

        {
            name: "Hemorrhagic Stroke (ICH)",
            prevalence: 0.20,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "Hx of hypertension",                           t: "risk-factor"      },
                { f: "Hx of anticoagulant use",                      t: "risk-factor"      },
                { f: "Hx of alcohol use disorder",                   t: "risk-factor"      },
                { f: "headache",                                     t: "nonspecific-sp"   },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "vomiting",                                     t: "nonspecific-sp"   },
                { f: "altered level of consciousness",               t: "nonspecific-sp"   },
                { f: "sudden severe headache",                       t: "pathognomonic-sp" },
                { f: "rapid neurological deterioration",             t: "pathognomonic-sp" },
                { f: "focal neurological deficit",                   t: "pathognomonic-sp" },
                { f: "elevated glucose",                             t: "screening-lab"    },
                { f: "coagulopathy",                                 t: "screening-lab"    },
                { f: "CT: hyperdense intraparenchymal hematoma",     t: "confirmatory-rad" }
            ]
        },

        {
            name: "Subarachnoid Hemorrhage",
            prevalence: 0.10,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "Hx of hypertension",                           t: "risk-factor"      },
                { f: "Hx of smoking",                                t: "risk-factor"      },
                { f: "headache",                                     t: "nonspecific-sp"   },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "vomiting",                                     t: "nonspecific-sp"   },
                { f: "altered level of consciousness",               t: "nonspecific-sp"   },
                { f: "photophobia",                                  t: "nonspecific-sp"   },
                { f: "thunderclap headache",                         t: "pathognomonic-sp" },
                { f: "nuchal rigidity",                              t: "pathognomonic-sp" },
                { f: "sudden LOC",                                   t: "pathognomonic-sp" },
                { f: "CSF: xanthochromia",                           t: "confirmatory-lab" },
                { f: "CT: subarachnoid blood",                       t: "confirmatory-rad" },
                { f: "Angiography: aneurysm",                        t: "confirmatory-rad" }
            ]
        },

        {
            name: "Bacterial Meningitis",
            prevalence: 0.15,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "< 1 month",                                    t: "age"              },
                { f: "1 month - 2 years",                            t: "age"              },
                { f: "2 - 12 years",                                 t: "age"              },
                { f: "12 - 18 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "headache",                                     t: "nonspecific-sp"   },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "malaise",                                      t: "nonspecific-sp"   },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "vomiting",                                     t: "nonspecific-sp"   },
                { f: "altered level of consciousness",               t: "nonspecific-sp"   },
                { f: "high fever",                                   t: "pathognomonic-sp" },
                { f: "nuchal rigidity",                              t: "pathognomonic-sp" },
                { f: "non-blanching rash",                           t: "pathognomonic-sp" },
                { f: "Kernig's sign",                                t: "pathognomonic-sp" },
                { f: "Brudzinski's sign",                            t: "pathognomonic-sp" },
                { f: "photophobia",                                  t: "pathognomonic-sp" },
                { f: "leukocytosis",                                 t: "screening-lab"    },
                { f: "CSF: elevated neutrophils",                    t: "confirmatory-lab" },
                { f: "CSF: low glucose",                             t: "confirmatory-lab" },
                { f: "CSF: elevated protein",                        t: "confirmatory-lab" },
                { f: "positive CSF culture",                         t: "confirmatory-lab" },
                { f: "MRI: meningeal enhancement",                   t: "confirmatory-rad" }
            ]
        },

        {
            name: "Migraine",
            prevalence: 0.70,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "12 - 18 years",                                t: "age"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "episodic onset",                               t: "onset"            },
                { f: "headache",                                     t: "nonspecific-sp"   },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "vomiting",                                     t: "nonspecific-sp"   },
                { f: "photophobia",                                  t: "nonspecific-sp"   },
                { f: "phonophobia",                                  t: "nonspecific-sp"   },
                { f: "unilateral throbbing headache",                t: "pathognomonic-sp" },
                { f: "visual aura",                                  t: "pathognomonic-sp" },
                { f: "headache worsened by physical activity",       t: "pathognomonic-sp" }
            ]
        },

        {
            name: "Seizure / Epilepsy",
            prevalence: 0.50,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "< 1 month",                                    t: "age"              },
                { f: "1 month - 2 years",                            t: "age"              },
                { f: "2 - 12 years",                                 t: "age"              },
                { f: "12 - 18 years",                                t: "age"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "episodic onset",                               t: "onset"            },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "altered level of consciousness",               t: "nonspecific-sp"   },
                { f: "tongue bite",                                  t: "pathognomonic-sp" },
                { f: "post-ictal confusion",                         t: "pathognomonic-sp" },
                { f: "urinary incontinence",                         t: "pathognomonic-sp" },
                { f: "tonic-clonic movements",                       t: "pathognomonic-sp" },
                { f: "EEG: epileptiform discharges",                 t: "confirmatory-lab" }
            ]
        },

        {
            name: "Guillain-Barré Syndrome",
            prevalence: 0.08,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "12 - 18 years",                                t: "age"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "subacute onset",                               t: "onset"            },
                { f: "back pain",                                    t: "nonspecific-sp"   },
                { f: "paresthesia",                                  t: "nonspecific-sp"   },
                { f: "ascending weakness",                           t: "pathognomonic-sp" },
                { f: "areflexia",                                    t: "pathognomonic-sp" },
                { f: "facial diplegia",                              t: "pathognomonic-sp" },
                { f: "autonomic dysfunction",                        t: "pathognomonic-sp" },
                { f: "CSF: albuminocytologic dissociation",          t: "confirmatory-lab" },
                { f: "EMG: demyelinating neuropathy",                t: "confirmatory-lab" }
            ]
        },


        // ── MUSCULOSKELETAL ──────────────────────────────────────────────

        {
            name: "Gout",
            prevalence: 0.40,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "episodic onset",                               t: "onset"            },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "malaise",                                      t: "nonspecific-sp"   },
                { f: "joint pain",                                   t: "nonspecific-sp"   },
                { f: "joint swelling",                               t: "nonspecific-sp"   },
                { f: "acute monoarthritis",                          t: "pathognomonic-sp" },
                { f: "podagra",                                      t: "pathognomonic-sp" },
                { f: "tophi",                                        t: "pathognomonic-sp" },
                { f: "exquisitely tender hot swollen joint",         t: "pathognomonic-sp" },
                { f: "elevated uric acid",                           t: "screening-lab"    },
                { f: "elevated CRP",                                 t: "screening-lab"    },
                { f: "elevated ESR",                                 t: "screening-lab"    },
                { f: "leukocytosis",                                 t: "screening-lab"    },
                { f: "joint aspirate: negatively birefringent crystals", t: "confirmatory-lab" },
                { f: "XR: punched-out erosions",                     t: "confirmatory-rad" },
                { f: "XR: overhanging edges",                        t: "confirmatory-rad" }
            ]
        },

        {
            name: "Septic Arthritis",
            prevalence: 0.20,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "1 month - 2 years",                            t: "age"              },
                { f: "2 - 12 years",                                 t: "age"              },
                { f: "12 - 18 years",                                t: "age"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "Hx of diabetes mellitus",                      t: "risk-factor"      },
                { f: "Hx of IV drug use",                            t: "risk-factor"      },
                { f: "Hx of surgery",                                t: "risk-factor"      },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "malaise",                                      t: "nonspecific-sp"   },
                { f: "joint pain",                                   t: "nonspecific-sp"   },
                { f: "joint swelling",                               t: "nonspecific-sp"   },
                { f: "high fever",                                   t: "pathognomonic-sp" },
                { f: "acute hot swollen tender monoarthritis",       t: "pathognomonic-sp" },
                { f: "restricted range of motion",                   t: "pathognomonic-sp" },
                { f: "leukocytosis",                                 t: "screening-lab"    },
                { f: "elevated CRP",                                 t: "screening-lab"    },
                { f: "elevated ESR",                                 t: "screening-lab"    },
                { f: "joint aspirate: WBC >50,000",                  t: "confirmatory-lab" },
                { f: "joint aspirate: organisms on Gram stain",      t: "confirmatory-lab" },
                { f: "positive blood culture",                       t: "confirmatory-lab" }
            ]
        },

        {
            name: "Rheumatoid Arthritis",
            prevalence: 0.35,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "subacute onset",                               t: "onset"            },
                { f: "insidious onset",                              t: "onset"            },
                { f: "Hx of smoking",                                t: "risk-factor"      },
                { f: "fatigue",                                      t: "nonspecific-sp"   },
                { f: "malaise",                                      t: "nonspecific-sp"   },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "joint pain",                                   t: "nonspecific-sp"   },
                { f: "joint swelling",                               t: "nonspecific-sp"   },
                { f: "anemia",                                       t: "nonspecific-sp"   },
                { f: "symmetric polyarthritis",                      t: "pathognomonic-sp" },
                { f: "morning stiffness",                            t: "pathognomonic-sp" },
                { f: "rheumatoid nodules",                           t: "pathognomonic-sp" },
                { f: "ulnar deviation",                              t: "pathognomonic-sp" },
                { f: "elevated CRP",                                 t: "screening-lab"    },
                { f: "elevated ESR",                                 t: "screening-lab"    },
                { f: "normocytic anemia",                            t: "screening-lab"    },
                { f: "positive RF",                                  t: "confirmatory-lab" },
                { f: "positive anti-CCP",                            t: "confirmatory-lab" },
                { f: "XR: joint space narrowing",                    t: "confirmatory-rad" },
                { f: "XR: marginal erosions",                        t: "confirmatory-rad" }
            ]
        },

        {
            name: "Herniated Disc (Radicular Syndrome)",
            prevalence: 0.55,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "subacute onset",                               t: "onset"            },
                { f: "obesity",                                      t: "risk-factor"      },
                { f: "back pain",                                    t: "nonspecific-sp"   },
                { f: "sciatica",                                     t: "pathognomonic-sp" },
                { f: "positive straight leg raise",                  t: "pathognomonic-sp" },
                { f: "dermatomal sensory loss",                      t: "pathognomonic-sp" },
                { f: "myotomal weakness",                            t: "pathognomonic-sp" },
                { f: "diminished reflexes",                          t: "pathognomonic-sp" },
                { f: "MRI: disc herniation",                         t: "confirmatory-rad" },
                { f: "MRI: nerve root compression",                  t: "confirmatory-rad" }
            ]
        },


        // ── ENDOCRINE ────────────────────────────────────────────────────

        {
            name: "Diabetic Ketoacidosis (DKA)",
            prevalence: 0.25,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "2 - 12 years",                                 t: "age"              },
                { f: "12 - 18 years",                                t: "age"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "Hx of diabetes mellitus",                      t: "risk-factor"      },
                { f: "polyuria",                                     t: "nonspecific-sp"   },
                { f: "polydipsia",                                   t: "nonspecific-sp"   },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "vomiting",                                     t: "nonspecific-sp"   },
                { f: "abdominal pain",                               t: "nonspecific-sp"   },
                { f: "altered level of consciousness",               t: "nonspecific-sp"   },
                { f: "Kussmaul breathing",                           t: "pathognomonic-sp" },
                { f: "fruity breath",                                t: "pathognomonic-sp" },
                { f: "severe dehydration",                           t: "pathognomonic-sp" },
                { f: "elevated glucose",                             t: "screening-lab"    },
                { f: "ketonemia",                                    t: "screening-lab"    },
                { f: "ketonuria",                                    t: "screening-lab"    },
                { f: "metabolic acidosis",                           t: "confirmatory-lab" }
            ]
        },

        {
            name: "Hyperosmolar Hyperglycemic State (HHS)",
            prevalence: 0.20,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "subacute onset",                               t: "onset"            },
                { f: "Hx of diabetes mellitus",                      t: "risk-factor"      },
                { f: "polyuria",                                     t: "nonspecific-sp"   },
                { f: "polydipsia",                                   t: "nonspecific-sp"   },
                { f: "fatigue",                                      t: "nonspecific-sp"   },
                { f: "altered level of consciousness",               t: "nonspecific-sp"   },
                { f: "severe dehydration",                           t: "pathognomonic-sp" },
                { f: "focal neurological signs",                     t: "pathognomonic-sp" },
                { f: "elevated glucose",                             t: "confirmatory-lab" }
            ]
        },

        {
            name: "Hypoglycemia",
            prevalence: 0.65,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "< 1 month",                                    t: "age"              },
                { f: "1 month - 2 years",                            t: "age"              },
                { f: "2 - 12 years",                                 t: "age"              },
                { f: "12 - 18 years",                                t: "age"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "Hx of diabetes mellitus",                      t: "risk-factor"      },
                { f: "Hx of alcohol use disorder",                   t: "risk-factor"      },
                { f: "tremor",                                       t: "nonspecific-sp"   },
                { f: "diaphoresis",                                  t: "nonspecific-sp"   },
                { f: "palpitations",                                 t: "nonspecific-sp"   },
                { f: "hunger",                                       t: "nonspecific-sp"   },
                { f: "altered level of consciousness",               t: "pathognomonic-sp" },
                { f: "Whipple's triad",                              t: "pathognomonic-sp" },
                { f: "low glucose",                                  t: "confirmatory-lab" }
            ]
        },

        {
            name: "Hyperthyroidism",
            prevalence: 0.35,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "subacute onset",                               t: "onset"            },
                { f: "insidious onset",                              t: "onset"            },
                { f: "fatigue",                                      t: "nonspecific-sp"   },
                { f: "diarrhea",                                     t: "nonspecific-sp"   },
                { f: "tachycardia",                                  t: "nonspecific-sp"   },
                { f: "heat intolerance",                             t: "pathognomonic-sp" },
                { f: "hyperhidrosis",                                t: "pathognomonic-sp" },
                { f: "weight loss",                                  t: "pathognomonic-sp" },
                { f: "tremor",                                       t: "pathognomonic-sp" },
                { f: "diffuse goitre",                               t: "pathognomonic-sp" },
                { f: "exophthalmos",                                 t: "pathognomonic-sp" },
                { f: "low TSH",                                      t: "screening-lab"    },
                { f: "elevated free T4",                             t: "confirmatory-lab" },
                { f: "positive TRAb",                                t: "confirmatory-lab" }
            ]
        },

        {
            name: "Hypothyroidism",
            prevalence: 0.45,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "insidious onset",                              t: "onset"            },
                { f: "chronic onset",                                t: "onset"            },
                { f: "fatigue",                                      t: "nonspecific-sp"   },
                { f: "weight gain",                                  t: "nonspecific-sp"   },
                { f: "ankle edema",                                  t: "nonspecific-sp"   },
                { f: "anemia",                                       t: "nonspecific-sp"   },
                { f: "cold intolerance",                             t: "pathognomonic-sp" },
                { f: "dry skin",                                     t: "pathognomonic-sp" },
                { f: "hair loss",                                    t: "pathognomonic-sp" },
                { f: "bradycardia",                                  t: "pathognomonic-sp" },
                { f: "delayed reflexes",                             t: "pathognomonic-sp" },
                { f: "non-pitting edema",                            t: "pathognomonic-sp" },
                { f: "normocytic anemia",                            t: "screening-lab"    },
                { f: "elevated TSH",                                 t: "screening-lab"    },
                { f: "low free T4",                                  t: "confirmatory-lab" },
                { f: "positive anti-TPO",                            t: "confirmatory-lab" }
            ]
        },

        {
            name: "Adrenal Crisis",
            prevalence: 0.06,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "1 month - 2 years",                            t: "age"              },
                { f: "2 - 12 years",                                 t: "age"              },
                { f: "12 - 18 years",                                t: "age"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "vomiting",                                     t: "nonspecific-sp"   },
                { f: "abdominal pain",                               t: "nonspecific-sp"   },
                { f: "fatigue",                                      t: "nonspecific-sp"   },
                { f: "altered level of consciousness",               t: "nonspecific-sp"   },
                { f: "refractory hypotension",                       t: "pathognomonic-sp" },
                { f: "hyperpigmentation",                            t: "pathognomonic-sp" },
                { f: "hyponatremia",                                 t: "screening-lab"    },
                { f: "hyperkalemia",                                 t: "screening-lab"    },
                { f: "low glucose",                                  t: "screening-lab"    },
                { f: "eosinophilia",                                 t: "screening-lab"    },
                { f: "low random cortisol",                          t: "confirmatory-lab" },
                { f: "failed Synacthen test",                        t: "confirmatory-lab" }
            ]
        },


        // ── INFECTIOUS ───────────────────────────────────────────────────

        {
            name: "Sepsis",
            prevalence: 0.50,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "< 1 month",                                    t: "age"              },
                { f: "1 month - 2 years",                            t: "age"              },
                { f: "2 - 12 years",                                 t: "age"              },
                { f: "12 - 18 years",                                t: "age"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "Hx of diabetes mellitus",                      t: "risk-factor"      },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "tachycardia",                                  t: "nonspecific-sp"   },
                { f: "dyspnea",                                      t: "nonspecific-sp"   },
                { f: "altered level of consciousness",               t: "nonspecific-sp"   },
                { f: "high fever",                                   t: "pathognomonic-sp" },
                { f: "refractory hypotension",                       t: "pathognomonic-sp" },
                { f: "mottled skin",                                 t: "pathognomonic-sp" },
                { f: "prolonged capillary refill",                   t: "pathognomonic-sp" },
                { f: "qSOFA >= 2",                                   t: "pathognomonic-sp" },
                { f: "leukocytosis",                                 t: "screening-lab"    },
                { f: "leukopenia",                                   t: "screening-lab"    },
                { f: "elevated lactate",                             t: "screening-lab"    },
                { f: "elevated CRP",                                 t: "screening-lab"    },
                { f: "elevated procalcitonin",                       t: "screening-lab"    },
                { f: "positive blood culture",                       t: "confirmatory-lab" }
            ]
        },

        {
            name: "Cellulitis",
            prevalence: 0.65,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "1 month - 2 years",                            t: "age"              },
                { f: "2 - 12 years",                                 t: "age"              },
                { f: "12 - 18 years",                                t: "age"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "subacute onset",                               t: "onset"            },
                { f: "Hx of diabetes mellitus",                      t: "risk-factor"      },
                { f: "obesity",                                      t: "risk-factor"      },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "malaise",                                      t: "nonspecific-sp"   },
                { f: "spreading erythema",                           t: "pathognomonic-sp" },
                { f: "local warmth and swelling",                    t: "pathognomonic-sp" },
                { f: "lymphangitis",                                 t: "pathognomonic-sp" },
                { f: "leukocytosis",                                 t: "screening-lab"    },
                { f: "elevated CRP",                                 t: "screening-lab"    }
            ]
        },

        {
            name: "Infective Endocarditis",
            prevalence: 0.15,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "subacute onset",                               t: "onset"            },
                { f: "Hx of IV drug use",                            t: "risk-factor"      },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "fatigue",                                      t: "nonspecific-sp"   },
                { f: "anorexia",                                     t: "nonspecific-sp"   },
                { f: "night sweats",                                 t: "nonspecific-sp"   },
                { f: "anemia",                                       t: "nonspecific-sp"   },
                { f: "new cardiac murmur",                           t: "pathognomonic-sp" },
                { f: "splinter hemorrhages",                         t: "pathognomonic-sp" },
                { f: "Osler's nodes",                                t: "pathognomonic-sp" },
                { f: "Janeway lesions",                              t: "pathognomonic-sp" },
                { f: "Roth's spots",                                 t: "pathognomonic-sp" },
                { f: "leukocytosis",                                 t: "screening-lab"    },
                { f: "elevated CRP",                                 t: "screening-lab"    },
                { f: "elevated ESR",                                 t: "screening-lab"    },
                { f: "positive blood culture",                       t: "confirmatory-lab" },
                { f: "Duke criteria met",                            t: "confirmatory-lab" },
                { f: "Echo: vegetation",                             t: "confirmatory-rad" }
            ]
        },

        {
            name: "Malaria",
            prevalence: 0.50,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "1 month - 2 years",                            t: "age"              },
                { f: "2 - 12 years",                                 t: "age"              },
                { f: "12 - 18 years",                                t: "age"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "residence in endemic area",                    t: "risk-factor"      },
                { f: "headache",                                     t: "nonspecific-sp"   },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "vomiting",                                     t: "nonspecific-sp"   },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "myalgia",                                      t: "nonspecific-sp"   },
                { f: "anemia",                                       t: "nonspecific-sp"   },
                { f: "cyclic fever",                                 t: "pathognomonic-sp" },
                { f: "splenomegaly",                                 t: "pathognomonic-sp" },
                { f: "jaundice",                                     t: "pathognomonic-sp" },
                { f: "thrombocytopenia",                             t: "screening-lab"    },
                { f: "hemolytic anemia",                             t: "screening-lab"    },
                { f: "positive thick/thin blood film",               t: "confirmatory-lab" },
                { f: "positive malaria RDT",                         t: "confirmatory-lab" }
            ]
        },

        {
            name: "Dengue Fever",
            prevalence: 0.40,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "1 month - 2 years",                            t: "age"              },
                { f: "2 - 12 years",                                 t: "age"              },
                { f: "12 - 18 years",                                t: "age"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "residence in endemic area",                    t: "risk-factor"      },
                { f: "headache",                                     t: "nonspecific-sp"   },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "vomiting",                                     t: "nonspecific-sp"   },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "retro-orbital pain",                           t: "pathognomonic-sp" },
                { f: "myalgia",                                      t: "pathognomonic-sp" },
                { f: "arthralgia",                                   t: "pathognomonic-sp" },
                { f: "maculopapular rash",                           t: "pathognomonic-sp" },
                { f: "positive tourniquet test",                     t: "pathognomonic-sp" },
                { f: "thrombocytopenia",                             t: "screening-lab"    },
                { f: "leukopenia",                                   t: "screening-lab"    },
                { f: "positive NS1 antigen",                         t: "confirmatory-lab" },
                { f: "positive Dengue serology",                     t: "confirmatory-lab" }
            ]
        },

        {
            name: "Anaphylaxis",
            prevalence: 0.30,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "1 month - 2 years",                            t: "age"              },
                { f: "2 - 12 years",                                 t: "age"              },
                { f: "12 - 18 years",                                t: "age"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "vomiting",                                     t: "nonspecific-sp"   },
                { f: "abdominal cramps",                             t: "nonspecific-sp"   },
                { f: "tachycardia",                                  t: "nonspecific-sp"   },
                { f: "urticaria",                                    t: "pathognomonic-sp" },
                { f: "angioedema",                                   t: "pathognomonic-sp" },
                { f: "stridor",                                      t: "pathognomonic-sp" },
                { f: "hypotension",                                  t: "pathognomonic-sp" },
                { f: "hypoxemia",                                    t: "pathognomonic-sp" },
                { f: "elevated tryptase",                            t: "confirmatory-lab" }
            ]
        },

        {
            name: "HIV / AIDS",
            prevalence: 0.30,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "insidious onset",                              t: "onset"            },
                { f: "chronic onset",                                t: "onset"            },
                { f: "recent unprotected sexual contact",            t: "risk-factor"      },
                { f: "Hx of IV drug use",                            t: "risk-factor"      },
                { f: "fatigue",                                      t: "nonspecific-sp"   },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "night sweats",                                 t: "nonspecific-sp"   },
                { f: "anemia",                                       t: "nonspecific-sp"   },
                { f: "diarrhea",                                     t: "nonspecific-sp"   },
                { f: "weight loss",                                  t: "nonspecific-sp"   },
                { f: "recurrent infections",                         t: "pathognomonic-sp" },
                { f: "oral candidiasis",                             t: "pathognomonic-sp" },
                { f: "generalized lymphadenopathy",                  t: "pathognomonic-sp" },
                { f: "lymphopenia",                                  t: "screening-lab"    },
                { f: "positive HIV ELISA",                           t: "screening-lab"    },
                { f: "positive HIV PCR",                             t: "confirmatory-lab" },
                { f: "CD4 count <200",                               t: "confirmatory-lab" }
            ]
        },


        // ── OB / GYN ─────────────────────────────────────────────────────

        {
            name: "Ectopic Pregnancy",
            prevalence: 0.20,
            features: [
                { f: "Female",                                       t: "sex"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "pregnancy",                                    t: "risk-factor"      },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "vomiting",                                     t: "nonspecific-sp"   },
                { f: "abdominal pain",                               t: "nonspecific-sp"   },
                { f: "syncope",                                      t: "nonspecific-sp"   },
                { f: "unilateral pelvic pain",                       t: "pathognomonic-sp" },
                { f: "vaginal bleeding",                             t: "pathognomonic-sp" },
                { f: "cervical motion tenderness",                   t: "pathognomonic-sp" },
                { f: "hemodynamic instability",                      t: "pathognomonic-sp" },
                { f: "elevated beta-hCG",                            t: "screening-lab"    },
                { f: "US: empty uterus",                             t: "confirmatory-rad" },
                { f: "US: complex adnexal mass",                     t: "confirmatory-rad" }
            ]
        },

        {
            name: "Pelvic Inflammatory Disease",
            prevalence: 0.40,
            features: [
                { f: "Female",                                       t: "sex"              },
                { f: "12 - 18 years",                                t: "age"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "subacute onset",                               t: "onset"            },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "abdominal pain",                               t: "nonspecific-sp"   },
                { f: "cervical motion tenderness",                   t: "pathognomonic-sp" },
                { f: "adnexal tenderness",                           t: "pathognomonic-sp" },
                { f: "purulent cervical discharge",                  t: "pathognomonic-sp" },
                { f: "leukocytosis",                                 t: "screening-lab"    },
                { f: "elevated CRP",                                 t: "screening-lab"    },
                { f: "positive gonorrhea/chlamydia swab",            t: "confirmatory-lab" }
            ]
        },

        {
            name: "Ovarian Torsion",
            prevalence: 0.15,
            features: [
                { f: "Female",                                       t: "sex"              },
                { f: "12 - 18 years",                                t: "age"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "vomiting",                                     t: "nonspecific-sp"   },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "abdominal pain",                               t: "nonspecific-sp"   },
                { f: "RLQ pain",                                     t: "nonspecific-sp"   },
                { f: "severe unilateral pelvic pain",                t: "pathognomonic-sp" },
                { f: "pelvic mass",                                  t: "pathognomonic-sp" },
                { f: "leukocytosis",                                 t: "screening-lab"    },
                { f: "US: complex adnexal mass",                     t: "confirmatory-rad" },
                { f: "US: absent ovarian Doppler flow",              t: "confirmatory-rad" }
            ]
        },

        {
            name: "Preeclampsia",
            prevalence: 0.20,
            features: [
                { f: "Female",                                       t: "sex"              },
                { f: "12 - 18 years",                                t: "age"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "subacute onset",                               t: "onset"            },
                { f: "pregnancy",                                    t: "risk-factor"      },
                { f: "headache",                                     t: "nonspecific-sp"   },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "vomiting",                                     t: "nonspecific-sp"   },
                { f: "abdominal pain",                               t: "nonspecific-sp"   },
                { f: "RUQ pain",                                     t: "nonspecific-sp"   },
                { f: "ankle edema",                                  t: "nonspecific-sp"   },
                { f: "new-onset hypertension",                       t: "pathognomonic-sp" },
                { f: "visual disturbances",                          t: "pathognomonic-sp" },
                { f: "urinalysis: proteinuria",                      t: "confirmatory-lab" },
                { f: "thrombocytopenia",                             t: "screening-lab"    },
                { f: "elevated ALT",                                 t: "screening-lab"    },
                { f: "elevated AST",                                 t: "screening-lab"    },
                { f: "elevated creatinine",                          t: "screening-lab"    },
                { f: "US: fetal growth restriction",                 t: "nonspecific-rad"  }
            ]
        },

        {
            name: "Threatened / Inevitable Abortion",
            prevalence: 0.30,
            features: [
                { f: "Female",                                       t: "sex"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "pregnancy",                                    t: "risk-factor"      },
                { f: "nausea",                                       t: "nonspecific-sp"   },
                { f: "abdominal pain",                               t: "nonspecific-sp"   },
                { f: "lower abdominal cramps",                       t: "pathognomonic-sp" },
                { f: "vaginal bleeding",                             t: "pathognomonic-sp" },
                { f: "elevated beta-hCG",                            t: "screening-lab"    },
                { f: "US: fetal cardiac activity",                   t: "nonspecific-rad"  },
                { f: "US: empty uterus",                             t: "confirmatory-rad" }
            ]
        },


        // ── HEMATOLOGY ───────────────────────────────────────────────────

        {
            name: "Iron Deficiency Anemia",
            prevalence: 0.65,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "1 month - 2 years",                            t: "age"              },
                { f: "2 - 12 years",                                 t: "age"              },
                { f: "12 - 18 years",                                t: "age"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "insidious onset",                              t: "onset"            },
                { f: "chronic onset",                                t: "onset"            },
                { f: "fatigue",                                      t: "nonspecific-sp"   },
                { f: "dyspnea",                                      t: "nonspecific-sp"   },
                { f: "pallor",                                       t: "nonspecific-sp"   },
                { f: "anemia",                                       t: "nonspecific-sp"   },
                { f: "tachycardia",                                  t: "nonspecific-sp"   },
                { f: "pica",                                         t: "pathognomonic-sp" },
                { f: "angular cheilitis",                            t: "pathognomonic-sp" },
                { f: "glossitis",                                    t: "pathognomonic-sp" },
                { f: "koilonychia",                                  t: "pathognomonic-sp" },
                { f: "microcytic anemia",                            t: "screening-lab"    },
                { f: "low ferritin",                                 t: "confirmatory-lab" },
                { f: "elevated TIBC",                                t: "confirmatory-lab" },
                { f: "low serum iron",                               t: "confirmatory-lab" }
            ]
        },

        {
            name: "Sickle Cell Crisis (Vaso-occlusive)",
            prevalence: 0.25,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "< 1 month",                                    t: "age"              },
                { f: "1 month - 2 years",                            t: "age"              },
                { f: "2 - 12 years",                                 t: "age"              },
                { f: "12 - 18 years",                                t: "age"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "episodic onset",                               t: "onset"            },
                { f: "fatigue",                                      t: "nonspecific-sp"   },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "pallor",                                       t: "nonspecific-sp"   },
                { f: "jaundice",                                     t: "nonspecific-sp"   },
                { f: "anemia",                                       t: "nonspecific-sp"   },
                { f: "severe bone pain",                             t: "pathognomonic-sp" },
                { f: "acute chest syndrome",                         t: "pathognomonic-sp" },
                { f: "dactylitis",                                   t: "pathognomonic-sp" },
                { f: "leukocytosis",                                 t: "screening-lab"    },
                { f: "hemolytic anemia",                             t: "screening-lab"    },
                { f: "HbSS on electrophoresis",                      t: "confirmatory-lab" },
                { f: "CXR: new infiltrate",                          t: "nonspecific-rad"  }
            ]
        },

        {
            name: "Lymphoma",
            prevalence: 0.20,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "subacute onset",                               t: "onset"            },
                { f: "insidious onset",                              t: "onset"            },
                { f: "fatigue",                                      t: "nonspecific-sp"   },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "anemia",                                       t: "nonspecific-sp"   },
                { f: "weight loss",                                  t: "nonspecific-sp"   },
                { f: "night sweats",                                 t: "pathognomonic-sp" },
                { f: "painless lymphadenopathy",                     t: "pathognomonic-sp" },
                { f: "splenomegaly",                                 t: "pathognomonic-sp" },
                { f: "alcohol-induced node pain",                    t: "pathognomonic-sp" },
                { f: "leukopenia",                                   t: "screening-lab"    },
                { f: "thrombocytopenia",                             t: "screening-lab"    },
                { f: "elevated LDH",                                 t: "screening-lab"    },
                { f: "elevated ESR",                                 t: "screening-lab"    },
                { f: "elevated uric acid",                           t: "screening-lab"    },
                { f: "biopsy: malignant cells",                      t: "confirmatory-lab" },
                { f: "CT: lymphadenopathy",                          t: "nonspecific-rad"  }
            ]
        },

        {
            name: "Leukemia (Acute)",
            prevalence: 0.10,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "1 month - 2 years",                            t: "age"              },
                { f: "2 - 12 years",                                 t: "age"              },
                { f: "12 - 18 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "> 60 years",                                   t: "age"              },
                { f: "acute onset",                                  t: "onset"            },
                { f: "subacute onset",                               t: "onset"            },
                { f: "fatigue",                                      t: "nonspecific-sp"   },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "anemia",                                       t: "nonspecific-sp"   },
                { f: "bone pain",                                    t: "nonspecific-sp"   },
                { f: "weight loss",                                  t: "nonspecific-sp"   },
                { f: "pallor",                                       t: "pathognomonic-sp" },
                { f: "easy bruising",                                t: "pathognomonic-sp" },
                { f: "splenomegaly",                                 t: "pathognomonic-sp" },
                { f: "hepatomegaly",                                 t: "pathognomonic-sp" },
                { f: "recurrent infections",                         t: "pathognomonic-sp" },
                { f: "pancytopenia",                                 t: "screening-lab"    },
                { f: "bone marrow biopsy: >20% blasts",              t: "confirmatory-lab" }
            ]
        },


        // ── DERMATOLOGY / MULTI-SYSTEM ───────────────────────────────────

        {
            name: "Systemic Lupus Erythematosus (SLE)",
            prevalence: 0.15,
            features: [
                { f: "Male",                                         t: "sex"              },
                { f: "Female",                                       t: "sex"              },
                { f: "12 - 18 years",                                t: "age"              },
                { f: "18 - 40 years",                                t: "age"              },
                { f: "40 - 60 years",                                t: "age"              },
                { f: "insidious onset",                              t: "onset"            },
                { f: "subacute onset",                               t: "onset"            },
                { f: "episodic onset",                               t: "onset"            },
                { f: "fatigue",                                      t: "nonspecific-sp"   },
                { f: "fever",                                        t: "nonspecific-sp"   },
                { f: "joint pain",                                   t: "nonspecific-sp"   },
                { f: "joint swelling",                               t: "nonspecific-sp"   },
                { f: "anemia",                                       t: "nonspecific-sp"   },
                { f: "weight loss",                                  t: "nonspecific-sp"   },
                { f: "butterfly rash",                               t: "pathognomonic-sp" },
                { f: "photosensitive rash",                          t: "pathognomonic-sp" },
                { f: "symmetric polyarthritis",                      t: "pathognomonic-sp" },
                { f: "oral ulcers",                                  t: "pathognomonic-sp" },
                { f: "serositis",                                    t: "pathognomonic-sp" },
                { f: "pancytopenia",                                 t: "screening-lab"    },
                { f: "elevated CRP",                                 t: "screening-lab"    },
                { f: "elevated ESR",                                 t: "screening-lab"    },
                { f: "positive ANA",                                 t: "screening-lab"    },
                { f: "positive anti-dsDNA",                          t: "confirmatory-lab" },
                { f: "positive anti-Sm",                             t: "confirmatory-lab" },
                { f: "low complement",                               t: "confirmatory-lab" },
                { f: "urinalysis: proteinuria",                      t: "confirmatory-lab" }
            ]
        }

    ] // end diseases[]

}; // end DDX_DATA


// ── DERIVED VOCABULARY ────────────────────────────────────────────────────────
const DDX_VOCAB = Array.from(
    new Set(DDX_DATA.diseases.flatMap(d => d.features.map(feat => feat.f)))
).sort();