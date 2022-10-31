#!/bin/bash
source ../SPD-Resources/Bash/99_Utils.sh
APP_GREP_PATTERN="EW"
APP_NAME="EventsWatcher"

# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
# 01. Select network if any
# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
exitIfNoNetworks
echo -e "${PURPLE}INFO: Please select the network so we can list services to stop${NC}"
network=$(selectAvailableNetwork)
echo ""

# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
# 02. Get alive services if any
# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
exitIfNoServices "$network"
exitIfNoAliveServices "$network" "$APP_GREP_PATTERN"
aliveServices=$(getAliveServices "$network" "$APP_GREP_PATTERN")

# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
# 03. Select service to stop
# * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
echo -e "${PURPLE}INFO: Please select the service you would like to stop${NC}"
select selectedService in $aliveServices; do
    echo ""
    prompStopService "$APP_GREP_PATTERN-$network-$selectedService" "[$network] [$APP_NAME] [$selectedService]" "yes"
    exit
done



