const LATEST_NEWS_INDEX = 9;

const NEWS_HTML = `
<div style="font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; gap: 24px; padding: 5px;">

    <!-- LATEST UPDATE: 29 MARCH -->
    <div style="border-left: 2px solid #10b981; padding-left: 12px; position: relative;">
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span style="font-size: 0.7rem; font-weight: 700; color: #059669; text-transform: uppercase; letter-spacing: 0.05em;">29 March 2026</span>
            <span style="background: #fef3c7; color: #92400e; font-size: 0.6rem; padding: 1px 6px; border-radius: 12px; font-weight: 800; border: 1px solid #f59e0b;">BETA</span>
        </div>
        <h3 style="margin: 0 0 8px 0; font-size: 1.1rem; color: var(--primary-dark); font-weight: 800;">Smart Hx Sheet & Patient Analysis 📄</h3>
        <p style="margin: 0 0 12px 0; font-size: 0.95rem; color: var(--text-main); line-height: 1.4;">
            A full clinical history engine! Document complaints, past history, and physical exams using structured templates. Use <strong>Analyze Patient</strong> to send a complete summary to the AI for a deep-dive DDx.
        </p>
        <div style="font-size: 0.8rem; background: #fffbeb; padding: 8px 12px; border-radius: 10px; border: 1px dashed #f59e0b; color: #92400e; font-weight: 600; display: inline-block;">
            ⚠️ <strong>Note:</strong> These features are currently <strong>under development</strong>. 
        </div>
    </div>

    <!-- PREVIOUS UPDATES -->
    <div style="border-left: 2px solid var(--divider); padding-left: 12px;">
        <div style="font-size: 0.7rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px;">22 March 2026</div>
        <h3 style="margin: 0 0 8px 0; font-size: 1.05rem; color: var(--text-main); font-weight: 700;">AI DDx Search & Quiz Mode 🧠</h3>
        <p style="margin: 0 0 12px 0; font-size: 0.95rem; color: var(--text-muted); line-height: 1.4;">
            Get instant AI-generated differentials or challenge yourself with <strong>Incremental Mode</strong> board scenarios 🔥. 
        </p>
        <div style="font-size: 0.8rem; background: var(--bg); padding: 8px 12px; border-radius: 10px; border: 1px dashed var(--divider); color: var(--text-muted); font-weight: 600; display: inline-block;">
            🔑 Add your free <strong>Gemini API key</strong> to activate.
        </div>
    </div>

    <div style="border-left: 2px solid var(--divider); padding-left: 12px;">
        <div style="font-size: 0.7rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px;">16 March 2026</div>
        <h3 style="margin: 0 0 6px 0; font-size: 1.05rem; color: var(--text-main); font-weight: 700;">Smart Filters & Global Search 🔍</h3>
        <p style="margin: 0; font-size: 0.95rem; color: var(--text-muted); line-height: 1.4;">
            Isolate abnormal vitals with <strong>Filter Chips</strong> or find patients instantly by name. Tucked behind the 🔎 button.
        </p>
    </div>

    <div style="border-left: 2px solid var(--divider); padding-left: 12px;">
        <div style="font-size: 0.7rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px;">15 March 2026</div>
        <h3 style="margin: 0 0 6px 0; font-size: 1.05rem; color: var(--text-main); font-weight: 700;">Tutorials & Quick Actions ✨</h3>
        <p style="margin: 0; font-size: 0.95rem; color: var(--text-muted); line-height: 1.4;">
            Navigate easily with our <strong>Starter Tutorial</strong> and the floating ⚡ button for essential actions.
        </p>
    </div>

    <div style="border-left: 2px solid var(--divider); padding-left: 12px;">
        <div style="font-size: 0.7rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px;">14 March 2026</div>
        <h3 style="margin: 0 0 6px 0; font-size: 1.05rem; color: var(--text-main); font-weight: 700;">New Tools Toolbar 🛠️</h3>
        <p style="margin: 0; font-size: 0.95rem; color: var(--text-muted); line-height: 1.4;">
            Access Medscape and Labs in a <strong>Scrollable Toolbar</strong> 🚀. Customize layout or hide text in <strong>Settings ⚙️</strong>.
        </p>
    </div>

    <div style="border-left: 2px solid var(--divider); padding-left: 12px;">
        <div style="font-size: 0.7rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px;">12 March 2026</div>
        <h3 style="margin: 0 0 6px 0; font-size: 1.05rem; color: var(--text-main); font-weight: 700;">Trends & Fixes 📈</h3>
        <p style="margin: 0 0 14px 0; font-size: 0.95rem; color: var(--text-muted); line-height: 1.4;">
            Vitals Trend lines in the numpad ⬆️⬇️. Smoother BP inputs with bug fixes 🐛.
        </p>
        <div style="font-size: 0.8rem; background: #ecfdf5; padding: 8px 12px; border-radius: 8px; border: 1px solid #10b981; color: #065f46; font-weight: 700; text-align: center; box-shadow: 0 2px 4px rgba(16,185,129,0.1);">
            🙏 Special thanks to Dada, Bolbol & Doola!
        </div>
    </div>

</div>
`;