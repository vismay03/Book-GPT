// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { OpenAIApi } from 'openai';
import { configuration } from '../../utils/constants';
type Data = {
  name: string
}

const openai = new OpenAIApi(configuration);


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  const { input } = req.body;

 const response = await openai.createCompletion(
    {
      model: "text-davinci-003",
     prompt: `If someone asks you about the best books on a particular topic. The Topic would be '${input}.' \n\nThese are the Books that I recommend: \n`,
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    }

  )

  const suggestion = response.data.choices[0]?.text;

  if (suggestion === undefined) {
    throw new Error('No suggestion found');
  }

  res.status(200).json({ result: suggestion })
}
