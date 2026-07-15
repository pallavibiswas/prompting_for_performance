export interface CraftDef {
  label: string;
  color: string;
  desc: string;
  example: string;
  placeholder: string;
}   

export const CRAFT_DEFS: Record<string, CraftDef> = {
  C: {
    label: "Context",
    color: "#1A73E8",
    desc: "Provide background information relevant to your task.",
    example: "I am preparing a risk assessment report for Q4 2024 earnings.",
    placeholder: "Add context about your task, situation, or background..."
  },
  R: {
    label: "Role",
    color: "#005EB8",
    desc: "Assign an expert persona for the AI to adopt.",
    example: "You are a senior financial analyst with 15 years in risk management.",
    placeholder: "Describe the specific action or task..."
  },
  A: {
    label: "Action",
    color: "#0099FF",
    desc: "State clearly what you want the AI to do.",
    example: "Analyze the following data and identify the top 3 systemic risks.",
    placeholder: "Enter your context here..."
  },
  F: {
    label: "Format",
    color: "#00B4E0",
    desc: "Specify the structure or format of the output.",
    example: "Present findings as a bulleted executive summary, max 200 words.",
    placeholder: "Specify output format, length, or structure....."
  },
  T: {
    label: "Tone",
    color: "#64B5F6",
    desc: "Define the tone, voice, or style required.",
    example: "Use formal, professional language appropriate for C-suite presentation.",
    placeholder: "Define the tone, style, or voice..."
  },
};

export const CHART_COLORS = ["#1A73E8", "#005EB8", "#0099FF", "#00B4E0", "#64B5F6", "#BBD9F5"];
