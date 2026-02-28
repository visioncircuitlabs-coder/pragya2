import * as React from 'react';
import { Svg, Path, Circle, Rect, G, Line, Text as SvgText } from '@react-pdf/renderer';
import { View, Text } from '@react-pdf/renderer';
import { COLORS, RIASEC_COLORS, RIASEC_NAMES, getBarColor, getTraitLevel, styles, getFontFamily } from './pdf-styles';
import type { Lang } from './i18n';
import { t } from './i18n';

const h = React.createElement;

// @react-pdf/renderer SVG types are incomplete; cast extended SVG props through `any`
// Always use Nunito for SVG text so chart labels stay English even on Malayalam pages
const svgText = (props: any, ...children: any[]) =>
    h(SvgText, { fontFamily: 'Nunito', ...props }, ...children);

// Build an SVG arc path from startAngle to endAngle (radians, 0 = top / 12 o'clock)
// @react-pdf/renderer doesn't support strokeDasharray/strokeDashoffset, so we draw arcs with Path
const describeArc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number): string => {
    // Convert to standard math angles (0 = right, CCW positive) but we want 0 = top, CW positive
    const toXY = (angle: number) => ({
        x: cx + r * Math.sin(angle),
        y: cy - r * Math.cos(angle),
    });
    const start = toXY(startAngle);
    const end = toXY(endAngle);
    const sweep = endAngle - startAngle;
    const largeArc = sweep > Math.PI ? 1 : 0;
    return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
};

// ─── RADAR CHART (RIASEC) ────────────────────────────────────────────────────
interface RadarChartProps {
    scores: Record<string, number>;
    maxScore: number;
    size?: number;
}

export const RadarChart = ({ scores, maxScore, size = 170 }: RadarChartProps) => {
    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 28;
    const codes = ['R', 'I', 'A', 'S', 'E', 'C'];
    const angleStep = (Math.PI * 2) / 6;

    const getPoint = (index: number, r: number) => ({
        x: cx + r * Math.sin(index * angleStep),
        y: cy - r * Math.cos(index * angleStep),
    });

    // Grid rings at 25%, 50%, 75%, 100%
    const rings = [0.25, 0.5, 0.75, 1.0].map(pct => {
        const r = radius * pct;
        const points = codes.map((_, i) => getPoint(i, r));
        const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z';
        return d;
    });

    // Axis lines
    const axes = codes.map((_, i) => getPoint(i, radius));

    // Data polygon
    const dataPoints = codes.map((code, i) => {
        const val = scores[code] || 0;
        const r = radius * (val / maxScore);
        return getPoint(i, r);
    });
    const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z';

    // Labels positioned outside the chart
    const labelOffset = radius + 16;

    return h(View, { style: { alignItems: 'center' } },
        h(Svg, { width: size, height: size, viewBox: `0 0 ${size} ${size}` },
            // Grid rings
            ...rings.map((d, i) =>
                h(Path, { key: `ring-${i}`, d, fill: 'none', stroke: '#d4ede7', strokeWidth: 0.5 })
            ),
            // Axis lines
            ...axes.map((pt, i) =>
                h(Line, { key: `axis-${i}`, x1: String(cx), y1: String(cy), x2: String(pt.x.toFixed(1)), y2: String(pt.y.toFixed(1)), stroke: '#d4ede7', strokeWidth: 0.5 })
            ),
            // Data polygon (filled)
            h(Path, { d: dataPath, fill: `${COLORS.PRIMARY}33`, stroke: COLORS.PRIMARY, strokeWidth: 1.5 }),
            // Data points (colored dots)
            ...dataPoints.map((pt, i) =>
                h(Circle, { key: `dot-${i}`, cx: String(pt.x.toFixed(1)), cy: String(pt.y.toFixed(1)), r: '3', fill: RIASEC_COLORS[codes[i]] })
            ),
            // Labels
            ...codes.map((code, i) => {
                const pos = getPoint(i, labelOffset);
                return svgText({
                    key: `label-${i}`,
                    x: String(pos.x.toFixed(1)),
                    y: String(pos.y.toFixed(1)),
                    fill: RIASEC_COLORS[code],
                    fontSize: 8,
                    fontWeight: 700,
                    textAnchor: 'middle',
                }, `${code}`);
            })
        ),
        // Legend row below
        h(View, { style: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginTop: 4 } },
            ...codes.map(code =>
                h(View, { key: `leg-${code}`, style: { flexDirection: 'row', alignItems: 'center', gap: 2 } },
                    h(View, { style: { width: 6, height: 6, borderRadius: 3, backgroundColor: RIASEC_COLORS[code] } }),
                    h(Text, { style: { fontSize: 6, color: COLORS.TEXT_MUTED } }, `${RIASEC_NAMES[code]} (${scores[code] || 0})`)
                )
            )
        )
    );
};

// ─── HORIZONTAL BAR CHART ────────────────────────────────────────────────────
interface BarData {
    name: string;
    value: number;
    max: number;
}

