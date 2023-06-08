import { useCookies } from 'react-cookie'
import Cookies from 'universal-cookie'

export enum Keys {
  OPENAI_API_KEY = 'OPENAI_API_KEY',
  OPENAI_ORG_ID = 'OPENAI_ORG_ID'
}

// Initialize cookies
const cookies = new Cookies()
if (!cookies.get(Keys.OPENAI_API_KEY)) {
  cookies.set(Keys.OPENAI_API_KEY, '', { path: '/' })
}
if (!cookies.get(Keys.OPENAI_ORG_ID)) {
  cookies.set(Keys.OPENAI_ORG_ID, '', { path: '/' })
}

export const useKeys = () => {
  const [cookies, setCookie, removeCookie] = useCookies([Keys.OPENAI_API_KEY, Keys.OPENAI_ORG_ID])

  const _apiKey = cookies[Keys.OPENAI_API_KEY]
  const _orgID = cookies[Keys.OPENAI_ORG_ID]
  
  const apiKeyIsOk = (_apiKey && _apiKey.length > 0)
  const orgIdIsOk = (_orgID && _orgID.length > 0)
  const keysAreOk = (apiKeyIsOk && orgIdIsOk)

  return {
    apiKeyIsOk,
    orgIdIsOk,
    keysAreOk,
  }
}
