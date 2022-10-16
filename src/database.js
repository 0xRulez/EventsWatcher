/* eslint-disable no-multi-spaces */
// ____            _             _
// |  _ \    __ _  | |_    __ _  | |__     __ _   ___    ___
// | | | |  / _` | | __|  / _` | | '_ \   / _` | / __|  / _ \
// | |_| | | (_| | | |_  | (_| | | |_) | | (_| | \__ \ |  __/
// |____/   \__,_|  \__|  \__,_| |_.__/   \__,_| |___/  \___|

import mysql from 'mysql2/promise'
import { exit } from 'process'
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
  / DB: Throws the error and exit
  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **/
  throwExitError = (e) => {
    console.log('=> MySQL ERROR!' + e)
    throw new Error(e)
  }

  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  / DB: MySQL Open Connection
  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **/
  openDatabase = async () => {
    try {
      this.utils.consoleInfo('INFO: MySQL database is initializing...')
      // this.connector = await mysql.createConnection({ host: this.config.database.host, user: this.config.database.username, password: this.config.database.password, database: this.config.database.name })
      this.connector = await mysql.createPool({ host: this.config.database.host, user: this.config.database.username, password: this.config.database.password, database: this.config.database.name })
      this.utils.consoleSubInfo('Connected successfully\n')
      if (this.doesTableExist(this.tableName) === false) {
        this.utils.consoleSubInfo('tableName ' + this.tableName + ' does not exist')
        exit(1)
      }
    }
    catch (e) {
      throw new Error(e)
    }
  }

  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  / DB: MySQL Open Connection
  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **/
  doesTableExist = async (tableName) => {
    const [rows] = await this.connector.query('SELECT COUNT(TABLE_NAME) FROM information_schema.TABLES WHERE TABLE_SCHEMA LIKE ? AND TABLE_TYPE LIKE \'BASE TABLE\' AND TABLE_NAME = ?', [this.config.database.name, tableName])
    if (rows.length === 0) return false
    return true
  }

  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  / DB: Event Exists
  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  * @param {string}  txHash      - Transaction hash
  * @param {string}  eventData   - Event data
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  isEventInDatabase = async (txHash, eventData) => {
    const [rows] = await this.connector.query(`SELECT * FROM ${this.tableName} WHERE txHash = ? AND data = ?`, [txHash, eventData])
    if (rows.length === 0) return false
    return true
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
  insertEvent = async (timestamp, txHash, type, eventData) => {
    // Check if event is present
    const isEventInDatabase = await this.isEventInDatabase(txHash, eventData)
    if (isEventInDatabase) {
      return false
    }

    // Debug
    if (this.config.database.debug === true) console.log('++insertEvent: Inserting... ')

    // Insert Event
    const [rows, fields, affectedRows] = await this.connector.execute(`INSERT INTO ${this.tableName} (timestamp, txHash, type, data) VALUES(?, ?, ?, ?)`, [timestamp, txHash, type, eventData])
    // Exit process on error
    // Debug
    if (this.config.database.debug === true) console.log(rows, fields, affectedRows)
  }
}

export default Database
