 
const DDX_DATA = {
    systems: [
        { id: "git", name: "Gastrointestinal", icon: "🍏" },
        { id: "resp", name: "Respiratory", icon: "🫁" },
        { id: "cvs", name: "Cardiovascular", icon: "❤️" },
        { id: "renal", name: "Renal / Urological", icon: "🫘" },
        { id: "neuro", name: "Neurological", icon: "🧠" },
        { id: "endo", name: "Endocrine", icon: "⚛️" },
        { id: "msk", name: "Musculoskeletal", icon: "🦴" }
    ],
    symptoms: {
        git: {
            symptoms: [
                "Abdominal pain", "Nausea", "Vomiting", "Diarrhea",
                "Constipation", "Heartburn", "Dysphagia", "Anorexia",
                "Bloating", "Hematemesis"
            ],
            signs: [
                "Jaundice", "Right upper quadrant tenderness", "Rebound tenderness",
                "McBurney's point tenderness", "Hepatomegaly", "Murphy's sign",
                "Guarding", "Abdominal distension", "Absent bowel sounds",
                "Fever"
            ],
            labs: [
                "Leukocytosis", "Elevated AST/ALT", "Elevated lipase",
                "Elevated bilirubin", "Anemia", "Elevated amylase",
                "Elevated ALP", "Elevated GGT", "Metabolic alkalosis",
                "Elevated lactate"
            ],
            radiology: [
                "Free air under diaphragm", "Thickened appendix on US",
                "Dilated bowel loops", "Gallstones on US",
                "Pancreatic inflammation on CT", "Air-fluid levels on X-ray",
                "GB wall thickening on US", "Pericholecystic fluid on US",
                "Transition point on CT"
            ]
        },
        resp: {
            symptoms: [
                "Cough", "Shortness of breath", "Chest pain",
                "Hemoptysis", "Pleuritic chest pain", "Wheezing",
                "Sputum production", "Orthopnea"
            ],
            signs: [
                "Wheezing", "Crackles", "Tachypnea", "Fever",
                "Cyanosis", "Decreased breath sounds",
                "Accessory muscle use", "Tracheal deviation",
                "Tachycardia", "Hypotension"
            ],
            labs: [
                "Elevated WBC", "Positive sputum culture",
                "Hypoxemia (low PaO2)", "Elevated D-dimer",
                "Respiratory alkalosis", "Elevated troponin",
                "Positive blood culture", "Elevated BNP",
                "Elevated procalcitonin"
            ],
            radiology: [
                "Lobar infiltrate", "Pleural effusion",
                "Pneumothorax on CXR", "Ground-glass opacities",
                "CT angiography filling defect", "Hyperinflation on CXR",
                "Mediastinal shift on CXR", "Air bronchograms",
                "Hampton hump on CXR", "Westermark sign on CXR"
            ]
        },
        cvs: {
            symptoms: [
                "Chest pain", "Shortness of breath", "Palpitations",
                "Syncope", "Orthopnea", "Paroxysmal nocturnal dyspnea",
                "Leg swelling", "Diaphoresis", "Fatigue",
                "Dizziness"
            ],
            signs: [
                "Hypotension", "Tachycardia", "Jugular venous distension",
                "S3 gallop", "S4 gallop", "Peripheral edema",
                "New murmur", "Pericardial friction rub",
                "Bradycardia", "Elevated JVP"
            ],
            labs: [
                "Elevated troponin", "Elevated BNP",
                "Elevated CRP", "Elevated ESR",
                "ECG ST elevation", "ECG ST depression",
                "Elevated D-dimer", "Elevated LDH",
                "Elevated CK-MB", "Metabolic acidosis"
            ],
            radiology: [
                "Cardiomegaly on CXR", "Pulmonary edema on CXR",
                "Pericardial effusion on echo", "Wall motion abnormality on echo",
                "Valvular abnormality on echo", "Pleural effusion on CXR",
                "Aortic dilation on CT", "Reduced ejection fraction on echo"
            ]
        },
        renal: {
            symptoms: [
                "Flank pain", "Dysuria", "Hematuria",
                "Urinary frequency", "Urinary urgency", "Nausea",
                "Vomiting", "Oliguria", "Polyuria",
                "Suprapubic pain"
            ],
            signs: [
                "Costovertebral angle tenderness", "Fever",
                "Suprapubic tenderness", "Hypertension",
                "Peripheral edema", "Dehydration",
                "Tachycardia"
            ],
            labs: [
                "Elevated creatinine", "Elevated BUN",
                "Leukocytosis", "Pyuria",
                "Hematuria on urinalysis", "Proteinuria",
                "Positive urine culture", "Elevated WBC",
                "Urine WBC casts"
            ],
            radiology: [
                "Hydronephrosis on US", "Renal calculus on CT",
                "Perinephric stranding on CT", "Bladder wall thickening on US",
                "Ureteral dilation on CT", "Renal cortical scarring on US"
            ]
        },
        neuro: {
            symptoms: [
                "Headache", "Altered mental status", "Seizures",
                "Focal weakness", "Vision changes", "Neck stiffness",
                "Photophobia", "Dizziness", "Nausea",
                "Vomiting"
            ],
            signs: [
                "Nuchal rigidity", "Kernig's sign", "Brudzinski's sign",
                "Focal neurological deficit", "Papilledema",
                "Hemiparesis", "Aphasia", "GCS < 15",
                "Fever", "Cranial nerve palsy"
            ],
            labs: [
                "Elevated WBC", "Positive CSF culture",
                "Elevated CSF protein", "Decreased CSF glucose",
                "Elevated CSF WBC", "Xanthochromia in CSF",
                "Elevated ESR", "Hyperglycemia",
                "Elevated CSF opening pressure", "Positive blood culture"
            ],
            radiology: [
                "CT hyperdense lesion", "MRI diffusion restriction",
                "Cerebral edema on CT", "Midline shift on CT",
                "Subarachnoid hemorrhage on CT", "CT angiography vessel occlusion",
                "Meningeal enhancement on MRI", "CT angiography aneurysm",
                "Loss of gray-white differentiation on CT"
            ]
        },
        endo: {
            symptoms: [
                "Polyuria", "Polydipsia", "Weight loss",
                "Fatigue", "Heat intolerance", "Tremor",
                "Nausea", "Vomiting", "Abdominal pain",
                "Palpitations"
            ],
            signs: [
                "Tachycardia", "Kussmaul breathing", "Dehydration",
                "Exophthalmos", "Goiter", "Altered mental status",
                "Warm moist skin", "Lid lag", "Hypotension",
                "Fever"
            ],
            labs: [
                "Hyperglycemia", "Elevated HbA1c",
                "Metabolic acidosis", "Elevated anion gap",
                "Ketonuria", "Ketonemia",
                "Decreased TSH", "Elevated free T4",
                "Hyponatremia", "Elevated TSH"
            ],
            radiology: [
                "Thyroid nodule on US", "Diffusely increased thyroid uptake scan"
            ]
        },
        msk: {
            symptoms: [
                "Joint pain", "Joint swelling", "Limited range of motion",
                "Fever", "Morning stiffness", "Back pain",
                "Muscle weakness", "Redness over joint"
            ],
            signs: [
                "Joint effusion", "Warmth over joint",
                "Erythema over joint", "Fever",
                "Restricted range of motion", "Tenderness on palpation",
                "Crepitus", "Soft tissue swelling"
            ],
            labs: [
                "Elevated WBC", "Elevated ESR", "Elevated CRP",
                "Elevated uric acid", "Positive synovial fluid culture",
                "Synovial fluid WBC > 50,000", "Positive rheumatoid factor",
                "Positive anti-CCP", "Elevated procalcitonin"
            ],
            radiology: [
                "Joint effusion on US", "Joint space narrowing on X-ray",
                "Erosions on X-ray", "MRI bone marrow edema",
                "Soft tissue swelling on X-ray", "Periosteal reaction on X-ray"
            ]
        }
    },
    diseases: [
        // ==============================
        // GASTROINTESTINAL (5 diseases)
        // ==============================
        {
            name: "Acute Appendicitis",
            system: "git",
            medscapeLink: "https://emedicine.medscape.com/article/773895-overview",
            keyFeatures: [
                "Abdominal pain", "McBurney's point tenderness",
                "Rebound tenderness", "Fever"
            ],
            possibleFeatures: [
                "Nausea", "Vomiting", "Anorexia",
                "Guarding", "Diarrhea"
            ],
            labs: ["Leukocytosis", "Elevated CRP"],
            radiology: ["Thickened appendix on US"]
        },
        {
            name: "GERD (Gastroesophageal Reflux Disease)",
            system: "git",
            medscapeLink: "https://emedicine.medscape.com/article/176595-overview",
            keyFeatures: [
                "Heartburn", "Dysphagia"
            ],
            possibleFeatures: [
                "Cough", "Nausea", "Chest pain",
                "Bloating", "Hematemesis"
            ],
            labs: [],
            radiology: []
        },
        {
            name: "Acute Cholecystitis",
            system: "git",
            medscapeLink: "https://emedicine.medscape.com/article/171886-overview",
            keyFeatures: [
                "Right upper quadrant tenderness", "Murphy's sign",
                "Fever", "Abdominal pain"
            ],
            possibleFeatures: [
                "Nausea", "Vomiting", "Jaundice",
                "Anorexia", "Guarding"
            ],
            labs: [
                "Leukocytosis", "Elevated ALP",
                "Elevated bilirubin", "Elevated AST/ALT"
            ],
            radiology: [
                "Gallstones on US", "GB wall thickening on US",
                "Pericholecystic fluid on US"
            ]
        },
        {
            name: "Acute Pancreatitis",
            system: "git",
            medscapeLink: "https://emedicine.medscape.com/article/181364-overview",
            keyFeatures: [
                "Abdominal pain", "Elevated lipase",
                "Nausea", "Vomiting"
            ],
            possibleFeatures: [
                "Fever", "Guarding", "Abdominal distension",
                "Jaundice", "Diarrhea"
            ],
            labs: [
                "Elevated lipase", "Elevated amylase",
                "Leukocytosis", "Elevated AST/ALT",
                "Elevated bilirubin"
            ],
            radiology: [
                "Pancreatic inflammation on CT"
            ]
        },
        {
            name: "Small Bowel Obstruction",
            system: "git",
            medscapeLink: "https://emedicine.medscape.com/article/774140-overview",
            keyFeatures: [
                "Abdominal pain", "Vomiting",
                "Abdominal distension", "Constipation"
            ],
            possibleFeatures: [
                "Nausea", "Anorexia",
                "Absent bowel sounds", "Fever"
            ],
            labs: [
                "Leukocytosis", "Elevated lactate",
                "Metabolic alkalosis"
            ],
            radiology: [
                "Dilated bowel loops", "Air-fluid levels on X-ray",
                "Transition point on CT"
            ]
        },

        // ==============================
        // RESPIRATORY (4 diseases)
        // ==============================
        {
            name: "Pneumonia",
            system: "resp",
            medscapeLink: "https://emedicine.medscape.com/article/300157-overview",
            keyFeatures: [
                "Cough", "Fever", "Crackles",
                "Shortness of breath"
            ],
            possibleFeatures: [
                "Pleuritic chest pain", "Tachypnea",
                "Hemoptysis", "Sputum production"
            ],
            labs: [
                "Elevated WBC", "Hypoxemia (low PaO2)",
                "Positive sputum culture", "Elevated procalcitonin"
            ],
            radiology: [
                "Lobar infiltrate", "Air bronchograms",
                "Pleural effusion"
            ]
        },
        {
            name: "Pulmonary Embolism",
            system: "resp",
            medscapeLink: "https://emedicine.medscape.com/article/300901-overview",
            keyFeatures: [
                "Pleuritic chest pain", "Shortness of breath",
                "Tachypnea", "Tachycardia"
            ],
            possibleFeatures: [
                "Hemoptysis", "Syncope", "Hypotension",
                "Cyanosis", "Leg swelling"
            ],
            labs: [
                "Elevated D-dimer", "Hypoxemia (low PaO2)",
                "Respiratory alkalosis", "Elevated troponin"
            ],
            radiology: [
                "CT angiography filling defect",
                "Hampton hump on CXR", "Westermark sign on CXR",
                "Pleural effusion"
            ]
        },
        {
            name: "Pneumothorax",
            system: "resp",
            medscapeLink: "https://emedicine.medscape.com/article/424547-overview",
            keyFeatures: [
                "Chest pain", "Shortness of breath",
                "Decreased breath sounds"
            ],
            possibleFeatures: [
                "Tachypnea", "Cyanosis",
                "Tracheal deviation", "Tachycardia",
                "Hypotension"
            ],
            labs: [
                "Hypoxemia (low PaO2)"
            ],
            radiology: [
                "Pneumothorax on CXR", "Mediastinal shift on CXR"
            ]
        },
        {
            name: "Acute Asthma Exacerbation",
            system: "resp",
            medscapeLink: "https://emedicine.medscape.com/article/296301-overview",
            keyFeatures: [
                "Wheezing", "Shortness of breath",
                "Cough", "Accessory muscle use"
            ],
            possibleFeatures: [
                "Chest pain", "Tachypnea",
                "Cyanosis", "Tachycardia"
            ],
            labs: [
                "Hypoxemia (low PaO2)", "Respiratory alkalosis"
            ],
            radiology: [
                "Hyperinflation on CXR"
            ]
        },

        // ==============================
        // CARDIOVASCULAR (3 diseases)
        // ==============================
        {
            name: "Acute Myocardial Infarction",
            system: "cvs",
            medscapeLink: "https://emedicine.medscape.com/article/155919-overview",
            keyFeatures: [
                "Chest pain", "Diaphoresis",
                "Elevated troponin", "ECG ST elevation"
            ],
            possibleFeatures: [
                "Shortness of breath", "Nausea",
                "Palpitations", "Syncope",
                "Hypotension", "S4 gallop"
            ],
            labs: [
                "Elevated troponin", "ECG ST elevation",
                "ECG ST depression", "Elevated CK-MB",
                "Elevated BNP"
            ],
            radiology: [
                "Wall motion abnormality on echo"
            ]
        },
        {
            name: "Congestive Heart Failure",
            system: "cvs",
            medscapeLink: "https://emedicine.medscape.com/article/163062-overview",
            keyFeatures: [
                "Shortness of breath", "Orthopnea",
                "Peripheral edema", "Jugular venous distension",
                "S3 gallop"
            ],
            possibleFeatures: [
                "Paroxysmal nocturnal dyspnea", "Cough",
                "Fatigue", "Tachycardia", "Leg swelling"
            ],
            labs: [
                "Elevated BNP", "Elevated creatinine",
                "Hyponatremia"
            ],
            radiology: [
                "Cardiomegaly on CXR", "Pulmonary edema on CXR",
                "Pleural effusion on CXR", "Reduced ejection fraction on echo"
            ]
        },
        {
            name: "Acute Pericarditis",
            system: "cvs",
            medscapeLink: "https://emedicine.medscape.com/article/156951-overview",
            keyFeatures: [
                "Chest pain", "Pericardial friction rub",
                "ECG ST elevation"
            ],
            possibleFeatures: [
                "Fever", "Shortness of breath",
                "Tachycardia", "Dizziness"
            ],
            labs: [
                "Elevated CRP", "Elevated ESR",
                "Elevated troponin"
            ],
            radiology: [
                "Pericardial effusion on echo"
            ]
        },

        // ==============================
        // RENAL / UROLOGICAL (2 diseases)
        // ==============================
        {
            name: "Acute Pyelonephritis",
            system: "renal",
            medscapeLink: "https://emedicine.medscape.com/article/245559-overview",
            keyFeatures: [
                "Flank pain", "Fever",
                "Costovertebral angle tenderness", "Dysuria"
            ],
            possibleFeatures: [
                "Nausea", "Vomiting",
                "Urinary frequency", "Urinary urgency",
                "Hematuria"
            ],
            labs: [
                "Leukocytosis", "Pyuria",
                "Positive urine culture", "Elevated WBC",
                "Urine WBC casts"
            ],
            radiology: [
                "Perinephric stranding on CT"
            ]
        },
        {
            name: "Nephrolithiasis (Renal Colic)",
            system: "renal",
            medscapeLink: "https://emedicine.medscape.com/article/437096-overview",
            keyFeatures: [
                "Flank pain", "Hematuria"
            ],
            possibleFeatures: [
                "Nausea", "Vomiting",
                "Dysuria", "Urinary urgency",
                "Costovertebral angle tenderness"
            ],
            labs: [
                "Hematuria on urinalysis"
            ],
            radiology: [
                "Renal calculus on CT", "Hydronephrosis on US",
                "Ureteral dilation on CT"
            ]
        },

        // ==============================
        // NEUROLOGICAL (3 diseases)
        // ==============================
        {
            name: "Acute Ischemic Stroke",
            system: "neuro",
            medscapeLink: "https://emedicine.medscape.com/article/1916852-overview",
            keyFeatures: [
                "Focal weakness", "Focal neurological deficit",
                "Aphasia", "Hemiparesis"
            ],
            possibleFeatures: [
                "Altered mental status", "Vision changes",
                "Headache", "Dizziness",
                "Seizures", "GCS < 15"
            ],
            labs: [
                "Hyperglycemia"
            ],
            radiology: [
                "MRI diffusion restriction",
                "CT angiography vessel occlusion",
                "Loss of gray-white differentiation on CT"
            ]
        },
        {
            name: "Bacterial Meningitis",
            system: "neuro",
            medscapeLink: "https://emedicine.medscape.com/article/961497-overview",
            keyFeatures: [
                "Headache", "Fever",
                "Nuchal rigidity", "Altered mental status"
            ],
            possibleFeatures: [
                "Photophobia", "Seizures",
                "Kernig's sign", "Brudzinski's sign",
                "Vomiting", "Cranial nerve palsy"
            ],
            labs: [
                "Elevated CSF WBC", "Positive CSF culture",
                "Elevated CSF protein", "Decreased CSF glucose",
                "Leukocytosis", "Elevated CSF opening pressure"
            ],
            radiology: [
                "Meningeal enhancement on MRI",
                "Cerebral edema on CT"
            ]
        },
        {
            name: "Subarachnoid Hemorrhage",
            system: "neuro",
            medscapeLink: "https://emedicine.medscape.com/article/1164341-overview",
            keyFeatures: [
                "Headache", "Nuchal rigidity",
                "Altered mental status"
            ],
            possibleFeatures: [
                "Vomiting", "Photophobia",
                "Seizures", "Focal neurological deficit",
                "GCS < 15", "Vision changes"
            ],
            labs: [
                "Xanthochromia in CSF",
                "Elevated CSF opening pressure"
            ],
            radiology: [
                "Subarachnoid hemorrhage on CT",
                "CT angiography aneurysm"
            ]
        },

        // ==============================
        // ENDOCRINE (2 diseases)
        // ==============================
        {
            name: "Diabetic Ketoacidosis (DKA)",
            system: "endo",
            medscapeLink: "https://emedicine.medscape.com/article/118361-overview",
            keyFeatures: [
                "Polyuria", "Polydipsia",
                "Kussmaul breathing", "Hyperglycemia",
                "Metabolic acidosis", "Elevated anion gap"
            ],
            possibleFeatures: [
                "Nausea", "Vomiting",
                "Abdominal pain", "Altered mental status",
                "Dehydration", "Fatigue",
                "Tachycardia"
            ],
            labs: [
                "Hyperglycemia", "Metabolic acidosis",
                "Elevated anion gap", "Ketonuria",
                "Ketonemia", "Hyponatremia"
            ],
            radiology: []
        },
        {
            name: "Hyperthyroidism (Graves' Disease)",
            system: "endo",
            medscapeLink: "https://emedicine.medscape.com/article/120619-overview",
            keyFeatures: [
                "Heat intolerance", "Tachycardia",
                "Tremor", "Weight loss",
                "Goiter", "Exophthalmos"
            ],
            possibleFeatures: [
                "Palpitations", "Fatigue",
                "Warm moist skin", "Lid lag",
                "Diarrhea"
            ],
            labs: [
                "Decreased TSH", "Elevated free T4"
            ],
            radiology: [
                "Diffusely increased thyroid uptake scan"
            ]
        },

        // ==============================
        // MUSCULOSKELETAL (1 disease)
        // ==============================
        {
            name: "Septic Arthritis",
            system: "msk",
            medscapeLink: "https://emedicine.medscape.com/article/236299-overview",
            keyFeatures: [
                "Joint pain", "Joint swelling",
                "Warmth over joint", "Fever",
                "Restricted range of motion"
            ],
            possibleFeatures: [
                "Erythema over joint", "Fatigue",
                "Joint effusion", "Tenderness on palpation"
            ],
            labs: [
                "Elevated WBC", "Elevated ESR",
                "Elevated CRP", "Synovial fluid WBC > 50,000",
                "Positive synovial fluid culture"
            ],
            radiology: [
                "Joint effusion on US",
                "Soft tissue swelling on X-ray"
            ]
        }
    ]
};
        
