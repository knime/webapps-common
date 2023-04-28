/**
 * Returns promise that resolves after ms.
 */
export default function sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
