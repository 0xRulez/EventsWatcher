#!/bin/bash
RED='\033[0;31m'
BLUE='\033[0;34m'
GREEN='\033[0;32m'
PURPLE='\033[0;35m'
WHITE='\033[0;37m'
CYAN='\033[0;36m'
YELLOW='\033[0;33m'
NC='\033[0m'
WEBAPP_JSON_CFG="../SPD-WebApp/src/Components/Config/global.json"

################################################################################################
# Part 01 - Select network
################################################################################################
showAvailableNetworks () {
    availableNetworks=`cat $WEBAPP_JSON_CFG | jq 'keys' -c | sed 's/\["//g' | sed 's/"\]//g' | sed 's/",/ /g' | sed 's/"//g'`
    # Security Check - No networks available
    if [ -z "$availableNetworks" ]
    then
        echo -e "${CYAN}=> ${RED}No networks available"
    fi

    # Select network
    select network in $availableNetworks
    do
        # Next step
        showAvailableCfgs $network
    done
}

################################################################################################
# Part 02 - Get available services
################################################################################################
showAvailableCfgs () {
    selectedNetwork=$1
    servicePathFromHere="./src/config/services/$selectedNetwork"
    servicePath="./config/services/$selectedNetwork"
    availableCfgs=`ls $servicePathFromHere 2>/dev/null`

    # Security Check - No services available
    if [ -z "$availableCfgs" ]
    then
        echo ""
        echo -e "${CYAN}=> ${RED}No services available"
        echo ""
        exit
    fi
    echo ""

    # SelectMenu => Service cfg
    echo -e "${PURPLE}INFO: Please select the service you would like to run${NC}"
    select selectedCfg in $availableCfgs
    do
        ################################################################################################
        # Part 03 - Run selected service
        ################################################################################################
        echo ""
        echo -e "${PURPLE}INFO: Launching service ${YELLOW}[$selectedNetwork] [$selectedCfg]${NC}"
        screen -A -m -d -S EW-$selectedNetwork-$selectedCfg bash -c "cd src && node index.js $servicePath/$selectedCfg 2>&1 | tee -a ../logs/EW-$selectedNetwork-$selectedCfg.log"
        echo ""
        echo -e "${PURPLE}INFO: EventsWatcher screen is now running!${NC}"
        screen -ls
        exit
    done
}

################################################################################################
# Starter
################################################################################################
echo -e "${CYAN}--------------------------------------------------------${NC}"
echo -e "${CYAN}# Welcome to EventsWatcher Runner${NC}"
echo -e "${CYAN}--------------------------------------------------------${NC}"
echo -e "${PURPLE}INFO: Please select the network you would like to run${NC}"
showAvailableNetworks
