
import { useEffect, useMemo, useState } from 'react';
import {
  BsSearch,
  BsFunnel,
  BsArrowRight,
  BsShieldCheck,
  BsShieldExclamation,
} from 'react-icons/bs';

function History() {
  const [predictions, setPredictions] = useState([]);
  const [summary, setSummary] = useState({
    total_predictions: 0,
    fraudulent_predictions: 0,
    legitimate_predictions: 0,
  });

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const rowsPerPage = 5;

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError('');

      const [predictionsResponse, summaryResponse] = await Promise.all([
        fetch('http://127.0.0.1:5000/api/predictions'),
        fetch('http://127.0.0.1:5000/api/predictions/summary'),
      ]);

      if (!predictionsResponse.ok || !summaryResponse.ok) {
        throw new Error('Failed to load prediction history.');
      }

      const predictionsData = await predictionsResponse.json();
      const summaryData = await summaryResponse.json();

      setPredictions(predictionsData.predictions || []);

      setSummary({
        total_predictions: summaryData.total_predictions || 0,
        fraudulent_predictions: summaryData.fraudulent_predictions || 0,
        legitimate_predictions: summaryData.legitimate_predictions || 0,
      });
    } catch (err) {
      console.error(err);
      setError('Unable to connect to prediction history.');
    } finally {
      setLoading(false);
    }
  };

  const filteredPredictions = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return predictions.filter((prediction) => {
      const matchesSearch =
        !searchText ||
        String(prediction.prediction_id || '')
          .toLowerCase()
          .includes(searchText) ||
        String(prediction.prediction || '')
          .toLowerCase()
          .includes(searchText);

      const matchesFilter =
        filter === 'All' ||
        String(prediction.prediction || '').toLowerCase() ===
          filter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [predictions, search, filter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPredictions.length / rowsPerPage)
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const currentPredictions = filteredPredictions.slice(
    startIndex,
    endIndex
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  const formatDate = (createdAt) => {
    if (!createdAt) return '—';

    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) return '—';

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (createdAt) => {
    if (!createdAt) return '—';

    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) return '—';

    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatProbability = (prediction) => {
    if (prediction.fraud_probability_percent !== undefined) {
      return `${Number(
        prediction.fraud_probability_percent
      ).toFixed(2)}%`;
    }

    return `${(Number(prediction.fraud_probability || 0) * 100).toFixed(
      2
    )}%`;
  };

  return (
    <div className="page-container history-page">

      {/* =========================================
          HEADER
          ========================================= */}

      <div className="page-header">

        <div>
          <div className="dashboard-eyebrow">
            PREDICTION RECORDS
          </div>

          <h1 className="page-title">
            Prediction History
          </h1>

          <p className="page-subtitle">
            Review previously processed insurance claims and
            their model-generated fraud predictions.
          </p>
        </div>

      </div>

      {/* =========================================
          SUMMARY
          ========================================= */}

      <div className="row g-3 mb-4">

        <div className="col-xl-4 col-md-6">
          <div className="history-summary-card">

            <div className="history-summary-icon history-icon-blue">
              <BsShieldCheck />
            </div>

            <div>
              <div className="history-summary-label">
                Total Predictions
              </div>

              <div className="history-summary-value">
                {summary.total_predictions.toLocaleString()}
              </div>
            </div>

          </div>
        </div>

        <div className="col-xl-4 col-md-6">
          <div className="history-summary-card">

            <div className="history-summary-icon history-icon-red">
              <BsShieldExclamation />
            </div>

            <div>
              <div className="history-summary-label">
                Fraudulent Predictions
              </div>

              <div className="history-summary-value">
                {summary.fraudulent_predictions.toLocaleString()}
              </div>
            </div>

          </div>
        </div>

        <div className="col-xl-4 col-md-6">
          <div className="history-summary-card">

            <div className="history-summary-icon history-icon-green">
              <BsShieldCheck />
            </div>

            <div>
              <div className="history-summary-label">
                Legitimate Predictions
              </div>

              <div className="history-summary-value">
                {summary.legitimate_predictions.toLocaleString()}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* =========================================
          HISTORY TABLE
          ========================================= */}

      <div className="app-card history-card">

        <div className="history-toolbar">

          <div className="history-search">

            <BsSearch />

            <input
              type="text"
              placeholder="Search prediction ID or result..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          <div style={{ position: 'relative' }}>
            <button
              className="history-filter-btn"
              onClick={() =>
                setFilter(filter === 'All' ? 'Fraudulent' : 'All')
              }
            >
              <BsFunnel />
              {filter === 'All' ? 'Filter' : filter}
            </button>
          </div>

        </div>

        {error && (
          <div
            style={{
              padding: '16px 20px',
              margin: '0 0 10px 0',
              borderRadius: '10px',
              background: '#fff1f2',
              color: '#b42318',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        <div className="app-table-wrapper">

          <table className="app-table history-table">

            <thead>
              <tr>
                <th>Prediction ID</th>
                <th>Claim Reference</th>
                <th>Fraud Probability</th>
                <th>Prediction</th>
                <th>Date</th>
                <th>Time</th>
                <th></th>
              </tr>
            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: 'center',
                      padding: '40px',
                    }}
                  >
                    Loading prediction history...
                  </td>
                </tr>

              ) : currentPredictions.length === 0 ? (

                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: 'center',
                      padding: '40px',
                    }}
                  >
                    No prediction records found.
                  </td>
                </tr>

              ) : (

                currentPredictions.map((prediction) => {

                  const result =
                    prediction.prediction === 'Fraudulent'
                      ? 'Fraudulent'
                      : 'Legitimate';

                  return (
                    <tr key={prediction.prediction_id}>

                      <td>
                        <span className="prediction-id">
                          #{prediction.prediction_id}
                        </span>
                      </td>

                      <td>
                        <span className="claim-reference">
                          —
                        </span>
                      </td>

                      <td>
                        <strong>
                          {formatProbability(prediction)}
                        </strong>
                      </td>

                      <td>

                        {result === 'Fraudulent' ? (

                          <span className="status-badge status-danger">
                            <BsShieldExclamation />
                            Fraudulent
                          </span>

                        ) : (

                          <span className="status-badge status-success">
                            <BsShieldCheck />
                            Legitimate
                          </span>

                        )}

                      </td>

                      <td>
                        {formatDate(prediction.created_at)}
                      </td>

                      <td>
                        {formatTime(prediction.created_at)}
                      </td>

                      <td>

                        <button className="history-view-btn">
                          View
                          <BsArrowRight />
                        </button>

                      </td>

                    </tr>
                  );
                })

              )}

            </tbody>

          </table>

        </div>

        {/* =====================================
            PAGINATION
            ===================================== */}

        <div className="history-pagination">

          <span>
            Showing{' '}
            <strong>
              {filteredPredictions.length === 0
                ? 0
                : startIndex + 1}
              –
              {Math.min(endIndex, filteredPredictions.length)}
            </strong>{' '}
            of{' '}
            <strong>
              {filteredPredictions.length.toLocaleString()}
            </strong>
          </span>

          <div className="pagination-buttons">

            <button
              disabled={safeCurrentPage === 1}
              onClick={() =>
                setCurrentPage((page) => Math.max(1, page - 1))
              }
            >
              Previous
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            )
              .slice(0, 3)
              .map((page) => (
                <button
                  key={page}
                  className={
                    safeCurrentPage === page
                      ? 'active-page'
                      : ''
                  }
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

            <button
              disabled={safeCurrentPage === totalPages}
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(totalPages, page + 1)
                )
              }
            >
              Next
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default History;

