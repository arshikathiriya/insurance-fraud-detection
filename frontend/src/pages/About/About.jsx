
import {
  BsShieldCheck,
  BsCpu,
  BsDatabase,
  BsGraphUpArrow,
  BsBullseye,
  BsInfoCircle,
} from 'react-icons/bs';

function About() {
  return (
    <div className="page-container about-page">

      {/* =========================================
          HEADER
          ========================================= */}

      <div className="page-header">

        <div>
          <div className="dashboard-eyebrow">
            ABOUT THE PROJECT
          </div>

          <h1 className="page-title">
            Insurance Fraud Detection
          </h1>

          <p className="page-subtitle">
            An XGBoost-based machine learning application for
            identifying potentially fraudulent insurance claims.
          </p>
        </div>

      </div>

      {/* =========================================
          HERO
          ========================================= */}

      <div className="about-hero-card">

        <div className="about-hero-icon">
          <BsShieldCheck />
        </div>

        <div className="about-hero-content">

          <div className="about-hero-label">
            PROJECT OVERVIEW
          </div>

          <h2>
            Detecting Suspicious Insurance Claims
          </h2>

          <p>
            This project applies machine learning to insurance
            claim data to classify claims as legitimate or
            potentially fraudulent. The final solution uses
            an XGBoost classifier together with a preprocessing
            pipeline and a selected decision threshold.
          </p>

        </div>

      </div>

      {/* =========================================
          PROJECT INFORMATION
          ========================================= */}

      <div className="row g-4 mt-1">

        <div className="col-xl-7">

          <div className="app-card about-card">

            <div className="app-card-header">

              <div>
                <div className="section-title">
                  What This Application Does
                </div>

                <div className="section-subtitle">
                  From claim information to fraud prediction
                </div>
              </div>

              <div className="about-card-icon">
                <BsGraphUpArrow />
              </div>

            </div>

            <div className="app-card-body">

              <div className="about-text">

                <p>
                  The application accepts insurance claim
                  information and uses the trained machine
                  learning model to estimate the probability
                  of fraud.
                </p>

                <p>
                  The probability is then evaluated using the
                  selected decision threshold to produce the
                  final classification.
                </p>

                <div className="about-result-box">

                  <div className="about-result-icon">
                    <BsBullseye />
                  </div>

                  <div>

                    <strong>
                      Final Prediction
                    </strong>

                    <span>
                      Legitimate or Fraudulent
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* =====================================
            TECHNOLOGY
            ===================================== */}

        <div className="col-xl-5">

          <div className="app-card about-card">

            <div className="app-card-header">

              <div>
                <div className="section-title">
                  Machine Learning Approach
                </div>

                <div className="section-subtitle">
                  Core components of the project
                </div>
              </div>

              <div className="about-card-icon">
                <BsCpu />
              </div>

            </div>

            <div className="app-card-body">

              <div className="about-feature-list">

                <div className="about-feature">

                  <div className="about-feature-icon">
                    <BsCpu />
                  </div>

                  <div>
                    <strong>
                      XGBoost
                    </strong>

                    <span>
                      Classification model
                    </span>
                  </div>

                </div>

                <div className="about-feature">

                  <div className="about-feature-icon">
                    <BsDatabase />
                  </div>

                  <div>
                    <strong>
                      Preprocessing Pipeline
                    </strong>

                    <span>
                      Numerical and categorical preprocessing
                    </span>
                  </div>

                </div>

                <div className="about-feature">

                  <div className="about-feature-icon">
                    <BsBullseye />
                  </div>

                  <div>
                    <strong>
                      Decision Threshold
                    </strong>

                    <span>
                      Used for final claim classification
                    </span>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =========================================
          WORKFLOW
          ========================================= */}

      <div className="app-card about-workflow-card">

        <div className="app-card-header">

          <div>

            <div className="section-title">
              Application Workflow
            </div>

            <div className="section-subtitle">
              How a claim moves through the system
            </div>

          </div>

        </div>

        <div className="app-card-body">

          <div className="about-workflow">

            <div className="workflow-step">

              <div className="workflow-number">
                01
              </div>

              <div>
                <strong>
                  Claim Information
                </strong>

                <span>
                  Insurance claim details are entered into
                  the application.
                </span>
              </div>

            </div>

            <div className="workflow-arrow">
              →
            </div>

            <div className="workflow-step">

              <div className="workflow-number">
                02
              </div>

              <div>
                <strong>
                  Preprocessing
                </strong>

                <span>
                  The input is prepared using the model's
                  preprocessing pipeline.
                </span>
              </div>

            </div>

            <div className="workflow-arrow">
              →
            </div>

            <div className="workflow-step">

              <div className="workflow-number">
                03
              </div>

              <div>
                <strong>
                  XGBoost Prediction
                </strong>

                <span>
                  The trained classifier calculates the
                  fraud probability.
                </span>
              </div>

            </div>

            <div className="workflow-arrow">
              →
            </div>

            <div className="workflow-step">

              <div className="workflow-number">
                04
              </div>

              <div>
                <strong>
                  Final Result
                </strong>

                <span>
                  The claim is classified as legitimate
                  or fraudulent.
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =========================================
          PURPOSE
          ========================================= */}

      <div className="app-alert app-alert-info about-info-alert">

        <BsInfoCircle />

        <div>

          <strong>
            Project Purpose
          </strong>

          <div>
            The application provides a practical interface
            for applying the trained insurance fraud detection
            model to claim information and reviewing its
            prediction results.
          </div>

        </div>

      </div>

    </div>
  );
}

export default About;

