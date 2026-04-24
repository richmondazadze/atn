export default function Foundations() {
  const brandColors = [
    { hex: '#1A6B6B', name: 'Deep Teal',    role: 'Primary / CTA' },
    { hex: '#D4A853', name: 'Warm Gold',    role: 'Accent' },
    { hex: '#E8694A', name: 'Coral',        role: 'Energetic Accent' },
    { hex: '#7C5CBF', name: 'Violet',       role: 'Premium Signal' },
    { hex: '#7BC950', name: 'Status Green', role: 'Success / Status' },
  ];
  const surfaceColors = [
    { hex: '#E8F4F4', name: 'Surface Teal',   role: 'Info / Stat blocks' },
    { hex: '#FDF6E3', name: 'Surface Gold',   role: 'Callouts / Premium' },
    { hex: '#FDF0EC', name: 'Surface Coral',  role: 'Warning / Highlight' },
    { hex: '#F0EDF8', name: 'Surface Violet', role: 'Premium Highlight' },
    { hex: '#F4F8F8', name: 'Secondary',      role: 'Neutral Surface' },
  ];
  const neutralColors = [
    { hex: '#FAFAF8', name: 'Warm Canvas', role: 'Background' },
    { hex: '#1A1A1A', name: 'Near Black',  role: 'Primary Text' },
    { hex: '#6B7280', name: 'Muted',       role: 'Secondary Text' },
    { hex: '#DDE8E8', name: 'Border',      role: 'Teal-tinted Border' },
    { hex: '#DA291C', name: 'Error',       role: 'Destructive' },
  ];

  const ColorRow = ({ title, colors }: { title: string; colors: typeof brandColors }) => (
    <div>
      <h3 className="text-[11px] font-medium mb-4 text-[#6B7280] tracking-[1px] uppercase">{title}</h3>
      <div className="grid grid-cols-5 gap-6">
        {colors.map(({ hex, name, role }) => (
          <div key={hex}>
            <div className="h-20 rounded border border-[#DDE8E8]" style={{ backgroundColor: hex }} />
            <div className="mt-2 text-[12px] leading-[16px]">
              <div className="font-medium text-[#1A1A1A] font-mono">{hex}</div>
              <div className="font-medium text-[#1A1A1A]">{name}</div>
              <div className="text-[#6B7280]">{role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAF8] p-16" style={{ width: '1440px', margin: '0 auto' }}>
      <div className="max-w-7xl mx-auto" style={{ paddingLeft: '72px', paddingRight: '72px' }}>
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-[32px] leading-[40px] font-bold mb-2">00 • Foundations</h1>
          <p className="text-[#6B7280]">Access Terrain Network design system foundation</p>
        </div>

        {/* Color Palette */}
        <section className="mb-16">
          <h2 className="text-[24px] leading-[32px] font-semibold mb-8">Color Palette</h2>
          <div className="space-y-10">
            <ColorRow title="BRAND COLORS" colors={brandColors} />
            <ColorRow title="SURFACES" colors={surfaceColors} />
            <ColorRow title="NEUTRALS" colors={neutralColors} />
          </div>
        </section>

        {/* Typography */}
        <section className="mb-16">
          <h2 className="text-[24px] leading-[32px] font-semibold mb-8">Typography</h2>
          <div className="space-y-6  border border-[#DDE8E8] rounded p-8">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-[11px] text-[#6B7280] mb-2 tracking-[1px] uppercase">Display Font</div>
                <div
                  className="text-[24px] leading-[32px] font-semibold"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  Playfair Display
                </div>
                <div className="text-[13px] text-[#6B7280] mt-1">Headings h1–h3 · Serif · weights 400–700</div>
              </div>
              <div>
                <div className="text-[11px] text-[#6B7280] mb-2 tracking-[1px] uppercase">UI Font</div>
                <div
                  className="text-[24px] leading-[32px] font-semibold"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Inter
                </div>
                <div className="text-[13px] text-[#6B7280] mt-1">Body · UI · Labels · Buttons · weights 300–700</div>
              </div>
            </div>

            <div className="border-t border-[#DDE8E8] pt-6">
              <div className="text-[11px] text-[#6B7280] mb-4 tracking-[1px] uppercase">Type Scale</div>
              <div className="space-y-5">
                {[
                  { spec: '32/40 · Bold · Playfair',   font: "'Playfair Display', Georgia, serif", size: 'text-[32px] leading-[40px] font-bold',     label: 'Page Heading',                ls: '-0.3px' },
                  { spec: '24/32 · Semibold · Playfair', font: "'Playfair Display', Georgia, serif", size: 'text-[24px] leading-[32px] font-semibold', label: 'Section Heading',             ls: '-0.2px' },
                  { spec: '20/28 · Semibold · Playfair', font: "'Playfair Display', Georgia, serif", size: 'text-[20px] leading-[28px] font-semibold', label: 'Card Heading',                ls: '0px' },
                  { spec: '16/24 · Regular · Inter',   font: "'Inter', sans-serif",                  size: 'text-[16px] leading-[24px]',               label: 'Body text for paragraphs',    ls: '0px' },
                  { spec: '14/20 · Medium · Inter',    font: "'Inter', sans-serif",                  size: 'text-[14px] leading-[20px] font-medium',   label: 'UI labels and small body',    ls: '0px' },
                  { spec: '12/16 · Regular · Inter',   font: "'Inter', sans-serif",                  size: 'text-[12px] leading-[16px]',               label: 'Captions and metadata',       ls: '0px' },
                ].map(({ spec, font, size, label, ls }) => (
                  <div key={spec} className="flex items-baseline gap-8">
                    <div className="w-48 text-[12px] leading-[16px] text-[#6B7280] shrink-0">{spec}</div>
                    <div className={size} style={{ fontFamily: font, letterSpacing: ls }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Grid & Spacing */}
        <section>
          <h2 className="text-[24px] leading-[32px] font-semibold mb-8">Grid & Spacing</h2>
          <div className=" border border-[#DDE8E8] rounded p-8">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-[11px] text-[#6B7280] mb-2 tracking-[1px] uppercase">Desktop Grid</div>
                  <div className="text-[16px] leading-[24px]">12 columns</div>
                </div>
                <div>
                  <div className="text-[11px] text-[#6B7280] mb-2 tracking-[1px] uppercase">Margins</div>
                  <div className="text-[16px] leading-[24px]">72px left & right</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-[11px] text-[#6B7280] mb-2 tracking-[1px] uppercase">Gutters</div>
                  <div className="text-[16px] leading-[24px]">24px between columns</div>
                </div>
                <div>
                  <div className="text-[11px] text-[#6B7280] mb-2 tracking-[1px] uppercase">Base Unit</div>
                  <div className="text-[16px] leading-[24px]">8px spacing system</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-[11px] text-[#6B7280] mb-2 tracking-[1px] uppercase">Border Radius</div>
                  <div className="text-[16px] leading-[24px]">4px standard · 8px images · 50% avatars</div>
                </div>
                <div>
                  <div className="text-[11px] text-[#6B7280] mb-2 tracking-[1px] uppercase">Shadows</div>
                  <div className="text-[16px] leading-[24px]">Teal-tinted, subtle elevation only</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
