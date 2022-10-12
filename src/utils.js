import { createRequire } from 'module'

import * as path from 'path'
import { exit } from 'process'
import { ethers } from 'ethers'
import Config from './config.js'
import Database from './database.js'
const requires = createRequire(import.meta.url)
const fs = requires('fs')

class Utils {
  constructor () {
    // Terminal Arguments
    this.args = ['', process.argv[2]]

    // Config Class Object
    this.config = new Config(this.args[1], this.securityChecksBeforeStart)

    // Database Class Object
    this.db = new Database(this)

    // Empty Object, will be filled later
    this.blockchain = undefined

    // Network Config Object
    this.network = this.getNetworkConfig()

    // Service Config Object
    this.service = this.getCurrentService()

    // Contract Config Object
    this.contract = this.service.contract

    // Terminal Colors
    this.colors = {
      defaultInfo: '\x1b[34m',
      end: '\x1b[0m',
      bright: '\x1b[1m',
      dim: '\x1b[2m',
      underscore: '\x1b[4m',
      blink: '\x1b[5m',
      reverse: '\x1b[7m',
      hidden: '\x1b[8m',
      fgBlack: '\x1b[30m',
      fgRed: '\x1b[31m',
      fgGreen: '\x1b[32m',
      fgYellow: '\x1b[33m',
      fgBlue: '\x1b[34m',
      fgMagenta: '\x1b[35m',
      fgCyan: '\x1b[36m',
      fgWhite: '\x1b[37m',
      bgBlack: '\x1b[40m',
      bgRed: '\x1b[41m',
      bgGreen: '\x1b[42m',
      bgYellow: '\x1b[43m',
      bgBlue: '\x1b[44m',
      bgMagenta: '\x1b[45m',
      bgCyan: '\x1b[46m',
      bgWhite: '\x1b[47m'
    }
  }

  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // __  __  _
  // |  \/  |(_) ___   ___
  // | |\/| || |/ __| / __|
  // | |  | || |\__ \| (__
  // |_|  |_||_||___/ \___|

  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // MISC: Gets project current selected contract
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  getCurrentService = () => {
    return this.config.serviceCfg
  }

  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // MISC: Welcome message
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  welcomeMessage = () => {
    console.log('------------------------------------------------------------------------------------------------------------------------')
    console.log(`${this.colors.fgGreen}(!) ${this.colors.fgGreen}Welcome to EventsWatcher-Miners${this.colors.end}`)
    console.log('------------------------------------------------------------------------------------------------------------------------')
    console.log(`${this.colors.fgGreen}(!) Network  => ${this.colors.end}${this.network.name}`)
    console.log(`${this.colors.fgGreen}(!) RPC Node  => ${this.colors.end}${this.network.rpc}`)
    console.log(`${this.colors.fgGreen}(!) Contract => ${this.colors.end}${this.service.contract.name}`)
    console.log(`${this.colors.fgGreen}(!) Config   => ${this.colors.end}${this.config.databaseEnv}`)
    console.log('------------------------------------------------------------------------------------------------------------------------')
  }

  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // MISC: Exit message if bad argumentss
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  exitWithReadme = (errorMsg) => {
    const fileName = path.basename(import.meta.url)
    console.log('##########################################################')
    console.log(`=> ERROR - ${errorMsg}`)
    console.log('##########################################################\n')
    this.consoleSubInfo('USAGE:')
    console.log(`$ node ${fileName} <coinName>`)
    console.log('')
    this.consoleSubInfo('EXAMPLE:')
    console.log(`$ node ${fileName} BNB`)
    console.log('')
    this.consoleSubInfo('DETAILS:')
    console.log('To be filled')
    console.log('Soon')
    console.log('')
    exit(1)
  }

  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // MISC: Exit on bad number of argumentss
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  exitIfNoCorrectNumberOfArguments = (n) => {
    for (let i = 1; i <= n; i++) {
      if (this.args[i] === undefined) {
        this.exitWithReadme(`Bad number of arguments, ${n} required`)
      }
    }
  }

  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // MISC: Exit on non-existent cfg file
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  exitIfNoCfgExists = () => {
    if (this.doesFileExist(this.args[1]) === false) {
      console.log('ERROR - Can not find specified config file => ' + this.args[1])
      exit(1)
    }
  }

  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // MISC: Do some security checks before starting
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  securityChecksBeforeStart = (numOfArgs) => {
    this.exitIfNoCorrectNumberOfArguments(numOfArgs)
    this.exitIfNoCfgExists()
  }

  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  //    _   _  _    _  _
  //   | | | || |_ (_)| | ___
  //   | | | || __|| || |/ __|
  //   | |_| || |_ | || |\__ \
  //    \___/  \__||_||_||___/
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // UTILS: Stylish console.log
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  consoleInfo = (messageLog, newLine = false) => {
    console.log(`${this.colors.fgMagenta}${this.getCurrentDatetTime()}${this.colors.end}`)
    console.log(`${this.colors.fgBlue}${messageLog}${this.colors.end}`)
    if (newLine === true) console.log('')
  }


