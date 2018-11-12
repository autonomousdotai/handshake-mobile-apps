import { contractMethodCreator, initPredictionContract } from './ninjaContract';

function predictionMethodCreator(methodName, params) {
  const predictionContract = initPredictionContract();
  return contractMethodCreator(predictionContract, methodName, params);
}

export function predictionTransfer(transferAmount) {
  return predictionMethodCreator('transfer', transferAmount.toString(16));
}
