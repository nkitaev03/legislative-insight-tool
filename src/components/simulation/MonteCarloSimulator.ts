
/**
 * Monte Carlo simulation class for financial risk assessment
 */
export default class MonteCarloSimulator {
  private minValue: number;
  private maxValue: number;
  public distributionType: "normal" | "triangular" | "uniform" = "triangular";
  
  /**
   * Create a Monte Carlo simulator with defined range
   * 
   * @param minValue - Minimum possible value
   * @param maxValue - Maximum possible value
   */
  constructor(minValue: number, maxValue: number) {
    this.minValue = minValue;
    this.maxValue = maxValue;
  }
  
  /**
   * Run a specified number of simulations
   * 
   * @param iterations - Number of iterations to run
   * @returns Array of simulated values
   */
  runSimulations(iterations: number): number[] {
    const results: number[] = [];
    
    // Run specified number of iterations
    for (let i = 0; i < iterations; i++) {
      let randomValue: number;
      
      // Use the appropriate distribution based on the distributionType
      switch (this.distributionType) {
        case "normal":
          randomValue = this.normalDistribution(
            this.minValue,
            this.maxValue
          );
          break;
        case "uniform":
          randomValue = this.uniformDistribution(
            this.minValue,
            this.maxValue
          );
          break;
        case "triangular":
        default:
          randomValue = this.triangularDistribution(
            this.minValue,
            this.maxValue,
            (this.minValue + this.maxValue) / 2 // Mode at the middle for simplicity
          );
      }
      
      results.push(randomValue);
    }
    
    return results;
  }
  
  /**
   * Creates a distribution histogram data from simulation results
   * 
   * @param results - Array of simulation results
   * @param bins - Number of histogram bins to create
   * @returns Object with bins and counts for visualization
   */
  createDistributionHistogram(results: number[], bins: number = 20): { binStart: number, binEnd: number, count: number, percentage: number }[] {
    const min = Math.min(...results);
    const max = Math.max(...results);
    const range = max - min;
    const binWidth = range / bins;
    
    // Initialize bins
    const histogram: { binStart: number, binEnd: number, count: number, percentage: number }[] = [];
    for (let i = 0; i < bins; i++) {
      const binStart = min + i * binWidth;
      const binEnd = binStart + binWidth;
      histogram.push({
        binStart,
        binEnd,
        count: 0,
        percentage: 0
      });
    }
    
    // Count values in each bin
    results.forEach(value => {
      const binIndex = Math.min(
        Math.floor((value - min) / binWidth),
        bins - 1
      );
      histogram[binIndex].count++;
    });
    
    // Calculate percentages
    const total = results.length;
    histogram.forEach(bin => {
      bin.percentage = (bin.count / total) * 100;
    });
    
    return histogram;
  }
  
  /**
   * Triangular distribution random number generator
   * More realistic for financial risk simulation than uniform distribution
   */
  private triangularDistribution(min: number, max: number, mode: number): number {
    const u = Math.random();
    const f = (mode - min) / (max - min);
    
    if (u < f) {
      return min + Math.sqrt(u * (max - min) * (mode - min));
    } else {
      return max - Math.sqrt((1 - u) * (max - min) * (max - mode));
    }
  }
  
  /**
   * Uniform distribution random number generator
   */
  private uniformDistribution(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }
  
  /**
   * Normal distribution random number generator using Box-Muller transform
   */
  private normalDistribution(min: number, max: number): number {
    // Use mean and standard deviation based on min/max
    const mean = (min + max) / 2;
    const stdDev = (max - min) / 6; // 99.7% of values within min-max range
    
    // Box-Muller transform
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    
    // Transform to our desired mean and standard deviation
    let result = mean + z0 * stdDev;
    
    // Clamp result to min-max range
    return Math.max(min, Math.min(max, result));
  }
  
  /**
   * Calculate the mean value from simulation results
   */
  calculateMean(results: number[]): number {
    const sum = results.reduce((acc, val) => acc + val, 0);
    return Math.round(sum / results.length);
  }
  
  /**
   * Calculate the median value from simulation results
   */
  calculateMedian(results: number[]): number {
    const sorted = [...results].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    
    if (sorted.length % 2 === 0) {
      return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
    } else {
      return Math.round(sorted[mid]);
    }
  }
  
  /**
   * Calculate a specified percentile from simulation results
   */
  calculatePercentile(results: number[], percentile: number): number {
    if (percentile < 0 || percentile > 100) {
      throw new Error('Percentile must be between 0 and 100');
    }
    
    const sorted = [...results].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return Math.round(sorted[index]);
  }
  
  /**
   * Generate distribution data for visualization
   */
  generateDistributionData(results: number[], samples: number = 100): { x: number; y: number }[] {
    const sorted = [...results].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const step = (max - min) / samples;
    
    const data: { x: number; y: number }[] = [];
    
    for (let i = 0; i <= samples; i++) {
      const x = min + i * step;
      let y = 0;
      
      switch (this.distributionType) {
        case "normal": {
          const mean = this.calculateMean(results);
          const stdDev = Math.sqrt(results.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / results.length);
          const z = (x - mean) / stdDev;
          y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow(z, 2));
          break;
        }
        case "triangular": {
          const mode = this.calculateMean(results); // Approximate mode with mean for visualization
          if (x < min || x > max) {
            y = 0;
          } else if (x <= mode) {
            y = 2 * (x - min) / ((max - min) * (mode - min));
          } else {
            y = 2 * (max - x) / ((max - min) * (max - mode));
          }
          break;
        }
        case "uniform": {
          y = 1 / (max - min);
          break;
        }
      }
      
      data.push({ x, y });
    }
    
    return data;
  }
}
