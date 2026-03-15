 
const LAB_DATA = [
            {
                icon: "🩺", category: "Vital Signs", subtitle: "Baseline Assessment",
                catNote: "Blood pressure ranges reflect current AHA/ACC guidelines.",
                tests: [
                    { name: "Blood Pressure (Systolic)", range: "90–119 mmHg", note: "< 90 is hypotension\n120–129 is \"Elevated\"\n≥ 130 is Hypertension" },
                    { name: "Blood Pressure (Diastolic)", range: "60–79 mmHg", note: "< 60 is hypotension\n≥ 80 is Hypertension" },
                    { name: "Heart Rate", range: "60–100 BPM", note: "< 60: Bradycardia\n> 100: Tachycardia" },
                    { name: "Respirations", range: "12–20 breaths/min", note: "< 12: Bradypnea\n> 20: Tachypnea" },
                    { name: "Oxygen Saturation (SpO2)", range: "95%–100%", note: "Under 90% is a clinical emergency (hypoxemia)." },
                    { name: "Temperature", range: "96.8°F–99.5°F · 36.0°C–37.5°C", note: "Varies slightly by route (oral, tympanic, rectal)." }
                ]
            },
            {
                icon: "🩸", category: "Complete Blood Count", subtitle: "CBC — Hematology", catNote: null,
                tests: [
                    { name: "WBC", range: "4,500–11,000 cells/mcL", note: "↑ Infection/inflammation\n↓ Immunosuppression" },
                    { name: "RBC", male: "4.3–5.9 x10⁶/mcL", female: "3.5–5.0 x10⁶/mcL", note: "Oxygen-carrying capacity." },
                    { name: "Platelets (PLT)", range: "150,000–450,000 /mcL", note: "Critical: < 50,000 → Severe risk of bleeding\nCritical: > 1,000,000 → Severe risk of clots" },
                    { name: "Hemoglobin (Hgb)", male: "13.5–17.5 g/dL", female: "12.0–15.5 g/dL", note: "Core protein that carries oxygen." },
                    { name: "Hematocrit (HCT)", male: "41%–50%", female: "36%–48%", note: "Roughly 3x the Hemoglobin value." }
                ]
            },
            {
                icon: "🧪", category: "Basic Metabolic Panel", subtitle: "BMP — Chemistry & Electrolytes", catNote: null,
                tests: [
                    { name: "Sodium (Na)", range: "135–145 mEq/L", note: "Extracellular; crucial for fluid balance & neuro function." },
                    { name: "Potassium (K)", range: "3.5–5.0 mEq/L", note: "Intracellular; crucial for cardiac conduction." },
                    { name: "Chloride (Cl)", range: "96–106 mEq/L", note: "Follows sodium." },
                    { name: "Calcium (Ca) — Total", range: "8.6–10.3 mg/dL", note: "Muscle contraction & bone health." },
                    { name: "Magnesium (Mg)", range: "1.7–2.2 mg/dL", note: "Required for K+ and Ca++ absorption/function." },
                    { name: "Phosphorus (P)", range: "2.5–4.5 mg/dL", note: "Inverse relationship with Calcium." },
                    { name: "Albumin", range: "3.4–5.4 g/dL", note: "Maintains oncotic pressure; indicates chronic liver/nutrition status." },
                    { name: "Total Protein", range: "6.0–8.3 g/dL", note: "Combined albumin and globulins." }
                ]
            },
            {
                icon: "💧", category: "Renal Function", subtitle: "Kidney & Fluid Balance", catNote: null,
                tests: [
                    { name: "BUN", range: "7–20 mg/dL", note: "Influenced by hydration and protein intake." },
                    { name: "Creatinine", male: "0.7–1.3 mg/dL", female: "0.5–1.1 mg/dL", note: "Most specific indicator of kidney function." },
                    { name: "Specific Gravity", range: "1.005–1.030", note: "1.005 (dilute) → 1.030 (concentrated/dehydrated)" },
                    { name: "GFR", range: "> 90 mL/min/1.73m²", note: "Critical: < 60 indicates kidney disease\n< 15 is kidney failure" }
                ]
            },
            {
                icon: "🛡️", category: "Liver Function", subtitle: "LFT — Hepatic Function", catNote: null,
                tests: [
                    { name: "ALT", male: "10–40 U/L", female: "7–35 U/L", note: "Most specific to liver damage." },
                    { name: "AST", range: "8–48 U/L", note: "Found in liver, but also heart and skeletal muscle." },
                    { name: "ALP", range: "40–120 U/L", note: "Elevated in biliary tract obstruction and bone growth/disease." },
                    { name: "Total Bilirubin", range: "0.1–1.2 mg/dL", note: "Breakdown product of RBCs. Elevated = Jaundice." }
                ]
            },
            {
                icon: "🍽️", category: "Pancreas", subtitle: "Digestive Enzymes", catNote: null,
                tests: [
                    { name: "Amylase", range: "30–110 U/L", note: "Breakdown of starches. Peaks early in pancreatitis." },
                    { name: "Lipase", range: "0–160 U/L", note: "Breakdown of fats. Most specific for acute pancreatitis." }
                ]
            },
            {
                icon: "🍬", category: "Glucose & HbA1C", subtitle: "Endocrine / Blood Sugar",
                catNote: "Values reflect current American Diabetes Association (ADA) criteria.",
                tests: [
                    { name: "Fasting Glucose", range: "70–99 mg/dL", note: "100–125 mg/dL is Impaired Fasting Glucose (Pre-diabetes)." },
                    { name: "Casual/Random Glucose", range: "< 200 mg/dL", note: "≥ 200 mg/dL with symptoms indicates Diabetes." },
                    { name: "HbA1C — Non-Diabetic", range: "< 5.7%", note: "Average blood sugar control over 3 months (lifespan of RBC)." },
                    { name: "HbA1C — Pre-Diabetic", range: "5.7%–6.4%", note: "Increased risk of developing diabetes; lifestyle changes needed." },
                    { name: "HbA1C — Diabetic", range: "≥ 6.5%", note: "Diagnostic threshold for Diabetes Mellitus." }
                ]
            },
            {
                icon: "🫀", category: "Lipid Panel", subtitle: "Cardiovascular Risk", catNote: null,
                tests: [
                    { name: "Total Cholesterol", range: "< 200 mg/dL", note: "General overview of lipid levels." },
                    { name: "Triglycerides", range: "< 150 mg/dL", note: "Fat in the blood; highly impacted by recent diet/sugar." },
                    { name: "LDL (\"Bad\")", range: "< 100 mg/dL", note: "Lousy cholesterol. Goal is < 70 for patients with known CVD." },
                    { name: "HDL (\"Good\")", male: "> 40 mg/dL", female: "> 50 mg/dL", note: "Happy cholesterol. Goal is > 60 mg/dL for optimal protection." }
                ]
            },
            {
                icon: "🩹", category: "Coagulation", subtitle: "COAGs — Bleeding Times",
                catNote: "⚠️ The higher these numbers, the longer it takes to clot = ↑ risk of bleeding!",
                tests: [
                    { name: "PT", range: "11–13.5 seconds", note: "Evaluates extrinsic pathway." },
                    { name: "INR", range: "0.8–1.1", note: "Therapeutic on Warfarin: 2.0–3.0\nMechanical valves: 2.5–3.5" },
                    { name: "aPTT (PTT)", range: "25–35 seconds", note: "Therapeutic on Heparin: 50–80 seconds (1.5–2.5x normal)" }
                ]
            },
            {
                icon: "🫁", category: "ABGs", subtitle: "Respiratory & Acid-Base Balance",
                catNote: "ROME: Respiratory = Opposite, Metabolic = Equal\n• CO2 ↑ pH ↓ = Respiratory Acidosis\n• CO2 ↓ pH ↑ = Respiratory Alkalosis\n• HCO3 ↓ pH ↓ = Metabolic Acidosis\n• HCO3 ↑ pH ↑ = Metabolic Alkalosis",
                tests: [
                    { name: "pH", range: "7.35–7.45", note: "< 7.35 (Acidic) ← → > 7.45 (Alkalotic/Basic)" },
                    { name: "PaCO2", range: "35–45 mmHg", note: "> 45 (Acidic) ← → < 35 (Basic)\nRespiratory component" },
                    { name: "PaO2", range: "80–100 mmHg", note: "Oxygen dissolved in arterial blood plasma." },
                    { name: "HCO3 (Bicarbonate)", range: "22–26 mEq/L", note: "< 22 (Acidic) ← → > 26 (Basic)\nMetabolic/Kidney component" }
                ]
            },
            {
                icon: "📊", category: "Other Key Parameters", subtitle: "Neuro, Systemic & Physical", catNote: null,
                tests: [
                    { name: "Serum Osmolality", range: "275–295 mOsm/kg", note: "Concentration of particles in the blood. ↑ = dehydration." },
                    { name: "MAP (Mean Arterial Pressure)", range: "70–100 mmHg", note: "Must be ≥ 65 mmHg to perfuse vital organs." },
                    { name: "ICP (Intracranial Pressure)", range: "5–15 mmHg", note: "> 20 mmHg requires immediate intervention." },
                    { name: "BMI (Body Mass Index)", range: "18.5–24.9 kg/m²", note: "25–29.9 = Overweight\n≥ 30 = Obese" },
                    { name: "Glasgow Coma Scale (GCS)", range: "Best = 15", note: "Mild Brain Injury: 13–15\nModerate: 9–12\nSevere (Comatose): 3–8\nTip: \"Less than 8, intubate\"" }
                ]
            }
        ];
