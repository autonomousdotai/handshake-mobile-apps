
import { createAPI } from '@/reducers/action';

export const BETTING_ACTIONS = {
    LOAD_MATCHES: 'LOAD_MATCHES',
    LOAD_HANDSHAKES: 'LOAD_HANDSHAKES',
    CHECK_FREE_AVAILABLE: 'CHECK_FREE_AVAILABLE',
    ADD_MATCH: 'ADD_MATCH',
}

export const loadMatches = createAPI(BETTING_ACTIONS.LOAD_MATCHES);
export const addMatch = createAPI(BETTING_ACTIONS.ADD_MATCH);
export const loadHandshakes = createAPI(BETTING_ACTIONS.LOAD_HANDSHAKES);
export const checkFreeAvailable = createAPI(BETTING_ACTIONS.CHECK_FREE_AVAILABLE);
