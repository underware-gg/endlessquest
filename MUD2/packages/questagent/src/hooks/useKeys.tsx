import { useCookies } from 'react-cookie'
import { Keys } from '../openai'

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
