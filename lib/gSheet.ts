const getDataSheet = async (spreadsheetId: string, sheetId: string) => {
  const response = await fetch(
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&id=${spreadsheetId}&gid=${sheetId}`,
    { cache: "no-store" }
  );

  const data = await response.text();

  const rows = data.split("\n").map((row) => row.split(","));
  const [header, ...rowsWithoutHeader] = rows;
  const dataWithHeader = rowsWithoutHeader.map(
    (row) =>
      row.reduce((acc, cell, index) => {
        acc[header[index].trim() as string] = cell.trim();
        return acc;
      }, {} as { [key: string]: string }) // Add index signature to the object type
  );

  return dataWithHeader;
};

export { getDataSheet };
