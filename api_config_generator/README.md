# API Config Generator

## Description
`apiConfigGenerator.js` is a Node.js script designed to automatically generate endpoint configuration files from an OpenAPI schema. It fetches the schema from a specified URL, processes each endpoint, and generates individual JSON configuration files for each. This tool is particularly useful for developers working with RESTful APIs who need to generate client-side configurations dynamically.

## Features
- Fetches OpenAPI schemas from specified URLs.
- Generates JSON configuration files for each API endpoint.
- Supports command line arguments for custom configurations.
- Provides verbose logging for detailed operation feedback.

## Installation
Before running the script, ensure that you have Node.js installed on your system. You can download Node.js from [here](https://nodejs.org/).

To set up the script, clone the repository or download the script file, then navigate to the script's directory and run:
```bash
npm install
```
This command installs all the necessary dependencies.

## Usage
Run the script with the following command:

```bash
node apiConfigGenerator.js -u <OpenAPI_Schema_URL> -o <Output_Directory>
```

### Command Line Arguments
- `-u`, `--url` (required): The URL of the OpenAPI schema.
- `-o`, `--output` (optional): The directory where the endpoint configuration files will be generated. Defaults to endpoints if not specified.
- `--verbose` (optional): Enables verbose logging for detailed operation feedback.

## Example
To generate configurations from an OpenAPI schema at https://example.com/api/schema and save them in a directory named apiConfigs, run:
```bash
node apiConfigGenerator.js -u https://example.com/api/schema -o apiConfigs --verbose
```

## Output
The script generates a JSON file for each endpoint defined in the OpenAPI schema. These files are named after the endpoints (with slashes replaced by underscores) and are saved in the specified output directory.

## Error Handling
The script includes basic error handling:

- Validates the provided URL.
- Checks URL accessibility.
- Catches and logs errors during file operations and API fetching.