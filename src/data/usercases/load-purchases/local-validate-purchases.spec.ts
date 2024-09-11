import { LocalLoadPurchases } from "@/data/usercases";
import { mockPurchases, CacheStoreSpy } from "@/data/tests";

type SutType = {
  sut: LocalLoadPurchases
  cacheStore: CacheStoreSpy
};

const makeSut = (timeStamp = new Date()): SutType => {
  const cacheStore = new CacheStoreSpy();
  const sut = new LocalLoadPurchases(cacheStore, timeStamp);
  return {
    sut,
    cacheStore
  };
};

describe('LocalValidatePurchases', () =>{
  test('should not delete or insert cache on sut.init', () => {
    const { cacheStore, sut } = makeSut();
    expect(cacheStore.actions).toEqual([]);
  });
});
