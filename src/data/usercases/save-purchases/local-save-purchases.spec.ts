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
    expect(cacheStore.messages).toEqual([]);
  });

  test('should not insert new cache if delete fails', async () => {
    const { cacheStore, sut } = makeSut();
    cacheStore.simulateDeleteError();
    const promise = sut.save(mockPurchases());
    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete]);
    await expect(promise).rejects.toThrow();
  });

  test('should insert new cache if delete succeeds',  async () => {
    const timeStamp = new Date()
    const { cacheStore, sut } = makeSut();
    const purchases = mockPurchases();
    await sut.save(purchases);
    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert]);
    expect(cacheStore.deleteKey).toBe('purchases');
    expect(cacheStore.insertKey).toBe('purchases');
    expect(cacheStore.insertValues).toEqual({
      timeStamp,
      value: purchases 
    });
  });

  test('should throws if insert throws',  async () => {
    const { cacheStore, sut } = makeSut();
    cacheStore.simulateInsurtError();
    const promise = sut.save(mockPurchases());
    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete, CacheStoreSpy.Message.insert]);
    await expect(promise).rejects.toThrow();
  });
});
