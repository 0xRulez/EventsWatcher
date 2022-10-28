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
        exit
    fi
    
    # Select network
    select network in $availableNetworks
    do
        # Next step
        showAvailableProcs $network
    done
}

################################################################################################
# Part 02 - Get services that are alive
################################################################################################
showAvailableProcs () {
    selectedNetwork=$1
    servicePathFromHere="./src/config/services/$selectedNetwork"
    availableCfgs=`ls $servicePathFromHere 2>/dev/null`
    servicePath="./config/services/$selectedNetwork"
    
    # Security Check - No services available
    if [ -z "$availableCfgs" ]
    then
        echo ""
        echo -e "${CYAN}=> ${RED}No services available"
        echo ""
        exit
    fi
    
    aliveServices=""
    echo ""
    echo -e "${PURPLE}INFO: Querying services for ${CYAN}[$selectedNetwork]${NC}"
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
    
    ################################################################################################
    # Security: Stop here if there are no services to stop
    ################################################################################################
    if [ -z "$aliveServices" ]
    then
        echo ""
        echo -e "${CYAN}=> ${RED}THERE ARE NO SERVICES TO STOP!${NC}"
        echo ""
        exit
    fi
    echo -e ""
    
    ################################################################################################
    # Part 03 - Choose to stop alive services
    ################################################################################################
    echo -e "${PURPLE}INFO: Please select the service you would like to stop${NC}"
    select stopCfg in $aliveServices
    do
        echo ""
        echo -e "${PURPLE}INFO: Stopping service ${CYAN}[$selectedNetwork] ${YELLOW}[$stopCfg]${NC}"
        pids=`ps -ef | grep EW | grep $selectedNetwork | grep $stopCfg | awk '{print $2}'`
        ps -ef | grep EW | grep $selectedNetwork | grep $stopCfg | awk '{print $2}' | xargs kill -9
        echo ""
        echo -e "${PURPLE}INFO: Killed PID(s)${NC}"
        for pid in $pids
        do
            echo -e "${CYAN}=> ${YELLOW}$pid${NC}"
        done
        echo ""
        screen -wipe > /dev/null
        exit
    done
}


################################################################################################
# Starter
################################################################################################
echo -e "${PURPLE}INFO: Please select the network so we can list services for stop${NC}"
showAvailableNetworks

