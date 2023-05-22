import { Configuration, OpenAIApi } from 'openai'
import Cookies from 'universal-cookie';

const cookies = new Cookies();

let _openai: OpenAIApi

function _create(apiKey: string) {
  const configuration = new Configuration({ apiKey })
  _openai = new OpenAIApi(configuration)
}

let _apiKey = cookies.get('OPENAI_API_KEY')
if (!_apiKey?.length) {
  cookies.set('OPENAI_API_KEY', '', { path: '/' });
  _apiKey = import.meta.env.OPENAI_API_KEY
}

if (_apiKey?.length > 0) {
  _create(_apiKey)
}

export interface GenerateResult {
  result?: string,
  error?: string,
  status?: string,
}
export default async function generate({
  animal = '',
  apiKey = null,
}): Promise<GenerateResult> {

  // use user key
  if (apiKey && !_openai) {
    _create(apiKey)
  }

  // cerate client
  if (!_openai) {
    return {
      error: 'Please provide an OpenAI API key from https://platform.openai.com/account/api-keys in the OPENAI_API_KEY cookie',
    }
  }

  if (animal.trim().length === 0) {
    return {
      error: 'Please enter a valid animal',
    }
  }

  try {
    const completion = await _openai.createCompletion({
      model: 'text-davinci-003',
      prompt: generatePrompt(animal),
      temperature: 0.6,
    })
    return {
      result: completion.data.choices[0].text
    }
  } catch (error: any) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data)
      return {
        error: error.response.data,
        status: error.response.status,
      }
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`)
      return {
        error: 'An error occurred during your request',
      }
    }
  }
}

function generatePrompt(animal: string) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase()
  return `Suggest three names for an animal that is a superhero.

Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: ${capitalizedAnimal}
Names:`
}