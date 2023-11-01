# GLEAP -> DevStride
A simple way to creat DevStride tickets from Gleap tickets

## How to use
Follow the instructions in https://api-docs.devstride.com/#section/Quick-start to get your API key and API secret.

Create a .env file from the .env.sample file and fill in the values.

Install the dependencies
```
pnpm install
```

Run the script
```
pnpm ds create
```

This will give you a webhook url you can use in the gleap webhook integration to send the tickets to DevStride.
