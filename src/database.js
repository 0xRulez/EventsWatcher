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
    this.utils = _utils                                                         // Util Functions
    this.colors = _utils.colors                                                 // Terminal Colors
    this.consoleInfo = this.utils.consoleInfo                                   // Console Sub Info INFO:
    this.consoleSubInfo = this.utils.consoleSubInfo                             // Console Sub Info =>
    this.config = this.utils.getMySQLConfig()                                   // Include MySQL Config
    this.svcEventsTable = this.utils.config.serviceCfg.database.tableName       // Service Events Table Name
    this.svcSyncsTable = 'svcSyncs'                                             // Services Synced Blocks
  }

  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  / Creates connection pool & connets to it
  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **/
  openDatabase = async () => {
    try {
      this.consoleInfo('INFO: MySQL database is initializing...')
      this.connector = await mysql.createPool({ host: this.config.database.host, user: this.config.database.username, password: this.config.database.password, database: this.config.database.name })
      await this.testConnection()
      this.consoleSubInfo(`${this.colors.fgGreen}Connected successfully${this.colors.end}`)


      // Check if svc table exist for events storage
      if (await this.doesTableExist(this.svcEventsTable) === false) {
        this.consoleSubInfo('MySQL Table ' + this.svcEventsTable + ' does not exist')
        await this.createSvcEventsTable(this.svcEventsTable)
        this.consoleSubInfo('Table created ✅\n')
      }

      // Check if SVC Syncs Table exist for services to sync up data up to X block
      if (await this.doesTableExist(this.svcSyncsTable) === false) {
        this.consoleSubInfo('MySQL Table ' + this.svcSyncsTable + ' does not exist')
        await this.createSvcSyncsTable(this.svcSyncsTable)
        this.consoleSubInfo('Table created ✅')
      }
    }
    catch (e) {
      throw new Error(e)
    }
    finally {
      console.log('')
    }
  }

  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  / Test MySQL Connection
  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **/
  testConnection = async () => {
    try {
      const conn = await this.connector.getConnection()
      await conn.query('SELECT 1')
      conn.release()
    }
    catch (e) {
      console.log(e)
      exit(1)
    }
  }

  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  / Creates a table in current database
  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  * @param {string}  tableName    - Table name
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  createSvcEventsTable = async (tableName) => {
    try {
      // eslint-disable-next-line no-multi-str
      const tableQuery = 'CREATE TABLE ' + tableName + ' (`timestamp` int DEFAULT NULL,\
        `txHash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,\
        `network` varchar(255) DEFAULT NULL,\
        `contractAddr` varchar(255) DEFAULT NULL,\
        `coinName` varchar(30) DEFAULT NULL,\
        `type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,\
        `data` varchar(255) DEFAULT NULL,\
        PRIMARY KEY (`txHash`,`type`)\
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;'
      const [rows] = await this.connector.query(tableQuery)
      const createdTable = rows
      if (createdTable === 0) return false
      return true
    }
    catch (e) {
      console.log(e)
    }
  }

  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  / Creates SVC Syncs table (A table where services (svcs) can sync their block)
  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  * @param {string}  tableName    - Table name
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  createSvcSyncsTable = async (tableName) => {
    try {
      // eslint-disable-next-line no-multi-str
      const queryString = 'CREATE TABLE ' + tableName + '  (\
        `svcName` varchar(255) NOT NULL,\
        `network` varchar(255) NOT NULL,\
        `coinName` varchar(255) NOT NULL,\
        `sync_block` bigint NULL,\
        PRIMARY KEY (`svcName`, `network`, `coinName`)\
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;'
      const [rows] = await this.connector.query(queryString)
      if (rows === 0) return false
      return true
    }
    catch (e) {
      console.log(e)
    }
  }

  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  / Checks if table exists
  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  * @param {string}  tableName    - Table name
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  doesTableExist = async (tableName) => {
    try {
      const [rows] = await this.connector.query('SELECT COUNT(TABLE_NAME) FROM information_schema.TABLES WHERE TABLE_SCHEMA LIKE ? AND TABLE_TYPE LIKE \'BASE TABLE\' AND TABLE_NAME = ?', [this.config.database.name, tableName])
      const doesTableExist = rows[0]['COUNT(TABLE_NAME)']
      if (doesTableExist === 0) return false
      return true
    }
    catch (e) {
      console.log(e)
    }
  }

  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  / Event Exists
  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  * @param {string}  txHash      - Transaction hash
  * @param {string}  eventType   - Event type
  * @param {string}  networkName - Network name
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  isEventInDatabase = async (txHash, eventType, networkName) => {
    try {
      const [rows] = await this.connector.query(`SELECT * FROM ${this.svcEventsTable} WHERE txHash = ? AND type = ? AND network = ?`, [txHash, eventType, networkName])
      if (rows.length === 0) return false
      return true
    }
    catch (e) {
      console.log(e)
    }
  }

  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  / Insert Event
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
    try {
      const [rows, fields, affectedRows] = await this.connector.execute(`INSERT INTO ${this.svcEventsTable} (timestamp, txHash, network, contractAddr, coinName, type, data) VALUES(?, ?, ?, ?, ?, ? , ?)`, [timestamp, txHash, network, contractAddr, coinName, type, eventData])
      if (this.config.database.debug === true) console.log(rows, fields, affectedRows)
      return true
    }
    catch (e) {
      return e
    }

  }

  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  / ServiceCFG SyncedBlock Get block number if exists and creates it if it doesn't
  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **/
  getServiceSyncBlock = async () => {
    const svcName = this.utils.config.serviceCfg.type
    const networkName = this.utils.config.serviceCfg.networkName
    const coinName = this.utils.config.serviceCfg.contract.coinName
    try {
      const [rows] = await this.connector.query(`SELECT * FROM ${this.svcSyncsTable} WHERE svcName = ? AND network = ? AND coinName = ?`, [svcName, networkName, coinName])

      // Sync Block Entry does not exist in database, add row
      if (rows.length === 0) {
        const [rows] = await this.connector.execute(`INSERT INTO ${this.svcSyncsTable} (svcName, network, coinName, sync_block) VALUES(?, ?, ?, ?)`, [svcName, networkName, coinName, -1])
        if (rows.affectedRows === 1) return false
      }
      return rows[0].sync_block === -1 ? false : rows[0].sync_block
    }
    catch (e) {
      console.log(e)
    }
  }

  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  / ServiceCFG SyncedBlock Update and returns if it does
  /** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** **
  * @param {string}  _newBlockNumber  - Coin Name
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
  updateServiceSyncBlock = async (_newBlockNumber) => {
    const svcName = this.utils.config.serviceCfg.type
    const networkName = this.utils.config.serviceCfg.networkName
    const coinName = this.utils.config.serviceCfg.contract.coinName
    try {
      const [rows] = await this.connector.query(`UPDATE ${this.svcSyncsTable} SET sync_block = ? WHERE svcName = ? AND network = ? AND coinName = ?`, [_newBlockNumber, svcName, networkName, coinName])
      if (rows.affectedRows === 0) {
        return false
      }
      return true
    }
    catch (e) {
      console.log(e)
    }
  }
}

export default Database
