import { CachePolicy, CacheStore } from '@/data/protocols/cache';
import { SavePurchases, LoadPurchases } from "@/domain/useCases";

export class LocalLoadPurchases implements SavePurchases, LoadPurchases {
  constructor(
    private readonly cacheStore: CacheStore,
    private readonly currentDate: Date 
  ) {}
  
  async save( purchases: Array<SavePurchases.Params> ): Promise<void> {
    this.cacheStore.delete('purchases');
    this.cacheStore.insert('purchases', {
      timeStamp: this.currentDate,
      value: purchases
    });
  };

  async loadAll(): Promise<Array<LoadPurchases.Result>> {
    try{
      const cache = this.cacheStore.fetch('purchases');
      if(CachePolicy.validate(cache.timestamp, this.currentDate)) {
        return cache.value
      } else {
        return []
      }
    } catch(err) {
      return []
    };
  };

  validate (): void {
    try{
      this.cacheStore.fetch('purchases');
    }catch(err){
      this.cacheStore.delete('purchases');
    };
  };
};