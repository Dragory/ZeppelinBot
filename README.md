![Zeppelin Banner](assets/zepbanner.png)

# Zeppelin

Zeppelin is a moderation bot for Discord, designed with large servers and reliability in mind.

**Main features include:**

- Extensive automoderator features (automod)
  - Word filters, spam detection, etc.
- Detailed moderator action tracking and notes (cases)
- Customizable server logs
- Tags/custom commands
- Reaction roles
- Tons of utility commands, including a granular member search
- Full configuration via a web dashboard
  - Override specific settings and permissions on e.g. a per-user, per-channel, or per-permission-level basis
- Bot-managed slowmodes
  - Automatically switches between native slowmodes (for 6h or less) and bot-enforced (for longer slowmodes)
- Starboard
- And more!

See <https://zeppelin.gg/> for more details.

## Development

These instructions are intended for bot development only, they are not safe to follow for self-hosting.

👉 **No support is guaranteed for self-hosting the bot!** 👈

### Running the backend

1. Go into the backend directory: `cd backend`

2. Install dependencies: `npm ci`

3. Make a copy of `bot.env.example` and `api.env.example` (removing the `.example` suffix), fill in the values.
  There are defaults for your convenience, feel free to replace these.

4. Setup the database schema, use `npm run migrate-dev`.

5. Run `npm run build` followed by the desired start script:
    - **Recommended** is to use `npm run watch`, this starts both the bot and api server and automatically restarts on save.
    - `npm run start-bot-dev` to start the bot.
    - `start-api-dev` to start the api server.

6. On the first run you need to add your guild to the `allowed_guilds` table, otherwise the bot leaves on next restart.
  Use the following queries (replacing the all-caps variables):

```sql
INSERT INTO allowed_guilds (id, name, icon, owner_id) VALUES ("SERVER_ID", "SERVER_NAME", null, "OWNER_ID");
```

```sql
INSERT INTO configs (id, `key`, config, is_active, edited_by)
VALUES (1, "global", "{\"prefix\": \"!\", \"owners\": [\"YOUR_ID\"]}", true, "YOUR_ID");

INSERT INTO configs (id, `key`, config, is_active, edited_by)
VALUES (2, "guild-GUILD_ID", "{\"prefix\": \"!\", \"levels\": {\"YOUR_ID\": 100}, \"plugins\": { \"utility\": {}}}", true, "YOUR_ID");
```

### Running the dashboard

1. Go into the dashboard directory: `cd dashboard`

2. Install dependencies for the dashboard: `npm ci`

3. Make a copy of `.env.example` called `.env`, fill in the values.

4. Run the desired start script:
    - `npm run build` compiles the dashboard's static files to `dist/` which can then be served with any web server
    - `npm run watch` runs webpack's dev server that automatically reloads on save

### Notes

- Since we now use shared paths in `tsconfig.json`, the compiled files in `backend/dist/` have longer paths, e.g.
  `backend/dist/backend/src/index.js` instead of `backend/dist/index.js`. This is because the compiled shared files
  are placed in `backend/dist/shared`.

- The `backend/register-tsconfig-paths.js` module takes care of registering shared paths from `tsconfig.json` for
  `ava` and compiled `.js` files

- To run the tests for the files in the `shared/` directory, you also need to run `npm ci` there

### Config format example

Configuration is stored in the database in the `configs` table.

```yml
# role id: level
levels:
  "12345678": 100 # Example admin
  "98765432": 50 # Example mod

plugins:
  mod_plugin:
    config:
      kick_message: 'You have been kicked'
      can_kick: false
    overrides:
      - level: '>=50'
        config:
          can_kick: true
      - level: '>=100'
        config:
          kick_message: 'You have been kicked by an admin'

  other_plugin:
    config:
      categories:
        mycategory:
          opt: "something"
        othercategory:
          enabled: false
          opt: "hello"
    overrides:
      - level: '>=50'
        config:
          categories:
            mycategory:
              enabled: false
      - channel: '1234'
        config:
          categories:
            othercategory:
              enabled: true
```
