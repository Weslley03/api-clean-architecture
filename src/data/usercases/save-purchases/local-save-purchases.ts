import { CacheStore } from '@/data/protocols/cache';
import { SavePurchases } from "@/domain/useCases";

export class LocalSavePurchases implements SavePurchases{
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
};