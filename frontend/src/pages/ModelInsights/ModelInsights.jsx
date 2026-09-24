
import { useEffect, useState } from 'react';
import {
  BsCpu,
  BsGraphUpArrow,
  BsBullseye,
  BsShieldCheck,
  BsBarChart,
  BsInfoCircle,
} from 'react-icons/bs';

function ModelInsights() {
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModelInfo();
  }, []);

  const loadModelInfo = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        'http://127.0.0.1:5000/api/model-info'
      );

      if (!response.ok) {
        throw new Error('Failed to load model information.');
      }

      const data = await response.json();
      setModelInfo(data);
    } catch (error) {
      console.error('Model information error:', error);
    } finally {
      setLoading(false);
    }
  };

  const metricsData =
    modelInfo?.test_metrics ||
    modelInfo?.metrics ||
    {};

  const getMetric = (...keys) => {
    for (const key of keys) {
      if (metricsData[key] !== undefined && metricsData[key] !== null) {
        return Number(metricsData[key]);
      }
    }

    return null;
  };

  const formatMetric = (...keys) => {
    const value = getMetric(...keys);

    if (value === null || Number.isNaN(value)) {
      return '—';
    }

    const percentage =
      value <= 1 ? value * 100 : value;

    return `${percentage.toFixed(2)}%`;
  };

  const accuracy = formatMetric(
    'accuracy',
    'Accuracy'
  );

  const precision = formatMetric(
    'precision',
    'Precision'
  );

  const recall = formatMetric(
    'recall',
    'Recall'
  );

  const f1Score = formatMetric(
    'f1',
    'f1_score',
    'f1Score',
    'F1'
  );

  const rocAuc = formatMetric(
    'roc_auc',
    'roc_auc_score',
    'rocAuc',
    'ROC-AUC'
  );

  const prAuc = formatMetric(
    'pr_auc',
    'pr_auc_score',
    'prAuc',
    'PR-AUC'
  );

  const threshold =
    modelInfo?.decision_threshold !== undefined
      ? `${Number(modelInfo.decision_threshold * 100).toFixed(2)}%`
      : modelInfo?.threshold !== undefined
        ? `${Number(modelInfo.threshold * 100).toFixed(2)}%`
        : '—';

  const metrics = [
    {
      label: 'Accuracy',
      value: accuracy,
      icon: <BsBullseye />,
    },
    {
      label: 'Precision',
      value: precision,
      icon: <BsShieldCheck />,
    },
    {
      label: 'Recall',
      value: recall,
      icon: <BsGraphUpArrow />,
    },
    {
      label: 'F1 Score',
      value: f1Score,
      icon: <BsBarChart />,
    },
  ];

  const additionalMetrics = [
    {
      label: 'ROC-AUC',
      value: rocAuc,
    },
    {
      label: 'PR-AUC',
      value: prAuc,
    },
    {
      label: 'Decision Threshold',
      value: threshold,
    },
  ];

  return (
    <div className="page-container model-insights-page">

      {/* =========================================
          HEADER
          ========================================= */}

      <div className="page-header">

        <div>
          <div className="dashboard-eyebrow">
            MODEL ANALYTICS
          </div>

          <h1 className="page-title">
            Model Insights
          </h1>

          <p className="page-subtitle">
            Review the evaluation metrics and model information
            used by the insurance fraud detection system.
          </p>
        </div>

        <div className="model-status-badge">
          <span></span>
          XGBoost Model
        </div>

      </div>

      {/* =========================================
          MODEL OVERVIEW
          ========================================= */}

      <div className="model-overview-card">

        <div className="model-overview-icon">
          <BsCpu />
        </div>

        <div className="model-overview-content">

          <div className="model-overview-label">
            CURRENT MODEL
          </div>

          <h2>
            XGBoost Fraud Detection Model
          </h2>

          <p>
            The project uses an XGBoost classifier with preprocessing
            contained inside the model pipeline. Hyperparameter tuning
            uses stratified cross-validation, while the classification
            threshold is selected separately using validation data.
          </p>

        </div>

      </div>

      {/* =========================================
          PRIMARY METRICS
          ========================================= */}

      <div className="section-heading-row">

        <div>
          <div className="section-title">
            Evaluation Metrics
          </div>

          <div className="section-subtitle">
            Final test-set evaluation
          </div>
        </div>

      </div>

      <div className="row g-3">

        {metrics.map((metric) => (

          <div
            className="col-xl-3 col-md-6"
            key={metric.label}
          >

            <div className="model-metric-card">

              <div className="model-metric-icon">
                {metric.icon}
              </div>

              <div className="model-metric-label">
                {metric.label}
              </div>

              <div className="model-metric-value">
                {loading ? '—' : metric.value}
              </div>

              <div className="model-metric-note">
                Connected from model evaluation
              </div>

            </div>

          </div>

        ))}

      </div>

      {/* =========================================
          ADDITIONAL METRICS
          ========================================= */}

      <div className="row g-4 mt-1">

        <div className="col-xl-5">

          <div className="app-card model-additional-card">

            <div className="app-card-header">

              <div>
                <div className="section-title">
                  Additional Metrics
                </div>

                <div className="section-subtitle">
                  Probability and threshold evaluation
                </div>
              </div>

            </div>

            <div className="app-card-body">

              <div className="additional-metrics-list">

                {additionalMetrics.map((metric) => (

                  <div
                    className="additional-metric-row"
                    key={metric.label}
                  >

                    <span>
                      {metric.label}
                    </span>

                    <strong>
                      {loading ? '—' : metric.value}
                    </strong>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

        {/* =====================================
            MODEL PROCESS
            ===================================== */}

        <div className="col-xl-7">

          <div className="app-card model-process-card">

            <div className="app-card-header">

              <div>
                <div className="section-title">
                  Model Workflow
                </div>

                <div className="section-subtitle">
                  How the final model is prepared and evaluated
                </div>
              </div>

            </div>

            <div className="app-card-body">

              <div className="model-process">

                <div className="model-process-item">

                  <div className="process-number">
                    01
                  </div>

                  <div>
                    <strong>
                      Data Preprocessing
                    </strong>

                    <p>
                      Numerical and categorical data are processed
                      through the model pipeline.
                    </p>
                  </div>

                </div>

                <div className="model-process-line"></div>

                <div className="model-process-item">

                  <div className="process-number">
                    02
                  </div>

                  <div>
                    <strong>
                      XGBoost Training
                    </strong>

                    <p>
                      The classifier is tuned using stratified
                      cross-validation.
                    </p>
                  </div>

                </div>

                <div className="model-process-line"></div>

                <div className="model-process-item">

                  <div className="process-number">
                    03
                  </div>

                  <div>
                    <strong>
                      Threshold Selection
                    </strong>

                    <p>
                      The fraud classification threshold is selected
                      separately using validation data.
                    </p>
                  </div>

                </div>

                <div className="model-process-line"></div>

                <div className="model-process-item">

                  <div className="process-number">
                    04
                  </div>

                  <div>
                    <strong>
                      Final Evaluation
                    </strong>

                    <p>
                      The selected model is evaluated on the untouched
                      test set using multiple classification metrics.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =========================================
          FEATURE IMPORTANCE
          ========================================= */}

      <div className="app-card feature-insights-card">

        <div className="app-card-header">

          <div>

            <div className="section-title">
              Feature Importance
            </div>

            <div className="section-subtitle">
              Top features identified by the trained XGBoost model
            </div>

          </div>

          <div className="feature-header-icon">
            <BsGraphUpArrow />
          </div>

        </div>

        <div className="app-card-body">

          <div className="feature-placeholder">

            <div className="feature-placeholder-icon">
              <BsBarChart />
            </div>

            <div>

              <strong>
                Feature importance
              </strong>

              <p>
                Feature importance values are available from the
                trained XGBoost model package and can be displayed
                here when exposed by the backend model information API.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* =========================================
          INFORMATION NOTE
          ========================================= */}

      <div className="app-alert app-alert-info model-info-alert">

        <BsInfoCircle />

        <div>

          <strong>
            Model evaluation
          </strong>

          <div>
            Accuracy is evaluated together with precision, recall,
            F1-score, ROC-AUC and PR-AUC because fraud detection
            requires more than a single performance measure.
          </div>

        </div>

      </div>

    </div>
  );
}

export default ModelInsights;

