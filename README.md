# Time Bank Project

This is a time bank application where users can exchange time for services. It allows users to propose, accept, or reject activities, and track the status of various activities between users. This project manages activities with specific details, such as the duration, description, and participants.

## Features
- **Activity Management**: Users can propose activities, accept or reject activities, and track their status.
- **Time Exchange**: Time is the currency for services in the time bank, and users can track how much time they have "spent" or "earned."
- **User Interaction**: Activities involve a giver and a receiver.

## Prerequisites

Before getting started, ensure you have the following software installed:

1. **Node.js**:
   - The latest LTS version (v14 or higher) is recommended. You can download it from the official [Node.js website](https://nodejs.org/).
   - To check if Node.js is installed, run:
     ```bash
     node -v
     ```

2. **MongoDB** (optional, for database storage):
   - If you plan to use MongoDB for storing activities and user data, make sure it's installed and running on your local machine or use a cloud service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
   - To check if MongoDB is installed, run:
     ```bash
     mongo --version
     ```


## Installing Dependencies

Once you have the prerequisites installed, follow these steps to set up the project:

1. **Clone the Repository**:

    First, clone the project from GitHub:
     ```bash
     git clone https://github.com/ahuva12/Time-Bank.git
     ```

2. **Navigate into the Project Directory**:

   Change your directory to the project folder:
     ```bash
     cd Time-Bank
     ```

3. **Install Project Dependencies**:
   
   Install the required Node.js dependencies using npm:
     ```bash
     npm install
     ```

4. **Set Up Environment Variables**:
   - Create a `.env.local` file in the root of the project and configure your environment variables (e.g., MongoDB URI):
     ```env
     MONGODB_URI=<your connection string>
     ```
   - If you have permission to access the database replace the URI with your connection string.

After completing these steps, your environment will be set up and you're ready to run the project locally.



## Getting Started

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

You can see the website [here](https://time-bank.vercel.app/).
