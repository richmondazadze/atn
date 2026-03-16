export default function Foundations() {
  return (
    <div className="min-h-screen bg-white p-16" style={{ width: '1440px', height: '900px', margin: '0 auto' }}>
      <div className="max-w-7xl mx-auto" style={{ paddingLeft: '72px', paddingRight: '72px' }}>
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-[32px] leading-[40px] font-semibold mb-2">00 • Foundations</h1>
          <p className="text-[#4B5563]">Access Terrain Network design system foundation</p>
        </div>

        {/* Color Palette */}
        <section className="mb-16">
          <h2 className="text-[24px] leading-[32px] font-semibold mb-8">Color Palette</h2>
          
          <div className="space-y-8">
            {/* Primary & Accent */}
            <div>
              <h3 className="text-[14px] leading-[20px] font-medium mb-4 text-[#4B5563]">PRIMARY & ACCENT</h3>
              <div className="grid grid-cols-5 gap-6">
                <div>
                  <div className="h-24 rounded border border-[#E5E7EB]" style={{ backgroundColor: '#7BC950' }}></div>
                  <div className="mt-2 text-[12px] leading-[16px]">
                    <div className="font-medium">#7BC950</div>
                    <div className="text-[#4B5563]">Primary/CTA</div>
                  </div>
                </div>
                <div>
                  <div className="h-24 rounded border border-[#E5E7EB]" style={{ backgroundColor: '#A0CCDA' }}></div>
                  <div className="mt-2 text-[12px] leading-[16px]">
                    <div className="font-medium">#A0CCDA</div>
                    <div className="text-[#4B5563]">Accent</div>
                  </div>
                </div>
                <div>
                  <div className="h-24 rounded border border-[#E5E7EB]" style={{ backgroundColor: '#9CFFD9' }}></div>
                  <div className="mt-2 text-[12px] leading-[16px]">
                    <div className="font-medium">#9CFFD9</div>
                    <div className="text-[#4B5563]">Surface Green</div>
                  </div>
                </div>
                <div>
                  <div className="h-24 rounded border border-[#E5E7EB]" style={{ backgroundColor: '#B6EFD4' }}></div>
                  <div className="mt-2 text-[12px] leading-[16px]">
                    <div className="font-medium">#B6EFD4</div>
                    <div className="text-[#4B5563]">Surface Mint</div>
                  </div>
                </div>
                <div>
                  <div className="h-24 rounded border border-[#E5E7EB]" style={{ backgroundColor: '#7CE577' }}></div>
                  <div className="mt-2 text-[12px] leading-[16px]">
                    <div className="font-medium">#7CE577</div>
                    <div className="text-[#4B5563]">Accent Lime</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Neutrals */}
            <div>
              <h3 className="text-[14px] leading-[20px] font-medium mb-4 text-[#4B5563]">NEUTRALS</h3>
              <div className="grid grid-cols-5 gap-6">
                <div>
                  <div className="h-24 rounded border border-[#E5E7EB]" style={{ backgroundColor: '#FFFFFF' }}></div>
                  <div className="mt-2 text-[12px] leading-[16px]">
                    <div className="font-medium">#FFFFFF</div>
                    <div className="text-[#4B5563]">Background</div>
                  </div>
                </div>
                <div>
                  <div className="h-24 rounded border border-[#E5E7EB]" style={{ backgroundColor: '#111111' }}></div>
                  <div className="mt-2 text-[12px] leading-[16px]">
                    <div className="font-medium">#111111</div>
                    <div className="text-[#4B5563]">Text</div>
                  </div>
                </div>
                <div>
                  <div className="h-24 rounded border border-[#E5E7EB]" style={{ backgroundColor: '#4B5563' }}></div>
                  <div className="mt-2 text-[12px] leading-[16px]">
                    <div className="font-medium">#4B5563</div>
                    <div className="text-[#4B5563]">Muted</div>
                  </div>
                </div>
                <div>
                  <div className="h-24 rounded border border-[#E5E7EB]" style={{ backgroundColor: '#E5E7EB' }}></div>
                  <div className="mt-2 text-[12px] leading-[16px]">
                    <div className="font-medium">#E5E7EB</div>
                    <div className="text-[#4B5563]">Border</div>
                  </div>
                </div>
                <div>
                  <div className="h-24 rounded border border-[#E5E7EB]" style={{ backgroundColor: '#DA291C' }}></div>
                  <div className="mt-2 text-[12px] leading-[16px]">
                    <div className="font-medium">#DA291C</div>
                    <div className="text-[#4B5563]">Error</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="mb-16">
          <h2 className="text-[24px] leading-[32px] font-semibold mb-8">Typography</h2>
          <div className="space-y-6 bg-white border border-[#E5E7EB] rounded p-8">
            <div>
              <div className="text-[12px] leading-[16px] text-[#4B5563] mb-2">FONT FAMILY</div>
              <div className="text-[20px] leading-[28px]">Space Grotesk</div>
            </div>
            
            <div className="border-t border-[#E5E7EB] pt-6">
              <div className="text-[12px] leading-[16px] text-[#4B5563] mb-4">SCALE</div>
              <div className="space-y-4">
                <div className="flex items-baseline gap-8">
                  <div className="w-32 text-[12px] leading-[16px] text-[#4B5563]">32/40 • Semibold</div>
                  <div className="text-[32px] leading-[40px] font-semibold">Page Heading</div>
                </div>
                <div className="flex items-baseline gap-8">
                  <div className="w-32 text-[12px] leading-[16px] text-[#4B5563]">24/32 • Semibold</div>
                  <div className="text-[24px] leading-[32px] font-semibold">Section Heading</div>
                </div>
                <div className="flex items-baseline gap-8">
                  <div className="w-32 text-[12px] leading-[16px] text-[#4B5563]">20/28 • Medium</div>
                  <div className="text-[20px] leading-[28px] font-medium">Subsection Heading</div>
                </div>
                <div className="flex items-baseline gap-8">
                  <div className="w-32 text-[12px] leading-[16px] text-[#4B5563]">16/24 • Normal</div>
                  <div className="text-[16px] leading-[24px]">Body text for readable paragraphs</div>
                </div>
                <div className="flex items-baseline gap-8">
                  <div className="w-32 text-[12px] leading-[16px] text-[#4B5563]">14/20 • Normal</div>
                  <div className="text-[14px] leading-[20px]">Small body text and labels</div>
                </div>
                <div className="flex items-baseline gap-8">
                  <div className="w-32 text-[12px] leading-[16px] text-[#4B5563]">12/16 • Normal</div>
                  <div className="text-[12px] leading-[16px]">Captions and metadata</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Grid & Spacing */}
        <section>
          <h2 className="text-[24px] leading-[32px] font-semibold mb-8">Grid & Spacing</h2>
          <div className="bg-white border border-[#E5E7EB] rounded p-8">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-[12px] leading-[16px] text-[#4B5563] mb-2">DESKTOP GRID</div>
                  <div className="text-[16px] leading-[24px]">12 columns</div>
                </div>
                <div>
                  <div className="text-[12px] leading-[16px] text-[#4B5563] mb-2">MARGINS</div>
                  <div className="text-[16px] leading-[24px]">72px left & right</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-[12px] leading-[16px] text-[#4B5563] mb-2">GUTTERS</div>
                  <div className="text-[16px] leading-[24px]">24px between columns</div>
                </div>
                <div>
                  <div className="text-[12px] leading-[16px] text-[#4B5563] mb-2">BASE UNIT</div>
                  <div className="text-[16px] leading-[24px]">8px spacing system</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div className="text-[12px] leading-[16px] text-[#4B5563] mb-2">BORDER RADIUS</div>
                  <div className="text-[16px] leading-[24px]">Maximum 4px</div>
                </div>
                <div>
                  <div className="text-[12px] leading-[16px] text-[#4B5563] mb-2">SHADOWS</div>
                  <div className="text-[16px] leading-[24px]">Subtle only, minimal elevation</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
