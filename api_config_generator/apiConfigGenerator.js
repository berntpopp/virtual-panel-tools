/**
 * apiConfigGenerator.js
 * A simple JS script to generate endpoint config files from an OpenAPI schema.
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const yaml = require('js-yaml');
const package = require('./package.json');

/**
 * Parses command line arguments and sets up the script configuration.
 */
const argv = yargs(hideBin(process.argv))
  .usage(`Usage: $0 -u [url] -o [dir] -f [format]`)
  .option('u', {
    alias: 'url',
    describe: 'OpenAPI schema URL',
    type: 'string',
    demandOption: 'URL is required',
  })
  .option('o', {
    alias: 'output',
    describe: 'Output directory for endpoint configs',
    type: 'string',
    default: 'endpoints',
  })
  .option('f', {
    alias: 'format',
    describe: 'Output format (json or yaml)',
    type: 'string',
    default: 'json',
    choices: ['json', 'yaml']
  })
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    describe: 'Run with verbose logging',
  })
  .version(package.version)
  .help('h')
  .alias('h', 'help')
  .argv;

/**
 * Validates the given URL.
 * @param {string} urlString - The URL string to validate.
 * @returns {boolean} - Returns true if the URL is valid, false otherwise.
 */
const isValidUrl = urlString => {
  try {
    new URL(urlString);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * The main function that creates configuration files for each API endpoint.
 * Fetches the OpenAPI schema, processes each endpoint, and generates files in the specified format.
 * It now includes essential API information such as host, schemes, basePath, securityDefinitions, 
 * and security at the top of each configuration file for completeness and usability.
 *
 * @async
 * @returns {Promise<void>} An empty promise indicating the completion of the operation.
 */
const createConfigFiles = async () => {
  if (!isValidUrl(argv.url)) {
      console.error('Invalid URL provided.');
      return;
  }

  try {
      if (argv.verbose) console.log('Fetching the OpenAPI schema...');
      const schemaResponse = await axios.get(argv.url);
      const { paths, host, schemes, basePath, securityDefinitions, security } = schemaResponse.data;

      const OUTPUT_DIR = path.join(__dirname, argv.output);
      if (!fs.existsSync(OUTPUT_DIR)){
          fs.mkdirSync(OUTPUT_DIR);
      }

      if (argv.verbose) console.log('Processing endpoints...');
      Object.keys(paths).forEach(endpoint => {
          try {
              const apiInfo = {
                  ...(host && { host }), 
                  ...(schemes && { schemes }), 
                  ...(basePath && { basePath }), 
                  ...(securityDefinitions && { securityDefinitions }), 
                  ...(security && { security })
              };

              const config = { 
                  ...apiInfo,
                  endpoint, 
                  ...paths[endpoint]
              };

              const fileExtension = argv.format === 'yaml' ? 'yaml' : 'json';
              const fileName = endpoint.replace(/\//g, '_').substring(1) + `.${fileExtension}`;
              const filePath = path.join(OUTPUT_DIR, fileName);

              const fileContent = argv.format === 'yaml' 
                  ? yaml.dump(config) 
                  : JSON.stringify(config, null, 2);

              fs.writeFileSync(filePath, fileContent);
              if (argv.verbose) console.log(`Generated ${fileExtension} config for: ${endpoint}`);
          } catch (fileError) {
              console.error(`Error writing file for endpoint ${endpoint}:`, fileError);
          }
      });

      console.log(`${package.name} v${package.version}: All configurations have been generated.`);
  } catch (error) {
      console.error('Error fetching or processing the OpenAPI schema:', error);
  }
};

createConfigFiles();
