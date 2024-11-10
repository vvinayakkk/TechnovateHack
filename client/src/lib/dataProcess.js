// utils/dataProcessor.js
import Papa from 'papaparse';

export const loadAndProcessCSV = async (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: (results) => {
        const data = results.data;
        resolve(processEnvironmentalData(data));
      },
      header: true,
      dynamicTyping: true,
      error: (error) => reject(error)
    });
  });
};

export const processEnvironmentalData = (data) => {
  // Basic statistics
  const stats = {
    carbonEmission: calculateStats(data, 'CarbonEmission'),
    vehicleDistance: calculateStats(data, 'Vehicle Monthly Distance Km'),
    screenTime: calculateStats(data, 'How Long TV PC Daily Hour'),
    wasteBags: calculateStats(data, 'Waste Bag Weekly Count'),
    dietDistribution: calculateDietDistribution(data),
    transportDistribution: calculateTransportDistribution(data)
  };

  // Correlation analysis
  const correlations = calculateCorrelations(data);

  // Segment analysis
  const segments = analyzeSegments(data);

  return {
    basicStats: stats,
    correlations,
    segments,
    rawData: data
  };
};

const calculateStats = (data, field) => {
  const values = data.map(row => row[field]).filter(val => !isNaN(val));
  const sorted = [...values].sort((a, b) => a - b);
  
  return {
    mean: values.reduce((a, b) => a + b, 0) / values.length,
    median: sorted[Math.floor(sorted.length / 2)],
    min: sorted[0],
    max: sorted[sorted.length - 1],
    stdDev: calculateStdDev(values),
    percentiles: {
      25: sorted[Math.floor(sorted.length * 0.25)],
      75: sorted[Math.floor(sorted.length * 0.75)],
      90: sorted[Math.floor(sorted.length * 0.90)]
    }
  };
};

const calculateStdDev = (values) => {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const squareDiffs = values.map(value => Math.pow(value - mean, 2));
  const variance = squareDiffs.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(variance);
};

const calculateDietDistribution = (data) => {
  const diets = {};
  data.forEach(row => {
    const diet = row[' Diet']?.trim();
    if (diet) {
      diets[diet] = (diets[diet] || 0) + 1;
    }
  });
  return diets;
};

const calculateTransportDistribution = (data) => {
  const transport = {};
  data.forEach(row => {
    const mode = row['Transport']?.trim();
    if (mode) {
      transport[mode] = (transport[mode] || 0) + 1;
    }
  });
  return transport;
};

const calculateCorrelations = (data) => {
  const numericalFields = [
    'CarbonEmission',
    'Vehicle Monthly Distance Km',
    'How Long TV PC Daily Hour',
    'Waste Bag Weekly Count',
    'Monthly Grocery Bill',
    'How Many New Clothes Monthly'
  ];

  const correlations = {};
  numericalFields.forEach(field1 => {
    correlations[field1] = {};
    numericalFields.forEach(field2 => {
      if (field1 !== field2) {
        correlations[field1][field2] = calculateCorrelation(
          data.map(row => row[field1]),
          data.map(row => row[field2])
        );
      }
    });
  });

  return correlations;
};

const calculateCorrelation = (x, y) => {
  const n = x.length;
  const sum1 = x.reduce((a, b) => a + b, 0);
  const sum2 = y.reduce((a, b) => a + b, 0);
  const sum1Sq = x.reduce((a, b) => a + b * b, 0);
  const sum2Sq = y.reduce((a, b) => a + b * b, 0);
  const pSum = x.map((_, i) => x[i] * y[i]).reduce((a, b) => a + b, 0);
  
  const num = pSum - (sum1 * sum2 / n);
  const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));
  
  return num / den;
};

const analyzeSegments = (data) => {
  // Segment by diet type
  const dietSegments = {};
  data.forEach(row => {
    const diet = row[' Diet']?.trim();
    if (diet) {
      if (!dietSegments[diet]) {
        dietSegments[diet] = {
          count: 0,
          totalEmission: 0,
          avgEmission: 0,
          avgVehicleDistance: 0,
          avgWasteBags: 0
        };
      }
      dietSegments[diet].count += 1;
      dietSegments[diet].totalEmission += row.CarbonEmission || 0;
      dietSegments[diet].avgEmission = dietSegments[diet].totalEmission / dietSegments[diet].count;
      dietSegments[diet].avgVehicleDistance += (row['Vehicle Monthly Distance Km'] || 0) / dietSegments[diet].count;
      dietSegments[diet].avgWasteBags += (row['Waste Bag Weekly Count'] || 0) / dietSegments[diet].count;
    }
  });

  // Segment by transport mode
  const transportSegments = {};
  data.forEach(row => {
    const transport = row['Transport']?.trim();
    if (transport) {
      if (!transportSegments[transport]) {
        transportSegments[transport] = {
          count: 0,
          totalEmission: 0,
          avgEmission: 0,
          avgDistance: 0
        };
      }
      transportSegments[transport].count += 1;
      transportSegments[transport].totalEmission += row.CarbonEmission || 0;
      transportSegments[transport].avgEmission = transportSegments[transport].totalEmission / transportSegments[transport].count;
      transportSegments[transport].avgDistance += (row['Vehicle Monthly Distance Km'] || 0) / transportSegments[transport].count;
    }
  });

  return {
    dietSegments,
    transportSegments
  };
};