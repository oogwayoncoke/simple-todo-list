Simple Todo List (PERN Stack)
📝A modern, full-stack task management application built with the PERN stack. This project features a clean UI styled with Tailwind CSS, a robust Express backend, and persistent storage using PostgreSQL.

🚀 FeaturesFull CRUD: Create, Read, Update, and Delete todos.Persistent Storage: All tasks are stored in a PostgreSQL database.Modern Styling: Responsive and sleek design using Tailwind CSS.RESTful API: Clean separation between the React frontend and Node/Express backend.

🛠️ Tech StackFrontend: React, Tailwind CSS, AxiosBackend: Node.js, ExpressDatabase: PostgreSQLTooling: Nodemon (Development)

📦 Getting Started1. PrerequisitesNode.js installedPostgreSQL installed and running2. Clone the RepositoryBashgit clone https://github.com/oogwayoncoke/simple-todo-list.git
cd simple-todo-list 3. Database SetupCreate a database in PostgreSQL and a table for your todos:SQLCREATE DATABASE perntodo;

CREATE TABLE todo(
todo_id SERIAL PRIMARY KEY,
description VARCHAR(255)
); 4. Backend ConfigurationNavigate to your server directory (e.g., /server), install dependencies, and set up your environment variables or db.js file with your PostgreSQL credentials.Bashcd server
npm install
npm start # or 'nodemon index.js' 5. Frontend ConfigurationIn a new terminal, navigate to the client directory, install dependencies, and start the React app.Bashcd client
npm install
npm start

🚦 API EndpointsMethodEndpointDescription
POST/todosCreate a new todo
GET/todosGet all todos
GET/todos/:idGet a specific todo
PUT/todos/:idUpdate a todo
DELETE/todos/:idDelete a todo
