/**
 *
 * @param timeout in second
 * @returns
 */
export default function useWaitS(timeout?: number) {
  if (!timeout) timeout = 1;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, timeout * 1000);
  });
}
