export function formatAndConvertCurrency(cents: number){
    return `${ Math.floor(cents / 100).toFixed(2) }`;
}