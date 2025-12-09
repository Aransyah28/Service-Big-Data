"""
FastAPI Backend for DBD (Demam Berdarah Dengue) ML Results Visualization
This API serves machine learning analysis results for dengue fever cases in Indonesia
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
import os
import pandas as pd

app = FastAPI(
    title="DBD ML Analysis API",
    description="API untuk menampilkan hasil analisis Machine Learning kasus DBD Indonesia",
    version="1.0.0"
)

# CORS configuration for frontend
# In production, set ALLOWED_ORIGINS environment variable to restrict origins
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

# Load data from JSON file
DATA_FILE = os.path.join(os.path.dirname(__file__), "data", "dbd_ml_results.json")
CSV_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "Kasus_DBD_Gabungan.csv")
NOTEBOOK_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "DBD_analysis_final.ipynb")

def load_data():
    """Load ML results data from JSON file"""
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


# Pydantic models for API responses
class MonthlyResult(BaseModel):
    month: str
    year: int
    total_cases: int
    most_influential_factor: str
    factor_importance: float
    secondary_factor: str
    secondary_importance: float
    tertiary_factor: str
    tertiary_importance: float
    temperature_avg: float
    humidity_avg: float
    rainfall_mm: float
    population_density: float
    sanitation_index: float
    healthcare_access: float
    prediction_accuracy: float


class Factor(BaseModel):
    name: str
    avg_importance: float
    description: str


class FactorSummary(BaseModel):
    factors: List[Factor]


class MLModelInfo(BaseModel):
    model_config = {"protected_namespaces": ()}
    
    model_type: str
    features_used: List[str]
    training_accuracy: float
    test_accuracy: float
    cross_validation_score: float
    total_data_points: int
    training_period: str


class RegionalData(BaseModel):
    province: str
    total_cases_2023: int
    dominant_factor: str
    factor_importance: float
    population_density: int
    avg_rainfall: float


class ScatterPlotData(BaseModel):
    x: List[float]
    y: List[float]
    labels: List[str]
    x_label: str
    y_label: str


@app.get("/")
async def root():
    """Root endpoint with API info"""
    return {
        "message": "Selamat datang di API Analisis ML Kasus DBD Indonesia",
        "version": "1.0.0",
        "description": "API ini menyediakan akses ke data DBD dan hasil analisis Machine Learning",
        "data_source": {
            "csv": "Kasus_DBD_Gabungan.csv",
            "notebook": "DBD_analysis_final.ipynb",
            "years_covered": "2016-2024"
        },
        "endpoints": [
            "/api/monthly-results",
            "/api/factor-summary",
            "/api/model-info",
            "/api/regional-data",
            "/api/scatter-plot/{factor}",
            "/api/statistics",
            "/api/raw-data",
            "/api/raw-data/summary",
            "/api/notebook-info",
            "/api/download/csv",
            "/api/download/notebook"
        ]
    }


@app.get("/api/monthly-results", response_model=List[MonthlyResult])
async def get_monthly_results():
    """Get all monthly ML analysis results"""
    try:
        data = load_data()
        return data["dbd_ml_results"]
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Data file not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid data format")


@app.get("/api/monthly-results/{month}", response_model=MonthlyResult)
async def get_monthly_result_by_month(month: str):
    """Get ML analysis results for a specific month"""
    try:
        data = load_data()
        for result in data["dbd_ml_results"]:
            if result["month"].lower() == month.lower():
                return result
        raise HTTPException(status_code=404, detail=f"Data for month '{month}' not found")
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Data file not found")


@app.get("/api/factor-summary", response_model=FactorSummary)
async def get_factor_summary():
    """Get summary of all factors influencing DBD cases"""
    try:
        data = load_data()
        return data["factor_summary"]
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Data file not found")


@app.get("/api/model-info", response_model=MLModelInfo)
async def get_model_info():
    """Get ML model information"""
    try:
        data = load_data()
        return data["model_info"]
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Data file not found")


@app.get("/api/regional-data", response_model=List[RegionalData])
async def get_regional_data():
    """Get regional DBD data by province"""
    try:
        data = load_data()
        return data["regional_data"]
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Data file not found")


@app.get("/api/scatter-plot/{factor}", response_model=ScatterPlotData)
async def get_scatter_plot_data(factor: str):
    """
    Get scatter plot data for a specific factor vs total cases
    Valid factors: rainfall, humidity, temperature, population_density, sanitation, healthcare
    """
    try:
        data = load_data()
        results = data["dbd_ml_results"]
        
        factor_mapping = {
            "rainfall": ("rainfall_mm", "Curah Hujan (mm)"),
            "humidity": ("humidity_avg", "Kelembaban Rata-rata (%)"),
            "temperature": ("temperature_avg", "Suhu Rata-rata (°C)"),
            "population_density": ("population_density", "Kepadatan Penduduk (per km²)"),
            "sanitation": ("sanitation_index", "Indeks Sanitasi"),
            "healthcare": ("healthcare_access", "Akses Kesehatan (%)")
        }
        
        if factor not in factor_mapping:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid factor. Valid options: {list(factor_mapping.keys())}"
            )
        
        field_name, label = factor_mapping[factor]
        
        x_values = [result[field_name] for result in results]
        y_values = [result["total_cases"] for result in results]
        labels = [result["month"] for result in results]
        
        return ScatterPlotData(
            x=x_values,
            y=y_values,
            labels=labels,
            x_label=label,
            y_label="Total Kasus DBD"
        )
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Data file not found")


@app.get("/api/statistics")
async def get_statistics():
    """Get overall statistics from ML analysis"""
    try:
        data = load_data()
        results = data["dbd_ml_results"]
        
        total_cases = sum(r["total_cases"] for r in results)
        avg_cases = total_cases / len(results)
        max_cases = max(results, key=lambda x: x["total_cases"])
        min_cases = min(results, key=lambda x: x["total_cases"])
        
        # Count dominant factors
        factor_counts = {}
        for result in results:
            factor = result["most_influential_factor"]
            factor_counts[factor] = factor_counts.get(factor, 0) + 1
        
        avg_accuracy = sum(r["prediction_accuracy"] for r in results) / len(results)
        
        return {
            "total_cases_2023": total_cases,
            "average_monthly_cases": round(avg_cases, 2),
            "highest_month": {
                "month": max_cases["month"],
                "cases": max_cases["total_cases"],
                "dominant_factor": max_cases["most_influential_factor"]
            },
            "lowest_month": {
                "month": min_cases["month"],
                "cases": min_cases["total_cases"],
                "dominant_factor": min_cases["most_influential_factor"]
            },
            "dominant_factor_frequency": factor_counts,
            "average_prediction_accuracy": round(avg_accuracy, 4),
            "model_type": data["model_info"]["model_type"]
        }
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Data file not found")


@app.get("/api/line-chart-data")
async def get_line_chart_data():
    """Get data formatted for line chart visualization"""
    try:
        data = load_data()
        results = data["dbd_ml_results"]
        
        months = [r["month"] for r in results]
        total_cases = [r["total_cases"] for r in results]
        rainfall = [r["rainfall_mm"] for r in results]
        humidity = [r["humidity_avg"] for r in results]
        temperature = [r["temperature_avg"] for r in results]
        
        return {
            "labels": months,
            "datasets": {
                "total_cases": total_cases,
                "rainfall": rainfall,
                "humidity": humidity,
                "temperature": temperature
            }
        }
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Data file not found")


@app.get("/api/bar-chart-data")
async def get_bar_chart_data():
    """Get data formatted for bar chart showing factor importance per month"""
    try:
        data = load_data()
        results = data["dbd_ml_results"]
        
        months = [r["month"] for r in results]
        primary_importance = [r["factor_importance"] for r in results]
        secondary_importance = [r["secondary_importance"] for r in results]
        tertiary_importance = [r["tertiary_importance"] for r in results]
        
        primary_factors = [r["most_influential_factor"] for r in results]
        
        return {
            "labels": months,
            "primary_importance": primary_importance,
            "secondary_importance": secondary_importance,
            "tertiary_importance": tertiary_importance,
            "primary_factors": primary_factors
        }
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Data file not found")


@app.get("/api/raw-data")
async def get_raw_data(
    limit: int = 100,
    offset: int = 0,
    province: Optional[str] = None,
    year: Optional[int] = None
):
    """
    Get raw CSV data with optional filtering
    - limit: Maximum number of records to return (default 100, max 1000)
    - offset: Number of records to skip
    - province: Filter by province name
    - year: Filter by year
    """
    try:
        # Load CSV
        df = pd.read_csv(CSV_FILE)
        
        # Apply filters
        if province:
            df = df[df['nama_provinsi'].str.contains(province, case=False, na=False)]
        if year:
            df = df[df['tahun'] == year]
        
        # Get total count before pagination
        total = len(df)
        
        # Apply pagination
        limit = min(limit, 1000)  # Cap at 1000
        df = df.iloc[offset:offset + limit]
        
        # Convert to dict
        records = df.to_dict('records')
        
        return {
            "total": total,
            "limit": limit,
            "offset": offset,
            "count": len(records),
            "data": records
        }
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="CSV file not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading CSV: {str(e)}")


@app.get("/api/raw-data/summary")
async def get_raw_data_summary():
    """Get summary statistics of the raw CSV data"""
    try:
        df = pd.read_csv(CSV_FILE)
        
        return {
            "total_records": len(df),
            "years": {
                "min": int(df['tahun'].min()),
                "max": int(df['tahun'].max()),
                "unique": sorted([int(y) for y in df['tahun'].unique()])
            },
            "provinces": {
                "count": int(df['nama_provinsi'].nunique()),
                "list": sorted(df['nama_provinsi'].unique().tolist())
            },
            "districts": {
                "count": int(df['nama_kabupaten_kota'].nunique())
            },
            "cases": {
                "total": int(df['kasus_bulanan'].sum()),
                "min": int(df['kasus_bulanan'].min()),
                "max": int(df['kasus_bulanan'].max()),
                "mean": float(df['kasus_bulanan'].mean())
            },
            "columns": df.columns.tolist()
        }
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="CSV file not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading CSV: {str(e)}")


@app.get("/api/notebook-info")
async def get_notebook_info():
    """Get information about the Jupyter notebook used for analysis"""
    try:
        with open(NOTEBOOK_FILE, 'r', encoding='utf-8') as f:
            notebook = json.load(f)
        
        # Extract cell information
        cells = notebook.get('cells', [])
        code_cells = [c for c in cells if c.get('cell_type') == 'code']
        markdown_cells = [c for c in cells if c.get('cell_type') == 'markdown']
        
        # Extract imports from first code cell
        imports = []
        if code_cells:
            first_cell_source = ''.join(code_cells[0].get('source', []))
            imports = [line.strip() for line in first_cell_source.split('\n') if line.strip().startswith('import') or line.strip().startswith('from')]
        
        return {
            "notebook_name": "DBD_analysis_final.ipynb",
            "description": "Analisis Machine Learning untuk kasus Demam Berdarah Dengue (DBD) di Indonesia",
            "cells": {
                "total": len(cells),
                "code": len(code_cells),
                "markdown": len(markdown_cells)
            },
            "analysis_steps": [
                "Data Loading & Preprocessing",
                "Feature Engineering (lag features, rolling means)",
                "Feature Selection (Mutual Information, RFE, Wrapper Methods)",
                "Model Training (Random Forest Regressor)",
                "Feature Importance Analysis",
                "Model Evaluation"
            ],
            "libraries_used": imports[:10],
            "model": {
                "type": "Random Forest Regressor",
                "purpose": "Prediksi kasus DBD berdasarkan curah hujan, kepadatan penduduk, dan faktor lainnya"
            }
        }
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Notebook file not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading notebook: {str(e)}")


@app.get("/api/download/csv")
async def download_csv():
    """Download the raw CSV file"""
    if not os.path.exists(CSV_FILE):
        raise HTTPException(status_code=404, detail="CSV file not found")
    return FileResponse(
        path=CSV_FILE,
        filename="Kasus_DBD_Gabungan.csv",
        media_type="text/csv"
    )


@app.get("/api/download/notebook")
async def download_notebook():
    """Download the Jupyter notebook file"""
    if not os.path.exists(NOTEBOOK_FILE):
        raise HTTPException(status_code=404, detail="Notebook file not found")
    return FileResponse(
        path=NOTEBOOK_FILE,
        filename="DBD_analysis_final.ipynb",
        media_type="application/x-ipynb+json"
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
