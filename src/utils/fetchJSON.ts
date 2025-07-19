export const fetchJSON = async (url: string): Promise<any> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}, url: ${url}`);
  }

  return await response.json();
};
