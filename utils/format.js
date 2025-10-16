export function formatMoneyBRL(n=0){
  return n.toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
}