  consoleSubInfo = (messageLog, newLine = false) => {
    console.log(`${this.colors.fgBlue}=> ${this.colors.end}${messageLog}`)
    if (newLine === true) console.log('')
  }

  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // UTILS: Formats datetime from a Date object
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  getDateDefaultFormat = (dateObj) => {
    const dateStr = `${('' + (dateObj.getFullYear()))}-${('0' + (dateObj.getMonth() + 1)).slice(-2)}-${('0' + dateObj.getDate()).slice(-2)}`
    const timeStr = `${('0' + dateObj.getHours()).slice(-2)}:${('0' + dateObj.getMinutes()).slice(-2)}:${('0' + dateObj.getSeconds()).slice(-2)}`
    return `${dateStr} ${timeStr}`
  }

  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // UTILS: Gets current datetime string
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  getCurrentDatetTime = () => {
    const dateObj = new Date()
    return this.getDateDefaultFormat(dateObj)
  }

  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // UTILS: Formats datetime from a unix timestamp
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  getDateFromUnixTimestamp = (timestamp) => {
    const dateObj = new Date(timestamp * 1000)
    return `${this.getDateDefaultFormat(dateObj)}`
  }

  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // UTILS: Formats datetime from a blockchain event (hex => unix timestamp)
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  getDateTimeFromBlockchainEvent = (hexTimestamp) => {
    const unixTimestamp = this.getIntFromHex(hexTimestamp)
    return `${this.getDateFromUnixTimestamp(unixTimestamp)}`
  }

  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // UTILS: Array-Util: checks if item exists in an array
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  doesItemExistInArray = (item, arr) => {
    const objKeys = Object.keys(arr)
    for (const i in objKeys) if (objKeys[i] === item) return true
    return false
  }

  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // UTILS: Check if a file exists given a path
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  doesFileExist = (pathToFile) => {
    try {
      if (fs.existsSync(pathToFile) === false) return false
      return true
    }
    catch (err) { return false }
  }

  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  //     ____             __ _
  //    / ___|___  _ __  / _(_) __ _
  //   | |   / _ \| '_ \| |_| |/ _` |
  //   | |__| (_) | | | |  _| | (_| |
  //    \____\___/|_| |_|_| |_|\__, |
  //                           |___/
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // CONFIG: Gets project current MySQL config
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

