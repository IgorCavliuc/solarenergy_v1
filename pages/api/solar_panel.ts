// pages/api/solar_panel.ts
import { NextApiRequest, NextApiResponse } from "next";

const panelArray = require("./panel_database.json");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const data = panelArray;
    res.status(200).json(data);
  } catch (error) {
    console.error("Error calculating solar panel requirements:", error);
    res
      .status(500)
      .json({ error: "Failed to calculate solar panel requirements" });
  }
}
