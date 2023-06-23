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
