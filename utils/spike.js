const detectSpike = (rows) => {
  if (rows && rows.length === 2) {
    const spike = rows[0].cost - rows[1].cost;

    if (spike >= process.env.TOTAL_SPIKE) {
      return spike;
    } else {
      return 0;
    }
  }
};

module.exports = { detectSpike };
