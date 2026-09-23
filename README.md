# AI Capsule
For CSE3CWA Assessment Three
22408026 | Luca Thompson

### Deployment
The project is deployed to render as a web service
Available [here.](https//cse3cwa-assignment3.onrender.com/)

### Installation
Clone repo and install dependancies
```bash
git clone https://github.com/luca-thompson/cse3cwa_assignment3.git
```
now in two separate terminals
```bash
cd backend
npm install
```
```bash
cd client
npm install
```

### Build and Run
Build
```bash
cd client
npm run build
```
Run (from root)
```bash
cd backend
npm start
```

### Routes and Communication

| Route | Method | Access | Purpose |
|---|---|---|---|
| `/api/health` | GET | Public | Returns `{ "status": "ok" }` |
| `/auth/github` | GET | Public | Starts GitHub OAuth login |
| `/auth/github/callback` | GET | Public | OAuth callback, exchanges code, then issues jwt |
| `/api/capsules` | GET | Protected | Reads the user's records |
| `/api/capsules` | POST | Protected | Creates a new record |
| `/api/capsules/:id` | PUT | Protected | Updates an existing record |
| `/api/capsules/:id` | DELETE | Protected | Deletes a record |

The frontend uses basic `fetch()` commands, with the `credentials: 'include'` flag set. This means that (because theyre coming frm the same origin) the cookie is passed along with the fetch request. This is then verified to authenticate and perform operations.

### Oauth and JWT issuing

Github is used to authenticate and create a JWT.
A user is asked to authenticate using the Github Oauth flow, then sent back to the callback page of the project; this page using the github api to read the user_id and then creates a jwt using that read id (and a secret). This jwt is then set as the value for a cookie titled `token`.
On all CRUD requests the requireAuth middleware is used to check if the token is present, and if present if it is indeed genuine. This is done throught the `jwt.sign()` function.

### Environment Variables

| Name | Purpose |
|---|---|
| `PORT` | Port for Express to listen to |
| `JWT_SECRET` | jwt signing/verfication key |
| `GITHUB_CLIENT_ID` | GitHub OAuth App client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App client secret |
| `GITHUB_SCOPE` | OAuth scope |
| `GITHUB_CALLBACK_URL` | Registered OAuth callback URL

### Database

This project uses a better-sqlite3 based `CREATE TABLE IF NOT EXISTS` to create the database on every startup. Unfortunately due to platform constraints the 'disk' that this db is stored on is wiped every deployment. User 'ownership' of each capsule is simply performed by a locked field on each db entry: 'user_id'. This is used as 'authentication" for entries.

### cURL commands

Command One
```bash
curl -i https://cse3cwa-assignment3.onrender.com/api/capsules
```
Response
```
{"error":"No JWT found, 401 Unauthorized"}
```

Command Two
```bash
curl -i -H "Cookie: token=fake-token-123" https://cse3cwa-assignment3.onrender.com/api/capsules
```
Response
```
{"error":"JWT signature not valid, 401 Unauthorized"}
```

### Limitation
There are a few; UI could use time and animations, Storage needs to be extracted out into something non-ephemeral, and the startup time for the service when it hasnt been used in some time is annoyingly long.

### AI Usage
The only AI tool used was Claude by Anthropic.
AI constantly made naming errors and had issues with out of date ways of using APIs, I had to correct api usage for github as it was using an old defunct method/version.
Ai was used extensively for architechting and explaining the various parts of the jwt/oauth systems as I was inexperienced with them.
I verified Oauth, JWT and protected API behaviour through a significant amount of (basically just) console.log commands at every stage of the flow. The same goes for CRUD ownership, I also manually inserted a second user in testing to ensure only that user's data was shown/editable.
I chose to break up the frontend into components for the dashboard, to use render environment variables instead of .env secret file and to break auth routing into its own file, instead of living a monolithic auth in backend root.
