"use client";
import React from "react";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  return (
    <>
      <h1 className="text-2xl font-bold">Image ID</h1>
      <p className="mt-4 text-lg">{id}</p>
    </>
  );
}
