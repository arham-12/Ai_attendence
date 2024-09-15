from langchain.chains.llm import LLMChain
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate

api_key = "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"


 # Initialize the chat model with specific parameters
llm = ChatGroq(temperature=0.5, model="llama-3.1-70b-versatile", api_key=api_key)

# Define prompt template for class scheduling
scheduling_prompt = ChatPromptTemplate.from_template(
    """
You are an intelligent scheduling assistant. Your task is to create an optimal class schedule 
for a university considering the following constraints:

1. Teacher availability: {teacher_availability}
2. Room capacity: {room_capacity}
3. Student availability: {student_availability}
4. School calendar: {school_calendar}

Generate an optimal schedule that meets all constraints and avoids conflicts.
give me the schedule in json format
"""
)

# LLM Chain to handle scheduling prompts
llm_chain = LLMChain(
    llm=llm,
    prompt=scheduling_prompt
)

# Define teacher, room, and student data
teacher_availability = """{
    "Dr. Smith": ["Monday 9-11am", "Wednesday 2-4pm"],
    "Prof. John": ["Tuesday 10-12pm", "Thursday 1-3pm"],
}"""

room_capacity = """{
    "Room 101": 30,
    "Room 102": 40,
}"""

student_availability = """{
    "Batch A": ["Monday 9-11am", "Tuesday 10-12pm"],
    "Batch B": ["Wednesday 2-4pm", "Thursday 1-3pm"],
}"""

school_calendar = """["2024-09-01", "2024-12-20"]"""


# Run scheduling agent
response = llm_chain.run({
    "teacher_availability": teacher_availability,
    "room_capacity": room_capacity,
    "student_availability": student_availability,
    "school_calendar": school_calendar
})

print(response)
