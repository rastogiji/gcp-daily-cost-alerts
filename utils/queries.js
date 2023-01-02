const table = process.env.BQ_TABLE_NAME;

const total_cost_query = `SELECT
    SUM(cost) as cost,
    EXTRACT(DATE FROM usage_start_time) AS day
  FROM
    \`${table}\`
  WHERE
    EXTRACT(DATE FROM usage_start_time) = EXTRACT(DATE FROM CURRENT_TIMESTAMP())-1 OR
    EXTRACT(DATE FROM usage_start_time) = EXTRACT(DATE FROM CURRENT_TIMESTAMP())-2
  GROUP BY 
    2
  ORDER BY
    2 DESC`;

module.exports = { total_cost_query };
