"use client";
import React, { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const userInfo = JSON.parse(localStorage.getItem("userInfo"));

const chartConfig =
  userInfo?.mode === "veselo"
    ? {
        hatchback: { label: "Hatchback", color: "hsl(210, 90%, 60%)" },
        sedan: { label: "Sedan", color: "hsl(120, 70%, 50%)" },
        karavan: { label: "Karavan", color: "hsl(45, 85%, 55%)" },
        kombi: { label: "Kombi", color: "hsl(300, 75%, 65%)" },
        SUV: { label: "SUV", color: "hsl(0, 80%, 55%)" },
        coupe: { label: "Coupe", color: "hsl(30, 100%, 50%)" },
        kabriolet: { label: "Kabriolet", color: "hsl(180, 65%, 55%)" },
      }
    : {
        hatchback: { label: "Hatchback", color: "hsl(0, 0%, 10%)" },
        sedan: { label: "Sedan", color: "hsl(0, 0%, 20%)" },
        karavan: { label: "Karavan", color: "hsl(0, 0%, 30%)" },
        kombi: { label: "Kombi", color: "hsl(0, 0%, 40%)" },
        SUV: { label: "SUV", color: "hsl(0, 0%, 50%)" },
        coupe: { label: "Coupe", color: "hsl(0, 0%, 60%)" },
        kabriolet: { label: "Kabriolet", color: "hsl(0, 0%, 70%)" },
      };

export function GrafTipovi() {
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/rezervacije/chart-data?godina=2025",
          {
            withCredentials: true,
          }
        );
          
        if (Array.isArray(response.data)) {
          const transformedData = response.data.map((item) => ({
            month: item.mjesec,
            hatchback: item.hatchback,
            sedan: item.sedan,
            karavan: item.karavan,
            kombi: item.kombi,
            SUV: item.SUV,
            coupe: item.coupe,
            kabriolet: item.kabriolet,
          }));

          setChartData(transformedData);
        } else {
          setError("Invalid response format");
        }
      } catch (err) {
        setError(`Error fetching chart data: ${err.message}`);
        console.error("Error fetching chart data:", err);
      }
    };

    fetchChartData();
  }, []);

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Greška u dohvatu tablice</CardTitle>
        </CardHeader>
        <CardContent>{error}</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tipovi vozila</CardTitle>
        <CardDescription>
          Prikaz iznajmljenih tipova vozila po godini
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[25%]">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />

            <Bar
              dataKey="hatchback"
              stackId="a"
              fill={chartConfig.hatchback.color}
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="sedan"
              stackId="a"
              fill={chartConfig.sedan.color}
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="karavan"
              stackId="a"
              fill={chartConfig.karavan.color}
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="kombi"
              stackId="a"
              fill={chartConfig.kombi.color}
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="SUV"
              stackId="a"
              fill={chartConfig.SUV.color}
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="coupe"
              stackId="a"
              fill={chartConfig.coupe.color}
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="kabriolet"
              stackId="a"
              fill={chartConfig.kabriolet.color}
              radius={[0, 0, 4, 4]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
