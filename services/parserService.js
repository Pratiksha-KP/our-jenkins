exports.extractStages = (content) => {
  const matches = [...content.matchAll(/stage\(['"](.*?)['"]\)/g)];

  return matches.map(m => ({
    name: m[1],
    status: "PENDING"
  }));
};