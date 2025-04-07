
/**
 * Monte Carlo simulation class for financial risk assessment
 */
export default class MonteCarloSimulator {
  private minValue: number;
  private maxValue: number;
  
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
      // Generate a random value using triangular distribution
      const randomValue = this.triangularDistribution(
        this.minValue,
        this.maxValue,
        (this.minValue + this.maxValue) / 2 // Mode at the middle for simplicity
      );
      
      results.push(randomValue);
    }
    
    return results;
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
}
