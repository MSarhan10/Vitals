 
const LATEST_NEWS_INDEX = 3;

const NEWS_HTML = `
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
            <li style="margin-bottom: 6px;"><strong>Vitals Trend Line:</strong> See previous entries instantly inside the numpad! ⬆️⬇️
            <li><strong>BP Updates:</strong> Smoother, auto-shifting blood pressure inputs with bug fixes 🩸.</li>
        </ul>
        <div style="font-size: 0.9rem; background: var(--bg); padding: 10px; border-radius: 10px; border: 1px dashed var(--primary); text-align: center; color: var(--primary-dark); font-weight: 600;">
            🙌 Special thanks to <strong>Dada</strong>, <strong>Bolbol</strong> & <strong>Doola</strong> for the support!
        </div>
    </div>
</div>
<div style="background: var(--surface); border: 1px solid var(--divider); border-radius: 16px; padding: 20px; margin-bottom: 16px; box-shadow: 0 4px 10px rgba(0,0,0,0.04);">
    <div style="font-size: 0.85rem; color: var(--text-muted); font-weight: bold; margin-bottom: 6px; text-transform: uppercase;">10 March 2026</div>
    <div style="font-size: 1.25rem; font-weight: 800; color: var(--primary-dark); margin-bottom: 10px;">Welcome to MiriMate Beta! 🎉</div>
    <div style="font-size: 1.05rem; color: var(--text-main); line-height: 1.5;">
        Thanks for using MiriMate. We just added swipeable tasks, floating timers, and an extensive Lab Values reference sheet! Stay tuned for more updates.
    </div>
</div>
`;