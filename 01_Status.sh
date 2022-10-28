#!/bin/bash
BLACK='\033[0;30m'
RED='\033[0;31m'
BLUE='\033[0;34m'
GREEN='\033[0;32m'
PURPLE='\033[0;35m'
WHITE='\033[0;37m'
CYAN='\033[0;36m'
YELLOW='\033[0;33m'
BGYELLOW='\033[0;42m'
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
        echo -e "${CYAN}=> ${RED}No networks available in WEBAPP CFG"
    fi

    # Select network
    select network in $availableNetworks
    do
        # Next step
        showAvailableProcs $network
    done
}

################################################################################################
# Part 02 - Get list of all services
################################################################################################
showAvailableProcs () {
    # Define some needed vars
    selectedNetwork=$1
    servicePathFromHere="./src/config/services/$selectedNetwork"
    availableCfgs=`ls $servicePathFromHere 2>/dev/null`
    servicePath="./config/services/$selectedNetwork"

    # Security Check - No services available
    if [ -z "$availableCfgs" ]
    then
        echo ""
        echo -e "${CYAN}=> ${RED}No running services"
        echo ""
        exit
    fi
    ################################################################################################
    # Part 03 - Loop each service looking for processes
    ################################################################################################
    aliveServices=""
    echo ""
    echo -e "${PURPLE}INFO: Querying running services for ${CYAN}[$selectedNetwork]${NC}"
    for cfg in $(ls $servicePathFromHere)
    do
        # Try to list process matching pattern
        isAlive=`ps -ef | grep EW | grep $selectedNetwork | grep $cfg`

        # If variable isAlive is empty, process / service not alive
        if [ -z "$isAlive" ]
        then
            echo -e "${CYAN}=> ${RED}[DOWN]${NC} ${YELLOW}$cfg"
        else
            # Process / service is alive
            echo -e "${CYAN}=> ${GREEN}[UP]${NC} ${YELLOW}$cfg"
            aliveServices+="$cfg "
        fi
    done
    echo ""
    exit
}

################################################################################################
# Starter
################################################################################################
echo -e "${PURPLE}INFO: Please select the network so we can list services${NC}"
showAvailableNetworks
