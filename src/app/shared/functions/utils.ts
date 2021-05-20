export function setUpperBound(valor: number, valorMax: number = 100) {
  if (valor > valorMax) {
    return valorMax;
  }
  return valor;
}
