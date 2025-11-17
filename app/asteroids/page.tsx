"use client";
import { Input } from "@/components/ui/input";
import { NeoFeedResponse } from "@/lib/nasa-types";
import React from "react";

export default function Page() {
  const now = new Date();
  const format = (d: Date) => d.toISOString().slice(0, 10);
  const [endDate, setEndDate] = React.useState(() =>
    format(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7))
  );
  const [asteroids, setAsteroids] = React.useState<NeoFeedResponse | null>(
    null
  );
  // rawData was used for debugging; remove unless needed.
  const [startDate, setStartDate] = React.useState(() => format(now));

  React.useEffect(() => {
    fetch(
      `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${process.env.NEXT_PUBLIC_NASA_API_KEY}`
    )
      .then((res) => res.json())

      .then((data) => {
        setAsteroids(data);
      });
  }, [startDate, endDate]);

  const asteroidsList = React.useMemo(() => {
    if (!asteroids) return [];
    // near_earth_objects is a Record<string, Array<NEO>> keyed by date.
    return Object.values(asteroids.near_earth_objects).flat();
  }, [asteroids]);

  return (
    <div>
      <div className="flex flex-row gap-4 mb-6">
        <label className="flex flex-col gap-1 w-fit">
          <span className="text-sm text-muted-foreground">Start date</span>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => {
              const val = e.target.value;
              setStartDate(val);
              if (endDate && val > endDate) setEndDate(val);
            }}
            max={endDate}
          />
        </label>
        <label className="flex flex-col gap-1 w-fit">
          <span className="text-sm text-muted-foreground">End date</span>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => {
              const val = e.target.value;
              setEndDate(val);
              if (startDate && val < startDate) setStartDate(val);
            }}
            min={startDate}
          />
        </label>
      </div>

      <div className="space-y-4">
        {asteroids ? (
          <div>
            <div className="mb-2 text-sm text-muted-foreground">
              Showing {asteroidsList.length} near earth objects (NEOs) from{" "}
              {startDate} to {endDate}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {asteroidsList.map((neo) => (
                <div
                  key={neo.id}
                  className={`p-2 border ${
                    neo.is_potentially_hazardous_asteroid
                      ? "border-destructive bg-destructive/10"
                      : "border-border bg-card"
                  }`}
                  title={neo.name}
                >
                  <div className="font-medium">
                    {neo.name}
                    {neo.is_potentially_hazardous_asteroid && (
                      <span className="ml-2 text-destructive font-bold">
                        Potentially Hazardous!
                      </span>
                    )}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {`Estimated Diameter: ${neo.estimated_diameter.feet.estimated_diameter_min.toFixed(
                      1
                    )} ft - ${neo.estimated_diameter.feet.estimated_diameter_max.toFixed(
                      1
                    )} ft`}
                  </div>
                  <div className="text-xs">
                    {`${neo.close_approach_data.length} close approach${
                      neo.close_approach_data.length !== 1 ? "es" : ""
                    }`}
                    <ul className="list-disc pl-4 space-y-1">
                      {neo.close_approach_data.map((cad, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground">
                          {`Missed ${cad.orbiting_body} by ${parseFloat(
                            cad.miss_distance.miles
                          ).toLocaleString("en-US", {
                            maximumFractionDigits: 0,
                          })} miles on ${
                            cad.close_approach_date
                          } at a velocity of ${parseFloat(
                            cad.relative_velocity.miles_per_hour
                          ).toLocaleString("en-US", {
                            maximumFractionDigits: 0,
                          })} mph`}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-xs mt-1">
                    <a
                      href={neo.nasa_jpl_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      NASA JPL Link
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Loading near earth objects...
          </div>
        )}
      </div>
    </div>
  );
}
