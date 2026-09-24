
from pathlib import Path
from datetime import datetime
import sqlite3

import joblib
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_swagger_ui import get_swaggerui_blueprint


# ============================================================
# APP CONFIGURATION
# ============================================================

app = Flask(__name__)

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://localhost:5174",
                "http://127.0.0.1:5174",
            ]
        }
    },
)
# ============================================================
# SWAGGER UI CONFIGURATION
# ============================================================

SWAGGER_URL = "/api/docs"
API_URL = "/api/swagger.json"

swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        "app_name": "Insurance Fraud Detection API"
    },
)

app.register_blueprint(
    swaggerui_blueprint,
    url_prefix=SWAGGER_URL,
)

# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = (
    BASE_DIR
    / "models"
    / "insurance_fraud_xgboost_final.pkl"
)

DATABASE_PATH = BASE_DIR / "prediction_history.db"


# ============================================================
# LOAD FINAL XGBOOST MODEL PACKAGE
# ============================================================

if not MODEL_PATH.exists():
    raise FileNotFoundError(
        f"Model file not found: {MODEL_PATH}"
    )

saved_model_data = joblib.load(MODEL_PATH)

model = saved_model_data["model"]
threshold = float(saved_model_data["threshold"])
target_mapping = saved_model_data["target_mapping"]
feature_columns = saved_model_data["feature_columns"]

test_metrics = saved_model_data.get(
    "test_metrics",
    {}
)

best_cv_pr_auc = saved_model_data.get(
    "best_cv_pr_auc"
)

best_parameters = saved_model_data.get(
    "best_parameters",
    {}
)


# ============================================================
# DATABASE INITIALIZATION
# ============================================================

def initialize_database():

    connection = sqlite3.connect(DATABASE_PATH)

    cursor = connection.cursor()

    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS prediction_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            prediction_id TEXT UNIQUE NOT NULL,
            fraud_probability REAL NOT NULL,
            prediction TEXT NOT NULL,
            prediction_value INTEGER NOT NULL,
            decision_threshold REAL NOT NULL,
            created_at TEXT NOT NULL
        )
        """
    )

    connection.commit()
    connection.close()


initialize_database()


# ============================================================
# PREPARE CLAIM
# ============================================================

def prepare_claim(claim_data):

    if not isinstance(claim_data, dict):
        raise ValueError(
            "Request body must contain a JSON object."
        )

    claim = pd.DataFrame([claim_data])

    if "zip_code" in claim.columns:
        claim["zip_code"] = claim["zip_code"].astype("string")

    missing_columns = [
        column
        for column in feature_columns
        if column not in claim.columns
    ]

    if missing_columns:
        raise ValueError(
            "Missing required input columns: "
            + str(missing_columns)
        )

    extra_columns = [
        column
        for column in claim.columns
        if column not in feature_columns
    ]

    if extra_columns:
        claim = claim.drop(
            columns=extra_columns
        )

    claim = claim[feature_columns]

    return claim


# ============================================================
# SAVE PREDICTION
# ============================================================

def save_prediction(
    fraud_probability,
    prediction_label,
    prediction_value,
    decision_threshold,
):

    connection = sqlite3.connect(DATABASE_PATH)

    cursor = connection.cursor()

    created_at = datetime.now().astimezone().isoformat(
        timespec="seconds"
    )

    # Insert temporary valid prediction ID.
    cursor.execute(
        """
        INSERT INTO prediction_history (
            prediction_id,
            fraud_probability,
            prediction,
            prediction_value,
            decision_threshold,
            created_at
        )
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            "TEMP",
            fraud_probability,
            prediction_label,
            prediction_value,
            decision_threshold,
            created_at,
        ),
    )

    database_id = cursor.lastrowid

    prediction_id = f"P-{1000 + database_id}"

    cursor.execute(
        """
        UPDATE prediction_history
        SET prediction_id = ?
        WHERE id = ?
        """,
        (
            prediction_id,
            database_id,
        ),
    )

    connection.commit()
    connection.close()

    return prediction_id, created_at


# ============================================================
# HEALTH CHECK
# ============================================================
# ============================================================
# SWAGGER API SPECIFICATION
# ============================================================

@app.get("/api/swagger.json")
def swagger_json():

    swagger_spec = {
        "openapi": "3.0.3",

        "info": {
            "title": "Insurance Fraud Detection API",
            "description": (
                "API for insurance claim fraud detection "
                "using the trained XGBoost model."
            ),
            "version": "1.0.0",
        },

        "servers": [
            {
                "url": "https://insurance-fraud-backend-qn6g.onrender.com"
            }
        ],

        "paths": {

            "/api/health": {
                "get": {
                    "summary": "Health Check",
                    "description": "Checks whether the API is running.",
                    "responses": {
                        "200": {
                            "description": "API is running."
                        }
                    }
                }
            },

            "/api/model-info": {
                "get": {
                    "summary": "Get Model Information",
                    "description": (
                        "Returns model information, threshold, "
                        "features and evaluation metrics."
                    ),
                    "responses": {
                        "200": {
                            "description": "Model information."
                        }
                    }
                }
            },

            "/api/predict": {
                "post": {
                    "summary": "Predict Insurance Claim",
                    "description": (
                        "Accepts insurance claim information "
                        "and returns the XGBoost fraud prediction."
                    ),

                    "requestBody": {
                        "required": True,

                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "additionalProperties": True
                                }
                            }
                        }
                    },

                    "responses": {
                        "200": {
                            "description": "Prediction successful."
                        },
                        "400": {
                            "description": "Invalid request."
                        },
                        "500": {
                            "description": "Prediction failed."
                        }
                    }
                }
            },

            "/api/predictions": {
                "get": {
                    "summary": "Get Prediction History",
                    "description": (
                        "Returns all predictions stored "
                        "in the SQLite database."
                    ),
                    "responses": {
                        "200": {
                            "description": "Prediction history."
                        }
                    }
                }
            },

            "/api/predictions/summary": {
                "get": {
                    "summary": "Get Prediction Summary",
                    "description": (
                        "Returns total, fraudulent and "
                        "legitimate prediction counts."
                    ),
                    "responses": {
                        "200": {
                            "description": "Prediction summary."
                        }
                    }
                }
            },
        },
    }

    return jsonify(swagger_spec)

