import { Configuration, OpenAIApi} from 'openai'
export const  configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});