#!/bin/bash

# Function to select available service cfgs and then run it
showAvailableCfgs () {
    echo -e "\n"
    # Define some needed vars
    selectedNetwork=$1
    servicePathFromHere="./src/config/services/$selectedNetwork"
    servicePath="./config/services/$selectedNetwork"
    availableCfgs=`ls $servicePathFromHere`

    # SelectMenu => Service cfg
    echo "INFO: Please select the service you would like to run"
    select selectedCfg in $availableCfgs
    do
        echo -e "\n"
        echo "INFO: Launching service cfg: $servicePath/$selectedCfg "
        screen -A -m -d -S EW-$selectedNetwork-$selectedCfg bash -c "cd src && node index.js $servicePath/$selectedCfg 2>&1 | tee -a ../logs/EW-$selectedNetwork-$selectedCfg.log"
        echo "INFO: EventsWatcher screen is now running!"
        screen -ls
        exit
    done
}

while true
do
    # Parent menu items declared here
    echo "--------------------------------------------------------"
    echo "  Welcome to EventsWatcher Runner"
    echo "--------------------------------------------------------"
    echo "INFO: Please select the network you would like to run"
    select network in BSC_Testnet BSC_Mainnet
    do
        case $network in
            BSC_Testnet)    
                showAvailableCfgs $network $service
                break
            ;;
        esac
    done
done
