class Utils {

    getFloatFromWeiHex    = async (hex, decimals) => parseFloat(ethers.utils.formatEther(hex)).toFixed(decimals) // eslint-disable-line
    getIntFromWeiHex      = async (hex, decimals) => parseInt(ethers.utils.formatEther(hex))                     // eslint-disable-line
    getIntFromHex         = async (hex)           => parseInt(hex)                                               // eslint-disable-line
}

export default Utils