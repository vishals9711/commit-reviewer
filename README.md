# Commit Reviewer

Commit Reviewer is a CLI tool designed to assist with reviewing code changes. It provides a convenient way to review staged changes, generate a folder structure from Git, and read the README file of your project.

## Features

- Review staged changes
- Generate a folder structure from Git
- Read the README file of your project

## Installation

To install Commit Reviewer, you need to have Node.js and npm installed on your machine. Then, you can install the tool globally with:

```cmd
pnpm install -g reviewer-code
```

## Usage

You can start using Commit Reviewer by running the following command in your terminal:

```cmd
review-code -b <against-branch>
```

This will start the tool and it will begin reviewing your staged changes against the specified branch.

## Development

To build the project, run the following command:

```cmd
pnpm run build
```

To start the project in development mode, run:

```cmd
pnpm run start
```

## Dependencies

Commit Reviewer uses the following dependencies:

- @langchain/community
- @langchain/core
- commander
- cowsay
- ignore
- langchain
- simple-git

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the terms of the MIT license.
