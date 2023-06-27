import Cookies from 'universal-cookie'
import { GPTModel } from '../openai'

export enum Keys {
  OPENAI_API_KEY = 'OPENAI_API_KEY',
  OPENAI_ORG_ID = 'OPENAI_ORG_ID',
  GPT_MODEL = 'GPT_MODEL',
}

// Initialize cookies
const cookies = new Cookies()
if (!cookies.get(Keys.OPENAI_API_KEY)) {
  cookies.set(Keys.OPENAI_API_KEY, '', { path: '/' })
}
if (!cookies.get(Keys.OPENAI_ORG_ID)) {
  cookies.set(Keys.OPENAI_ORG_ID, '', { path: '/' })
}
if (!cookies.get(Keys.GPT_MODEL)) {
  cookies.set(Keys.GPT_MODEL, GPTModel.GPT4, { path: '/' })
}

export const getKey = (keyName: Keys) => {
  return cookies.get(keyName)
}