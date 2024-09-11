import { CacheStore } from '@/data/protocols/cache';
import { SavePurchases, LoadPurchases } from "@/domain/useCases";

export class LocalLoadPurchases implements SavePurchases, LoadPurchases {
  constructor(
    private readonly cacheStore: CacheStore,
    private readonly timeStamp: Date 
  ) {}
  
  async save( purchases: Array<SavePurchases.Params> ): Promise<void> {
    this.cacheStore.delete('purchases');
    this.cacheStore.insert('purchases', {
      timeStamp: this.timeStamp,
      value: purchases
    });
  };

  async loadAll(): Promise<Array<LoadPurchases.Result>> {
    try{
      this.cacheStore.fetch('purchases');
      return []  
    } catch(err) {
      this.cacheStore.delete('purchases');
      return []
    };
  };
};