interface HorizontalBarChartProps {
    data: BarData[];
    showPercent?: boolean;
    barHeight?: number;
    width?: number;
}

export const HorizontalBarChart = ({ data, showPercent = true, barHeight = 10, width = 490 }: HorizontalBarChartProps) => {
    const labelWidth = 120;
    const valueWidth = 40;
    const barAreaWidth = width - labelWidth - valueWidth - 10;
    const rowHeight = barHeight + 12;
    const svgHeight = data.length * rowHeight + 4;

    return h(Svg, { width, height: svgHeight, viewBox: `0 0 ${width} ${svgHeight}` },
        ...data.map((item, i) => {
            const pct = Math.min(100, Math.round((item.value / item.max) * 100));
            const barWidth = (pct / 100) * barAreaWidth;
            const y = i * rowHeight + 2;
            const color = getBarColor(pct);

            return h(G, { key: `bar-${i}` },
                // Label
                svgText({
                    x: '0',
                    y: String(y + barHeight / 2 + 3),
                    fill: COLORS.TEXT_BODY,
                    fontSize: 8,
                    fontWeight: 600,
                }, item.name.length > 18 ? item.name.substring(0, 17) + '...' : item.name),
                // Track
                h(Rect, {
                    x: String(labelWidth),
                    y: String(y),
                    width: String(barAreaWidth),
                    height: String(barHeight),
                    rx: String(barHeight / 2),
                    fill: '#e2e8f0',
                }),
                // Fill
                barWidth > 0 && h(Rect, {
                    x: String(labelWidth),
                    y: String(y),
                    width: String(Math.max(barWidth, barHeight)),
                    height: String(barHeight),
                    rx: String(barHeight / 2),
                    fill: color,
                }),
                // Value
                svgText({
                    x: String(labelWidth + barAreaWidth + 6),
                    y: String(y + barHeight / 2 + 3),
                    fill: COLORS.PRIMARY,
                    fontSize: 8,
                    fontWeight: 700,
                }, showPercent ? `${pct}%` : `${item.value}/${item.max}`)
            );
        })
    );
};

// ─── CIRCULAR PROGRESS INDICATOR ─────────────────────────────────────────────
interface CircularProgressProps {
    value: number;
    max: number;
    label: string;
    sublabel?: string;
    size?: number;
    strokeWidth?: number;
    color?: string;
}

export const CircularProgress = ({ value, max, label, sublabel, size = 60, strokeWidth = 5, color }: CircularProgressProps) => {
    const pct = Math.min(100, Math.round((value / max) * 100));
    const cx = size / 2;
    const cy = size / 2;
    const r = (size - strokeWidth) / 2;
    const fillColor = color || getTraitLevel(pct).color;
    const levelInfo = getTraitLevel(pct);

    // Arc from 0 to pct% of full circle (avoid exactly 2π which collapses the arc)
    const endAngle = Math.min((pct / 100) * Math.PI * 2, Math.PI * 2 - 0.001);
    const arcPath = pct > 0 ? describeArc(cx, cy, r, 0, endAngle) : '';

    return h(View, { style: { alignItems: 'center', width: size + 10 } },
        h(Svg, { width: size, height: size, viewBox: `0 0 ${size} ${size}` },
            // Background circle
            h(Circle, {
                cx: String(cx),
                cy: String(cy),
                r: String(r),
                fill: 'none',
                stroke: '#e2e8f0',
                strokeWidth: String(strokeWidth),
            }),
            // Progress arc (Path-based)
            pct > 0 && h(Path, {
                d: arcPath,
                fill: 'none',
                stroke: fillColor,
                strokeWidth: strokeWidth,
                strokeLinecap: 'round',
            }),
            // Center text - score
            svgText({
                x: String(cx),
                y: String(cy + (max <= 10 ? -2 : 1)),
                fill: fillColor,
                fontSize: size > 55 ? 13 : 10,
                fontWeight: 700,
                textAnchor: 'middle',
            }, max <= 10 ? `${value}` : `${pct}%`),
            // Center sub text
            max <= 10 && svgText({
                x: String(cx),
                y: String(cy + 10),
                fill: COLORS.TEXT_MUTED,
                fontSize: 6,
                textAnchor: 'middle',
            }, `/${max}`)
        ),
        // Label below
        h(Text, { style: { fontSize: 7, fontWeight: 600, color: COLORS.TEXT_DARK, textAlign: 'center', marginTop: 2 } }, label),
        sublabel
            ? h(Text, { style: { fontSize: 6, color: fillColor, textAlign: 'center' } }, sublabel)
            : h(Text, { style: { fontSize: 6, color: levelInfo.color, textAlign: 'center' } }, levelInfo.level)
    );
};

// ─── SCORE RING / DONUT (Large) ──────────────────────────────────────────────
interface ScoreRingProps {
    value: number;
    max: number;
    label: string;
    size?: number;
    color?: string;
}

