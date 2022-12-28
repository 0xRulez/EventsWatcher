#!/bin/bash
source ../SPD-Tools/99_Utils.sh
APP_GREP_PATTERN="EW"
APP_ENTRY="EventsWatcher.js"
APP_NAME="EventsWatcher"

# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
# 01. Select NETWORK
# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
exitIfNoNetworks
echo -e "${PURPLE}INFO: Please select the NETWORK so we can list SERVICES to stop${NC}"
NETWORK=$(selectAvailableNetwork)
echo ""
if [ -z "$NETWORK" ]; then
    echo -e "${PURPLE}INFO: ${RED}Invalid option, try again${NC}"
    echo ""
    exit
fi


# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
# 02. Select a service from selected NETWORK
# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
exitIfNoServices "$NETWORK"
exitIfNoAliveServices "$NETWORK" "$APP_ENTRY"
aliveServices=$(getAliveServices "$NETWORK" "$APP_ENTRY")

# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
# 03. Select service to stop
# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *


echo -e "${PURPLE}INFO: Please select the service you would like to stop${NC}"
select SERVICE in $aliveServices ALL; do
    echo ""
    if [ -z "$SERVICE" ]; then
        echo -e "${PURPLE}INFO: ${RED}Invalid option, try again${NC}"
        echo ""
        exit
    fi
    if [ "$SERVICE" == "ALL" ]; then
        stopAllServices "$NETWORK" "$APP_GREP_PATTERN" "$APP_ENTRY"
        exit
    fi
    stopService "$APP_ENTRY" "$NETWORK" "$SERVICE" "$NAME_TO_SHOW"
    exit
done

exit