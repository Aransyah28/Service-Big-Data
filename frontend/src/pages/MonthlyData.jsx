import { useState, useEffect } from 'react';
import { getMonthlyResults } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const POPULATION_DENSITY_DIVISOR = 1000000; // Convert to millions

function MonthlyData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getMonthlyResults();
        setData(result);
      } catch (err) {
        setError('Gagal memuat data bulanan. Pastikan backend berjalan.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="monthly-data">
      <h2 className="page-title">Data Hasil ML Bulanan</h2>
      <p className="page-subtitle">
        Detail analisis faktor-faktor yang mempengaruhi kasus DBD untuk setiap bulan
      </p>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Bulan</th>
              <th>Total Kasus</th>
              <th>Faktor Utama</th>
              <th>Importance</th>
              <th>Akurasi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.month}>
                <td>{item.month} {item.year}</td>
                <td>{item.total_cases.toLocaleString()}</td>
                <td>
                  <span className="factor-badge">{item.most_influential_factor}</span>
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
                <td>{(item.prediction_accuracy * 100).toFixed(0)}%</td>
                <td>
                  <button
                    className="btn-detail"
                    onClick={() => setSelectedMonth(selectedMonth === item.month ? null : item.month)}
                  >
                    {selectedMonth === item.month ? 'Tutup' : 'Detail'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedMonth && (
        <div className="detail-modal">
          <div className="detail-content">
            <h3>Detail {selectedMonth} {data.find((d) => d.month === selectedMonth)?.year}</h3>
            {data
              .filter((d) => d.month === selectedMonth)
              .map((item) => (
                <div key={item.month} className="detail-grid">
                  <div className="detail-section">
                    <h4>📊 Faktor Pengaruh</h4>
                    <ul>
                      <li>
                        <strong>1. {item.most_influential_factor}</strong>
                        <span className="importance-badge">
                          {(item.factor_importance * 100).toFixed(0)}%
                        </span>
                      </li>
                      <li>
                        <strong>2. {item.secondary_factor}</strong>
                        <span className="importance-badge secondary">
                          {(item.secondary_importance * 100).toFixed(0)}%
                        </span>
                      </li>
                      <li>
                        <strong>3. {item.tertiary_factor}</strong>
                        <span className="importance-badge tertiary">
                          {(item.tertiary_importance * 100).toFixed(0)}%
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="detail-section">
                    <h4>🌡️ Data Lingkungan</h4>
                    <ul>
                      <li>Suhu Rata-rata: <strong>{item.temperature_avg}°C</strong></li>
                      <li>Kelembaban: <strong>{item.humidity_avg}%</strong></li>
                      <li>Curah Hujan: <strong>{item.rainfall_mm.toFixed(1)} mm</strong></li>
                    </ul>
                  </div>
                  <div className="detail-section">
                    <h4>👥 Data Demografis</h4>
                    <ul>
                      <li>Kepadatan Penduduk: <strong>{(item.population_density / POPULATION_DENSITY_DIVISOR).toFixed(0)} juta/km²</strong></li>
                      <li>Indeks Sanitasi: <strong>{item.sanitation_index}</strong></li>
                      <li>Akses Kesehatan: <strong>{item.healthcare_access}%</strong></li>
                    </ul>
                  </div>
                </div>
              ))}
            <button className="btn-close" onClick={() => setSelectedMonth(null)}>
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MonthlyData;
