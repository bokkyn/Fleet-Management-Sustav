{
  /* 
  
  KAKO KORISTITI
  
  <GrafKorisnici
  title="Top 5 korisnika"
  description="Prikaz korisnika s najviše rezervacija"
  color=`hsl(0, 0%, ${Math.random() * 100}%)` // možete postaviti boju ili ostaviti da bude slučajna siva
  link="http://localhost:3000/rezervacije/top-korisnici" // URL za dohvat podataka
/> */
}

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import axios from "axios";
import { useEffect, useState } from "react";

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
export function GrafKorisnici({ title, description, color, link }) {
  const [chartData, setChartData] = useState([]);
  const chartConfig = {
    rezervacije: {
      label: "Rezervacije",
    },
  };

  useEffect(() => {
    axios
      .get(link, { withCredentials: true }) 
      .then((response) => {
        const data = response.data;
        const transformedData = data.map((user) => ({
          korisnici: user.korisnik,
          rezervacije: user.brojrezervacija,
          fill: color || `hsl(0, 0%, ${Math.random() * 100}%)`, // Ako nije proslijeđena boja, generiraj slučajnu nijansu sive
        }));

        setChartData(transformedData);
      })
      .catch((error) => {
        console.error("Greška pri dohvaćanju podataka: ", error);
      });
  }, [link, color]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>{" "}
   
        <CardDescription>{description}</CardDescription>{" "}

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
              dataKey="korisnici"
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
              fill={color || "#808080"} 
            />
          </BarChart>
        </ChartContainer>
         </CardContent>
    </Card>
  );
}
