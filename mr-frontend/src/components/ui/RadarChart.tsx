"use client";

import { TrendingUp } from "lucide-react";
import React from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export type GenreData = {
  name: string;
  value: number;
};

export interface ChartRadarProps<T> {
  title: string;
  description?: string;
  footerText?: string;
  data: T[];
  labelKey: keyof T;
  valueKey: keyof T;
  color?: string;
}

export function ChartRadar<T extends Record<string, any>>({
  title,
  description,
  footerText,
  data,
  labelKey,
  valueKey,
  color = "var(--chart-1)",
}: ChartRadarProps<T>) {
  const chartConfig = React.useMemo(() => {
    const key = String(valueKey);
    return {
      [key]: {
        label: String(valueKey),
        color,
      },
    } satisfies ChartConfig;
  }, [valueKey, color]);

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[400px]"
        >
          <RadarChart data={data}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey={String(labelKey)} />
            <PolarGrid />
            <Radar dataKey={String(valueKey)} fill={color} fillOpacity={0.6} />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      {footerText && (
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 leading-none font-medium">
            {footerText} <TrendingUp className="h-4 w-4" />
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
