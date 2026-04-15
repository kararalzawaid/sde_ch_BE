export const getStartIndex = (page: number, limit: number) => {
  return (page - 1) * limit;
};
