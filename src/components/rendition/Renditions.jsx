import React, { useEffect } from "react";
import { Button, Typography } from "@mui/material";
import { useLoaderData } from "react-router-dom";

export default function Renditions() {
  const rendition = useLoaderData();

  console.log(rendition)

  return (
    <main>
      <h1>gkjsdlhgdsjkh</h1>
    </main>
  );
}