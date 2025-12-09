import { useState, useEffect } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from 'recharts';
import { getScatterPlotData, getLineChartData, getBarChartData } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const FACTORS = [
  { id: 'rainfall', name: 'Curah Hujan' },
  { id: 'humidity', name: 'Kelembaban' },
  { id: 'temperature', name: 'Suhu' },
  { id: 'population_density', name: 'Kepadatan Penduduk' },
  { id: 'sanitation', name: 'Sanitasi' },
  { id: 'healthcare', name: 'Akses Kesehatan' },
];

function Visualizations() {
  const [scatterData, setScatterData] = useState(null);
  const [lineData, setLineData] = useState(null);
  const [barData, setBarData] = useState(null);
  const [selectedFactor, setSelectedFactor] = useState('rainfall');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [scatter, line, bar] = await Promise.all([
          getScatterPlotData(selectedFactor),
          getLineChartData(),
          getBarChartData(),
        ]);
        setScatterData(scatter);
        setLineData(line);
        setBarData(bar);
      } catch (err) {
        setError('Gagal memuat data visualisasi. Pastikan backend berjalan.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedFactor]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  const scatterChartData = scatterData?.x.map((x, i) => ({
    x,
    y: scatterData.y[i],
    label: scatterData.labels[i],
  }));

  const lineChartData = lineData?.labels.map((label, i) => ({
    month: label,
    cases: lineData.datasets.total_cases[i],
    rainfall: lineData.datasets.rainfall[i],
    humidity: lineData.datasets.humidity[i],
    temperature: lineData.datasets.temperature[i],
  }));

  const barChartData = barData?.labels.map((label, i) => ({
    month: label,
    primary: barData.primary_importance[i] * 100,
    secondary: barData.secondary_importance[i] * 100,
    tertiary: barData.tertiary_importance[i] * 100,
    factor: barData.primary_factors[i],
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${payload[0].payload.label}`}</p>
          <p>{`${scatterData?.x_label}: ${payload[0].value}`}</p>
          <p>{`Kasus: ${payload[0].payload.y.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="visualizations">
      <h2 className="page-title">Visualisasi Data ML</h2>
      <p className="page-subtitle">
        Visualisasi hasil analisis menggunakan Random Forest Regressor dengan feature selection (Mutual Information, RFE, Lasso/Ridge)
      </p>

      <div className="visualization-section">
        <div className="section-header">
          <h3>📈 Scatter Plot: Faktor vs Kasus DBD</h3>
          <div className="factor-selector">
            <label>Pilih Faktor:</label>
            <select
              value={selectedFactor}
              onChange={(e) => setSelectedFactor(e.target.value)}
            >
              {FACTORS.map((factor) => (
                <option key={factor.id} value={factor.id}>
                  {factor.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="x"
                name={scatterData?.x_label}
                label={{ value: scatterData?.x_label, position: 'bottom' }}
              />
              <YAxis
                dataKey="y"
                name="Total Kasus"
                label={{ value: 'Total Kasus DBD', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Scatter
                name={`${scatterData?.x_label} vs Kasus DBD`}
                data={scatterChartData}
                fill="#8884d8"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="visualization-section">
        <h3>📊 Tren Multi-Variabel Bulanan</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="cases"
                stroke="#8884d8"
                name="Total Kasus"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="rainfall"
                stroke="#82ca9d"
                name="Curah Hujan (mm)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="humidity"
                stroke="#ffc658"
                name="Kelembaban (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="visualization-section">
        <h3>📉 Area Chart: Kasus DBD dan Variabel Lingkungan</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="cases"
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
                name="Total Kasus"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="visualization-section">
        <h3>📊 Random Forest Feature Importance per Bulan</h3>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          Feature importance dihitung menggunakan Random Forest Regressor (n_estimators=250) 
          dengan validasi melalui RFE (Recursive Feature Elimination) dan embedded methods (Lasso/Ridge)
        </p>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis label={{ value: 'Importance (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                formatter={(value) => `${value.toFixed(0)}%`}
                labelFormatter={(label) => {
                  const item = barChartData?.find((d) => d.month === label);
                  return `${label} - Faktor: ${item?.factor}`;
                }}
              />
              <Legend />
              <Bar dataKey="primary" name="Faktor Utama" fill="#8884d8" />
              <Bar dataKey="secondary" name="Faktor Sekunder" fill="#82ca9d" />
              <Bar dataKey="tertiary" name="Faktor Tersier" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Visualizations;
