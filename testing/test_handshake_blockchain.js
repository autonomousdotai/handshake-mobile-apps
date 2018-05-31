import BasicHandshake from '@/services/neuron/neuron-basichandshake';
import BettingHandshake from '@/services/neuron/neuron-bettinghandshake';

async function initBasicHandshake(
  address,
  privateKey,
  amount = 0,
  value = 0,
  term = 0,
  deliveryDate = '',
  escrowDate = '',
  offchain = 'abc',
) {
  const result = await new BasicHandshake(4).init(
    address,
    privateKey,
    amount,
    value,
    term,
    deliveryDate,
    escrowDate,
    offchain,
  );
  return result;
}

async function initBettingHandshake(address, privateKey) {
  const acceptors = [];
  const escrow = 0.5;
  const goal = escrow * 0.5;
  const currentDate = new Date();
  const deadline = 1527897600 - currentDate.getTime() / 1000;
  const offchain = 'abc1';
  const result = await new BettingHandshake(4).initBet(
    address,
    privateKey,
    acceptors,
    goal,
    escrow,
    deadline,
    offchain,
  );
  return result;
}

const address = '0x8989ab74F575Fa6BD084d3f9Ea0498A964d4f333';
const privateKey =
  '90d68703cf594acd83ad9bd8063208a94cda3933ee66c3fd96cabe97e35cc379';

// const features = ['mintable', 'burnable', 'timelock', 'vesting'];
const features = [];
const tokenData = {
  initAmount: 1000,
  sellAmount: 500,
  price: 1000000000,
  capped: 1500,
};
// console.log('start initBettingHandshake');
initBettingHandshake(address, privateKey).then(async (data) => {
  console.log('initBettingHandshake -----');
  console.log(data);
  console.log('initBettingHandshake ----- end');
});
// console.log('start run basic handshake');
// initBasicHandshake(address, privateKey).then(async (data) => {
//   console.log(data);
// });
