export default function Logo({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) {
  const dims = size === 'large' ? { w: 130, h: 32, fontSize: 22 } : size === 'small' ? { w: 80, h: 20, fontSize: 16 } : { w: 110, h: 26, fontSize: 20 };
  return (
    <div style={{ height: dims.h, display: 'flex', alignItems: 'center' }}>
      <svg width={dims.w} height={dims.h + 4} viewBox={`0 0 ${dims.w} ${dims.h + 4}`} fill="none">
        <text x="0" y={dims.h - 4} fontSize={dims.fontSize} fontWeight="700" fontFamily="system-ui, sans-serif" fill="#0F172A">Prep</text>
        <text x={dims.w * 0.42} y={dims.h - 4} fontSize={dims.fontSize} fontWeight="700" fontFamily="system-ui, sans-serif" fill="#5B6FE8">Route</text>
        <path d="M2 -2 Q5 -5 8 -2 Q11 1 14 -2" stroke="#0F172A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}
