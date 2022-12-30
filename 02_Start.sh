#!/bin/bash
source ../SPD-Tools/99_Utils.sh
APP_GREP_PATTERN="EW"
APP_ENTRY="EventsWatcher.js"
APP_NAME="EventsWatcher"

# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
# 01. Select a NETWORK
# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
exitIfNoNetworks
echo -e "${PURPLE}INFO: Please select the NETWORK so we can list SERVICES to start${NC}"
NETWORK=$(selectAvailableNetwork)
echo ""
if [ -z "$NETWORK" ]; then
    echo -e "${PURPLE}INFO: ${RED}Invalid option, try again${NC}"
    echo ""
    exit
fi

# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
# 02. Select a SERVICE from selected NETWORK
# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
exitIfNoServices "$NETWORK"
echo -e "${PURPLE}INFO: Please select the SERVICE you would like to run${NC}"
SERVICE=$(selectNetworkService "$NETWORK")
echo ""
if [ -z "$SERVICE" ]; then
    echo -e "${PURPLE}INFO: ${RED}Invalid option, try again${NC}"
    echo ""
    exit
fi
if [ ! -d "./logs/$NETWORK" ]; then
    mkdir "./logs/$NETWORK"
fi

# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
# 03. Build & launch SERVICE
# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
if [ "$SERVICE" == "ALL" ]; then
    startAllServices "$NETWORK" "$APP_GREP_PATTERN" "$APP_ENTRY"
    exit
fi

# Resolves to "LT-BSC_Testnet-LotteryBNB.json"
SCREEN_NAME="$APP_GREP_PATTERN-$NETWORK-$SERVICE"

# Resolves to "cd src && node LotteryTimer.js ./config/services/BSC_Testnet/LotteryBNB.json 2>&1 | tee -a ../logs/BSC_Testnet/LotteryBNB.json"
SERVICE_CMD="cd src && node $APP_ENTRY ./$SERVICES_RELPATH_CONFIG_SERVICES/$NETWORK/$SERVICE 2>&1 | tee -a ../logs/$NETWORK/$SERVICE.log"

# Call startService with required arguments
startService "$NETWORK" "$SCREEN_NAME" "$SERVICE_CMD" "$APP_ENTRY" "$SERVICE" "return" "$APP_GREP_PATTERN"
exit