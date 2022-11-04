#!/bin/bash
source ../SPD-Resources/Bash/99_Utils.sh
APP_GREP_PATTERN="EW"
APP_ENTRY="EventsWatcher.js"
APP_NAME="EventsWatcher"

# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
# 01. Select NETWORK
# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
exitIfNoNetworks
echo -e "${PURPLE}INFO: Please select the NETWORK so we can list SERVICES to stop${NC}"
network=$(selectAvailableNetwork)
echo ""
if [ -z "$network" ]; then
    echo -e "${PURPLE}INFO: ${RED}Invalid option, try again${NC}"
    echo ""
    exit
fi


# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
# 02. Select a service from selected NETWORK
# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
exitIfNoServices "$network"
exitIfNoAliveServices "$network" "$APP_ENTRY"
aliveServices=$(getAliveServices "$network" "$APP_ENTRY")

# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
# 03. Select service to stop
# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
echo -e "${PURPLE}INFO: Please select the service you would like to stop${NC}"
select service in $aliveServices; do
    echo ""
    if [ -z "$service" ]; then
        echo -e "${PURPLE}INFO: ${RED}Invalid option, try again${NC}"
        echo ""
        exit
    fi
    NAME_TO_SHOW="[$network] [$APP_NAME] [$service]"
    stopService "$APP_ENTRY" "$network" "$service" "$NAME_TO_SHOW"
    exit
done

exit