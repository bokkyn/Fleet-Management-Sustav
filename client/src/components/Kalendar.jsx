import React, {  useState } from "react";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewMonthGrid,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "@schedule-x/theme-shadcn/dist/index.css";

function CalendarApp({ events }) {
  const eventsService = useState(() => createEventsServicePlugin())[0];

  const calendar = useCalendarApp({
    views: [createViewMonthGrid()],
    events,
    
    theme: "shadcn",
    defaultView: createViewMonthGrid().name,
    locale: "hr-HR",

    calendars: {
      hatchback: {
        colorName: "hatchback",
        lightColors: {
          main: "#666666",
          container: "#e0e0e0",
          onContainer: "#606060",
        },
      },
      sedan: {
        colorName: "sedan",
        lightColors: {
          main: "#777777",
          container: "#d6d6d6",
          onContainer: "#4c4c4c",
        },
      },
      karavan: {
        colorName: "karavan",
        lightColors: {
          main: "#777777",
          container: "#c4c4c4",
          onContainer: "#3a3a3a",
        },
      },
      kombi: {
        colorName: "kombi",
        lightColors: {
          main: "#555555",
          container: "#aaaaaa",
          onContainer: "#2a2a2a",
        },
      },
      SUV: {
        colorName: "SUV",
        lightColors: {
          main: "#333333",
          container: "#8c8c8c",
          onContainer: "#1a1a1a",
        },
      },
      coupe: {
        colorName: "coupe",
        lightColors: {
          main: "#111111",
          container: "#6e6e6e",
          onContainer: "#0a0a0a",
        },
      },
      kabriolet: {
        colorName: "kabriolet",
        lightColors: {
          main: "#111111",
          container: "#636363",
          onContainer: "#221222",
        },
      },
    },
  });



  return (
<div className="w-full h-full">
<ScheduleXCalendar  calendarApp={calendar} />
</div>
  );
   
}

export default CalendarApp;
