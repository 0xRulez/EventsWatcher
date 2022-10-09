/* eslint-disable no-multi-spaces */
// ____            _             _
// |  _ \    __ _  | |_    __ _  | |__     __ _   ___    ___
// | | | |  / _` | | __|  / _` | | '_ \   / _` | / __|  / _ \
// | |_| | | (_| | | |_  | (_| | | |_) | | (_| | \__ \ |  __/
// |____/   \__,_|  \__|  \__,_| |_.__/   \__,_| |___/  \___|

import { exit } from 'process'
import mysql from 'mysql2'

class Database {

  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  / Constructor
  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **/
  constructor (_utils) {
    this.utils = _utils
    this.config = this.utils.getMySQLConfig()                              // Include global mysql config
    this.tableName = this.utils.config.serviceCfg.database.tableName       // Table name
    this.connector = undefined                                             // MySQL connector
  }

  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  / DB: MySQL Open Connection
  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **/
  openDatabase = async () => {
    return new Promise((resolve, reject) => {
      try {
        this.utils.consoleInfo('INFO: MySQL database is initializing...')
        this.connector = mysql.createConnection({
          host: this.config.database.host,
          user: this.config.database.username,
          password: this.config.database.password,
          database: this.config.database.name
        })
        console.log('=> Connected successfully\n')
        resolve(true)
      }
      catch (e) {
        console.log('=> MySQL ERROR!')
        console.log(e)
        exit(1)
      }
    })
  }

  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  / DB: Throws the error and exit
  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **/
  throwExitError = (err) => {
    console.log('=> MySQL ERROR!' + err)
    exit(1)
  }

  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  / DB: Fetch All Events
  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **/
  fetchAllEvents = async () => {
    return new Promise((resolve) => {
      this.connector.query(`SELECT * FROM ${this.tableName} ORDER BY timestamp DESC;`, (err, results) => {
        if (err) this.throwExitError(err)
        if (this.config.debug) console.log('++fetchEvents: ', results)
        resolve(results)
      })
    })
  }

  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  / DB: Fetch Last Events
  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **/
  fetchLastEvents = async () => {
    return new Promise((resolve) => {
      this.connector.query(`SELECT * FROM ${this.tableName} ORDER BY timestamp DESC LIMIT 4;`, (err, results) => {
        if (err) this.throwExitError(err)
        if (this.config.debug) console.log('++fetchEvents: ', results)
        resolve(results)
      })
    })
  }

  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  / DB: Event Exists
  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  * @param {number} timestamp   - Datetime
  * @param {string} eventType   - Event type
  * @param {string} address     - User address
  * @param {float}  value       - Value converted to ETH
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  isEventInDatabase = (timestamp, txHash, type) => {
    return new Promise((resolve) => {
      this.connector.execute(`SELECT * FROM ${this.tableName} WHERE timestamp = UNIX_TIMESTAMP(?) AND type = ? AND txHash = ?`, [timestamp, eventType, address, value], (err, results) => {
        // eslint-disable-next-line prefer-promise-reject-errors
        if (err) this.throwExitError(err)
        if (this.config.debug) console.log('++isEventInDatabase: ', results)
        if (results.length === 0) resolve(false)
        resolve(true)
      })
    })
  }

  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  / DB: Insert Event
  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  * @param    {number}  timestamp   - Datetime
  * @param    {string}  txHash      - Transaction hash
  * @param    {string}  type        - Event type
  * @param    {string}  data        - Event data
  * @returns  {boolean}             - True if inserted || False if not inserted (present)
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  insertEvent = ( timestamp, txHash, type, data ) => {
    return new Promise((resolve, reject) => {
      // Debug
      if (this.config.debug) console.log('++insertEvent')

      // Check if event is present
      const r = this.isEventInDatabase(timestamp, type, data).then((isEventInDatabase) => {

        // Resolve false if event is present
        if (isEventInDatabase) {          
          resolve(false)
          return false
        }
        
        // Debug
        if (this.config.debug) console.log('++insertEvent: Inserting... ')

        // Insert Event
        this.connector.execute(`INSERT INTO ${this.tableName} (timestamp, txHash, type, data) VALUES(?, ?, ?, ?, ?)`,[timestamp, txHash, type, data], (err, results) => {
          // Exit process on error
          if (err) this.throwExitError(err)
          // Debug
          if (this.config.debug) console.log('++insertEvent: ', results)
          // Resolve promise
          if (results.affectedRows == 1) resolve(true)
        })
      })
    })
  }

}

export default Database