export const ScoreRing = ({ value, max, label, size = 80, color }: ScoreRingProps) => {
    const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
    const strokeWidth = 7;
    const cx = size / 2;
    const cy = size / 2;
    const r = (size - strokeWidth) / 2;
    const fillColor = color || (pct >= 70 ? COLORS.PRIMARY : pct >= 40 ? COLORS.WARNING : COLORS.DANGER);

    const endAngle = Math.min((pct / 100) * Math.PI * 2, Math.PI * 2 - 0.001);
    const arcPath = pct > 0 ? describeArc(cx, cy, r, 0, endAngle) : '';

    return h(View, { style: { alignItems: 'center', width: size + 4 } },
        h(Svg, { width: size, height: size, viewBox: `0 0 ${size} ${size}` },
            // BG
            h(Circle, {
                cx: String(cx),
                cy: String(cy),
                r: String(r),
                fill: 'none',
                stroke: '#e2e8f0',
                strokeWidth: String(strokeWidth),
            }),
            // Arc (Path-based)
            pct > 0 && h(Path, {
                d: arcPath,
                fill: 'none',
                stroke: fillColor,
                strokeWidth: strokeWidth,
                strokeLinecap: 'round',
            }),
            // Center value
            svgText({
                x: String(cx),
                y: String(cx + (max !== 100 ? -1 : 2)),
                fill: fillColor,
                fontSize: 16,
                fontWeight: 700,
                textAnchor: 'middle',
            }, max === 100 ? `${value}` : `${pct}%`),
            // Small "/ max" if not percentage
            max !== 100 && svgText({
                x: String(cx),
                y: String(cy + 12),
                fill: COLORS.TEXT_MUTED,
                fontSize: 7,
                textAnchor: 'middle',
            }, `/${max}`)
        ),
        h(Text, { style: { fontSize: 8, fontWeight: 600, color: COLORS.TEXT_DARK, textAlign: 'center', marginTop: 3 } }, label)
    );
};

// ─── HOLLAND CODE DISPLAY ────────────────────────────────────────────────────
interface HollandCodeProps {
    code: string;
}

export const HollandCodeDisplay = ({ code }: HollandCodeProps) => {
    const letters = code.split('');

    return h(View, { style: styles.hollandRow },
        ...letters.map((letter, i) => {
            const parts: React.ReactNode[] = [];
            if (i > 0) {
                parts.push(h(Text, { key: `dash-${i}`, style: styles.hollandDash }, ' - '));
            }
            parts.push(
                h(View, { key: `letter-${i}`, style: { alignItems: 'center' } },
                    h(Text, { style: { ...styles.hollandLetter, color: RIASEC_COLORS[letter] || COLORS.TEXT_DARK } }, letter),
                    h(Text, { style: { fontSize: 6, color: COLORS.TEXT_MUTED } }, RIASEC_NAMES[letter] || '')
                )
            );
            return parts;
        }).flat()
    );
};

// ─── MINI BAR (for sector detail breakdowns) ─────────────────────────────────
interface MiniBarProps {
    label: string;
    value: number;
    width?: number;
}

export const MiniBar = ({ label, value, width = 150 }: MiniBarProps) => {
    const barWidth = width - 65;
    const fillWidth = Math.max(2, (value / 100) * barWidth);
    const color = getBarColor(value);
    const barH = 5;

    return h(View, { style: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 } },
        h(Text, { style: { fontSize: 6, color: COLORS.TEXT_MUTED, width: 48 } }, label),
        h(Svg, { width: barWidth + 4, height: barH + 2 },
            h(Rect, { x: '0', y: '1', width: String(barWidth), height: String(barH), rx: '2', fill: '#e2e8f0' }),
            h(Rect, { x: '0', y: '1', width: String(fillWidth), height: String(barH), rx: '2', fill: color })
        ),
        h(Text, { style: { fontSize: 6, fontWeight: 700, color: COLORS.PRIMARY, width: 20, textAlign: 'right' } }, `${value}%`)
    );
};

// ─── PAGE FOOTER COMPONENT ──────────────────────────────────────────────────
export const PageFooter = ({ reportType, lang = 'en' }: { reportType: string; lang?: Lang }) => {
    const confidential = t('footer_confidential', lang);
    return h(View, { style: styles.footer, fixed: true } as any,
        h(Text, {
            style: { ...styles.footerText, fontFamily: getFontFamily(lang) },
            render: ({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) =>
                `PRAGYA ${reportType} | Vision Circuit Labs | Page ${pageNumber} of ${totalPages} | ${confidential}`
        } as any)
    );
};

// ─── SECTION HEADER (reusable) ──────────────────────────────────────────────
export const SectionHeader = ({ title, accentColor }: { title: string; accentColor?: string }) => {
    return h(Text, {
        style: {
            ...styles.sectionTitle,
            ...(accentColor ? { color: accentColor } : {}),
        }
    }, title);
};
