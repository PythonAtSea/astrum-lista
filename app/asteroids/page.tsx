"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NeoFeedResponse } from "@/lib/nasa-types";
import Link from "next/link";
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
  const [startDate, setStartDate] = React.useState(() => format(now));
  const [sortBy, setSortBy] = React.useState("date");

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
        <label className="flex flex-col gap-1 w-fit">
          <span className="text-sm text-muted-foreground">Sort by</span>
          <Select onValueChange={(value) => setSortBy(value)} value={sortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Select a sorting option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="az">Name (A-Z)</SelectItem>
              <SelectItem value="za">Name (Z-A)</SelectItem>
              <SelectItem value="id">NASA ID</SelectItem>
            </SelectContent>
          </Select>
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
              {asteroidsList
                .sort((a, b) => {
                  let aVal = 0;
                  let bVal = 0;
                  if (sortBy === "date") {
                    aVal = new Date(
                      a.close_approach_data[0].close_approach_date
                    ).getTime();
                    bVal = new Date(
                      b.close_approach_data[0].close_approach_date
                    ).getTime();
                  } else if (sortBy === "az") {
                    aVal = a.name.charCodeAt(0);
                    bVal = b.name.charCodeAt(0);
                  } else if (sortBy === "za") {
                    aVal = b.name.charCodeAt(0);
                    bVal = a.name.charCodeAt(0);
                  } else if (sortBy === "id") {
                    aVal = parseInt(a.neo_reference_id, 10);
                    bVal = parseInt(b.neo_reference_id, 10);
                  }
                  if (a.is_potentially_hazardous_asteroid) {
                    aVal += 1000000000000000;
                  }
                  if (b.is_potentially_hazardous_asteroid) {
                    bVal += 1000000000000000;
                  }
                  if (a.is_sentry_object) {
                    aVal += 100000000000000;
                  }
                  if (b.is_sentry_object) {
                    bVal += 100000000000000;
                  }
                  return bVal - aVal;
                })
                .map((neo) => (
                  <div
                    key={neo.id}
                    className={`p-2 border ${
                      neo.is_potentially_hazardous_asteroid
                        ? "border-destructive bg-destructive/10"
                        : neo.is_sentry_object
                        ? "border-orange-500 bg-orange-500/10"
                        : "border-border bg-card"
                    }`}
                    title={neo.name}
                  >
                    <div>
                      {neo.name}
                      {neo.is_potentially_hazardous_asteroid && (
                        <span className="ml-2 text-destructive font-bold text-sm">
                          Potentially Hazardous
                        </span>
                      )}
                      {neo.is_sentry_object && (
                        <span className="text-sm text-orange-500 font-bold ml-2">
                          <Link href={neo.sentry_data ? neo.sentry_data : "#"}>
                            Sentry Object
                          </Link>
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
                          <li
                            key={idx}
                            className="text-xs text-muted-foreground"
                          >
                            <>
                              {new Date(cad.close_approach_date) > now
                                ? "Missed"
                                : "Will Miss"}{" "}
                              {cad.orbiting_body} by{" "}
                              <strong>
                                {parseFloat(
                                  cad.miss_distance.miles
                                ).toLocaleString("en-US", {
                                  maximumFractionDigits: 0,
                                })}
                              </strong>{" "}
                              miles on{" "}
                              <strong>{cad.close_approach_date}</strong> at a
                              velocity of{" "}
                              <strong>
                                {parseFloat(
                                  cad.relative_velocity.miles_per_hour
                                ).toLocaleString("en-US", {
                                  maximumFractionDigits: 0,
                                })}{" "}
                              </strong>
                              mph
                            </>
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
