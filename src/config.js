/* eslint-disable no-multi-spaces */
import { exit } from 'process'
import { createRequire } from 'module'
import { existsSync } from 'fs'
const require = createRequire(import.meta.url)
const globalCfg = require('./config/global.json')

class Configuration {
  constructor(cfgPath, securityChecksBeforeStart) {
    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    //    ____             __ _       
    //   / ___|___  _ __  / _(_) __ _ 
    //  | |   / _ \| '_ \| |_| |/ _` |
    //  | |__| (_) | | | |  _| | (_| |
    //   \____\___/|_| |_|_| |_|\__, |
    //                          |___/                                   
    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    this.currentEnviroment = 'dev'
    this.currentNetwork = 'BSC_Testnet'
    this.numberOfArguments = 1
    securityChecksBeforeStart(this.numberOfArguments)
    
    this.cfg = require(cfgPath)
    this.coinName = this.cfg.contract.coinName
    this.contractJson = require(this.cfg.contract.pathToAbi)
    this.globalCfg = globalCfg

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Fill json matching with selected network & coin
    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    this.globalCfg.networks[this.currentNetwork].contracts[this.coinName].json = this.contractJson.abi
  }
}

export default Configuration
