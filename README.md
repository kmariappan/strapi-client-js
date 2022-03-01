# strapi-client-js

Javascript client for Strapi Rest API.

## Installation

```bash
npm i @kmariappan/strapi-client-js

npm i axios qs

 or

yarn add @kmariappan/strapi-client-js

yarn add axios qs

```

## Peer Dependencies

This package uses [axios](https://axios-http.com/) as a http client and [qs](https://github.com/ljharb/qs) for parsing and stringifying the Query.

### Example

```js
import { createClient } from "@kmariappan/strapi-client-js"

const URL = "http://localhost:1337/api"

const strapiClient = createClient({ url: URL })

const run = async () => {
  const { data, error, meta } = await strapiClient
    .from("students")
    .select()
    .paginate(1, 10)
    .get()

  if (error) {
    console.log(error)
  } else {
    console.log(data)
    console.log(meta)
  }
}

run()
```
