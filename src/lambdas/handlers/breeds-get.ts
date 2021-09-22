import fetch from 'node-fetch'
import { Response } from './interfaces/types'

interface BreedsResponse extends Response {
  body: DogBreeds
}

interface ErrorResponse extends Response {
  message: string
}

interface DogBreeds {
  data: string[]
  status: string
}

export async function handler(): Promise<BreedsResponse | ErrorResponse> {
  try {
    const res = await fetch('https://dog.ceo/api/breeds/list/all')
    const payload = await res.json()
    const dogs = payload.message
    const names: string[] = []
    const rtn = { data: names, status: '200' }

    Object.keys(dogs).forEach(function filter(breed) {
      const breedList = dogs[breed] as string[]
      if (breedList.length > 0) {
        breedList.forEach((subBreed) => rtn.data.push(`${subBreed} ${breed}`))
      } else {
        rtn.data.push(breed)
      }
    })

    return {
      statusCode: 200,
      body: rtn,
    }
  } catch (err: unknown) {
    return {
      statusCode: 500,
      message: 'Something went wrong', // does this need to be more descriptive?
    }
  }
}
