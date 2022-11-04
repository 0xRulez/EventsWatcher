#!/bin/bash
source ../SPD-Resources/Bash/99_Utils.sh
APP_GREP_PATTERN="EW"
APP_ENTRY="EventsWatcher.js"
APP_NAME="EventsWatcher"

# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
# 01. Select a network
# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
exitIfNoNetworks
echo -e "${PURPLE}INFO: Please select the NETWORK so we can list SERVICES to start${NC}"
network=$(selectAvailableNetwork)
echo ""
if [ -z "$network" ]; then
    echo -e "${PURPLE}INFO: ${RED}Invalid option, try again${NC}"
    echo ""
    exit
fi

# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
# 02. Select a service from selected network
# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
exitIfNoServices "$network"
echo -e "${PURPLE}INFO: Please select the SERVICE you would like to run${NC}"
service=$(selectNetworkService "$network")
echo ""
if [ -z "$service" ]; then
    echo -e "${PURPLE}INFO: ${RED}Invalid option, try again${NC}"
    echo ""
    exit
fi

# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
# 03. Build & launch service
# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
if [ ! -d "./logs/$network" ]; then
    mkdir "./logs/$network"
fi

screenName="$APP_GREP_PATTERN-$network-$service"
serviceCMD="cd src && node $APP_ENTRY ./$APP_CONFIG_PATH/$network/$service 2>&1 | tee -a ../logs/$network/$service.log"
startService "$network" "$screenName" "$serviceCMD" "$APP_ENTRY" "$service"

exit