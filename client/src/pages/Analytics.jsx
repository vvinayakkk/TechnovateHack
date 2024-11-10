import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Activity, ShoppingBag, Car, Trash2, Tv, ShoppingCart, TrendingDown, TrendingUp, AlertTriangle, CheckCircle, Info, Clock, Calendar } from 'lucide-react';
import axios from 'axios';

const DJANGO_URL = import.meta.env.VITE_DJANGO_URL;

const Analytics = () => {
  const analysisData = JSON.parse(localStorage.getItem('MLData'))

  // Approximation of the error function (erf)
  const erf = (x) => {
    // Constants
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    // Save the sign of x
    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);

    // A&S formula 7.1.26
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  };

  const getZScoreDescription = (stdDev) => {
    const abs = Math.abs(stdDev);
    if (abs < 0.5) return "About average";
    if (abs < 1) return stdDev < 0 ? "Somewhat below average" : "Somewhat above average";
    if (abs < 2) return stdDev < 0 ? "Notably below average" : "Notably above average";
    return stdDev < 0 ? "Significantly below average" : "Significantly above average";
  };

  const getImpactBadgeStyles = (impactLevel) => {
    switch (impactLevel) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getZScoreColor = (stdDev, inverted = false) => {
    const abs = Math.abs(stdDev);
    const isPositive = stdDev > 0;
    if (abs < 0.5) return "text-gray-500";
    if (abs < 1) return isPositive ? (inverted ? "text-green-500" : "text-yellow-500") : (inverted ? "text-yellow-500" : "text-green-500");
    if (abs < 2) return isPositive ? (inverted ? "text-green-600" : "text-orange-500") : (inverted ? "text-orange-500" : "text-green-600");
    return isPositive ? (inverted ? "text-green-700" : "text-red-500") : (inverted ? "text-red-500" : "text-green-700");
  };

  const StatisticalIndicator = ({ value, mean, stdDev, title, unit, icon: Icon, inverted = false }) => {
    const zScore = (value - mean) / stdDev;
    // Using our custom erf function for the percentile calculation
    const percentile = (1 - 0.5 * (1 + erf(-zScore / Math.sqrt(2)))) * 100;

    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {title}
          </CardTitle>
          <Icon className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-baseline mb-2">
            {value && <div className="text-2xl font-bold">{value.toFixed(1)}{unit}</div>}
            {mean && <div className="text-sm text-gray-500">mean: {mean.toFixed(1)}{unit}</div>}
          </div>
          <div className={`text-sm font-medium ${getZScoreColor(zScore, inverted)}`}>
            {getZScoreDescription(zScore)}
          </div>
          <div className="mt-2">
            <Progress value={percentile} className="h-2" />
          </div>
          <div className="mt-1 text-xs text-gray-500 flex justify-between">
            <span>0%</span>
            {percentile && <span>{percentile.toFixed(1)}%</span>}
            <span>100%</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  const BellCurvePosition = ({ mean, stdDev, value, title }) => {
    const points = [];
    const zScore = (value - mean) / stdDev;
    const range = 4;
    const steps = 100;

    for (let i = -range; i <= range; i += (range * 2) / steps) {
      const x = i;
      const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
        Math.exp(-(Math.pow(i, 2)) / (2));
      points.push({ x: mean + (i * stdDev), y, isYou: false });
    }

    points.push({
      x: value, y: (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
        Math.exp(-(Math.pow(zScore, 2)) / (2)), isYou: true
    });

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>Distribution Curve</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={points}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="x"
                  tickFormatter={(value) => value.toFixed(0)}
                />
                <YAxis hide />
                <Tooltip
                  formatter={(value, name) => [value.toFixed(2), name]}
                  labelFormatter={(value) => `Value: ${parseFloat(value).toFixed(0)}`}
                />
                <Area
                  type="monotone"
                  dataKey="y"
                  stroke="#3b82f6"
                  fill="#93c5fd"
                  name="Distribution"
                />
                {points.filter(p => p.isYou).map((point, index) => (
                  <Line
                    key={index}
                    type="monotone"
                    data={[{ x: point.x, y: 0 }, { x: point.x, y: point.y }]}
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Your Position"
                    dot={false}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Carbon Footprint Analytics</h1>
          <p className="text-gray-500">Detailed analysis of your environmental impact</p>
        </div>
        {/* <Button
          onClick={calculateAnalysis}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Calculate Impact
        </Button> */}
      </div>

      {analysisData && (
        <>
          <Alert className={`${getZScoreColor(analysisData.statistics.standardDeviationsFromMean, true)} border-l-4`}>
            <AlertTitle className="flex items-center gap-2">
              {analysisData.statistics.standardDeviationsFromMean < 0 ?
                <CheckCircle className="h-4 w-4" /> :
                <AlertTriangle className="h-4 w-4" />
              }
              Overall Carbon Impact Assessment
            </AlertTitle>
            <AlertDescription className="mt-2">
              Your carbon footprint is {Math.abs(analysisData.statistics.standardDeviationsFromMean).toFixed(2)} standard deviations
              {analysisData.statistics.standardDeviationsFromMean < 0 ? " below " : " above "}
              the population mean of {analysisData.statistics.populationStats.mean.toFixed(2)} CO₂e/year
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>Suggested actions to reduce your carbon footprint</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  {/* Immediate Actions Column */}
                  <div className="space-y-4">
                    {analysisData.recommendations?.immediate_actions?.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Immediate Actions
                        </h3>
                        {analysisData.recommendations.immediate_actions.map((action, index) => (
                          <Alert key={index} className="shadow-sm">
                            <Info className="h-4 w-4" />
                            <AlertTitle className="flex items-center gap-2 text-sm">
                              {action.action}
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${getImpactBadgeStyles(action.impact_level)}`}
                              >
                                {action.impact_level} Impact
                              </span>
                            </AlertTitle>
                            <AlertDescription className="text-xs">
                              {action.suggestion}
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    )}

                    {/* Medium Term Goals */}
                    {analysisData.recommendations?.medium_term_goals?.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Medium Term Goals
                        </h3>
                        {analysisData.recommendations.medium_term_goals.map((goal, index) => (
                          <Alert key={index} className="shadow-sm">
                            <Info className="h-4 w-4" />
                            <AlertTitle className="flex items-center gap-2 text-sm">
                              {goal.action}
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${getImpactBadgeStyles(goal.impact_level)}`}
                              >
                                {goal.impact_level} Impact
                              </span>
                            </AlertTitle>
                            <AlertDescription className="text-xs">
                              {goal.suggestion}
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Long Term Changes Column */}
                  <div className="space-y-4">
                    {analysisData.recommendations?.long_term_changes?.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Long Term Changes
                        </h3>
                        {analysisData.recommendations.long_term_changes.map((change, index) => (
                          <Alert key={index} className="shadow-sm">
                            <Info className="h-4 w-4" />
                            <AlertTitle className="flex items-center gap-2 text-sm">
                              {change.action}
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${getImpactBadgeStyles(change.impact_level)}`}
                              >
                                {change.impact_level} Impact
                              </span>
                            </AlertTitle>
                            <AlertDescription className="text-xs">
                              {change.suggestion}
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <BellCurvePosition
              mean={analysisData.statistics.populationStats.mean}
              stdDev={analysisData.statistics.populationStats.std_dev}
              value={analysisData.prediction}
              title="Your Position in Population Distribution"
            />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistical Summary</CardTitle>
                <CardDescription>Key metrics and comparisons</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Your Emissions</div>
                    <div className="text-2xl font-bold">{analysisData.prediction.toFixed(2)}</div>
                    <div className="text-xs text-gray-400">CO₂e/year</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Population Mean</div>
                    <div className="text-2xl font-bold">{analysisData.statistics.populationStats.mean.toFixed(2)}</div>
                    <div className="text-xs text-gray-400">CO₂e/year</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Standard Deviation</div>
                    <div className="text-2xl font-bold">{analysisData.statistics.populationStats.std_dev.toFixed(2)}</div>
                    <div className="text-xs text-gray-400">CO₂e/year</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Percentile Rank</div>
                    <div className="text-2xl font-bold">{analysisData.statistics.percentileRank.toFixed(1)}%</div>
                    <div className="text-xs text-gray-400">of population</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </>
      )}
    </div >
  );
};

export default Analytics;