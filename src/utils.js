import { createRequire } from 'module'
const require = createRequire(import.meta.url)

import Config from './config.js'
import * as path from 'path'
import { exit } from 'process'
const fs = require('fs')

class Utils {
    constructor() {
        this.args = ['', process.argv[2]]
        this.config = new Config(this.args[1], this.securityChecksBeforeStart)
        this.colors = {
            defaultInfo: '\x1b[34m',
            end: '\x1b[0m',
            bright: "\x1b[1m",
            dim: "\x1b[2m",
            underscore: "\x1b[4m",
            blink: "\x1b[5m",
            reverse: "\x1b[7m",
            hidden: "\x1b[8m",
            fgBlack: "\x1b[30m",
            fgRed: "\x1b[31m",
            fgGreen: "\x1b[32m",
            fgYellow: "\x1b[33m",
            fgBlue: "\x1b[34m",
            fgMagenta: "\x1b[35m",
            fgCyan: "\x1b[36m",
            fgWhite: "\x1b[37m",
            bgBlack: "\x1b[40m",
            bgRed: "\x1b[41m",
            bgGreen: "\x1b[42m",
            bgYellow: "\x1b[43m",
            bgBlue: "\x1b[44m",
            bgMagenta: "\x1b[45m",
            bgCyan: "\x1b[46m",
            bgWhite: "\x1b[47m"
        }
    }
    // Stylish console.log
    consoleInfo = (messageLog, newLine = false) => {
        console.log(`${this.colors.fgMagenta}${this.getCurrentDatetTime()}${this.colors.end}`);
        console.log(`${this.colors.fgBlue}${messageLog}${this.colors.end}`)
        if (newLine === true) console.log('')
    }
    // Common Blockchain Utils
    getFloatFromWeiHex    = async (hex, decimals)   => parseFloat(ethers.utils.formatEther(hex)).toFixed(decimals)  // eslint-disable-line
    getIntFromWeiHex      = async (hex)             => parseInt(ethers.utils.formatEther(hex))                      // eslint-disable-line
    getIntFromHex         = (hex)                   => parseInt(hex)                                                // eslint-disable-line

    // Formats datetime from a Date object
    getDateDefaultFormat = (dateObj) => {
        const dateStr = `${('' + (dateObj.getFullYear() ))}-${('0' + (dateObj.getMonth() + 1)).slice(-2)}-${('0' + dateObj.getDate()).slice(-2)}`
        const timeStr = `${('0'+dateObj.getHours()).slice(-2)}:${('0'+dateObj.getMinutes()).slice(-2)}:${('0'+dateObj.getSeconds()).slice(-2)}`
        return `${dateStr} ${timeStr}`
    }
    // Gets current datetime string
    getCurrentDatetTime = () => {
        const dateObj = new Date()
        return this.getDateDefaultFormat(dateObj)
    }
    // Formats datetime from a unix timestamp
    getDateFromUnixTimestamp = (timestamp) => {
        const dateObj = new Date(timestamp * 1000)
        return `${this.getDateDefaultFormat(dateObj)}`
    }
    // Formats datetime from a blockchain event (hex => unix timestamp)
    getDateTimeFromBlockchainEvent = (hexTimestamp) => {
        const unixTimestamp = this.getIntFromHex(hexTimestamp);
        return `${this.getDateFromUnixTimestamp(unixTimestamp)}`
    }
    // Welcome message
    welcomeMessage = () => {
        const network = this.getNetwork()
        const contract = this.getContract(this.args[1])
        console.log(`------------------------------------------------------------------------------------------------------------------------`)
        console.log(`${this.colors.fgGreen}(!) ${this.colors.fgGreen}Welcome to EventsWatcher-Miners${this.colors.end}`)
        console.log(`------------------------------------------------------------------------------------------------------------------------`)
        console.log(`${this.colors.fgGreen}(!) Network  => ${this.colors.end}${network.name}`)
        console.log(`${this.colors.fgGreen}(!) Contract => ${this.colors.end}${contract.name}`)
        console.log(`${this.colors.fgGreen}(!) Config   => ${this.colors.end}${this.config.currentEnviroment}`)
        console.log(`------------------------------------------------------------------------------------------------------------------------`)
    }
    // Exit message if bad argumentss
    exitWithReadme = (errorMsg) => {
        const fileName = path.basename(import.meta.url);
        console.log('##########################################################')
        console.log(`=> ERROR - ${errorMsg}`)
        console.log('##########################################################\n')
        console.log('=> USAGE:')
        console.log(`$ node ${fileName} <coinName>`)
        console.log('')
        console.log('=> EXAMPLE:')
        console.log(`$ node ${fileName} BNB`)
        console.log('')
        console.log('=> DETAILS:')
        console.log('To be filled')
        console.log('Soon')
        console.log('')
        exit(1)
    }
    // Exit on bad number of argumentss 
    exitIfNoCorrectNumberOfArguments = (n) => {
        for (var i = 1; i <= n; i++) {
            if (this.args[i] === undefined) {
                this.exitWithReadme(`Bad number of arguments, ${n} required`)
            }
        }
    }
    // Exit on non-existent cfg file
    exitIfNoCfgExists = () => {
        if (this.doesFileExist(this.args[1]) === false) {
            console.log('ERROR - Can not find specified config file => ' + this.args[1])
            exit(1)
        }
    }
    // Do some security checks before starting
    securityChecksBeforeStart = (numOfArgs) => {
        this.exitIfNoCorrectNumberOfArguments(numOfArgs)
        this.exitIfNoCfgExists()
    }
    // Array-Util: checks if item exists in an array
    doesItemExistInArray = (item, arr) => {
        const objKeys = Object.keys(arr)
        for (let i in objKeys) if (objKeys[i] === item) return true
        return false
    }
    // Check if a file exists given a path
    doesFileExist = (pathToFile) => {
        try { 
            if (fs.existsSync(pathToFile) === false) return false
            return true
        }
        catch(err) { return false }
    }
    // Returns All Configs
    getConfig = () => {
        return this.config.globalCfg
    }
    // Gets project current MySQL config
    getMySQLConfig = () => {
        if (this.doesItemExistInArray(this.config.currentEnviroment, this.config.globalCfg.mysql) === false) {
            console.log(`ERROR: Selected config "${this.config.currentEnviroment}" does not exist`)
            exit(1)
        }
        return this.config.globalCfg.mysql[this.config.currentEnviroment]
    }
    // Gets project current Network config
    getNetwork = () => {
        if (this.doesItemExistInArray(this.config.currentNetwork, this.config.globalCfg.networks) === false) {
            console.log(`ERROR: Selected network "${this.config.currentNetwork}" does not exist`)
            exit(1)
        }
        return this.config.globalCfg.networks[this.config.currentNetwork]
    }
    // Gets project current selected contract
    getContract = (coinName) => {
        const network = this.getNetwork()
        console.log(network)
        if (this.doesItemExistInArray(coinName, network.contracts) === false) {
            console.log(`ERROR: Selected coin "${coinName}" does not exist`)
            exit(1)
        }
        return network.contracts[coinName]
    }
}

export default Utils