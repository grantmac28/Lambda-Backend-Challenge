import fetch from 'node-fetch'
// import sampleResponse from './data/breedsHandlerSampleRsp.json' Note: need to set '--resolveJsonModule' in lint to true to reference test data file
import { handler } from '../handlers/breeds-get'
// import sampleAPIResponse from './data/breedAPISampleRsp.json' Note: need to set '--resolveJsonModule' in lint to true to reference test data file

const mockedFetch: jest.Mock = fetch as any

jest.mock('node-fetch')

describe('breeds-get handler', () => {
  it('Test Happy Path', async () => {
    const mockPayload = {
      message: {
        affenpinscher: [],
        african: [],
        airedale: [],
        akita: [],
        appenzeller: [],
        australian: ['shepherd'],
        basenji: [],
        beagle: [],
        bluetick: [],
        borzoi: [],
        bouvier: [],
        boxer: [],
        brabancon: [],
        briard: [],
        buhund: ['norwegian'],
        bulldog: ['boston', 'english', 'french'],
        bullterrier: ['staffordshire'],
        cattledog: ['australian'],
      },
      status: 'success',
    }
    mockedFetch.mockReturnValueOnce({
      json: () => {
        return mockPayload
      },
    })
    const response = await handler()
    const testRsp = {
      data: [
        'affenpinscher',
        'african',
        'airedale',
        'akita',
        'appenzeller',
        'shepherd australian',
        'basenji',
        'beagle',
        'bluetick',
        'borzoi',
        'bouvier',
        'boxer',
        'brabancon',
        'briard',
        'norwegian buhund',
        'boston bulldog',
        'english bulldog',
        'french bulldog',
        'staffordshire bullterrier',
        'australian cattledog',
      ],
      status: '200',
    }
    expect(response).toMatchObject({ body: testRsp })
  })

  it('Test API timeout', async () => {
    mockedFetch.mockReturnValueOnce(
      () =>
        new Promise((resolve) => setTimeout(() => resolve({ body: 'Fetch API Timed Out' }), 500)),
    )
    const response = await handler()
    expect(response).toEqual({ message: 'Something went wrong', statusCode: 500 })
  })
})
