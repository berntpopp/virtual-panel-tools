const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const axios = require('axios');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const package = require('./package.json'); // Import package.json for version information

/**
 * Parses the API configuration file and returns the configuration object.
 * @param {string} configFile - Path to the configuration file.
 * @returns {object} - Parsed configuration object.
 */
const parseConfigFile = (configFile) => {
    const fileContent = fs.readFileSync(configFile, 'utf8');
    if (path.extname(configFile) === '.yaml' || path.extname(configFile) === '.yml') {
        return yaml.load(fileContent);
    } else {
        return JSON.parse(fileContent);
    }
};

// Set up yargs for command line argument parsing
const argv = yargs(hideBin(process.argv))
    .usage(`Usage: $0 --config <configFile> [options]`)
    .option('config', {
        alias: 'c',
        describe: 'Path to the API configuration file',
        type: 'string',
        demandOption: true,
    })
    .option('host', {
        alias: 'h',
        describe: 'API host',
        type: 'string'
    })
    .option('execute', {
        alias: 'e',
        describe: 'Execute API request',
        type: 'boolean',
        default: false,
    })
    .version(package.version) // Use version from package.json
    .alias('v', 'version')
    .help('h')
    .alias('h', 'help')
    .argv;

// Main script logic
const main = () => {
    const config = parseConfigFile(argv.config);

    if (argv._.length === 0) {
        console.log(`API Host: ${config.host}`);
        console.log(`Base Path: ${config.basePath}`);
        console.log(`Schemes: ${config.schemes.join(', ')}`);
        console.log(`Available Endpoint and Parameters:`);

        // Display details of the specific endpoint
        const endpointDetails = config.get;
        if (endpointDetails) {
            console.log(`Endpoint: ${config.endpoint}`);
            if (endpointDetails.parameters) {
                endpointDetails.parameters.forEach(param => {
                    console.log(`  Parameter: ${param.name}`);
                    console.log(`    Description: ${param.description}`);
                    console.log(`    Required: ${param.required}`);
                    console.log(`    Type: ${param.type}`);
                });
            }
        }
    } else {
        // Handle API request execution based on provided arguments
    }
};


main();
