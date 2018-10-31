module.exports = {
    "address": "0x71beaab62b60f6a601752aa00c631e54ad2aec9e",
    "network": "https://rinkeby.infura.io/LLJy74SjotuIMxZJMUvf",
    "abi": [
        {
            "constant": true,
            "inputs": [],
            "name": "getProjectSize",
            "outputs": [
                {
                    "name": "size",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "pid",
                    "type": "bytes32"
                },
                {
                    "name": "funder",
                    "type": "address"
                }
            ],
            "name": "getFundAmount",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "pid",
                    "type": "bytes32"
                }
            ],
            "name": "getFunders",
            "outputs": [
                {
                    "name": "",
                    "type": "address[]"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "pid",
                    "type": "bytes32"
                },
                {
                    "name": "exchange",
                    "type": "address"
                },
                {
                    "name": "amount",
                    "type": "uint256"
                },
                {
                    "name": "stage",
                    "type": "bytes32"
                }
            ],
            "name": "release",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "pid",
                    "type": "bytes32"
                }
            ],
            "name": "fundProject",
            "outputs": [],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "target",
                    "type": "uint256"
                },
                {
                    "name": "max",
                    "type": "uint256"
                },
                {
                    "name": "deadline",
                    "type": "uint256"
                },
                {
                    "name": "lifeTime",
                    "type": "uint256"
                },
                {
                    "name": "commission",
                    "type": "uint8"
                },
                {
                    "name": "pid",
                    "type": "bytes32"
                }
            ],
            "name": "initProject",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "time",
                    "type": "uint256"
                }
            ],
            "name": "isReachTime",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "pid",
                    "type": "bytes32"
                }
            ],
            "name": "validateState",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "pid",
                    "type": "bytes32"
                },
                {
                    "name": "stop",
                    "type": "uint8"
                }
            ],
            "name": "voteStop",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "max",
                    "type": "uint256"
                },
                {
                    "name": "balance",
                    "type": "uint256"
                }
            ],
            "name": "isReachMax",
            "outputs": [
                {
                    "name": "r",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "pure",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "name": "projects",
            "outputs": [
                {
                    "name": "owner",
                    "type": "address"
                },
                {
                    "name": "target",
                    "type": "uint256"
                },
                {
                    "name": "max",
                    "type": "uint256"
                },
                {
                    "name": "fundingAmount",
                    "type": "uint256"
                },
                {
                    "name": "availableAmount",
                    "type": "uint256"
                },
                {
                    "name": "releasedAmount",
                    "type": "uint256"
                },
                {
                    "name": "retractAmount",
                    "type": "uint256"
                },
                {
                    "name": "startTime",
                    "type": "uint256"
                },
                {
                    "name": "deadline",
                    "type": "uint256"
                },
                {
                    "name": "lifeTime",
                    "type": "uint256"
                },
                {
                    "name": "state",
                    "type": "uint8"
                },
                {
                    "components": [
                        {
                            "name": "num",
                            "type": "uint256"
                        },
                        {
                            "name": "den",
                            "type": "uint256"
                        }
                    ],
                    "name": "plScale",
                    "type": "tuple"
                },
                {
                    "components": [
                        {
                            "name": "num",
                            "type": "uint256"
                        },
                        {
                            "name": "den",
                            "type": "uint256"
                        }
                    ],
                    "name": "commission",
                    "type": "tuple"
                },
                {
                    "name": "commisionAmount",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "pid",
                    "type": "bytes32"
                },
                {
                    "name": "funder",
                    "type": "address"
                }
            ],
            "name": "getWithdrawAmount",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "pid",
                    "type": "bytes32"
                }
            ],
            "name": "stopProject",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "pid",
                    "type": "bytes32"
                },
                {
                    "name": "retractAmount",
                    "type": "uint256"
                }
            ],
            "name": "retract",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "pid",
                    "type": "bytes32"
                }
            ],
            "name": "shouldValidateState",
            "outputs": [
                {
                    "name": "r",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "pid",
                    "type": "bytes32"
                }
            ],
            "name": "withdrawFund",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "pid",
                    "type": "bytes32"
                }
            ],
            "name": "getProjectInfo",
            "outputs": [
                {
                    "name": "owner",
                    "type": "address"
                },
                {
                    "name": "target",
                    "type": "uint256"
                },
                {
                    "name": "max",
                    "type": "uint256"
                },
                {
                    "name": "fundingAmount",
                    "type": "uint256"
                },
                {
                    "name": "availableAmount",
                    "type": "uint256"
                },
                {
                    "name": "releasedAmount",
                    "type": "uint256"
                },
                {
                    "name": "retractAmount",
                    "type": "uint256"
                },
                {
                    "name": "startTime",
                    "type": "uint256"
                },
                {
                    "name": "deadline",
                    "type": "uint256"
                },
                {
                    "name": "lifeTime",
                    "type": "uint256"
                },
                {
                    "name": "state",
                    "type": "uint8"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "payable": true,
            "stateMutability": "payable",
            "type": "fallback"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "__receive",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "pid",
                    "type": "bytes32"
                }
            ],
            "name": "__init",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "pid",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "name": "funder",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "__funding",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "pid",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "name": "requester",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "fundAmount",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "withdrawAmount",
                    "type": "uint256"
                }
            ],
            "name": "__withdraw",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "pid",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "name": "exchange",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "amount",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "stage",
                    "type": "bytes32"
                }
            ],
            "name": "__release",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "pid",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "name": "from",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "to",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "availableAmount",
                    "type": "uint256"
                }
            ],
            "name": "__retract",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "sender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "pid",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "name": "stop",
                    "type": "uint256"
                }
            ],
            "name": "__voteStop",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "sender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "pid",
                    "type": "bytes32"
                }
            ],
            "name": "__stop",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "pid",
                    "type": "bytes32"
                }
            ],
            "name": "__verifyWithdraw",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "pid",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "name": "from",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "name": "to",
                    "type": "bytes32"
                }
            ],
            "name": "__changeState",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "time1",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "time2",
                    "type": "uint256"
                }
            ],
            "name": "__log",
            "type": "event"
        }
    ]
}