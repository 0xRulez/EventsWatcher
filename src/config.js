/* eslint-disable no-multi-spaces */
import { exit } from 'process'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const JSON_BNB_MINER = require('../artifacts/contracts/BNBMiner.sol/SpaceDiamondBNB.json')
const JSON_BUSD_MINER = require('../artifacts/contracts/BUSDMiner.sol/SpaceDiamondBUSD.json')
const JSON_ETH_MINER = require('../artifacts/contracts/ETHMiner.sol/SpaceDiamondETH.json')

//    ____             __ _       
//   / ___|___  _ __  / _(_) __ _ 
//  | |   / _ \| '_ \| |_| |/ _` |
//  | |__| (_) | | | |  _| | (_| |
//   \____\___/|_| |_|_| |_|\__, |
//                          |___/                                   
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
class Configuration {
  constructor () {
    // Select Enviroment for the project
    this.currentEnviroment = 'dev'

    // Configuration Object
    this.config = {
      
      prod: {
        debug: false,
        database: {
          host: '192.168.1.90',
          name: 'blockApp01',
          username: 'blockApp01',
          password: 'kYPiKz1YMSr5bqkw.',
          port: '3306',
        },
        network: {
          name: 'Binance Smart Chain (Mainnet)',
          rpc: 'https://greatest-proportionate-gadget.bsc.discover.quiknode.pro/ce66e7bd0f8150d11d18423ece92d5287b176573/',
          scanURL: 'https://www.bscscan.com',
        },
        contracts: {
          BNB: {
            name: 'SpaceDiamondBNB',
            address: '0x5306a0599e06e5A41b945dA3eb1815EFb2CE0DdF',
            deployTx: '0x96e7ff1f704b6d454ae0586b13903881bc6ce6ec01199c5edf16f45c05d9a56e',
            json: JSON_BNB_MINER,
            coinName: 'BNB'
          },
          BUSD: {
            name: 'SpaceDiamondBUSD',
            address: '0x4E13b02C8aB4a5dE89457B30a9668C1dD1E7b3a4',
            deployTx: '0x6d01614f068798f9fbcdf837a0640c807d79c45d4d7412de24bf5adf532cd535',
            json: JSON_BNB_MINER,
            coinName: 'BUSD'
          },
          ETH: {
            name: 'SpaceDiamondETH',
            address: '0x8A84492Bf93099e4FAa7D41340ffd45E27C8d5b8',
            deployTx: '0x70c58eb8509f5c3cfaaa1294b59973086e8aceb7c4fa97b0705941e5406e5477',
            json: JSON_BNB_MINER,
            coinName: 'ETH'
          }
        }
      },

      dev: {
        debug: false,
        database: {
          host: '192.168.1.90',
          name: 'blockApp01',
          username: 'blockApp01',
          password: 'kYPiKz1YMSr5bqkw.',
          port: '3306',
        },
        network: {
          name: 'Binance Smart Chain (Testnet)',
          rpc: 'https://solitary-solitary-shadow.bsc-testnet.discover.quiknode.pro/9cf56d03899187991fa9ceb4b15fc2b30a74a941/',
          scanURL: 'https://testnet.bscscan.com',
        },
        contracts: {
          BNB: {
            name: 'SpaceDiamondBNB',
            address: '0x5306a0599e06e5A41b945dA3eb1815EFb2CE0DdF',
            deployTx: '0x96e7ff1f704b6d454ae0586b13903881bc6ce6ec01199c5edf16f45c05d9a56e',
            json: JSON_BNB_MINER,
            coinName: 'BNB'
          },
          BUSD: {
            name: 'SpaceDiamondBUSD',
            address: '0x4E13b02C8aB4a5dE89457B30a9668C1dD1E7b3a4',
            deployTx: '0x6d01614f068798f9fbcdf837a0640c807d79c45d4d7412de24bf5adf532cd535',
            json: JSON_BUSD_MINER,
            coinName: 'BUSD'
          },
          ETH: {
            name: 'SpaceDiamondETH',
            address: '0x8A84492Bf93099e4FAa7D41340ffd45E27C8d5b8',
            deployTx: '0x70c58eb8509f5c3cfaaa1294b59973086e8aceb7c4fa97b0705941e5406e5477',
            json: JSON_ETH_MINER,
            coinName: 'ETH'
          }
        }
      }
    }
  }

  getConfig  = (enviroment) => {
    if (this.currentEnviroment == 'prod') return this.config.prod
    if (this.currentEnviroment == 'dev') return this.config.dev
  }

  getContract = (coinName) => {
    if (this.currentEnviroment == 'prod') {
      if      (coinName === 'BNB')      return this.config.prod.contracts.BNB
      else if (coinName === 'BUSD')     return this.config.prod.contracts.BUSD
      else if (coinName === 'ETH')      return this.config.prod.contracts.ETH
      else {
        console.log('INFO: Specified coin ' + coinName + ' not recognized :(')
        exit(1)
      }
    }
    if (this.currentEnviroment == 'dev') {
      if      (coinName === 'BNB')      return this.config.dev.contracts.BNB
      else if (coinName === 'BUSD')     return this.config.dev.contracts.BUSD
      else if (coinName === 'ETH')      return this.config.dev.contracts.ETH
      else {
        console.log('INFO: Specified coin ' + coinName + ' not recognized :(')
        exit(1)
      }
    }
  }
}

export default Configuration
