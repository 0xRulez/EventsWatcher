/* eslint-disable no-multi-spaces */
import { exit } from 'process'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const JSON_BNB_MINER = require('../artifacts/contracts/BNBMiner.sol/SpaceDiamondBNB.json')
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
            name: 'BoiledNoodlesBNB',
            address: '0xC2d1FfBECeB9CEE0ba12DCb527B5FC147258B1Bc',
            deployTx: '0xdc9066c2e779f3c43de06806d90e74636a92a49a34104e8d530a28e466aa5dbf',
            json: JSON_BNB_MINER,
            coinName: 'BNB'
          },
          BUSD: {
            name: 'BoiledNoodlesBUSD',
            address: '0xC2d1FfBECeB9CEE0ba12DCb527B5FC147258B1Bc',
            deployTx: '0xdc9066c2e779f3c43de06806d90e74636a92a49a34104e8d530a28e466aa5dbf',
            json: JSON_BNB_MINER,
            coinName: 'BUSD'
          },
          ETH: {
            name: 'BoiledNoodlesETH',
            address: '0xC2d1FfBECeB9CEE0ba12DCb527B5FC147258B1Bc',
            deployTx: '0xdc9066c2e779f3c43de06806d90e74636a92a49a34104e8d530a28e466aa5dbf',
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
            address: '0x364adc518c767C917cA7Bd45028C0D7D56abEe37',
            deployTx: '0xf81f040394b98d3a9c37406f8479ae5a0a41108baca5e98e007a7ff16e2cd23e',
            json: JSON_BNB_MINER,
            coinName: 'BNB'
          },
          BUSD: {
            name: 'BoiledNoodlesBUSD',
            address: '0xC2d1FfBECeB9CEE0ba12DCb527B5FC147258B1Bc',
            deployTx: '0xdc9066c2e779f3c43de06806d90e74636a92a49a34104e8d530a28e466aa5dbf',
            json: JSON_BNB_MINER,
            coinName: 'BUSD'
          },
          ETH: {
            name: 'BoiledNoodlesETH',
            address: '0xC2d1FfBECeB9CEE0ba12DCb527B5FC147258B1Bc',
            deployTx: '0xdc9066c2e779f3c43de06806d90e74636a92a49a34104e8d530a28e466aa5dbf',
            json: JSON_BNB_MINER,
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
