import _url from 'url'
import queryString from 'query-string'
import { GET_LIST, GET_ONE, GET_MANY, UPDATE, CREATE, DELETE } from 'admin-on-rest'

import restClient, { convertRESTRequestToHTTP, convertHTTPResponseToREST } from './restClient'
import { API_ROUTES } from '../constants'

// --------------------------
const parseUrl = (url) => _url.parse(url)
const parseQuery = (query) => {
  const parsedQuery = queryString.parse(query)
  Object.entries(parsedQuery).forEach(([key, value]) => {
    parsedQuery[key] = JSON.parse(value)
  })
  return parsedQuery
}

const resource = 'user'
const MOCK_USER_EMAIL = 'user@example.com'
const MOCK_USER_NAME = 'Example User'
const MOCK_USER_TOKEN = '000000000000000000000000'

const expectedPath = `${API_ROUTES.rest.superadmin}/${resource}`

const getRestToHttpData = (type, params) => {
  const { url: urlString, options } = convertRESTRequestToHTTP(type, resource, params)
  const url = parseUrl(urlString)
  const query = parseQuery(url.query)
  const { headers, method, body: bodyJson } = options

  const body = bodyJson ? JSON.parse(bodyJson) : undefined

  return { url, query, headers, method, body }
}

describe('convertRESTRequestToHTTP', () => {
  let url, query, headers, method, body

  beforeAll(() => {
    localStorage.setItem('token', MOCK_USER_TOKEN)
  })

  describe('when action type is `GET_LIST`', () => {
    const params = { pagination: { page: 1, perPage: 10 }, sort: { field: 'id', order: 'ASC' }, filter: {} }

    beforeAll(() => {
      ({ url, query, headers, method } = getRestToHttpData(GET_LIST, params))
    })

    it('sets the correct path name', () => {
      expect(url.pathname).toEqual(expectedPath)
    })

    it('correctly sets the `authorization` header from localStorage', () => {
      const token = headers.get('authorization').split(' ')[1]
      expect(token).toEqual(MOCK_USER_TOKEN)
    })

    it('correctly passes parameters to query', () => {
      expect(Object.keys(query).length).toEqual(4)
      expect(query).toHaveProperty('filter', params.filter)
      expect(query).toHaveProperty('page', params.pagination.page)
      expect(query).toHaveProperty('perPage', params.pagination.perPage)
      expect(query).toHaveProperty('sort', [params.sort.field, params.sort.order])
    })

    it('sets the `method` to `GET`', () => {
      expect(method).toEqual('GET')
    })

    it('has no body', () => {
      expect(body).toBeUndefined()
    })
  })

  describe('when action type is `GET_ONE`', () => {
    const params = { id: 1 }

    beforeAll(() => {
      ({ url, query, headers, method } = getRestToHttpData(GET_ONE, params))
    })

    it('sets the correct path name, including the resource ID', () => {
      expect(url.pathname).toEqual(`${expectedPath}/${params.id}`)
    })

    it('correctly sets the `authorization` header from localStorage', () => {
      const token = headers.get('authorization').split(' ')[1]
      expect(token).toEqual(MOCK_USER_TOKEN)
    })

    it('creates no query parameters', () => {
      expect(Object.keys(query).length).toEqual(0)
    })

    it('sets the `method` to `GET`', () => {
      expect(method).toEqual('GET')
    })

    it('has no body', () => {
      expect(body).toBeUndefined()
    })
  })

  describe('when action type is `GET_MANY`', () => {
    const params = { ids: [1, 5, 22] }

    beforeAll(() => {
      ({ url, query, headers, method } = getRestToHttpData(GET_MANY, params))
    })

    it('sets the correct path name', () => {
      expect(url.pathname).toEqual(`${expectedPath}/many`)
    })

    it('correctly sets the `authorization` header from localStorage', () => {
      const token = headers.get('authorization').split(' ')[1]
      expect(token).toEqual(MOCK_USER_TOKEN)
    })

    it('builds a query with `ids` as the only parameter', () => {
      expect(Object.keys(query).length).toEqual(1)
      expect(query).toHaveProperty('ids', params.ids)
    })

    it('sets the `method` to `GET`', () => {
      expect(method).toEqual('GET')
    })

    it('has no body', () => {
      expect(body).toBeUndefined()
    })
  })

  describe('when action type is `UPDATE`', () => {
    const params = { id: 3, data: { email: MOCK_USER_EMAIL, name: MOCK_USER_NAME } }

    beforeAll(() => {
      ({ url, query, headers, method, body } = getRestToHttpData(UPDATE, params))
    })

    it('sets the correct path name, including the resource ID', () => {
      expect(url.pathname).toEqual(`${expectedPath}/${params.id}`)
    })

    it('correctly sets the `authorization` header from localStorage', () => {
      const token = headers.get('authorization').split(' ')[1]
      expect(token).toEqual(MOCK_USER_TOKEN)
    })

    it('creates no query parameters', () => {
      expect(Object.keys(query).length).toEqual(0)
    })

    it('sets the `method` to `PUT`', () => {
      expect(method).toEqual('PUT')
    })

    it('correctly sets data in body', () => {
      expect(Object.keys(body).length).toEqual(2)
      expect(body).toHaveProperty('email', MOCK_USER_EMAIL)
      expect(body).toHaveProperty('name', MOCK_USER_NAME)
    })
  })

  describe('when action type is `CREATE`', () => {
    const params = { data: { email: MOCK_USER_EMAIL, name: MOCK_USER_NAME } }

    beforeAll(() => {
      ({ url, query, headers, method, body } = getRestToHttpData(CREATE, params))
    })

    it('sets the correct path name', () => {
      expect(url.pathname).toEqual(expectedPath)
    })

    it('correctly sets the `authorization` header from localStorage', () => {
      const token = headers.get('authorization').split(' ')[1]
      expect(token).toEqual(MOCK_USER_TOKEN)
    })

    it('creates no query parameters', () => {
      expect(Object.keys(query).length).toEqual(0)
    })

    it('sets the `method` to `POST`', () => {
      expect(method).toEqual('POST')
    })

    it('correctly sets data in body', () => {
      expect(Object.keys(body).length).toEqual(2)
      expect(body).toHaveProperty('email', MOCK_USER_EMAIL)
      expect(body).toHaveProperty('name', MOCK_USER_NAME)
    })
  })

  describe('when action type is `DELETE`', () => {
    const params = { id: 19 }

    beforeAll(() => {
      ({ url, query, headers, method, body } = getRestToHttpData(DELETE, params))
    })

    it('sets the correct path name, including the resource ID', () => {
      expect(url.pathname).toEqual(`${expectedPath}/${params.id}`)
    })

    it('correctly sets the `authorization` header from localStorage', () => {
      const token = headers.get('authorization').split(' ')[1]
      expect(token).toEqual(MOCK_USER_TOKEN)
    })

    it('creates no query parameters', () => {
      expect(Object.keys(query).length).toEqual(0)
    })

    it('sets the `method` to `DELETE`', () => {
      expect(method).toEqual('DELETE')
    })

    it('has no body', () => {
      expect(body).toBeUndefined()
    })
  })

  describe('when action type is invalid', () => {
    const type = 'MY_CUSTOM_ACTION'

    it('throws an error', () => {
      expect(() => convertRESTRequestToHTTP(type, resource, {})).toThrow(`Unsupported fetch action type: ${type}`)
    })
  })
})

describe('convertHTTPResponseToREST', () => {
})

describe('restClient', async () => {
})
