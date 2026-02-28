import fs from 'fs';
const files = [
    'src/components/Fase2/DigitalSignature.tsx',
    'src/components/Fase2/FormBuilder.tsx',
    'src/components/Fase3/DashboardKPIs.tsx',
    'src/components/Fase4/WhiteLabelSettings.tsx'
];
files.forEach(f => {
    let text = fs.readFileSync(f, 'utf8');
    text = text.replace(/<Grid item xs={(\d+)} md={(\d+)}>/g, '<Grid size={{ xs: $1, md: $2 }}>');
    text = text.replace(/<Grid item xs={(\d+)}>/g, '<Grid size={{ xs: $1 }}>');
    fs.writeFileSync(f, text);
});
console.log('Fixes applied successfully');
