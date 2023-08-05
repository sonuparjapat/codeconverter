const express = require('express');
const axios = require('axios');
const cors=require('cors')
require("dotenv").config()
const app = express();

const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json());

// Define API endpoint for code conversion
app.get("/",async(req,res)=>{
  res.json({msg:"welcome"})
})
app.post('/api/convert', async (req, res) => {
  const { code, language } = req.body;

  try {

    const apiKey = process.env.OPENAI_API_KEY; // Replace with your actual OpenAI API key
    // console.log(apiKey)
    // console.log(code,language)
    const prompt = `Translate the following code in ${language} :\n${code}\n\n`;
    const response = await axios.post(
      'https://api.openai.com/v1/engines/text-davinci-003/completions',
      {
        prompt,
        max_tokens: 200,
        n: 1,
        stop: '\n',
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    // Process the response and extract the converted code from the GPT API output
    const convertedCode =await response.data.choices[0].text;
// console.log(response.data.choices[0])
    res.json({ convertedCode });
  } catch (error) {
    console.error('Error converting code:', error.message);
    res.status(500).json({ error: 'Code conversion failed' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
