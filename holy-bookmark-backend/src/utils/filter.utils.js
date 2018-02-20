import { toPairs, propEq, allPass } from "ramda";

export function createFilter(filterSource) {
    const pairs = toPairs(filterSource);
    if (pairs.length === 0) {
        return () => true;
    }

    return allPass(pairs.map(([prop, value]) => propEq(prop, value)))
}