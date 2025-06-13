# Prompt Manager

A modern React application for managing AI prompts with PostgreSQL database, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 📝 **Create & Manage Prompts**: Add, edit, and delete prompts with ease
- 🔍 **Search & Filter**: Search by title, content, or tags, filter by category
- 🏷️ **Tags & Categories**: Organize prompts with tags and categories
- 📋 **Copy to Clipboard**: Quick copy functionality for prompt content
- 💾 **PostgreSQL Database**: Persistent storage with Prisma ORM
- 🎨 **Modern UI**: Beautiful interface built with Tailwind CSS
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

Before running this application, make sure you have:

- Node.js 18+ installed
- PostgreSQL database running
- npm or yarn package manager

## Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd prompt-manager
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure PostgreSQL Database**

   Update the `DATABASE_URL` in your `.env` file:

   ```bash
   DATABASE_URL="postgresql://username:password@localhost:5432/prompt_manager?schema=public"
   ```

   Replace `username`, `password`, and database details with your PostgreSQL configuration.

4. **Run database migrations**

   ```bash
   npx prisma db push
   ```

   This will create the necessary tables in your PostgreSQL database.

5. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

## Running the Application

1. **Start the development server**

   ```bash
   npm run dev
   ```

2. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses a single `Prompt` model with the following fields:

- `id` - Unique identifier (CUID)
- `title` - Prompt title (required)
- `content` - Prompt content (required)
- `description` - Optional description
- `tags` - Array of tags
- `category` - Optional category
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## API Endpoints

The application provides the following REST API endpoints:

- `GET /api/prompts` - Get all prompts
- `POST /api/prompts` - Create a new prompt
- `GET /api/prompts/[id]` - Get a specific prompt
- `PUT /api/prompts/[id]` - Update a prompt
- `DELETE /api/prompts/[id]` - Delete a prompt

## Usage

### Creating a Prompt

1. Click the "New Prompt" button
2. Fill in the title and content (required)
3. Optionally add description, tags, and category
4. Click "Create" to save

### Managing Prompts

- **Edit**: Click the pencil icon on any prompt card
- **Delete**: Click the trash icon (confirmation required)
- **Copy**: Click the clipboard icon to copy content
- **Search**: Use the search bar to find prompts
- **Filter**: Select a category from the dropdown

### Tags

- Type tags and press Enter or comma to add them
- Click the × button on any tag to remove it
- Tags are searchable

## Technology Stack

- **Frontend**: React 18, Next.js 14, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Icons**: Heroicons

## Development

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Database Management

Useful Prisma commands:

```bash
# View your data in Prisma Studio
npx prisma studio

# Reset the database
npx prisma db push --force-reset

# Generate Prisma client after schema changes
npx prisma generate
```

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Check your `DATABASE_URL` in `.env`
- Verify database credentials

### Build Issues

- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Next.js cache: `rm -rf .next`

## License

This project is open source and available under the [MIT License](LICENSE).
