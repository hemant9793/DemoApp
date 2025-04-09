export const getRandomColor = () => {
  const colors = [
    '#FFB6C1',
    '#ADD8E6',
    '#90EE90',
    '#FFD700',
    '#DDA0DD',
    '#FFA07A',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
