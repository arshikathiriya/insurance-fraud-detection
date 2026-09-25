# Insurance Fraud Detection System

An end-to-end Insurance Fraud Detection web application that uses a trained **XGBoost Machine Learning model** to predict whether an insurance claim is potentially fraudulent or legitimate.

The project consists of a **React + Vite frontend** and a **Flask + Python backend**. The frontend communicates with the backend through REST APIs, while the backend loads the trained XGBoost model and stores prediction history in SQLite.

---

## Live Application

### Frontend

https://insurance-fraud-frontend.vercel.app

### Backend API

https://insurance-fraud-backend-qn6g.onrender.com

### Backend Health Check

https://insurance-fraud-backend-qn6g.onrender.com/api/health

---

## Project Overview

The system allows users to:

- Enter insurance claim information
- Submit the claim for prediction
- Detect whether the claim is potentially fraudulent or legitimate
- View the fraud probability
- View the prediction threshold
- View previous predictions
- View prediction statistics
- View information about the trained machine learning model

The machine learning model used by the backend is **XGBoost**.

---

## How the Application Works

The Insurance Fraud Detection System works in the following steps:

1. The user opens the web application.
2. The user enters the required insurance claim details.
3. The frontend sends the claim information to the Flask backend through a REST API.
4. The backend prepares the input data according to the features required by the trained XGBoost model.
5. The XGBoost model calculates the probability of insurance fraud.
6. The configured decision threshold is applied to determine the prediction.
7. The prediction result is saved in the SQLite database.
8. The result is returned to the frontend.
9. The frontend displays the prediction and fraud probability to the user.
10. Saved predictions can be viewed from the History page and summarized on the Dashboard.

### Application Flow

```text
Enter Insurance Claim Details
            ↓
      Submit Prediction
            ↓
       Flask REST API
            ↓
      Prepare Input Data
            ↓
       XGBoost Model
            ↓
    Calculate Fraud Probability
            ↓
     Apply Decision Threshold
            ↓
     Fraud / Legitimate Result
            ↓
       Save Prediction
            ↓
      Display Result