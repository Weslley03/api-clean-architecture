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
      return CachePolicy.validate(cache.timestamp, this.currentDate) ? cache.value : []
    } catch(err) {
      return []
    };
  };

  validate (): void {
    try{
      const cache = this.cacheStore.fetch('purchases');
      if(!CachePolicy.validate(cache.timestamp, this.currentDate)) {
        throw new Error()
      } 
    }catch(err){
      this.cacheStore.delete('purchases');
    };
  };
};