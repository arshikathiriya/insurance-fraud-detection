import { useState } from 'react';
import {
  BsShieldCheck,
  BsArrowRight,
  BsArrowCounterclockwise,
  BsInfoCircle,
  BsLightningCharge,
} from 'react-icons/bs';

function Prediction() {
  const initialFormData = {
    ageOfDriver: '',
    gender: '',
    maritalStatus: '',
    safetyRating: '',
    annualIncome: '',
    highEducation: '',
    addressChange: '',
    propertyStatus: '',
    zipCode: '',
    claimDate: '',
    accidentSite: '',
    previousClaims: '',
    witnessPresent: '',
    liabilityPercentage: '',
    channel: '',
    policeReport: '',
    ageOfVehicle: '',
    vehicleCategory: '',
    vehiclePrice: '',
    vehicleColor: '',
    totalClaim: '',
    injuryClaim: '',
    policyDeductible: '',
    annualPremium: '',
    daysOpen: '',
    formDefects: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      if (!formData.claimDate) {
        throw new Error('Please select a claim date.');
      }

      const selectedDate = new Date(
        `${formData.claimDate}T00:00:00`
      );

      if (Number.isNaN(selectedDate.getTime())) {
        throw new Error('Please enter a valid claim date.');
      }

      /*
       * JavaScript getDay():
       * Sunday = 0
       * Monday = 1
       * Tuesday = 2
       * Wednesday = 3
       * Thursday = 4
       * Friday = 5
       * Saturday = 6
       *
       * The notebook uses:
       * Monday = 0 ... Sunday = 6
       *
       * Therefore convert JavaScript's value.
       */
      const jsDay = selectedDate.getDay();

      const claimDayOfWeekNum =
        jsDay === 0 ? 6 : jsDay - 1;

      const claimDayNames = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ];

      const claimDayOfWeek =
        claimDayNames[claimDayOfWeekNum];

      /*
       * Exact structure expected by the final XGBoost model.
       */
      const payload = {
        age_of_driver: Number(formData.ageOfDriver),
        gender: formData.gender,
        marital_status: Number(formData.maritalStatus),
        safety_rating: Number(formData.safetyRating),
        annual_income: Number(formData.annualIncome),
        high_education: Number(formData.highEducation),
        address_change: Number(formData.addressChange),
        property_status: formData.propertyStatus,
        zip_code: String(formData.zipCode),
        claim_day_of_week: claimDayOfWeek,
        accident_site: formData.accidentSite,
        past_num_of_claims: Number(formData.previousClaims),
        witness_present: formData.witnessPresent,
        liab_prct: Number(formData.liabilityPercentage),
        channel: formData.channel,
        police_report: Number(formData.policeReport),
        age_of_vehicle: formData.ageOfVehicle,
        vehicle_category: formData.vehicleCategory,
        vehicle_price: Number(formData.vehiclePrice),
        vehicle_color: formData.vehicleColor,
        total_claim: Number(formData.totalClaim),
injury_claim: Number(formData.injuryClaim),        policy_deductible: Number(formData.policyDeductible),
        annual_premium: Number(formData.annualPremium),
        days_open: Number(formData.daysOpen),
        form_defects: Number(formData.formDefects),

        claim_year: selectedDate.getFullYear(),
        claim_month: selectedDate.getMonth() + 1,
        claim_day: selectedDate.getDate(),
        claim_day_of_week_num: claimDayOfWeekNum,
      };

      const response = await fetch(
        'https://insurance-fraud-backend-qn6g.onrender.com/api/predict',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || 'Prediction failed.'
        );
      }

      const probability =
        Number(data.fraud_probability_percent);

      const isFraudulent =
        data.prediction_value === 1;

      setPrediction({
        result: isFraudulent
          ? 'Fraudulent'
          : 'Legitimate',

        probability: `${probability.toFixed(2)}%`,

        probabilityValue: probability,

        threshold:
          Number(
            data.decision_threshold_percent
          ).toFixed(2),

        predictionValue:
          data.prediction_value,
      });

    } catch (err) {
      setError(
        err.message ||
        'Unable to connect to the prediction service.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setPrediction(null);
    setError('');
  };

  return (
    <div className="page-container prediction-page">

      {/* =========================================
          HEADER
          ========================================= */}

      <div className="page-header">

        <div>

          <div className="dashboard-eyebrow">
            PREDICTION ENGINE
          </div>

          <h1 className="page-title">
            Fraud Prediction
          </h1>

          <p className="page-subtitle">
            Enter claim information to evaluate its potential
            fraud risk using the trained XGBoost model.
          </p>

        </div>

        <div className="prediction-engine-status">
          <span></span>
          XGBoost Model Ready
        </div>

      </div>

      <div className="row g-4">

        {/* =========================================
            FORM
            ========================================= */}

        <div className="col-xl-8">

          <div className="app-card prediction-form-card">

            <div className="app-card-header">

              <div className="prediction-form-title">

                <div className="prediction-form-icon">
                  <BsShieldCheck />
                </div>

                <div>

                  <div className="section-title">
                    Claim Information
                  </div>

                  <div className="section-subtitle">
                    Enter the details required for fraud assessment
                  </div>

                </div>

              </div>

            </div>

            <div className="app-card-body">

              <form onSubmit={handleSubmit}>

                {/* =================================
                    CUSTOMER INFORMATION
                    ================================= */}

                <div className="form-block">

                  <div className="form-block-heading">
                    Customer Information
                  </div>

                  <div className="row g-3">

                    {/* Age */}

                    <div className="col-md-6">

                      <label
                        htmlFor="ageOfDriver"
                        className="form-label-custom"
                      >
                        Age of Driver
                        <span className="required-mark"> *</span>
                      </label>

                      <input
                        id="ageOfDriver"
                        name="ageOfDriver"
                        type="number"
                        min="18"
                        className="form-control"
                        placeholder="Enter driver's age"
                        value={formData.ageOfDriver}
                        onChange={handleChange}
                        required
                      />

                    </div>

                    {/* Gender */}

                    <div className="col-md-6">

                      <label
                        htmlFor="gender"
                        className="form-label-custom"
                      >
                        Gender
                        <span className="required-mark"> *</span>
                      </label>

                      <select
                        id="gender"
                        name="gender"
                        className="form-select"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                      >

                        <option value="">
                          Select gender
                        </option>

                        <option value="M">
                          Male
                        </option>

                        <option value="F">
                          Female
                        </option>

                      </select>

                    </div>

                    {/* Marital Status */}

                    <div className="col-md-6">

                      <label
                        htmlFor="maritalStatus"
                        className="form-label-custom"
                      >
                        Marital Status
                        <span className="required-mark"> *</span>
                      </label>

                      <select
                        id="maritalStatus"
                        name="maritalStatus"
                        className="form-select"
                        value={formData.maritalStatus}
                        onChange={handleChange}
                        required
                      >

                        <option value="">
                          Select status
                        </option>

                        <option value="1">
                          Married
                        </option>

                        <option value="0">
                          Single
                        </option>

                      </select>

                    </div>

                    {/* Safety Rating */}

                    <div className="col-md-6">

                      <label
                        htmlFor="safetyRating"
                        className="form-label-custom"
                      >
                        Safety Rating
                        <span className="required-mark"> *</span>
                      </label>

                      <input
                        id="safetyRating"
                        name="safetyRating"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="Enter safety rating"
                        value={formData.safetyRating}
                        onChange={handleChange}
                        required
                      />

                    </div>

                    {/* Annual Income */}

                    <div className="col-md-6">

                      <label
                        htmlFor="annualIncome"
                        className="form-label-custom"
                      >
                        Annual Income
                        <span className="required-mark"> *</span>
                      </label>

                      <div className="input-with-prefix">

                        <span>₹</span>

                        <input
                          id="annualIncome"
                          name="annualIncome"
                          type="number"
                          min="0"
                          step="0.01"
                          className="form-control"
                          placeholder="Enter annual income"
                          value={formData.annualIncome}
                          onChange={handleChange}
                          required
                        />

                      </div>

                    </div>

                    {/* Higher Education */}

                    <div className="col-md-6">

                      <label
                        htmlFor="highEducation"
                        className="form-label-custom"
                      >
                        Higher Education
                        <span className="required-mark"> *</span>
                      </label>

                      <select
                        id="highEducation"
                        name="highEducation"
                        className="form-select"
                        value={formData.highEducation}
                        onChange={handleChange}
                        required
                      >

                        <option value="">
                          Select
                        </option>

                        <option value="1">
                          Yes
                        </option>

                        <option value="0">
                          No
                        </option>

                      </select>

                    </div>

                    {/* Address Change */}

                    <div className="col-md-6">

                      <label
                        htmlFor="addressChange"
                        className="form-label-custom"
                      >
                        Address Change
                        <span className="required-mark"> *</span>
                      </label>

                      <select
                        id="addressChange"
                        name="addressChange"
                        className="form-select"
                        value={formData.addressChange}
                        onChange={handleChange}
                        required
                      >

                        <option value="">
                          Select
                        </option>

                        <option value="1">
                          Yes
                        </option>

                        <option value="0">
                          No
                        </option>

                      </select>

                    </div>

                    {/* Property Status */}

                    <div className="col-md-6">

                      <label
                        htmlFor="propertyStatus"
                        className="form-label-custom"
                      >
                        Property Status
                        <span className="required-mark"> *</span>
                      </label>

                      <input
                        id="propertyStatus"
                        name="propertyStatus"
                        type="text"
                        className="form-control"
                        placeholder="Enter property status"
                        value={formData.propertyStatus}
                        onChange={handleChange}
                        required
                      />

                    </div>

                    {/* Zip Code */}

                    <div className="col-md-6">

                      <label
                        htmlFor="zipCode"
                        className="form-label-custom"
                      >
                        ZIP Code
                        <span className="required-mark"> *</span>
                      </label>

                      <input
                        id="zipCode"
                        name="zipCode"
                        type="text"
                        className="form-control"
                        placeholder="Enter ZIP code"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                      />

                    </div>

                  </div>

                </div>


                {/* =================================
                    CLAIM & INCIDENT
                    ================================= */}

                <div className="form-block">

                  <div className="form-block-heading">
                    Claim & Incident
                  </div>

                  <div className="row g-3">

                    {/* Claim Date */}

                    <div className="col-md-6">

                      <label
                        htmlFor="claimDate"
                        className="form-label-custom"
                      >
                        Claim Date
                        <span className="required-mark"> *</span>
                      </label>

                      <input
                        id="claimDate"
                        name="claimDate"
                        type="date"
                        className="form-control"
                        value={formData.claimDate}
                        onChange={handleChange}
                        required
                      />

                    </div>

                    {/* Accident Site */}

                    <div className="col-md-6">

                      <label
                        htmlFor="accidentSite"
                        className="form-label-custom"
                      >
                        Accident Site
                        <span className="required-mark"> *</span>
                      </label>

                      <input
                        id="accidentSite"
                        name="accidentSite"
                        type="text"
                        className="form-control"
                        placeholder="Enter accident site"
                        value={formData.accidentSite}
                        onChange={handleChange}
                        required
                      />

                    </div>

                    {/* Previous Claims */}

                    <div className="col-md-6">

                      <label
                        htmlFor="previousClaims"
                        className="form-label-custom"
                      >
                        Previous Claims
                        <span className="required-mark"> *</span>
                      </label>

                      <input
                        id="previousClaims"
                        name="previousClaims"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="Enter previous claims"
                        value={formData.previousClaims}
                        onChange={handleChange}
                        required
                      />

                    </div>

                    {/* Witness */}

                    <div className="col-md-6">

                      <label
                        htmlFor="witnessPresent"
                        className="form-label-custom"
                      >
                        Witness Present
                        <span className="required-mark"> *</span>
                      </label>

                      <select
                        id="witnessPresent"
                        name="witnessPresent"
                        className="form-select"
                        value={formData.witnessPresent}
                        onChange={handleChange}
                        required
                      >

                        <option value="">
                          Select
                        </option>

                        <option value="Yes">
                          Yes
                        </option>

                        <option value="No">
                          No
                        </option>

                      </select>

                    </div>

                    {/* Liability */}

                    <div className="col-md-6">

                      <label
                        htmlFor="liabilityPercentage"
                        className="form-label-custom"
                      >
                        Liability Percentage
                        <span className="required-mark"> *</span>
                      </label>

                      <input
                        id="liabilityPercentage"
                        name="liabilityPercentage"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        className="form-control"
                        placeholder="Enter liability percentage"
                        value={formData.liabilityPercentage}
                        onChange={handleChange}
                        required
                      />

                    </div>

                    {/* Channel */}

                    <div className="col-md-6">

                      <label
                        htmlFor="channel"
                        className="form-label-custom"
                      >
                        Channel
                        <span className="required-mark"> *</span>
                      </label>

                      <input
                        id="channel"
                        name="channel"
                        type="text"
                        className="form-control"
                        placeholder="Enter claim channel"
                        value={formData.channel}
                        onChange={handleChange}
                        required
                      />

                    </div>

                    {/* Police Report */}

                    <div className="col-md-6">

                      <label
                        htmlFor="policeReport"
                        className="form-label-custom"
                      >
                        Police Report
                        <span className="required-mark"> *</span>
                      </label>

                      <select
                        id="policeReport"
                        name="policeReport"
                        className="form-select"
                        value={formData.policeReport}
                        onChange={handleChange}
                        required
                      >

                        <option value="">
                          Select
                        </option>

                        <option value="1">
                          Yes
                        </option>

                        <option value="0">
                          No
                        </option>

                      </select>

                    </div>

                    {/* Form Defects */}

                    <div className="col-md-6">

                      <label
                        htmlFor="formDefects"
                        className="form-label-custom"
                      >
                        Form Defects
                        <span className="required-mark"> *</span>
                      </label>

                      <input
                        id="formDefects"
                        name="formDefects"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="Enter form defects"
                        value={formData.formDefects}
                        onChange={handleChange}
                        required
                      />

                    </div>

                  </div>

                </div>


                {/* =================================
                    VEHICLE INFORMATION
                    ================================= */}

                <div className="form-block">

                  <div className="form-block-heading">
                    Vehicle Information
                  </div>

                  <div className="row g-3">

                    {/* Age of Vehicle */}

                    <div className="col-md-6">

                      <label
                        htmlFor="ageOfVehicle"
                        className="form-label-custom"
                      >
                        Age of Vehicle
                        <span className="required-mark"> *</span>
                      </label>

                      <input
                        id="ageOfVehicle"
                        name="ageOfVehicle"
                        type="text"
                        className="form-control"
                        placeholder="Enter vehicle age"
                        value={formData.ageOfVehicle}
                        onChange={handleChange}
                        required
                      />

                    </div>

                    {/* Vehicle Category */}

                    <div className="col-md-6">

                      <label
                        htmlFor="vehicleCategory"
                        className="form-label-custom"
                      >
                        Vehicle Category
                        <span className="required-mark"> *</span>
                      </label>

                      <select
                        id="vehicleCategory"
                        name="vehicleCategory"
                        className="form-select"
                        value={formData.vehicleCategory}
                        onChange={handleChange}
                        required
                      >

                        <option value="">
                          Select vehicle category
                        </option>

                        <option value="Small">
                          Small
                        </option>

                        <option value="Medium">
                          Medium
                        </option>

                        <option value="Large">
                          Large
                        </option>

                      </select>

                    </div>

                    {/* Vehicle Price */}

                    <div className="col-md-6">

                      <label
                        htmlFor="vehiclePrice"
                        className="form-label-custom"
                      >
                        Vehicle Price
                        <span className="required-mark"> *</span>
                      </label>

                      <div className="input-with-prefix">

                        <span>₹</span>

                        <input
                          id="vehiclePrice"
                          name="vehiclePrice"
                          type="number"
                          min="0"
                          step="0.01"
                          className="form-control"
                          placeholder="Enter vehicle price"
                          value={formData.vehiclePrice}
                          onChange={handleChange}
                          required
                        />

                      </div>

                    </div>

                    {/* Vehicle Color */}

                    <div className="col-md-6">

                      <label
                        htmlFor="vehicleColor"
                        className="form-label-custom"
                      >
                        Vehicle Color
                        <span className="required-mark"> *</span>
                      </label>

                      <input
                        id="vehicleColor"
                        name="vehicleColor"
                        type="text"
                        className="form-control"
                        placeholder="Enter vehicle color"
                        value={formData.vehicleColor}
                        onChange={handleChange}
                        required
                      />

                    </div>

                  </div>

                </div>


                {/* =================================
                    CLAIM FINANCIAL DETAILS
                    ================================= */}

                <div className="form-block">

                  <div className="form-block-heading">
                    Claim Financial Details
                  </div>

                  <div className="row g-3">

                    {/* Total Claim */}

                    <div className="col-md-6">

                      <label
                        htmlFor="totalClaim"
                        className="form-label-custom"
                      >
                        Total Claim Amount
                        <span className="required-mark"> *</span>
                      </label>

                      <div className="input-with-prefix">

                        <span>₹</span>

                        <input
                          id="totalClaim"
                          name="totalClaim"
                          type="number"
                          min="0"
                          step="0.01"
                          className="form-control"
                          placeholder="Enter claim amount"
                          value={formData.totalClaim}
                          onChange={handleChange}
                          required
                        />

                      </div>

                    </div>

                    {/* Injury Claim */}

                    <div className="col-md-6">

                      <label
                        htmlFor="injuryClaim"
                        className="form-label-custom"
                      >
                        Injury Claim
                        <span className="required-mark"> *</span>
                      </label>

                      <input
                        id="injuryClaim"
                        name="injuryClaim"
                        type="text"
                        className="form-control"
                        placeholder="Enter injury claim"
                        value={formData.injuryClaim}
                        onChange={handleChange}
                        required
                      />

                    </div>

                    {/* Policy Deductible */}

                    <div className="col-md-6">

                      <label
                        htmlFor="policyDeductible"
                        className="form-label-custom"
                      >
                        Policy Deductible
                        <span className="required-mark"> *</span>
                      </label>

                      <div className="input-with-prefix">

                        <span>₹</span>

                        <input
                          id="policyDeductible"
                          name="policyDeductible"
                          type="number"
                          min="0"
                          step="0.01"
                          className="form-control"
                          placeholder="Enter deductible"
                          value={formData.policyDeductible}
                          onChange={handleChange}
                          required
                        />

                      </div>

                    </div>

                    {/* Annual Premium */}

                    <div className="col-md-6">

                      <label
                        htmlFor="annualPremium"
                        className="form-label-custom"
                      >
                        Annual Premium
                        <span className="required-mark"> *</span>
                      </label>

                      <div className="input-with-prefix">

                        <span>₹</span>

                        <input
                          id="annualPremium"
                          name="annualPremium"
                          type="number"
                          min="0"
                          step="0.01"
                          className="form-control"
                          placeholder="Enter annual premium"
                          value={formData.annualPremium}
                          onChange={handleChange}
                          required
                        />

                      </div>

                    </div>

                    {/* Days Open */}

                    <div className="col-md-6">

                      <label
                        htmlFor="daysOpen"
                        className="form-label-custom"
                      >
                        Days Open
                        <span className="required-mark"> *</span>
                      </label>

                      <input
                        id="daysOpen"
                        name="daysOpen"
                        type="number"
                        min="0"
                        step="0.01"
                        className="form-control"
                        placeholder="Enter days open"
                        value={formData.daysOpen}
                        onChange={handleChange}
                        required
                      />

                    </div>

                  </div>

                </div>


                {/* =================================
                    INFORMATION
                    ================================= */}

                <div className="app-alert app-alert-info prediction-info">

                  <BsInfoCircle />

                  <div>

                    <strong>
                      Prediction information
                    </strong>

                    <div>
                      The submitted claim information will be
                      evaluated by the trained XGBoost fraud
                      detection model.
                    </div>

                  </div>

                </div>


                {/* =================================
                    ERROR
                    ================================= */}

                {error && (

                  <div
                    className="app-alert"
                    style={{
                      marginTop: '15px',
                      borderColor: '#fecaca',
                      background: '#fff5f5',
                      color: '#b91c1c',
                    }}
                  >

                    <BsInfoCircle />

                    <div>
                      <strong>
                        Prediction Error
                      </strong>

                      <div>
                        {error}
                      </div>
                    </div>

                  </div>

                )}


                {/* =================================
                    ACTIONS
                    ================================= */}

                <div className="prediction-form-actions">

                  <button
                    type="button"
                    className="btn-secondary-custom"
                    onClick={handleReset}
                    disabled={loading}
                  >
                    <BsArrowCounterclockwise />
                    Reset
                  </button>

                  <button
                    type="submit"
                    className="btn-primary-custom"
                    disabled={loading}
                  >

                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>

                        Analyzing...
                      </>
                    ) : (
                      <>
                        <BsLightningCharge />
                        Analyze Claim
                        <BsArrowRight />
                      </>
                    )}

                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>


        {/* =========================================
            RESULT PANEL
            ========================================= */}

        <div className="col-xl-4">

          <div
            className={`prediction-result-card ${
              prediction ? 'has-result' : ''
            }`}
          >

            {!prediction ? (

              <div className="prediction-empty">

                <div className="prediction-empty-icon">
                  <BsShieldCheck />
                </div>

                <div className="prediction-empty-title">
                  Ready for Analysis
                </div>

                <p>
                  Submit the claim information to receive
                  a fraud-risk assessment from the model.
                </p>

                <div className="prediction-empty-status">

                  <span></span>

                  Model available

                </div>

              </div>

            ) : (

              <div className="prediction-result">

                <div className="result-label">
                  MODEL RESULT
                </div>

                <div className="result-icon">
                  <BsShieldCheck />
                </div>

                <div className="result-title">
                  {prediction.result}
                </div>

                <div className="result-description">

                  {prediction.predictionValue === 1
                    ? 'The submitted claim has been classified as potentially fraudulent and may require additional review.'
                    : 'The submitted claim has been classified as legitimate by the model.'
                  }

                </div>

                <div className="risk-score">

                  <div className="risk-score-label">
                    Fraud Probability
                  </div>

                  <div className="risk-score-value">
                    {prediction.probability}
                  </div>

                  <div className="risk-progress">

                    <div
                      className="risk-progress-value"
                      style={{
                        width: `${prediction.probabilityValue}%`,
                      }}
                    ></div>

                  </div>

                </div>

                <div
                  style={{
                    marginTop: '18px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: '#f7f8fa',
                    fontSize: '10px',
                    color: '#667085',
                  }}
                >
                  Decision threshold:{' '}
                  <strong>
                    {prediction.threshold}%
                  </strong>
                </div>

                <div className="result-warning">

                  <BsInfoCircle />

                  <span>
                    This prediction is a model-based assessment
                    and should be reviewed alongside claim evidence.
                  </span>

                </div>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Prediction;