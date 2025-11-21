/**
 * Sentiment Charts Component
 * Displays sentiment distribution and trend charts
 */

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import '../styles/Components.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const SentimentCharts = ({ stats, feedback }) => {
  // Resolve colors from CSS variables so charts adapt to theme
  const css = typeof window !== 'undefined' ? getComputedStyle(document.documentElement) : null;
  const colorSuccess = (css && css.getPropertyValue('--success-color')) || '#4CAF50';
  const colorDanger = (css && css.getPropertyValue('--danger-color')) || '#f44336';
  const colorWarning = (css && css.getPropertyValue('--warning-color')) || '#FFC107';
  const colorPrimary = (css && css.getPropertyValue('--primary-color')) || '#2c3e50';

  const hexToRgba = (hex, alpha = 0.12) => {
    try {
      const h = hex.replace('#', '').trim();
      const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } catch (e) {
      return `rgba(0,0,0,${alpha})`;
    }
  };

  // Sentiment Distribution Data
  const distributionData = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [
      {
        data: [stats.positive, stats.negative, stats.neutral],
        // use semi-transparent fills for pie so colors are not too overpowering
        backgroundColor: [hexToRgba(colorSuccess, 0.72), hexToRgba(colorDanger, 0.72), hexToRgba(colorWarning, 0.72)],
        borderColor: [hexToRgba(colorSuccess, 0.95), hexToRgba(colorDanger, 0.95), hexToRgba(colorWarning, 0.95)],
        borderWidth: 1,
      },
    ],
  };

  // Sentiment Statistics Data
  const statsData = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [
      {
        label: 'Count',
        data: [stats.positive, stats.negative, stats.neutral],
        backgroundColor: [hexToRgba(colorSuccess, 0.12), hexToRgba(colorDanger, 0.12), hexToRgba(colorWarning, 0.12)],
        borderColor: [hexToRgba(colorSuccess, 0.9), hexToRgba(colorDanger, 0.9), hexToRgba(colorWarning, 0.9)],
        borderRadius: 5,
      },
    ],
  };

  // Sentiment Trend (grouped by date)
  const trendData = feedback.reduce((acc, item) => {
    const date = new Date(item.createdAt).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { positive: 0, negative: 0, neutral: 0 };
    }
    acc[date][item.sentiment.label.toLowerCase()] += 1;
    return acc;
  }, {});

  const trendChartData = {
    labels: Object.keys(trendData).slice(-7), // Last 7 days
    datasets: [
      {
        label: 'Positive',
        data: Object.values(trendData)
          .slice(-7)
          .map((d) => d.positive),
        borderColor: hexToRgba(colorSuccess, 0.95),
        backgroundColor: hexToRgba(colorSuccess, 0.12),
        tension: 0.4,
      },
      {
        label: 'Negative',
        data: Object.values(trendData)
          .slice(-7)
          .map((d) => d.negative),
        borderColor: hexToRgba(colorDanger, 0.95),
        backgroundColor: hexToRgba(colorDanger, 0.12),
        tension: 0.4,
      },
      {
        label: 'Neutral',
        data: Object.values(trendData)
          .slice(-7)
          .map((d) => d.neutral),
        borderColor: hexToRgba(colorWarning, 0.95),
        backgroundColor: hexToRgba(colorWarning, 0.12),
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    elements: {
      arc: {
        borderWidth: 1,
      },
    },
  };

  return (
    <div className="sentiment-charts">
      {/* Summary Stats */}
      <div className="stats-summary">
        <div className="stat-card positive">
          <div className="stat-value">{stats.positive || 0}</div>
          <div className="stat-label">Positive</div>
          <div className="stat-percentage">{stats.positivePercentage ?? 0}%</div>
        </div>
        <div className="stat-card negative">
          <div className="stat-value">{stats.negative || 0}</div>
          <div className="stat-label">Negative</div>
          <div className="stat-percentage">{stats.negativePercentage ?? 0}%</div>
        </div>
        <div className="stat-card neutral">
          <div className="stat-value">{stats.neutral || 0}</div>
          <div className="stat-label">Neutral</div>
          <div className="stat-percentage">{stats.neutralPercentage ?? 0}%</div>
        </div>
        <div className="stat-card overall">
          <div className="stat-value">{Number(stats.averageScore || 0).toFixed(2)}</div>
          <div className="stat-label">Avg Score</div>
          <div className="stat-percentage">-1 to +1</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Pie Chart */}
        <div className="chart-container">
          <h3>Sentiment Distribution</h3>
          <div className="chart">
            <Pie data={distributionData} options={chartOptions} />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="chart-container">
          <h3>Sentiment Breakdown</h3>
          <div className="chart">
            <Bar data={statsData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="chart-container full-width">
        <h3>Sentiment Trend (Last 7 Days)</h3>
        <div className="chart">
          <Line data={trendChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default SentimentCharts;
