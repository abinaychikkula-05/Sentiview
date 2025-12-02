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
  // Define explicit colors for better visibility
  const colorPositive = '#22C55E'; // Bright Green
  const colorNegative = '#EF4444'; // Bright Red
  const colorNeutral = '#FBBF24'; // Bright Yellow
  
  // Chart text colors based on theme
  const textColor = '#1e293b';
  const gridColor = 'rgba(0, 0, 0, 0.1)';

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
        backgroundColor: [colorPositive, colorNegative, colorNeutral],
        borderColor: [colorPositive, colorNegative, colorNeutral],
        borderWidth: 2,
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
        backgroundColor: [hexToRgba(colorPositive, 0.8), hexToRgba(colorNegative, 0.8), hexToRgba(colorNeutral, 0.8)],
        borderColor: [colorPositive, colorNegative, colorNeutral],
        borderWidth: 2,
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
        borderColor: colorPositive,
        backgroundColor: hexToRgba(colorPositive, 0.1),
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: 'Negative',
        data: Object.values(trendData)
          .slice(-7)
          .map((d) => d.negative),
        borderColor: colorNegative,
        backgroundColor: hexToRgba(colorNegative, 0.1),
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: 'Neutral',
        data: Object.values(trendData)
          .slice(-7)
          .map((d) => d.neutral),
        borderColor: colorNeutral,
        backgroundColor: hexToRgba(colorNeutral, 0.1),
        borderWidth: 2,
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
        labels: {
          color: textColor,
          font: {
            family: "'Inter', sans-serif",
            size: 14,
            weight: 700
          }
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1e293b',
        bodyColor: '#64748b',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        titleFont: {
          size: 14,
          weight: 700
        },
        bodyFont: {
          size: 13
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: textColor,
          font: {
            size: 12,
            weight: 600
          }
        },
        grid: {
          color: gridColor,
        }
      },
      y: {
        ticks: {
          color: textColor,
          font: {
            size: 12,
            weight: 600
          }
        },
        grid: {
          color: gridColor,
        }
      }
    },
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: '#ffffff',
      },
      line: {
        borderWidth: 3
      },
      point: {
        radius: 4,
        hoverRadius: 6
      }
    },
  };
  
  // Pie chart doesn't need scales
  const pieOptions = {
    ...chartOptions,
    scales: {},
  };

  return (
    <div className="sentiment-charts">
      {/* Summary Stats */}
      <div className="stats-summary">
        <div className="sentiment-card positive">
          <div className="stat-value">{stats.positive || 0}</div>
          <div className="stat-label">Positive</div>
          <div className="stat-percentage">{stats.positivePercentage ?? 0}%</div>
        </div>
        <div className="sentiment-card negative">
          <div className="stat-value">{stats.negative || 0}</div>
          <div className="stat-label">Negative</div>
          <div className="stat-percentage">{stats.negativePercentage ?? 0}%</div>
        </div>
        <div className="sentiment-card neutral">
          <div className="stat-value">{stats.neutral || 0}</div>
          <div className="stat-label">Neutral</div>
          <div className="stat-percentage">{stats.neutralPercentage ?? 0}%</div>
        </div>
        <div className="sentiment-card overall">
          <div className="stat-value">{Number(stats.averageScore || 0).toFixed(2)}</div>
          <div className="stat-label">Avg Score</div>
          <div className="stat-percentage">-1 to +1</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Pie Chart */}
        <div className="chart-container">
          <h3 className="chart-title distribution">Sentiment Distribution</h3>
          <div className="chart">
            <Pie data={distributionData} options={pieOptions} />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="chart-container">
          <h3 className="chart-title breakdown">Sentiment Breakdown</h3>
          <div className="chart">
            <Bar data={statsData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="chart-container full-width">
        <h3 className="chart-title trend">Sentiment Trend (Last 7 Days)</h3>
        <div className="chart">
          <Line data={trendChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default SentimentCharts;
