const PROMPT_KNOWLEDGE_BASED = `Sure, here’s the consolidated information from the Reddit thread on conducting a code review, formatted as a comprehensive guide:

---

### How to Conduct a Code Review: A Comprehensive Guide

#### Overview
A code review evaluates the correctness, design, understandability, style, conformance to codebase, testing, and more. The process involves using tools that show code differences and allow for comments.

#### Key Steps and Considerations

1. **Initial Approach**
   - Think of the review as a conversation. Aim to improve the code by asking clarifying questions and suggesting improvements.
   - Ensure readability and maintainability by following the principle of least surprise. 

2. **Review Stages**
   - **Correctness and Intent**: Ensure the code does what it is supposed to do. If something seems intentionally done but unclear, ask for clarification or suggest adding comments.
   - **Legibility**: Focus on making the code easy to understand, avoiding nitpicky style comments that can be caught by a linter.
   - **Documentation**: Check if the code changes are well-documented. If a change is complex, ensure there's adequate documentation.

3. **Engineering Practices**
   - Follow good engineering practices such as DRY (Don’t Repeat Yourself), SOLID principles, and ensure low coupling and high cohesion.
   - Review error and exception handling to ensure the code can handle failures gracefully.

4. **Observability and Dependencies**
   - Check for adequate logging and metrics to support the code in production.
   - Evaluate dependencies to ensure they are necessary, manageable, and secure.

5. **Security and Privacy**
   - Adhere to secure coding practices and ensure no sensitive data is exposed.
   - Check for compliance with security standards like the OWASP top 10.

6. **Testing and Deployment**
   - Verify that the code is thoroughly tested with unit tests and integration tests.
   - Ensure the code is easy to deploy and follows the company's deployment standards.

7. **Code Quality**
   - **Readability**: The code should be clear and easy to follow, with good naming conventions.
   - **Reusability**: Look for opportunities to simplify or reuse code to avoid redundancy.
   - **Design**: Ensure the code is designed for extensibility and future maintenance.
   - **Test Quality**: Verify that tests are well-designed and cover the necessary functionality.

8. **Human Review and Tools**
   - Use static analysis tools to handle many review tasks automatically, such as linting and checking for test coverage.
   - Focus human review on aspects that tools cannot cover, like logic, design, and readability.

9. **Communication and Feedback**
   - Frame feedback as questions to foster understanding and collaboration.
   - Avoid using "you" in comments; focus on the code to keep the review impersonal and constructive.
   - Be concise, informed, and follow established project rules before offering personal opinions.

10. **General Tips**
    - Don’t be afraid to ask questions if something is unclear.
    - Engage in a discussion with the author to reach the best implementation.
    - Approve changes that are understandable, maintainable, and functionally correct.

#### Additional Resources
- [Google's Engineering Practices: Code Review](https://google.github.io/eng-practices/review/reviewer/)

By following these guidelines, you can conduct thorough and constructive code reviews that enhance code quality and team collaboration.
`

export default PROMPT_KNOWLEDGE_BASED;