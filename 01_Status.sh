#!/bin/bash
source ../SPD-Backend/Bash/99_Utils.sh
APP_ENTRY="EventsWatcher.js"
APP_NAME="EventsWatcher"

# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
# 01. Select network if any
# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
exitIfNoNetworks
echo -e "${PURPLE}INFO: Please select ${CYAN}[NETWORK] ${PURPLE}so we can list ${CYAN}[SERVICES]${NC}"
network=$(selectAvailableNetwork)
if [ -z "$network" ]; then
    echo -e "${PURPLE}INFO: ${RED}Invalid option, try again${NC}"
    echo ""
    exit
fi

# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
# 02. Show running network services 
# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
getServicesStatus "$network" "$APP_ENTRY" "$APP_NAME"