  getMySQLConfig = () => {
    // Check if enviroment exists in current mysql config and exits if it does not exist
    if (this.doesItemExistInArray(this.config.databaseEnv, this.config.globalCfg.mysql) === false) {
      console.log(`ERROR: Selected MySQL Enviroment "${this.config.databaseEnv}" does not exist`)
      exit(1)
    }
    // Return existing config
    return this.config.globalCfg.mysql[this.config.databaseEnv]
  }

  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // CONFIG: Gets project current Network config
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  getNetworkConfig = () => {
    // Check if network exists in global config and exits if it does not exist
    if (this.doesItemExistInArray(this.config.networkName, this.config.globalCfg.networks) === false) {
      console.log(`ERROR: Selected network "${this.config.networkName}" does not exist`)
      exit(1)
    }

    // Return exitsing network
    return this.config.globalCfg.networks[this.config.networkName]
  }

  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // ____  _            _        _           _
  // | __ )| | ___   ___| | _____| |__   __ _(_)_ __
  // |  _ \| |/ _ \ / __| |/ / __| '_ \ / _` | | '_ \
  // | |_) | | (_) | (__|   < (__| | | | (_| | | | | |
  // |____/|_|\___/ \___|_|\_\___|_| |_|\__,_|_|_| |_|
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // BLOCKCHAIN: RPC Node & Contract Setup
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  setupWeb3 = async () => {
    this.consoleInfo('INFO: Web3 RPC is initializing.', false)
    try {
      // Setup JSON RPC Provider
      this.blockchain = new ethers.providers.JsonRpcProvider(this.network.rpc)

      // Get the instance of the contract
      this.contract.instance = new ethers.Contract(this.contract.address, this.contract.json.abi, this.blockchain)

      // Connect to contract instance
      this.contract.instance.connect(this.blockchain)
      this.consoleSubInfo('Connected successfully\n')
    }
    catch (e) {
      console.log('ERROR while Web3 Setup. Check correct RPC / ABI / Contract Address in configuration\n\n', e); exit(1)
    }
    return true
  }

  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // BLOCKCHAIN: Loop the blockain by requesting info of 10,000 blocks
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  reloadEventsFromBlockchain = async () => {
    try {
      this.consoleInfo('INFO: Reloading events from blockchain')

      // Starting block is contract deploy transaction
      const startBlock = await this.blockchain.send('eth_getTransactionReceipt', [this.contract.deployTx]).then(async (r) => await this.getIntFromHex(r.blockNumber))

      // End block is current block number
      const endBlock = await this.blockchain.getBlockNumber()

      // Aux Var to temporarily store received events
      let allEvents = []

      // Log some info
      this.consoleSubInfo(`Contract TxId: ${this.contract.deployTx}`)
      this.consoleSubInfo(`Contract Deployed @block: ${startBlock}`)
      this.consoleSubInfo(`Syncing @block: ${endBlock}`)

      // Loop by requesting 10,000 blocks
      for (let i = startBlock; i < endBlock; i += 10000) {
        // Relative start & end of block
        const _startBlock = i
        const _endBlock = Math.min(endBlock, i + 9999)

        // Calculate % of filled up & log info
        const percent = parseFloat((endBlock - _startBlock) / endBlock * 100).toFixed(2)
        this.consoleSubInfo(`${_startBlock}/${endBlock} - ${endBlock - _startBlock} blocks remaining (${parseFloat(100 - percent).toFixed(2)}%)`)

        // Get the important stuff here, all the events br0h.
        const events = await this.contract.instance.queryFilter('*', _startBlock, _endBlock)

        // Fill up received events to array and keep going!
        allEvents = [...allEvents, ...events]
        console.log(allEvents)
      }
      this.consoleSubInfo('FINISH')
      console.log('')

      // Now loop each received event that is stored in array and insert in db if not present
      this.consoleInfo(`INFO: Now syncing ${allEvents.length} events with db`)
      let numberOfAddedEvents = 0
      for (const event of allEvents) {
        let found = false
        const eventType = event.event
        console.log('--------------------------------------------------------------------------------')
        this.consoleSubInfo(`Event: ${eventType}`)
        console.log('--------------------------------------------------------------------------------')
        // Now loop again each event, but this time we check against wanted events
        for (const wantedEvent of this.service.contract.wantedEvents.split(', ')) {
          // If iterared event is a wanted event...
          if (eventType === wantedEvent) {
            // Get useful event information
            const txHash = event.transactionHash
            const txBlock = await event.getBlock()

            // Print some info
            this.consoleSubInfo(`Date: ${await this.getDateTimeFromBlockchainEvent(txBlock.timestamp)} ${txBlock.timestamp}`)
            this.consoleSubInfo('Args: ')

            // Reconstruct the event object
            const eventObj = this.rebuildEventArguments(event)
            console.log(eventObj)

            // Stringify event object into json
            const eventData = JSON.stringify(eventObj)

            // Check if event is inserted in database
            const isEventInDatabase = await this.db.isEventInDatabase(txHash, eventData)
            if (isEventInDatabase === true) {
              this.consoleSubInfo('Record already exists.')
              break
            }

            // Insert event cause its not present
            this.consoleSubInfo('Record not found in db, now adding.')
            await this.db.insertEvent(txBlock.timestamp, txHash, eventType, eventData)
            this.consoleSubInfo('Inserted.')

            // Finish
            console.log('--------------------------------------------------------------------------------')
            console.log('')
            numberOfAddedEvents++
            found = true
          }
        }
        // Its not a wanted event, so skipped
        if (found === false) {
          this.consoleSubInfo('Skipping')
          console.log('')
          found = false
        }
      }
      this.consoleSubInfo('Finished syncing with db')
      this.consoleSubInfo(`Inserted ${numberOfAddedEvents}/${allEvents.length} events`)
      console.log('')
      return true
    }
    catch (e) {
      throw new Error(e)
    }
  }

  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // BLOCKCHAIN: Finds where is the event when all together
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  findWhereIsEvent = (eventArray) => {
    for (const i in eventArray) {
      for (const elem in eventArray[i]) {
        if (elem === 'transactionHash') return i
      }
    }
    this.consoleInfo('whereIsEvent NOT FOUND!!')
    exit(1)
  }

  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // BLOCKCHAIN: Reconstruct event object with only name arguments
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  rebuildEventArguments = (event) => {
    // Create aux var
    const eventObject = {}

    // Loop thought event arguments
    for (const arg in event.args) {
      // Store current argument value
      let currentValue = event.args[arg]

      // Check if argument value is not a number
      if (Number.isInteger(parseInt(arg)) === false) {
        // If not a number, it could be a BigNumber
        if (currentValue instanceof ethers.BigNumber) {
          // Obtain real integer value
          currentValue = this.getIntFromHex(event.args[arg])
        }
        // Store the value in the new aux object
        eventObject[arg] = currentValue
      }
    }
    // Return rebuilt object
    return eventObject
  }

  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // BLOCKCHAIN: Event Listeners Initializer
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  eventsListenter = async () => {
    this.consoleInfo('INFO: Event Listeners are initializing')

    // Loop each wanted event and listen to it
    for (const wantedEvent of this.service.contract.wantedEvents.split(', ')) {
      // Listen to event
      this.contract.instance.on(wantedEvent, async (...eventArray) => {
        // Get event position in mixed array
        const eventPosition = this.findWhereIsEvent(eventArray)

        // Got the event & now get some extra info
        const event = eventArray[eventPosition]
        const txBlock = await event.getBlock()
        const txHash = event.transactionHash
        const eventType = event.event

        // Reconstruct the event object
        const rebuiltEvent = this.rebuildEventArguments(event)

        // Insert event
        const eventData = JSON.stringify(rebuiltEvent)
        await this.db.insertEvent(txBlock.timestamp, txHash, eventType, eventData)

        // Log info
        console.log('---------------------------------------------------------------------------------------------------------------')
        console.log(`(!) ${wantedEvent} Event`)
        console.log('---------------------------------------------------------------------------------------------------------------')
        this.consoleSubInfo('Args: ')
        console.log(rebuiltEvent)
        this.consoleSubInfo('Inserted.\n')
      })

      // Print that we now listen to desired event
      this.consoleSubInfo(`OK - RPC: ${wantedEvent}`)
    }
  }

  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  // BLOCKCHAIN: Common Blockchain Utils
  // * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    getFloatFromWeiHex = async (hex, decimals) => parseFloat(ethers.utils.formatEther(hex)).toFixed(decimals)  // eslint-disable-line
    getIntFromWeiHex = async (hex) => parseInt(ethers.utils.formatEther(hex))                      // eslint-disable-line
    getIntFromHex = (hex) => parseInt(hex)                                                // eslint-disable-line


}

export default Utils
