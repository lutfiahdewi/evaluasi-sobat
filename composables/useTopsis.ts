import { complex, max, min, round, sqrt, square, sum } from "mathjs";

type evaluatee = {
  username: string;
  name?: string;
  preference_value?: number;
};
/**
 *
 * @param score :number[][], that is contain the evaluatees score
 * @param weight
 * @param is_benefit
 * @param evaluatees
 * @returns evaluatees: {name: string, username: string, preference_value?: number}[]
 */
export default function useTopsis(score: number[][], weight: number[], is_benefit: boolean[], evaluatees: evaluatee[]) {
  const p = evaluatees.length; //baris
  const q = weight.length; //kolom
  // 1. Normaliasi skor
  const normalizedMat: number[][] = Array.from(Array(p), () => new Array(q));
  let rrs: number[] = [];
  for (let j = 0; j < q; j++) {
    let temp = 0;
    for (let i = 0; i < p; i++) {
      temp += square(score[i][j]);
    }
    rrs[j] = round(complex(sqrt(temp)).re, 5);
  }
  for (let i = 0; i < p; i++) {
    for (let j = 0; j < q; j++) {
      normalizedMat[i][j] = round(score[i][j] / rrs[j], 5);
    }
  }

  // 2. Matriks normalisasi terbobot; nw = normalized * weight
  const nwMat: number[][] = Array.from(Array(p), () => new Array(q));
  for (let i = 0; i < p; i++) {
    for (let j = 0; j < q; j++) {
      nwMat[i][j] = round(normalizedMat[i][j] * weight[j], 5);
    }
  }
  // console.log(nwMat);

  // 3. Solusi ideal positif dan negatif
  const sPositive = new Array(q);
  const sNegative = new Array(q);
  for (let j = 0; j < q; j++) {
    let temp = nwMat.map((row) => row[j]);
    if (is_benefit[j]) {
      sPositive[j] = max(temp);
      sNegative[j] = min(temp);
    } else {
      sPositive[j] = min(temp);
      sNegative[j] = max(temp);
    }
  }
  // console.log("A+: " + sPositive);
  // console.log(sNegative)
  // 4. Jarak antara nilai setiap alternatif dengan matriks solusi ideal positif dan negatif
  const dPositive = new Array(p);
  const dNegative = new Array(p);
  for (let i = 0; i < p; i++) {
    let ssqPositive: number[] = [];
    let ssqNegative: number[] = [];
    ssqPositive = nwMat[i].map((col, j) => square(sPositive[j] - col));
    ssqNegative = nwMat[i].map((col, j) => square(col - sNegative[j]));
    // console.log(ssqNegative);
    dPositive[i] = round(sqrt(sum(ssqPositive)), 5);
    dNegative[i] = round(sqrt(sum(ssqNegative)), 5);
    // console.log("array: ", dNegative[i], " cal: ", round(sqrt(sum(ssqNegative)), 5));
  }
  // console.log(dPositive);
  // console.log(dNegative);

  // 5. Nilai preferensi
  for (let i = 0; i < p; i++) {
    evaluatees[i].preference_value =  round(dNegative[i] / (dPositive[i] + dNegative[i]), 5)
  }
  return useOrderBy(evaluatees, ["preference_value"], ["desc"] );
}
