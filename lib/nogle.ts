const getGSheet = async (spreadsheetId: string, sheetId: string) => {
  const response = await fetch(
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&id=${spreadsheetId}&gid=${sheetId}`,
    { cache: "no-store" },
  );

  const data = await response.text();
  

  const rows = data.split("\n").splice(1).map((row) => row.split(","));
  return rows;
};

export { getGSheet };
