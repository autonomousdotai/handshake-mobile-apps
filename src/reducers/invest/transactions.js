
export default class TransactionStorage {
    constructor(pid = null) {
        this.pid = pid;
    }

    getPid = () => this.pid;
    
    getName = pid => {
        const pidExisted = pid || this.pid;
        if (!pidExisted) {
            console.error('TransactionStorage: Pid is undefined');
            return '@trxs:';
        }
        return '@trxs:' + pidExisted;
    }

    getTransactions = (pid = null) => {
        const trxs = localStorage.getItem(this.getName(pid));
        return trxs ? JSON.parse(trxs) : []
    }

    updateTransactions = (trxs, pid = null) => localStorage.setItem(this.getName(pid), JSON.stringify(trxs))

    addTransaction = (trx, pid = null) => {
        const trxs = this.getTransactions(pid);
        trxs.push(trx);
        this.updateTransactions(trxs, pid);
    }

    updateTransaction = (trx, pid = null) => {
        const trxs = this.getTransactions(pid);
        const updatingTrx = trxs.find(tx => tx.hash === trx.hash);
        if (!updatingTrx) return;
        trxs.forEach(tx => {
            if (tx.hash === trx.hash) {
                tx.status = trx.status;
            }
        })
        this.updateTransactions(trxs, pid);
    }
}