# Generic packages required
from dotenv import load_dotenv
import os

#LLM providers
from openai import OpenAI

# Get key(s)
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Run a query to OpenAI
client = OpenAI()
response = client.responses.create(
    model = "gpt-3.5-turbo",
    input = "Kun je iets vertellen over de Stadspas van Gemeente Amsterdam?"
)

print(response.output_text)