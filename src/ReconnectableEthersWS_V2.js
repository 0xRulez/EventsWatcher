
import ethers from 'ethers'

class ReconnectableEthersV2 {
  /**
     * Constructs the class
    */
  constructor (_continueRunApp) {
    this.continueRunApp = _continueRunApp
    this.provider = undefined
    this.config = undefined
    this.keepAliveInterval = undefined
    this.pingTimeout = undefined
    this.pingTesterCount = 0
  }

  /**
   * Load assets.
   * @param {Object} config Config object.
   */
  load (config) {
    this.config = config
    this.provider = new ethers.providers.WebSocketProvider(this.config.WS_PROVIDER_ADDRESS)

    this.defWsOpen = this.provider._websocket.onopen
    this.defWsClose = this.provider._websocket.onclose
    this.defWsPong = this.provider._websocket.onpong

    this.provider._websocket.onopen = (event) => this.onWsOpen(event)
    this.provider._websocket.onclose = (event) => this.onWsClose(event)
    this.provider._websocket.on('pong', (e) => {
      this.onWsPong(e)
    })
  }

  /**
     * Check class is loaded.
     * @returns Bool
     */
  isLoaded () {
    if (!this.provider) return false
    return true
  }

  onWsOpen (event) {
    // Keep Alive Interval
    this.keepAliveInterval = setInterval(() => {
      // Ping WebSocket
      this.provider._websocket.ping()

      // Expect a response in less than 6 seconds
      this.pingTimeout = setTimeout(() => {

        // Use `WebSocket#terminate()`, which immediately destroys the connection,
        // instead of `WebSocket#close()`, which waits for the close timer.
        // Delay should be equal to the interval at which your server
        // sends out pings plus a conservative assumption of the latency.
        this.provider._websocket.terminate()

      }, 6000)

    }, 8000)

    if (this.defWsOpen) {
      this.defWsOpen(event)
    }

    this.continueRunApp()
  }

  /**
     * Triggered on websocket termination.
     * Tries to reconnect again.
     */
  onWsClose (event) {
    clearInterval(this.keepAliveInterval)
    clearTimeout(this.pingTimeout)
    console.log('')
    console.log('WARNING: WS Connection lost! Trying to reconnect')
    console.log('=> Removing all listeners')
    this.provider.removeAllListeners()
    console.log('=> Reloading EventsWatcher')
    this.load(this.config)
    if (this.defWsClose) this.defWsClose(event)
    console.log('')
  }

  /**
     * Triggered on websocket pong.
     * Clear the interval
     */
  onWsPong (event) {
    // if (this.pingTesterCount > 0) {
    // console.log('DEBUG: Received pong from WS')

    // }
    clearTimeout(this.pingTimeout)
    // this.pingTesterCount = this.pingTesterCount + 1
  }
}
export default ReconnectableEthersV2
// module.exports = ReconnectableEthers
