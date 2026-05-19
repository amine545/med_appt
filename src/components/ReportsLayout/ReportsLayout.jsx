import './ReportsLayout.css';

const DEFAULT_ROWS = [
  { id: 1, doctorName: 'Dr. John Doe', speciality: 'Cardiology' },
  { id: 2, doctorName: 'Dr. Jane Smith', speciality: 'Dermatology' },
];

const base = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;
const reportPdfHref = `${base}patient_report.pdf`;

/**
 * Reports table: View opens PDF in new tab; Download uses anchor download attribute.
 */
const ReportsLayout = ({ rows = DEFAULT_ROWS }) => {
  const hasRows = Array.isArray(rows) && rows.length > 0;

  return (
    <div className="reports-layout">
      <h1 className="reports-layout__title">Reports</h1>
      <div className="reports-layout__table-wrap">
        {!hasRows ? (
          <p className="reports-layout__empty" role="status">
            No reports are available yet. When your visits are recorded, they will
            appear in this table.
          </p>
        ) : (
        <table className="reports-layout__table">
          <thead>
            <tr>
              <th>Serial Number</th>
              <th>Doctor Name</th>
              <th>Doctor Speciality</th>
              <th>View Report</th>
              <th>Download Report</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.doctorName}</td>
                <td>{row.speciality}</td>
                <td>
                  <a
                    className="reports-layout__btn"
                    href={reportPdfHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Report
                  </a>
                </td>
                <td>
                  <a
                    className="reports-layout__btn"
                    href={reportPdfHref}
                    download="patient_report.pdf"
                  >
                    Download Report
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
};

export default ReportsLayout;
