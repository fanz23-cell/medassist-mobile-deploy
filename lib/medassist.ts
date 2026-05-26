export function detectStart(input: string) {
  const value = input.toLowerCase();
  if (/(medicine|pharmacy|prescription|drug|取药|药房|药物)/.test(value)) return "scan-prescription";
  if (/(report|result|follow|复诊|结果|回诊)/.test(value)) return "scan-lab-result";
  if (/(lab|test|blood|化验|检查|抽血)/.test(value)) return "scan-doctor-order";
  return "destination-from-paper";
}
