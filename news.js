const LATEST_NEWS_INDEX = 6;

const NEWS_HTML = `
<div style="background: var(--surface); border: 1px solid var(--divider); border-radius: 16px; padding: 20px; margin-bottom: 16px; box-shadow: 0 4px 10px rgba(0,0,0,0.04);">
    <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: bold; margin-bottom: 6px; text-transform: uppercase;">22 March 2026</div>
    <div style="font-size: 1.25rem; font-weight: 800; color: var(--primary-dark); margin-bottom: 12px;">AI-Powered DDx Search & Quiz Mode 🧠</div>
    <div style="font-size: 1.05rem; color: var(--text-main); line-height: 1.5;">
        <ul style="margin: 0; padding-left: 20px; margin-bottom: 14px; color: var(--text-muted);">
            <li style="margin-bottom: 6px;"><strong>DDx AI Search:</strong> Describe a clinical presentation and get an AI-generated differential diagnosis list instantly — powered by your own personal API key.</li>
            <li style="margin-bottom: 6px;"><strong>Quiz Me Mode:</strong> Test yourself with board-style clinical scenarios. Choose your difficulty (Easy, Intermediate, Hard) or let <strong>Incremental</strong> mode ramp it up as your streak grows 🔥</li>
            <li style="margin-bottom: 6px;"><strong>Hints & Explanations:</strong> Stuck? Grab a clinical hint before answering, then review a full explanation afterwards to reinforce your learning.</li>
            <li><strong>Your Key, Your Privacy:</strong> All AI features run through your own <strong>Groq API key</strong> — free to get, and your data never passes through our servers.</li>
        </ul>
        <div style="font-size: 0.9rem; background: var(--bg); padding: 10px; border-radius: 10px; border: 1px dashed var(--primary); text-align: center; color: var(--primary-dark); font-weight: 600;">
            🔑 Add your free Groq API key to activate DDx & Quiz features.
        </div>
    </div>
</div>
<div style="background: var(--surface); border: 1px solid var(--divider); border-radius: 16px; padding: 20px; margin-bottom: 16px; box-shadow: 0 4px 10px rgba(0,0,0,0.04);">
    <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: bold; margin-bottom: 6px; text-transform: uppercase;">16 March 2026</div>
    <div style="font-size: 1.25rem; font-weight: 800; color: var(--primary-dark); margin-bottom: 12px;">Smart Filters & Global Search 🔍</div>           
    <div style="font-size: 1.05rem; color: var(--text-main); line-height: 1.5;">
        <ul style="margin: 0; padding-left: 20px; margin-bottom: 14px; color: var(--text-muted);">
            <li style="margin-bottom: 6px;"><strong>Advanced Patient Filters:</strong> Instantly isolate patients with abnormal vitals, those with pending notes, or view only measured/empty profiles using the new filter chips.</li>
            <li style="margin-bottom: 6px;"><strong>Global Name Search:</strong> Find any patient across all rooms instantly by typing their name.</li>
            <li><strong>Seamless Toolbar:</strong> The new search and filter tools are hidden behind an elegant 🔎 button to keep your interface clean and focused.</li>
        </ul>
    </div>
</div>
<div style="background: var(--surface); border: 1px solid var(--divider); border-radius: 16px; padding: 20px; margin-bottom: 16px; box-shadow: 0 4px 10px rgba(0,0,0,0.04);">
    <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: bold; margin-bottom: 6px; text-transform: uppercase;">15 March 2026</div>
    <div style="font-size: 1.25rem; font-weight: 800; color: var(--primary-dark); margin-bottom: 12px;">Tutorials, Management & Quick Actions ✨</div>           
    <div style="font-size: 1.05rem; color: var(--text-main); line-height: 1.5;">
        <ul style="margin: 0; padding-left: 20px; margin-bottom: 14px; color: var(--text-muted);">
            <li style="margin-bottom: 6px;"><strong>Starter Tutorial:</strong> We've added a new guided tutorial for the main menu to help you navigate the app effortlessly.</li>
            <li style="margin-bottom: 6px;"><strong>Manage Patients Menu:</strong> Take full control! You can now easily reorder, copy, reset, and delete vitals, patients, and rooms.</li>
            <li><strong>Quick Action Button:</strong> A new floating ✏️ button keeps your essential actions always within reach, no matter where you scroll.</li>
        </ul>
    </div>
</div>
<div style="background: var(--surface); border: 1px solid var(--divider); border-radius: 16px; padding: 20px; margin-bottom: 16px; box-shadow: 0 4px 10px rgba(0,0,0,0.04);">
    <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: bold; margin-bottom: 6px; text-transform: uppercase;">14 March 2026</div>
    <div style="font-size: 1.25rem; font-weight: 800; color: var(--primary-dark); margin-bottom: 12px;">New Tools Toolbar 🛠️</div>           
    <div style="font-size: 1.05rem; color: var(--text-main); line-height: 1.5;">
        <ul style="margin: 0; padding-left: 20px; margin-bottom: 14px; color: var(--text-muted);">
            <li style="margin-bottom: 6px;"><strong>Scrollable Toolbar:</strong> The old Toolbox is gone! All your favorite tools (Medscape, DDx, Labs, Tasks) are now instantly accessible in the new scrollable toolbar under the header. 🚀</li>
            <li><strong>Customizable Layout:</strong> Go to <strong>Settings ⚙️</strong> to reorder tools, hide their text to save space, or hide them completely to fit your workflow!</li>
        </ul>
    </div>
</div>
<div style="background: var(--surface); border: 1px solid var(--divider); border-radius: 16px; padding: 20px; margin-bottom: 16px; box-shadow: 0 4px 10px rgba(0,0,0,0.04);">
    <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: bold; margin-bottom: 6px; text-transform: uppercase;">12 March 2026</div>
    <div style="font-size: 1.25rem; font-weight: 800; color: var(--primary-dark); margin-bottom: 12px;">Trends & Fixes 📈</div>           
    <div style="font-size: 1.05rem; color: var(--text-main); line-height: 1.5;">
        <ul style="margin: 0; padding-left: 20px; margin-bottom: 14px; color: var(--text-muted);">
            <li style="margin-bottom: 6px;"><strong>Vitals Trend Line:</strong> See previous entries instantly inside the numpad! ⬆️⬇️</li>
            <li><strong>BP Updates:</strong> Smoother, auto-shifting blood pressure inputs with bug fixes 🐛.</li>
        </ul>
        <div style="font-size: 0.9rem; background: var(--bg); padding: 10px; border-radius: 10px; border: 1px dashed var(--primary); text-align: center; color: var(--primary-dark); font-weight: 600;">
            🙏 Special thanks to <strong>Dada</strong>, <strong>Bolbol</strong> & <strong>Doola</strong> for the support!
        </div>
    </div>
</div>
`;
