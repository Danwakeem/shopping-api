# Shopping API Serverless

Trying to convert my estimate API to a serverless API.

## Build
Nothing is needed except `npm i`

## Test
Run `npm test`
or `npm test:watch`

## Config
There is a config file for `env` params in my dropbox :)

## API definition
There is an API definition file in my dropbox :)

## Deploy
These have all been updated to node.js 12 in IBM but not locally :)

To login to IBM CLI

```
ibmcloud login
```

To login to org/space

```
ibmcloud target ibmcloud target -o danwakeem@gmail.com -s Shopping
```

To deploy update API

```
ibmcloud fn action update "shopping/updateById" build/PUT/id.zip --kind nodejs:12 -t 300000
```


## TODO
* [x] Convert Loopback Mongo Query generator to function
* [x] GET: by userId
* [x] GET: by ID
* [x] DELETE: by Id 
* [x] PUT: Update by ID
* [x] PUT: Update by ID (shared)
* [x] POST: Create list
