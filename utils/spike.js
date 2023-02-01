const detectSpike = (rows) => {
  if (rows && rows.length === 2) {
    const spike = rows[0].cost - rows[1].cost;
    const lastDayCost = rows[0].cost;

    return [spike, lastDayCost];
  }
};

module.exports = { detectSpike };
