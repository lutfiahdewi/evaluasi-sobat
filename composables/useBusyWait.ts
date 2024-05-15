/**
 *
 * @param fun: (arrow fun that return condition have to fullfilled)
 * @param timeout in second, default:15s
 * @returns promise
 */
  export default  async function busyWait(fun: () => any, timeout?: number) {
    if (!timeout) timeout = 15;
    while(!fun()) await useWaitS(timeout);
  }