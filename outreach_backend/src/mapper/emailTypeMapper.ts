export const mapEmailTypeToDB = (type: "cold" | "tailored") => {
  const map = {
    cold: "COLD",
    tailored: "TAILORED",
  } as const;

  return map[type];
};
