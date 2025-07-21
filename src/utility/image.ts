export const getImageWithPlayerId = (id: string | number) => {
  return `https://chaquen.s3.amazonaws.com/players/${id}.png`;
};

export const getBannersFromFilename = (name: string) => {
  return `https://chaquen.s3.amazonaws.com/${name}`;
};

export const updateQueryToUrl = (path: string) => {
  if (!path) {
    return "/";
  }
  return path.replace(/_+/g, "/");
};
