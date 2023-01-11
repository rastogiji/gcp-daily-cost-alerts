const detectSpike = (rows) => {
  if (rows && rows.length === 2) {
    const spike = rows[0].cost - rows[1].cost;

    return spike;
  }
};

module.exports = { detectSpike };
