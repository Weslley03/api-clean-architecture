export class CachePolicy {
  private static maxAgeInDate = 3

  private constructor() {}

  public static validate (timestamp: Date, date: Date): boolean {
    const maxAge = new Date(timestamp);
    maxAge.setDate(maxAge.getDate() + CachePolicy.maxAgeInDate);

    return maxAge > date;
  };
};