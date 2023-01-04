import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";


export default function PopularDomains() {
  const [data, setData] = useState<{
    rankedDomains: {
      rank: string;
      rankChange: string;
      domain: string;
      category: string;
    }[];
  }>();

  useEffect(() => {
    fetch("https://cf-assignment.camk.workers.dev/popular-domains")
      .then((r) => r.json())
      .then((d) => setData(d));
  }, []);
  return (
    <Table striped hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Change</th>
          <th>Domain</th>
          <th>Category</th>
        </tr>
      </thead>
      <tbody>
        {data &&
          data.rankedDomains.map((d, i) => {
            const rank = parseInt(d.rank) + 1;
            const change = parseInt(d.rankChange);
            return (
              <tr key={i}>
                <td>{rank}</td>
                <td
                  className={`${change !== 0 && 'fw-bold'} ${change > 0 && "text-success"} ${
                    change < 0 && "text-danger"
                  }`}
                >
                  {change > 0 ? "↑" : change < 0 ? "↓" : "—"} {change}
                </td>
                <td>{d.domain}</td>
                <td>{d.category}</td>
              </tr>
            );
          })}
      </tbody>
    </Table>
  );
}