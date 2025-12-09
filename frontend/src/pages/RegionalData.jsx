import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { getRegionalData } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

function RegionalData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getRegionalData();
        setData(result);
      } catch (err) {
        setError('Gagal memuat data regional. Pastikan backend berjalan.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  const barChartData = data.map((item) => ({
    province: item.province,
    cases: item.total_cases_2023,
    importance: item.factor_importance * 100,
  }));

  const pieChartData = data.map((item) => ({
    name: item.province,
    value: item.total_cases_2023,
  }));

  return (
    <div className="regional-data">
      <h2 className="page-title">Data Regional per Kabupaten/Kota</h2>
      <p className="page-subtitle">
        Analisis kasus DBD dan faktor dominan untuk setiap kabupaten/kota di Jawa Barat
      </p>

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Kasus DBD per Kabupaten/Kota 2024</h3>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={barChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="province" type="category" width={150} />
              <Tooltip formatter={(value) => value.toLocaleString()} />
              <Legend />
              <Bar dataKey="cases" name="Total Kasus" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Distribusi Kasus per Kabupaten/Kota</h3>
          <ResponsiveContainer width="100%" height={500}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => (percent * 100 > 5 ? `${name}: ${(percent * 100).toFixed(0)}%` : '')}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value.toLocaleString()} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="table-container">
        <h3>Detail Data Regional</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Kabupaten/Kota</th>
              <th>Total Kasus 2024</th>
              <th>Faktor Dominan</th>
              <th>Factor Importance</th>
              <th>Kepadatan Penduduk</th>
              <th>Curah Hujan Rata-rata</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.province}>
                <td>{item.province}</td>
                <td>{item.total_cases_2023.toLocaleString()}</td>
                <td>
                  <span className="factor-badge">{item.dominant_factor}</span>
                </td>
                <td>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${item.factor_importance * 100}%` }}
                    ></div>
                    <span>{(item.factor_importance * 100).toFixed(0)}%</span>
                  </div>
                </td>
                <td>{item.population_density.toLocaleString()}/km²</td>
                <td>{item.avg_rainfall.toFixed(1)} mm</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="info-section">
        <h3>📋 Insight Regional</h3>
        <ul>
          <li>
            Data menunjukkan variasi kasus DBD di berbagai kabupaten/kota di Jawa Barat
          </li>
          <li>
            <strong>Curah Hujan</strong> merupakan faktor dominan yang mempengaruhi kasus DBD di sebagian besar wilayah
          </li>
          <li>
            Kepadatan penduduk juga berperan penting dalam penyebaran kasus DBD di wilayah urban
          </li>
        </ul>
      </div>
    </div>
  );
}

export default RegionalData;