@app.get("/api/health")
def health_check():

    return jsonify(
        {
            "status": "online",
            "model": "XGBoost",
            "model_file": MODEL_PATH.name,
            "message": "Insurance fraud detection API is running.",
        }
    )


# ============================================================
# MODEL INFORMATION
# ============================================================

@app.get("/api/model-info")
def model_info():

    return jsonify(
        {
            "model": "XGBoost",
            "model_file": MODEL_PATH.name,
            "threshold": threshold,
            "target_mapping": target_mapping,
            "feature_count": len(feature_columns),
            "feature_columns": feature_columns,
            "best_cv_pr_auc": best_cv_pr_auc,
            "best_parameters": best_parameters,
            "test_metrics": test_metrics,
        }
    )


# ============================================================
# FRAUD PREDICTION
# ============================================================

@app.post("/api/predict")
def predict_claim():

    try:

        data = request.get_json(silent=True)

        if data is None:
            return jsonify(
                {
                    "success": False,
                    "error": "Request must contain JSON data.",
                }
            ), 400

        claim = prepare_claim(data)

        fraud_probability = float(
            model.predict_proba(claim)[0, 1]
        )

        prediction_value = int(
            fraud_probability >= threshold
        )

        prediction_label = target_mapping[
            prediction_value
        ]

        prediction_id, created_at = save_prediction(
            fraud_probability,
            prediction_label,
            prediction_value,
            threshold,
        )

        return jsonify(
            {
                "success": True,
                "prediction_id": prediction_id,
                "fraud_probability": fraud_probability,
                "fraud_probability_percent": round(
                    fraud_probability * 100,
                    2,
                ),
                "decision_threshold": threshold,
                "decision_threshold_percent": round(
                    threshold * 100,
                    2,
                ),
                "prediction": prediction_label,
                "prediction_value": prediction_value,
                "created_at": created_at,
            }
        )

    except ValueError as error:

        return jsonify(
            {
                "success": False,
                "error": str(error),
            }
        ), 400

    except Exception as error:

        return jsonify(
            {
                "success": False,
                "error": "Prediction failed.",
                "details": str(error),
            }
        ), 500


# ============================================================
# GET PREDICTION HISTORY
# ============================================================

@app.get("/api/predictions")
def get_predictions():

    try:

        connection = sqlite3.connect(DATABASE_PATH)

        connection.row_factory = sqlite3.Row

        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT
                prediction_id,
                fraud_probability,
                prediction,
                prediction_value,
                decision_threshold,
                created_at
            FROM prediction_history
            ORDER BY id DESC
            """
        )

        rows = cursor.fetchall()

        connection.close()

        predictions = []

        for row in rows:

            predictions.append(
                {
                    "prediction_id": row["prediction_id"],
                    "fraud_probability": row[
                        "fraud_probability"
                    ],
                    "fraud_probability_percent": round(
                        row["fraud_probability"] * 100,
                        2,
                    ),
                    "prediction": row["prediction"],
                    "prediction_value": row[
                        "prediction_value"
                    ],
                    "decision_threshold": row[
                        "decision_threshold"
                    ],
                    "decision_threshold_percent": round(
                        row["decision_threshold"] * 100,
                        2,
                    ),
                    "created_at": row["created_at"],
                }
            )

        return jsonify(
            {
                "success": True,
                "count": len(predictions),
                "predictions": predictions,
            }
        )

    except Exception as error:

        return jsonify(
            {
                "success": False,
                "error": "Unable to load prediction history.",
                "details": str(error),
            }
        ), 500


# ============================================================
# PREDICTION SUMMARY
# ============================================================

@app.get("/api/predictions/summary")
def get_prediction_summary():

    try:

        connection = sqlite3.connect(DATABASE_PATH)

        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM prediction_history
            """
        )

        total_predictions = cursor.fetchone()[0]

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM prediction_history
            WHERE prediction_value = 1
            """
        )

        fraudulent_predictions = cursor.fetchone()[0]

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM prediction_history
            WHERE prediction_value = 0
            """
        )

        legitimate_predictions = cursor.fetchone()[0]

        connection.close()

        return jsonify(
            {
                "success": True,
                "total_predictions": total_predictions,
                "fraudulent_predictions": fraudulent_predictions,
                "legitimate_predictions": legitimate_predictions,
            }
        )

    except Exception as error:

        return jsonify(
            {
                "success": False,
                "error": "Unable to load prediction summary.",
                "details": str(error),
            }
        ), 500


# ============================================================
# RUN SERVER
# ============================================================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True,
    )