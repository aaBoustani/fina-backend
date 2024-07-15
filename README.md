# FINA Backend

## Usage
### Env file
Save the following file in the root directory of the project under the name `.env`.

```
UPLOAD_FOLDER_PATH=[defaults to data/uploads]

OPENAI_API_KEY=

DATABASE_URL=postgresql://[user].[project-ID]:[password]@aws-0-eu-central-1.pooler.supabase.com:6543/[db-name]
```

### Run
1. Run `npm install`
2. Run `npm run dev` to run it in dev mode (with Nodemon watcher). Otherwise, run `npm run start`.
