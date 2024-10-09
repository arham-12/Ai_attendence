
from langchain.embeddings import HuggingFaceInferenceAPIEmbeddings
from langchain.vectorstores import FAISS
from langchain.schema import Document
from langchain.docstore import InMemoryDocstore
from uuid import uuid4
from typing import List
import faiss
import numpy as np
import os 
from  langchain_groq import ChatGroq
import pandas as pd
from langchain_core.prompts import ChatPromptTemplate
import dotenv
from langchain_core.output_parsers import JsonOutputParser
dotenv.load_dotenv()


api_key = os.getenv("GROQ_API_KEY")

# Function to generate embeddings using HuggingFace API
def generate_embedding(documents: List[str]) -> List[np.ndarray]:
    embeddings = HuggingFaceInferenceAPIEmbeddings(
        api_key="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",
        model_name="sentence-transformers/all-MiniLM-l6-v2"
    )
    embedded_docs = embeddings.embed_documents(documents)
    # print(f"Generated embeddings: {embedded_docs}")  # Check the embeddings here
    return embedded_docs

# Function to save the FAISS index to a file
def save_index(index, file_path: str):
    index.save_local(file_path)
    print(f"FAISS index saved to {file_path}")

# Function to create a vector store and save UIDs
def create_vector_store_and_save_uids(data: List[Document], vectorstore_dir: str) -> str:
    texts = [entry.page_content for entry in data]
    print(texts)
    
    embeddings = generate_embedding(texts)
    dimension = 384
    index = faiss.IndexFlatL2(dimension)
    uids = [str(uuid4()) for _ in range(len(data))]
    index.add(np.array(embeddings))

    documents = [Document(page_content=text) for text in texts]

    vector_store = FAISS(
        embedding_function=generate_embedding,
        index=index,
        docstore=InMemoryDocstore(),
        index_to_docstore_id={i: uids[i] for i in range(len(documents))}
    )

    vector_store.add_documents(documents=documents, ids=uids)
    # Save the FAISS index
    base_name = "schedule"
    index_file_path = os.path.join(vectorstore_dir, f"{base_name}")
    i = 1
    while os.path.exists(index_file_path):
        index_file_path = os.path.join(vectorstore_dir, f"{base_name}_{i}")
        i += 1
    save_index(vector_store, index_file_path)

    
    return index_file_path


# Function to load the FAISS index
def load_index(file_path: str) -> FAISS:
    index = FAISS.load_local(file_path , embeddings= generate_embedding,allow_dangerous_deserialization=True)
    print(f"Loaded FAISS index from {file_path}")
    return index


def embed_querry(query):
    embeddings = HuggingFaceInferenceAPIEmbeddings(
        api_key="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",
        model_name="sentence-transformers/all-MiniLM-l6-v2"
    )
    emb = embeddings.embed_query(query)
    return emb


def prepare_input_for_model(context):
    """
    Prepares a prompt for generating a quiz based on the given topic, context, and number of questions.

    Args:
        topic (str): The topic for which the quiz is to be created.
        context (str): The contextual information to base the quiz questions on.
        num_questions (int): The number of questions to generate for the quiz.

    Returns:
        str: The formatted prompt ready to be used with the model to generate the quiz.
    """
    # Define the prompt template for quiz generation
    prompt_template_for_quiz = ChatPromptTemplate.from_messages(
        [
            ("system", """your task is to convert the content o f the class schedule into a well structured json format"""),
            ("human", """convert this content into a well structured json format: 
             the content is {context}
             dont include any other text only json"""),
        ]
    )

    # Print the prompt template for debugging purposes
    print("Prompt Template:", prompt_template_for_quiz)

    # Format the prompt with the provided topic, context, and number of questions
    prompt_for_quiz = prompt_template_for_quiz.format(
        context=context,
      
    )

    # Print the formatted prompt for debugging purposes
    print("Formatted Prompt:", prompt_for_quiz)
    
    return prompt_for_quiz



def generate_response(prompt): 
    """
    Generates a quiz based on the provided prompt using a language model.

    Args:
        prompt (str): The formatted prompt that specifies the quiz requirements.

    Returns:
        response: The generated quiz in response to the prompt.
    """
    # Initialize the language model with specific parameters
    llm = ChatGroq(
        temperature=0.5,  # Set the temperature for response variability
        model="llama-3.1-70b-versatile",  # Specify the model to use for generation
        api_key=api_key  # API key for authentication
    )
    chain = llm | JsonOutputParser()
    # Generate the quiz content based on the provided prompt
    response = chain.invoke(prompt)
    
    return response
