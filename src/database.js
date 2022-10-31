/* eslint-disable no-multi-spaces */
// ____            _             _
// |  _ \    __ _  | |_    __ _  | |__     __ _   ___    ___
// | | | |  / _` | | __|  / _` | | '_ \   / _` | / __|  / _ \
// | |_| | | (_| | | |_  | (_| | | |_) | | (_| | \__ \ |  __/
// |____/   \__,_|  \__|  \__,_| |_.__/   \__,_| |___/  \___|

import mysql from 'mysql2/promise'
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
  / DB: Creates connection pool & connets to it
  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **/
  openDatabase = async () => {
    try {
      this.utils.consoleInfo('INFO: MySQL database is initializing...')
      // this.connector = await mysql.createConnection({ host: this.config.database.host, user: this.config.database.username, password: this.config.database.password, database: this.config.database.name })
      this.connector = await mysql.createPool({ host: this.config.database.host, user: this.config.database.username, password: this.config.database.password, database: this.config.database.name }, () => {
        console.log('hi')
      })

      if (await this.doesTableExist(this.tableName) === false) {
        this.utils.consoleSubInfo('tableName ' + this.tableName + ' does not exist')
        await this.createTable(this.tableName)
        this.utils.consoleSubInfo('Table created ✅')
      }
      console.log('')
    }
    catch (e) {
      throw new Error(e)
    }
  }

  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  / DB: Creates a table in current database
  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  * @param {string}  tableName    - Table name
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  createTable = async (tableName) => {
    const [rows] = await this.connector.query('CREATE TABLE ' + tableName + ' (`timestamp` int NULL, `txHash` varchar(255) NULL, `network` varchar(255) NULL, `contractAddr` varchar(255) NULL, `coinName` varchar(30) NULL, `type` varchar(255) NULL, `data` varchar(255) NULL)')
    const createdTable = rows
    if (createdTable === 0) return false
    return true
  }

  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  / DB: Checks if table exists
  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  * @param {string}  tableName    - Table name
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  doesTableExist = async (tableName) => {
    const [rows] = await this.connector.query('SELECT COUNT(TABLE_NAME) FROM information_schema.TABLES WHERE TABLE_SCHEMA LIKE ? AND TABLE_TYPE LIKE \'BASE TABLE\' AND TABLE_NAME = ?', [this.config.database.name, tableName])
    const doesTableExist = rows[0]['COUNT(TABLE_NAME)']
    if (doesTableExist === 0) return false
    return true
  }

  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  / DB: Event Exists
  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  * @param {string}  txHash      - Transaction hash
  * @param {string}  eventType   - Event type
  * @param {string}  networkName - Network name
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  isEventInDatabase = async (txHash, eventType, networkName) => {
    const [rows] = await this.connector.query(`SELECT * FROM ${this.tableName} WHERE txHash = ? AND type = ? AND network = ?`, [txHash, eventType, networkName])
    if (rows.length === 0) return false
    return true
  }

  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  / DB: Insert Event
  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  * @param    {number}  timestamp     - Number
  * @param    {string}  txHash        - Transaction hash
  * @param    {string}  network       - Network name
  * @param    {string}  contractAddr  - Contract address
  * @param    {string}  coinName      - Coin name
  * @param    {string}  type          - Event type
  * @param    {string}  eventData     - Event data
  * @returns  {boolean}               - True if inserted || False if not inserted (present)
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  insertEvent = async (timestamp, txHash, network, contractAddr, coinName, type, eventData) => {
    // Check if event is present
    const isEventInDatabase = await this.isEventInDatabase(txHash, eventData)
    if (isEventInDatabase) {
      return false
    }

    // Debug
    if (this.config.database.debug === true) console.log('++insertEvent: Inserting... ')

    // Insert Event
    const [rows, fields, affectedRows] = await this.connector.execute(`INSERT INTO ${this.tableName} (timestamp, txHash, network, contractAddr, coinName, type, data) VALUES(?, ?, ?, ?, ?, ? , ?)`, [timestamp, txHash, network, contractAddr, coinName, type, eventData])
    // Exit process on error
    // Debug
    if (this.config.database.debug === true) console.log(rows, fields, affectedRows)
  }
}

export default Database
