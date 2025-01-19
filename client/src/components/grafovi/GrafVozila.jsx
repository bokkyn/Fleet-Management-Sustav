"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import axios from "axios";
import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function GrafVozila() {
  const [chartData, setChartData] = useState([]);
  const chartConfig = {
    rezervacije: {
      label: "rezervacije",
    },
  };

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  useEffect(() => {

    axios
      .get("http://localhost:3000/rezervacije/top-vozila", {
        withCredentials: true,
      })
      .then((response) => {
        const data = response.data;
   const transformedData = data.map((user) => ({
          vozila: user.vozilo,
          rezervacije: user.brojrezervacija,
          fill:
            userInfo?.mode === "veselo"
              ? `hsl(${Math.random() * 360}, 100%, 70%)`
              : `hsl(0, 0%, ${Math.random() * 100}%)`, // Boje nijanse sive (prilagoditi po želji)
        }));

        setChartData(transformedData);
      })
      .catch((error) => {
        console.error("Greška pri dohvaćanju podataka: ", error);
      });
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 vozila</CardTitle>
        <CardDescription>Prikaz vozila s najviše rezrvacija</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[45%]">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="vozila"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              className="min-h-[45%] m-10 flex"
            />
            <XAxis dataKey="rezervacije" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="rezervacije"
              layout="vertical"
              radius={5}
              fill="#808080"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
