"use client";

import { cn } from "@/utils";

interface DataPoint {
    label: string;
    value: number;
}

interface AnalyticsChartProps {
    data: DataPoint[];
    title?: string;
    type?: "line" | "bar";
    color?: string;
    height?: number;
    showGrid?: boolean;
    showLabels?: boolean;
    className?: string;
}

export function AnalyticsChart({
    data,
    title,
    type = "line",
    color = "hsl(217, 91%, 60%)",
    height = 200,
    showGrid = true,
    showLabels = true,
    className,
}: AnalyticsChartProps) {
    if (data.length === 0) {
        return (
            <div className={cn("rounded-xl border bg-card/50 p-4", className)}>
                {title && <h3 className="mb-4 font-semibold">{title}</h3>}
                <div
                    className="flex items-center justify-center text-muted-foreground"
                    style={{ height }}
                >
                    No data available
                </div>
            </div>
        );
    }

    const maxValue = Math.max(...data.map((d) => d.value));
    const minValue = Math.min(...data.map((d) => d.value));
    const range = maxValue - minValue || 1;

    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartWidth = 600;
    const chartHeight = height;
    const innerWidth = chartWidth - padding.left - padding.right;
    const innerHeight = chartHeight - padding.top - padding.bottom;

    const xStep = innerWidth / (data.length - 1 || 1);
    const yScale = (value: number) =>
        innerHeight - ((value - minValue) / range) * innerHeight;

    // Generate path for line chart
    const linePath = data
        .map((point, i) => {
            const x = padding.left + i * xStep;
            const y = padding.top + yScale(point.value);
            return `${i === 0 ? "M" : "L"} ${x} ${y}`;
        })
        .join(" ");

    // Generate area path
    const areaPath = `
    ${linePath}
    L ${padding.left + (data.length - 1) * xStep} ${padding.top + innerHeight}
    L ${padding.left} ${padding.top + innerHeight}
    Z
  `;

    // Grid lines
    const gridLines = Array.from({ length: 5 }, (_, i) => {
        const y = padding.top + (innerHeight / 4) * i;
        const value = maxValue - (range / 4) * i;
        return { y, value };
    });

    return (
        <div className={cn("rounded-xl border bg-card/50 p-4", className)}>
            {title && <h3 className="mb-4 font-semibold">{title}</h3>}

            <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full"
                style={{ height }}
            >
                <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Grid lines */}
                {showGrid &&
                    gridLines.map((line, i) => (
                        <g key={i}>
                            <line
                                x1={padding.left}
                                y1={line.y}
                                x2={chartWidth - padding.right}
                                y2={line.y}
                                stroke="currentColor"
                                strokeOpacity="0.1"
                                strokeDasharray="4 4"
                            />
                            <text
                                x={padding.left - 8}
                                y={line.y + 4}
                                textAnchor="end"
                                className="fill-muted-foreground text-xs"
                            >
                                {Math.round(line.value)}
                            </text>
                        </g>
                    ))}

                {type === "line" ? (
                    <>
                        {/* Area under line */}
                        <path d={areaPath} fill="url(#areaGradient)" />

                        {/* Line */}
                        <path
                            d={linePath}
                            fill="none"
                            stroke={color}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="drop-shadow-sm"
                        />

                        {/* Data points */}
                        {data.map((point, i) => {
                            const x = padding.left + i * xStep;
                            const y = padding.top + yScale(point.value);
                            return (
                                <g key={i}>
                                    <circle
                                        cx={x}
                                        cy={y}
                                        r="5"
                                        fill={color}
                                        className="drop-shadow-md transition-all hover:r-7"
                                    />
                                    <circle cx={x} cy={y} r="3" fill="white" />
                                </g>
                            );
                        })}
                    </>
                ) : (
                    /* Bar chart */
                    data.map((point, i) => {
                        const barWidth = (innerWidth / data.length) * 0.6;
                        const x = padding.left + i * (innerWidth / data.length) + barWidth * 0.33;
                        const barHeight = ((point.value - minValue) / range) * innerHeight;
                        const y = padding.top + innerHeight - barHeight;

                        return (
                            <rect
                                key={i}
                                x={x}
                                y={y}
                                width={barWidth}
                                height={barHeight}
                                rx="4"
                                fill={color}
                                opacity="0.8"
                                className="transition-all hover:opacity-100"
                            />
                        );
                    })
                )}

                {/* X-axis labels */}
                {showLabels &&
                    data.map((point, i) => {
                        const x =
                            type === "line"
                                ? padding.left + i * xStep
                                : padding.left +
                                i * (innerWidth / data.length) +
                                (innerWidth / data.length) * 0.5;

                        return (
                            <text
                                key={i}
                                x={x}
                                y={chartHeight - 10}
                                textAnchor="middle"
                                className="fill-muted-foreground text-xs"
                            >
                                {point.label}
                            </text>
                        );
                    })}
            </svg>
        </div>
    );
}

// Mini sparkline chart for inline use
interface SparklineProps {
    data: number[];
    width?: number;
    height?: number;
    color?: string;
    className?: string;
}

export function Sparkline({
    data,
    width = 80,
    height = 24,
    color = "currentColor",
    className,
}: SparklineProps) {
    if (data.length < 2) return null;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data
        .map((value, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - ((value - min) / range) * height;
            return `${x},${y}`;
        })
        .join(" ");

    return (
        <svg
            width={width}
            height={height}
            className={className}
            viewBox={`0 0 ${width} ${height}`}
        >
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
