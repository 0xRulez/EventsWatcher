/* eslint-disable no-multi-spaces */
import { exit } from 'process'
import { createRequire } from 'module'
import { existsSync } from 'fs'
const require = createRequire(import.meta.url)
const globalCfg = require('./config/global.json')

class Configuration {
  constructor(_serviceCfg, _securityChecksBeforeStart) {
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
    _securityChecksBeforeStart(this.numberOfArguments)
    
    // Global cfg
    this.globalCfg = globalCfg

    // Service cfg
    this.serviceCfg = require(_serviceCfg)

    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    // Fill json matching serviceCfg
    // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    console.log(this.serviceCfg)
    this.serviceCfg.contract.json = require(this.serviceCfg.contract.pathToAbi)
  }
}

export default Configuration
