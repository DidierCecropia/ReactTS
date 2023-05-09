import { useState } from "react";
import {
  Button,
  Col,
  Container,
  FormControl,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";

import { useFetchCSV } from "../../hooks/useFetch";

interface Stock {
  name: string;
  symbol: string;
  ipoDate: string;
  exchange: string;
}

interface RowData {
  name: string;
  symbol: string;
  ipoDate: string;
  exchange: string;
}

const TableComponent = () => {
  const apiKey = "H9N5559EFFVT7QEJ";
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sortedField, setSortedField] = useState<keyof RowData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(20);
  const { loading, data, error } = useFetchCSV<Stock[]>(
    `https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=${apiKey}`
  );

  let rows: RowData[] = [];

  if (data) {
    rows = data.filter((stock) =>
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const sortedRows = [...rows].sort((a, b) => {
    if (sortDirection === "asc" && sortedField) {
      return a[sortedField] > b[sortedField] ? 1 : -1;
    } else if (sortDirection === "desc" && sortedField) {
      return a[sortedField] < b[sortedField] ? 1 : -1;
    } else {
      return 0;
    }
  });

  const handleSort = (field: keyof RowData) => {
    if (sortedField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortedField(field);
      setSortDirection("asc");
    }
  };

  const paginateRows = (rows: RowData[]) => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return rows.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(rows.length / rowsPerPage);
  const pageIndicator = `Page ${currentPage} of ${totalPages}`;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <Row className="justify-content-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Row>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Container className="mt-4 d-flex flex-column align-items-center">
      <h1>Stocks Table</h1>
      <Row className="align-self-end">
        <FormControl
          type="text"
          placeholder="Search stock by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Row>
      <Table>
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}>Name</th>
            <th onClick={() => handleSort("symbol")}>Symbol</th>
            <th onClick={() => handleSort("ipoDate")}>
              Initial Public Offering
            </th>
            <th onClick={() => handleSort("exchange")}>Exchange</th>
          </tr>
        </thead>
        <tbody>
          {paginateRows(sortedRows).map((row, i) => (
            <tr key={i}>
              <td>{row.name}</td>
              <td>{row.symbol}</td>
              <td>{row.ipoDate}</td>
              <td>{row.exchange}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Row className="mt-3">
        <Col>
          <Button
            variant="secondary"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </Button>
        </Col>
        <Col className="text-center">{pageIndicator}</Col>
        <Col className="text-end">
          <Button
            variant="secondary"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </Col>
      </Row>
    </Container>
  );
};
export default TableComponent;
