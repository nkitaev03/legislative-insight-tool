
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
}
