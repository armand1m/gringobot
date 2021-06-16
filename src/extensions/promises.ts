/**
 * Filters a list of PromiesSettledResult<T> into a PromiseFulfilledResult<T>
 * and casts it so it's correctly type checked for consumers.
 **/
export const withFulfilled = <T>(
  promises: PromiseSettledResult<T>[]
) => {
  return promises.filter(
    (promise) => promise.status === 'fulfilled'
  ) as PromiseFulfilledResult<T>[];
};

/**
 * Filters a list of PromiesSettledResult<T> into a PromiseRejectedResult
 * and casts it so it's correctly type checked for consumers.
 *
 * Unfortunately, `rejection.reason` is any due to typescript inability
 * to enforce an error interface on Promise rejections.
 **/
export const withRejected = <T>(
  promises: PromiseSettledResult<T>[]
) => {
  return promises.filter(
    (promise) => promise.status === 'rejected'
  ) as PromiseRejectedResult[];
};
