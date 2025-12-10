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
import { 
  getScatterPlotData, 
  getLineChartData, 
  getBarChartData, 
  getAvailableYears, 
  getAvailableRegions,
  getRainfallScatterByRegion,
  getPopulationScatterAllRegions 
} from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const FACTORS = [
  { id: 'rainfall', name: 'Curah Hujan' },
  { id: 'population_density', name: 'Kepadatan Penduduk' },
];

// Color palette for different regions
const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0',
  '#a4de6c', '#d0ed57', '#ffc0cb', '#b8860b', '#ff6347', '#4682b4',
  '#9370db', '#3cb371', '#f4a460', '#2e8b57', '#dda0dd', '#ff69b4',
  '#cd853f', '#7b68ee', '#48d1cc', '#c71585', '#00ced1', '#ff1493',
  '#1e90ff', '#ff8c00', '#32cd32', '#ba55d3', '#00fa9a', '#dc143c'
];

function Visualizations() {
  const [scatterData, setScatterData] = useState(null);
  const [rainfallScatterData, setRainfallScatterData] = useState(null);
  const [populationScatterData, setPopulationScatterData] = useState(null);
  const [lineData, setLineData] = useState(null);
  const [barData, setBarData] = useState(null);
  const [selectedFactor, setSelectedFactor] = useState('rainfall');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [availableRegions, setAvailableRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const yearsData = await getAvailableYears();
        setAvailableYears(yearsData.years);
        setSelectedYear(yearsData.default);
      } catch (err) {
        console.error('Error fetching years:', err);
        setSelectedYear(2024);
      }
    };
    fetchYears();
  }, []);

  useEffect(() => {
    const fetchRegions = async () => {
      if (!selectedYear) return;
      try {
        const regionsData = await getAvailableRegions(selectedYear);
        setAvailableRegions(regionsData.regions);
        if (regionsData.regions.length > 0) {
          setSelectedRegion(regionsData.regions[0]);
        }
      } catch (err) {
        console.error('Error fetching regions:', err);
      }
    };
    fetchRegions();
  }, [selectedYear]);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedYear) return;
      
      try {
        setLoading(true);
        const [line, bar, popScatter] = await Promise.all([
          getLineChartData(selectedYear),
          getBarChartData(selectedYear),
          getPopulationScatterAllRegions(selectedYear),
        ]);
        setLineData(line);
        setBarData(bar);
        setPopulationScatterData(popScatter);
      } catch (err) {
        setError('Gagal memuat data visualisasi. Pastikan backend berjalan.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedYear]);

  useEffect(() => {
    const fetchRainfallScatter = async () => {
      if (!selectedYear || !selectedRegion) return;
      
      try {
        const rainScatter = await getRainfallScatterByRegion(selectedRegion, selectedYear);
        setRainfallScatterData(rainScatter);
      } catch (err) {
        console.error('Error fetching rainfall scatter:', err);
      }
    };
    fetchRainfallScatter();
  }, [selectedRegion, selectedYear]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  const rainfallChartData = rainfallScatterData?.x.map((x, i) => ({
    x,
    y: rainfallScatterData.y[i],
    label: rainfallScatterData.labels[i],
  }));

  const populationChartData = populationScatterData?.series.map((series, index) => ({
    name: series.name,
    data: series.data,
    color: COLORS[index % COLORS.length]
  }));

  const lineChartData = lineData?.labels.map((label, i) => ({
    month: label,
    cases: lineData.datasets.total_cases[i],
    rainfall: lineData.datasets.rainfall[i],
  }));

  const barChartData = barData?.labels.map((label, i) => ({
    month: label,
    primary: barData.primary_importance[i] * 100,
    secondary: barData.secondary_importance[i] * 100,
    tertiary: barData.tertiary_importance[i] * 100,
    factor: barData.primary_factors[i],
  }));

  const RainfallTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ 
          backgroundColor: 'white', 
          padding: '10px', 
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}>
          <p className="label" style={{ fontWeight: 'bold' }}>{`${payload[0].payload.label}`}</p>
          <p>{`Curah Hujan: ${payload[0].value.toFixed(2)} mm`}</p>
          <p>{`Kasus: ${payload[0].payload.y.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  const PopulationTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip" style={{ 
          backgroundColor: 'white', 
          padding: '10px', 
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}>
          <p className="label" style={{ fontWeight: 'bold' }}>{data.name || 'Region'}</p>
          <p>{`Kepadatan Penduduk: ${data.x?.toFixed(2) || data.payload?.x?.toFixed(2)} per km²`}</p>
          <p>{`Total Kasus: ${(data.y || data.payload?.y)?.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="visualizations">
      <h2 className="page-title">Visualisasi Data ML</h2>
      <p className="page-subtitle">
        Visualisasi hasil analisis menggunakan Random Forest Regressor dengan feature selection (Mutual Information, RFE, Lasso/Ridge) - Tahun {selectedYear}
      </p>

      <div className="year-selector" style={{ marginBottom: '1rem' }}>
        <label htmlFor="year-select" style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>
          Pilih Tahun:
        </label>
        <select
          id="year-select"
          value={selectedYear || ''}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="visualization-section">
        <div className="section-header">
          <h3>📈 Scatter Plot: Curah Hujan vs Kasus DBD</h3>
          <div className="factor-selector">
            <label>Pilih Kabupaten/Kota:</label>
            <select
              value={selectedRegion || ''}
              onChange={(e) => setSelectedRegion(e.target.value)}
              style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc', minWidth: '200px' }}
            >
              {availableRegions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
          Menampilkan hubungan antara curah hujan dan kasus DBD untuk {selectedRegion} pada tahun {selectedYear}
        </p>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="x"
                name="Curah Hujan"
                label={{ value: 'Curah Hujan (mm)', position: 'bottom' }}
              />
              <YAxis
                dataKey="y"
                name="Kasus Bulanan"
                label={{ value: 'Kasus Bulanan', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<RainfallTooltip />} />
              <Legend />
              <Scatter
                name={`${selectedRegion}`}
                data={rainfallChartData}
                fill="#8884d8"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="visualization-section">
        <div className="section-header">
          <h3>📊 Scatter Plot: Kepadatan Penduduk vs Kasus DBD (Semua Kabupaten/Kota)</h3>
        </div>
        <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
          Menampilkan hubungan antara kepadatan penduduk dan total kasus DBD untuk semua kabupaten/kota pada tahun {selectedYear}. 
          Setiap warna mewakili kabupaten/kota yang berbeda.
        </p>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={500}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="x"
                name="Kepadatan Penduduk"
                label={{ value: 'Kepadatan Penduduk (per km²)', position: 'bottom' }}
                type="number"
              />
              <YAxis
                dataKey="y"
                name="Total Kasus"
                label={{ value: 'Total Kasus Tahunan', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<PopulationTooltip />} />
              <Legend 
                wrapperStyle={{ maxHeight: '150px', overflowY: 'auto' }}
                layout="horizontal"
                verticalAlign="top"
              />
              {populationChartData?.map((series, index) => (
                <Scatter
                  key={series.name}
                  name={series.name}
                  data={series.data}
                  fill={series.color}
                />
              ))}
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
                dot={{ r: 4 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="rainfall"
                stroke="#82ca9d"
                name="Curah Hujan (mm)"
                strokeWidth={2}
                dot={{ r: 4 }}
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
