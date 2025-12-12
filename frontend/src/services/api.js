/**
 * Static API Service - No Backend Required
 * Semua data dibaca dari file JSON statis yang di-generate dari training model
 */

// Load static data
let cachedData = null;

const loadStaticData = async () => {
  if (cachedData) return cachedData;
  
  try {
    // Load dari file statis di public/data
    const response = await fetch('/data/ml_results.json');
    cachedData = await response.json();
    return cachedData;
  } catch (error) {
    console.error('Error loading static data:', error);
    throw error;
  }
};

export const getMonthlyResults = async (year = null) => {
  const data = await loadStaticData();
  
  if (year) {
    // Return data untuk tahun tertentu
    return data.data_by_year[year.toString()]?.monthly_results || [];
  }
  
  // Return data untuk default year
  return data.dbd_ml_results;
};

export const getMonthlyResultByMonth = async (month) => {
  const data = await loadStaticData();
  const results = data.dbd_ml_results;
  
  const result = results.find(r => r.month.toLowerCase() === month.toLowerCase());
  if (!result) {
    throw new Error(`Data for month '${month}' not found`);
  }
  
  return result;
};

export const getFactorSummary = async () => {
  const data = await loadStaticData();
  return data.factor_summary;
};

export const getModelInfo = async () => {
  const data = await loadStaticData();
  return data.model_info;
};

export const getRegionalData = async (year = null) => {
  const data = await loadStaticData();
  
  if (year) {
    return data.data_by_year[year.toString()]?.regional_data || [];
  }
  
  return data.regional_data;
};

export const getScatterPlotData = async (factor, year = null) => {
  const data = await loadStaticData();
  
  let results;
  if (year) {
    results = data.data_by_year[year.toString()]?.monthly_results || [];
  } else {
    results = data.dbd_ml_results;
  }
  
  const factorMapping = {
    'rainfall': { field: 'rainfall_mm', label: 'Curah Hujan (mm)' },
    'population_density': { field: 'population_density', label: 'Kepadatan Penduduk (per km²)' }
  };
  
  const mapping = factorMapping[factor];
  if (!mapping) {
    throw new Error(`Invalid factor. Valid options: ${Object.keys(factorMapping).join(', ')}`);
  }
  
  // Sort by x value (factor)
  const dataPoints = results.map(r => ({
    x: r[mapping.field],
    y: r.total_cases,
    label: r.month
  })).sort((a, b) => a.x - b.x);
  
  return {
    x: dataPoints.map(p => p.x),
    y: dataPoints.map(p => p.y),
    labels: dataPoints.map(p => p.label),
    x_label: mapping.label,
    y_label: 'Kasus Bulanan'
  };
};

export const getStatistics = async () => {
  const data = await loadStaticData();
  const results = data.dbd_ml_results;
  
  const totalCases = results.reduce((sum, r) => sum + r.total_cases, 0);
  const avgCases = totalCases / results.length;
  const maxCases = results.reduce((max, r) => r.total_cases > max.total_cases ? r : max);
  const minCases = results.reduce((min, r) => r.total_cases < min.total_cases ? r : min);
  
  // Count dominant factors
  const factorCounts = {};
  results.forEach(r => {
    const factor = r.most_influential_factor;
    factorCounts[factor] = (factorCounts[factor] || 0) + 1;
  });
  
  const avgAccuracy = results.reduce((sum, r) => sum + r.prediction_accuracy, 0) / results.length;
  
  return {
    total_cases_2023: totalCases,
    average_monthly_cases: Math.round(avgCases * 100) / 100,
    highest_month: {
      month: maxCases.month,
      cases: maxCases.total_cases,
      dominant_factor: maxCases.most_influential_factor
    },
    lowest_month: {
      month: minCases.month,
      cases: minCases.total_cases,
      dominant_factor: minCases.most_influential_factor
    },
    dominant_factor_frequency: factorCounts,
    average_prediction_accuracy: Math.round(avgAccuracy * 10000) / 10000,
    model_type: data.model_info.model_type
  };
};

export const getLineChartData = async (year = null) => {
  const data = await loadStaticData();
  
  let results;
  if (year) {
    results = data.data_by_year[year.toString()]?.monthly_results || [];
  } else {
    results = data.dbd_ml_results;
  }
  
  return {
    labels: results.map(r => r.month),
    datasets: {
      total_cases: results.map(r => r.total_cases),
      rainfall: results.map(r => r.rainfall_mm)
    }
  };
};

export const getBarChartData = async (year = null) => {
  const data = await loadStaticData();
  
  let results;
  if (year) {
    results = data.data_by_year[year.toString()]?.monthly_results || [];
  } else {
    results = data.dbd_ml_results;
  }
  
  return {
    labels: results.map(r => r.month),
    primary_importance: results.map(r => r.factor_importance),
    secondary_importance: results.map(r => r.secondary_importance),
    tertiary_importance: results.map(r => r.tertiary_importance),
    primary_factors: results.map(r => r.most_influential_factor)
  };
};

export const getAvailableYears = async () => {
  const data = await loadStaticData();
  const years = data.years;
  
  return {
    years: years,
    min: Math.min(...years),
    max: Math.max(...years),
    default: Math.max(...years)
  };
};

export const getAvailableRegions = async (year = null) => {
  const data = await loadStaticData();
  
  let regionalData;
  if (year) {
    regionalData = data.data_by_year[year.toString()]?.regional_data || [];
  } else {
    regionalData = data.regional_data;
  }
  
  const regions = regionalData.map(r => r.province).sort();
  
  return {
    regions: regions,
    count: regions.length
  };
};

export const getRainfallScatterByRegion = async (region, year = null) => {
  // Note: This function requires raw CSV data which is not available in static mode
  // We'll return a placeholder or empty data
  console.warn('getRainfallScatterByRegion: Raw CSV data not available in static mode');
  
  return {
    x: [],
    y: [],
    labels: [],
    x_label: 'Curah Hujan (mm)',
    y_label: 'Kasus Bulanan'
  };
};

export const getPopulationScatterAllRegions = async (year = null) => {
  const data = await loadStaticData();
  
  let regionalData;
  if (year) {
    regionalData = data.data_by_year[year.toString()]?.regional_data || [];
  } else {
    regionalData = data.regional_data;
  }
  
  const series = regionalData.map(r => ({
    name: r.province,
    data: [{
      x: r.population_density,
      y: r.total_cases_2023,
      name: r.province
    }]
  }));
  
  return {
    series: series,
    x_label: 'Kepadatan Penduduk (per km²)',
    y_label: 'Total Kasus Tahunan'
  };
};

// Default export untuk kompatibilitas
export default {
  getMonthlyResults,
  getMonthlyResultByMonth,
  getFactorSummary,
  getModelInfo,
  getRegionalData,
  getScatterPlotData,
  getStatistics,
  getLineChartData,
  getBarChartData,
  getAvailableYears,
  getAvailableRegions,
  getRainfallScatterByRegion,
  getPopulationScatterAllRegions
};
