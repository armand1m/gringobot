export const expired = (createdAt: number, timeout: number) => {
  const minute = 60000;
  return Math.floor((Date.now() - createdAt) / minute) >= timeout;
};
