import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { getStatistics, getLineChartData, getFactorSummary } from '../services/api';
import StatCard from '../components/StatCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

function Dashboard() {
  const [statistics, setStatistics] = useState(null);
  const [lineChartData, setLineChartData] = useState(null);
  const [factorSummary, setFactorSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, lineData, factorData] = await Promise.all([
          getStatistics(),
          getLineChartData(),
          getFactorSummary(),
        ]);
        setStatistics(statsData);
        setLineChartData(lineData);
        setFactorSummary(factorData);
      } catch (err) {
        setError('Gagal memuat data. Pastikan backend berjalan.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  const chartData = lineChartData?.labels.map((label, index) => ({
    month: label,
    cases: lineChartData.datasets.total_cases[index],
    rainfall: lineChartData.datasets.rainfall[index],
  }));

  const pieData = factorSummary?.factors.map((factor) => ({
    name: factor.name,
    value: factor.avg_importance * 100,
  }));

  const factorFrequencyData = Object.entries(statistics?.dominant_factor_frequency || {}).map(
    ([name, count]) => ({
      name,
      count,
    })
  );

  return (
    <div className="dashboard">
      <h2 className="page-title">Dashboard Analisis DBD Indonesia</h2>
      <p className="page-subtitle">
        Hasil analisis Machine Learning untuk faktor-faktor yang mempengaruhi kasus Demam Berdarah Dengue
      </p>

      <div className="stats-grid">
        <StatCard
          title="Total Kasus 2023"
          value={statistics?.total_cases_2023?.toLocaleString()}
          icon="📊"
        />
        <StatCard
          title="Rata-rata Bulanan"
          value={statistics?.average_monthly_cases?.toLocaleString()}
          subtitle="kasus per bulan"
          icon="📈"
        />
        <StatCard
          title="Bulan Tertinggi"
          value={statistics?.highest_month?.month}
          subtitle={`${statistics?.highest_month?.cases?.toLocaleString()} kasus`}
          icon="🔺"
        />
        <StatCard
          title="Bulan Terendah"
          value={statistics?.lowest_month?.month}
          subtitle={`${statistics?.lowest_month?.cases?.toLocaleString()} kasus`}
          icon="🔻"
        />
        <StatCard
          title="Akurasi Model"
          value={`${(statistics?.average_prediction_accuracy * 100).toFixed(1)}%`}
          subtitle={statistics?.model_type}
          icon="🎯"
        />
      </div>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Tren Kasus DBD Bulanan 2023</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
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
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Distribusi Importance Faktor</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container full-width">
          <h3>Frekuensi Faktor Dominan per Bulan</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={factorFrequencyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Jumlah Bulan" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="info-section">
        <h3>📋 Ringkasan Analisis</h3>
        <ul>
          <li>
            <strong>Faktor dominan:</strong> Curah Hujan mempengaruhi kasus DBD terutama pada musim hujan
            (November-Maret)
          </li>
          <li>
            <strong>Pola musiman:</strong> Kasus tertinggi terjadi di bulan Maret saat curah hujan mencapai
            puncaknya
          </li>
          <li>
            <strong>Korelasi:</strong> Terdapat korelasi kuat antara curah hujan dan jumlah kasus DBD
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
