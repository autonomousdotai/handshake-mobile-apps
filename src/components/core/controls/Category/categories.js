import chipSVG from '@/assets/images/categories/chip.svg';
import exchangeSVG from '@/assets/images/categories/exchange.svg';
import handPlantingSVG from '@/assets/images/categories/hand-planting.svg';
import shoppingCartSVG from '@/assets/images/categories/shopping-cart.svg';

const CATEGORIES = [{
    name: 'Betting',
    image: chipSVG,
    priority: 0
  },
  {
    name: 'Seed',
    image: handPlantingSVG,
    priority: 1
  },
  {
    name: 'Exchange',
    image: exchangeSVG,
    priority: 2
  },
  {
    name: 'Bazaar',
    image: shoppingCartSVG,
    priority: 3
  },
  {
    name: 'sell',
    image: exchangeSVG,
    priority: 2
  },
  {
    name: 'buy',
    image: shoppingCartSVG,
    priority: 3
  }
];

export default CATEGORIES;