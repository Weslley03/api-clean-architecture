import { LocalSavePurchases } from "@/data/usercases";
import { mockPurchases, CacheStoreSpy } from "@/data/tests";

type SutType = {
  sut: LocalSavePurchases
  cacheStore: CacheStoreSpy
};

const makeSut = (timeStamp = new Date()): SutType => {
  const cacheStore = new CacheStoreSpy();
  const sut = new LocalSavePurchases(cacheStore, timeStamp);
  return {
    sut,
    cacheStore
  };
};

describe('LocalSavePurchases', () =>{
  test('should not delete or insert cache on sut.init', () => {
    const { cacheStore } = makeSut();
    expect(cacheStore.actions).toEqual([]);
  });

  test('should not insert new cache if delete fails', async () => {
    const { cacheStore, sut } = makeSut();
    cacheStore.simulateDeleteError();
    const promise = sut.save(mockPurchases());
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.delete]);
    await expect(promise).rejects.toThrow();
  });

  test('should insert new cache if delete succeeds',  async () => {
    const timeStamp = new Date()
    const { cacheStore, sut } = makeSut();
    const purchases = mockPurchases();
   
    const promise = sut.save(purchases);
   
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.delete, CacheStoreSpy.Action.insert]);
    expect(cacheStore.deleteKey).toBe('purchases');
    expect(cacheStore.insertKey).toBe('purchases');
    expect(cacheStore.insertValues).toEqual({
      timeStamp,
      value: purchases 
    });
    await expect(promise).resolves.toBeFalsy();
  });

  test('should throws if insert throws',  async () => {
    const { cacheStore, sut } = makeSut();
    cacheStore.simulateInsurtError();
    const promise = sut.save(mockPurchases());
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.delete, CacheStoreSpy.Action.insert]);
    await expect(promise).rejects.toThrow();
  });
});
