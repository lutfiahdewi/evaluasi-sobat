/**
 * 
 * @param matrix : string[][], 2d matrix containing the criteria comparison in string format
 * @returns isConsistent, CR, weight
 */
export default function useAhp(matrix: string[][]) {
  const n = matrix.length;
  const RI = [0, 0,  0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49]; //bersesuain dg nilai n (n=0 => 0 hanya dummy)

  //Normalization
  const normalizedMat: number[][] = Array.from(Array(n), () => new Array(n));
  let totalCol: number[] = [];
  for (let j = 0; j < n; j++) {
    let temp = 0;
    for (let i = 0; i < n; i++) {
      temp += parseFloat(matrix[i][j]);
    }
    totalCol[j] = temp;
  }
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      normalizedMat[i][j] = parseFloat(matrix[i][j]) / totalCol[j];
    }
  }

  //   Vektor prioritas dan bobot
  const vp = new Array(n);
  const weight = new Array(n);
  for (let i = 0; i < n; i++) {
    vp[i] = 0;
    for (let j = 0; j < n; j++) {
      vp[i] += normalizedMat[i][j];
    }
    weight[i] = vp[i] / n;
  }

  //   eigen value
  let eigen = 0;
  for (let i = 0; i < n; i++) {
    eigen += weight[i] * totalCol[i];
  }

  //   Consistency Index (CI) dan Consistency Ratio (CR)
  const CI = (eigen - n) / (n - 1);
  const CR = CI / RI[n];
  const isConsistent = checkConsistent();

  function checkConsistent(){
    if(CR<=0.1){
        return true
    }else{
        return false;
    }
  }
  console.log("total col  =", totalCol);
  console.log("norm mat =", normalizedMat);
  console.log("vp =", vp);
  console.log("weight =", weight);
  console.log("eigen =", eigen);
  console.log("CI =", CI);
  return {isConsistent, CR, weight};
}
