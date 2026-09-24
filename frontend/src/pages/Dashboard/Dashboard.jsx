
import { useEffect, useMemo, useState } from 'react';
import {
  BsArrowUpRight,
  BsShieldExclamation,
  BsShieldCheck,
  BsFileEarmarkText,
  BsActivity,
  BsLightningCharge,
  BsArrowRight,
} from 'react-icons/bs';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [predictions, setPredictions] = useState([]);
  const [summary, setSummary] = useState({
    total_predictions: 0,
    fraudulent_predictions: 0,
    legitimate_predictions: 0,
  });

  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [predictionsResponse, summaryResponse, modelResponse] =
        await Promise.all([
          fetch('http://127.0.0.1:5000/api/predictions'),
          fetch('http://127.0.0.1:5000/api/predictions/summary'),
          fetch('http://127.0.0.1:5000/api/model-info'),
        ]);

      const predictionsData = await predictionsResponse.json();
      const summaryData = await summaryResponse.json();
      const modelData = await modelResponse.json();

      setPredictions(predictionsData.predictions || []);

      setSummary({
        total_predictions: summaryData.total_predictions || 0,
        fraudulent_predictions: summaryData.fraudulent_predictions || 0,
        legitimate_predictions: summaryData.legitimate_predictions || 0,
      });

      setModelInfo(modelData);
    } catch (error) {
      console.error('Dashboard loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const total = summary.total_predictions;
  const fraudulent = summary.fraudulent_predictions;
  const legitimate = summary.legitimate_predictions;

  const fraudPercentage =
    total > 0 ? ((fraudulent / total) * 100).toFixed(1) : '0.0';

  const legitimatePercentage =
    total > 0 ? ((legitimate / total) * 100).toFixed(1) : '0.0';

  const averageRisk = useMemo(() => {
    if (!predictions.length) return 0;

    const totalProbability = predictions.reduce(
      (sum, prediction) =>
        sum + Number(prediction.fraud_probability || 0),
      0
    );

    return ((totalProbability / predictions.length) * 100).toFixed(1);
  }, [predictions]);

  const recentPredictions = predictions.slice(0, 4);

  const formatProcessedTime = (createdAt) => {
    if (!createdAt) return '—';

    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) return '—';

    const secondsAgo = Math.floor(
      (Date.now() - date.getTime()) / 1000
    );

    if (secondsAgo < 60) return 'Just now';

    const minutesAgo = Math.floor(secondsAgo / 60);

    if (minutesAgo < 60) {
      return `${minutesAgo} min ago`;
    }

    const hoursAgo = Math.floor(minutesAgo / 60);

    if (hoursAgo < 24) {
      return `${hoursAgo} hr ago`;
    }

    const daysAgo = Math.floor(hoursAgo / 24);

    return `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`;
  };

  const formatProbability = (prediction) => {
    if (
      prediction.fraud_probability_percent !== undefined
    ) {
      return `${Number(
        prediction.fraud_probability_percent
      ).toFixed(1)}%`;
    }

    return `${(
      Number(prediction.fraud_probability || 0) * 100
    ).toFixed(1)}%`;
  };

  const accuracy =
    modelInfo?.test_metrics?.accuracy !== undefined
      ? Number(modelInfo.test_metrics.accuracy * 100).toFixed(1)
      : '—';

  const precision =
    modelInfo?.test_metrics?.precision !== undefined
      ? Number(modelInfo.test_metrics.precision * 100).toFixed(1)
      : '—';

  const recall =
    modelInfo?.test_metrics?.recall !== undefined
      ? Number(modelInfo.test_metrics.recall * 100).toFixed(1)
      : '—';

  const f1 =
    modelInfo?.test_metrics?.f1 !== undefined
      ? Number(modelInfo.test_metrics.f1 * 100).toFixed(1)
      : '—';

  const rocAuc =
    modelInfo?.test_metrics?.roc_auc !== undefined
      ? Number(modelInfo.test_metrics.roc_auc * 100).toFixed(1)
      : '—';

  return (
    <div className="page-container dashboard-page">

      {/* ================================
          PAGE HEADER
          ================================= */}

      <div className="page-header dashboard-header">

        <div>
          <div className="dashboard-eyebrow">
            INSURANCE INTELLIGENCE
          </div>

          <h1 className="page-title">
            Fraud Detection Dashboard
          </h1>

          <p className="page-subtitle">
            Monitor claim activity, identify potential fraud,
            and review model performance from one place.
          </p>
        </div>

        <Link
          to="/prediction"
          className="btn-primary-custom dashboard-action"
        >
          <BsLightningCharge />
          Run New Prediction
        </Link>

      </div>

      {/* ================================
          KPI CARDS
          ================================= */}

      <div className="row g-3 mb-4">

        {/* Total */}

        <div className="col-xl-3 col-md-6">
          <div className="stat-card">

            <div className="stat-card-top">

              <div className="stat-icon stat-icon-blue">
                <BsFileEarmarkText />
              </div>

              <span className="metric-trend">
                <BsArrowUpRight />
                Live
              </span>

            </div>

            <div className="stat-label">
              Total Predictions
            </div>

            <div className="stat-value">
              {loading ? '—' : total.toLocaleString()}
            </div>

            <div className="stat-description">
              Predictions processed by the system
            </div>

          </div>
        </div>

        {/* Fraud */}

        <div className="col-xl-3 col-md-6">
          <div className="stat-card">

            <div className="stat-card-top">

              <div className="stat-icon stat-icon-red">
                <BsShieldExclamation />
              </div>

              <span className="metric-trend metric-danger">
                {fraudPercentage}%
              </span>

            </div>

            <div className="stat-label">
              Potential Fraud
            </div>

            <div className="stat-value">
              {loading
                ? '—'
                : fraudulent.toLocaleString()}
            </div>

            <div className="stat-description">
              Claims flagged for further review
            </div>

          </div>
        </div>

        {/* Legitimate */}

        <div className="col-xl-3 col-md-6">
          <div className="stat-card">

            <div className="stat-card-top">

              <div className="stat-icon stat-icon-green">
                <BsShieldCheck />
              </div>

              <span className="metric-trend metric-success">
                {legitimatePercentage}%
              </span>

            </div>

            <div className="stat-label">
              Low-Risk Claims
            </div>

            <div className="stat-value">
              {loading
                ? '—'
                : legitimate.toLocaleString()}
            </div>

            <div className="stat-description">
              Claims classified as legitimate
            </div>

          </div>
        </div>

        {/* Average Risk */}

        <div className="col-xl-3 col-md-6">
          <div className="stat-card">

            <div className="stat-card-top">

              <div className="stat-icon stat-icon-orange">
                <BsActivity />
              </div>

              <span className="metric-trend">
                Current
              </span>

            </div>

            <div className="stat-label">
              Average Fraud Risk
            </div>

            <div className="stat-value">
              {loading ? '—' : `${averageRisk}%`}
            </div>

            <div className="stat-description">
              Average predicted fraud probability
            </div>

          </div>
        </div>

      </div>

      {/* ================================
          MAIN ANALYTICS ROW
          ================================= */}

      <div className="row g-3 mb-4">

        {/* Prediction Overview */}

        <div className="col-xl-8">

          <div className="app-card dashboard-chart-card">

            <div className="app-card-header dashboard-card-header">

              <div>
                <div className="section-title">
                  Prediction Overview
                </div>

                <div className="section-subtitle">
                  Distribution of model predictions
                </div>
              </div>

              <div className="chart-period">
                All Predictions
              </div>

            </div>

            <div className="app-card-body">

              <div className="prediction-chart">

                <div className="chart-y-axis">
                  <span>{total}</span>
                  <span>{Math.round(total * 0.66)}</span>
                  <span>{Math.round(total * 0.33)}</span>
                  <span>0</span>
                </div>

                <div className="chart-area">

                  <div className="chart-grid grid-1"></div>
                  <div className="chart-grid grid-2"></div>
                  <div className="chart-grid grid-3"></div>
                  <div className="chart-grid grid-4"></div>

                  <div className="fake-line-chart">

                    <svg
                      viewBox="0 0 700 220"
                      preserveAspectRatio="none"
                    >

                      <defs>
                        <linearGradient
                          id="areaGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#2563eb"
                            stopOpacity="0.16"
                          />

                          <stop
                            offset="100%"
                            stopColor="#2563eb"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>

                      {predictions.length > 0 ? (
                        <>
                          <path
                            d="M0 170 C45 155, 65 162, 105 145 S160 125, 200 142 S250 130, 290 105 S350 118, 390 88 S445 98, 480 75 S530 90, 570 55 S620 72, 660 42 S690 48, 700 35 L700 220 L0 220 Z"
                            fill="url(#areaGradient)"
                          />

                          <path
                            d="M0 170 C45 155, 65 162, 105 145 S160 125, 200 142 S250 130, 290 105 S350 118, 390 88 S445 98, 480 75 S530 90, 570 55 S620 72, 660 42 S690 48, 700 35"
                            fill="none"
                            stroke="#2563eb"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        </>
                      ) : null}

                    </svg>

                  </div>

                  <div className="chart-x-axis">
                    <span>Predictions</span>
                    <span>Fraud</span>
                    <span>Legitimate</span>
                    <span>Total</span>
                  </div>

                </div>

              </div>

              <div className="chart-legend">

                <div className="legend-item">
                  <span className="legend-dot legend-blue"></span>
                  Total predictions
                </div>

                <div className="legend-item">
                  <span className="legend-dot legend-red"></span>
                  Potential fraud
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Model Performance */}

        <div className="col-xl-4">

          <div className="app-card performance-card">

            <div className="app-card-header dashboard-card-header">

              <div>
                <div className="section-title">
                  Model Performance
                </div>

                <div className="section-subtitle">
                  Current XGBoost evaluation
                </div>
              </div>

              <span className="model-live-badge">
                <span></span>
                Active
              </span>

            </div>

            <div className="app-card-body">

              <div className="performance-main">

                <div className="performance-score">

                  <div className="performance-score-value">
                    {accuracy === '—'
                      ? '—'
                      : `${accuracy}%`}
                  </div>

                  <div className="performance-score-label">
                    Accuracy
                  </div>

                </div>

                <div className="performance-ring">
                  <div className="performance-ring-inner">
                    <span>ML</span>
                  </div>
                </div>

              </div>

              <div className="performance-list">

                <div className="performance-row">
                  <span>Precision</span>
                  <strong>
                    {precision === '—'
                      ? '—'
                      : `${precision}%`}
                  </strong>
                </div>

                <div className="performance-row">
                  <span>Recall</span>
                  <strong>
                    {recall === '—'
                      ? '—'
                      : `${recall}%`}
                  </strong>
                </div>

                <div className="performance-row">
                  <span>F1 Score</span>
                  <strong>
                    {f1 === '—'
                      ? '—'
                      : `${f1}%`}
                  </strong>
                </div>

                <div className="performance-row">
                  <span>ROC-AUC</span>
                  <strong>
                    {rocAuc === '—'
                      ? '—'
                      : `${rocAuc}%`}
                  </strong>
                </div>

              </div>

              <Link
                to="/model-insights"
                className="performance-link"
              >
                View complete model insights
                <BsArrowRight />
              </Link>

            </div>

          </div>

        </div>

      </div>

      {/* ================================
          RECENT PREDICTIONS
          ================================= */}

      <div className="app-card recent-predictions">

        <div className="app-card-header dashboard-card-header">

          <div>
            <div className="section-title">
              Recent Predictions
            </div>

            <div className="section-subtitle">
              Latest claims evaluated by the fraud detection model
            </div>
          </div>

          <Link
            to="/history"
            className="view-all-link"
          >
            View all
            <BsArrowRight />
          </Link>

        </div>

        <div className="app-table-wrapper">

          <table className="app-table">

            <thead>
              <tr>
                <th>Prediction ID</th>
                <th>Claim Reference</th>
                <th>Risk Probability</th>
                <th>Classification</th>
                <th>Processed</th>
                <th></th>
              </tr>
            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: 'center',
                      padding: '35px',
                    }}
                  >
                    Loading recent predictions...
                  </td>
                </tr>

              ) : recentPredictions.length === 0 ? (

                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: 'center',
                      padding: '35px',
                    }}
                  >
                    No predictions available yet.
                  </td>
                </tr>

              ) : (

                recentPredictions.map((prediction) => {

                  const isFraudulent =
                    prediction.prediction === 'Fraudulent';

                  return (
                    <tr key={prediction.prediction_id}>

                      <td>
                        <span className="prediction-id">
                          #{prediction.prediction_id}
                        </span>
                      </td>

                      <td>
                        —
                      </td>

                      <td>
                        <strong>
                          {formatProbability(prediction)}
                        </strong>
                      </td>

                      <td>

                        {isFraudulent ? (

                          <span className="status-badge status-danger">
                            <BsShieldExclamation />
                            Potential Fraud
                          </span>

                        ) : (

                          <span className="status-badge status-success">
                            <BsShieldCheck />
                            Legitimate
                          </span>

                        )}

                      </td>

                      <td>
                        {formatProcessedTime(
                          prediction.created_at
                        )}
                      </td>

                      <td>

                        <Link
                          to="/history"
                          className="table-action"
                        >
                          View
                        </Link>

                      </td>

                    </tr>
                  );
                })

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;

