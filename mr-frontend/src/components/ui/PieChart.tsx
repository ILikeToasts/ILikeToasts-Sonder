import React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const pieColors = [
  "#ed9b9b",
  "#e88ca6",
  "#e37db8",
  "#de6fce",
  "#c761d8",
  "#9b54d2",
  "#6c47cb",
  "#3b3cc3",
  "#395db1",
  "#3774a0",
];

export interface ChartPieInteractiveProps<T> {
  id: string;
  title: string;
  description?: string;
  data: T[];
  labelKey: keyof T;
  valueKey: keyof T;
}

export function ChartPieInteractive<T extends Record<string, any>>({
  id,
  title,
  description,
  data,
  labelKey,
  valueKey,
}: ChartPieInteractiveProps<T>) {
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {};
    data.forEach((item, idx) => {
      const label = String(item[labelKey]);
      config[label] = {
        label,
        color: pieColors[idx % pieColors.length],
      };
    });
    return config;
  }, [data, labelKey]);

  const labels = React.useMemo(
    () => data.map((item) => String(item[labelKey])),
    [data, labelKey],
  );
  const [activeLabel, setActiveLabel] = React.useState(labels[0]);

  const activeIndex = React.useMemo(
    () => data.findIndex((item) => String(item[labelKey]) === activeLabel),
    [data, labelKey, activeLabel],
  );

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <Select value={activeLabel} onValueChange={setActiveLabel}>
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {labels.map((key) => {
              const config = chartConfig[key];
              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-xs"
                      style={{ backgroundColor: config.color }}
                    />
                    {config.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[400px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data.map((item) => ({
                ...item,
                fill: chartConfig[String(item[labelKey])]?.color,
              }))}
              dataKey={String(valueKey)}
              nameKey={String(labelKey)}
              innerRadius={90}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {data[activeIndex]?.[valueKey]?.toLocaleString?.()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {chartConfig[activeLabel]?.label}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
