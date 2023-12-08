// --------------------------------------------------------------- //
// load modules
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const axios = require('axios');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const package = require('./package.json'); // Import package.json for version information
// --------------------------------------------------------------- //


// --------------------------------------------------------------- //
// Helper functions

// TODO: implement parsing of GET, POST, PUT, DELETE
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

// TODO: Implement using this function for endpointDetails
/**
 * Parses a standard URL parameter string into an object.
 * @param {string} paramString - The parameter string from the command line in URL query format.
 * @returns {object} - Parsed parameters as an object.
 */
const parseParametersString = (paramString) => {
    const paramsObj = {};
    paramString.split('&').forEach(pair => {
        const [key, value] = pair.split('=');
        paramsObj[key] = value;
    });
    return paramsObj;
};

// TODO: Implement endpointDetails for GET, POST, PUT, DELETE
/**
 * Executes an API request based on the provided configuration and parameters.
 * @param {object} config - The API configuration object.
 * @param {object} endpointDetails - Details of the specific API endpoint.
 * @param {string} userParams - The user-provided parameters as a string.
 */
const executeApiRequest = async (config, endpointDetails, userParams) => {
    // Construct query parameters
    const queryParams = new URLSearchParams(userParams).toString();

    // Construct URL
    const url = `${config.schemes[0]}://${config.host}${config.basePath}${config.endpoint}?${queryParams}`;

    // Display URL if in verbose mode
    if (argv.verbose) {
        console.log(`Constructed URL: ${url}`);
    }

    // Execute API request
    try {
        const response = await axios.get(url);
        console.log(response.data);
    } catch (error) {
        console.error('API Request failed:', error.message);
    }

};
// --------------------------------------------------------------- //


// --------------------------------------------------------------- //
// Set up yargs for command line argument parsing
const argv = yargs(hideBin(process.argv))
    .option('config', {
        alias: 'c',
        describe: 'Path to the API configuration file',
        type: 'string',
        demandOption: true,
    })
    .option('execute', {
        alias: 'e',
        describe: 'Execute API request',
        type: 'boolean',
        default: false,
    })
    .option('parameters', {
        alias: 'p',
        describe: 'String of API request parameters',
        type: 'string',
    })
    .option('verbose', {
        describe: 'Run in verbose mode',
        type: 'boolean',
        default: false,
    })
    .version(package.version) // Use version from package.json
    .alias('v', 'version')
    .help('h')
    .alias('h', 'help')
    .argv;
// --------------------------------------------------------------- //


// --------------------------------------------------------------- //
// Parse the configuration file
// TODO: implement using this variable
const config = parseConfigFile(argv.config);
// --------------------------------------------------------------- //


// --------------------------------------------------------------- //
// Main script logic
/**
 * Main function to execute the script logic based on command line arguments.
 */
const main = () => {
    console.log('Parsing configuration file...');
    const config = parseConfigFile(argv.config);

    if (argv._.length === 0 && !argv.execute) {
        console.log('Displaying API information...');
        console.log(`API Host: ${config.host}`);
        console.log(`Base Path: ${config.basePath}`);
        console.log(`Schemes: ${config.schemes.join(', ')}`);
        console.log(`Available Endpoint and Parameters:`);

        // Display details of the specific endpoint
        const endpointDetails = config.get;
        if (endpointDetails) {
            console.log(`Endpoint: ${config.endpoint}`);
            endpointDetails.parameters.forEach(param => {
                const requiredText = param.required ? '[required]' : '[optional]';
                const typeText = param.type ? `[${param.type}]` : '';
                console.log(`  ${param.name} ${typeText} ${requiredText}`);
                console.log(`    Description: ${param.description}`);
            });
        }
    } else {
        const userParams = argv.parameters ? parseParametersString(argv.parameters) : {};
        executeApiRequest(config, config.get, userParams);
    }
};

main();
// --------------------------------------------------------------- //
